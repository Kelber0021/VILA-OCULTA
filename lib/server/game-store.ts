import { createHash, randomBytes, randomInt, randomUUID } from "node:crypto";
import { AVATAR_IDS, ROOM_PACES, type AvatarId, type ChatMessage, type NarrationEvent, type Phase, type Role, type RoomAction, type RoomView, type Winner } from "../game-types";

const GAME_ERROR = Symbol.for("vila-oculta.game-error");
export class GameError extends Error {
  readonly [GAME_ERROR] = true;
  constructor(message: string, public status = 400) { super(message); this.name = "GameError"; }
}
/** Route bundles can share the process store without sharing a class constructor. */
export function isGameError(error: unknown): error is GameError {
  return typeof error === "object" && error !== null && Reflect.get(error, GAME_ERROR) === true
    && typeof Reflect.get(error, "message") === "string"
    && [400, 401, 403, 404, 409, 413, 415, 429, 503].includes(Reflect.get(error, "status"));
}
const HOUR = 60 * 60 * 1000;
const DURATIONS = {
  quick: { night: 25_000, discussion: 35_000, voting: 20_000, results: 8_000 },
  classic: { night: 35_000, discussion: 45_000, voting: 30_000, results: 8_000 },
  relaxed: { night: 60_000, discussion: 90_000, voting: 45_000, results: 8_000 },
};
interface Player {
  id: string; name: string; avatarId: AvatarId; ready: boolean; alive: boolean;
  role: Role | null;
  investigation: RoomView["self"]["investigation"];
}
interface Room {
  settings: RoomView["settings"];
  code: string; hostId: string; players: Player[]; phase: Phase; round: number;
  phaseEndsAt: number | null; winner: Winner | null; createdAt: number; touchedAt: number;
  narration: NarrationEvent[]; nightActions: Map<string, string>; votes: Map<string, string | null>;
  messages: ChatMessage[];
}
interface Session { roomCode: string; playerId: string; expiresAt: number }
const tokenKey = (token: string) => createHash("sha256").update(token).digest("hex");
export const newSessionToken = () => randomBytes(32).toString("hex");

function check(condition: unknown, message: string, status = 400): asserts condition {
  if (!condition) throw new GameError(message, status);
}
function profile(input: Record<string, unknown>) {
  check(typeof input.name === "string", "Informe seu nome.");
  const name = input.name.normalize("NFKC").trim().replace(/\s+/gu, " ");
  check(name.length >= 2 && name.length <= 24 && /^[\p{L}\p{N} ._'’-]+$/u.test(name), "Use um nome de 2 a 24 letras, números ou espaços.");
  check(typeof input.avatarId === "string" && AVATAR_IDS.includes(input.avatarId as AvatarId), "Escolha um retrato disponível.");
  return { name, avatarId: input.avatarId as AvatarId };
}
export function normalizeCode(value: unknown) {
  check(typeof value === "string" && /^[A-Z2-9]{6}$/.test(value.toUpperCase().trim()), "Código de sala inválido.");
  return value.toUpperCase().trim();
}

/** One Node process only. Every mutation executes synchronously; clients never own match state. */
export class GameStore {
  private rooms = new Map<string, Room>();
  private sessions = new Map<string, Session>();
  private budgets = new Map<string, { count: number; until: number }>();
  constructor(private now: () => number = Date.now) {}

  private cleanup() {
    const now = this.now();
    for (const [code, room] of this.rooms) {
      // Rooms created before this feature survive development hot reloads.
      room.settings ??= { pace: "classic", maxPlayers: 8 };
      if (now - room.touchedAt > 2 * HOUR || now - room.createdAt > 12 * HOUR) this.rooms.delete(code);
    }
    for (const [key, session] of this.sessions) {
      if (session.expiresAt <= now || !this.rooms.has(session.roomCode)) this.sessions.delete(key);
    }
    for (const [key, bucket] of this.budgets) if (bucket.until <= now) this.budgets.delete(key);
  }

  rateLimit(token: string | null, write: boolean) {
    this.cleanup();
    const keys: Array<[string, number]> = [["global", 6000], [token ? `session:${tokenKey(token)}` : "anonymous", token ? 240 : 120]];
    if (write) keys.push([token ? `writes:${tokenKey(token)}` : "anonymous-writes", token ? 45 : 40]);
    for (const [key, max] of keys) {
      const bucket = this.budgets.get(key) ?? { count: 0, until: this.now() + 60_000 };
      check(bucket.count < max, "Muitas tentativas. Aguarde um minuto.", 429);
      check(this.budgets.has(key) || this.budgets.size < 4096, "Servidor ocupado. Tente novamente em um minuto.", 503);
      bucket.count++;
      this.budgets.set(key, bucket);
    }
  }

  create(token: string, input: Record<string, unknown>): RoomView {
    this.cleanup();
    const data = profile(input);
    check(!this.sessions.has(tokenKey(token)), "Você já está em uma sala. Saia dela antes de criar outra.", 409);
    check(this.rooms.size < 128 && this.sessions.size < 1024, "Todas as mesas estão ocupadas. Tente em alguns minutos.", 503);
    let code: string;
    const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    do { code = Array.from({ length: 6 }, () => alphabet[randomInt(alphabet.length)]).join(""); } while (this.rooms.has(code));
    const player: Player = { id: randomUUID(), ...data, ready: false, alive: true, role: null, investigation: null };
    const room: Room = { settings: { pace: "classic", maxPlayers: 8 }, code, hostId: player.id, players: [player], phase: "lobby", round: 0, phaseEndsAt: null, winner: null,
      createdAt: this.now(), touchedAt: this.now(), narration: [], messages: [], nightActions: new Map(), votes: new Map() };
    this.narrate(room, "Uma nova mesa foi aberta. Reúna de 4 a 8 pessoas e prepare-se para a noite.");
    this.rooms.set(code, room);
    this.sessions.set(tokenKey(token), { roomCode: code, playerId: player.id, expiresAt: this.now() + 12 * HOUR });
    return this.view(room, player);
  }

  join(token: string, input: Record<string, unknown>): RoomView {
    this.cleanup();
    const data = profile(input);
    const code = normalizeCode(input.code);
    check(!this.sessions.has(tokenKey(token)), "Você já está em uma sala. Saia dela antes de entrar em outra.", 409);
    const room = this.rooms.get(code);
    check(room, "Sala não encontrada ou expirada.", 404);
    check(room.phase === "lobby", "Esta partida já começou.", 409);
    check(room.players.length < room.settings.maxPlayers, "A sala está cheia.", 409);
    check(this.sessions.size < 1024, "Servidor ocupado. Tente novamente mais tarde.", 503);
    check(!room.players.some(p => p.name.toLocaleLowerCase("pt-BR") === data.name.toLocaleLowerCase("pt-BR")), "Este nome já está na sala. Escolha outro.", 409);
    const player: Player = { id: randomUUID(), ...data, ready: false, alive: true, role: null, investigation: null };
    room.players.push(player);
    room.touchedAt = this.now();
    this.sessions.set(tokenKey(token), { roomCode: code, playerId: player.id, expiresAt: this.now() + 12 * HOUR });
    this.narrate(room, `${player.name} chegou à vila.`);
    return this.view(room, player);
  }

  current(token: string | null): RoomView | null {
    this.cleanup();
    if (!token || !this.sessions.has(tokenKey(token))) return null;
    const { room, player } = this.member(token);
    this.advance(room);
    room.touchedAt = this.now();
    return this.view(room, player);
  }

  read(token: string | null, code: string): RoomView {
    const { room, player } = this.member(token, normalizeCode(code));
    this.advance(room);
    room.touchedAt = this.now();
    return this.view(room, player);
  }

  private member(token: string | null, code?: string) {
    this.cleanup();
    const session = token ? this.sessions.get(tokenKey(token)) : undefined;
    check(session, "Sua sessão expirou. Entre novamente na sala.", 401);
    check(!code || session.roomCode === code, "Você não participa desta sala.", 403);
    const room = this.rooms.get(session.roomCode);
    const player = room?.players.find(p => p.id === session.playerId);
    check(room && player, "Sala não encontrada ou expirada.", 404);
    return { room, player };
  }

  action(token: string | null, code: string, action: RoomAction): RoomView | null {
    const { room, player } = this.member(token, normalizeCode(code));
    this.advance(room);
    room.touchedAt = this.now();
    if (action.type === "configure") {
      check(room.hostId === player.id, "Somente o anfitrião pode configurar a sala.", 403);
      check(room.phase === "lobby", "As configurações só podem mudar antes da partida.", 409);
      check(ROOM_PACES.includes(action.pace), "Escolha um ritmo disponível.");
      check(Number.isInteger(action.maxPlayers) && action.maxPlayers >= 4 && action.maxPlayers <= 8,
        "A capacidade deve ser um número inteiro entre 4 e 8.");
      check(action.maxPlayers >= room.players.length, "A capacidade não pode ser menor que o grupo presente.", 409);
      if (room.settings.pace !== action.pace || room.settings.maxPlayers !== action.maxPlayers) {
        room.settings = { pace: action.pace, maxPlayers: action.maxPlayers };
        room.players.forEach(participant => { participant.ready = false; });
        const label = { quick: "rápido", classic: "clássico", relaxed: "tranquilo" }[action.pace];
        this.narrate(room, `O anfitrião mudou a mesa: ritmo ${label}, até ${action.maxPlayers} pessoas. Confirmem novamente que estão prontos.`);
      }
      return this.view(room, player);
    }
    if (action.type === "rematch") {
      check(room.hostId === player.id, "Somente o anfitrião pode preparar outra partida.", 403);
      check(room.phase === "finished", "A partida atual ainda não terminou.", 409);
      const activeIds = new Set([...this.sessions.values()].filter(s => s.roomCode === room.code).map(s => s.playerId));
      room.players = room.players.filter(p => activeIds.has(p.id));
      for (const participant of room.players) {
        participant.ready = false;
        participant.alive = true;
        participant.role = null;
        participant.investigation = null;
      }
      room.phase = "lobby";
      room.round = 0;
      room.winner = null;
      room.phaseEndsAt = null;
      room.nightActions.clear();
      room.votes.clear();
      room.messages = [];
      room.narration = [];
      this.narrate(room, "Uma nova história vai começar. Confirmem que estão prontos; os papéis serão sorteados novamente ao iniciar.");
      return this.view(room, player);
    }
    if (action.type === "leave") {
      this.sessions.delete(tokenKey(token!));
      if (room.phase === "lobby" || room.phase === "finished") room.players = room.players.filter(p => p.id !== player.id);
      else {
        player.alive = false;
        room.nightActions.delete(player.id);
        room.votes.delete(player.id);
        this.narrate(room, `${player.name} deixou a partida e está fora desta rodada.`);
        this.checkWinner(room);
      }
      const activeIds = new Set([...this.sessions.values()].filter(s => s.roomCode === room.code).map(s => s.playerId));
      if (!activeIds.size) this.rooms.delete(room.code);
      else if (room.hostId === player.id) room.hostId = room.players.find(p => activeIds.has(p.id))!.id;
      return null;
    }
    if (action.type === "chat") {
      check(room.phase === "lobby" || room.phase === "finished" || (room.phase === "discussion" && player.alive), "A conversa está fechada nesta fase.", 409);
      check(typeof action.text === "string", "Mensagem inválida.");
      const message = action.text.normalize("NFKC").trim().replace(/\s+/gu, " ");
      check(message.length > 0 && message.length <= 240 && !/[\u0000-\u001F\u007F-\u009F\u200B-\u200F\u202A-\u202E\u2060-\u206F]/u.test(message), "Escreva uma mensagem de até 240 caracteres.");
      const key = `chat:${tokenKey(token!)}`;
      const budget = this.budgets.get(key) ?? { count: 0, until: this.now() + 60_000 };
      check(budget.count < 12, "Aguarde um pouco antes de enviar outra mensagem.", 429);
      check(this.budgets.has(key) || this.budgets.size < 4096, "Servidor ocupado. Aguarde um minuto.", 503);
      budget.count++; this.budgets.set(key, budget);
      room.messages.push({ id: randomUUID(), playerId: player.id, playerName: player.name, text: message, at: this.now() });
      if (room.messages.length > 50) room.messages.shift();
    } else if (action.type === "ready" || action.type === "avatar") {
      check(room.phase === "lobby", "A preparação já terminou.", 409);
      if (action.type === "ready") { check(typeof action.ready === "boolean", "Confirmação inválida."); player.ready = action.ready; }
      else { check(AVATAR_IDS.includes(action.avatarId), "Retrato inválido."); player.avatarId = action.avatarId; }
    } else if (action.type === "start") {
      check(room.hostId === player.id, "Somente quem criou a sala pode iniciar.", 403);
      check(room.phase === "lobby", "Esta partida já começou.", 409);
      check(room.players.length >= 4 && room.players.every(p => p.ready), "Reúna ao menos 4 pessoas e aguarde todos ficarem prontos.", 409);
      const roles: Role[] = ["assassin", "sheriff", "angel", ...Array<Role>(room.players.length - 3).fill("citizen")];
      for (let i = roles.length - 1; i > 0; i--) { const j = randomInt(i + 1); [roles[i], roles[j]] = [roles[j], roles[i]]; }
      room.players.forEach((p, i) => { p.role = roles[i]; });
      this.narrate(room, "Os papéis foram sorteados em segredo. Seu retrato não determina seu papel.");
      this.beginNight(room);
    } else if (action.type === "night") {
      check(room.phase === "night" && player.alive && player.role !== "citizen", "Você não pode agir nesta fase.", 409);
      check(!room.nightActions.has(player.id), "Sua ação já foi enviada.", 409);
      const target = room.players.find(p => p.id === action.targetId && p.alive);
      check(target && (target.id !== player.id || player.role === "angel"), "Escolha um alvo vivo permitido.");
      room.nightActions.set(player.id, target.id);
      if (room.players.filter(p => p.alive && p.role !== "citizen").every(p => room.nightActions.has(p.id))) this.resolveNight(room);
    } else if (action.type === "vote") {
      check(room.phase === "voting" && player.alive, "Você não pode votar nesta fase.", 409);
      check(!room.votes.has(player.id), "Seu voto já foi enviado.", 409);
      check(action.targetId === null || room.players.some(p => p.id === action.targetId && p.alive && p.id !== player.id), "Escolha outra pessoa viva ou abstenha-se.");
      room.votes.set(player.id, action.targetId);
      if (room.players.filter(p => p.alive).every(p => room.votes.has(p.id))) this.resolveVoting(room);
    } else throw new GameError("Ação desconhecida.");
    return this.view(room, player);
  }

  private narrate(room: Room, text: string) {
    room.narration.push({ id: randomUUID(), text, at: this.now() });
    if (room.narration.length > 30) room.narration.shift();
  }
  private setPhase(room: Room, phase: keyof typeof DURATIONS.classic) {
    room.phase = phase;
    room.phaseEndsAt = this.now() + DURATIONS[room.settings.pace][phase];
  }
  private beginNight(room: Room) {
    room.round++;
    room.nightActions.clear(); room.votes.clear();
    this.setPhase(room, "night");
    this.narrate(room, `Noite ${room.round}. A vila adormece. Assassino, anjo e xerife escolhem seus alvos em segredo.`);
  }
  private advance(room: Room) {
    if (room.phaseEndsAt === null || this.now() < room.phaseEndsAt) return;
    if (room.phase === "night") this.resolveNight(room);
    else if (room.phase === "discussion") {
      this.setPhase(room, "voting");
      this.narrate(room, "A discussão terminou. Vote em uma pessoa suspeita ou escolha se abster. Empate não elimina ninguém.");
    } else if (room.phase === "voting") this.resolveVoting(room);
    else if (room.phase === "results") this.beginNight(room);
  }
  private resolveNight(room: Room) {
    const alive = room.players.filter(p => p.alive);
    const assassin = alive.find(p => p.role === "assassin");
    const angel = alive.find(p => p.role === "angel");
    const sheriff = alive.find(p => p.role === "sheriff");
    const attacked = assassin ? room.nightActions.get(assassin.id) : undefined;
    const protectedId = angel ? room.nightActions.get(angel.id) : undefined;
    const investigated = sheriff ? room.nightActions.get(sheriff.id) : undefined;
    const suspect = alive.find(p => p.id === investigated);
    if (sheriff && suspect) sheriff.investigation = { targetName: suspect.name, isAssassin: suspect.role === "assassin", round: room.round };
    const victim = alive.find(p => p.id === attacked);
    if (victim && attacked !== protectedId) {
      victim.alive = false;
      this.narrate(room, `Amanheceu. ${victim.name} foi eliminado durante a noite. Seu papel permanece em segredo.`);
    } else this.narrate(room, "Amanheceu. Todos sobreviveram a esta noite.");
    if (this.checkWinner(room)) return;
    this.setPhase(room, "discussion");
    this.narrate(room, "Conversem pelo chat da mesa ou com o grupo. O xerife decide se revela sua descoberta.");
  }
  private resolveVoting(room: Room) {
    const tally = new Map<string, number>();
    for (const [voterId, targetId] of room.votes) {
      if (targetId && room.players.some(p => p.id === voterId && p.alive) && room.players.some(p => p.id === targetId && p.alive)) tally.set(targetId, (tally.get(targetId) ?? 0) + 1);
    }
    const ranked = [...tally.entries()].sort((a, b) => b[1] - a[1]);
    if (ranked.length && (ranked.length === 1 || ranked[0][1] > ranked[1][1])) {
      const victim = room.players.find(p => p.id === ranked[0][0])!;
      victim.alive = false;
      this.narrate(room, `${victim.name} recebeu ${ranked[0][1]} voto(s) e foi eliminado pela vila. Seu papel permanece em segredo.`);
    } else this.narrate(room, "A votação terminou sem uma decisão: ninguém foi eliminado.");
    if (this.checkWinner(room)) return;
    this.setPhase(room, "results");
    this.narrate(room, "A vila se recolhe. Uma nova noite começará em instantes.");
  }
  private checkWinner(room: Room) {
    if (room.phase === "lobby" || room.phase === "finished") return room.phase === "finished";
    const alive = room.players.filter(p => p.alive);
    const assassins = alive.filter(p => p.role === "assassin").length;
    if (!assassins) room.winner = "village";
    else if (assassins >= alive.length - assassins) room.winner = "assassin";
    if (!room.winner) return false;
    room.phase = "finished"; room.phaseEndsAt = null;
    this.narrate(room, room.winner === "village" ? "A vila venceu! O assassino foi eliminado. Os papéis agora podem ser revelados." : "O assassino venceu! Não restam moradores suficientes para detê-lo. Os papéis agora podem ser revelados.");
    return true;
  }
  private view(room: Room, player: Player): RoomView {
    return {
      settings: { ...room.settings }, code: room.code, phase: room.phase, round: room.round,
      players: room.players.map(p => ({ id: p.id, name: p.name, avatarId: p.avatarId, ready: p.ready, alive: p.alive,
        isHost: p.id === room.hostId, hasVoted: room.votes.has(p.id), ...(room.phase === "finished" && p.role ? { revealedRole: p.role } : {}) })),
      self: { id: player.id, role: player.role, hasActed: room.nightActions.has(player.id), voteTargetId: room.votes.get(player.id) ?? null, investigation: player.investigation ? { ...player.investigation } : null },
      narration: room.narration.map(event => ({ ...event })), messages: room.messages.map(message => ({ ...message })), phaseEndsAt: room.phaseEndsAt, serverNow: this.now(), winner: room.winner, minPlayers: 4, maxPlayers: room.settings.maxPlayers,
    };
  }
}

const globalStore = globalThis as typeof globalThis & { vilaOcultaStore?: GameStore };
// Refresh methods across route bundles/HMR while retaining existing rooms and sessions.
if (globalStore.vilaOcultaStore) Object.setPrototypeOf(globalStore.vilaOcultaStore, GameStore.prototype);
export const gameStore = globalStore.vilaOcultaStore ??= new GameStore();

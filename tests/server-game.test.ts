// @vitest-environment node
import { describe, expect, it, vi } from "vitest";
import { GameError, GameStore, isGameError, newSessionToken } from "../lib/server/game-store";

function setup(count = 4) {
  let now = 1_000_000;
  const store = new GameStore(() => now);
  const tokens = Array.from({ length: count }, newSessionToken);
  const room = store.create(tokens[0], { name: "Pessoa 1", avatarId: "ana" });
  for (let i = 1; i < count; i++) store.join(tokens[i], { code: room.code, name: `Pessoa ${i + 1}`, avatarId: "ana" });
  return { store, tokens, code: room.code, tick: (ms: number) => { now += ms; } };
}
function started(count = 4) {
  const game = setup(count);
  for (const token of game.tokens) game.store.action(token, game.code, { type: "ready", ready: true });
  game.store.action(game.tokens[0], game.code, { type: "start" });
  const people = game.tokens.map(token => ({ token, ...game.store.read(token, game.code).self }));
  return { ...game, people };
}

describe("server-authoritative rooms", () => {
  it("recognizes safe errors across independently loaded route bundles", async () => {
    vi.resetModules();
    const otherBundle = await import("../lib/server/game-store");
    const error = new otherBundle.GameError("Sessão necessária", 401);
    expect(error instanceof GameError).toBe(false);
    expect(isGameError(error)).toBe(true);
    expect(isGameError(new Error("Internal detail"))).toBe(false);
  });
  it("requires membership and never exposes another player's secret role or token", () => {
    const { store, tokens, code } = started();
    expect(() => store.read(null, code)).toThrow(GameError);
    expect(() => store.read(newSessionToken(), code)).toThrow(GameError);
    const view = store.read(tokens[0], code);
    expect(view.self.role).toBeTruthy();
    expect(view.players.every(p => !("role" in p) && !("revealedRole" in p))).toBe(true);
    expect(JSON.stringify(view)).not.toContain(tokens[0]);
    const outsider = newSessionToken();
    store.create(outsider, { name: "Outra pessoa", avatarId: "bento" });
    expect(() => store.read(outsider, code)).toThrow("Você não participa");
  });

  it("enforces room size, duplicate names, host ownership, and readiness", () => {
    const { store, tokens, code } = setup();
    expect(() => store.action(tokens[1], code, { type: "start" })).toThrow("Somente");
    expect(() => store.action(tokens[0], code, { type: "start" })).toThrow("prontos");
    expect(() => store.join(newSessionToken(), { code, name: "pessoa 1", avatarId: "ana" })).toThrow("nome já");
    for (let i = 4; i < 8; i++) store.join(newSessionToken(), { code, name: `Pessoa ${i + 1}`, avatarId: "bento" });
    expect(() => store.join(newSessionToken(), { code, name: "Pessoa 9", avatarId: "bento" })).toThrow("cheia");
  });

  it("rejects invalid profiles and permits only one room per session", () => {
    const { store, tokens } = setup();
    expect(() => store.create(tokens[0], { name: "Outro nome", avatarId: "ana" })).toThrow("já está");
    expect(() => store.create(newSessionToken(), { name: "<script>", avatarId: "ana" })).toThrow("nome");
    expect(() => store.create(newSessionToken(), { name: "Pessoa", avatarId: "assassin" })).toThrow("retrato");
  });

  it("resolves simultaneous night actions with protection and a private investigation", () => {
    const { store, people, code } = started();
    const assassin = people.find(p => p.role === "assassin")!;
    const angel = people.find(p => p.role === "angel")!;
    const sheriff = people.find(p => p.role === "sheriff")!;
    const citizen = people.find(p => p.role === "citizen")!;
    expect(() => store.action(citizen.token, code, { type: "night", targetId: assassin.id })).toThrow("não pode");
    store.action(assassin.token, code, { type: "night", targetId: citizen.id });
    expect(() => store.action(assassin.token, code, { type: "night", targetId: angel.id })).toThrow("já foi");
    store.action(angel.token, code, { type: "night", targetId: citizen.id });
    const view = store.action(sheriff.token, code, { type: "night", targetId: assassin.id })!;
    expect(view.phase).toBe("discussion");
    expect(view.players.every(p => p.alive)).toBe(true);
    expect(view.self.investigation?.isAssassin).toBe(true);
    expect(store.read(citizen.token, code).self.investigation).toBeNull();
    expect(JSON.stringify(store.read(citizen.token, code))).not.toContain("isAssassin");
  });

  it("advances on deadline, handles abstention and ties, and begins another night", () => {
    const { store, tokens, people, code, tick } = started();
    tick(35_001);
    expect(store.read(tokens[0], code).phase).toBe("discussion");
    tick(45_001);
    expect(store.read(tokens[0], code).phase).toBe("voting");
    store.action(tokens[0], code, { type: "vote", targetId: people[1].id });
    store.action(tokens[1], code, { type: "vote", targetId: people[0].id });
    store.action(tokens[2], code, { type: "vote", targetId: null });
    const view = store.action(tokens[3], code, { type: "vote", targetId: null })!;
    expect(view.phase).toBe("results");
    expect(view.players.every(p => p.alive)).toBe(true);
    tick(8_001);
    expect(store.read(tokens[0], code)).toMatchObject({ phase: "night", round: 2 });
  });

  it("ends with village victory and reveals roles only after the assassin is eliminated", () => {
    const { store, people, code, tick } = started();
    tick(35_001); store.read(people[0].token, code);
    tick(45_001); store.read(people[0].token, code);
    const assassin = people.find(p => p.role === "assassin")!;
    for (const person of people) store.action(person.token, code, { type: "vote", targetId: person.id === assassin.id ? null : assassin.id });
    const view = store.read(people[0].token, code);
    expect(view).toMatchObject({ phase: "finished", winner: "village", phaseEndsAt: null });
    expect(view.players.every(p => p.revealedRole)).toBe(true);
  });

  it("eliminates a night victim and denies dead players actions and discussion messages", () => {
    const { store, people, code, tick } = started();
    const assassin = people.find(p => p.role === "assassin")!;
    const citizen = people.find(p => p.role === "citizen")!;
    store.action(assassin.token, code, { type: "night", targetId: citizen.id });
    tick(35_001);
    const view = store.read(citizen.token, code);
    expect(view.players.find(p => p.id === citizen.id)?.alive).toBe(false);
    expect(() => store.action(citizen.token, code, { type: "chat", text: "Sou um fantasma" })).toThrow("fechada");
    tick(45_001);
    expect(() => store.action(citizen.token, code, { type: "vote", targetId: assassin.id })).toThrow("não pode");
  });

  it("ends with assassin victory when the remaining survivors reach parity", () => {
    const { store, people, code, tick } = started();
    const assassin = people.find(p => p.role === "assassin")!;
    const citizen = people.find(p => p.role === "citizen")!;
    const sheriff = people.find(p => p.role === "sheriff")!;
    store.action(assassin.token, code, { type: "night", targetId: citizen.id });
    tick(35_001); store.read(assassin.token, code);
    tick(45_001); store.read(assassin.token, code);
    for (const person of people.filter(p => p.id !== citizen.id)) {
      store.action(person.token, code, { type: "vote", targetId: person.id === sheriff.id ? null : sheriff.id });
    }
    const view = store.read(assassin.token, code);
    expect(view).toMatchObject({ phase: "finished", winner: "assassin", phaseEndsAt: null });
    expect(view.players.filter(p => p.alive)).toHaveLength(2);
    expect(view.players.every(p => p.revealedRole)).toBe(true);
  });

  it("invalidates departed sessions, reassigns the host, and expires abandoned rooms", () => {
    const { store, tokens, code, tick } = setup();
    expect(store.action(tokens[0], code, { type: "leave" })).toBeNull();
    expect(store.current(tokens[0])).toBeNull();
    const view = store.read(tokens[1], code);
    expect(view.players.find(p => p.id === view.self.id)?.isHost).toBe(true);
    tick(2 * 60 * 60 * 1000 + 1);
    expect(store.current(tokens[1])).toBeNull();
  });

  it("bounds chat and request rates", () => {
    const { store, tokens, code } = setup();
    expect(() => store.action(tokens[0], code, { type: "chat", text: "x".repeat(241) })).toThrow("240");
    for (let i = 0; i < 12; i++) store.action(tokens[0], code, { type: "chat", text: `Mensagem ${i}` });
    expect(() => store.action(tokens[0], code, { type: "chat", text: "Outra" })).toThrow("Aguarde");
    for (let i = 0; i < 45; i++) store.rateLimit(tokens[1], true);
    expect(() => store.rateLimit(tokens[1], true)).toThrow("Muitas tentativas");
  });
});

describe("rematch", () => {
  it("allows only the host after the match ends and clears every secret while preserving sessions", () => {
    const { store, people, tokens, code, tick } = started();
    expect(() => store.action(tokens[0], code, { type: "rematch" })).toThrow("ainda não terminou");
    const assassin = people.find(p => p.role === "assassin")!;
    const sheriff = people.find(p => p.role === "sheriff")!;
    store.action(sheriff.token, code, { type: "night", targetId: assassin.id });
    tick(35_001); store.read(tokens[0], code);
    store.action(tokens[0], code, { type: "chat", text: "Uma pista da história anterior" });
    tick(45_001); store.read(tokens[0], code);
    for (const person of people) store.action(person.token, code, { type: "vote", targetId: person.id === assassin.id ? null : assassin.id });
    const finished = store.read(tokens[0], code);
    expect(finished.phase).toBe("finished");
    expect(() => store.action(tokens[1], code, { type: "rematch" })).toThrow("Somente o anfitrião");
    const fresh = store.action(tokens[0], code, { type: "rematch" })!;
    expect(fresh).toMatchObject({ phase: "lobby", round: 0, winner: null, phaseEndsAt: null, messages: [] });
    expect(fresh.players.map(p => [p.id, p.avatarId])).toEqual(finished.players.map(p => [p.id, p.avatarId]));
    expect(fresh.players.every(p => p.alive && !p.ready && !p.hasVoted && !("revealedRole" in p))).toBe(true);
    expect(fresh.narration).toHaveLength(1);
    expect(fresh.narration[0].text).toContain("nova história");
    for (const token of tokens) {
      expect(store.current(token)?.self).toMatchObject({ role: null, hasActed: false, voteTargetId: null, investigation: null });
    }
    for (const token of tokens) store.action(token, code, { type: "ready", ready: true });
    expect(store.action(tokens[0], code, { type: "start" })?.phase).toBe("night");
  });
});

describe("room settings", () => {
  it("defaults to classic/8 and requires host ownership and lobby phase", () => {
    const { store, tokens, code } = setup();
    expect(store.read(tokens[0], code).settings).toEqual({ pace: "classic", maxPlayers: 8 });
    expect(() => store.action(tokens[1], code, { type: "configure", pace: "quick", maxPlayers: 4 })).toThrow("Somente o anfitrião");
    for (const token of tokens) store.action(token, code, { type: "ready", ready: true });
    store.action(tokens[0], code, { type: "start" });
    expect(() => store.action(tokens[0], code, { type: "configure", pace: "quick", maxPlayers: 4 })).toThrow("antes da partida");
  });

  it("resets everyone's consent only on changed settings and enforces capacity on join", () => {
    const { store, tokens, code } = setup();
    for (const token of tokens) store.action(token, code, { type: "ready", ready: true });
    const unchanged = store.action(tokens[0], code, { type: "configure", pace: "classic", maxPlayers: 8 })!;
    expect(unchanged.players.every(p => p.ready)).toBe(true);
    const changed = store.action(tokens[0], code, { type: "configure", pace: "quick", maxPlayers: 4 })!;
    expect(changed.settings).toEqual({ pace: "quick", maxPlayers: 4 });
    expect(changed.maxPlayers).toBe(4);
    expect(changed.players.every(p => !p.ready)).toBe(true);
    expect(() => store.action(tokens[0], code, { type: "start" })).toThrow("prontos");
    expect(() => store.join(newSessionToken(), { code, name: "Pessoa cinco", avatarId: "ana" })).toThrow("cheia");
    // Returned settings are snapshots, never a reference that mutates server rules.
    changed.settings.maxPlayers = 8;
    expect(store.read(tokens[0], code).settings.maxPlayers).toBe(4);
  });

  it("rejects invalid pace/capacity and shrinking below current occupancy without changing readiness", () => {
    const { store, tokens, code } = setup(5);
    store.action(tokens[0], code, { type: "ready", ready: true });
    for (const maxPlayers of [3, 9, 4.5, Number.NaN, Number.POSITIVE_INFINITY]) {
      expect(() => store.action(tokens[0], code, { type: "configure", pace: "quick", maxPlayers })).toThrow("inteiro");
    }
    expect(() => store.action(tokens[0], code, { type: "configure", pace: "classic", maxPlayers: 4 })).toThrow("grupo presente");
    // @ts-expect-error Intentionally invalid runtime input.
    expect(() => store.action(tokens[0], code, { type: "configure", pace: "__proto__", maxPlayers: 8 })).toThrow("ritmo");
    expect(store.read(tokens[0], code).settings).toEqual({ pace: "classic", maxPlayers: 8 });
    expect(store.read(tokens[0], code).players.find(p => p.isHost)?.ready).toBe(true);
  });

  it.each([
    ["quick", 25_000, 35_000, 20_000],
    ["classic", 35_000, 45_000, 30_000],
    ["relaxed", 60_000, 90_000, 45_000],
  ] as const)("uses %s deadlines for every phase and always eight seconds of results", (pace, night, discussion, voting) => {
    const { store, tokens, code, tick } = setup();
    store.action(tokens[0], code, { type: "configure", pace, maxPlayers: 6 });
    for (const token of tokens) store.action(token, code, { type: "ready", ready: true });
    let view = store.action(tokens[0], code, { type: "start" })!;
    for (const [phase, duration, nextPhase] of [["night", night, "discussion"], ["discussion", discussion, "voting"], ["voting", voting, "results"], ["results", 8_000, "night"]] as const) {
      expect(view.phase).toBe(phase);
      expect(view.phaseEndsAt! - view.serverNow).toBe(duration);
      tick(duration - 1);
      expect(store.read(tokens[0], code).phase).toBe(phase);
      tick(1);
      view = store.read(tokens[0], code);
      expect(view.phase).toBe(nextPhase);
    }
    expect(view.round).toBe(2);
    expect(view.phaseEndsAt! - view.serverNow).toBe(night);
  });

  it("preserves custom settings and sessions through a rematch", () => {
    const { store, tokens, code, tick } = setup();
    store.action(tokens[0], code, { type: "configure", pace: "quick", maxPlayers: 6 });
    for (const token of tokens) store.action(token, code, { type: "ready", ready: true });
    store.action(tokens[0], code, { type: "start" });
    const people = tokens.map(token => ({ token, ...store.read(token, code).self }));
    const assassin = people.find(p => p.role === "assassin")!;
    tick(25_000); store.read(tokens[0], code);
    tick(35_000); store.read(tokens[0], code);
    for (const person of people) store.action(person.token, code, { type: "vote", targetId: person.id === assassin.id ? null : assassin.id });
    const view = store.action(tokens[0], code, { type: "rematch" })!;
    expect(view).toMatchObject({ phase: "lobby", settings: { pace: "quick", maxPlayers: 6 }, maxPlayers: 6 });
    expect(tokens.every(token => store.current(token)?.code === code)).toBe(true);
  });

  it("upgrades a legacy room after module reload without discarding its session", async () => {
    const first = await import("../lib/server/game-store");
    const token = newSessionToken();
    const view = first.gameStore.create(token, { name: "Pessoa legado", avatarId: "ana" });
    // Emulate a room stored by the version that predates room settings.
    const storedRooms = Reflect.get(first.gameStore, "rooms") as Map<string, object>;
    Reflect.deleteProperty(storedRooms.get(view.code)!, "settings");
    vi.resetModules();
    const refreshed = await import("../lib/server/game-store");
    expect(refreshed.gameStore).toBe(first.gameStore);
    expect(refreshed.gameStore.current(token)?.settings).toEqual({ pace: "classic", maxPlayers: 8 });
    expect(refreshed.gameStore.action(token, view.code, { type: "configure", pace: "relaxed", maxPlayers: 5 })?.settings).toEqual({ pace: "relaxed", maxPlayers: 5 });
    refreshed.gameStore.action(token, view.code, { type: "leave" });
  });
});
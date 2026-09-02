import { AVATAR_IDS, type AvatarId, type RoomAction } from "../game-types";
import { GameError, gameStore, isGameError, newSessionToken } from "./game-store";

const COOKIE = "vila_oculta_session";
const MAX_BODY = 4096;
type Operation = "create" | "join" | "current" | "read" | "action";

function sessionToken(request: Request) {
  const item = request.headers.get("cookie")?.split(";").map(part => part.trim()).find(part => part.startsWith(`${COOKIE}=`));
  const token = item?.slice(COOKIE.length + 1);
  return token && /^[a-f0-9]{64}$/.test(token) ? token : null;
}
function assertOrigin(request: Request) {
  const hostname = new URL(request.url).hostname;
  if (process.env.NODE_ENV === "production" && !process.env.APP_ORIGIN && !["localhost", "127.0.0.1", "[::1]"].includes(hostname)) {
    throw new GameError("Configure a origem pública do servidor antes de abrir as salas.", 503);
  }
  const expected = process.env.APP_ORIGIN ? new URL(process.env.APP_ORIGIN).origin : new URL(request.url).origin;
  if (request.headers.get("origin") !== expected || request.headers.get("sec-fetch-site") === "cross-site") {
    throw new GameError("Origem da solicitação não autorizada.", 403);
  }
}
async function body(request: Request): Promise<Record<string, unknown>> {
  if (request.headers.get("content-type")?.split(";")[0].trim().toLowerCase() !== "application/json") throw new GameError("Envie os dados em JSON.", 415);
  if (Number(request.headers.get("content-length")) > MAX_BODY) throw new GameError("Solicitação muito grande.", 413);
  const reader = request.body?.getReader();
  if (!reader) throw new GameError("Dados ausentes.");
  const parts: Uint8Array[] = [];
  let size = 0;
  while (true) {
    const chunk = await reader.read();
    if (chunk.done) break;
    size += chunk.value.byteLength;
    if (size > MAX_BODY) { await reader.cancel(); throw new GameError("Solicitação muito grande.", 413); }
    parts.push(chunk.value);
  }
  let parsed: unknown;
  try { parsed = JSON.parse(Buffer.concat(parts).toString("utf8")); }
  catch { throw new GameError("JSON inválido."); }
  if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new GameError("Dados inválidos.");
  return parsed as Record<string, unknown>;
}
function onlyKeys(data: Record<string, unknown>, keys: string[]) {
  if (Object.keys(data).some(key => !keys.includes(key))) throw new GameError("A solicitação contém campos não permitidos.");
}
function actionBody(data: Record<string, unknown>): RoomAction {
  switch (data.type) {
    case "ready":
      onlyKeys(data, ["type", "ready"]);
      if (typeof data.ready === "boolean") return { type: "ready", ready: data.ready };
      break;
    case "avatar":
      onlyKeys(data, ["type", "avatarId"]);
      if (typeof data.avatarId === "string" && AVATAR_IDS.includes(data.avatarId as AvatarId)) return { type: "avatar", avatarId: data.avatarId as AvatarId };
      break;
    case "start": case "rematch": case "leave":
      onlyKeys(data, ["type"]);
      return { type: data.type };
    case "night": case "vote":
      onlyKeys(data, ["type", "targetId"]);
      if (typeof data.targetId === "string" && /^[a-f0-9-]{36}$/.test(data.targetId)) return { type: data.type, targetId: data.targetId };
      if (data.type === "vote" && data.targetId === null) return { type: "vote", targetId: null };
      break;
    case "chat":
      onlyKeys(data, ["type", "text"]);
      if (typeof data.text === "string") return { type: "chat", text: data.text };
      break;
  }
  throw new GameError("Ação inválida.");
}
function cookie(request: Request, token: string, clear = false) {
  const origin = process.env.APP_ORIGIN ?? request.url;
  const secure = process.env.NODE_ENV === "production" || new URL(origin).protocol === "https:" ? "; Secure" : "";
  return `${COOKIE}=${clear ? "" : token}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${clear ? 0 : 43200}${secure}`;
}
export async function handle(request: Request, operation: Operation, code?: string): Promise<Response> {
  const headers = new Headers({ "Cache-Control": "no-store, private", "Vary": "Cookie", "X-Content-Type-Options": "nosniff" });
  try {
    const write = operation !== "read" && operation !== "current";
    const token = sessionToken(request);
    if (write) assertOrigin(request);
    gameStore.rateLimit(token, write);
    if (operation === "current") return Response.json({ room: gameStore.current(token) }, { headers });
    if (operation === "read") return Response.json({ room: gameStore.read(token, code!) }, { headers });
    const data = await body(request);
    if (operation === "create" || operation === "join") {
      onlyKeys(data, operation === "create" ? ["name", "avatarId"] : ["name", "avatarId", "code"]);
      // Rotate unknown/expired cookies to prevent session fixation.
      const nextToken = gameStore.current(token) ? token! : newSessionToken();
      const room = operation === "create" ? gameStore.create(nextToken, data) : gameStore.join(nextToken, data);
      headers.set("Set-Cookie", cookie(request, nextToken));
      return Response.json({ room }, { status: operation === "create" ? 201 : 200, headers });
    }
    const action = actionBody(data);
    const room = gameStore.action(token, code!, action);
    if (action.type === "leave") headers.set("Set-Cookie", cookie(request, "", true));
    return Response.json({ room }, { headers });
  } catch (error) {
    if (isGameError(error)) {
      if (error.status === 429) headers.set("Retry-After", "60");
      return Response.json({ error: error.message }, { status: error.status, headers });
    }
    return Response.json({ error: "Não foi possível concluir agora. Tente novamente." }, { status: 500, headers });
  }
}

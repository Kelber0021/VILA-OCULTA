// @vitest-environment node
import { describe, expect, it } from "vitest";
import { handle } from "../lib/server/http";

const origin = "http://localhost:3000";
const request = (data: unknown, headers: Record<string, string> = {}) => new Request(`${origin}/api/rooms`, {
  method: "POST", headers: { origin, "content-type": "application/json", ...headers }, body: JSON.stringify(data),
});
describe("HTTP security boundary", () => {
  it("requires a matching Origin and JSON bodies", async () => {
    expect((await handle(request({}, { origin: "https://evil.example" }), "create")).status).toBe(403);
    expect((await handle(request({}, { "content-type": "text/plain" }), "create")).status).toBe(415);
    expect((await handle(request({ name: "x".repeat(5000) }), "create")).status).toBe(413);
  });
  it("rejects authority fields and malformed action bodies", async () => {
    expect((await handle(request({ name: "Ana", avatarId: "ana", role: "assassin" }), "create")).status).toBe(400);
    expect((await handle(request({ type: "start", playerId: "forged" }), "action", "AAAAAA")).status).toBe(400);
    expect((await handle(request({ type: "vote", targetId: 0 }), "action", "AAAAAA")).status).toBe(400);
  });
  it("sets private HttpOnly cookies, authorizes reads, and clears the cookie on leave", async () => {
    const response = await handle(request({ name: "Pessoa HTTP", avatarId: "ana" }), "create");
    expect(response.status).toBe(201);
    const setCookie = response.headers.get("set-cookie")!;
    expect(setCookie).toContain("HttpOnly");
    expect(setCookie).toContain("SameSite=Strict");
    expect(response.headers.get("cache-control")).toContain("no-store");
    const { room } = await response.json();
    const cookie = setCookie.split(";")[0];
    const authenticated = new Request(`${origin}/api/rooms/current`, { headers: { cookie } });
    expect((await (await handle(authenticated, "current")).json()).room.code).toBe(room.code);
    expect((await handle(new Request(`${origin}/api/rooms/${room.code}`), "read", room.code)).status).toBe(401);
    const leave = await handle(request({ type: "leave" }, { cookie }), "action", room.code);
    expect(leave.headers.get("set-cookie")).toContain("Max-Age=0");
    expect((await (await handle(authenticated, "current")).json()).room).toBeNull();
  });
});

describe("configure HTTP validation", () => {
  it("rejects extra fields, missing fields, invalid pace, and non-integer capacity before mutation", async () => {
    for (const data of [
      { type: "configure", pace: "quick", maxPlayers: 5, role: "assassin" },
      { type: "configure", pace: "quick" },
      { type: "configure", pace: "__proto__", maxPlayers: 8 },
      { type: "configure", pace: "classic", maxPlayers: "4" },
      { type: "configure", pace: "relaxed", maxPlayers: 4.5 },
      { type: "configure", pace: "quick", maxPlayers: 9 },
      { type: "configure", pace: "quick", maxPlayers: 3 },
    ]) {
      expect((await handle(request(data), "action", "AAAAAA")).status).toBe(400);
    }
  });

  it("accepts a valid authenticated host configuration and returns the same capacity publicly", async () => {
    const created = await handle(request({ name: "Pessoa ajustes", avatarId: "clara" }), "create");
    const cookie = created.headers.get("set-cookie")!.split(";")[0];
    const { room } = await created.json();
    const updated = await handle(request({ type: "configure", pace: "relaxed", maxPlayers: 5 }, { cookie }), "action", room.code);
    expect(updated.status).toBe(200);
    expect((await updated.json()).room).toMatchObject({ settings: { pace: "relaxed", maxPlayers: 5 }, maxPlayers: 5 });
    await handle(request({ type: "leave" }, { cookie }), "action", room.code);
  });
});
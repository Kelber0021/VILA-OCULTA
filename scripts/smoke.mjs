import assert from 'node:assert/strict';

const base = process.env.SMOKE_URL || 'http://localhost:3100';
async function request(path, body, cookie) {
  const response = await fetch(base + path, {
    method: body === undefined ? 'GET' : 'POST',
    headers: { ...(body === undefined ? {} : { 'Content-Type': 'application/json', Origin: base }), ...(cookie ? { Cookie: cookie } : {}) },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  return { status: response.status, data: await response.json(), cookie: response.headers.get('set-cookie')?.split(';')[0], headers: response.headers };
}
const clients = [];
let code;
try {
  let result = await request('/api/rooms', { name: 'Teste Ana', avatarId: 'ana' });
  assert.equal(result.status, 201, JSON.stringify(result.data));
  assert.match(result.headers.get('set-cookie'), /HttpOnly/i);
  assert.match(result.headers.get('set-cookie'), /SameSite=Strict/i);
  code = result.data.room.code;
  clients.push({ cookie: result.cookie, room: result.data.room });
  assert.equal((await request(`/api/rooms/${code}`)).status, 401);
  assert.equal((await request(`/api/rooms/${code}/action`, { type: 'start' }, clients[0].cookie)).status, 409);
  for (const [name, avatarId] of [['Teste Bento', 'bento'], ['Teste Clara', 'clara'], ['Teste Davi', 'davi']]) {
    result = await request('/api/rooms/join', { name, avatarId, code });
    assert.equal(result.status, 200, JSON.stringify(result.data));
    clients.push({ cookie: result.cookie, room: result.data.room });
  }
  const crossOrigin = await fetch(base + `/api/rooms/${code}/action`, { method: 'POST', headers: { 'Content-Type': 'application/json', Origin: 'https://untrusted.example', Cookie: clients[0].cookie }, body: JSON.stringify({ type: 'ready', ready: true }) });
  assert.equal(crossOrigin.status, 403);
  for (const client of clients) assert.equal((await request(`/api/rooms/${code}/action`, { type: 'ready', ready: true }, client.cookie)).status, 200);
  assert.equal((await request(`/api/rooms/${code}/action`, { type: 'start' }, clients[1].cookie)).status, 403);
  result = await request(`/api/rooms/${code}/action`, { type: 'start' }, clients[0].cookie);
  assert.equal(result.status, 200);
  assert.equal(result.data.room.phase, 'night');
  const roles = [];
  for (const client of clients) {
    result = await request(`/api/rooms/${code}`, undefined, client.cookie);
    client.room = result.data.room;
    roles.push(client.room.self.role);
    assert.match(result.headers.get('cache-control'), /no-store/i);
    assert.ok(client.room.players.every(p => !('role' in p) && !('revealedRole' in p)));
    assert.equal(client.room.players.length, 4);
  }
  assert.deepEqual(roles.sort(), ['angel', 'assassin', 'citizen', 'sheriff']);
  const citizen = clients.find(c => c.room.self.role === 'citizen');
  result = await request(`/api/rooms/${code}/action`, { type: 'night', targetId: clients.find(c => c !== citizen).room.self.id }, citizen.cookie);
  assert.equal(result.status, 409);
  const assassin = clients.find(c => c.room.self.role === 'assassin');
  const angel = clients.find(c => c.room.self.role === 'angel');
  const sheriff = clients.find(c => c.room.self.role === 'sheriff');
  for (const [client, targetId] of [[assassin, citizen.room.self.id], [angel, citizen.room.self.id], [sheriff, assassin.room.self.id]]) {
    result = await request(`/api/rooms/${code}/action`, { type: 'night', targetId }, client.cookie);
    assert.equal(result.status, 200);
  }
  result = await request(`/api/rooms/${code}`, undefined, sheriff.cookie);
  assert.equal(result.data.room.phase, 'discussion');
  assert.equal(result.data.room.self.investigation.isAssassin, true);
  result = await request(`/api/rooms/${code}`, undefined, citizen.cookie);
  assert.equal(result.data.room.self.investigation, null);
  assert.ok(result.data.room.players.every(p => p.alive));
  result = await request(`/api/rooms/${code}/action`, { type: 'chat', text: 'Discussão de teste.' }, citizen.cookie);
  assert.equal(result.status, 200, JSON.stringify(result.data));
  const waitMs = Math.max(0, result.data.room.phaseEndsAt - result.data.room.serverNow) + 100;
  console.log('Discussão sincronizada; aguardando a votação automática...');
  await new Promise(resolve => setTimeout(resolve, waitMs));
  result = await request(`/api/rooms/${code}`, undefined, citizen.cookie);
  assert.equal(result.data.room.phase, 'voting');
  for (const client of clients) {
    result = await request(`/api/rooms/${code}/action`, { type: 'vote', targetId: client === assassin ? null : assassin.room.self.id }, client.cookie);
    assert.equal(result.status, 200);
  }
  assert.equal(result.data.room.phase, 'finished');
  assert.equal(result.data.room.winner, 'village');
  assert.ok(result.data.room.players.every(p => p.revealedRole));
  console.log('PASS: partida HTTP completa com quatro sessões, sigilo, proteção, investigação, chat, transição automática, votos e vitória.');
} finally {
  if (code) for (const client of clients) await request(`/api/rooms/${code}/action`, { type: 'leave' }, client.cookie).catch(() => {});
}

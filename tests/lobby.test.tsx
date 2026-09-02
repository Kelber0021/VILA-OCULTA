import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, describe, expect, test, vi } from 'vitest';
import { GameRoom } from '@/components/game-room';
import type { RoomView } from '@/lib/game-types';

const fixture = (): RoomView => ({
  settings: { pace: 'classic', maxPlayers: 8 }, code: 'NEVOA7', phase: 'lobby', round: 0,
  players: [{ id: 'me', name: 'Marina', avatarId: 'ana', ready: false, alive: true, isHost: true, hasVoted: false }],
  self: { id: 'me', role: null, hasActed: false, voteTargetId: null, investigation: null },
  narration: [{ id: 'event', text: 'Uma nova mesa foi aberta.', at: 1000 }], messages: [],
  phaseEndsAt: null, serverNow: 1000, winner: null, minPlayers: 4, maxPlayers: 8,
});
const response = (room: RoomView | null) => Promise.resolve({ ok: true, json: async () => ({ room }) });
afterEach(() => vi.unstubAllGlobals());
describe('sala conectada', () => {
  test('sem sessão oferece entrada em vez de jogadores fictícios', async () => {
    vi.stubGlobal('fetch', vi.fn(() => response(null)));
    render(<GameRoom />);
    expect(await screen.findByRole('link', { name: /criar uma sala/i })).toHaveAttribute('href', '/entrar?modo=criar');
    expect(screen.queryByText('NEVOA7')).not.toBeInTheDocument();
  });
  test('confirma prontidão no servidor e mantém início bloqueado sem quatro pessoas', async () => {
    const user = userEvent.setup();
    const room = fixture();
    const readyRoom = { ...room, players: room.players.map(p => ({ ...p, ready: true })) };
    const fetcher = vi.fn().mockImplementationOnce(() => response(room)).mockImplementation(() => response(readyRoom));
    vi.stubGlobal('fetch', fetcher);
    render(<GameRoom />);
    const ready = await screen.findByRole('button', { name: 'Estou pronto' });
    expect(screen.getByRole('button', { name: /iniciar partida/i })).toBeDisabled();
    await user.click(ready);
    expect(await screen.findByRole('button', { name: /estou pronto.*cancelar/i })).toBeInTheDocument();
    expect(fetcher).toHaveBeenCalledWith('/api/rooms/NEVOA7/action', expect.objectContaining({ method: 'POST', body: JSON.stringify({ type: 'ready', ready: true }) }));
  });
  test('mantém o papel recolhido até o jogador decidir vê-lo', async () => {
    const user = userEvent.setup();
    const room = fixture(); room.phase = 'night'; room.round = 1; room.self.role = 'citizen';
    vi.stubGlobal('fetch', vi.fn(() => response(room)));
    render(<GameRoom />);
    const reveal = await screen.findByRole('button', { name: 'Ver meu papel' });
    expect(screen.queryByRole('heading', { name: 'Cidadão' })).not.toBeInTheDocument();
    await user.click(reveal);
    expect(screen.getByRole('heading', { name: 'Cidadão' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Confirmar ação' })).not.toBeInTheDocument();
  });
  test('falha de rede aparece com opção de reconectar', async () => {
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('Conexão interrompida.')));
    render(<GameRoom />);
    expect(await screen.findByRole('button', { name: 'Tentar novamente' })).toBeInTheDocument();
    expect(screen.getByText('Conexão interrompida.')).toBeInTheDocument();
  });
});

test('caderno permanece privado ao trocar de aba e não envia anotações', async () => {
  const user = userEvent.setup();
  const room = fixture(); room.phase = 'night'; room.round = 1; room.self.role = 'citizen';
  room.players.push({ id: 'other', name: 'Bento', avatarId: 'bento', ready: true, alive: true, isHost: false, hasVoted: false });
  const fetcher = vi.fn(() => response(room)); vi.stubGlobal('fetch', fetcher);
  render(<GameRoom />);
  await user.click(await screen.findByRole('tab', { name: 'Caderno' }));
  await user.type(screen.getByLabelText('Suas pistas e versões'), 'Uma pista privada');
  await user.click(screen.getByRole('button', { name: /Bento.*Marcar suspeita/ }));
  await user.click(screen.getByRole('tab', { name: 'A partida' }));
  await user.click(screen.getByRole('tab', { name: 'Caderno' }));
  expect(screen.getByLabelText('Suas pistas e versões')).toHaveValue('Uma pista privada');
  expect(screen.getByRole('button', { name: /Bento.*Suspeito/ })).toHaveAttribute('aria-pressed', 'true');
  expect(fetcher.mock.calls.every(call => !JSON.stringify(call).includes('Uma pista privada'))).toBe(true);
});

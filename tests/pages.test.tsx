import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, test } from 'vitest';
import HomePage from '@/app/page';
import HowToPlayPage from '@/app/como-jogar/page';
import CharactersPage from '@/app/personagens/page';

describe('telas da Vila Oculta', () => {
  test('oferece criar e entrar em salas reais', () => {
    render(<HomePage />);
    expect(screen.getByRole('link', { name: /criar uma sala/i })).toHaveAttribute('href', '/entrar?modo=criar');
    expect(screen.getByRole('link', { name: /entrar em uma sala/i })).toHaveAttribute('href', '/entrar');
    expect(screen.queryByText(/prévia interativa|dados fictícios/i)).not.toBeInTheDocument();
  });
  test('regras mostram uma etapa por vez e permitem avançar', async () => {
    const user = userEvent.setup();
    render(<HowToPlayPage />);
    expect(screen.getAllByRole('tabpanel')).toHaveLength(1);
    expect(screen.getAllByRole('tab')).toHaveLength(4);
    await user.click(screen.getByRole('button', { name: /próximo passo/i }));
    expect(screen.getByRole('tab', { name: /receba seu papel/i })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tabpanel')).toHaveTextContent(/missão, secreta/i);
  });
  test('a escolha cosmética segue para a entrada sem atribuir papel secreto', async () => {
    const user = userEvent.setup();
    render(<CharactersPage />);
    expect(screen.getAllByRole('button', { name: /^Escolher / })).toHaveLength(6);
    await user.click(screen.getByRole('button', { name: 'Escolher Clara' }));
    expect(screen.getByRole('button', { name: 'Escolher Clara' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('link', { name: /jogar com este retrato/i })).toHaveAttribute('href', '/entrar?personagem=clara');
    expect(screen.getByText(/papel secreto será sorteado/i)).toBeInTheDocument();
  });
});

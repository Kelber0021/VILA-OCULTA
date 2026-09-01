import { render, screen } from "@testing-library/react";
import { describe, expect, test } from "vitest";
import HomePage from "@/app/page";
import HowToPlayPage from "@/app/como-jogar/page";
import CharactersPage from "@/app/personagens/page";

describe("rotas informativas", () => {
  test("a tela inicial oferece os dois caminhos principais e explica o ciclo", () => {
    render(<HomePage />);

    expect(screen.getByRole("heading", { level: 1, name: /cidade dorme/i })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /criar uma sala/i })).toHaveAttribute("href", "/lobby");
    expect(screen.getByRole("link", { name: /entrar em uma sala/i })).toHaveAttribute("href", "/entrar");
    expect(screen.getByRole("heading", { name: "Noite" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Discussão" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Votação" })).toBeInTheDocument();
  });

  test("como jogar apresenta as sete etapas na ordem correta", () => {
    render(<HowToPlayPage />);

    const steps = screen.getAllByRole("listitem").map((item) => item.textContent);
    expect(steps).toHaveLength(7);
    expect(steps[0]).toMatch(/receba seu personagem/i);
    expect(steps[6]).toMatch(/eliminação ou vitória/i);
  });

  test("personagens descreve somente os quatro papéis iniciais", () => {
    render(<CharactersPage />);

    const cards = screen.getAllByRole("article");
    expect(cards).toHaveLength(4);
    expect(screen.getByRole("heading", { name: "Cidadão" })).toBeInTheDocument();
    expect(screen.getByText(/observa, discute e vota/i)).toBeInTheDocument();
    expect(screen.getByText(/é assassino.*não é assassino/i)).toBeInTheDocument();
    expect(screen.getByText(/protege um jogador durante a noite/i)).toBeInTheDocument();
  });
});

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test } from "vitest";
import { GameDemo } from "@/components/game-demo";

describe("demonstração solo", () => {
  test("ensina uma rodada por teclado, revela o resultado e permite recomeçar", async () => {
    const user = userEvent.setup();
    render(<GameDemo />);

    expect(screen.getByText("Sem sala ou outros jogadores")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /confirmar investigação/i })).toBeDisabled();
    screen.getByRole("button", { name: "Investigar Bento" }).focus();
    await user.keyboard("{Enter}");
    await user.click(screen.getByRole("button", { name: /confirmar investigação/i }));
    expect(screen.getByRole("status")).toHaveTextContent("Bento é o assassino");

    await user.click(screen.getByRole("button", { name: /ver o amanhecer/i }));
    expect(screen.getByText(/Vi Bento pela janela/i)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /ir para a votação/i }));
    expect(screen.getByRole("button", { name: /confirmar voto/i })).toBeDisabled();
    screen.getByRole("button", { name: "Votar em Bento" }).focus();
    await user.keyboard(" ");
    await user.click(screen.getByRole("button", { name: /confirmar voto/i }));

    expect(screen.getByRole("heading", { name: "Você encontrou o assassino." })).toHaveFocus();
    expect(screen.getByRole("status")).toHaveTextContent("A vila venceu");
    expect(screen.getByRole("link", { name: /criar uma sala real/i })).toHaveAttribute("href", "/entrar?modo=criar");

    await user.click(screen.getByRole("button", { name: "Reiniciar demonstração" }));
    expect(screen.queryByRole("status")).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: /confirmar investigação/i })).toBeDisabled();
  });

  test("explica uma acusação errada sem inventar uma vitória na partida real", async () => {
    const user = userEvent.setup();
    render(<GameDemo />);

    await user.click(screen.getByRole("button", { name: "Investigar Clara" }));
    await user.click(screen.getByRole("button", { name: /confirmar investigação/i }));
    expect(screen.getByRole("status")).toHaveTextContent("Clara não é o assassino");
    await user.click(screen.getByRole("button", { name: /ver o amanhecer/i }));
    await user.click(screen.getByRole("button", { name: /ir para a votação/i }));
    await user.click(screen.getByRole("button", { name: "Votar em Clara" }));
    await user.click(screen.getByRole("button", { name: /confirmar voto/i }));

    expect(screen.getByRole("heading", { name: "Uma acusação precipitada." })).toBeInTheDocument();
    expect(screen.getByRole("status")).toHaveTextContent("Clara era cidadã. Bento era o assassino.");
    expect(screen.getByRole("status")).toHaveTextContent("a história continuaria");
  });
});

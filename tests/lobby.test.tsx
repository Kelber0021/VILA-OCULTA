import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test } from "vitest";
import { LobbyPreview } from "@/components/lobby-preview";

describe("lobby demonstrativo", () => {
  test("alterna a prontidão local sem sugerir sincronização real", async () => {
    const user = userEvent.setup();
    render(<LobbyPreview />);

    expect(screen.getByText(/prévia interativa/i)).toBeInTheDocument();
    expect(screen.getByText(/dados fictícios.*neste navegador/i)).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: /estou pronto/i }));

    expect(screen.getByRole("button", { name: /cancelar prontidão/i })).toBeInTheDocument();
    expect(screen.getByText("Pronto", { selector: "[role='status']" })).toBeInTheDocument();
  });

  test("copia o código fictício e confirma a ação", async () => {
    const user = userEvent.setup();
    const originalClipboard = navigator.clipboard;
    let copied = "";
    Object.defineProperty(navigator, "clipboard", {
      configurable: true,
      value: { writeText: async (value: string) => { copied = value; } },
    });

    render(<LobbyPreview />);
    await user.click(screen.getByRole("button", { name: /copiar código/i }));

    expect(copied).toBe("NEVOA7");
    expect(screen.getByRole("status")).toHaveTextContent(/código copiado/i);
    Object.defineProperty(navigator, "clipboard", { configurable: true, value: originalClipboard });
  });

  test("mantém o início desabilitado e informa que a voz não está disponível", () => {
    render(<LobbyPreview />);

    expect(screen.getByRole("button", { name: /iniciar partida/i })).toBeDisabled();
    expect(screen.getByText(/voz integrada indisponível/i)).toBeInTheDocument();
    expect(screen.getByText(/faltam 3 jogadores/i)).toBeInTheDocument();
  });
});

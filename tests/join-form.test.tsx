import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, test } from "vitest";
import { JoinForm } from "@/components/join-form";

describe("formulário de entrada", () => {
  test("normaliza o código para maiúsculas enquanto a pessoa digita", async () => {
    const user = userEvent.setup();
    render(<JoinForm onJoin={() => undefined} />);

    await user.type(screen.getByLabelText(/código da sala/i), "nevoa7");

    expect(screen.getByLabelText(/código da sala/i)).toHaveValue("NEVOA7");
  });

  test("explica os campos inválidos em uma região acessível", async () => {
    const user = userEvent.setup();
    render(<JoinForm onJoin={() => undefined} />);

    await user.click(screen.getByRole("button", { name: /entrar na sala/i }));

    expect(screen.getByRole("alert")).toHaveTextContent(/informe seu nome/i);
    expect(screen.getByRole("alert")).toHaveTextContent(/seis letras ou números/i);
  });

  test("entrega os dados normalizados quando o formulário é válido", async () => {
    const user = userEvent.setup();
    let joined: { name: string; code: string } | undefined;
    render(<JoinForm onJoin={(data) => { joined = data; }} />);

    await user.type(screen.getByLabelText(/nome do jogador/i), "  Marina  ");
    await user.type(screen.getByLabelText(/código da sala/i), "nevoa7");
    await user.click(screen.getByRole("button", { name: /entrar na sala/i }));

    expect(joined).toEqual({ name: "Marina", code: "NEVOA7" });
  });
});

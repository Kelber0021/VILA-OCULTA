"use client";

import type { FormEvent } from "react";
import { useState } from "react";

type JoinData = { name: string; code: string };
type JoinFormProps = { onJoin: (data: JoinData) => void };

export function JoinForm({ onJoin }: JoinFormProps) {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [errors, setErrors] = useState<string[]>([]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const cleanName = name.trim();
    const cleanCode = code.toUpperCase();
    const nextErrors: string[] = [];
    if (!cleanName) nextErrors.push("Informe seu nome.");
    if (!/^[A-Z0-9]{6}$/.test(cleanCode)) nextErrors.push("O código deve ter seis letras ou números.");
    setErrors(nextErrors);
    if (nextErrors.length === 0) onJoin({ name: cleanName, code: cleanCode });
  }

  return (
    <form className="join-form" noValidate onSubmit={handleSubmit}>
      <div className="field">
        <label htmlFor="player-name">Nome do jogador</label>
        <input id="player-name" name="player-name" value={name} onChange={(event) => setName(event.target.value)} autoComplete="nickname" maxLength={40} aria-invalid={errors.some((error) => error.includes("nome"))} />
        <span>É assim que você aparecerá nesta demonstração.</span>
      </div>
      <div className="field">
        <label htmlFor="room-code">Código da sala</label>
        <input id="room-code" name="room-code" value={code} onChange={(event) => setCode(event.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 6))} autoComplete="off" autoCapitalize="characters" spellCheck={false} inputMode="text" placeholder="NEVOA7" aria-invalid={errors.some((error) => error.includes("código"))} />
        <span>Use as seis letras ou números enviados por quem criou a sala.</span>
      </div>
      {errors.length > 0 && <div className="form-errors" role="alert" aria-live="assertive">{errors.map((error) => <p key={error}>{error}</p>)}</div>}
      <button className="button button-primary button-full" type="submit">Entrar na sala</button>
      <p className="preview-note"><span>Prévia interativa</span> Este formulário abre um lobby demonstrativo; nenhuma conexão real é criada.</p>
    </form>
  );
}

"use client";
import type { FormEvent } from "react";
import { useState } from "react";
import { PortraitPicker } from "./portraits";
type JoinData = { name: string; code: string };
type JoinFormProps = { onJoin: (data: JoinData) => void; initialCode?: string; mode?: "create" | "join"; avatarId?: string; onAvatarChange?: (id: string) => void; pending?: boolean; error?: string };
export function JoinForm({ onJoin, initialCode = "", mode = "join", avatarId = "ana", onAvatarChange, pending = false, error = "" }: JoinFormProps) {
  const [name, setName] = useState("");
  const [code, setCode] = useState(() => initialCode.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 6));
  const [errors, setErrors] = useState<string[]>([]);
  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return;
    const cleanName = name.trim();
    const cleanCode = code.trim().toUpperCase();
    const nextErrors: string[] = [];
    if (!cleanName) nextErrors.push("Informe seu nome.");
    else if (cleanName.length < 2) nextErrors.push("Seu nome precisa ter pelo menos 2 caracteres.");
    if (mode === "join" && !/^[A-Z0-9]{6}$/.test(cleanCode)) nextErrors.push("O código deve ter seis letras ou números.");
    setErrors(nextErrors);
    if (!nextErrors.length) onJoin({ name: cleanName, code: cleanCode });
  }
  return <form className="join-form" noValidate onSubmit={handleSubmit}>
    <div className="field"><label htmlFor="player-name">Nome do jogador</label><input id="player-name" name="player-name" placeholder="Como a vila vai chamar você?" value={name} onChange={event => setName(event.target.value)} autoComplete="nickname" maxLength={24} disabled={pending} aria-invalid={errors.some(e => e.includes("nome"))} /></div>
    {mode === "join" && <div className="field"><label htmlFor="room-code">Código da sala</label><input className="code-input" id="room-code" name="room-code" value={code} onChange={event => setCode(event.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 6))} autoComplete="off" autoCapitalize="characters" spellCheck={false} placeholder="6 CARACTERES" disabled={pending} aria-invalid={errors.some(e => e.includes("código"))} /></div>}
    {onAvatarChange && <div className="field"><span className="field-label">Seu rosto na vila <small>Apenas aparência</small></span><PortraitPicker compact value={avatarId} onChange={onAvatarChange} disabled={pending} /></div>}
    {(errors.length > 0 || error) && <div className="form-errors" role="alert">{errors.map(e => <p key={e}>{e}</p>)}{error && <p>{error}</p>}</div>}
    <button className="button button-primary button-full" type="submit" disabled={pending}>{pending ? "Abrindo os portões…" : mode === "create" ? "Criar uma sala" : "Entrar na sala"}<span aria-hidden="true">↗</span></button>
    <p className="form-note">{mode === "create" ? "Sala privada para 4–8 pessoas. Compartilhe o código para convidar." : "Peça o código a quem criou a sala. Cada pessoa usa seu navegador."}</p>
  </form>;
}

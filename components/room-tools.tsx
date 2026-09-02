"use client";
import { useState, type FormEvent } from "react";
import type { RoomView, RoomPace, RoomAction, Phase } from "@/lib/game-types";
import { Portrait } from "./portraits";
export const paceNames: Record<RoomPace, string> = { quick: "Ágil", classic: "Clássico", relaxed: "Tranquilo" };
export function RoomSettingsPanel({ room, disabled, act }: { room: RoomView; disabled: boolean; act: (action: RoomAction) => Promise<boolean> }) {
  const [pace, setPace] = useState<RoomPace>(room.settings?.pace ?? "classic");
  const [capacity, setCapacity] = useState(room.maxPlayers);
  const host = room.players.find(p => p.id === room.self.id)?.isHost;
  async function submit(event: FormEvent) { event.preventDefault(); await act({ type: "configure", pace, maxPlayers: capacity }); }
  return <div className="settings-panel"><p className="eyebrow">CADA GRUPO TEM SEU TEMPO</p><h2>O ritmo da história</h2><p className="muted">Escolha quanto tempo a vila terá para pensar e conversar.</p><form onSubmit={submit}>
    <fieldset disabled={disabled || !host || room.phase !== "lobby"}><legend>Ritmo da partida</legend><div className="pace-options">{([{ id: "quick", note: "25s noite · 35s conversa · 20s voto", icon: "ϟ" }, { id: "classic", note: "35s noite · 45s conversa · 30s voto", icon: "◇" }, { id: "relaxed", note: "60s noite · 90s conversa · 45s voto", icon: "☾" }] as const).map(p => <label key={p.id} className={pace === p.id ? "selected" : ""}><input type="radio" name="pace" value={p.id} checked={pace === p.id} onChange={() => setPace(p.id)} /><span aria-hidden="true">{p.icon}</span><strong>{paceNames[p.id]}</strong><small>{p.note}</small></label>)}</div><label className="capacity-label" htmlFor="room-capacity">Lugares na vila <select id="room-capacity" value={capacity} onChange={e => setCapacity(Number(e.target.value))}>{[4, 5, 6, 7, 8].map(n => <option key={n} value={n} disabled={n < room.players.length}>{n} pessoas</option>)}</select></label></fieldset>
    {host && room.phase === "lobby" ? <><button className="button button-primary" disabled={disabled || (pace === room.settings?.pace && capacity === room.maxPlayers)}>Salvar opções</button><p className="form-note">Ao mudar as opções, todos precisam confirmar que estão prontos novamente.</p></> : <p className="form-note">O anfitrião define as opções antes de começar.</p>}
  </form></div>;
}
export type NotebookValue = { text: string; suspects: string[] };
export function Notebook({ room, value, onChange }: { room: RoomView; value: NotebookValue; onChange: (value: NotebookValue) => void }) {
  return <div className="notebook-panel"><p className="eyebrow">SÓ PARA OS SEUS OLHOS</p><h2>Caderno de suspeitas</h2><p className="muted">Organize suas ideias. Estas anotações ficam apenas nesta tela e desaparecem ao recarregar ou sair.</p><div className="suspect-grid">{room.players.filter(p => p.id !== room.self.id).map(p => <button key={p.id} aria-pressed={value.suspects.includes(p.id)} onClick={() => onChange({ ...value, suspects: value.suspects.includes(p.id) ? value.suspects.filter(id => id !== p.id) : [...value.suspects, p.id] })}><Portrait id={p.avatarId} /><strong>{p.name}</strong><small>{value.suspects.includes(p.id) ? "◇ Suspeito" : "Marcar suspeita"}</small></button>)}</div><label htmlFor="private-notes">Suas pistas e versões</label><textarea id="private-notes" value={value.text} onChange={e => onChange({ ...value, text: e.target.value })} maxLength={800} rows={5} placeholder="Quem mudou de versão? O que você descobriu?" /><div className="notebook-footer"><span>{value.text.length}/800 · Não enviado à sala</span><button className="text-button" onClick={() => onChange({ text: "", suspects: [] })}>Limpar anotações</button></div></div>;
}
export function PhaseRail({ phase }: { phase: Phase }) {
  const phases = [{ id: "night", label: "Noite", icon: "☾" }, { id: "discussion", label: "Conversa", icon: "☼" }, { id: "voting", label: "Voto", icon: "◇" }, { id: "results", label: "Desfecho", icon: "✦" }];
  return <ol className="phase-rail" aria-label="Etapas da rodada">{phases.map(p => <li key={p.id} aria-current={phase === p.id ? "step" : undefined}><span aria-hidden="true">{p.icon}</span>{p.label}</li>)}</ol>;
}

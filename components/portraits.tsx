"use client";
import Image from "next/image";
export const portraits = [
  { id: "ana", name: "Ana", detail: "Um olhar atento." },
  { id: "bento", name: "Bento", detail: "Poucas palavras." },
  { id: "clara", name: "Clara", detail: "Um sorriso indecifrável." },
  { id: "davi", name: "Davi", detail: "Sempre por perto." },
  { id: "elisa", name: "Elisa", detail: "Memórias da vila." },
  { id: "joaquim", name: "Joaquim", detail: "Histórias para contar." },
] as const;
export function Portrait({ id, name = "", className = "" }: { id: string; name?: string; className?: string }) {
  const validId = portraits.some(p => p.id === id) ? id : "ana";
  return <span className={`portrait-image ${className}`}><Image src={`/assets/characters/${validId}.png`} alt={name} fill sizes="(max-width: 640px) 33vw, 200px" /></span>;
}
export function PortraitPicker({ value, onChange, compact = false, disabled = false }: { value: string; onChange: (id: string) => void; compact?: boolean; disabled?: boolean }) {
  return <div className={`portrait-picker ${compact ? "compact" : ""}`} role="group" aria-label="Escolher foto do personagem">
    {portraits.map(p => <button type="button" key={p.id} className={`portrait-option ${value === p.id ? "selected" : ""}`} onClick={() => onChange(p.id)} aria-pressed={value === p.id} aria-label={`Escolher ${p.name}`} disabled={disabled}><Portrait id={p.id} /><span className="portrait-label">{p.name}</span>{value === p.id && <span className="portrait-check" aria-hidden="true">✓</span>}</button>)}
  </div>;
}

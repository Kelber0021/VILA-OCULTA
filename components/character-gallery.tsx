"use client";
import { useState } from "react";
import Link from "next/link";
import { Portrait, portraits } from "./portraits";
export function CharacterGallery() {
  const [selected, setSelected] = useState<string>("ana");
  const character = portraits.find(p => p.id === selected)!;
  return <section className="page-shell gallery-page">
    <header className="page-heading"><div><p className="eyebrow">ROSTOS CONHECIDOS. INTENÇÕES OCULTAS.</p><h1>Quem será você <em>esta noite?</em></h1></div><p>Escolha seu retrato. Seu papel secreto será sorteado quando a partida começar.</p></header>
    <div className="character-grid" role="group" aria-label="Retratos disponíveis">{portraits.map((p, index) => <button className={`character-card ${selected === p.id ? "selected" : ""}`} type="button" key={p.id} onClick={() => setSelected(p.id)} aria-pressed={selected === p.id} aria-label={`Escolher ${p.name}`}><Portrait id={p.id} name={`Retrato de ${p.name}`} /><span className="character-index">0{index + 1}</span><span className="character-caption"><strong>{p.name}</strong><small>{p.detail}</small></span><span className="character-select">{selected === p.id ? "✓ ESCOLHIDO" : "ESCOLHER"}</span></button>)}</div>
    <div className="selection-bar"><div><span className="tiny-star">✦</span><p><strong>{character.name}, um rosto para a sua história.</strong><span>A aparência não revela habilidades nem define seu time.</span></p></div><Link className="button button-primary" href={`/entrar?personagem=${selected}`}>Jogar com este retrato <span aria-hidden="true">↗</span></Link></div>
  </section>;
}

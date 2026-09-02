"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Portrait } from "./portraits";
export function HomeExperience() {
  const [day, setDay] = useState(false);
  return <section className={`home-stage enhanced-home ${day ? "daylight" : ""}`}>
    <Image className="scene-background" src={day ? "/assets/backgrounds/praca-amanhecer.png" : "/assets/backgrounds/vila-noturna.png"} alt={day ? "A praça da vila ao amanhecer" : "Uma vila colonial entre montanhas, iluminada por lanternas sob a lua"} fill priority sizes="100vw" />
    <div className="scene-shade" /><div className="ambient-lights" aria-hidden="true"><i /><i /><i /><i /></div>
    <div className="hero-copy"><p className="eyebrow"><span className="tiny-star">✦</span> UM JOGO DE DEDUÇÃO SOCIAL</p><h1>A vila adormece.<br /><em>A desconfiança, não.</em></h1><p className="hero-description">Uma vila. Seis rostos. Nenhuma certeza.<br />Descubra quem guarda o último segredo.</p><div className="button-row"><Link className="button button-primary" href="/entrar?modo=criar">Criar uma sala <span aria-hidden="true">↗</span></Link><Link className="button button-secondary" href="/entrar">Entrar em uma sala</Link></div><div className="hero-details"><span><i className="status-dot" />4–8 amigos</span><span>Sem cadastro</span><span>Um navegador por pessoa</span></div><Link className="demo-entry" href="/demonstracao"><span aria-hidden="true">▷</span> Primeira vez? Experimente uma rodada guiada <span aria-hidden="true">→</span></Link></div>
    <div className="village-preview"><div className="preview-label"><span>CAPÍTULO I</span><span>✦ SERRA DA NÉVOA</span></div><div className="preview-portraits" aria-hidden="true"><Portrait id="bento" /><Portrait id="ana" /><Portrait id="clara" /></div><p>Todos têm um rosto.<br /><em>Alguém tem um segredo.</em></p><Link href="/personagens">Conheça os moradores ↗</Link></div>
    <div className="scene-switch" role="group" aria-label="Cenário da vila"><button aria-pressed={!day} onClick={() => setDay(false)}>☾ Noite</button><button aria-pressed={day} onClick={() => setDay(true)}>☼ Amanhecer</button></div>
    <div className="home-bottom"><div className="home-bottom-intro"><span className="eyebrow">A CADA RODADA</span><p>Três momentos.<br />Uma verdade.</p></div><div className="cycle-item"><span className="cycle-number">01</span><div><h2>A noite</h2><p>Decida em segredo.</p></div><span className="cycle-icon">☾</span></div><div className="cycle-item"><span className="cycle-number">02</span><div><h2>A suspeita</h2><p>Confronte as versões.</p></div><span className="cycle-icon">☼</span></div><div className="cycle-item"><span className="cycle-number">03</span><div><h2>A escolha</h2><p>Vote. Mude o destino.</p></div><span className="cycle-icon">◇</span></div></div>
  </section>;
}

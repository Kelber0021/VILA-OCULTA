import Image from "next/image";
import Link from "next/link";

export default function HomePage() {
  return <section className="home-stage">
    <Image className="scene-background" src="/assets/backgrounds/vila-noturna.png" alt="Uma vila colonial entre montanhas, iluminada por lanternas sob a lua" fill priority sizes="100vw" />
    <div className="scene-shade" />
    <div className="hero-copy">
      <p className="eyebrow"><span className="tiny-star">✦</span> UM JOGO DE DEDUÇÃO SOCIAL</p>
      <h1>A vila adormece.<br /><em>A desconfiança, não.</em></h1>
      <p className="hero-description">Entre ruas de pedra e janelas acesas, todos têm um rosto. Alguns têm um segredo.</p>
      <div className="button-row"><Link className="button button-primary" href="/entrar?modo=criar">Criar uma sala <span aria-hidden="true">↗</span></Link><Link className="button button-secondary" href="/entrar">Entrar em uma sala</Link></div>
      <div className="hero-details"><span><i className="status-dot" />4–8 amigos</span><span>Um navegador por pessoa</span><span>Narração automática</span></div>
    </div>
    <div className="scene-caption"><span className="caption-rule" /><span>SERRA DA NÉVOA<br /><small>Onde ninguém conhece toda a história.</small></span></div>
    <div className="home-bottom">
      <div className="home-bottom-intro"><span className="eyebrow">A CADA RODADA</span><p>O silêncio também<br />conta uma história.</p></div>
      <div className="cycle-item"><span className="cycle-number">01</span><div><h2>A noite</h2><p>Ações secretas. Olhos fechados.</p></div><span className="cycle-icon">☾</span></div>
      <div className="cycle-item"><span className="cycle-number">02</span><div><h2>A suspeita</h2><p>A vila acorda. As versões mudam.</p></div><span className="cycle-icon">☼</span></div>
      <div className="cycle-item"><span className="cycle-number">03</span><div><h2>A escolha</h2><p>Um voto pode mudar tudo.</p></div><span className="cycle-icon">◇</span></div>
    </div>
  </section>;
}

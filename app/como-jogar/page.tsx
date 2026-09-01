import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Como jogar" };

const steps = [
  ["Receba seu personagem", "Conheça em segredo seu papel e objetivo."],
  ["A cidade dorme", "Todos fecham os olhos enquanto a noite começa."],
  ["Ações noturnas", "Os personagens chamados realizam suas ações em segredo."],
  ["Amanhecer", "A cidade descobre o resultado da noite."],
  ["Discussão", "Compartilhe suspeitas, versões e pistas com o grupo."],
  ["Votação", "Cada pessoa escolhe quem acredita que deve sair."],
  ["Eliminação ou vitória", "A rodada termina com uma eliminação ou quando um lado vence."],
] as const;

export default function HowToPlayPage() {
  return (
    <section className="inner-page section-shell">
      <header className="page-intro">
        <p className="eyebrow">O ritual da cidade</p>
        <h1>Como jogar</h1>
        <p>Sete passos. Uma noite. Muitas versões da mesma história.</p>
      </header>
      <ol className="steps">
        {steps.map(([title, description], index) => (
          <li key={title}>
            <span className="step-number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
            <div><h2>{title}</h2><p>{description}</p></div>
          </li>
        ))}
      </ol>
      <div className="page-cta">
        <p>Entendeu o ritmo da cidade?</p>
        <Link className="button button-primary" href="/entrar">Entrar em uma sala</Link>
      </div>
    </section>
  );
}

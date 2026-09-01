import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "Página não encontrada" };

export default function NotFound() {
  return (
    <section className="inner-page section-shell">
      <header className="page-intro">
        <p className="eyebrow">Rua sem saída</p>
        <h1>Página não encontrada</h1>
        <p>Essa esquina da vila não existe — ou a névoa a escondeu.</p>
      </header>
      <div className="page-cta">
        <p>Volte para onde a noite começa.</p>
        <Link className="button button-primary" href="/">Voltar ao início</Link>
      </div>
    </section>
  );
}

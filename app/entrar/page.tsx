import type { Metadata } from "next";
import { JoinPageClient } from "@/components/join-page-client";

export const metadata: Metadata = { title: "Entrar em uma sala" };

export default function JoinPage() {
  return (
    <section className="inner-page join-page section-shell">
      <div className="join-copy">
        <p className="eyebrow">Uma porta na neblina</p>
        <h1>Entrar em uma sala</h1>
        <p>Escolha como quer ser chamado e digite o código de seis caracteres.</p>
        <blockquote>“Na cidade, até o silêncio escolhe um lado.”</blockquote>
      </div>
      <JoinPageClient />
    </section>
  );
}

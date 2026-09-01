import type { Metadata } from "next";

export const metadata: Metadata = { title: "Personagens" };

const characters = [
  { name: "Cidadão", faction: "Cidade", symbol: "◯", summary: "Observa, discute e vota.", detail: "Seu poder está na leitura das histórias e na força do voto." },
  { name: "Assassino", faction: "Sombra", symbol: "◇", summary: "Age à noite e tenta não ser descoberto.", detail: "Esconde sua identidade enquanto conduz a cidade ao erro." },
  { name: "Xerife", faction: "Cidade", symbol: "✦", summary: "Investiga um suspeito sozinho.", detail: "Recebe apenas “É Assassino” ou “Não é Assassino”." },
  { name: "Anjo", faction: "Cidade", symbol: "⌁", summary: "Protege um jogador durante a noite.", detail: "Escolhe quem ficará sob sua proteção até o amanhecer." },
] as const;

export default function CharactersPage() {
  return (
    <section className="inner-page section-shell">
      <header className="page-intro">
        <p className="eyebrow">Quatro destinos</p>
        <h1>Personagens</h1>
        <p>Cada papel enxerga a mesma noite por um ângulo diferente.</p>
      </header>
      <div className="character-grid">
        {characters.map((character) => (
          <article className={`character-card character-${character.name.toLowerCase().replace("ã", "a")}`} key={character.name}>
            <div className="character-symbol" aria-hidden="true">{character.symbol}</div>
            <p className="character-faction">{character.faction}</p>
            <h2>{character.name}</h2>
            <p className="character-summary">{character.summary}</p>
            <p>{character.detail}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

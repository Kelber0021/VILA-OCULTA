import Link from "next/link";

const acts = [
  { index: "I", title: "Noite", text: "A cidade adormece. Cada personagem observa ou realiza sua ação em segredo." },
  { index: "II", title: "Discussão", text: "Ao amanhecer, versões se cruzam. Escute, desconfie e defenda seu ponto de vista." },
  { index: "III", title: "Votação", text: "A cidade escolhe quem eliminar — ou descobre tarde demais em quem confiou." },
];

export default function HomePage() {
  return (
    <>
      <section className="hero">
        <div className="hero-fog" aria-hidden="true" />
        <div className="hero-content">
          <p className="eyebrow">Jogo brasileiro de dedução social</p>
          <h1>Cidade <em>Dorme</em></h1>
          <p className="hero-line">Quando as janelas se apagam, toda certeza vira suspeita.</p>
          <p className="hero-description">Receba um personagem, atravesse a noite e descubra em quem confiar antes que a cidade faça sua escolha.</p>
          <div className="button-row">
            <Link className="button button-primary" href="/lobby">Criar uma sala</Link>
            <Link className="button button-secondary" href="/entrar">Entrar em uma sala</Link>
          </div>
          <div className="text-links">
            <Link href="/como-jogar">Como jogar <span aria-hidden="true">→</span></Link>
            <Link href="/personagens">Personagens <span aria-hidden="true">→</span></Link>
          </div>
        </div>
        <dl className="hero-facts" aria-label="Informações da partida">
          <div><dt>Jogadores</dt><dd>6–12</dd></div>
          <div><dt>Duração</dt><dd>20–40 min</dd></div>
          <div><dt>Onde jogar</dt><dd>No navegador</dd></div>
        </dl>
      </section>

      <section className="acts section-shell" aria-labelledby="acts-title">
        <div className="section-heading">
          <p className="eyebrow">Uma cidade, três atos</p>
          <h2 id="acts-title">Toda noite deixa pistas.</h2>
          <p>O jogo alterna silêncio, conversa e decisão. A verdade depende do que cada pessoa revela — ou esconde.</p>
        </div>
        <div className="acts-track">
          {acts.map((act) => (
            <article className="act" key={act.title}>
              <span className="act-index" aria-hidden="true">{act.index}</span>
              <h3>{act.title}</h3>
              <p>{act.text}</p>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}

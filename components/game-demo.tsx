"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Portrait } from "./portraits";
import styles from "./game-demo.module.css";

type Stage = "night" | "discussion" | "voting" | "result";
type SuspectId = "bento" | "clara" | "davi";

const residents = [
  { id: "bento", name: "Bento", role: "Assassino", statement: "Passei a noite em casa. Nem cheguei perto da casa de Clara." },
  { id: "clara", name: "Clara", role: "Cidadã", statement: "Vi Bento pela janela pouco antes de as luzes se apagarem." },
  { id: "davi", name: "Davi", role: "Anjo", statement: "Protegi Clara. Alguém tentou atacá-la, mas ela está a salvo." },
] as const;

const steps: { id: Stage; label: string; symbol: string }[] = [
  { id: "night", label: "Investigue", symbol: "☾" },
  { id: "discussion", label: "Ouça", symbol: "☼" },
  { id: "voting", label: "Decida", symbol: "◇" },
  { id: "result", label: "Descubra", symbol: "✦" },
];

const scenes: Record<Stage, { title: string; subtitle: string; narration: string }> = {
  night: { title: "A primeira noite", subtitle: "Um segredo entre quatro rostos.", narration: "As janelas se apagam. Como xerife, você pode investigar uma pessoa antes do amanhecer." },
  discussion: { title: "Vozes ao amanhecer", subtitle: "Nem toda versão é verdadeira.", narration: "Clara sofreu um ataque, mas o anjo a protegeu. Ninguém foi eliminado. Agora, a vila precisa conversar." },
  voting: { title: "A escolha da vila", subtitle: "Uma pista. Uma decisão.", narration: "A conversa termina. Cada pessoa pode votar uma vez ou se abster. Depois de confirmar, a decisão é definitiva." },
  result: { title: "O segredo revelado", subtitle: "Toda escolha conta uma história.", narration: "Nesta demonstração, as identidades são fixas. Em uma sala real, os papéis são sorteados a cada partida." },
};

export function GameDemo() {
  const [stage, setStage] = useState<Stage>("night");
  const [selected, setSelected] = useState<SuspectId | null>(null);
  const [investigated, setInvestigated] = useState<SuspectId | null>(null);
  const [verdict, setVerdict] = useState<SuspectId | null>(null);
  const heading = useRef<HTMLHeadingElement>(null);
  const activeStep = steps.findIndex(step => step.id === stage);
  const investigation = residents.find(person => person.id === investigated);
  const votedResident = residents.find(person => person.id === verdict);
  const solved = verdict === "bento";

  useEffect(() => {
    heading.current?.focus({ preventScroll: true });
  }, [stage]);

  function advance(next: Stage) {
    setSelected(null);
    setStage(next);
  }

  function vote(target: SuspectId | null) {
    setVerdict(target);
    advance("result");
  }

  function restart() {
    setInvestigated(null);
    setVerdict(null);
    advance("night");
  }

  return <section className={styles.demo} aria-labelledby="demo-title">
    <header className={styles.intro}>
      <div><p className="eyebrow">EXPERIMENTE ANTES DE CONVIDAR</p><h1 id="demo-title">Uma noite. <em>Quatro suspeitas.</em></h1></div>
      <span className={styles.soloBadge}>DEMONSTRAÇÃO SOLO <span>Sem sala ou outros jogadores</span></span>
    </header>

    <ol className={styles.steps} aria-label="Etapas da demonstração">
      {steps.map((step, index) => <li className={index === activeStep ? styles.activeStep : index < activeStep ? styles.completedStep : ""} aria-current={index === activeStep ? "step" : undefined} key={step.id}><span aria-hidden="true">{index < activeStep ? "✓" : step.symbol}</span><span>{step.label}</span><small>{String(index + 1).padStart(2, "0")}</small></li>)}
    </ol>

    <div className={styles.board}>
      <aside className={styles.scene} aria-label="Cena e seu personagem">
        <Image className={styles.backdrop} src={stage === "night" ? "/assets/backgrounds/vila-noturna.png" : "/assets/backgrounds/praca-amanhecer.png"} alt="" fill priority sizes="(max-width: 720px) 100vw, 42vw" />
        <div className={styles.sceneShade} />
        <div className={styles.sceneCaption}><p className="eyebrow">UMA RODADA GUIADA</p><h2>{scenes[stage].title}</h2><p>{scenes[stage].subtitle}</p></div>
        <div className={styles.selfCard}><Portrait id="ana" className={styles.selfPortrait} /><div><span>VOCÊ NESTA HISTÓRIA</span><strong>Ana <small>· Xerife</small></strong><p>Investigue em segredo. Proteja a vila.</p></div><span className={styles.sheriffStar} aria-hidden="true">✦</span></div>
      </aside>

      <div className={styles.playArea}>
        <div className={styles.panelTop}><p className="eyebrow">{stage === "night" ? "SEU PRIMEIRO MOVIMENTO" : stage === "discussion" ? "FALAS DE EXEMPLO" : stage === "voting" ? "A HORA DA DECISÃO" : "FIM DA DEMONSTRAÇÃO"}</p><button type="button" className={styles.restart} onClick={restart} aria-label="Reiniciar demonstração">Recomeçar ↺</button></div>
        <h2 className={styles.heading} ref={heading} tabIndex={-1}>{stage === "night" ? "Quem esconde um segredo?" : stage === "discussion" ? "Cruze as versões." : stage === "voting" ? "Em quem você vota?" : solved ? "Você encontrou o assassino." : verdict ? "Uma acusação precipitada." : "Você preferiu observar."}</h2>
        <p className={styles.narration}>{scenes[stage].narration}</p>

        {(stage === "night" || stage === "voting") && <fieldset className={styles.choices}><legend className="sr-only">{stage === "night" ? "Escolha uma pessoa para investigar" : "Escolha uma pessoa para votar"}</legend>{residents.map(person => <button type="button" key={person.id} className={`${styles.suspect} ${selected === person.id ? styles.selected : ""}`} aria-label={`${stage === "night" ? "Investigar" : "Votar em"} ${person.name}`} aria-pressed={selected === person.id} disabled={stage === "night" && investigated !== null} onClick={() => setSelected(person.id)}><Portrait id={person.id} className={styles.suspectPortrait} /><span>{person.name}</span><small>{selected === person.id ? "Selecionado ✓" : "Escolher"}</small></button>)}</fieldset>}

        {investigation && stage !== "result" && <div className={styles.clue} role="status"><span aria-hidden="true">◇</span><div><strong>Seu segredo: {investigation.name} {investigation.id === "bento" ? "é o assassino." : "não é o assassino."}</strong><p>{stage === "night" ? "Na partida real, só você recebe esta pista ao amanhecer." : "A investigação é uma pista privada. Use-a para avaliar as versões."}</p></div></div>}

        {stage === "discussion" && <div className={styles.testimonies}>{residents.map(person => <article className={styles.testimony} key={person.id}><Portrait id={person.id} className={styles.smallPortrait} /><div><h3>{person.name}</h3><p>“{person.statement}”</p></div></article>)}</div>}

        {stage === "result" && <>
          <div className={`${styles.outcome} ${solved ? styles.success : ""}`} role="status"><span aria-hidden="true">{solved ? "✓" : "◇"}</span><div><strong>{solved ? "A pista levou você à pessoa certa. A vila venceu!" : verdict ? `${votedResident?.name} era ${votedResident?.role.toLowerCase()}. Bento era o assassino.` : "Sem voto, ninguém seria eliminado por você. Bento era o assassino."}</strong><p>{solved ? "Bento negou ter saído de casa, mas a versão de Clara o contradizia." : "Compare a investigação com as falas antes de decidir. Na partida real, a história continuaria enquanto nenhum lado vencesse."}</p></div></div>
          <div className={styles.revealed} aria-label="Papéis desta demonstração"><div><Portrait id="ana" className={styles.smallPortrait} /><p>Ana <span>Xerife · você</span></p></div>{residents.map(person => <div key={person.id}><Portrait id={person.id} className={styles.smallPortrait} /><p>{person.name}<span>{person.role}</span></p></div>)}</div>
        </>}

        <div className={styles.actions}>
          {stage === "night" && (investigated ? <button type="button" className="button button-primary" onClick={() => advance("discussion")}>Ver o amanhecer <span aria-hidden="true">→</span></button> : <button type="button" className="button button-primary" disabled={!selected} onClick={() => selected && setInvestigated(selected)}>Confirmar investigação <span aria-hidden="true">→</span></button>)}
          {stage === "discussion" && <button type="button" className="button button-primary" onClick={() => advance("voting")}>Ir para a votação <span aria-hidden="true">→</span></button>}
          {stage === "voting" && <><button type="button" className="button button-primary" disabled={!selected} onClick={() => selected && vote(selected)}>Confirmar voto <span aria-hidden="true">→</span></button><button type="button" className={styles.secondaryAction} onClick={() => vote(null)}>Abster-se</button></>}
          {stage === "result" && <><Link className="button button-primary" href="/entrar?modo=criar">Criar uma sala real <span aria-hidden="true">↗</span></Link><button type="button" className={styles.secondaryAction} onClick={restart}>Tentar outra escolha</button></>}
        </div>
        <p className={styles.hint}>{stage === "night" ? "Retratos são aparência. Papéis definem o que cada pessoa pode fazer." : stage === "discussion" ? "Em uma sala real, são seus amigos que conversam e defendem suas versões." : stage === "voting" ? "O voto da maioria define a eliminação. Aqui, você está apenas treinando sua escolha." : "Tutorial concluído. Reúna de 4 a 8 amigos para a história mudar de verdade."}</p>
      </div>
    </div>
    <footer className={styles.demoFooter}><span>Sem cronômetro. Aprenda no seu ritmo.</span><Link href="/como-jogar">Consultar as regras <span aria-hidden="true">↗</span></Link></footer>
  </section>;
}

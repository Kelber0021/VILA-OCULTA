"use client";

import { useState } from "react";

type PreviewPlayer = { name: string; initials: string; ready: boolean; local?: boolean };

const players: readonly PreviewPlayer[] = [
  { name: "Marina", initials: "MA", ready: true },
  { name: "Bento", initials: "BE", ready: false },
  { name: "Clara", initials: "CL", ready: true },
  { name: "Você", initials: "VO", ready: false, local: true },
];

export function LobbyPreview() {
  const [ready, setReady] = useState(false);
  const [copyMessage, setCopyMessage] = useState("");

  async function copyCode() {
    try {
      await navigator.clipboard.writeText("NEVOA7");
      setCopyMessage("Código copiado.");
    } catch {
      setCopyMessage("Não foi possível copiar. Selecione o código NEVOA7.");
    }
  }

  return (
    <div className="lobby-shell">
      <div className="preview-banner">
        <span>Prévia interativa</span>
        <p>Jogadores e configurações usam dados fictícios e estado local neste navegador.</p>
      </div>
      <div className="lobby-grid">
        <section className="lobby-main" aria-labelledby="room-title">
          <header className="room-heading">
            <div><p className="eyebrow">Sala privada</p><h1 id="room-title">À espera da cidade</h1></div>
            <div className="room-code"><span>Código</span><strong>NEVOA7</strong><button type="button" onClick={copyCode} aria-label="Copiar código">Copiar</button></div>
            <p className="sr-status" role="status" aria-live="polite">{copyMessage}</p>
          </header>
          <div className="player-heading"><h2>Na praça</h2><span>4 de 7 jogadores</span></div>
          <ul className="player-list">
            {players.map((player) => {
              const isReady = player.local ? ready : player.ready;
              return <li key={player.name} className={player.local ? "player-local" : undefined}>
                <span className="player-avatar" aria-hidden="true">{player.initials}</span>
                <span className="player-name">{player.name}{player.local && <small>Você</small>}</span>
                {player.local && isReady ? <span className="player-state ready" role="status">Pronto</span> : <span className={`player-state ${isReady ? "ready" : ""}`}>{isReady ? "Pronto" : "Aguardando"}</span>}
              </li>;
            })}
            {[1, 2, 3].map((slot) => <li className="empty-slot" key={slot}><span className="player-avatar" aria-hidden="true">+</span><span>Vaga disponível</span></li>)}
          </ul>
        </section>
        <aside className="lobby-sidebar" aria-labelledby="details-title">
          <h2 id="details-title">Detalhes da sala</h2>
          <dl className="room-details">
            <div><dt>Jogadores</dt><dd>7</dd></div>
            <div><dt>Discussão</dt><dd>3 minutos</dd></div>
            <div><dt>Visibilidade</dt><dd>Privada</dd></div>
          </dl>
          <div className="voice-state"><span aria-hidden="true">◌</span><div><strong>Voz integrada indisponível</strong><p>Esta prévia não transmite áudio.</p></div></div>
          <button className={`button button-full ${ready ? "button-secondary" : "button-primary"}`} type="button" onClick={() => setReady((value) => !value)}>{ready ? "Cancelar prontidão" : "Estou pronto"}</button>
          <button className="button button-full button-disabled" type="button" disabled>Iniciar partida</button>
          <p className="missing-players">Faltam 3 jogadores para começar.</p>
        </aside>
      </div>
    </div>
  );
}

"use client";
import { useCallback, useEffect, useRef, useState, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import type { AvatarId, Phase, Role, RoomAction, RoomView } from "@/lib/game-types";
import { Portrait, PortraitPicker } from "./portraits";
import { Notebook, PhaseRail, RoomSettingsPanel, paceNames, type NotebookValue } from "./room-tools";

const phaseNames: Record<Phase, string> = { lobby: "Reunindo a vila", night: "A vila adormece", discussion: "A vila desperta", voting: "Hora da escolha", results: "O destino da vila", finished: "O último segredo" };
const roleNames: Record<Role, string> = { citizen: "Cidadão", assassin: "Assassino", sheriff: "Xerife", angel: "Anjo" };
const roleDescriptions: Record<Role, string> = { citizen: "Observe as versões, discuta as pistas e vote para proteger a vila.", assassin: "Escolha uma pessoa para eliminar a cada noite. Sua identidade deve continuar secreta.", sheriff: "Investigue uma pessoa a cada noite. O resultado chega em segredo ao amanhecer.", angel: "Proteja uma pessoa a cada noite. Você também pode escolher proteger a si mesmo." };
type RoomTab = "scene" | "chat" | "players" | "history" | "notes" | "settings";

function Countdown({ room }: { room: RoomView }) {
  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    const start = Date.now();
    const timer = window.setInterval(() => setElapsed(Date.now() - start), 500);
    return () => clearInterval(timer);
  }, [room.serverNow]);
  if (!room.phaseEndsAt) return null;
  const seconds = Math.max(0, Math.ceil((room.phaseEndsAt - room.serverNow - elapsed) / 1000));
  return <span className={`countdown ${seconds <= 10 ? "urgent" : ""}`} aria-label={`${seconds} segundos restantes`}><span aria-hidden="true">◷</span> {seconds > 0 ? `${String(Math.floor(seconds / 60)).padStart(2, "0")}:${String(seconds % 60).padStart(2, "0")}` : "Transição…"}</span>;
}

function Roster({ room }: { room: RoomView }) {
  return <div className="roster"><div className="panel-heading"><h2>Na vila</h2><span>{room.players.length} / {room.maxPlayers}</span></div><div className="roster-list">{room.players.map(player => <div className={`player-row ${!player.alive ? "eliminated" : ""}`} key={player.id}><Portrait id={player.avatarId} /><div className="player-info"><strong>{player.name} {player.id === room.self.id && <small>você</small>}</strong><span>{player.revealedRole ? roleNames[player.revealedRole] : !player.alive ? "Fora da rodada" : player.isHost ? "Anfitrião" : "Morador"}</span></div><span className={`player-status ${player.ready || player.hasVoted ? "ready" : ""}`} aria-label={room.phase === "lobby" ? player.ready ? "Pronto" : "Preparando" : player.hasVoted ? "Votou" : player.alive ? "Vivo" : "Eliminado"}>{room.phase === "lobby" ? player.ready ? "✓" : "·" : !player.alive ? "—" : player.hasVoted ? "✓" : "·"}</span></div>)}</div><p className="roster-note">{room.phase === "lobby" ? "O jogo começa com todos prontos." : "Os papéis só são revelados ao fim da partida."}</p></div>;
}

export function GameRoom() {
  const [room, setRoom] = useState<RoomView | null>(null);
  const [loading, setLoading] = useState(true);
  const [networkError, setNetworkError] = useState("");
  const [actionError, setActionError] = useState("");
  const [pending, setPending] = useState(false);
  const [tab, setTab] = useState<RoomTab>("scene");
  const [showRole, setShowRole] = useState(false);
  const [notebook, setNotebook] = useState<{ scope: string; value: NotebookValue } | null>(null);
  const [changePortrait, setChangePortrait] = useState(false);
  const [selection, setSelection] = useState<{ phase: string; target: string } | null>(null);
  const [message, setMessage] = useState("");
  const [copied, setCopied] = useState("");
  const [confirmLeave, setConfirmLeave] = useState(false);
  const busy = useRef(false);
  const latestRequest = useRef(0);
  const chatLog = useRef<HTMLDivElement | null>(null);
  const followNewMessages = useRef(true);
  const previousTab = useRef<RoomTab>("scene");
  const latestMessageId = room?.messages.at(-1)?.id;
  const controllerRef = useRef<AbortController | null>(null);

  const refresh = useCallback(async () => {
    if (busy.current || controllerRef.current) return;
    const controller = new AbortController();
    controllerRef.current = controller;
    const timeout = window.setTimeout(() => controller.abort("timeout"), 12000);
    const request = ++latestRequest.current;
    try {
      const response = await fetch("/api/rooms/current", { cache: "no-store", signal: controller.signal });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Não foi possível atualizar a sala.");
      if (request === latestRequest.current) { setRoom(data.room); if (data.room?.phase === "lobby") { setShowRole(false); setSelection(null); setNotebook(null); } setNetworkError(""); setLoading(false); }
    } catch (cause) {
      if ((!controller.signal.aborted || controller.signal.reason === "timeout") && request === latestRequest.current) { setNetworkError(controller.signal.reason === "timeout" ? "A conexão está demorando mais que o esperado." : cause instanceof Error ? cause.message : "Conexão interrompida."); setLoading(false); }
    } finally {
      clearTimeout(timeout);
      if (controllerRef.current === controller) controllerRef.current = null;
    }
  }, []);
  useEffect(() => {
    const initial = window.setTimeout(() => void refresh(), 0);
    const timer = window.setInterval(() => { if (!document.hidden) void refresh(); }, 2000);
    const resume = () => { if (document.hidden) setShowRole(false); else void refresh(); };
    document.addEventListener("visibilitychange", resume);
    window.addEventListener("online", resume);
    return () => { clearTimeout(initial); clearInterval(timer); controllerRef.current?.abort(); document.removeEventListener("visibilitychange", resume); window.removeEventListener("online", resume); };
  }, [refresh]);

  useEffect(() => {
    const enteredChat = tab === "chat" && previousTab.current !== "chat";
    previousTab.current = tab;
    const panel = chatLog.current;
    if (panel && (enteredChat || followNewMessages.current)) {
      panel.scrollTop = panel.scrollHeight;
      followNewMessages.current = true;
    }
  }, [tab, latestMessageId]);

  async function act(action: RoomAction): Promise<boolean> {
    if (!room || busy.current || networkError) return false;
    busy.current = true; ++latestRequest.current; controllerRef.current?.abort();
    setPending(true); setActionError("");
    try {
      const response = await fetch(`/api/rooms/${room.code}/action`, { method: "POST", signal: AbortSignal.timeout(15000), headers: { "Content-Type": "application/json" }, body: JSON.stringify(action) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Não foi possível registrar sua ação.");
      setRoom(data.room);
      if (action.type === "rematch") { setShowRole(false); setSelection(null); setNotebook(null); setTab("scene"); }
      if (action.type === "leave") { setConfirmLeave(false); setShowRole(false); setNotebook(null); }
      return true;
    } catch (cause) { setActionError(cause instanceof Error ? cause.message : "A conexão falhou. Tente novamente."); return false; }
    finally { busy.current = false; setPending(false); }
  }

  async function copyCode() {
    if (!room) return;
    try { await navigator.clipboard.writeText(room.code); setCopied("Código copiado!"); }
    catch { setCopied("Selecione o código acima e copie para convidar."); }
  }
  async function copyInvite() {
    if (!room) return;
    const invitation = new URL("/entrar", window.location.origin);
    invitation.searchParams.set("sala", room.code);
    try { await navigator.clipboard.writeText(invitation.toString()); setCopied("Convite copiado! Envie o link para reunir seus amigos."); }
    catch { setCopied("Não foi possível copiar o link. Compartilhe o código da sala acima."); }
  }
  async function sendMessage(event: FormEvent) {
    event.preventDefault();
    if (message.trim() && await act({ type: "chat", text: message.trim() })) setMessage("");
  }

  if (loading) return <section className="page-shell empty-state" role="status"><span className="loading-moon">☾</span><h1>Encontrando sua vila…</h1><p>Preparando os rostos e os segredos.</p></section>;
  if (!room) return <section className="page-shell empty-state"><span className="loading-moon">☾</span><p className="eyebrow">O PORTÃO ESTÁ ABERTO</p><h1>Sua história começa <em>em uma sala.</em></h1><p>{networkError || "Crie uma vila ou entre com o código dos seus amigos."}</p>{networkError ? <button className="button button-primary" onClick={() => void refresh()}>Tentar novamente</button> : <div className="button-row"><Link className="button button-primary" href="/entrar?modo=criar">Criar uma sala ↗</Link><Link className="button button-secondary" href="/entrar">Entrar em uma sala</Link></div>}</section>;

  const self = room.players.find(p => p.id === room.self.id)!;
  const isLobby = room.phase === "lobby";
  const phaseKey = `${room.round}-${room.phase}`;
  const target = selection?.phase === phaseKey ? selection.target : null;
  const canNightAct = room.phase === "night" && self.alive && room.self.role !== "citizen" && !room.self.hasActed;
  const canVote = room.phase === "voting" && self.alive && !self.hasVoted;
  const canChat = isLobby || room.phase === "finished" || (room.phase === "discussion" && self.alive);
  const disabled = pending || Boolean(networkError);
  const readyCount = room.players.filter(p => p.ready).length;
  const canStart = room.players.length >= room.minPlayers && readyCount === room.players.length;
  const recentNarration = room.narration.slice(["discussion", "results", "finished"].includes(room.phase) ? -2 : -1);
  const actionTargets = room.players.filter(p => p.alive && (p.id !== self.id || (canNightAct && room.self.role === "angel")));
  const tabs: { id: RoomTab; label: string }[] = [{ id: "scene", label: "A partida" }, { id: "chat", label: "Conversa" }, { id: "players", label: "Jogadores" }, { id: "history", label: "Histórico" }, { id: "notes", label: "Caderno" }, { id: "settings", label: "Opções" }];

  return <section className="room-shell">
    <header className="room-top"><div><p className="eyebrow">SUA VILA PARTICULAR</p><div className="room-title"><h1>Sala <span>{room.code}</span></h1><button className="icon-button" onClick={copyCode} aria-label="Copiar código da sala">⧉</button></div></div><div className="room-top-actions"><span className={`connection-status ${networkError ? "offline" : ""}`}><i className="status-dot" />{networkError ? "Reconectando" : "Sala conectada"}</span>{isLobby && <button className="text-button" onClick={copyInvite}>Copiar convite ↗</button>}<button className="text-button" onClick={() => setConfirmLeave(true)}>Sair da sala ↗</button>{!isLobby && <button className="text-button mobile-role-toggle" onClick={() => setShowRole(!showRole)}>{showRole ? "Ocultar meu papel" : "Ver meu papel ◇"}</button>}</div></header>
    {copied && <p className="inline-status" role="status">{copied}</p>}
    {networkError && <div className="form-errors" role="alert">{networkError} A sala tentará reconectar automaticamente. <button className="text-button" onClick={() => void refresh()}>Tentar agora</button></div>}
    {actionError && <div className="form-errors" role="alert">{actionError}</div>}
    {confirmLeave && <div className="leave-confirm" role="alert"><p>{isLobby || room.phase === "finished" ? "Deseja sair desta sala?" : "Sair elimina você desta partida. Deseja continuar?"}</p><button className="button button-secondary" onClick={() => setConfirmLeave(false)}>Ficar na vila</button><button className="button button-danger" disabled={disabled} onClick={() => void act({ type: "leave" })}>Sair da sala</button></div>}
    <div className="room-grid">
      <aside className="room-roster panel"><Roster room={room} /></aside>
      <div className="room-center panel"><div className="room-tabs" role="tablist" aria-label="Conteúdo da sala">{tabs.map((t, index) => <button role="tab" id={`room-tab-${t.id}`} aria-controls="room-tab-content" aria-selected={tab === t.id} tabIndex={tab === t.id ? 0 : -1} key={t.id} onClick={() => setTab(t.id)} onKeyDown={event => { let next = index; if (event.key === "ArrowRight") next = (index + 1) % tabs.length; else if (event.key === "ArrowLeft") next = (index + tabs.length - 1) % tabs.length; else if (event.key === "Home") next = 0; else if (event.key === "End") next = tabs.length - 1; else return; event.preventDefault(); setTab(tabs[next].id); document.getElementById(`room-tab-${tabs[next].id}`)?.focus(); }}>{t.label}{t.id === "chat" && room.messages.length > 0 && <small>{room.messages.length}</small>}</button>)}</div>
      <div className={`room-tab-content tab-${tab}`} id="room-tab-content" role="tabpanel" aria-labelledby={`room-tab-${tab}`}>
      {tab === "scene" && <><div className="game-scene"><Image src={room.phase === "discussion" || room.phase === "voting" || room.phase === "finished" ? "/assets/backgrounds/praca-amanhecer.png" : "/assets/backgrounds/vila-noturna.png"} alt="" fill sizes="(max-width: 800px) 100vw, 50vw" /><div className="game-scene-shade" /><div className="scene-phase"><span className="phase-badge">{isLobby ? "PREPARAÇÃO" : room.phase === "finished" ? "FIM DA PARTIDA" : `RODADA ${String(room.round).padStart(2, "0")}`}</span><Countdown key={room.serverNow} room={room} /></div><div className="game-scene-title"><span aria-hidden="true">{isLobby ? "⌂" : room.phase === "night" ? "☾" : "☼"}</span><h2>{phaseNames[room.phase]}</h2></div></div>
        {!isLobby && room.phase !== "finished" && <PhaseRail phase={room.phase} />}<div className="narrator-box"><p className="eyebrow"><span className="tiny-star">✦</span> O NARRADOR</p><div className="narration-current" aria-live="polite">{recentNarration.length ? recentNarration.map(event => <p key={event.id}>{event.text}</p>) : <p>A vila aguarda a chegada dos seus moradores.</p>}</div></div>
        <div className="scene-actions">
        {isLobby ? <><div className="room-tools-summary"><span>{paceNames[room.settings?.pace ?? "classic"]}</span><span>{room.maxPlayers} lugares</span><button className="text-button" onClick={() => setTab("settings")}>Ver opções ↗</button></div><div className="ready-summary"><span>{readyCount} de {room.players.length} prontos</span><span>{room.players.length < room.minPlayers ? `Faltam ${room.minPlayers - room.players.length} pessoas` : "A vila está reunida"}</span></div><div className="button-row"><button className={`button ${self.ready ? "button-secondary" : "button-primary"}`} disabled={disabled} onClick={() => void act({ type: "ready", ready: !self.ready })}>{self.ready ? "✓ Estou pronto · cancelar" : "Estou pronto"}</button>{self.isHost && <button className="button button-primary" disabled={disabled || !canStart} onClick={() => void act({ type: "start" })}>Iniciar partida ↗</button>}</div><p className="form-note">{self.isHost ? "Quando todos estiverem prontos, você pode iniciar a história." : "O anfitrião inicia quando todos estiverem prontos."}</p></>
        : room.phase === "finished" ? <div className="finished-summary"><h3>{room.winner === "village" ? "A vila venceu." : "O assassino venceu."}</h3><p>Os papéis foram revelados na lista de jogadores. O anfitrião pode reunir a mesma vila para uma nova história.</p><div className="button-row"><button className="button button-secondary" onClick={() => setTab("players")}>Revelar os papéis →</button>{self.isHost && <button className="button button-primary" disabled={disabled} onClick={() => void act({ type: "rematch" })}>{pending ? "Reabrindo a vila…" : "Jogar novamente ↗"}</button>}</div></div>
        : !self.alive ? <div className="waiting-note"><span>◇</span><p><strong>Você acompanha como espectador.</strong>Seu papel fica em segredo até o fim. Aguarde a vila descobrir a verdade.</p></div>
        : canNightAct || canVote ? <><p className="action-prompt">{canVote ? "Em quem a vila deve votar?" : room.self.role === "angel" ? "Quem você vai proteger?" : room.self.role === "sheriff" ? "Quem você vai investigar?" : "Quem será seu alvo?"}</p><div className="target-grid">{actionTargets.map(p => <button disabled={disabled} aria-pressed={target === p.id} className={target === p.id ? "selected" : ""} key={p.id} onClick={() => setSelection({ phase: phaseKey, target: p.id })}><Portrait id={p.avatarId} /><span>{p.name}{p.id === self.id ? " (você)" : ""}</span></button>)}</div><div className="button-row"><button className="button button-primary" disabled={disabled || !target} onClick={() => target && void act(canVote ? { type: "vote", targetId: target } : { type: "night", targetId: target })}>{pending ? "Registrando…" : canVote ? "Confirmar voto" : "Confirmar ação"}</button>{canVote && <button className="button button-secondary" disabled={disabled} onClick={() => void act({ type: "vote", targetId: null })}>Abster-se</button>}</div><p className="form-note">Sua decisão é definitiva nesta fase.</p></>
        : room.phase === "discussion" ? <div className="waiting-note"><span>☼</span><p><strong>É hora de cruzar as versões.</strong>Conversem sobre as pistas antes da votação.</p><button className="text-button" onClick={() => setTab("chat")}>Abrir conversa →</button></div>
        : <div className="waiting-note"><span>☾</span><p><strong>{room.phase === "night" && room.self.hasActed ? "Sua ação foi registrada." : room.phase === "voting" && self.hasVoted ? "Seu voto foi registrado." : "Aguarde a próxima cena."}</strong>O narrador conduz a passagem do tempo.</p></div>}
        </div></>}
      {tab === "players" && <Roster room={room} />}
      {tab === "settings" && <RoomSettingsPanel key={`${room.settings?.pace}-${room.maxPlayers}`} room={room} disabled={disabled} act={act} />}
      {tab === "notes" && isLobby && <div className="notebook-panel"><p className="eyebrow">SEU ESPAÇO PRIVADO</p><h2>As pistas começam à noite.</h2><p className="muted">Seu caderno estará disponível quando a partida começar.</p></div>}
      {tab === "notes" && !isLobby && <Notebook room={room} value={notebook?.scope === `${room.code}:${room.self.id}` ? notebook.value : { text: "", suspects: [] }} onChange={value => setNotebook({ scope: `${room.code}:${room.self.id}`, value })} />}
      {tab === "history" && <div className="history-panel"><p className="eyebrow">O QUE A VILA JÁ VIVEU</p><h2>Diário da partida</h2><ol className="narration-history">{[...room.narration].reverse().map((n, i) => <li key={n.id}><span>{String(room.narration.length - i).padStart(2, "0")}</span><p>{n.text}</p></li>)}</ol></div>}
      {tab === "chat" && <div className="chat-panel"><div className="panel-heading"><h2>Vozes da vila</h2><span>{canChat ? "Conversa aberta" : "Em silêncio"}</span></div><div className="chat-messages" ref={chatLog} onScroll={event => { const panel = event.currentTarget; followNewMessages.current = panel.scrollHeight - panel.scrollTop - panel.clientHeight < 72; }} role="log" aria-label="Mensagens da sala">{room.messages.length ? room.messages.map(m => <div className={`chat-message ${m.playerId === self.id ? "own" : ""}`} key={m.id}><strong>{m.playerName} {m.playerId === self.id ? "· você" : ""}</strong><p>{m.text}</p></div>) : <div className="chat-empty"><span>“ ”</span><p>Ainda está tudo em silêncio.<br />Comece a conversa com a vila.</p></div>}</div><form className="chat-form" onSubmit={sendMessage}><label className="sr-only" htmlFor="chat-message">Mensagem para a vila</label><input id="chat-message" value={message} onChange={e => setMessage(e.target.value)} placeholder={canChat ? "O que você tem a dizer?" : "A conversa abre na discussão."} maxLength={240} disabled={!canChat || disabled} autoComplete="off" /><button className="button button-primary" type="submit" disabled={!canChat || disabled || !message.trim()} aria-label="Enviar mensagem">↑</button></form><p className="form-note">{canChat ? "Até 240 caracteres. Todos na sala podem ler." : "Silêncio à noite e durante a votação. Espectadores aguardam o fim."}</p></div>}
      </div></div>
      <aside className={`room-personal panel ${!isLobby ? "in-game" : ""} ${showRole ? "role-visible" : ""}`}><div className="panel-heading"><h2>Seu lugar na vila</h2><span aria-hidden="true">◇</span></div><div className="self-portrait"><Portrait id={self.avatarId} name={`Seu retrato: ${self.name}`} /><h3>{self.name}</h3><span>{isLobby ? "Um rosto. Muitos segredos." : self.alive ? "Você permanece na vila." : "Acompanhando a história."}</span></div>
      {isLobby ? <><button className="text-button portrait-change" disabled={disabled} onClick={() => setChangePortrait(!changePortrait)}>{changePortrait ? "Fechar retratos ↑" : "Trocar retrato ↗"}</button>{changePortrait && <PortraitPicker compact value={self.avatarId} onChange={id => void act({ type: "avatar", avatarId: id as AvatarId })} disabled={disabled} />}<div className="secret-note"><span>◇</span><p><strong>O segredo ainda não foi sorteado.</strong>Seu papel aparece aqui quando a partida começar.</p></div></>
      : <div className="role-card"><p className="eyebrow">SOMENTE VOCÊ</p>{showRole && room.self.role ? <><h3>{roleNames[room.self.role]}</h3><p>{roleDescriptions[room.self.role]}</p>{room.self.investigation && <div className="investigation"><strong>Investigação · noite {room.self.investigation.round}</strong><p>{room.self.investigation.targetName} {room.self.investigation.isAssassin ? "é o assassino." : "não é o assassino."}</p></div>}</> : <><span className="secret-symbol">◇</span><p>Seu papel está guardado.<br />Veja com discrição.</p></>}<button className="button button-secondary button-full" onClick={() => setShowRole(!showRole)}>{showRole ? "Ocultar meu papel" : "Ver meu papel"}</button></div>}
      <p className="personal-note"><span className="tiny-star">✦</span> Confie na sua intuição.<br />Desconfie do resto.</p></aside>
    </div>
  </section>;
}

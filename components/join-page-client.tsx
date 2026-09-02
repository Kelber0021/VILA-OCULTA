"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { JoinForm } from "./join-form";
import { portraits } from "./portraits";
export function JoinPageClient() {
  const router = useRouter();
  const params = useSearchParams();
  const mode = params.get("modo") === "criar" ? "create" : "join";
  const initialCode = (params.get("sala") || "").toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 6);
  const initialAvatar = params.get("personagem") || "ana";
  const [avatarId, setAvatarId] = useState(portraits.some(p => p.id === initialAvatar) ? initialAvatar : "ana");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");
  const [activeRoom, setActiveRoom] = useState<string | null>(null);
  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/rooms/current", { cache: "no-store", signal: controller.signal }).then(r => r.ok ? r.json() : null).then(data => { if (data?.room) setActiveRoom(data.room.code); }).catch(() => {});
    return () => controller.abort();
  }, []);
  async function join(data: { name: string; code: string }) {
    setPending(true); setError("");
    try {
      const response = await fetch(mode === "create" ? "/api/rooms" : "/api/rooms/join", { method: "POST", signal: AbortSignal.timeout(15000), headers: { "Content-Type": "application/json" }, body: JSON.stringify(mode === "create" ? { name: data.name, avatarId } : { ...data, avatarId }) });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Não foi possível abrir a sala.");
      router.push("/lobby");
    } catch (cause) { setError(cause instanceof Error ? cause.message : "A conexão falhou. Tente novamente."); setPending(false); }
  }
  return <section className="join-stage">
    <div className="join-art"><Image src="/assets/backgrounds/vila-noturna.png" alt="Rua da vila iluminada por lanternas à noite" fill priority sizes="(max-width: 800px) 100vw, 50vw" /><div className="join-art-shade" /><div className="join-copy"><p className="eyebrow">A NOITE ESTÁ SÓ COMEÇANDO</p><h1>Há um lugar<br />para você <em>na vila.</em></h1><p>Traga seus amigos.<br />Deixe as certezas do lado de fora.</p><span className="art-quote">“Por aqui, até o silêncio tem uma versão.”</span></div></div>
    <div className="join-panel"><div className="mode-switch" aria-label="Forma de entrar"><Link aria-current={mode === "join" ? "page" : undefined} href={`/entrar?personagem=${avatarId}${initialCode ? `&sala=${initialCode}` : ""}`}>Entrar em uma sala</Link><Link aria-current={mode === "create" ? "page" : undefined} href={`/entrar?modo=criar&personagem=${avatarId}${initialCode ? `&sala=${initialCode}` : ""}`}>Criar uma sala</Link></div><h2>{mode === "create" ? "Comece uma nova história." : "Seus amigos esperam."}</h2><p className="muted">{mode === "create" ? "Você organiza. O narrador conduz." : "Um nome, um retrato e o código da vila."}</p>
    {activeRoom && <div className="resume-note">Você já está na sala <strong>{activeRoom}</strong>. <Link href="/lobby">Retomar partida →</Link></div>}
    <JoinForm key={initialCode} initialCode={initialCode} onJoin={join} mode={mode} avatarId={avatarId} onAvatarChange={setAvatarId} pending={pending} error={error} />
    </div>
  </section>;
}

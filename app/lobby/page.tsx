import type { Metadata } from "next";
import { LobbyPreview } from "@/components/lobby-preview";

export const metadata: Metadata = { title: "Lobby demonstrativo" };

export default function LobbyPage() {
  return <section className="inner-page lobby-page section-shell"><LobbyPreview /></section>;
}

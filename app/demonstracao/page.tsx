import type { Metadata } from "next";
import { GameDemo } from "@/components/game-demo";

export const metadata: Metadata = {
  title: "Experimente uma rodada",
  description: "Aprenda a investigar, acompanhar as pistas e votar em uma demonstração solo de Vila Oculta.",
};

export default function DemoPage() {
  return <GameDemo />;
}

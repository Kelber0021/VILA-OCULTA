import type { Metadata } from "next";
import { GameRoom } from "@/components/game-room";
export const metadata: Metadata = { title: "Sua sala" };
export default function LobbyPage() { return <GameRoom />; }

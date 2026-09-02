import type { Metadata } from "next";
import { CharacterGallery } from "@/components/character-gallery";
export const metadata: Metadata = { title: "Os rostos da vila" };
export default function CharactersPage() { return <CharacterGallery />; }

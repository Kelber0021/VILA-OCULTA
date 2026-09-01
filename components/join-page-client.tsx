"use client";

import { useRouter } from "next/navigation";
import { JoinForm } from "./join-form";

export function JoinPageClient() {
  const router = useRouter();
  return <JoinForm onJoin={() => router.push("/lobby")} />;
}

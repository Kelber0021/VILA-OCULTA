import type { Metadata } from "next";
import { Suspense } from "react";
import { JoinPageClient } from "@/components/join-page-client";
export const metadata: Metadata = { title: "Entre na vila" };
export default function JoinPage() {
  return <Suspense fallback={<section className="page-shell empty-state" role="status">Preparando sua chegada…</section>}><JoinPageClient /></Suspense>;
}

import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: { default: "Vila Oculta — A noite guarda segredos", template: "%s · Vila Oculta" },
  description: "Reúna seus amigos em uma vila de segredos. Um jogo de dedução social com salas privadas, personagens e uma história narrada a cada rodada.",
};
export const viewport: Viewport = { themeColor: "#0b1517", colorScheme: "dark" };
export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return <html lang="pt-BR"><body>
    <a className="skip-link" href="#conteudo">Pular para o conteúdo</a>
    <SiteHeader />
    <main id="conteudo">{children}</main>
    <footer className="site-footer"><span>VILA OCULTA</span><span>Entre amigos. Entre segredos.</span><span className="footer-edition">CAPÍTULO I · A VILA</span></footer>
  </body></html>;
}

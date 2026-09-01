import type { Metadata, Viewport } from "next";
import { Bodoni_Moda, Work_Sans, Courier_Prime } from "next/font/google";
import Link from "next/link";
import type { ReactNode } from "react";
import "./globals.css";

const display = Bodoni_Moda({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700", "800"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

const body = Work_Sans({
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-body",
  display: "swap",
});

const mono = Courier_Prime({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: "Cidade Dorme", template: "%s — Cidade Dorme" },
  description: "Uma prévia interativa de um jogo brasileiro de dedução social.",
};

export const viewport: Viewport = {
  themeColor: "#070a15",
  colorScheme: "dark",
};

const navigation = [
  { href: "/como-jogar", label: "Como jogar" },
  { href: "/personagens", label: "Personagens" },
  { href: "/entrar", label: "Entrar" },
];

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="pt-BR" className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <body>
        <a className="skip-link" href="#conteudo">Pular para o conteúdo</a>
        <header className="site-header">
          <Link className="wordmark" href="/" aria-label="Cidade Dorme — início">
            <span aria-hidden="true" className="moon-mark" />
            Cidade Dorme
          </Link>
          <nav aria-label="Navegação principal">
            {navigation.map((item) => <Link href={item.href} key={item.href}>{item.label}</Link>)}
          </nav>
        </header>
        <main id="conteudo">{children}</main>
        <footer className="site-footer">
          <Link className="wordmark wordmark-small" href="/">Cidade Dorme</Link>
          <p>Uma demonstração visual. Nenhuma partida real é conectada nesta versão.</p>
        </footer>
      </body>
    </html>
  );
}

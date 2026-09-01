import type { Metadata, Viewport } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import "./globals.css";

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
    <html lang="pt-BR">
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

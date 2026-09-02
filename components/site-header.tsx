"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
export function SiteHeader() {
  const pathname = usePathname();
  return <header className="site-header">
    <Link className="wordmark" href="/" aria-label="Vila Oculta — início"><span className="brand-symbol" aria-hidden="true">☾</span><span>VILA <strong>OCULTA</strong></span></Link>
    <nav aria-label="Navegação principal">
      {[{ href: "/", label: "A vila" }, { href: "/personagens", label: "Personagens" }, { href: "/como-jogar", label: "Como jogar" }].map(item => <Link key={item.href} href={item.href} aria-current={pathname === item.href ? "page" : undefined}>{item.label}</Link>)}
    </nav>
    <Link className="header-join" href="/entrar">Jogar <span aria-hidden="true">↗</span></Link>
  </header>;
}

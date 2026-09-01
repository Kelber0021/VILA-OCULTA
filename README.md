# CIDADE DORME

Demonstração visual interativa de um jogo de dedução social ambientado numa vila colonial brasileira durante a noite.

Esta primeira versão oferece cinco telas navegáveis, validação local do formulário e um lobby fictício com estado de prontidão local. Ela **não** possui autenticação, backend, banco de dados, voz, sincronização ou multiplayer real.

## Rotas

- `/` — início e visão geral da dinâmica;
- `/como-jogar` — sete etapas essenciais da partida;
- `/personagens` — Cidadão, Assassino, Xerife e Anjo;
- `/entrar` — formulário demonstrativo para entrar numa sala;
- `/lobby` — prévia interativa do lobby `NEVOA7`.

## Desenvolvimento

Requer Node.js compatível com Next.js 16 e npm.

```bash
npm install
npm run dev
```

Verificações disponíveis:

```bash
npm test
npm run lint
npm run typecheck
npm run build
```

O build usa exportação estática do Next.js e gera o diretório `out/`, usado pelo Render Static Site.

## Estado do produto

Esta entrega valida identidade visual, conteúdo, navegação, responsividade e microinterações locais. Recursos em tempo real permanecem fora do escopo e não são simulados como operacionais.

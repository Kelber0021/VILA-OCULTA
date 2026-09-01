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

O projeto é publicado como Render Web Service no plano gratuito. O processo Node inicia com `npm run start`, escuta o `PORT` fornecido pelo Render e serve as cinco rotas prerenderizadas pelo Next.js.

## Estado do produto

Esta entrega valida identidade visual, conteúdo, navegação, responsividade e microinterações locais. Recursos em tempo real permanecem fora do escopo e não são simulados como operacionais.

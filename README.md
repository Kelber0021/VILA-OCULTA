# Vila Oculta

Vila Oculta é um jogo social de dedução multiplayer para navegador, inspirado na dinâmica de Cidade Dorme, mas com identidade, personagens, atmosfera e experiência próprias.

## Objetivo

Construir uma aplicação web moderna, responsiva, segura e com aparência de jogo completo, permitindo que jogadores participem remotamente pelo navegador em computador, notebook, tablet, Android e iPhone.

Toda a comunicação da partida deverá ocorrer dentro do próprio jogo, incluindo:

- chat de voz em tempo real;
- chat escrito em tempo real;
- lobby multiplayer;
- salas privadas por código/link;
- regras e fases sincronizadas;
- distribuição secreta de personagens;
- votação e ações protegidas pelo servidor;
- reconexão;
- moderação do anfitrião.

## Direção técnica inicial

Stack preferencial, sujeita às decisões arquiteturais documentadas:

- Next.js (App Router)
- React
- TypeScript estrito
- Tailwind CSS
- Zod
- Supabase + PostgreSQL + Realtime
- LiveKit / WebRTC para voz
- Vitest + Testing Library
- Playwright
- Render

## Repositório antigo

O repositório `Kelber0021/CIDADE-DORME-` será utilizado somente como referência para entender regras, personagens, telas, textos, assets, fluxo da partida e limitações técnicas. Ele não deverá ser modificado.

## Estado atual

Projeto em fase de auditoria e definição arquitetural.

As decisões aprovadas serão registradas em `docs/DECISOES.md` e as pendências em `docs/PENDENCIAS.md`.

## Princípios do projeto

- aplicação concebida para web desde o início;
- mobile-first, sem sacrificar a experiência desktop;
- aparência de jogo, não de dashboard ou SaaS;
- servidor como fonte confiável das regras críticas;
- voz integrada no próprio jogo via WebRTC;
- nenhuma gravação de áudio por padrão;
- segurança, privacidade e acessibilidade tratadas desde a fundação;
- nenhuma credencial real versionada no GitHub.

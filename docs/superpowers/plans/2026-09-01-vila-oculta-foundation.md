# Vila Oculta Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reconstruir Vila Oculta como jogo social multiplayer web, preservando somente regras, personagens, textos e ideias válidas do projeto legado e substituindo a fundação Expo por uma arquitetura web segura e testável.

**Architecture:** O projeto novo será separado por domínio: interface/design system, salas e presença, motor de partida/máquina de estados, comunicação em tempo real, voz WebRTC, chat, autenticação/autorização e persistência. Regras críticas serão validadas no servidor; Supabase ficará responsável por PostgreSQL/Realtime e LiveKit será avaliado para a camada de voz sem transmitir áudio pelo Supabase.

**Tech Stack:** Next.js App Router, React, TypeScript strict, Tailwind CSS, Zod, Supabase/PostgreSQL/Realtime, WebRTC/LiveKit, Vitest, Testing Library, Playwright, Render e GitHub.

**Spec:** `docs/VISAO_DO_JOGO.md` e especificação original fornecida pelo proprietário do projeto.

## Global Constraints

- O projeto é web-first e não reutiliza Expo/React Native como fundação.
- A experiência precisa funcionar em computador, notebook, tablet, Android e iPhone.
- Voz e chat escrito acontecem dentro do Vila Oculta; sem Discord, WhatsApp, Meet ou equivalente.
- O áudio não será gravado por padrão.
- O servidor é a fonte confiável de estado, fase, permissões e ações críticas.
- O repositório legado `Kelber0021/CIDADE-DORME-` é somente referência e não será modificado.
- `main` deve permanecer estável; alterações relevantes devem ser feitas em branches e revisadas antes da integração.
- Nenhum segredo real será versionado.
- Decisões principais de produto só podem ser fechadas após aprovação do proprietário.

---

### Task 1: Auditoria verificável do legado

**Files:**
- Create: `docs/AUDITORIA_LEGADO.md`
- Create: `docs/REGRAS.md`
- Create: `docs/PERSONAGENS.md`
- Create: `docs/FLUXO_DA_PARTIDA.md`
- Modify: `docs/PENDENCIAS.md`

**Interfaces:**
- Consumes: repositório `Kelber0021/CIDADE-DORME-` em `main`.
- Produces: inventário factual de regras, personagens, telas, assets, estado técnico e ambiguidades a serem decididas.

- [ ] Mapear árvore do repositório legado e classificar arquivos por função.
- [ ] Ler arquivos de regras, configuração, sala, estado e componentes relacionados ao jogo.
- [ ] Extrair regras sem completar lacunas por inferência.
- [ ] Documentar personagens encontrados e marcar qualquer contradição ou regra incompleta.
- [ ] Documentar fluxo da partida e telas existentes.
- [ ] Registrar limitações técnicas da base Expo e itens reutilizáveis apenas como referência.
- [ ] Commit: `docs: document legacy game audit`.

### Task 2: Fundação documental e decisões

**Files:**
- Create: `docs/VISAO_DO_JOGO.md`
- Create: `docs/ARQUITETURA.md`
- Create: `docs/DESIGN_SYSTEM.md`
- Create: `docs/ARQUITETURA_DE_VOZ.md`
- Create: `docs/CHAT_EM_TEMPO_REAL.md`
- Create: `docs/DECISOES.md`
- Create: `docs/PENDENCIAS.md`
- Create: `docs/ROADMAP.md`
- Create: `AGENTS.md`

**Interfaces:**
- Consumes: auditoria do Task 1 e decisões aprovadas pelo proprietário.
- Produces: contratos arquiteturais e de produto para execução posterior.

- [ ] Registrar visão, não objetivos e critérios de qualidade.
- [ ] Registrar arquitetura proposta e fronteiras de responsabilidade.
- [ ] Registrar direção visual e requisitos responsivos.
- [ ] Comparar opções de voz e registrar decisão somente após aprovação.
- [ ] Registrar chat em tempo real e proteções contra abuso.
- [ ] Registrar decisões aprovadas sem alterar escolhas anteriores silenciosamente.
- [ ] Commit: `docs: establish project foundations`.

### Task 3: Bootstrap web testável

**Files:**
- Create: `package.json`
- Create: `next.config.ts`
- Create: `tsconfig.json`
- Create: `eslint.config.mjs`
- Create: `postcss.config.mjs`
- Create: `app/layout.tsx`
- Create: `app/page.tsx`
- Create: `app/globals.css`
- Create: `src/` modules conforme fronteiras documentadas
- Create: `.env.example`
- Create: test configs for Vitest/Playwright

**Interfaces:**
- Consumes: contratos do Task 2.
- Produces: aplicação Next.js mínima, tipada, lintável e testável.

- [ ] Criar teste mínimo de renderização antes da implementação da home.
- [ ] Executar teste e confirmar falha inicial.
- [ ] Inicializar Next.js App Router com TypeScript strict.
- [ ] Configurar lint e testes.
- [ ] Implementar shell mínimo sem replicar visual mobile legado.
- [ ] Executar testes, typecheck e lint.
- [ ] Commit: `chore: bootstrap web application`.

### Task 4: Salas e sessão segura

**Files:**
- Create: migrations em `supabase/migrations/`
- Create: módulos de room/session no servidor
- Create: APIs/server actions de criação/entrada/reconexão
- Test: testes unitários, integração e RLS correspondentes

**Interfaces:**
- Produces: criação de sala, código público não previsível, UUID interno, sessão por jogador, anfitrião protegido e reconexão idempotente.

- [ ] Escrever testes de criação, entrada, duplicação, expiração e reconexão.
- [ ] Implementar schema e constraints.
- [ ] Implementar autorização e políticas RLS.
- [ ] Implementar rate limiting e idempotência nas ações críticas.
- [ ] Executar testes de isolamento entre salas.
- [ ] Commit: `feat: implement secure room sessions`.

### Task 5: Realtime e lobby

**Files:**
- Create: presença e eventos realtime
- Create: UI de lobby e lista de jogadores
- Test: testes de duas sessões e reconexão

**Interfaces:**
- Consumes: sessão segura do Task 4.
- Produces: presença sincronizada, host, microfone/conexão visíveis e transferência segura de anfitrião.

- [ ] Escrever testes de presença e transições de host.
- [ ] Implementar presença realtime.
- [ ] Implementar lobby responsivo.
- [ ] Testar atualização de página e duas abas.
- [ ] Commit: `feat: add realtime lobby`.

### Task 6: Voz integrada

**Files:**
- Create: endpoint/server action de emissão de token WebRTC
- Create: módulo cliente de sala de voz
- Create: controles de microfone/volume/participante
- Test: testes de autorização de token e testes manuais de áudio

**Interfaces:**
- Consumes: room/session do Task 4 e presença do Task 5.
- Produces: canal de voz exclusivo da sala, token curto emitido no servidor, reconexão e controles locais.

- [ ] Escrever testes de autorização do token antes da implementação.
- [ ] Integrar provedor WebRTC aprovado.
- [ ] Bloquear emissão de token para sala/jogador inválido ou expulso.
- [ ] Implementar mute, volume individual, speaking indicator e recuperação de conexão.
- [ ] Testar Chrome/Edge/Firefox e navegadores móveis quando disponíveis.
- [ ] Commit: `feat: integrate in-game voice chat`.

### Task 7: Chat escrito em tempo real

**Files:**
- Create: schema/migration de mensagens efêmeras
- Create: serviço realtime de chat
- Create: painel de chat responsivo
- Test: sanitização, rate limit, duplicação e reconexão

**Interfaces:**
- Produces: chat de sessão com mensagens de usuário/sistema, moderação e limpeza por expiração.

- [ ] Escrever testes contra XSS, spam e mensagens duplicadas.
- [ ] Implementar persistência temporária e realtime.
- [ ] Implementar painel recolhível e indicador de novas mensagens.
- [ ] Implementar limites, validação e moderação.
- [ ] Commit: `feat: add realtime text chat`.

### Task 8: Máquina de estados e motor da partida

**Files:**
- Create: domínio de match/phase/roles/actions/votes
- Create: migrations necessárias
- Test: distribuição, ações, votos, eliminação e vitória

**Interfaces:**
- Consumes: personagens e regras aprovados.
- Produces: máquina de estados explícita e servidor autoritativo.

- [ ] Escrever testes da primeira composição de personagens aprovada.
- [ ] Implementar distribuição determinística/testável.
- [ ] Implementar transições de fase e validação servidor-side.
- [ ] Implementar ações noturnas e resolução.
- [ ] Implementar votação, empate, julgamento, eliminação e vitória.
- [ ] Commit: `feat: implement match state machine`.

### Task 9: Segurança, QA e publicação

**Files:**
- Create: `docs/SEGURANCA.md`
- Create: `docs/TESTES.md`
- Create: `docs/PRIVACIDADE.md`
- Create: `docs/DEPLOY_RENDER.md`
- Create: `render.yaml`

**Interfaces:**
- Produces: versão auditada, testada e publicável.

- [ ] Auditar debug/admin, RLS, autenticação/autorização, rate limit, bot abuse, inputs, cookies, tokens, secrets, CORS, CSP, XSS/CSRF e isolamento de voz.
- [ ] Executar varredura de segredos no histórico e registrar evidência sem reproduzir valores sensíveis.
- [ ] Executar unitários, integração, RLS e Playwright.
- [ ] Validar layouts 320/360/390/412, tablet, notebook, Full HD e ultrawide.
- [ ] Publicar no Render somente após configuração segura de variáveis.
- [ ] Testar URL pública, duas sessões, voz, chat, partida, refresh e reconexão.
- [ ] Commit: `deploy: configure and verify Render service`.

## Self-review

- Cobertura da especificação: auditoria, documentação, web foundation, multiplayer, voz, chat, motor, responsividade, segurança, testes e Render possuem tarefas explícitas.
- Nenhuma decisão de personagem, regra de eliminados, chat noturno ou provedor pago foi fechada sem aprovação.
- O plano não reutiliza Expo como fundação.
- Contratos críticos colocam autorização no servidor e não no estado visual do cliente.

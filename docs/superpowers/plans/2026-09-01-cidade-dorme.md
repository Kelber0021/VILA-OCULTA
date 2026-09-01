# Cidade Dorme Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Construir, verificar e publicar no Render a primeira demonstração visual interativa de CIDADE DORME.

**Architecture:** Aplicação Next.js App Router exportada estaticamente, com cinco rotas e pequenos componentes cliente para formulário e lobby. O estado é local e demonstrativo; o deploy usa Render Static Site.

**Tech Stack:** Next.js, React, TypeScript estrito, CSS global, Vitest, Testing Library e Render.

**Spec:** `docs/superpowers/specs/2026-09-01-cidade-dorme-design.md`

## Global Constraints

- Trabalhar somente na `main`, sem PR, rebase destrutivo ou force push.
- Exibir somente a identidade **CIDADE DORME** na interface, metadados e documentação nova.
- Não implementar nem alegar backend, autenticação, banco, voz ou multiplayer real.
- Suportar 320 px até Full HD, teclado, foco visível e `prefers-reduced-motion`.
- Preservar a exportação estática compatível com Render gratuito.

---

### Task 1: Base, navegação e conteúdo estático

**Files:** criar configuração Next/TypeScript/Vitest, layout global, header/footer, rotas informativas, estilos, README e asset aprovado.

- [ ] Escrever testes que exijam marca, navegação, conteúdo das cinco rotas e ausência de alegações proibidas.
- [ ] Executar os testes e confirmar falha por componentes ausentes.
- [ ] Implementar o mínimo para as rotas e navegação passarem.
- [ ] Refatorar o CSS para tokens e comportamento responsivo sem quebrar testes.

### Task 2: Formulário demonstrativo

**Files:** criar componente cliente de entrada e testes de validação.

- [ ] Escrever testes para nome obrigatório, código de seis caracteres, maiúsculas e navegação.
- [ ] Confirmar falhas esperadas.
- [ ] Implementar validação acessível e navegação ao lobby.
- [ ] Refatorar mantendo a suíte verde.

### Task 3: Lobby interativo

**Files:** criar componente cliente do lobby e testes de prontidão/cópia.

- [ ] Escrever testes para código, jogadores fictícios, alternância de prontidão e início desabilitado.
- [ ] Confirmar falhas esperadas.
- [ ] Implementar estado local e feedback acessível.
- [ ] Refatorar mantendo a suíte verde.

### Task 4: Verificação, segurança e publicação

**Files:** criar `render.yaml`, headers estáticos compatíveis e documentação final.

- [ ] Executar testes, lint, typecheck e build.
- [ ] Verificar secrets, rotas proibidas, dependências, diff e exportação `out/`.
- [ ] Revisar responsividade, teclado, foco, overflow e reduced motion nos cinco tamanhos-alvo.
- [ ] Corrigir defeitos por novo ciclo de teste falhando antes da implementação.
- [ ] Commitar uma entrega coesa, enviar à `main`, confirmar branches remotas, publicar no Render e validar URL/rotas/assets.

# AGENTS.md — Vila Oculta

## Objetivo

Este repositório contém a reconstrução web do jogo multiplayer Vila Oculta. Agentes de IA devem tratar o repositório legado `Kelber0021/CIDADE-DORME-` apenas como fonte de referência para regras, personagens, textos, telas, assets e decisões antigas.

## Regras inegociáveis

1. Não reutilizar Expo/React Native como fundação.
2. Não modificar o repositório legado.
3. Não criar outro repositório para a reconstrução.
4. Não inserir credenciais reais, tokens, chaves privadas ou service role no Git.
5. Não confiar no cliente para fase, host, voto, personagem, ação noturna ou autorização de voz.
6. Não transmitir áudio pelo Supabase.
7. Não gravar áudio por padrão.
8. Não adicionar câmera/vídeo na primeira versão sem decisão explícita.
9. Não depender de Discord, WhatsApp, Meet, Omegle ou outro aplicativo externo para voz/chat da partida.
10. Não alterar decisões registradas em `docs/DECISOES.md` sem aprovação do proprietário.
11. Não sobrescrever alterações de outros colaboradores.
12. Não declarar funcionalidade, segurança ou deploy concluídos sem evidência de testes.

## Processo

- Leia `docs/VISAO_DO_JOGO.md`, `docs/DECISOES.md`, `docs/PENDENCIAS.md` e o plano ativo antes de implementar.
- Faça alterações pequenas e coesas.
- Prefira branch/PR por etapa e mantenha `main` estável.
- Escreva teste antes da implementação para regras e bugs sempre que tecnicamente possível.
- Execute typecheck, lint e testes relevantes antes de enviar código.
- Procure segredos e arquivos grandes antes de cada envio.
- Atualize documentação quando uma decisão alterar comportamento ou arquitetura.

## Arquitetura alvo

Preferência inicial:

- Next.js App Router;
- React;
- TypeScript strict;
- Tailwind CSS;
- Zod;
- Supabase/PostgreSQL/Realtime;
- WebRTC/LiveKit para voz;
- Vitest + Testing Library;
- Playwright;
- Render.

A arquitetura definitiva deve respeitar as decisões registradas.

## Limites de decisão

Agentes podem investigar, implementar itens já aprovados e propor até três alternativas quando houver escolha de produto. Não podem definir sozinhos personagens da primeira versão, regras dos eliminados, restrição de chat noturno, espectadores ou contratação de serviços pagos.

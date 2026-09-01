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
13. Toda tela deve funcionar de forma interativa tanto em navegador de celular quanto em navegador de PC.
14. Não criar desktop como simples versão mobile ampliada e não criar mobile como recorte tardio do desktop.
15. Não usar resolução fixa, não permitir rolagem horizontal da página e não esconder ações críticas fora da viewport.
16. Interações essenciais devem funcionar com toque e mouse; teclado/foco deve ser suportado quando aplicável.
17. Cada tela deve ser validada em pelo menos um viewport mobile e um desktop antes de ser considerada pronta.
18. Animações devem ser responsivas, não bloquear ações críticas e respeitar `prefers-reduced-motion`.

## Decisões de jogo já aprovadas que afetam implementação

- Personagens da V1: **Cidadão, Assassino, Xerife e Anjo**.
- O chat escrito fica **totalmente oculto durante a noite** e retorna quando a fase de discussão/comunicação permitida começa.
- A fase noturna possui experiência animada tanto para quem apenas espera quanto para quem executa ação, reduzindo pistas sobre os papéis.
- O **Xerife investiga sozinho**, sem chat secreto ou canal de aliados, e usa a informação na discussão geral como uma espécie de “X9”; o sistema não comprova sua acusação aos demais.
- Jogadores eliminados saem do canal de voz dos vivos e entram em canal exclusivo dos eliminados, com isolamento imposto pelo servidor/serviço de voz.

## Processo

- Leia `docs/VISAO_DO_JOGO.md`, `docs/DECISOES.md`, `docs/PENDENCIAS.md`, `docs/REGRAS.md`, `docs/FLUXO_DA_PARTIDA.md` e o plano ativo antes de implementar.
- Faça alterações pequenas e coesas.
- Prefira branch/PR por etapa e mantenha `main` estável.
- Escreva teste antes da implementação para regras e bugs sempre que tecnicamente possível.
- Execute typecheck, lint e testes relevantes antes de enviar código.
- Procure segredos e arquivos grandes antes de cada envio.
- Atualize documentação quando uma decisão alterar comportamento ou arquitetura.
- Ao criar uma tela, projete simultaneamente o comportamento mobile e desktop; documente diferenças relevantes de composição.
- Teste teclado virtual, orientação, safe areas e redimensionamento quando a tela tiver entrada de texto, chat ou controles próximos às bordas.

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

## Responsividade obrigatória

A interface deve suportar, sem depender de resolução exata:

- aproximadamente 320 px de largura em telas pequenas;
- celulares comuns em retrato e paisagem;
- tablets;
- notebooks;
- desktop Full HD;
- telas ultrawide.

No mobile:

- touch targets confortáveis;
- teclado virtual não pode esconder ação principal;
- safe areas devem ser respeitadas;
- chat/voz/painéis podem usar drawer, bottom sheet, abas ou composição equivalente quando necessário;
- informações críticas como timer, conexão, microfone e ação da fase permanecem acessíveis.

No desktop:

- aproveitar espaço com regiões simultâneas quando isso melhorar a leitura;
- permitir coexistência de área principal, lista de jogadores, voz e chat quando houver espaço;
- hover pode enriquecer a experiência, mas nunca ser requisito para executar uma ação;
- mouse e teclado devem ter estados de foco claros.

## Limites de decisão

Agentes podem investigar, implementar itens já aprovados e propor até três alternativas quando houver escolha de produto. Não podem definir sozinhos detalhes ainda pendentes das habilidades do Xerife/Anjo, espectadores, regra padrão de empate, composição por quantidade de jogadores, condição de vitória dos Assassinos ou contratação de serviços pagos.

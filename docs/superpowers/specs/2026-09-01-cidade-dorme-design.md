# Cidade Dorme — Especificação da demonstração

## Objetivo

Entregar uma demonstração web estática, navegável e responsiva de **CIDADE DORME**, um jogo de dedução social ambientado numa vila colonial brasileira à noite. A entrega não possui backend, autenticação, voz ou multiplayer real.

## Arquitetura

- Next.js App Router com TypeScript estrito, páginas prerenderizadas e execução como Render Web Service.
- Rotas: `/`, `/como-jogar`, `/personagens`, `/entrar` e `/lobby`.
- Componentes interativos locais somente para validação do formulário, cópia do código e prontidão demonstrativa.
- Navegação interna com `next/link`; nenhuma API, banco ou serviço em tempo real.
- CSS global organizado por tokens, componentes e breakpoints fluidos.
- Processo Node ligado a `0.0.0.0` e ao `PORT` fornecido pelo Render; nenhuma API ou backend de jogo.

## Direção visual

O conceito “a cidade entre duas luzes” combina luar azul-violeta com janelas âmbar. O cenário cinematográfico domina o hero; recortes inspirados em janelas e ogivas aparecem como assinatura pontual. Painéis permanecem sóbrios, sem gráficos, sidebar administrativa, neon ou aparência SaaS.

Tokens principais: noite `#070A15`, superfície `#0D1426`, ardósia `#172139`, violeta `#66528F`, âmbar `#E9B65A`, névoa `#EEF0F6`, texto secundário `#AEB7CB`, pronto `#70BFA5` e erro `#F08A8A`.

Tipografia: Cormorant Garamond para títulos e logotipo; Manrope para corpo e interface; IBM Plex Mono para códigos e dados curtos, com fallbacks seguros.

## Telas

1. Início: hero de primeira viewport, marca, frase temática, descrição, CTAs, fatos e uma trilha em três atos para noite, discussão e votação.
2. Como jogar: sequência curta e numerada das sete etapas fornecidas no briefing.
3. Personagens: Cidadão, Assassino, Xerife e Anjo, sem regras ou facções inventadas.
4. Entrar: nome, código alfanumérico de seis caracteres em maiúsculas, validação acessível e navegação ao lobby demonstrativo.
5. Lobby: código `NEVOA7`, cópia, jogadores fictícios, prontidão local alternável, vagas, detalhes da sala, voz indisponível e início desabilitado.

## Acessibilidade e responsividade

- Mobile-first desde 320 px, sem overflow horizontal, grids fluidos e safe areas.
- Alvos de toque mínimos de 44 px, foco visível, labels persistentes e status que não dependem apenas de cor.
- Validação com mensagens específicas e região viva; ordem DOM coerente.
- Movimento leve e removido com `prefers-reduced-motion: reduce`.
- Verificação visual em 320, 390, 768, 1366 e 1920 px.

## Honestidade do produto

Os fluxos potencialmente confundíveis exibem “Prévia interativa” e explicam que usam dados fictícios e estado local. Voz aparece como indisponível. Não há alegações de conexão, sincronização, autenticação ou multiplayer.

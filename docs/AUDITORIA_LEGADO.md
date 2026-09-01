# Auditoria do Legado — CIDADE-DORME-

Data: 2026-09-01

Repositório auditado: `Kelber0021/CIDADE-DORME-`

Uso permitido: **somente referência**. Nenhuma alteração deverá ser realizada no repositório legado.

## Resumo executivo

O legado é essencialmente um protótipo de interface construído sobre Expo/React Native com exportação web estática. Ele contém uma direção visual útil, textos narrativos, fluxo de telas, algumas configurações de partida e uma especificação ampla em `jogocidade.txt`, mas **não contém a infraestrutura necessária para multiplayer remoto real**.

A reconstrução não deve migrar essa base diretamente. Deve extrair as decisões de produto úteis e reconstruir o motor, rede, segurança, voz, chat e persistência em arquitetura web própria.

## 1. Fundação técnica encontrada

O `package.json` confirma:

- Expo 54;
- React 19.1;
- React Native 0.81;
- React Native Web;
- Expo Router;
- exportação web estática por `expo export --platform web`;
- Bun como package manager;
- Playwright listado como dependência de desenvolvimento.

Não foram encontrados, entre as dependências do projeto legado, Supabase, cliente PostgreSQL, LiveKit ou outra biblioteca equivalente responsável por salas multiplayer/voz.

O README continua praticamente o template padrão do `create-expo-app`, sinal de que o projeto não havia consolidado documentação operacional própria.

## 2. Estrutura observada

### Telas

Foram identificadas:

- `src/app/index.tsx` — home;
- `src/app/criar-sala.tsx` — configuração local da sala;
- `src/app/entrar-sala.tsx` — entrada por código;
- `src/app/perfil.tsx` — nome/avatar;
- `src/app/sala/[codigo].tsx` — sala de espera;
- `src/app/regras.tsx` — resumo de regras;
- `src/app/configuracoes.tsx` — configurações visuais/locais;
- estrutura Expo Router por `_layout.tsx` e `+html.tsx`.

### Componentes visuais

Foram identificados componentes como:

- `AvatarPicker`;
- `DurationStepper`;
- `FormSection`;
- `GameWordmark`;
- `MistLayer`;
- `RoomCodeField`;
- `ScreenBackdrop`;
- `ScreenHeader`;
- `SegmentedControl`;
- `ToggleRow`;
- `VillageButton`;
- `VillageSkyline`.

Esses componentes servem como referência de composição/identidade, mas não devem ser transportados automaticamente para a fundação Next.js.

### Conteúdo e tema

Foram identificados:

- `src/content/narrative.ts` — biblioteca de frases atmosféricas;
- `src/content/avatars.ts` — opções de avatar;
- `src/theme/palette.ts` — paleta escura com noite, pergaminho, âmbar, carmesim e verde musgo;
- `jogocidade.txt` — especificação extensa do conceito anterior.

## 3. Assets

A pasta `assets/images` contém apenas arquivos de aplicação como:

- ícones Android;
- favicon;
- ícone principal;
- splash.

Não foi encontrada, nessa pasta, uma biblioteca pronta de retratos de personagens/cenários para reutilização como arte final da nova versão.

Conclusão: a identidade visual conceitual pode ser aproveitada, mas a nova versão precisará de assets web próprios e coerentes.

## 4. Fluxo implementado no protótipo

### Home

A home apresenta ambientação, frase narrativa sorteada, acesso a regras/configurações e botões para criar/entrar em uma vila.

### Criar sala

A tela permite configurar localmente:

- modo padrão, rápido ou personalizado;
- duração de discussão;
- duração da noite;
- duração da votação;
- revelar personagem de eliminado;
- permitir troca de voto;
- avanço automático.

Ao criar, o código é gerado no navegador e as configurações são transmitidas para as próximas telas por parâmetros de rota.

### Entrar na sala

A validação existente verifica apenas o tamanho mínimo do código no cliente e encaminha o usuário para o perfil. Não existe confirmação de que a sala existe no servidor.

### Perfil

Nome e avatar são mantidos localmente e enviados por parâmetros de rota. O nome possui limite de 16 caracteres e validação mínima de 2 caracteres, somente no cliente.

### Sala de espera

A tela renderiza apenas o próprio usuário local. Não existe lista multiplayer sincronizada. O botão de iniciar fica desabilitado e não possui motor de partida conectado.

## 5. Problemas críticos encontrados

### 5.1 Anfitrião controlado por URL

A criação envia `host: '1'` como parâmetro de rota e a sala determina o anfitrião verificando se esse parâmetro é igual a `1`.

Impacto: em uma aplicação real, um usuário poderia falsificar o papel de anfitrião alterando estado/URL.

Correção na reconstrução: identidade de anfitrião armazenada e validada no servidor, associada à sessão segura do jogador.

### 5.2 Código de sala gerado no cliente

`generateRoomCode()` utiliza `Math.random()` com um alfabeto de caracteres e tamanho padrão 5.

Impacto: não existe garantia de unicidade, registro atômico, proteção contra enumeração ou geração criptograficamente apropriada.

Correção: código público gerado/confirmado no servidor com entropia adequada, constraint de unicidade e UUID interno distinto.

### 5.3 Configurações confiadas ao cliente

Durações e regras são transportadas em parâmetros de rota.

Impacto: parâmetros podem ser manipulados e não há fonte autoritativa.

Correção: configurações persistidas no registro da sala/partida e alterações autorizadas no servidor.

### 5.4 Ausência de multiplayer real

O lobby contém um único jogador local e não existe backend/realtime conectado nos arquivos auditados.

Impacto: presença, host, entrada/saída, reconexão, votação e fases não são sincronizados.

Correção: Supabase/PostgreSQL + Realtime ou arquitetura equivalente, com servidor autoritativo para ações críticas.

### 5.5 Ausência de motor de jogo

Não há implementação operacional encontrada para:

- distribuição secreta de personagens;
- ações noturnas;
- resolução;
- votação real;
- eliminação;
- condições de vitória;
- máquina de estados;
- reconexão.

O conteúdo existe majoritariamente como especificação e telas demonstrativas.

### 5.6 Ausência de voz e chat integrados

O legado foi originalmente especificado como experiência presencial, com discussão fora do celular. A decisão atual do Vila Oculta é diferente: a partida será remota, com voz e chat escrito dentro do próprio jogo.

Correção: WebRTC/LiveKit para voz e Supabase Realtime/arquitetura equivalente para chat.

### 5.7 Render configurado como site estático

O `render.yaml` atual usa runtime `static`, exporta para `dist` e cria rewrites de páginas Expo.

Impacto: não atende sozinho endpoints seguros para emissão de token de voz, autorização, lógica servidor-side e outras necessidades do multiplayer atual.

Correção: nova configuração compatível com Next.js e funções/servidor necessários, sem reaproveitar o YAML antigo como configuração final.

## 6. Regras/conceitos reaproveitáveis

Itens que podem ser mantidos como referência, sujeitos às decisões atuais:

- facções Moradores, Ocultos e futuros Independentes;
- fases conceituais Noite, Amanhecer, Discussão, Votação e Julgamento;
- anfitrião não enxergar segredos por ser anfitrião;
- votação individual/secreta;
- jogadores eliminados não votarem nem executarem ações;
- configuração para revelar ou ocultar personagem eliminado;
- duração configurável das fases;
- avanço automático/manual configurável;
- composição de personagens escalável por quantidade de jogadores;
- atmosfera de vila noturna, névoa, lamparina, mistério e desconfiança;
- biblioteca variável de frases narrativas.

## 7. Conceitos substituídos pela decisão atual

O legado define explicitamente jogo presencial e conversa fora do celular. Isso está **substituído** pela decisão atual:

- jogadores participam remotamente pela internet;
- voz integrada no Vila Oculta;
- chat escrito integrado no Vila Oculta;
- nenhum app externo necessário para comunicação.

## 8. Itens que não serão copiados como fundação

- Expo Router;
- React Native como arquitetura principal;
- navegação/autoridade por parâmetros de URL;
- `Math.random()` para identidade de sala;
- runtime Render puramente estático;
- modelo de lobby local;
- regras críticas mantidas no cliente.

## 9. Elementos que podem inspirar a nova interface

- paleta noturna/pergaminho/âmbar;
- frases narrativas curtas;
- skyline da vila;
- névoa discreta;
- Cinzel em títulos e tipografia serifada de apoio;
- separação entre ações primárias e secundárias;
- controles de duração e regras da sala.

A implementação web nova deve, entretanto, criar design system próprio, acessível e responsivo.

## 10. Conclusão da auditoria

O repositório antigo é valioso como **documento interativo de intenção**, não como base multiplayer pronta.

A reconstrução deverá preservar o universo e decisões úteis, mas construir do zero as camadas de:

- sessão;
- autorização;
- salas;
- presença;
- Realtime;
- voz WebRTC;
- chat;
- máquina de estados;
- personagens secretos;
- ações;
- votos;
- reconexão;
- banco;
- RLS;
- testes;
- deploy seguro.

# Decisões — Vila Oculta

Este arquivo registra somente decisões já aprovadas pelo proprietário do projeto.

## 2026-09-01

### Plataforma

- Vila Oculta será reconstruído como aplicação **web-first**.
- A base Expo/React Native do projeto antigo não será reutilizada como fundação.
- O jogo deve funcionar em computador, notebook, tablet, Android e iPhone por navegador.
- A interface deve parecer um jogo completo e atmosférico, não dashboard, SaaS ou formulário genérico.

### Interface web responsiva e interativa

- Toda tela da V1 deve ser projetada desde o início para **desktop e mobile**, sem tratar uma plataforma como simples adaptação tardia da outra.
- A experiência deve ser interativa tanto em navegador de PC quanto em navegador de celular.
- O mobile será mobile-first, porém o desktop terá composição própria, aproveitando largura, altura e precisão de mouse/teclado sem apenas esticar a interface móvel.
- Componentes devem reorganizar layout conforme o espaço disponível usando estruturas fluidas, Grid/Flex e breakpoints orientados ao conteúdo.
- Não será aceita rolagem horizontal da página, texto cortado, botão inacessível, modal maior que a viewport ou interface dependente de resolução fixa.
- A interface deve suportar telas pequenas a partir de aproximadamente 320 px, celulares comuns, tablets, notebooks, Full HD e ultrawide.
- Interações essenciais precisam funcionar com toque, mouse e teclado quando aplicável.
- Alvos de toque no mobile devem ser confortáveis; controles de desktop podem aproveitar hover/focus sem depender exclusivamente deles.
- Teclado virtual, áreas seguras de iPhone, orientação retrato/paisagem e mudanças de viewport não podem quebrar a partida.
- Chat, voz, votação, seleção de alvo, timers, avisos e ações do anfitrião devem permanecer utilizáveis em qualquer viewport suportada.
- Animações devem ser responsivas, leves, não bloquear ações críticas e respeitar `prefers-reduced-motion`.
- Cada nova tela deverá ser revisada visual e funcionalmente em pelo menos um viewport mobile e um desktop antes de ser considerada pronta.

### Comunicação

- Voz em tempo real acontecerá **dentro do próprio Vila Oculta**.
- Chat escrito em tempo real acontecerá **dentro do próprio Vila Oculta**.
- Jogadores não dependerão de WhatsApp, Discord, Google Meet, Omegle, chamada telefônica ou outro aplicativo externo para a comunicação da partida.
- Não haverá câmera/vídeo na primeira versão.
- O áudio não será gravado por padrão.
- Supabase não será usado para transportar áudio; a camada de voz será WebRTC com solução apropriada para salas multiplayer.
- LiveKit é a preferência inicial, mas a escolha Cloud versus self-hosted ainda depende de comparação técnica/custo e aprovação.

### Noite e chat escrito

- Durante a fase noturna, o **chat escrito fica totalmente oculto da interface**.
- O painel de chat retorna somente quando a fase permitida começar novamente.
- Jogadores sem ação noturna não ficam diante de uma tela vazia: recebem uma experiência visual/animada de espera coerente com a atmosfera da noite.
- Jogadores com ação noturna também passam por uma transição/animação coerente antes ou junto da interface privada de ação.
- A apresentação visual deve reduzir pistas observáveis sobre quem está apenas aguardando e quem está executando uma ação secreta.
- A animação deve existir e funcionar tanto em celular quanto em desktop, adaptando enquadramento, controles e densidade ao viewport.

### Xerife

- O **Xerife trabalha sozinho** durante sua ação investigativa; não existe canal privado de aliados, chat secreto ou grupo especial para ele.
- A investigação é uma informação privada do próprio Xerife.
- A cada investigação válida, o Xerife recebe somente uma resposta binária sobre o alvo: **“É Assassino”** ou **“Não é Assassino”**.
- O Xerife **não descobre o personagem exato** do alvo. Assim, Cidadão e Anjo permanecem indistinguíveis entre si para essa habilidade.
- Essa escolha segue a estrutura clássica de papéis investigativos em Mafia/Cop, preservando informação útil sem resolver o tabuleiro inteiro cedo demais.
- Quando a fase de discussão começa, o chat escrito e a voz geral dos jogadores vivos ficam disponíveis conforme as regras normais da discussão.
- O Xerife pode usar o que descobriu para acusar, sugerir suspeitos, blefar ou tentar convencer os demais — funcionando socialmente como uma espécie de “X9”.
- O sistema **não confirma publicamente** que o Xerife está dizendo a verdade, não identifica automaticamente o Xerife para os outros jogadores e não publica sua investigação.

### Voz de jogadores eliminados

- Ao ser eliminado, o jogador **deixa imediatamente o canal de voz dos jogadores vivos**.
- O eliminado entra em um **canal de voz exclusivo para jogadores eliminados**.
- Jogadores vivos não podem ouvir o canal dos eliminados.
- Jogadores eliminados não podem falar nem transmitir áudio para o canal dos vivos.
- Essa separação deve ser aplicada no servidor/serviço de voz, e não apenas pela interface.
- O jogador eliminado continua acompanhando apenas os acontecimentos públicos da partida.

### Personagens da primeira versão

A composição de personagens da V1 foi aprovada com estes quatro papéis:

- **Cidadão**;
- **Assassino**;
- **Xerife**;
- **Anjo**.

Os nomes acima substituem, para a V1, os nomes provisórios usados na documentação inicial do legado (`Morador`, `Oculto`, `Vigia` e `Guardião`).

A aprovação dos quatro nomes/papéis **não aprova automaticamente detalhes de habilidade que ainda não foram definidos**, como auto-proteção do Anjo, repetição de alvo e composição numérica por quantidade de jogadores.

### Segurança e autoridade

- Regras críticas, fase atual, permissões e autorização de fala não podem depender apenas do estado do cliente.
- O servidor será a fonte confiável do estado da partida.
- Tokens de voz deverão ser emitidos no servidor e ser curtos/temporários.
- Credenciais privadas não poderão ser enviadas ao navegador nem versionadas.

### Repositórios

- `Kelber0021/CIDADE-DORME-` será somente referência e não será modificado.
- `Kelber0021/VILA-OCULTA` é o repositório oficial da reconstrução.
- Não criar outro repositório semelhante.
- `main` deverá permanecer estável.

### Processo de decisão

- Fazer uma pergunta de produto por vez.
- Não impor limite de tempo para resposta.
- Não perguntar novamente algo já documentado.
- Não alterar decisão aprovada sem consultar o proprietário.
- Não declarar que algo funciona, foi publicado, está seguro ou foi enviado sem verificação real.

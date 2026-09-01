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

### Tasks durante a partida: escolhas de ação e caminho

- As tasks fazem parte da **partida em andamento**, não são missões de progresso de conta.
- A task principal é uma **decisão contextual do jogador naquela rodada**, não apenas uma pergunta ou checklist.
- Durante a noite, o jogo pode apresentar opções como ficar em casa, ir até um local, observar uma área, verificar um acontecimento ou executar uma ação permitida pelo personagem.
- O jogador escolhe o que deseja fazer e essa decisão passa a compor o **caminho/rota daquela pessoa na rodada**.
- O servidor registra e valida a escolha; o jogador não pode posteriormente inventar outra rota pelo cliente.
- Essas escolhas podem alimentar encontros, pistas, álibis, contradições e o mini-enredo da sessão, sempre respeitando informação secreta e autorização.
- A noite deve ser jogável também para personagens sem poder especial quando a rodada oferecer escolhas comuns; isso não concede a eles o poder de outro personagem.
- O **Xerife escolhe um suspeito para acompanhar durante a noite** e trabalha sozinho nessa ação.
- O resultado exato que o Xerife obtém ao acompanhar continua limitado às regras aprovadas; não presumir visão de rota, local ou ação exata do alvo sem nova decisão.
- O modelo anteriormente aprovado de resposta binária `É Assassino / Não é Assassino` continua válido até que uma nova decisão o altere; o ato de “acompanhar” pode ser a apresentação/execução dessa investigação.

### Caderno de investigação e acusação

- O caderno é separado das tasks de ação: **task = o que o jogador fez; caderno = o que ele percebeu/suspeitou**.
- Durante a fase de discussão, o jogo pode fazer perguntas curtas para ajudar o jogador a organizar sua suspeita antes de acusar alguém.
- Exemplos aprovados: **“Quem chamou sua atenção?”**, **“Por que ele é suspeito?”**, **“O que aconteceu?”** e **“Qual indício sustenta sua acusação?”**.
- As respostas formam um caderno privado, relacionando indícios a jogadores específicos.
- Antes de formalizar uma acusação, a interface deve pedir ao jogador que selecione ou registre pelo menos um motivo/indício.
- O sistema não transforma opinião em verdade objetiva; preserva blefe, mentira, erro e manipulação social.
- Evidências objetivas produzidas pelo motor, quando autorizadas, ficam diferenciadas de observações sociais.
- A mecânica deve ser rápida e intuitiva, nunca um formulário burocrático.

### Mini-enredos dinâmicos

- O jogo deve contar **mini-enredos durante a própria partida**.
- Esses mini-enredos devem variar de partida para partida e de rodada para rodada, evitando que a experiência pareça repetir sempre os mesmos textos.
- A narrativa pode reagir a acontecimentos públicos reais da sessão, como amanhecer sem eliminação, eliminação noturna, julgamento, diminuição do número de jogadores e outros eventos já autorizados pelo motor.
- A mesma partida deve manter uma pequena continuidade narrativa, usando elementos recorrentes como clima, lugares e acontecimentos da vila.
- Partidas diferentes podem começar com arcos narrativos diferentes, por exemplo: chuva e pegadas, sino da capela, neblina no moinho, carta encontrada, janela quebrada ou outro acontecimento compatível com o universo do jogo.
- O mini-enredo pode fornecer contexto para as opções das tasks, como investigar capela, praça, moinho ou outro ponto ativado pelo arco daquela sessão.
- A narrativa **não pode revelar nem insinuar de forma determinística informação secreta** sobre Assassino, Xerife, Anjo, investigação, proteção ou alvo privado.
- Na V1, a implementação recomendada é um motor narrativo baseado em templates, tags e estado público sanitizado, sem depender obrigatoriamente de IA generativa em tempo real.
- Os mini-enredos devem funcionar em celular e desktop, com apresentação curta, legível, atmosférica e sem bloquear ações importantes.
- A decisão de permitir que esses enredos alterem mecanicamente a partida além de contextualizar as tasks ainda não está aprovada.

### Xerife

- O **Xerife trabalha sozinho** durante sua ação investigativa; não existe canal privado de aliados, chat secreto ou grupo especial para ele.
- Durante o dia, pode organizar uma lista privada de suspeitos.
- Durante a noite, escolhe um suspeito/alvo válido para **acompanhar**.
- A investigação é uma informação privada do próprio Xerife.
- Pela regra atualmente aprovada, uma investigação válida entrega a resposta binária **“É Assassino”** ou **“Não é Assassino”**.
- O Xerife **não descobre o personagem exato** do alvo. Assim, Cidadão e Anjo permanecem indistinguíveis entre si para essa habilidade.
- O novo conceito de “acompanhar” não autoriza automaticamente que o Xerife veja o trajeto, o local visitado ou a ação exata do alvo; isso requer decisão específica.
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
- Tasks, rotas, consequências, investigação, proteção e ataque devem ser validados pelo servidor.

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

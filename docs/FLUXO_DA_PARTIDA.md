# Fluxo da Partida — Vila Oculta

Status: fluxo conceitual consolidado a partir do legado e das decisões atuais. Estados definitivos serão fechados junto ao motor.

## 1. Entrada no jogo

1. Jogador abre o Vila Oculta no navegador.
2. Pode criar uma sala ou entrar em sala existente.
3. Quem cria recebe identidade segura de anfitrião no servidor.
4. Quem entra informa código/link e passa por validação real da sala.
5. Cada jogador escolhe nome e avatar/ícone.
6. Antes de usar voz, o jogo explica o uso do microfone e solicita permissão.

A entrada deve funcionar de forma equivalente em celular e desktop, com composição de interface adaptada ao viewport.

## 2. Lobby

O lobby deve sincronizar em tempo real:

- jogadores conectados;
- anfitrião;
- pronto/não pronto, se adotado;
- estado de conexão;
- estado do microfone;
- entrada no canal de voz;
- configurações da sala;
- código/link de convite.

Durante o lobby, a arquitetura deve permitir conversa por voz entre todos os participantes.

No desktop, lista de jogadores, configurações e controles de voz podem ocupar áreas simultâneas. No mobile, esses mesmos elementos devem se reorganizar em painéis, abas, drawers ou regiões empilhadas sem esconder ações importantes.

O anfitrião pode configurar e iniciar a partida quando a composição for válida.

## 3. Preparação

Ao iniciar:

1. servidor bloqueia alterações incompatíveis com partida em andamento;
2. composição de personagens é validada;
3. personagens são distribuídos secretamente;
4. cada jogador recebe somente sua própria informação privada;
5. anfitrião não recebe acesso especial aos personagens;
6. todos confirmam a revelação quando a regra exigir.

## 4. Revelação individual

Cada jogador recebe tela privada com:

- nome do personagem;
- facção/lado;
- objetivo;
- habilidade;
- limitações;
- instrução curta.

A experiência pode usar gesto de pressionar/segurar, clique sustentado ou mecanismo equivalente, garantindo funcionamento por toque e mouse/teclado quando apropriado.

## 5. Noite

O servidor muda a partida para estado noturno.

O **chat escrito desaparece completamente da interface durante a noite**.

### Para jogadores sem ação

- recebem uma experiência visual/animada de espera;
- não ficam diante de tela vazia;
- não recebem informação que denuncie quem está agindo;
- aguardam resolução;
- a animação adapta enquadramento e densidade entre celular e desktop.

### Para jogadores com ação

1. recebem uma transição/animação coerente com a mesma atmosfera noturna;
2. servidor informa ação permitida;
3. cliente apresenta apenas alvos válidos;
4. jogador escolhe alvo;
5. confirmação é solicitada;
6. servidor valida fase, sessão, personagem, alvo e duplicação;
7. ação é registrada;
8. jogador entra em estado de espera.

As diferenças entre tela passiva e tela de ação devem ser discretas o suficiente para não gerar pistas externas óbvias sobre o personagem.

### Xerife durante a noite

- age sozinho;
- não possui canal privado de aliados;
- não possui chat secreto;
- escolhe individualmente seu alvo de investigação;
- recebe sua informação de forma privada;
- o resultado não é publicado automaticamente aos outros jogadores.

A voz pode ser restringida durante a noite conforme regras aprovadas. O bloqueio precisa existir no servidor/serviço de voz, não só no botão visual.

## 6. Resolução da noite

Quando ações necessárias forem recebidas ou o tempo expirar:

1. servidor resolve ações por prioridade definida;
2. aplica proteções/efeitos;
3. calcula consequências;
4. registra eventos necessários para auditoria técnica;
5. não expõe informação secreta indevida;
6. verifica imediatamente condição de vitória quando aplicável.

## 7. Amanhecer

A transição deve comunicar somente acontecimentos públicos:

- eliminação, se houver;
- ausência de eliminação;
- estado atualizado dos participantes;
- texto narrativo compatível com as regras.

Não revelar automaticamente causa, personagem responsável ou ações secretas.

## 8. Discussão

Na reconstrução atual, a discussão ocorre remotamente com **voz e chat escrito dentro do Vila Oculta**.

Ao começar a discussão, o chat que estava oculto durante a noite volta a aparecer para os jogadores autorizados.

A tela principal deve mostrar:

- jogadores vivos;
- jogadores eliminados;
- cronômetro;
- número do dia/rodada;
- último acontecimento público;
- chat escrito;
- controles de voz;
- estado de conexão/reconexão;
- controles de anfitrião permitidos.

O **Xerife**, que investigou sozinho, participa normalmente do canal geral. Ele pode acusar alguém, compartilhar uma suspeita, blefar ou tentar convencer os outros usando a informação que recebeu, como uma espécie de “X9”. O sistema não comprova publicamente que ele é Xerife nem valida sua acusação para os demais.

Jogadores eliminados não participam da conversa de voz dos vivos. Eles permanecem em um canal separado exclusivo de eliminados.

No desktop, chat, lista de jogadores e área principal podem coexistir lado a lado quando houver espaço. No mobile, a experiência deve priorizar a fase atual e permitir abrir/fechar chat e demais painéis sem perder timer, voz ou ação principal.

## 9. Votação

1. servidor abre votação;
2. cada jogador vivo recebe lista de alvos válidos;
3. jogador escolhe e confirma voto;
4. servidor rejeita voto duplicado, inválido ou fora de fase;
5. cliente mostra somente progresso permitido, não escolhas secretas;
6. quando todos votarem ou o tempo expirar, servidor fecha votação.

A seleção de alvo precisa funcionar confortavelmente com toque no celular e mouse/teclado no desktop.

Se troca de voto estiver permitida, isso precisa obedecer a regra de confirmação e idempotência definida.

## 10. Julgamento

1. votos são resolvidos no servidor;
2. empate segue política configurada;
3. resultado público é apresentado;
4. animação/transição não pode impedir acesso a informação importante;
5. se houver eliminado, servidor atualiza estado do jogador;
6. revelar personagem depende da configuração da sala.

## 11. Eliminação

Jogador eliminado:

- continua conectado;
- não vota;
- não executa ação noturna;
- não recebe informação secreta nova;
- acompanha acontecimentos públicos;
- não consegue alterar resultado por manipulação do cliente;
- é removido do canal de voz dos vivos;
- entra no canal de voz exclusivo dos eliminados;
- pode conversar com outros eliminados nesse canal;
- não pode transmitir áudio aos vivos nem ouvir o canal privado dos vivos.

A troca de canal deve ser imposta pelo servidor/serviço de voz, inclusive após recarregamento da página, reconexão ou tentativa de manipular o cliente.

## 12. Verificação de vitória

Após cada resolução relevante, o servidor avalia:

- se restam Assassinos;
- se a condição de vitória dos Assassinos foi alcançada;
- futuras condições independentes, se existirem.

Se ninguém venceu, inicia-se novo ciclo. Se existe vencedor, vai para resultado.

## 13. Resultado

Tela final deve poder apresentar:

- lado/facção vencedora;
- personagens após o fim da partida;
- acontecimentos principais;
- votos/ações quando a política permitir;
- linha do tempo resumida;
- revanche;
- retorno às configurações/início.

## 14. Reconexão

Reconexão é um fluxo transversal:

1. navegador detecta perda;
2. UI informa estado de reconexão;
3. sessão segura tenta recuperar identidade;
4. servidor retorna snapshot autoritativo;
5. Realtime e voz são reconectados;
6. jogador volta à tela/estado correto sem repetir ação já confirmada;
7. se estiver eliminado, retorna ao canal de voz dos eliminados e nunca ao canal dos vivos;
8. atualização de página deve seguir o mesmo princípio;
9. a restauração deve respeitar o layout correspondente ao viewport atual, inclusive após mudança de orientação ou tamanho da janela.

## 15. Máquina de estados sugerida

A implementação deve representar explicitamente estados equivalentes a:

- `lobby`;
- `preparing`;
- `role_distribution`;
- `role_reveal`;
- `night`;
- `night_actions`;
- `night_resolution`;
- `dawn`;
- `discussion`;
- `voting`;
- `judgment`;
- `elimination`;
- `victory_check`;
- `result`;
- `ended`.

Nomes internos podem mudar durante desenho técnico, mas cada transição precisará ser explícita e testável.

## 16. Regra transversal de responsividade

Cada etapa acima deve ser implementada e testada em navegador mobile e desktop.

- nenhuma resolução fixa;
- nenhuma página com rolagem horizontal;
- nenhuma ação crítica escondida por teclado virtual, notch/safe area ou viewport pequena;
- nenhuma experiência desktop tratada como simples celular ampliado;
- nenhuma interação essencial dependente apenas de hover;
- animações adaptativas e com suporte a `prefers-reduced-motion`;
- timers, estado de voz, conexão e ação principal permanecem acessíveis durante reorganização do layout.

## 17. Diferença em relação ao legado

O protótipo antigo termina praticamente no lobby e foi pensado para conversa presencial. O novo fluxo transforma a experiência em multiplayer remoto completo com voz, chat, presença, regras sincronizadas e servidor autoritativo, com interface web projetada para celular e PC desde a origem.

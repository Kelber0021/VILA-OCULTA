# Fluxo da Partida — Vila Oculta

Status: fluxo conceitual consolidado a partir do legado e das decisões atuais. Estados definitivos serão fechados junto ao motor.

## 1. Entrada no jogo

1. Jogador abre o Vila Oculta no navegador.
2. Pode criar uma sala ou entrar em sala existente.
3. Quem cria recebe identidade segura de anfitrião no servidor.
4. Quem entra informa código/link e passa por validação real da sala.
5. Cada jogador escolhe nome e avatar/ícone.
6. Antes de usar voz, o jogo explica o uso do microfone e solicita permissão.

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
- facção;
- objetivo;
- habilidade;
- limitações;
- instrução curta.

A experiência pode usar gesto de pressionar/segurar ou mecanismo equivalente para reduzir exposição acidental em telas próximas, mas isso será adaptado ao contexto remoto.

## 5. Noite

O servidor muda a partida para estado noturno.

### Para jogadores sem ação

- tela neutra;
- sem informação que denuncie quem está agindo;
- aguardam resolução.

### Para jogadores com ação

1. servidor informa ação permitida;
2. cliente apresenta apenas alvos válidos;
3. jogador escolhe alvo;
4. confirmação é solicitada;
5. servidor valida fase, sessão, personagem, alvo e duplicação;
6. ação é registrada;
7. jogador entra em estado de espera.

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

Na reconstrução atual, a discussão ocorre remotamente com **voz dentro do Vila Oculta**.

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

Jogadores eliminados não participam da conversa de voz dos vivos. Eles permanecem em um canal separado exclusivo de eliminados.

## 9. Votação

1. servidor abre votação;
2. cada jogador vivo recebe lista de alvos válidos;
3. jogador escolhe e confirma voto;
4. servidor rejeita voto duplicado, inválido ou fora de fase;
5. cliente mostra somente progresso permitido, não escolhas secretas;
6. quando todos votarem ou o tempo expirar, servidor fecha votação.

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
8. atualização de página deve seguir o mesmo princípio.

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

## 16. Diferença em relação ao legado

O protótipo antigo termina praticamente no lobby e foi pensado para conversa presencial. O novo fluxo transforma a experiência em multiplayer remoto completo com voz, chat, presença, regras sincronizadas e servidor autoritativo.

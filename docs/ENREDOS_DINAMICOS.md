# Mini-enredos Dinâmicos — Vila Oculta

Status: **mecânica narrativa aprovada em nível conceitual; impacto mecânico ainda depende de decisão específica**.

## Objetivo

Vila Oculta deve contar **mini-enredos durante a própria partida**, fazendo cada sessão parecer uma história diferente em vez de repetir sempre as mesmas frases de noite, amanhecer, discussão e eliminação.

Os mini-enredos podem variar:

- de partida para partida;
- de rodada para rodada;
- conforme quem foi eliminado;
- conforme houve ou não proteção bem-sucedida;
- conforme houve ou não morte durante a noite;
- conforme o número de jogadores restantes;
- conforme a tensão atual da partida;
- conforme eventos públicos que o motor está autorizado a revelar.

## Princípio principal

A narrativa deve reagir ao estado real da partida, mas **nunca vazar informação secreta**.

O texto pode criar clima, levantar dúvidas e contextualizar acontecimentos públicos, porém não pode revelar:

- quem é Assassino;
- quem é Xerife;
- quem é Anjo;
- quem foi investigado pelo Xerife;
- quem foi protegido pelo Anjo;
- quem escolheu determinado alvo;
- qualquer dado privado que os jogadores não deveriam conhecer.

## Exemplo de continuidade narrativa

Uma partida pode começar com um acontecimento simples:

> A chuva caiu durante toda a madrugada. Pela manhã, marcas de barro cortavam a praça central.

Na rodada seguinte, o jogo pode continuar a mesma linha:

> As marcas desapareceram perto do antigo poço. Alguém tentou apagá-las antes do amanhecer.

Em outra partida, o cenário pode ser totalmente diferente:

> O sino da capela tocou sozinho às três da manhã. Quando a vila despertou, uma das casas estava com a porta aberta.

A intenção é criar a sensação de que existe **uma pequena história acontecendo junto da partida**, sem transformar o jogo em uma campanha longa.

## Estrutura por sessão

Ao criar uma sala, o servidor pode escolher um `story_seed` ou arco narrativo curto para aquela sessão.

Esse arco define elementos como:

- clima: chuva, neblina, vento, céu limpo, tempestade;
- local de destaque: praça, capela, moinho, bosque, poço, taverna, estrada;
- elemento recorrente: pegadas, sino, vela, carta, janela quebrada, animal assustado, objeto abandonado;
- tom: investigação, superstição, desaparecimento, perseguição, silêncio incomum;
- conjunto de frases e variações compatíveis.

A cada rodada, o motor escolhe uma continuação válida levando em conta o estado público da partida.

## Eventos narrativos públicos

O sistema narrativo pode reagir a fatos como:

### Ninguém foi eliminado à noite

Exemplo:

> A vila despertou inteira. Ainda assim, alguém encontrou marcas recentes na porta de uma casa.

Isso cria tensão sem dizer por que ninguém morreu.

### Um jogador foi eliminado à noite

Exemplo:

> Quando a névoa baixou, uma porta permaneceu aberta. A vila percebeu que alguém não voltaria para a discussão daquela manhã.

O nome da vítima pode aparecer somente no momento autorizado pela regra pública.

### Eliminação por votação

Exemplo:

> Sob o sino da praça, a vila tomou sua decisão. Alguns pareciam aliviados. Outros sequer levantaram os olhos.

### Poucos jogadores restantes

Exemplo:

> As ruas parecem maiores agora. Há menos vozes na praça e qualquer silêncio chama atenção.

## Relação com as tasks investigativas

Os mini-enredos podem alimentar a **atmosfera das perguntas das tasks**, sem transformar automaticamente o texto narrativo em prova real.

Exemplo:

Narrativa pública:

> Uma lanterna foi encontrada apagada perto do moinho.

A task pode perguntar:

- **“Alguém comentou sobre o moinho?”**
- **“Quem pareceu desconfortável com esse acontecimento?”**
- **“Isso muda sua suspeita sobre alguém?”**

As respostas continuam sendo interpretação do jogador.

## Variação e anti-repetição

O sistema deve evitar sensação de texto aleatório repetitivo.

Requisitos:

- não repetir a mesma abertura em rodadas consecutivas;
- manter coerência básica dentro da mesma partida;
- permitir múltiplas variações para o mesmo tipo de evento;
- evitar frases que contradigam acontecimentos anteriores;
- usar histórico narrativo curto da sessão para escolher continuação;
- permitir expansão futura de pacotes narrativos sem alterar o motor central.

## Implementação recomendada

A primeira versão não precisa depender de IA generativa em tempo real.

É mais seguro e previsível começar com um **motor narrativo determinístico baseado em templates**, tags e condições do estado da partida.

Exemplo de estrutura conceitual:

- `story_seed` da sessão;
- `chapter`/rodada atual;
- `public_event_type`;
- `location_tag`;
- `mood_tag`;
- `previous_narrative_ids`;
- lista de templates compatíveis;
- escolha pseudoaleatória controlada no servidor.

Isso permite variedade sem risco de uma IA inventar regra, vazar papel secreto ou gerar conteúdo incoerente.

Uma camada de IA narrativa poderá ser estudada futuramente, desde que receba apenas dados públicos/sanitizados e exista fallback seguro por templates.

## UX web

### Mobile

- mini-enredo aparece em card/transição curta;
- texto breve e legível;
- ação principal disponível rapidamente;
- possibilidade de rever o último acontecimento público;
- animações leves, sem travar a partida.

### Desktop

- pode usar composição mais cinematográfica;
- texto pode coexistir com cenário, jogadores e linha do tempo pública;
- espaço adicional pode mostrar um pequeno histórico da narrativa da partida.

Em ambos os casos, o mini-enredo deve ser consumido em poucos segundos e nunca bloquear uma ação urgente.

## Segurança narrativa

Todo template precisa declarar quais variáveis públicas pode receber.

Nunca enviar para a camada narrativa dados como:

- role real de jogadores vivos;
- resultado privado do Xerife;
- alvo do Anjo;
- escolha do Assassino antes de tornar-se acontecimento público;
- tokens ou identificadores privados;
- caderno de investigação de outro jogador.

O servidor fornece apenas um `public narrative context` sanitizado.

## Regra ainda não decidida

Está aprovado que os mini-enredos existam e variem ao longo das partidas.

Ainda precisa ser decidido se eles serão **somente narrativos/atmosféricos** ou se, em alguns modos, poderão também introduzir pistas ou eventos que alterem mecanicamente a partida.

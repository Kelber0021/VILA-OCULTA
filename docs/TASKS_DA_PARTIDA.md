# Tasks da Partida — Vila Oculta

Status: **mecânica central aprovada em nível conceitual; catálogo de ações e consequências ainda será refinado**.

## Ideia central

As tasks do Vila Oculta acontecem **durante a própria partida**. Elas não são missões de progresso, conquistas ou tarefas de conta.

Uma task representa uma **escolha concreta do jogador naquela rodada**.

Em vez de apenas assistir a fase acontecer, o jogador recebe opções contextuais como:

- ficar em casa;
- sair para observar;
- ir até determinado local da vila;
- acompanhar alguém;
- verificar um acontecimento;
- cumprir a ação própria do personagem;
- escolher outra rota permitida para aquela rodada.

O jogador escolhe o que quer fazer. Essa decisão forma o **caminho daquela pessoa na rodada** e pode gerar encontros, observações, pistas, álibis, contradições ou acontecimentos narrativos que serão usados depois na discussão.

## Tasks não são um formulário

A experiência deve parecer uma decisão dentro de um jogo.

Exemplo simplificado:

> A noite começou. O que você vai fazer?
>
> **Ficar em casa**  
> **Ir até a praça**  
> **Observar a rua do moinho**

Depois da escolha, o jogador acompanha uma pequena sequência visual coerente com a rota selecionada.

As opções disponíveis podem variar conforme:

- personagem;
- rodada;
- mini-enredo ativo;
- estado público da vila;
- locais/eventos habilitados naquela sessão;
- ações já realizadas;
- regras de segurança e balanceamento.

## Caminho por rodada

O servidor deve registrar de forma autoritativa a decisão permitida de cada jogador.

Exemplo conceitual:

`rodada 2 → jogador Gabriel → praça → observar sino`

Isso não significa mostrar esse caminho aos demais. O caminho é informação de jogo e sua visibilidade depende das regras.

O cliente nunca poderá inventar posteriormente que percorreu uma rota diferente.

## Relação com os assassinatos

Quando os assassinatos entram em cena, as tasks também entram em cena como parte da noite.

Enquanto o Assassino possui sua ação secreta de escolher/realizar o ataque, os demais jogadores também podem receber escolhas compatíveis com seus papéis e com o mini-enredo daquela rodada.

A intenção é que a noite seja um momento jogável e investigável, não somente uma tela em que a maioria espera o Assassino terminar.

## Xerife: acompanhar suspeitos

O Xerife trabalha sozinho.

Durante a discussão, ele pode manter uma lista privada de suspeitos. Quando chega a noite, escolhe **quem deseja acompanhar** entre os alvos válidos.

Fluxo conceitual:

1. durante o dia, o Xerife cria ou atualiza suas suspeitas;
2. a noite começa;
3. o jogo mostra seus suspeitos/alvos válidos;
4. o Xerife escolhe uma pessoa para acompanhar;
5. o servidor registra a decisão;
6. a experiência noturna do Xerife acompanha aquela escolha;
7. o sistema entrega somente a informação que a regra do Xerife autorizar;
8. no dia seguinte, o Xerife decide como usar socialmente o que descobriu.

O Xerife não possui equipe secreta, parceiro, canal privado ou chat especial.

### Informação do acompanhamento

A forma exata de informação produzida por **acompanhar alguém** ainda precisa ser fechada como regra.

A documentação anterior aprovou uma resposta binária `É Assassino / Não é Assassino`. O novo modelo de acompanhamento pode ser apresentado visualmente como a forma de executar essa investigação, mas **não será presumido que o Xerife veja rota, local ou ação exata do alvo sem nova decisão explícita**.

## Outros jogadores

O sistema de tasks deve permitir que jogadores sem poder investigativo também façam escolhas durante a noite quando a rodada oferecer possibilidades.

Essas escolhas não precisam conceder poderes de personagem.

Um Cidadão, por exemplo, pode escolher uma rota narrativa/investigativa sem ganhar a capacidade especial do Xerife.

O Anjo continua tendo sua proteção como ação especial própria.

O Assassino continua tendo sua ação secreta própria.

O catálogo definitivo de ações comuns ainda precisa ser balanceado.

## Encontros e pistas

Quando duas ou mais rotas interagem, o motor pode produzir um acontecimento permitido pela regra.

Exemplos conceituais:

- alguém percebeu movimento perto da praça;
- um jogador encontrou um objeto ligado ao mini-enredo;
- duas pessoas dizem ter passado pelo mesmo local;
- alguém afirma que ficou em casa, mas outra informação cria dúvida;
- um acontecimento público do amanhecer se conecta a uma área escolhida na noite.

Essas pistas não podem ser fabricadas livremente pelo cliente e não podem revelar automaticamente papéis secretos.

## Caderno de investigação

O **caderno** é separado das tasks.

- task = o que o jogador decidiu fazer;
- caderno = o que ele anotou, percebeu ou suspeitou;
- acusação = como ele usa essas informações socialmente.

Durante a discussão, o jogo pode perguntar:

1. **Quem chamou sua atenção?**
2. **Por que ele é suspeito?**
3. **O que aconteceu?**
4. **Qual indício sustenta sua suspeita?**
5. **Você quer guardar isso ou usar em uma acusação?**

O jogador não precisa escrever relatório. A interação deve ser rápida, com opções de toque/clique e observação livre opcional.

## Antes de acusar

Uma acusação formal deve pedir um mínimo de justificativa.

Fluxo sugerido:

1. selecionar jogador a acusar;
2. responder **“Por que ele é suspeito?”**;
3. selecionar um ou mais indícios já anotados ou registrar um novo;
4. revisar acusação;
5. confirmar.

O sistema não decide se a justificativa é verdadeira. Ele organiza o raciocínio e preserva o espaço para blefe, mentira, erro e manipulação social.

## Mini-enredos + tasks

Os mini-enredos fornecem contexto às escolhas.

Exemplo:

> O sino da capela tocou sozinho durante a madrugada.

Uma rodada pode oferecer rotas como:

- investigar a capela;
- observar a praça;
- permanecer em casa;
- acompanhar um suspeito, quando o personagem/regra permitir.

Na rodada seguinte, o mini-enredo pode reagir às consequências autorizadas dessas escolhas sem revelar informação secreta indevida.

## Segurança e privacidade

- toda escolha de task é validada no servidor;
- o servidor define quais opções cada jogador pode receber;
- o jogador não pode trocar de rota após confirmação fora das regras;
- refresh/reconexão restaura a ação já confirmada e não permite duplicação;
- caminhos privados não são enviados a clientes não autorizados;
- uma rota nunca deve revelar automaticamente o personagem de alguém;
- logs técnicos não devem registrar segredos de forma insegura;
- as informações temporárias da sessão são descartadas conforme a política de retenção.

## UX web responsiva

### Mobile

- uma decisão por vez;
- opções grandes e fáceis de tocar;
- transições curtas entre escolha, confirmação e consequência;
- mapa/lista de locais adaptado para tela pequena;
- timer e estado importante permanecem acessíveis;
- caderno abre em bottom sheet/drawer/card.

### Desktop

- pode mostrar a vila/rotas com mais contexto espacial;
- opções e informações podem ocupar áreas laterais sem transformar a tela em dashboard;
- caderno, jogadores e contexto podem coexistir quando houver espaço;
- mouse/teclado podem agilizar, sem serem obrigatórios.

## Princípio de design

A sensação deve ser:

**“A noite chegou. O que você vai fazer?”**

E não:

**“Complete esta tarefa.”**

O jogador escolhe, o mundo reage, a informação vira suspeita e a suspeita alimenta a discussão.
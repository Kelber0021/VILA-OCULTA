# Tasks da Partida — Vila Oculta

Status: **mecânica aprovada em nível conceitual; detalhes de UX e regras finas ainda serão refinados**.

## Objetivo

As tasks do Vila Oculta acontecem **durante a própria partida** e servem para guiar investigação, suspeita, argumentação e acusação. Elas não são missões de progresso, conquistas ou objetivos de conta.

A intenção é evitar uma discussão solta demais e ajudar cada jogador a construir uma linha de raciocínio antes de acusar alguém.

## Fluxo intuitivo

Durante a discussão, o jogo pode apresentar perguntas curtas em sequência:

1. **Quem chamou sua atenção?**
2. **Por que ele é suspeito?**
3. **O que aconteceu?**
4. **Qual indício sustenta sua suspeita?**
5. **Você quer guardar isso ou usar em uma acusação?**

O jogador não precisa escrever um relatório. A interação deve ser rápida, com opções de toque/clique e observação livre opcional.

## Caderno de investigação

Cada jogador vivo possui um caderno privado durante a sessão.

Para cada suspeito, o caderno pode armazenar:

- jogador relacionado;
- fase/rodada em que o indício foi registrado;
- categoria do indício;
- observação curta;
- origem: observação social ou informação de jogo que aquele jogador tem permissão para conhecer;
- nível de confiança, caso essa opção seja aprovada depois;
- estado: apenas anotado, usado em acusação ou descartado.

## Exemplos de indícios sociais

A interface pode oferecer atalhos como:

- mudou de versão;
- acusou sem explicar;
- defendeu alguém de forma estranha;
- mudou o voto;
- ficou evitando responder;
- entrou em contradição;
- comportamento suspeito;
- outro motivo.

Essas opções representam **opiniões/observações do jogador**, não fatos confirmados pelo sistema.

## Evidência de jogo x suspeita social

O sistema deve diferenciar claramente:

### Suspeita social

Algo que o jogador interpretou durante voz, chat ou comportamento da rodada.

Exemplo: “Gabriel defendeu Lucas logo depois da acusação.”

### Informação privada autorizada

Algo revelado pelo motor somente para aquele personagem/jogador.

Exemplo: uma investigação do Xerife.

Essa informação **não vira pública automaticamente**. O jogador decide como usá-la socialmente, respeitando as regras do personagem.

## Antes de acusar

Uma acusação formal deve pedir um mínimo de justificativa.

Fluxo sugerido:

1. selecionar jogador a acusar;
2. pergunta: **“Por que ele é suspeito?”**;
3. selecionar um ou mais indícios já anotados ou registrar um novo;
4. revisar acusação;
5. confirmar.

O sistema não decide se a justificativa é boa ou verdadeira. Ele apenas exige que exista uma linha de raciocínio registrada antes da acusação.

## Relação com discussão por voz e chat

As tasks não substituem voz ou chat.

Elas funcionam como apoio à discussão:

- o jogador escuta e conversa normalmente;
- registra suspeitas enquanto a discussão acontece;
- consulta o caderno quando quiser;
- usa os indícios para formular uma acusação;
- pode continuar blefando, omitindo ou interpretando fatos conforme a natureza social do jogo.

## Xerife

O Xerife trabalha sozinho durante a investigação noturna.

Quando a discussão começa:

- entra normalmente no canal geral dos vivos;
- pode registrar suspeitas no mesmo caderno usado pelos demais;
- pode associar sua informação privada ao alvo investigado;
- essa informação continua privada no sistema;
- ele decide se revela, insinua, blefa ou guarda a informação durante a discussão.

O jogo nunca confirma publicamente que uma acusação veio de um Xerife verdadeiro.

## Segurança e privacidade

- o caderno é privado por jogador;
- um jogador não pode consultar o caderno de outro pelo cliente;
- dados privados devem respeitar isolamento de sala e autorização no servidor;
- uma anotação privada não deve ser transmitida ao chat por acidente;
- refresh/reconexão deve restaurar somente o caderno autorizado daquele jogador enquanto a sessão existir;
- o caderno deve ser descartado junto com os dados temporários da sala conforme a política de retenção da partida.

## UX web responsiva

### Mobile

- botão discreto de “Suspeitas”/“Investigar”;
- painel em drawer/bottom sheet ou card expansível;
- perguntas em uma etapa por vez;
- alvos e motivos grandes o suficiente para toque;
- timer, voz e ação principal continuam visíveis ou facilmente acessíveis.

### Desktop

- caderno pode ocupar uma coluna lateral quando houver espaço;
- perguntas e lista de suspeitos podem coexistir com chat e jogadores;
- atalhos de mouse/teclado podem agilizar a interação sem serem obrigatórios.

Em nenhuma plataforma a task deve parecer um formulário corporativo.

## Princípio de design

A sensação deve ser de **investigação guiada dentro de um jogo**, não de preencher campos.

Perguntas curtas, linguagem natural, respostas rápidas e feedback visual devem fazer o jogador sentir que está montando um caso contra alguém.

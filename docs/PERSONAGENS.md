# Personagens — Vila Oculta

Status: **composição da primeira versão aprovada**.

A V1 terá exatamente estes quatro personagens:

- **Cidadão**;
- **Assassino**;
- **Xerife**;
- **Anjo**.

Os nomes provisórios encontrados no legado (`Morador`, `Oculto`, `Vigia` e `Guardião`) não serão usados como nomes oficiais da V1.

## Regra comum de voz após eliminação

Ao ser eliminado, qualquer personagem deixa o canal de voz dos vivos e passa para um canal exclusivo de eliminados. O jogador eliminado não pode transmitir áudio para os vivos nem ouvir conversas privadas destinadas somente aos vivos. A separação deve ser garantida pelo servidor/serviço de voz.

## Cidadão

**Papel aprovado:** personagem básico do lado da vila.  
**Objetivo geral:** participar da dedução, discussão e votação para ajudar a eliminar a ameaça.  
**Poder especial:** não possui poder equivalente ao Xerife ou Anjo.  
**Tasks noturnas:** quando a rodada oferecer escolhas comuns, pode decidir por ações/rotas narrativas e investigativas permitidas, como permanecer em determinado local, observar uma área ou verificar um acontecimento. Essas escolhas não transformam o Cidadão em personagem especial.  
**Experiência noturna:** recebe experiência animada e interativa coerente com a noite, evitando tela vazia e evitando pistas externas sobre quem possui poder especial.  
**Discussão e votação:** participa normalmente enquanto estiver vivo. Pode registrar suspeitas e usar o caderno de investigação.  
**Eliminação:** deixa de votar e de interferir mecanicamente na partida; passa ao canal de voz dos eliminados.  
**Risco de balanceamento:** baixo isoladamente; as opções comuns de task não podem entregar informação forte demais.

## Assassino

**Papel aprovado:** ameaça escondida da partida.  
**Objetivo geral:** sobreviver à dedução e eliminar jogadores do lado da vila até atingir a condição de vitória definida pelo motor.  
**Ação noturna especial:** realiza/participa da escolha de um alvo válido para o assassinato.  
**Tasks e rota:** sua experiência noturna pode ser apresentada dentro do mesmo sistema de escolhas/contexto da rodada, mas o ataque continua sendo uma ação secreta exclusiva e validada pelo servidor.  
**Experiência noturna:** recebe transição/animação coerente com a noite e interface privada para suas decisões autorizadas.  
**Informação secreta:** detalhes sobre conhecimento de outros Assassinos e coordenação entre eles ainda precisam ser formalizados conforme a composição numérica.  
**Eliminação:** perde qualquer ação de jogo e passa ao canal de voz dos eliminados.  
**Risco de balanceamento:** quantidade de Assassinos, coordenação e condição exata de vitória precisam escalar com o número total de jogadores.

## Xerife

**Papel aprovado:** personagem investigativo do lado da vila, que trabalha sozinho.  
**Objetivo geral:** construir suspeitos, acompanhar uma pessoa durante a noite e usar a informação obtida socialmente no dia seguinte.  
**Lista de suspeitos:** durante a discussão, pode manter um caderno privado com jogadores que deseja observar melhor.  
**Ação noturna:** escolhe sozinho um suspeito/alvo válido para **acompanhar**.  
**Trabalho em equipe secreto:** não existe; o Xerife não recebe canal privado, grupo de aliados ou chat secreto.  
**Informação atualmente aprovada:** uma investigação válida retorna **“É Assassino”** ou **“Não é Assassino”**.  
**Limite atual do acompanhamento:** o verbo “acompanhar” representa a forma de executar a investigação. Não está aprovado ainda que o Xerife veja automaticamente rota, local visitado ou ação exata do alvo.  
**Discussão:** quando o dia começa, participa do chat e da voz geral dos vivos. Pode acusar, insinuar, blefar ou tentar convencer os demais com base no que descobriu, como uma espécie de “X9”.  
**Prova pública:** o sistema não confirma aos demais que ele é Xerife nem que sua acusação é verdadeira; a investigação continua privada.  
**Auto-alvo/repetição:** ainda não definidos.  
**Eliminação:** perde a ação investigativa e passa ao canal de voz dos eliminados.  
**Risco de balanceamento:** informações adicionais de rota/ação podem tornar o Xerife forte demais e precisam de decisão e teste antes de implementação.

## Anjo

**Papel aprovado:** personagem protetor do lado da vila.  
**Objetivo geral:** impedir uma consequência noturna contra um alvo válido.  
**Ação noturna especial:** protege um jogador durante a noite.  
**Tasks e rota:** pode participar de escolhas comuns quando compatíveis com a rodada, mas sua proteção é uma permissão especial separada e validada pelo servidor.  
**Experiência noturna:** recebe transição/animação coerente com a noite antes/junto da interface privada de proteção.  
**Auto-proteção:** ainda não definida.  
**Proteção repetida no mesmo alvo:** ainda não definida.  
**Quantidade de proteções:** ainda não definida caso exista algum limite.  
**Informação pública sobre a proteção:** não deve ser revelada sem regra explícita.  
**Eliminação:** perde a ação de proteção e passa ao canal de voz dos eliminados.  
**Risco de balanceamento:** pode bloquear eliminações repetidamente caso as restrições sejam permissivas demais.

## Agrupamento mecânico inicial

Sem definir ainda o nome oficial das facções, a V1 possui dois lados mecânicos:

- lado da vila: **Cidadão, Xerife e Anjo**;
- lado da ameaça: **Assassino**.

## Regra transversal de tasks

Todos os personagens podem receber opções contextuais compatíveis com a rodada, mas essas opções não apagam as diferenças de papel.

- task comum = escolha de rota/observação/contexto;
- poder especial = ação exclusiva concedida pelo personagem;
- caderno = memória/suspeitas privadas usadas na discussão.

As tasks comuns não podem conceder ao Cidadão a investigação do Xerife, a proteção do Anjo ou o ataque do Assassino.

## Requisitos de modelagem

Cada personagem deverá possuir dados estruturados para:

- identificador interno estável;
- nome público;
- lado/facção;
- objetivo;
- habilidade;
- momento/fase da ação;
- tipos de alvo válidos;
- regras de repetição e auto-alvo;
- prioridade de resolução;
- informação privada produzida;
- condições de task comum disponíveis;
- condição de vitória;
- estado vivo/eliminado;
- interação com voz;
- interação com chat;
- texto de revelação;
- descrição curta;
- ilustração/símbolo;
- testes unitários das regras.

## Pontos ainda pendentes

- se o acompanhamento do Xerife mostra apenas o resultado binário atual ou também alguma informação de rota/ação;
- possibilidade de o Xerife investigar/acompanhar a si mesmo;
- repetição de alvo do Xerife;
- possibilidade de auto-proteção do Anjo;
- repetição de proteção no mesmo jogador;
- catálogo de tasks comuns e consequências possíveis;
- quantidade padrão de Assassinos conforme o total de jogadores;
- condição matemática exata de vitória do lado dos Assassinos;
- composição completa por número de jogadores;
- revelação ou não do personagem eliminado por padrão.

Nenhum personagem adicional deve entrar na V1 sem nova aprovação.

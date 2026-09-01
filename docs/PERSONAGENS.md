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
**Ação noturna especial:** nenhuma ação especial aprovada.  
**Experiência noturna:** recebe uma tela/experiência animada de espera para manter a imersão e evitar pistas sobre quem está agindo.  
**Discussão e votação:** participa normalmente enquanto estiver vivo.  
**Eliminação:** deixa de votar e de interferir mecanicamente na partida; passa ao canal de voz dos eliminados.  
**Risco de balanceamento:** baixo isoladamente; a quantidade precisa variar conforme o total de jogadores.

## Assassino

**Papel aprovado:** ameaça escondida da partida.  
**Objetivo geral:** sobreviver à dedução e eliminar jogadores do lado da vila até atingir a condição de vitória definida pelo motor.  
**Ação noturna:** realiza/participa da escolha de um alvo válido durante a noite.  
**Experiência noturna:** recebe transição/animação coerente com a noite e, em seguida, a interface privada para escolher e confirmar um alvo válido.  
**Informação secreta:** detalhes sobre conhecimento de outros Assassinos e coordenação entre eles ainda precisam ser formalizados conforme a composição numérica.  
**Eliminação:** perde qualquer ação de jogo e passa ao canal de voz dos eliminados.  
**Risco de balanceamento:** quantidade de Assassinos e condição exata de vitória precisam escalar com o número total de jogadores.

## Xerife

**Papel aprovado:** personagem investigativo do lado da vila.  
**Objetivo geral:** obter informação privada que ajude a identificar a ameaça e usar essa informação socialmente durante a discussão.  
**Ação noturna:** investiga sozinho um alvo válido.  
**Trabalho em equipe secreto:** não existe; o Xerife não recebe canal privado, grupo de aliados ou chat secreto.  
**Informação exata entregue pelo sistema:** **ainda não aprovada**. O sistema não deve assumir automaticamente que o Xerife vê o personagem completo ou apenas uma resposta binária.  
**Discussão:** quando o dia/discussão começa, o Xerife participa do chat e da voz geral dos vivos. Pode acusar, insinuar, blefar ou tentar convencer os demais com base na investigação, como uma espécie de “X9”.  
**Prova pública:** o sistema não confirma aos demais que ele é Xerife nem que sua acusação é verdadeira; a investigação continua privada.  
**Auto-alvo/repetição de alvo:** ainda não definidos.  
**Eliminação:** perde a ação investigativa e passa ao canal de voz dos eliminados.  
**Risco de balanceamento:** alto se a informação for definitiva demais.

## Anjo

**Papel aprovado:** personagem protetor do lado da vila.  
**Objetivo geral:** impedir uma consequência noturna contra um alvo válido.  
**Ação noturna:** protege um jogador durante a noite.  
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

A nomenclatura definitiva das facções pode ser decidida separadamente sem alterar os nomes dos quatro personagens já aprovados.

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
- condição de vitória;
- estado vivo/eliminado;
- interação com voz;
- interação com chat;
- texto de revelação;
- descrição curta;
- ilustração/símbolo;
- testes unitários das regras.

## Pontos ainda pendentes

- resposta exata da investigação do Xerife;
- possibilidade de o Xerife investigar a si mesmo;
- repetição de alvo do Xerife;
- possibilidade de auto-proteção do Anjo;
- repetição de proteção no mesmo jogador;
- quantidade padrão de Assassinos conforme o total de jogadores;
- condição matemática exata de vitória do lado dos Assassinos;
- composição completa por número de jogadores;
- revelação ou não do personagem eliminado por padrão.

Nenhum personagem adicional deve entrar na V1 sem nova aprovação.

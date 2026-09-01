# Visão do Jogo — Vila Oculta

## Conceito

Vila Oculta é um jogo social de dedução multiplayer para navegador. A inspiração estrutural vem da dinâmica de Cidade Dorme, mas a reconstrução deve possuir nome, identidade, personagens, atmosfera, interface e linguagem visual próprias.

## Experiência desejada

Cada jogador participa remotamente pelo próprio navegador. A sessão acontece em tempo real e não depende de aplicativos externos para comunicação.

A experiência deve combinar:

- mistério e desconfiança;
- vila noturna e sensação cinematográfica;
- regras fáceis de acompanhar durante a partida;
- ações secretas e distribuição privada de personagens;
- discussão por voz dentro da sala;
- chat escrito dentro da sala;
- votação, julgamento, eliminação e resultado sincronizados;
- reconexão sem destruir a sessão;
- interface clara, responsiva e realmente interativa no celular e no computador.

## Plataformas

O jogo será web-first e deverá funcionar por navegador em:

- desktop;
- notebook;
- tablet;
- Android;
- iPhone.

A implementação deve ser mobile-first, mas o desktop terá composição própria e aproveitará o espaço disponível. Não será aceita uma interface mobile apenas esticada em telas maiores nem uma interface desktop que vire um recorte apertado no celular.

Toda tela deve ser pensada para toque e mouse. Teclado/foco deve ser suportado quando aplicável. Mudanças de viewport, orientação, teclado virtual e safe areas não podem impedir o jogador de executar uma ação importante.

## Interatividade responsiva

Responsividade aqui não significa apenas “caber na tela”. Significa reorganizar a experiência conforme o dispositivo.

Exemplos esperados:

- no desktop, chat, jogadores, voz e área principal podem coexistir lado a lado quando houver espaço;
- no mobile, os mesmos recursos podem se reorganizar em painéis, drawers, bottom sheets, abas ou regiões empilhadas;
- timers, microfone, conexão e ação atual nunca devem desaparecer durante reorganização do layout;
- votação e seleção de alvo precisam ser confortáveis com toque e mouse;
- animações e cenários devem recortar/recompor sem cortar informação importante;
- nenhuma tela deve depender de resolução fixa ou produzir rolagem horizontal da página;
- cada tela deve ser validada em pelo menos um viewport mobile e um desktop antes de ser considerada pronta.

## Comunicação integrada

A partida terá voz em tempo real no próprio Vila Oculta e chat escrito em tempo real. Não haverá dependência de WhatsApp, Discord, Meet, Omegle ou chamada telefônica.

Não haverá câmera na primeira versão.

O áudio não será gravado por padrão.

Durante a noite, o chat escrito fica oculto da interface. Ele retorna na fase de discussão/comunicação permitida.

Jogadores eliminados ficam em canal de voz próprio, separado dos vivos.

## Noite e papéis secretos

A noite não deve ser uma tela vazia para quem não possui ação.

- jogadores sem ação recebem uma experiência animada de espera;
- jogadores com ação recebem transição visual coerente e, em seguida, a interface privada necessária;
- o enquadramento e os controles devem funcionar em celular e desktop;
- diferenças visuais não devem criar pistas óbvias para observadores sobre quem está agindo.

O Xerife investiga sozinho e usa a informação socialmente na discussão geral. O sistema não confirma publicamente que ele é Xerife nem que sua acusação é verdadeira.

## Qualidade visual

O produto deve parecer um jogo independente comercial, e não uma página institucional, dashboard corporativo ou protótipo.

Direção inicial:

- azul-marinho profundo, grafite e violeta escuro;
- tons frios com destaques em âmbar/dourado envelhecido;
- vermelho controlado para perigo;
- verde discreto para confirmações;
- texto branco levemente quente;
- luar, névoa sutil, silhuetas de casas, floresta distante, céu noturno e janelas iluminadas;
- animações leves e funcionais;
- tipografia temática em títulos e altamente legível em regras/controles.

O fundo e os efeitos nunca poderão prejudicar a leitura ou atrasar uma ação importante.

## Autoridade e segurança

O cliente nunca será a fonte de verdade para regras críticas. O servidor validará fase, permissões, ações, votos, estado de anfitrião e autorização de fala.

A interface apenas representa o estado autorizado.

## Persistência

As salas e informações da partida serão temporárias. O histórico do chat pertence à sessão atual e deverá ser limpo quando a sala expirar conforme política de retenção documentada.

## Critério de produto

A primeira versão só poderá ser considerada funcional quando duas ou mais pessoas conseguirem entrar na mesma sala, conversar por voz dentro do jogo, usar o chat escrito nas fases permitidas, receber personagens secretamente, atravessar as fases sincronizadas, votar, chegar ao resultado e se reconectar após uma interrupção, com regras críticas protegidas no servidor e experiência utilizável tanto em mobile quanto em desktop.

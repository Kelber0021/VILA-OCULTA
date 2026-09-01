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
- interface clara no celular e no computador.

## Plataformas

O jogo será web-first e deverá funcionar por navegador em:

- desktop;
- notebook;
- tablet;
- Android;
- iPhone.

A implementação deve ser mobile-first, mas o desktop terá composição própria e aproveitará o espaço disponível. Não será aceita uma interface mobile apenas esticada em telas maiores.

## Comunicação integrada

A partida terá voz em tempo real no próprio Vila Oculta e chat escrito em tempo real. Não haverá dependência de WhatsApp, Discord, Meet, Omegle ou chamada telefônica.

Não haverá câmera na primeira versão.

O áudio não será gravado por padrão.

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

A primeira versão só poderá ser considerada funcional quando duas ou mais pessoas conseguirem entrar na mesma sala, conversar por voz dentro do jogo, usar o chat escrito, receber personagens secretamente, atravessar as fases sincronizadas, votar, chegar ao resultado e se reconectar após uma interrupção, com regras críticas protegidas no servidor.

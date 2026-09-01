# Regras — Vila Oculta

Status: **parcialmente definidas**. Este documento separa regras já encontradas/aprovadas de pontos ainda pendentes de decisão.

## 1. Estrutura geral

Vila Oculta é um jogo social de dedução por lados/facções, com informação secreta, discussão, ações noturnas, votação e eliminação.

A nova versão será jogada remotamente pela internet. Voz e chat escrito ocorrerão dentro do próprio jogo.

## 2. Personagens aprovados para a V1

A primeira versão terá exatamente quatro personagens:

- **Cidadão** — personagem básico do lado da vila, sem ação noturna especial aprovada;
- **Assassino** — ameaça escondida, com ação noturna de eliminação/alvo;
- **Xerife** — personagem investigativo do lado da vila;
- **Anjo** — personagem protetor do lado da vila.

Os nomes provisórios do legado (`Morador`, `Oculto`, `Vigia` e `Guardião`) deixam de ser os nomes oficiais da V1.

A aprovação dos personagens não define automaticamente todos os detalhes de habilidade. Regras como auto-proteção do Anjo, repetição de alvo e informação exata recebida pelo Xerife serão decididas separadamente.

## 3. Lados mecânicos

Sem fixar ainda o nome final das facções, a V1 possui dois lados mecânicos:

### Lado da vila

- Cidadão;
- Xerife;
- Anjo.

Esse lado vence quando a ameaça definida pelos Assassinos for eliminada conforme a condição final do motor.

### Lado dos Assassinos

- Assassino.

Esse lado vence quando atingir a condição de domínio/inevitabilidade definida e testada no motor. A fórmula matemática exata ainda precisa ser aprovada.

Não há personagem independente aprovado para a V1.

## 4. Ciclo conceitual de rodada

O legado documenta o ciclo principal:

1. Noite;
2. Amanhecer;
3. Discussão;
4. Votação;
5. Julgamento.

A reconstrução adicionará estados técnicos explícitos para preparação, distribuição/revelação de personagens, ações noturnas, resolução, eliminação, verificação de vitória, resultado e encerramento.

## 5. Noite

Regras já documentadas:

- jogadores com ações secretas agem durante a noite;
- jogadores só podem selecionar alvos válidos;
- ação deve exigir confirmação;
- ações são resolvidas seguindo ordem consistente;
- jogadores sem habilidade noturna devem receber uma experiência neutra que não revele quem está ativo;
- a interface não deve entregar personagens por sons/animações exclusivos observáveis por terceiros;
- o servidor deve validar fase, personagem, alvo e permissão antes de aceitar ação.

Na V1:

- o **Cidadão** não possui ação noturna especial aprovada;
- o **Assassino** participa da ação noturna contra um alvo válido;
- o **Xerife** realiza uma investigação noturna, cujo resultado exato ainda será definido;
- o **Anjo** realiza uma proteção noturna, cujas restrições de auto-alvo e repetição ainda serão definidas.

## 6. Amanhecer

O sistema anuncia somente informação pública permitida pela regra:

- se alguém foi eliminado durante a noite;
- se ninguém foi eliminado;
- quem permanece na partida;
- outras informações públicas previstas pelas regras.

A causa exata não deve ser revelada quando isso destruir a dedução.

## 7. Discussão

Na versão atual, a discussão será remota e ocorrerá por voz integrada no Vila Oculta.

A arquitetura deve permitir que as permissões de voz variem por fase.

Jogadores eliminados não participam do canal de voz dos vivos. Ao serem eliminados, são movidos para um canal exclusivo de eliminados, separado do canal dos vivos.

## 8. Votação

Regras já documentadas:

- apenas jogadores vivos votam;
- voto é individual e secreto;
- jogador escolhe somente alvo válido;
- eliminado não pode receber voto quando a regra não permitir;
- um jogador não pode votar duas vezes;
- votos não são revelados antes da fase apropriada;
- o servidor deve impedir duplicação e manipulação;
- a configuração pode permitir ou não alteração do voto antes da confirmação final.

## 9. Empate

O legado prevê alternativas configuráveis:

- segundo turno entre empatados;
- ninguém eliminado;
- decisão do anfitrião somente quando essa regra tiver sido previamente escolhida.

A opção padrão da primeira versão ainda precisa ser definida.

## 10. Julgamento e eliminação

Regras conhecidas:

- o resultado da votação é revelado com uma transição clara;
- o jogador escolhido pode ser eliminado conforme a regra;
- revelar ou ocultar o personagem eliminado pode ser configuração da sala;
- jogador eliminado deixa de votar;
- jogador eliminado deixa de realizar ações;
- jogador eliminado não deve receber informações secretas adicionais;
- jogador eliminado continua conectado para acompanhar acontecimentos públicos;
- ao ser eliminado, o jogador sai do canal de voz dos vivos e entra no canal exclusivo dos eliminados;
- o canal dos eliminados é isolado: vivos não ouvem eliminados e eliminados não transmitem áudio aos vivos;
- a separação deve ser garantida pelo servidor/serviço de voz, não apenas por controles visuais.

## 11. Vitória

Regras conceituais:

- o lado da vila vence quando não restar a ameaça dos Assassinos;
- o lado dos Assassinos vence quando atingir uma condição de domínio numérico/inevitabilidade definida pelo motor;
- não há independente aprovado para a V1.

A condição matemática exata dos Assassinos deverá ser implementada de forma testável depois da composição padrão por quantidade de jogadores ser aprovada.

## 12. Anfitrião

- cria/configura a sala;
- pode iniciar a partida quando a composição for válida;
- pode moderar a sala;
- pode expulsar participante;
- pode transferir anfitrião;
- pode pausar/avançar quando a configuração permitir;
- **não pode enxergar personagens secretos apenas por ser anfitrião**;
- privilégios de anfitrião são validados no servidor, nunca por URL/localStorage/estado React.

## 13. Configurações previstas

O legado já previa:

- modo rápido, padrão ou personalizado;
- duração da discussão;
- duração da noite;
- duração da votação;
- revelar personagem eliminado;
- permitir troca de voto antes da confirmação;
- avanço automático ou manual.

A nova versão pode manter essas opções, após validação de UX e balanceamento.

## 14. Comunicação

### Voz

- integrada ao jogo;
- WebRTC;
- sem transmissão de áudio pelo Supabase;
- sem gravação por padrão;
- autorização de fala validada no servidor/serviço de voz;
- lobby pode permitir todos falarem;
- fases podem alterar permissões;
- jogadores vivos e eliminados usam canais separados após a eliminação;
- tokens/permissões de voz precisam impedir que um eliminado reentre no canal dos vivos por manipulação do cliente.

### Chat escrito

- integrado à sala;
- em tempo real;
- histórico temporário da sessão;
- proteção contra spam/XSS/duplicação;
- moderação do anfitrião.

Ainda precisa ser decidido se o chat ficará ativo durante todas as fases ou terá restrições na noite.

## 15. Segurança das regras

Nenhuma regra crítica pode depender apenas de:

- JavaScript do navegador;
- React state;
- parâmetros de URL;
- localStorage;
- botão escondido/desabilitado.

O servidor será a fonte confiável de:

- fase;
- identidade/sessão;
- anfitrião;
- personagem;
- ação;
- voto;
- eliminação;
- vitória;
- autorização para falar.

## 16. Pontos ainda pendentes

- resposta exata da investigação do Xerife;
- auto-proteção/repetição do Anjo;
- composição padrão por quantidade de jogadores;
- condição matemática exata de vitória dos Assassinos;
- regra padrão de empate;
- chat durante a noite;
- espectadores;
- limites definitivos de jogadores para a primeira versão.

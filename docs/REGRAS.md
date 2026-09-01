# Regras — Vila Oculta

Status: **parcialmente definidas**. Este documento separa regras já encontradas/aprovadas de pontos ainda pendentes de decisão.

## 1. Estrutura geral

Vila Oculta é um jogo social de dedução por equipes/facções, com informação secreta, discussão, ações noturnas, votação e eliminação.

A nova versão será jogada remotamente pela internet. Voz e chat escrito ocorrerão dentro do próprio jogo.

## 2. Facções conhecidas

### Moradores

- São a maioria da vila.
- Vencem quando todos os Ocultos forem eliminados.
- Podem incluir personagens sem poder e personagens com habilidades especiais.

### Ocultos

- São a ameaça escondida.
- Conhecem seus aliados, conforme a regra do personagem/composição.
- Durante a noite participam de uma escolha secreta de alvo.
- Vencem quando atingem uma situação em que os Moradores não conseguem mais superá-los, regra exata a ser formalizada no motor.

### Independentes

- Têm condições próprias de vitória.
- A recomendação do legado é adicioná-los somente depois que o modo principal estiver equilibrado.
- Ainda não estão aprovados para a primeira versão.

## 3. Ciclo conceitual de rodada

O legado documenta o ciclo principal:

1. Noite;
2. Amanhecer;
3. Discussão;
4. Votação;
5. Julgamento.

A reconstrução adicionará estados técnicos explícitos para preparação, distribuição/revelação de personagens, ações noturnas, resolução, eliminação, verificação de vitória, resultado e encerramento.

## 4. Noite

Regras já documentadas:

- jogadores com ações secretas agem durante a noite;
- jogadores só podem selecionar alvos válidos;
- ação deve exigir confirmação;
- ações são resolvidas seguindo ordem consistente;
- jogadores sem habilidade noturna devem receber uma experiência neutra que não revele quem está ativo;
- a interface não deve entregar personagens por sons/animações exclusivos observáveis por terceiros;
- o servidor deve validar fase, personagem, alvo e permissão antes de aceitar ação.

## 5. Amanhecer

O sistema anuncia somente informação pública permitida pela regra:

- se alguém foi eliminado durante a noite;
- se ninguém foi eliminado;
- quem permanece na partida;
- outras informações públicas previstas pelas regras.

A causa exata não deve ser revelada quando isso destruir a dedução.

## 6. Discussão

Na versão atual, a discussão será remota e ocorrerá por voz integrada no Vila Oculta.

A arquitetura deve permitir que as permissões de voz variem por fase.

A regra definitiva sobre fala de jogadores eliminados continua pendente.

## 7. Votação

Regras já documentadas:

- apenas jogadores vivos votam;
- voto é individual e secreto;
- jogador escolhe somente alvo válido;
- eliminado não pode receber voto quando a regra não permitir;
- um jogador não pode votar duas vezes;
- votos não são revelados antes da fase apropriada;
- o servidor deve impedir duplicação e manipulação;
- a configuração pode permitir ou não alteração do voto antes da confirmação final.

## 8. Empate

O legado prevê alternativas configuráveis:

- segundo turno entre empatados;
- ninguém eliminado;
- decisão do anfitrião somente quando essa regra tiver sido previamente escolhida.

A opção padrão da primeira versão ainda precisa ser definida.

## 9. Julgamento e eliminação

Regras conhecidas:

- o resultado da votação é revelado com uma transição clara;
- o jogador escolhido pode ser eliminado conforme a regra;
- revelar ou ocultar o personagem eliminado pode ser configuração da sala;
- jogador eliminado deixa de votar;
- jogador eliminado deixa de realizar ações;
- jogador eliminado não deve receber informações secretas adicionais;
- jogador eliminado continua conectado para acompanhar acontecimentos públicos.

A regra de voz dos eliminados permanece pendente.

## 10. Vitória

Regras conceituais documentadas:

- Moradores vencem quando não restam Ocultos;
- Ocultos vencem quando atingem uma condição de domínio numérico/inevitabilidade definida pelo motor;
- Independentes, se existirem, vencem conforme objetivo próprio.

A condição exata dos Ocultos deverá ser implementada de forma testável depois da composição inicial ser aprovada.

## 11. Anfitrião

- cria/configura a sala;
- pode iniciar a partida quando a composição for válida;
- pode moderar a sala;
- pode expulsar participante;
- pode transferir anfitrião;
- pode pausar/avançar quando a configuração permitir;
- **não pode enxergar personagens secretos apenas por ser anfitrião**;
- privilégios de anfitrião são validados no servidor, nunca por URL/localStorage/estado React.

## 12. Configurações previstas

O legado já previa:

- modo rápido, padrão ou personalizado;
- duração da discussão;
- duração da noite;
- duração da votação;
- revelar personagem eliminado;
- permitir troca de voto antes da confirmação;
- avanço automático ou manual.

A nova versão pode manter essas opções, após validação de UX e balanceamento.

## 13. Comunicação

### Voz

- integrada ao jogo;
- WebRTC;
- sem transmissão de áudio pelo Supabase;
- sem gravação por padrão;
- autorização de fala validada no servidor/serviço de voz;
- lobby pode permitir todos falarem;
- fases podem alterar permissões.

### Chat escrito

- integrado à sala;
- em tempo real;
- histórico temporário da sessão;
- proteção contra spam/XSS/duplicação;
- moderação do anfitrião.

Ainda precisa ser decidido se o chat ficará ativo durante todas as fases ou terá restrições na noite.

## 14. Segurança das regras

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

## 15. Pontos ainda pendentes

- personagens exatos da primeira versão;
- regra padrão de empate;
- voz de eliminados;
- chat durante a noite;
- espectadores;
- composição padrão por quantidade de jogadores;
- limites definitivos de jogadores para a primeira versão.

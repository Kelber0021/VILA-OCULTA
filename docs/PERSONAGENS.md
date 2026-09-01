# Personagens — Vila Oculta

Status: **inventário do legado; composição da primeira versão ainda não aprovada**.

Este documento não transforma sugestões antigas em decisões finais. Ele registra apenas os personagens e conceitos encontrados na especificação do projeto legado.

## Facção: Moradores

### Morador

**Grupo:** Moradores  
**Objetivo:** eliminar todos os Ocultos.  
**Poder:** nenhum poder noturno documentado.  
**Momento de ação:** discussão e votação.  
**Alvos permitidos:** conforme votação.  
**Restrições:** não executa ação noturna especial.  
**Informação revelada:** nenhuma informação privada adicional prevista.  
**Condição de vitória:** vitória coletiva dos Moradores.  
**Interação com voz:** participa da discussão conforme permissões da fase.  
**Interação com chat:** ainda depende da regra de chat por fase.  
**Interação com eliminação:** eliminado deixa de votar/agredir/interferir; regra de voz ainda pendente.  
**Risco de balanceamento:** baixo isoladamente; quantidade precisa ser ajustada à composição.

### Vigia

**Grupo:** Moradores  
**Objetivo:** ajudar a identificar a ameaça sem receber informação excessivamente definitiva.  
**Poder encontrado no legado:** observar um jogador por noite e receber uma informação limitada sobre sua ligação com a ameaça.  
**Momento de ação:** noite.  
**Alvos permitidos:** um jogador válido por noite; restrições finais não definidas.  
**Restrições:** o legado não define exatamente se pode observar a si mesmo, repetir alvo ou qual resposta recebe.  
**Informação revelada:** informação limitada, não necessariamente o personagem exato.  
**Condição de vitória:** coletiva dos Moradores.  
**Interação com voz/chat:** não pode revelar sua ação automaticamente; comunicação continua sendo decisão do jogador.  
**Interação com eliminação:** perde ação ao ser eliminado.  
**Risco de balanceamento:** alto se a informação for binária/definitiva demais; o formato exato precisa ser aprovado e testado.

### Guardião

**Grupo:** Moradores  
**Objetivo:** impedir uma consequência noturna contra um jogador.  
**Poder encontrado no legado:** proteger uma pessoa durante a noite, seguindo regras de equilíbrio.  
**Momento de ação:** noite.  
**Alvos permitidos:** jogador válido; regras de auto-proteção/repetição ainda não definidas.  
**Restrições:** não especificadas em detalhe no legado.  
**Informação revelada:** o sistema não deve revelar publicamente quem protegeu quem salvo regra explícita.  
**Condição de vitória:** coletiva dos Moradores.  
**Interação com voz/chat:** sem permissão especial documentada.  
**Interação com eliminação:** perde ação ao ser eliminado.  
**Risco de balanceamento:** pode bloquear eliminações repetidamente se auto-proteção/repetição não forem limitadas.

### Curandeira

**Grupo:** Moradores  
**Objetivo:** alterar ou impedir consequência noturna de forma limitada.  
**Poder encontrado no legado:** possui recursos limitados para impedir ou alterar uma consequência noturna.  
**Momento de ação:** noite/resolução, conforme regra futura.  
**Alvos permitidos:** não definidos de forma suficiente.  
**Restrições:** recursos limitados, mas quantidade e efeitos não foram definidos.  
**Informação revelada:** não definida.  
**Condição de vitória:** coletiva dos Moradores.  
**Interação com voz/chat:** sem permissão especial documentada.  
**Interação com eliminação:** perde habilidade restante ao ser eliminada.  
**Risco de balanceamento:** elevado pela falta de definição do recurso e pela possível sobreposição com Guardião.

## Facção: Ocultos

### Oculto

**Grupo:** Ocultos  
**Objetivo:** sobreviver à dedução e eliminar/neutralizar Moradores até atingir condição de vitória.  
**Poder encontrado no legado:** participa da escolha secreta de um alvo durante a noite.  
**Momento de ação:** noite.  
**Alvos permitidos:** jogador válido não protegido pelas restrições de facção; regra exata precisa ser formalizada.  
**Restrições:** não definidas em detalhe no legado.  
**Informação revelada:** o legado indica que Ocultos conhecem seus aliados.  
**Condição de vitória:** quando chegam a uma situação em que os Moradores não conseguem mais superá-los; fórmula exata ainda pendente.  
**Interação com voz:** a arquitetura deve permitir canal privado temporário se a regra da ação coletiva exigir, mas isso ainda não equivale a uma decisão final de produto.  
**Interação com chat:** não há regra aprovada de chat privado para Ocultos.  
**Interação com eliminação:** eliminado deixa de executar ação e não deve interferir no resultado.  
**Risco de balanceamento:** quantidade de Ocultos e forma de coordenação precisam escalar com o número de jogadores.

## Facção: Independentes

O legado prevê uma categoria futura de personagens com condição particular de vitória, mas não define personagem independente específico pronto para implementação.

**Status:** não recomendado para o primeiro núcleo até o modo Moradores × Ocultos estar equilibrado.

## Personagens adicionais futuros mencionados apenas como possibilidade

O legado menciona que outros tipos de Ocultos podem surgir futuramente com habilidades como:

- manipulação;
- bloqueio;
- disfarce.

Esses itens não têm nome, regra nem aprovação e **não devem ser implementados agora**.

## Requisitos de modelagem para qualquer personagem aprovado

Todo personagem definitivo deverá ter dados estruturados para:

- identificador interno estável;
- nome público;
- facção;
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

## Lacunas que precisam ser decididas depois da composição inicial

- comportamento exato do Vigia;
- auto-proteção e repetição do Guardião;
- recursos/efeitos da Curandeira;
- modo de coordenação dos Ocultos durante a noite;
- condição matemática exata de vitória dos Ocultos;
- revelação ou não de personagem após eliminação por padrão;
- quantidade de cada personagem por número de jogadores.

## Recomendação técnica — não é decisão de produto

Para a primeira implementação, é tecnicamente mais seguro começar com poucos papéis e regras determinísticas, cobrir integralmente distribuição, noite, votação e vitória com testes e só depois adicionar personagens de resolução complexa.

A composição final depende de aprovação do proprietário do projeto.

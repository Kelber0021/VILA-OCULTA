# Salas e motor de partida

Esta versão executa salas reais em um único processo Node.js. Cada navegador guarda uma sessão em cookie HttpOnly, SameSite=Strict, com segredo aleatório de 256 bits. O servidor armazena apenas o hash do segredo. Uma sessão pertence a uma sala; sair invalida a sessão. Para testar várias pessoas no mesmo computador, use perfis ou contextos de navegador separados.

## API

Todas as respostas bem-sucedidas seguem `{ room: RoomView | null }`; falhas seguem `{ error: string }`. O contrato público está em `lib/game-types.ts`. Requisições de escrita exigem `Content-Type: application/json` e `Origin` correspondente à origem da aplicação. Os clientes devem usar cookies da mesma origem.

| Método e caminho | Dados |
| --- | --- |
| POST `/api/rooms` | `{ name, avatarId }` |
| POST `/api/rooms/join` | `{ code, name, avatarId }` |
| GET `/api/rooms/current` | Recupera a sala da sessão, ou `null` |
| GET `/api/rooms/:code` | Estado filtrado para o participante autenticado |
| POST `/api/rooms/:code/action` | `{ type: "ready", ready }`, `{ type: "avatar", avatarId }`, `{ type: "start" }`, `{ type: "rematch" }`, `{ type: "configure", pace, maxPlayers }`, `{ type: "night", targetId }`, `{ type: "vote", targetId }`, `{ type: "chat", text }`, `{ type: "leave" }` |

Retratos: `ana`, `bento`, `clara`, `davi`, `elisa`, `joaquim`. Retratos são cosméticos e podem se repetir. Nomes devem ter 2 a 24 caracteres permitidos e ser únicos na sala. Códigos possuem seis caracteres gerados por fonte criptográfica.

## Configurações da sala

Toda sala começa com `settings: { pace: "classic", maxPlayers: 8 }`. Durante a preparação, somente o anfitrião pode enviar `configure`, com `pace` entre `quick`, `classic` e `relaxed`, e `maxPlayers` inteiro de 4 a 8. A capacidade nunca pode ser menor que o número de pessoas presentes; a entrada de novas pessoas respeita esse limite. Os demais participantes podem consultar a configuração, mas não alterá-la.

| Ritmo | Noite | Discussão | Votação | Resultado |
| --- | --- | --- | --- | --- |
| `quick` — rápido | 25 s | 35 s | 20 s | 8 s |
| `classic` — clássico | 35 s | 45 s | 30 s | 8 s |
| `relaxed` — tranquilo | 60 s | 90 s | 45 s | 8 s |

Mudar ritmo ou capacidade desmarca a prontidão de todos e anuncia a alteração na narração. Reenviar os mesmos valores não altera a prontidão. Configurações ficam bloqueadas durante a partida e são preservadas ao jogar novamente. O campo legado `maxPlayers` da resposta espelha `settings.maxPlayers`. Os tempos abaixo descrevem o ritmo clássico; o motor aplica os prazos da tabela para os outros ritmos.

Durante desenvolvimento, recarregar o módulo atualiza os métodos do armazenamento compartilhado sem descartar sessões; salas legadas sem configuração recebem clássico/8. Isso não cria persistência entre reinícios do processo.

## Dinâmica

1. De 4 a 8 participantes entram e confirmam que estão prontos. O anfitrião inicia; o servidor sorteia um assassino, um xerife, um anjo e cidadãos restantes, independentemente dos retratos.
2. **Noite, 35 segundos:** assassino escolhe uma vítima, anjo protege uma pessoa (inclusive a si próprio), xerife investiga outra pessoa. Cada papel especial envia uma única ação; cidadão aguarda. A noite pode terminar antes se todos os papéis especiais vivos agirem. Ausência de ação equivale a não agir. As ações são resolvidas juntas: proteção impede a morte e apenas o xerife recebe sua descoberta.
3. **Discussão, 45 segundos:** a narração anuncia o resultado sem revelar papéis. Participantes vivos conversam no chat, presencialmente ou por uma chamada externa. Não há voz integrada.
4. **Votação, 30 segundos:** vivos votam uma única vez em outra pessoa viva ou se abstêm (`targetId: null`). Votos ficam privados; a interface informa quem já votou. Maior quantidade de votos elimina; empate ou ausência de votos não elimina. Abstenções não são candidatas e não exigimos maioria absoluta. Todos votando encerram a fase antes do prazo.
5. **Resultado, 8 segundos:** a narração anuncia a decisão e inicia outra noite. A vila vence ao eliminar o assassino. O assassino vence quando iguala ou supera o número de outros sobreviventes. Somente no fim todos os papéis são revelados.

Os prazos usam o relógio do servidor. Leituras e ações processam o vencimento da fase atual. Sem conexões, não existe trabalhador executando o relógio: no retorno, a fase vencida termina e a próxima recebe seu tempo integral, para não executar várias rodadas silenciosas. Atualização do navegador preserva a sessão. Não há botão que permita ao cliente escolher arbitrariamente a fase ou os papéis. Saída durante a partida elimina o participante; se o anfitrião sair, outro participante conectado à sala assume. Fechar a aba não elimina imediatamente: a pessoa pode voltar e continua sujeita aos prazos. Ao fim, o anfitrião pode escolher jogar novamente (`rematch`): a mesma sala e as sessões são preservadas, apenas participantes com sessão ativa permanecem, todos voltam à preparação e precisam confirmar prontidão. Papéis, investigações, votos, alvos, chat e narração anteriores são apagados antes de um novo sorteio.

## Segurança e limites

- Respostas não incluem tokens, papéis de terceiros, alvos noturnos de terceiros nem resultados de investigação de terceiros. Participação é exigida inclusive para consultar uma sala cujo código seja conhecido. Somente o anfitrião inicia a partida.
- Escritas verificam origem exata e rejeitam `Sec-Fetch-Site: cross-site`; somente JSON com campos permitidos, no máximo 4 KiB, é aceito. Campos como papel, identidade e fase enviados pelo cliente são rejeitados.
- Cookies usam `Secure` em produção e em HTTPS. Configure **`APP_ORIGIN=https://seu-dominio`** com a origem pública real, sem caminho. Em produção fora de localhost, escritas falham se essa variável estiver ausente. Publique com HTTPS; HTTP de rede local funciona apenas em desenvolvimento. Cabeçalhos de IP encaminhados não são considerados confiáveis.
- Limites por minuto: 6.000 requisições globais; 240 por cookie; 120 anônimas compartilhadas; 45 escritas por cookie; 40 escritas anônimas compartilhadas. Chat: 12 mensagens por sessão por minuto, 240 caracteres, histórico de 50 mensagens. Chat abre na preparação, discussão e fim; mortos não escrevem durante a discussão.
- Máximo de 128 salas, 1.024 sessões e 4.096 entradas de controle de frequência. Salas expiram após 2 horas sem leitura/ação válida ou 12 horas totais. Sessões duram até 12 horas. Histórico da narração limitado a 30 eventos. Limpeza ocorre nas requisições, sem intervalos que persistam durante desenvolvimento.
- O código da sala funciona como convite. Não há senha, conta, recuperação entre aparelhos ou moderação de conteúdo nesta versão.

## Publicação

Execute em uma única instância Node persistente, com HTTPS, `APP_ORIGIN` e limites de conexão/tamanho/tempo no proxy. Como os dados estão em memória, reinícios apagam as salas; múltiplas instâncias, funções serverless e balanceamento sem estado compartilhado não são suportados. Os limites locais não substituem proteção contra tráfego abusivo no proxy. O domínio de produção deve estar dedicado à aplicação para reduzir interferência de cookies de outras aplicações.

Antes de oferecer persistência e múltiplas instâncias, migre estado e sessões para armazenamento compartilhado com transações e expiração, centralize limites de frequência, agende fases no servidor e acrescente métricas sem segredos. Não há integração externa nem banco de dados configurado automaticamente.

## Verificação

`npm test -- tests/server-game.test.ts tests/server-http.test.ts` verifica autenticação, privacidade, autorização de anfitrião, validação, capacidade, prontidão, ações simultâneas, proteção, investigação privada, prazos, votos, vitória, saída, expiração, limites e origem/cookies HTTP.

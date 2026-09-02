# Vila Oculta

Jogo de dedução social em uma vila colonial brasileira. A interface separa início, retratos, regras e sala em telas compactas. O retrato é cosmético: os papéis secretos são sorteados pelo servidor.

## Jogar localmente

Requer Node.js 22 ou superior.

```sh
npm ci
npm run dev
```

Abra http://localhost:3000, crie uma sala e compartilhe o código. Cada pessoa usa seu próprio navegador/dispositivo. Abas do mesmo navegador compartilham a mesma sessão; para testes, use perfis separados. São necessários de 4 a 8 participantes, todos prontos. O anfitrião inicia e o jogo conduz noite, discussão, votação e resultado.

## O que funciona

- Criação e entrada em salas privadas por código, sessão protegida por cookie e reconexão por atualização da página.
- Escolha de seis retratos, prontidão, saída da sala e transferência de anfitrião.
- Sorteio secreto de Cidadão, Assassino, Xerife e Anjo; ações e votos validados pelo servidor.
- Narração textual automática, temporizadores de fase, eliminação e condição de vitória.
- Conversa por texto durante as fases permitidas, com limite de tamanho e frequência.
- Sincronização por consulta periódica ao servidor, sem jogadores fictícios.

## Limites desta primeira versão

O estado das salas fica **na memória de um único processo Node**. Reiniciar, suspender ou republicar o servidor encerra as salas. Não use múltiplas instâncias nem hospedagem de funções isoladas nesta etapa. A próxima evolução é um armazenamento compartilhado persistente com transações, presença e recuperação de partidas. Não há cadastro, recuperação de conta, voz integrada ou narração de áudio.

O servidor já aplica autorização de participante/anfitrião, privacidade dos papéis, validação de entradas, limites de requisições, proteção de origem e respostas privadas sem cache. As páginas usam Content Security Policy com nonce. Isso é uma base de segurança, não uma auditoria de produção. Veja [documentação do servidor](docs/backend.md).

## Validação

```sh
npm test
npm run lint
npm run typecheck
npm run build
npm start
```

## Organização

- `app/` — páginas e rotas da API.
- `components/` — formulários, retratos, regras e sala.
- `lib/game-types.ts` — contrato público da partida; não contém segredos.
- `lib/server/` — sessões, sala, regras e validações.
- `public/assets/backgrounds/` — cenários de noite e amanhecer.
- `public/assets/characters/` — retratos cosméticos.
- `docs/art-assets.md` — inventário e prompts das imagens.

## Publicação

Execute `npm run build` seguido de `npm start` em um serviço Node persistente com **uma única instância**, HTTPS e proxy reverso com limitação de tráfego. Revise as variáveis opcionais documentadas em `docs/backend.md`. Hospedagem estática não suporta a API. Planos que suspendem o processo perdem as salas em andamento.

Referências de implementação: [cookies do Next.js](https://nextjs.org/docs/app/api-reference/functions/cookies), [CSP](https://nextjs.org/docs/app/guides/content-security-policy) e [hospedagem própria](https://nextjs.org/docs/app/guides/self-hosting).

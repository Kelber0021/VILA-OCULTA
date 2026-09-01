# Decisões — Vila Oculta

Este arquivo registra somente decisões já aprovadas pelo proprietário do projeto.

## 2026-09-01

### Plataforma

- Vila Oculta será reconstruído como aplicação **web-first**.
- A base Expo/React Native do projeto antigo não será reutilizada como fundação.
- O jogo deve funcionar em computador, notebook, tablet, Android e iPhone por navegador.
- A interface deve parecer um jogo completo e atmosférico, não dashboard, SaaS ou formulário genérico.

### Comunicação

- Voz em tempo real acontecerá **dentro do próprio Vila Oculta**.
- Chat escrito em tempo real acontecerá **dentro do próprio Vila Oculta**.
- Jogadores não dependerão de WhatsApp, Discord, Google Meet, Omegle, chamada telefônica ou outro aplicativo externo para a comunicação da partida.
- Não haverá câmera/vídeo na primeira versão.
- O áudio não será gravado por padrão.
- Supabase não será usado para transportar áudio; a camada de voz será WebRTC com solução apropriada para salas multiplayer.
- LiveKit é a preferência inicial, mas a escolha Cloud versus self-hosted ainda depende de comparação técnica/custo e aprovação.

### Segurança e autoridade

- Regras críticas, fase atual, permissões e autorização de fala não podem depender apenas do estado do cliente.
- O servidor será a fonte confiável do estado da partida.
- Tokens de voz deverão ser emitidos no servidor e ser curtos/temporários.
- Credenciais privadas não poderão ser enviadas ao navegador nem versionadas.

### Repositórios

- `Kelber0021/CIDADE-DORME-` será somente referência e não será modificado.
- `Kelber0021/VILA-OCULTA` é o repositório oficial da reconstrução.
- Não criar outro repositório semelhante.
- `main` deverá permanecer estável.

### Processo de decisão

- Fazer uma pergunta de produto por vez.
- Não impor limite de tempo para resposta.
- Não perguntar novamente algo já documentado.
- Não alterar decisão aprovada sem consultar o proprietário.
- Não declarar que algo funciona, foi publicado, está seguro ou foi enviado sem verificação real.

# projetoMod2Angular

● Login: Tela de autenticação que valide credenciais e gere uma sessão segura.--> com chave fakeJwt
● Dashboard: Exibição do saldo atual (com opção de ocultar/mostrar) e carregamento sob demanda da fatura do cartão. ---> defer com viewport para exibir o cartão, coloquei um espaçamento para forçar que o usuário vá para a parte inferir da tela e o defer ative
● Transferência: Formulário que realiza uma nova transferência (POST) e atualiza o saldo da conta (PATCH). ---> requisições com HttpClient e uso de signal e toSignal para consumo e utilização das variáveis
● Extrato (Transações): Lista de transações vindas da API (GET) com a opção de visualizar comprovantes e excluir registros (DELETE). ---> CRUD completo, funcional e com Signal e toSignal
● Empréstimo: Simulador de crédito que só é carregado e exibido após interação do usuário. ---> ativado por botão e com limite atualizável por signal, também com restrições nos campos, botões e função para não extrapolar o valor limite
● Perfil (Rotas Aninhadas): Painel de configurações com sub-rotas para "Dados Pessoais" e "Segurança". ---> modelo de sub-rotas aplicado no componente perfil
● Internacionalização: Um seletor global para alternar o idioma do sistema entre Português do Brasil (PT-BR) e de Portugal (PT-PT). ---> botões no componente header, traduções dos componentes SIDEBAR, DASHBOARD e HEADER

**TAREFAS EXECUTADAS**
-router-outlet implementado
-rota parametrizada para transações com id
-rotas aninhadas no componente perfil
-página direcionada para página específica para o caso de 404
-utilização de signal() em todos arquivos .ts e utilização de computed() no dashboard
-utilização exclusiva de Control Flow
-defer on interaction no simulador de empréstimos e defer on viewport para exibir o extrato de cartão de crédito no dashboard
-uso exclusivo de HttpCliente
-requisições GET utilizando toSignal
-todas requisições com catchError e notificação ao usuário por meio de snackbar
-inicio das requisições iniciam loading na tela e finalizam assim que há a conclusão
-Functional Guard funcionando com fakeJwt mediante apresentação de usuário e senha pré-definidas
-HttpInterceptor Funcional com header Authorization: Bearer <token>, sendo esse token o fakeJwt
-ngx-translate configurado
-variáveis de ambiente criadas e linguagens definidas
-criadas as traduções dos componentes SIDEBAR, DASHBOARD e HEADER
-aplicado lazy loading em todas as rotas, com exceção da tela de login e erro 404
-Pré-carregamento de Módulos (Preloading) aplicado em todo o projeto
-ChangeDetectionStrategy.OnPush aplicado nos seguintes componentes: dashboard, credit-card-invoice, loan e profile
-Server-Side Rendering (SSR) não foi ativado, em função das dificuldades em readequação de todo o projeto em sua totalidade.
import type { ReelSceneInput } from "@/lib/content/schema";

/** Reels da semana 4 — HTTP/REST e Node API. */
export const reels: Record<string, ReelSceneInput[]> = {
  "lesson-rest-http": [
    {
      type: "title",
      say: "Every time an app loads data, it's talking to an API. | Let's see the language they speak: HTTP.",
      headline: "HTTP & REST",
      sub: "How the front-end talks to the back-end",
      pt: {
        say: "Sempre que uma app carrega dados, ela está a falar com uma API. | Vamos ver a língua que elas falam: HTTP.",
        headline: "HTTP e REST",
        sub: "Como o front-end conversa com o back-end",
      },
    },
    {
      type: "visual",
      kind: "request",
      say: "The trip of a request. | The React app sends it, | the API checks who you are, | and reads the database. Then the response travels back as JSON.",
      labels: ["React app", "API · checks the token", "Database"],
      pt: {
        say: "A viagem de um pedido. | A app React envia, | a API verifica quem você é, | e lê a base de dados. Depois a resposta volta em JSON.",
        labels: ["App React", "API · verifica o token", "Base de dados"],
      },
    },
    {
      type: "code",
      say: "A request has a method, a URL, headers like the auth token, and a JSON body.",
      code: "POST /orders\nAuthorization: Bearer eyJhb…\nContent-Type: application/json\n\n{ \"productId\": 7, \"quantity\": 2 }",
      highlight: [1, 2],
      pt: { say: "Um pedido tem um método, uma URL, headers como o token de login, e um corpo em JSON." },
    },
    {
      type: "list",
      say: "REST uses nouns in the URL and the method says the action. | GET reads. | POST creates. | PATCH updates part of it. | DELETE removes.",
      items: ["`GET /orders` — list / read", "`POST /orders` — create", "`PATCH /orders/7` — update part", "`DELETE /orders/7` — remove"],
      pt: {
        say: "O REST usa substantivos na URL e o método diz a ação. | GET lê. | POST cria. | PATCH atualiza uma parte. | DELETE apaga.",
        items: ["`GET /orders` — listar / ler", "`POST /orders` — criar", "`PATCH /orders/7` — atualizar parte", "`DELETE /orders/7` — apagar"],
      },
    },
    {
      type: "order",
      say: "Your turn. Put the life of a request in order.",
      question: "From click to screen:",
      items: ["The app sends `POST /orders` with JSON", "The server checks the token", "The server validates and saves to the database", "The server answers `201 Created`", "The app shows the new order"],
      why: "Request, authentication, validation and saving, response, and finally the UI updates.",
      pt: {
        say: "Sua vez. Põe a vida de um pedido na ordem.",
        question: "Do clique à tela:",
        items: ["A app envia `POST /orders` com JSON", "O servidor verifica o token", "O servidor valida e guarda na base", "O servidor responde `201 Created`", "A app mostra o pedido novo"],
        why: "Pedido, autenticação, validação e gravação, resposta, e por fim a interface atualiza.",
      },
    },
    {
      type: "compare",
      say: "The status code family tells you who made the mistake. | Four hundreds: the client sent something wrong. Five hundreds: the server broke.",
      left: { label: "4xx · client", items: ["`400` invalid input", "`401` not logged in", "`403` no permission", "`404` not found"] },
      right: { label: "5xx · server", items: ["`500` bug on the server", "`503` server unavailable"] },
      pt: {
        say: "A família do código diz quem errou. | Quatrocentos: o cliente mandou algo errado. Quinhentos: o servidor quebrou.",
        left: { label: "4xx · cliente", items: ["`400` dados inválidos", "`401` sem login", "`403` sem permissão", "`404` não encontrado"] },
        right: { label: "5xx · servidor", items: ["`500` bug no servidor", "`503` servidor indisponível"] },
      },
    },
    {
      type: "quiz",
      say: "Quick check. A logged-in user tries to delete someone else's invoice. Which status?",
      question: "Logged in, but deleting **someone else's** invoice:",
      options: ["`401 Unauthorized`", "`403 Forbidden`", "`500 Internal Server Error`"],
      answerIndex: 1,
      why: "We know who you are, but you can't do this: that's 403. 401 means we don't know who you are.",
      pt: {
        say: "Pergunta rápida. Um usuário com login tenta apagar a fatura de outra pessoa. Que status?",
        question: "Com login, mas a apagar a fatura **de outra pessoa**:",
        options: ["`401 Unauthorized`", "`403 Forbidden`", "`500 Internal Server Error`"],
        why: "Sabemos quem você é, mas não pode fazer isto: isso é 403. O 401 é quando não sabemos quem você é.",
      },
    },
    {
      type: "truefalse",
      say: "True or false?",
      statement: "A REST API remembers who you are between requests, so you only send the token once.",
      answer: false,
      why: "REST is stateless: every request carries the token, usually in the Authorization header.",
      pt: {
        say: "Verdadeiro ou falso?",
        statement: "Uma API REST lembra-se de quem você é entre pedidos, então só envia o token uma vez.",
        why: "O REST é stateless: cada pedido leva o token, normalmente no header Authorization.",
      },
    },
  ],

  "lesson-node-api": [
    {
      type: "title",
      say: "Now let's go inside the server. | What happens between the request arriving and the response leaving?",
      headline: "Building an API",
      sub: "Routes, middleware, validation",
      pt: {
        say: "Agora vamos entrar no servidor. | O que acontece entre o pedido chegar e a resposta sair?",
        headline: "Criar uma API",
        sub: "Rotas, middleware, validação",
      },
    },
    {
      type: "flow",
      say: "Every request goes through a chain. | First a logger, | then the JSON body is parsed, | then authentication finds the user, | and finally your route handler runs.",
      steps: ["Logger", "Parse JSON body", "Auth middleware → `req.user`", "Route handler"],
      pt: {
        say: "Cada pedido passa por uma cadeia. | Primeiro um logger, | depois o corpo JSON é lido, | depois a autenticação descobre o usuário, | e por fim roda o handler da rota.",
        steps: ["Logger", "Ler o corpo JSON", "Middleware de auth → `req.user`", "Handler da rota"],
      },
    },
    {
      type: "code",
      say: "A route in three steps. | Validate the input, | run the business logic, | and answer with the right status.",
      code: "app.post('/orders', async (req, res) => {\n  const input = OrderSchema.safeParse(req.body);\n  if (!input.success) return res.status(400).json(input.error);\n  const order = await orders.create(req.user.id, input.data);\n  res.status(201).json(order);\n});",
      highlight: [2, 4, 5],
      pt: { say: "Uma rota em três passos. | Validar os dados, | rodar a regra de negócio, | e responder com o status certo." },
    },
    {
      type: "fill",
      say: "Your turn. In Express, where is the id in the URL slash orders slash forty two?",
      question: "Route `/orders/:id`, request `/orders/42`:",
      code: "const id = req.___.id; // '42'",
      choices: ["params", "query", "body"],
      answerIndex: 0,
      why: "Path segments are in params, what comes after the question mark is in query, and the JSON is in body.",
      pt: {
        say: "Sua vez. No Express, onde está o id na URL barra orders barra quarenta e dois?",
        question: "Rota `/orders/:id`, pedido `/orders/42`:",
        why: "Segmentos do caminho ficam em params, o que vem depois do ponto de interrogação em query, e o JSON em body.",
      },
    },
    {
      type: "list",
      say: "Four rules interviewers love. | Validate on the server. | Keep secrets in environment variables. | Handle errors with clear status codes. | Keep routes thin and logic in services.",
      items: ["Validate on the server (Zod)", "Secrets in `process.env`, never in Git", "Catch errors → clear `4xx`/`5xx`", "Thin routes, logic in services"],
      pt: {
        say: "Quatro regras que os entrevistadores adoram. | Validar no servidor. | Segredos em variáveis de ambiente. | Tratar erros com códigos claros. | Rotas finas e lógica em services.",
        items: ["Validar no servidor (Zod)", "Segredos em `process.env`, nunca no Git", "Capturar erros → `4xx`/`5xx` claros", "Rotas finas, lógica em services"],
      },
    },
    {
      type: "truefalse",
      say: "True or false?",
      statement: "If the React form already validates the email, the API doesn't need to.",
      answer: false,
      why: "Anyone can call the API directly with curl or Postman. Front-end validation is for UX, server validation is for security.",
      pt: {
        say: "Verdadeiro ou falso?",
        statement: "Se o formulário React já valida o email, a API não precisa validar.",
        why: "Qualquer um pode chamar a API diretamente com curl ou Postman. Validar no front-end é para a experiência, no servidor é para a segurança.",
      },
    },
    {
      type: "quiz",
      say: "Last one. Where should the database password live?",
      question: "The database password lives…",
      options: ["Hard-coded in `server.js`", "In an environment variable, outside Git", "In a `NEXT_PUBLIC_` variable"],
      answerIndex: 1,
      why: "Environment variables keep secrets out of the code. NEXT_PUBLIC variables are sent to the browser.",
      pt: {
        say: "Última. Onde deve ficar a senha da base de dados?",
        question: "A senha da base de dados fica…",
        options: ["Escrita no `server.js`", "Numa variável de ambiente, fora do Git", "Numa variável `NEXT_PUBLIC_`"],
        why: "Variáveis de ambiente tiram os segredos do código. Variáveis NEXT_PUBLIC são enviadas para o navegador.",
      },
    },
  ],
};

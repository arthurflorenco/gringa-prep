import type { ExerciseInput } from "@/lib/content/schema";
import { quiz } from "./_helpers";

/** Back-end: HTTP/REST, criar uma API em Node, autenticação, segurança web e RLS. */
export const exercises: ExerciseInput[] = [
  // ───────────────────────── HTTP e REST ─────────────────────────
  quiz("rest-http", "http-methods-quiz", 1, 2, {
    title: "Which HTTP method?",
    prompt: "Your app needs to **create** a new order. Which method does a REST API usually use?",
    options: ["`GET /orders`", "`PUT /orders`", "`POST /orders`", "`DELETE /orders`"],
    explanation: "`POST` creates a new resource in a collection. `GET` reads, `PUT`/`PATCH` update, `DELETE` removes.",
  }, {
    title: "Que método HTTP?",
    prompt: "A sua app precisa **criar** um pedido novo. Que método uma API REST costuma usar?",
    options: ["`GET /orders`", "`PUT /orders`", "`POST /orders`", "`DELETE /orders`"],
    explanation: "`POST` cria um recurso novo numa coleção. `GET` lê, `PUT`/`PATCH` atualizam, `DELETE` remove.",
  }),
  quiz("rest-http", "http-put-vs-patch-quiz", 2, 1, {
    title: "PUT or PATCH?",
    prompt: "You only want to change the `email` of user 42 and keep every other field. Which request fits best?",
    options: ["`PUT /users/42` with only `{ email }`", "`PATCH /users/42` with `{ email }`", "`POST /users/42/email`", "`GET /users/42?email=new`"],
    explanation: "`PATCH` is a **partial** update. `PUT` replaces the whole resource — sending only `email` could wipe the other fields. Never change data with `GET`.",
  }, {
    title: "PUT ou PATCH?",
    prompt: "Você só quer mudar o `email` do usuário 42 e manter todos os outros campos. Que pedido encaixa melhor?",
    options: ["`PUT /users/42` só com `{ email }`", "`PATCH /users/42` com `{ email }`", "`POST /users/42/email`", "`GET /users/42?email=novo`"],
    explanation: "`PATCH` é uma atualização **parcial**. `PUT` substitui o recurso inteiro — mandar só o `email` pode apagar os outros campos. Nunca mude dados com `GET`.",
  }),
  quiz("rest-http", "http-status-401-403-quiz", 2, 1, {
    title: "401 or 403?",
    prompt: "A logged-in user (valid token) tries to delete **someone else's** invoice. What should the API return?",
    options: ["`401 Unauthorized`", "`403 Forbidden`", "`404 Not Found` is never acceptable", "`500 Internal Server Error`"],
    explanation: "`401` = we don't know who you are (no/invalid token). `403` = we know who you are, but you can't do this. Some APIs return `404` on purpose to not reveal the resource exists — that's also valid.",
  }, {
    title: "401 ou 403?",
    prompt: "Um usuário com login (token válido) tenta apagar a fatura de **outra pessoa**. O que a API deve devolver?",
    options: ["`401 Unauthorized`", "`403 Forbidden`", "`404 Not Found` nunca é aceitável", "`500 Internal Server Error`"],
    explanation: "`401` = não sabemos quem você é (sem token ou inválido). `403` = sabemos quem é, mas não pode fazer isto. Algumas APIs devolvem `404` de propósito para não revelar que o recurso existe — também é válido.",
  }),
  quiz("rest-http", "http-status-families-quiz", 1, 3, {
    title: "Status code families",
    prompt: "The form sends an email without `@` and the API rejects it. Which status code fits?",
    options: ["`200 OK`", "`301 Moved Permanently`", "`500 Internal Server Error`", "`400 Bad Request` (or `422`)"],
    explanation: "4xx = the **client** sent something wrong (validation error → `400`/`422`). 5xx = the **server** broke. 2xx success, 3xx redirect.",
  }, {
    title: "Famílias de status",
    prompt: "O formulário envia um email sem `@` e a API rejeita. Que código encaixa?",
    options: ["`200 OK`", "`301 Moved Permanently`", "`500 Internal Server Error`", "`400 Bad Request` (ou `422`)"],
    explanation: "4xx = o **cliente** mandou algo errado (erro de validação → `400`/`422`). 5xx = o **servidor** quebrou. 2xx sucesso, 3xx redirecionamento.",
  }),
  quiz("rest-http", "http-201-quiz", 2, 0, {
    title: "After creating",
    prompt: "`POST /orders` succeeded and created order 981. What's the most precise response?",
    options: ["`201 Created` with the new order (and its id) in the body", "`200 OK` with an empty body", "`204 No Content` with the order in the body", "`302 Found` to `/orders`"],
    explanation: "`201 Created` says a new resource exists; return it (or at least its id / a `Location` header). `204` means there is **no** body.",
  }, {
    title: "Depois de criar",
    prompt: "`POST /orders` deu certo e criou o pedido 981. Qual é a resposta mais precisa?",
    options: ["`201 Created` com o pedido novo (e o id) no corpo", "`200 OK` com corpo vazio", "`204 No Content` com o pedido no corpo", "`302 Found` para `/orders`"],
    explanation: "`201 Created` diz que um recurso novo existe; devolva-o (ou pelo menos o id / um header `Location`). `204` significa que **não** há corpo.",
  }),
  quiz("rest-http", "http-idempotent-quiz", 3, 2, {
    title: "Idempotency",
    prompt: "The network fails and the client **retries** the same request. Which one is NOT idempotent (repeating it can change the result)?",
    options: ["`GET /orders/7`", "`PUT /orders/7` with the full order", "`POST /orders` with a new order", "`DELETE /orders/7`"],
    explanation: "Repeating `POST` can create **two** orders. `GET`, `PUT` and `DELETE` leave the same final state when repeated. That's why payment APIs use an `Idempotency-Key` header on POST.",
  }, {
    title: "Idempotência",
    prompt: "A rede falha e o cliente **repete** o mesmo pedido. Qual NÃO é idempotente (repetir pode mudar o resultado)?",
    options: ["`GET /orders/7`", "`PUT /orders/7` com o pedido inteiro", "`POST /orders` com um pedido novo", "`DELETE /orders/7`"],
    explanation: "Repetir um `POST` pode criar **dois** pedidos. `GET`, `PUT` e `DELETE` deixam o mesmo estado final quando repetidos. Por isso APIs de pagamento usam um header `Idempotency-Key` no POST.",
  }),
  quiz("rest-http", "http-rest-naming-quiz", 2, 1, {
    title: "REST naming",
    prompt: "Which endpoint follows REST conventions to list the comments of post 5?",
    options: ["`GET /getCommentsForPost?id=5`", "`GET /posts/5/comments`", "`POST /posts/5/listComments`", "`GET /comment/list/5`"],
    explanation: "Resources are **nouns** in the plural, nested when they belong to another one; the **method** says the action. No verbs in the URL.",
  }, {
    title: "Nomes em REST",
    prompt: "Que endpoint segue as convenções REST para listar os comentários do post 5?",
    options: ["`GET /getCommentsForPost?id=5`", "`GET /posts/5/comments`", "`POST /posts/5/listComments`", "`GET /comment/list/5`"],
    explanation: "Recursos são **substantivos** no plural, aninhados quando pertencem a outro; o **método** diz a ação. Sem verbos na URL.",
  }),
  quiz("rest-http", "http-cors-quiz", 3, 2, {
    title: "CORS error",
    prompt: "Your React app on `app.com` calls `api.com` and the browser shows a **CORS** error. Where is the fix?",
    options: ["In the React code: add `mode: 'no-cors'` and read the JSON", "Install a browser extension in production", "On the API server: send `Access-Control-Allow-Origin: https://app.com`", "CORS errors only happen in development"],
    explanation: "CORS is the **browser** protecting users; the **server** decides which origins may read its responses via `Access-Control-Allow-*` headers. `no-cors` gives you an opaque response you can't read.",
  }, {
    title: "Erro de CORS",
    prompt: "A sua app React em `app.com` chama `api.com` e o navegador mostra um erro de **CORS**. Onde está a correção?",
    options: ["No código React: pôr `mode: 'no-cors'` e ler o JSON", "Instalar uma extensão do navegador em produção", "No servidor da API: enviar `Access-Control-Allow-Origin: https://app.com`", "Erros de CORS só acontecem em desenvolvimento"],
    explanation: "CORS é o **navegador** a proteger o usuário; o **servidor** decide que origens podem ler as respostas com os headers `Access-Control-Allow-*`. `no-cors` dá uma resposta opaca que você não consegue ler.",
  }),
  quiz("rest-http", "http-cache-quiz", 3, 0, {
    title: "Pagination",
    prompt: "`GET /products` returns 50 000 rows and the page is slow. What's the standard API fix?",
    options: ["Paginate: `GET /products?limit=20&cursor=…` (or `page=`)", "Return everything but gzip it", "Switch the method to `POST`", "Return `206 Partial Content` always"],
    explanation: "Never return unbounded lists. Paginate with `limit` + `offset`/`page` or a **cursor** (better for big, changing tables), and return the next cursor.",
  }, {
    title: "Paginação",
    prompt: "`GET /products` devolve 50 000 linhas e a página fica lenta. Qual é a correção padrão na API?",
    options: ["Paginar: `GET /products?limit=20&cursor=…` (ou `page=`)", "Devolver tudo, mas comprimido com gzip", "Trocar o método para `POST`", "Devolver sempre `206 Partial Content`"],
    explanation: "Nunca devolva listas sem limite. Pagine com `limit` + `offset`/`page` ou um **cursor** (melhor para tabelas grandes que mudam), e devolva o próximo cursor.",
  }),
  {
    id: "rest-api-explain",
    kind: "concept",
    topic: "rest-http",
    title: "What is a REST API?",
    prompt: "Classic interview question: **What is a REST API?** Explain how a request works, using an example from an app you'd build.",
    difficulty: 2,
    estimatedMin: 6,
    tags: ["interview-classic"],
    modelAnswer:
      "A REST API exposes **resources** (users, orders) at URLs and uses **HTTP methods** to act on them: `GET /orders` lists, `POST /orders` creates, `PATCH /orders/7` updates, `DELETE /orders/7` removes. The server answers with a **status code** and usually **JSON**.\n\nIt's **stateless**: each request carries everything needed, like the auth token in the `Authorization` header — the server doesn't remember previous requests.\n\nFor example, in a booking app the front-end calls `POST /bookings` with the date and room; the server validates the input, checks the user is allowed, saves it in Postgres and returns `201 Created` with the booking. If the input is invalid it returns `400`, if the token is missing `401`.",
    rubric: ["Resources at URLs + HTTP methods (GET/POST/PUT/PATCH/DELETE)", "Status codes and JSON responses", "Stateless: token sent on every request", "Concrete example request → validation → database → response"],
    rubricKeys: [
      ["get", "post", "put", "patch", "delete", "method", "metodo", "resource", "recurso", "endpoint"],
      ["status code", "200", "201", "400", "404", "json"],
      ["stateless", "sem estado", "token", "authorization", "header"],
      ["for example", "por exemplo", "validat", "valida", "database", "banco", "postgres", "save", "guarda", "salva"],
    ],
    pt: {
      title: "O que é uma API REST?",
      prompt: "Pergunta clássica: **O que é uma API REST?** Explique como funciona um pedido, com um exemplo de uma app que você faria.",
      modelAnswer:
        "Uma API REST expõe **recursos** (usuários, pedidos) em URLs e usa **métodos HTTP** para agir sobre eles: `GET /orders` lista, `POST /orders` cria, `PATCH /orders/7` atualiza, `DELETE /orders/7` remove. O servidor responde com um **código de status** e normalmente **JSON**.\n\nÉ **stateless** (sem estado): cada pedido leva tudo o que é preciso, como o token no header `Authorization` — o servidor não se lembra dos pedidos anteriores.\n\nPor exemplo, numa app de reservas o front-end chama `POST /bookings` com a data e o quarto; o servidor valida os dados, verifica se o usuário pode, guarda no Postgres e devolve `201 Created` com a reserva. Se os dados forem inválidos devolve `400`, se faltar o token `401`.",
      rubric: ["Recursos em URLs + métodos HTTP (GET/POST/PUT/PATCH/DELETE)", "Códigos de status e respostas em JSON", "Stateless: token enviado em cada pedido", "Exemplo concreto pedido → validação → banco → resposta"],
    },
  },

  // ───────────────────────── Node.js: criar uma API ─────────────────────────
  quiz("node-api", "node-what-is-quiz", 1, 1, {
    title: "What is Node.js?",
    prompt: "What is Node.js?",
    options: ["A front-end framework like React", "A runtime that runs JavaScript outside the browser (e.g. on a server)", "A database", "A new version of JavaScript"],
    explanation: "Node.js runs JavaScript on your machine or a server, with access to files, network and databases. Express, Fastify and Next.js route handlers run on it.",
  }, {
    title: "O que é Node.js?",
    prompt: "O que é o Node.js?",
    options: ["Um framework de front-end como o React", "Um runtime que roda JavaScript fora do navegador (ex.: num servidor)", "Uma base de dados", "Uma versão nova do JavaScript"],
    explanation: "O Node.js roda JavaScript na sua máquina ou num servidor, com acesso a ficheiros, rede e bases de dados. Express, Fastify e os route handlers do Next.js rodam nele.",
  }),
  quiz("node-api", "node-express-route-quiz", 2, 2, {
    title: "Reading an Express route",
    prompt: "```js\napp.get('/users/:id', async (req, res) => {\n  const user = await db.findUser(req.params.id);\n  if (!user) return res.status(404).json({ error: 'Not found' });\n  res.json(user);\n});\n```\nWhat does `GET /users/abc` return if no user has id `abc`?",
    options: ["`200` with `null`", "`500` because `user` is undefined", "`404` with `{ error: 'Not found' }`", "It hangs forever"],
    explanation: "`req.params.id` is `'abc'`; `findUser` returns nothing, so the early `return res.status(404)…` runs. The `return` matters: without it the code would also try `res.json(user)`.",
  }, {
    title: "Ler uma rota Express",
    prompt: "```js\napp.get('/users/:id', async (req, res) => {\n  const user = await db.findUser(req.params.id);\n  if (!user) return res.status(404).json({ error: 'Not found' });\n  res.json(user);\n});\n```\nO que `GET /users/abc` devolve se nenhum usuário tiver o id `abc`?",
    options: ["`200` com `null`", "`500` porque `user` é undefined", "`404` com `{ error: 'Not found' }`", "Fica pendurado para sempre"],
    explanation: "`req.params.id` é `'abc'`; o `findUser` não encontra nada, então o `return res.status(404)…` roda. O `return` importa: sem ele o código ainda tentaria `res.json(user)`.",
  }),
  quiz("node-api", "node-params-query-body-quiz", 2, 3, {
    title: "params, query or body?",
    prompt: "`POST /shops/12/orders?notify=true` with JSON `{ \"item\": \"coffee\" }`. In Express, where is each value?",
    options: [
      "All of them in `req.body`",
      "`12` in `req.query`, `notify` in `req.params`, item in `req.body`",
      "`12` in `req.body`, `notify` in `req.headers`, item in `req.query`",
      "`12` in `req.params`, `notify` in `req.query`, item in `req.body`",
    ],
    explanation: "Path segments (`:shopId`) → `req.params`; after `?` → `req.query`; the JSON payload → `req.body` (needs `express.json()` middleware).",
  }, {
    title: "params, query ou body?",
    prompt: "`POST /shops/12/orders?notify=true` com o JSON `{ \"item\": \"coffee\" }`. No Express, onde está cada valor?",
    options: [
      "Todos em `req.body`",
      "`12` em `req.query`, `notify` em `req.params`, item em `req.body`",
      "`12` em `req.body`, `notify` em `req.headers`, item em `req.query`",
      "`12` em `req.params`, `notify` em `req.query`, item em `req.body`",
    ],
    explanation: "Segmentos do caminho (`:shopId`) → `req.params`; depois do `?` → `req.query`; o JSON enviado → `req.body` (precisa do middleware `express.json()`).",
  }),
  quiz("node-api", "node-middleware-quiz", 2, 0, {
    title: "Middleware",
    prompt: "What is a **middleware** in Express (or Next.js)?",
    options: [
      "A function that runs before the route handler and can read/modify the request, stop it, or call `next()`",
      "The database layer",
      "A React component shared by all pages",
      "A library to send emails",
    ],
    explanation: "Middleware runs in a chain: logging, parsing JSON, checking auth, rate limiting. It either responds (e.g. `401`) or calls `next()` to continue.",
  }, {
    title: "Middleware",
    prompt: "O que é um **middleware** no Express (ou no Next.js)?",
    options: [
      "Uma função que roda antes do handler da rota e pode ler/mudar o pedido, pará-lo ou chamar `next()`",
      "A camada da base de dados",
      "Um componente React partilhado por todas as páginas",
      "Uma biblioteca para enviar emails",
    ],
    explanation: "Middlewares rodam em cadeia: log, ler o JSON, verificar login, limitar pedidos. Ou respondem (ex.: `401`) ou chamam `next()` para continuar.",
  }),
  quiz("node-api", "node-validation-quiz", 2, 2, {
    title: "Where to validate",
    prompt: "The signup form already validates the email in React. Do you still need to validate in the API?",
    options: ["No — the front-end already checked it", "Only in development", "Yes — anyone can call the API directly (curl, Postman), so the server must validate (e.g. with Zod)", "Only if the database has no constraints"],
    explanation: "Front-end validation is for **UX**; server validation is for **security and data integrity**. Never trust the client.",
  }, {
    title: "Onde validar",
    prompt: "O formulário de cadastro já valida o email no React. Ainda precisa validar na API?",
    options: ["Não — o front-end já verificou", "Só em desenvolvimento", "Sim — qualquer um pode chamar a API diretamente (curl, Postman), então o servidor tem de validar (ex.: com Zod)", "Só se a base de dados não tiver constraints"],
    explanation: "Validar no front-end é para a **experiência do usuário**; validar no servidor é para **segurança e integridade dos dados**. Nunca confie no cliente.",
  }),
  quiz("node-api", "node-env-secrets-quiz", 2, 1, {
    title: "Secrets",
    prompt: "Where should the database password and the Stripe secret key live?",
    options: ["Hard-coded in `server.js` so it's easy to find", "In environment variables (`process.env.X`), loaded from `.env` locally and from the hosting settings in production — never committed", "In `localStorage`", "In a `NEXT_PUBLIC_` variable"],
    explanation: "Secrets go in env vars and `.env` is in `.gitignore`. In Next.js, anything prefixed `NEXT_PUBLIC_` is **shipped to the browser** — never put secrets there.",
  }, {
    title: "Segredos",
    prompt: "Onde devem ficar a senha da base de dados e a chave secreta do Stripe?",
    options: ["Escritas no `server.js` para ser fácil de achar", "Em variáveis de ambiente (`process.env.X`), lidas do `.env` localmente e das configurações da hospedagem em produção — nunca no Git", "No `localStorage`", "Numa variável `NEXT_PUBLIC_`"],
    explanation: "Segredos vão em variáveis de ambiente e o `.env` fica no `.gitignore`. No Next.js, tudo o que começa com `NEXT_PUBLIC_` **vai para o navegador** — nunca ponha segredos aí.",
  }),
  quiz("node-api", "node-async-error-quiz", 3, 3, {
    title: "Unhandled error",
    prompt: "```js\napp.post('/orders', async (req, res) => {\n  const order = await db.insert(req.body); // throws: duplicate key\n  res.status(201).json(order);\n});\n```\nWhat's the problem and the fix?",
    options: [
      "Nothing — Express always returns 400 automatically",
      "`await` can't be used in a route",
      "The status should be 200",
      "The thrown error isn't handled: wrap in `try/catch` (or an error middleware) and return a proper `409`/`400`/`500` with a clear message",
    ],
    explanation: "An unhandled rejection can crash the request (or the process) and leak a stack trace. Catch it, log it, and map known errors (duplicate → `409 Conflict`) to clear responses.",
  }, {
    title: "Erro não tratado",
    prompt: "```js\napp.post('/orders', async (req, res) => {\n  const order = await db.insert(req.body); // lança: chave duplicada\n  res.status(201).json(order);\n});\n```\nQual é o problema e a correção?",
    options: [
      "Nenhum — o Express devolve 400 sozinho",
      "Não se pode usar `await` numa rota",
      "O status devia ser 200",
      "O erro lançado não é tratado: envolver em `try/catch` (ou middleware de erro) e devolver um `409`/`400`/`500` com mensagem clara",
    ],
    explanation: "Uma rejeição não tratada pode derrubar o pedido (ou o processo) e expor o stack trace. Capture, registe no log e traduza erros conhecidos (duplicado → `409 Conflict`) em respostas claras.",
  }),
  quiz("node-api", "node-next-route-handler-quiz", 2, 0, {
    title: "API in Next.js",
    prompt: "In the Next.js App Router, how do you create `GET /api/health`?",
    options: [
      "A file `app/api/health/route.ts` that exports `async function GET() { return Response.json({ ok: true }) }`",
      "A file `pages/health.tsx` with a React component",
      "Calling `app.get('/api/health')` inside a component",
      "Adding the route in `next.config.js`",
    ],
    explanation: "Route handlers live in `route.ts` files and export functions named after the HTTP method (`GET`, `POST`…). They run on the server and use the Web `Request`/`Response` API.",
  }, {
    title: "API no Next.js",
    prompt: "No App Router do Next.js, como se cria `GET /api/health`?",
    options: [
      "Um ficheiro `app/api/health/route.ts` que exporta `async function GET() { return Response.json({ ok: true }) }`",
      "Um ficheiro `pages/health.tsx` com um componente React",
      "Chamar `app.get('/api/health')` dentro de um componente",
      "Adicionar a rota no `next.config.js`",
    ],
    explanation: "Route handlers vivem em ficheiros `route.ts` e exportam funções com o nome do método HTTP (`GET`, `POST`…). Rodam no servidor e usam a API Web de `Request`/`Response`.",
  }),
  quiz("node-api", "node-layers-quiz", 3, 1, {
    title: "Where does the logic go?",
    prompt: "Your route handler has 120 lines: parsing, validation, discount rules, SQL and emails. What's the usual refactor?",
    options: [
      "Move everything to the React component",
      "Split into layers: the route only parses/validates and calls a **service** (business rules), which uses a **repository/data** module for SQL",
      "Put it all in one middleware",
      "Nothing — long handlers are faster",
    ],
    explanation: "Thin controllers, business logic in services, database access isolated. Each piece becomes testable on its own (unit-test the discount rules without HTTP or DB).",
  }, {
    title: "Onde fica a lógica?",
    prompt: "O seu route handler tem 120 linhas: parsing, validação, regras de desconto, SQL e emails. Qual é a refatoração habitual?",
    options: [
      "Passar tudo para o componente React",
      "Separar em camadas: a rota só lê/valida e chama um **service** (regras de negócio), que usa um módulo de **repositório/dados** para o SQL",
      "Pôr tudo num único middleware",
      "Nada — handlers longos são mais rápidos",
    ],
    explanation: "Controllers finos, regras de negócio em services, acesso à base isolado. Cada parte passa a ser testável sozinha (testar as regras de desconto sem HTTP nem banco).",
  }),
  {
    id: "node-request-lifecycle",
    kind: "concept",
    topic: "node-api",
    title: "Walk me through an API endpoint you'd build",
    prompt: "**How would you build an endpoint to create an order?** Go from the request arriving to the response, naming what you check on the server.",
    difficulty: 3,
    estimatedMin: 7,
    tags: ["interview-classic"],
    modelAnswer:
      "I'd create `POST /orders`. First a middleware **authenticates** the request from the token and attaches the user. Then the handler **validates** the body with a schema (Zod) — wrong input returns `400` with the field errors.\n\nNext the **authorization** and business rules in a service: the user can only order from their own account, the product exists and has stock. I save the order in a **transaction** (order + order items + stock update) so nothing is half-written.\n\nI return `201 Created` with the order. Errors are caught by an error middleware: known ones become `409`/`404`, unknown ones are logged and return `500` without leaking details. For example, if the user clicks twice, an idempotency key prevents a duplicate order.",
    rubric: ["Authentication (token → user) before the handler", "Server-side validation of the body (400 on bad input)", "Authorization / business rules + transaction when writing several tables", "Correct status codes and centralized error handling (no stack traces leaked)"],
    rubricKeys: [
      ["authenticat", "autentic", "token", "session", "sessao", "middleware"],
      ["validat", "valida", "zod", "schema", "400"],
      ["authoriz", "autoriz", "permission", "permissao", "own", "dono", "transaction", "transacao", "business rule", "regra"],
      ["201", "409", "500", "error handl", "tratamento de erro", "try", "catch", "log"],
    ],
    pt: {
      title: "Explique um endpoint que você faria",
      prompt: "**Como você faria um endpoint para criar um pedido?** Vá do pedido chegando até a resposta, dizendo o que verifica no servidor.",
      modelAnswer:
        "Criaria `POST /orders`. Primeiro um middleware **autentica** o pedido pelo token e anexa o usuário. Depois o handler **valida** o corpo com um schema (Zod) — dados errados devolvem `400` com os erros por campo.\n\nA seguir a **autorização** e as regras de negócio num service: o usuário só pode pedir na própria conta, o produto existe e tem stock. Guardo o pedido numa **transação** (pedido + itens + baixa de stock) para nada ficar pela metade.\n\nDevolvo `201 Created` com o pedido. Os erros são apanhados por um middleware de erro: os conhecidos viram `409`/`404`, os desconhecidos vão para o log e devolvem `500` sem expor detalhes. Por exemplo, se o usuário clicar duas vezes, uma chave de idempotência evita um pedido duplicado.",
      rubric: ["Autenticação (token → usuário) antes do handler", "Validação do corpo no servidor (400 com dados errados)", "Autorização / regras de negócio + transação ao escrever várias tabelas", "Códigos de status certos e tratamento de erros centralizado (sem expor stack trace)"],
    },
  },

  // ───────────────────────── Autenticação vs autorização ─────────────────────────
  quiz("authn-authz", "auth-session-vs-jwt-quiz", 3, 1, {
    title: "Session vs JWT",
    prompt: "What's a real difference between a **server session** (cookie with a session id) and a **JWT**?",
    options: [
      "JWTs are encrypted, sessions are not",
      "A session is looked up on the server and easy to revoke; a JWT is self-contained (signed claims) and is valid until it expires unless you add a denylist",
      "Sessions only work with React",
      "JWTs can't be stored in cookies",
    ],
    explanation: "JWTs are **signed**, not encrypted — anyone can read the payload. Their trade-off: no DB lookup per request, but logout/revocation is harder, so keep them short-lived with a refresh token.",
  }, {
    title: "Sessão vs JWT",
    prompt: "Qual é uma diferença real entre uma **sessão no servidor** (cookie com id de sessão) e um **JWT**?",
    options: [
      "JWTs são encriptados, sessões não",
      "A sessão é consultada no servidor e fácil de revogar; o JWT é autocontido (claims assinados) e vale até expirar, a não ser que você tenha uma lista de bloqueio",
      "Sessões só funcionam com React",
      "JWTs não podem ficar em cookies",
    ],
    explanation: "JWTs são **assinados**, não encriptados — qualquer um lê o payload. O trade-off: sem consulta ao banco em cada pedido, mas logout/revogação é mais difícil, por isso use validade curta com refresh token.",
  }),
  quiz("authn-authz", "auth-password-storage-quiz", 2, 2, {
    title: "Storing passwords",
    prompt: "How should passwords be stored?",
    options: ["Encrypted with AES so you can show them to the user", "In plain text but in a private table", "Hashed with a slow, salted algorithm (bcrypt/argon2) — never reversible", "Base64-encoded"],
    explanation: "You never need the original password: hash it with bcrypt/argon2 (salt + slow on purpose) and compare hashes at login. Base64 is just encoding.",
  }, {
    title: "Guardar senhas",
    prompt: "Como as senhas devem ser guardadas?",
    options: ["Encriptadas com AES para poder mostrar ao usuário", "Em texto simples, mas numa tabela privada", "Com hash de um algoritmo lento e com salt (bcrypt/argon2) — nunca reversível", "Codificadas em Base64"],
    explanation: "Você nunca precisa da senha original: faça hash com bcrypt/argon2 (salt + lento de propósito) e compare os hashes no login. Base64 é só codificação.",
  }),
  quiz("authn-authz", "auth-idor-quiz", 3, 0, {
    title: "Spot the bug",
    prompt: "```js\napp.get('/api/invoices/:id', requireLogin, async (req, res) => {\n  const invoice = await db.invoice.find(req.params.id);\n  res.json(invoice);\n});\n```\nWhat's the security problem?",
    options: [
      "Any logged-in user can read any invoice by changing the id (IDOR / broken access control) — it must check `invoice.userId === req.user.id`",
      "It should use POST instead of GET",
      "`requireLogin` makes it slow",
      "There is no problem because the user is logged in",
    ],
    explanation: "Authentication ≠ authorization. Being logged in doesn't mean you own the invoice. Filter by owner in the query (or with RLS) and return `404`/`403` otherwise.",
  }, {
    title: "Ache o bug",
    prompt: "```js\napp.get('/api/invoices/:id', requireLogin, async (req, res) => {\n  const invoice = await db.invoice.find(req.params.id);\n  res.json(invoice);\n});\n```\nQual é o problema de segurança?",
    options: [
      "Qualquer usuário com login lê qualquer fatura trocando o id (IDOR / controlo de acesso quebrado) — tem de verificar `invoice.userId === req.user.id`",
      "Devia usar POST em vez de GET",
      "O `requireLogin` deixa lento",
      "Não há problema porque o usuário tem login",
    ],
    explanation: "Autenticação ≠ autorização. Ter login não significa ser dono da fatura. Filtre pelo dono na query (ou com RLS) e devolva `404`/`403` caso contrário.",
  }),
  quiz("authn-authz", "auth-token-storage-quiz", 3, 3, {
    title: "Where to keep the token",
    prompt: "In a web app, which option protects the auth token best against XSS stealing it?",
    options: ["`localStorage`", "A global JS variable", "The URL query string", "An `HttpOnly`, `Secure`, `SameSite` cookie"],
    explanation: "`HttpOnly` cookies can't be read by JavaScript, so an XSS script can't exfiltrate them. Pair with `SameSite`/CSRF protection. Tokens in URLs leak into logs and history.",
  }, {
    title: "Onde guardar o token",
    prompt: "Numa app web, que opção protege melhor o token de login contra roubo por XSS?",
    options: ["`localStorage`", "Uma variável global de JS", "A query string da URL", "Um cookie `HttpOnly`, `Secure`, `SameSite`"],
    explanation: "Cookies `HttpOnly` não podem ser lidos pelo JavaScript, então um script de XSS não consegue roubá-los. Junte `SameSite`/proteção CSRF. Tokens na URL vazam para logs e histórico.",
  }),
  quiz("authn-authz", "auth-oauth-quiz", 2, 1, {
    title: "\"Sign in with Google\"",
    prompt: "What does \"Sign in with Google\" (OAuth / OpenID Connect) give your app?",
    options: ["The user's Google password", "A verified identity (and optionally permission to some data) without your app ever seeing the Google password", "Free hosting", "Admin access to the user's Google account"],
    explanation: "The user logs in on Google; your app receives tokens proving who they are (OIDC) and maybe scoped access (OAuth). You never handle their password.",
  }, {
    title: "\"Entrar com Google\"",
    prompt: "O que o \"Entrar com Google\" (OAuth / OpenID Connect) dá à sua app?",
    options: ["A senha do Google do usuário", "Uma identidade verificada (e, opcionalmente, permissão para alguns dados) sem a sua app ver a senha do Google", "Hospedagem grátis", "Acesso de admin à conta Google do usuário"],
    explanation: "O usuário faz login no Google; a sua app recebe tokens que provam quem ele é (OIDC) e talvez acesso limitado (OAuth). Você nunca mexe na senha dele.",
  }),
  quiz("authn-authz", "auth-roles-quiz", 2, 2, {
    title: "Hiding the button",
    prompt: "Only admins may delete projects. You hid the Delete button for non-admins. Is that enough?",
    options: ["Yes, they can't click what they can't see", "Yes, if the button is also disabled", "No — the API/database must also check the role, because the request can be sent without the UI", "No — you must also hide the URL"],
    explanation: "UI checks are UX. Authorization must be enforced on the server (or by RLS) for **every** request.",
  }, {
    title: "Esconder o botão",
    prompt: "Só admins podem apagar projetos. Você escondeu o botão Apagar para quem não é admin. Basta?",
    options: ["Sim, não dá para clicar no que não se vê", "Sim, se o botão também estiver desativado", "Não — a API/base de dados também tem de verificar o papel, porque o pedido pode ser enviado sem a interface", "Não — também é preciso esconder a URL"],
    explanation: "Verificações na interface são UX. A autorização tem de ser aplicada no servidor (ou por RLS) em **cada** pedido.",
  }),

  // ───────────────────────── Segurança web ─────────────────────────
  quiz("web-security", "sec-sql-injection-quiz", 2, 1, {
    title: "SQL injection",
    prompt: "```js\ndb.query(`SELECT * FROM users WHERE email = '${req.query.email}'`)\n```\nWhat's wrong and how do you fix it?",
    options: ["Nothing, template strings are safe", "SQL injection — use parameterized queries: `db.query('… WHERE email = $1', [email])`", "It's slow — add an index", "It should be `SELECT email`"],
    explanation: "With `' OR '1'='1` the attacker changes the query. Parameters send the value separately, so it's never executed as SQL. ORMs/query builders do this for you.",
  }, {
    title: "SQL injection",
    prompt: "```js\ndb.query(`SELECT * FROM users WHERE email = '${req.query.email}'`)\n```\nO que está errado e como corrigir?",
    options: ["Nada, template strings são seguras", "SQL injection — usar queries parametrizadas: `db.query('… WHERE email = $1', [email])`", "É lento — pôr um índice", "Devia ser `SELECT email`"],
    explanation: "Com `' OR '1'='1` o atacante muda a query. Parâmetros enviam o valor separado, então ele nunca é executado como SQL. ORMs/query builders fazem isto por você.",
  }),
  quiz("web-security", "sec-xss-quiz", 2, 3, {
    title: "XSS in React",
    prompt: "Which React code can create an **XSS** vulnerability with user-provided `bio`?",
    options: ["`<p>{bio}</p>`", "`<input value={bio} />`", "`<p title={bio}>Hi</p>`", "`<div dangerouslySetInnerHTML={{ __html: bio }} />`"],
    explanation: "React escapes text in `{}` automatically. `dangerouslySetInnerHTML` inserts raw HTML — a `<script>`/`onerror` payload runs. If you must, sanitize (e.g. DOMPurify).",
  }, {
    title: "XSS no React",
    prompt: "Que código React pode criar uma vulnerabilidade de **XSS** com a `bio` escrita pelo usuário?",
    options: ["`<p>{bio}</p>`", "`<input value={bio} />`", "`<p title={bio}>Oi</p>`", "`<div dangerouslySetInnerHTML={{ __html: bio }} />`"],
    explanation: "O React escapa o texto dentro de `{}` automaticamente. `dangerouslySetInnerHTML` insere HTML cru — um `<script>`/`onerror` roda. Se for mesmo preciso, sanitize (ex.: DOMPurify).",
  }),
  quiz("web-security", "sec-csrf-quiz", 3, 0, {
    title: "CSRF",
    prompt: "What is CSRF and a common defense?",
    options: [
      "Another site makes the user's browser send a request with their cookies; defend with `SameSite` cookies and CSRF tokens",
      "Stealing passwords from the database; defend with HTTPS",
      "Injecting SQL; defend with indexes",
      "A slow page; defend with caching",
    ],
    explanation: "Cookies go automatically with requests, so a malicious page can trigger actions. `SameSite=Lax/Strict` blocks most cross-site sends; tokens prove the request came from your UI.",
  }, {
    title: "CSRF",
    prompt: "O que é CSRF e uma defesa comum?",
    options: [
      "Outro site faz o navegador do usuário enviar um pedido com os cookies dele; defesa: cookies `SameSite` e tokens CSRF",
      "Roubar senhas da base de dados; defesa: HTTPS",
      "Injetar SQL; defesa: índices",
      "Uma página lenta; defesa: cache",
    ],
    explanation: "Cookies vão automaticamente nos pedidos, então uma página maliciosa pode disparar ações. `SameSite=Lax/Strict` bloqueia a maioria dos envios entre sites; tokens provam que o pedido veio da sua interface.",
  }),
  quiz("web-security", "sec-rate-limit-quiz", 2, 2, {
    title: "Brute force",
    prompt: "Someone tries 10 000 passwords per minute on `/login`. What helps most?",
    options: ["A longer error message", "Making passwords case-insensitive", "Rate limiting per IP/account (+ lockout or CAPTCHA after failures)", "Switching to GET"],
    explanation: "Rate limits slow brute force and credential stuffing; add MFA for sensitive accounts and return the same generic error for wrong user/password.",
  }, {
    title: "Força bruta",
    prompt: "Alguém tenta 10 000 senhas por minuto em `/login`. O que mais ajuda?",
    options: ["Uma mensagem de erro mais longa", "Deixar as senhas sem distinção de maiúsculas", "Rate limiting por IP/conta (+ bloqueio ou CAPTCHA depois de falhas)", "Passar para GET"],
    explanation: "Rate limits atrasam força bruta e credential stuffing; acrescente MFA para contas sensíveis e devolva o mesmo erro genérico para usuário/senha errados.",
  }),
  quiz("web-security", "sec-https-quiz", 1, 1, {
    title: "Why HTTPS",
    prompt: "What does HTTPS protect?",
    options: ["It makes the server immune to SQL injection", "It encrypts the traffic between browser and server, so others on the network can't read or change it", "It hides the domain name from everyone", "It replaces the need for login"],
    explanation: "TLS encrypts and authenticates the connection. It doesn't fix bugs in your app (injection, broken access control).",
  }, {
    title: "Porquê HTTPS",
    prompt: "O que o HTTPS protege?",
    options: ["Deixa o servidor imune a SQL injection", "Encripta o tráfego entre navegador e servidor, para outros na rede não lerem nem alterarem", "Esconde o domínio de todos", "Substitui a necessidade de login"],
    explanation: "O TLS encripta e autentica a ligação. Não corrige bugs da app (injection, controlo de acesso quebrado).",
  }),

  // ───────────────────────── RLS ─────────────────────────
  quiz("rls", "rls-enabled-no-policy-quiz", 2, 2, {
    title: "RLS with no policy",
    prompt: "You run `ALTER TABLE notes ENABLE ROW LEVEL SECURITY;` and create **no** policy. What can a normal (non-owner) user select from `notes`?",
    options: ["Everything", "Only their own rows", "Nothing — no policy means no rows are visible", "Only rows created today"],
    explanation: "RLS is **deny by default**: with RLS on and no policy, regular roles see zero rows. You add policies to allow access.",
  }, {
    title: "RLS sem policy",
    prompt: "Você roda `ALTER TABLE notes ENABLE ROW LEVEL SECURITY;` e **não** cria nenhuma policy. O que um usuário normal (não dono da tabela) consegue ler de `notes`?",
    options: ["Tudo", "Só as linhas dele", "Nada — sem policy nenhuma linha fica visível", "Só as linhas criadas hoje"],
    explanation: "RLS **nega por padrão**: com RLS ligado e sem policy, papéis normais veem zero linhas. Você cria policies para permitir acesso.",
  }),
  quiz("rls", "rls-using-check-quiz", 3, 1, {
    title: "USING vs WITH CHECK",
    prompt: "In a Postgres policy, what's the difference between `USING` and `WITH CHECK`?",
    options: ["They are synonyms", "`USING` filters which existing rows you can see/update/delete; `WITH CHECK` validates the rows you insert or write", "`USING` is for admins, `WITH CHECK` for users", "`WITH CHECK` runs only on SELECT"],
    explanation: "Without a `WITH CHECK` on insert/update, a user could write a row with someone else's `user_id`. Typical: `WITH CHECK (user_id = auth.uid())`.",
  }, {
    title: "USING vs WITH CHECK",
    prompt: "Numa policy do Postgres, qual a diferença entre `USING` e `WITH CHECK`?",
    options: ["São sinónimos", "`USING` filtra que linhas existentes você pode ver/atualizar/apagar; `WITH CHECK` valida as linhas que você insere ou escreve", "`USING` é para admins, `WITH CHECK` para usuários", "`WITH CHECK` só roda no SELECT"],
    explanation: "Sem `WITH CHECK` no insert/update, um usuário podia escrever uma linha com o `user_id` de outra pessoa. Típico: `WITH CHECK (user_id = auth.uid())`.",
  }),
  quiz("rls", "rls-supabase-anon-quiz", 3, 0, {
    title: "Supabase anon key",
    prompt: "Your Supabase **anon key** is in the front-end bundle. Why isn't that a disaster?",
    options: [
      "Because RLS policies decide what each request can access; the anon key alone only gets what policies allow",
      "Because the key is encrypted in the browser",
      "Because Supabase hides it automatically",
      "It is a disaster — rotate it now",
    ],
    explanation: "The anon key is public by design. The protection is RLS. The **service role** key bypasses RLS and must never reach the browser.",
  }, {
    title: "Anon key do Supabase",
    prompt: "A **anon key** do Supabase está no bundle do front-end. Porque isso não é um desastre?",
    options: [
      "Porque as policies de RLS decidem o que cada pedido pode acessar; a anon key sozinha só obtém o que as policies permitem",
      "Porque a chave fica encriptada no navegador",
      "Porque o Supabase a esconde sozinho",
      "É um desastre — troque-a já",
    ],
    explanation: "A anon key é pública de propósito. A proteção é o RLS. A chave **service role** ignora o RLS e nunca pode chegar ao navegador.",
  }),
  quiz("rls", "rls-policy-read-quiz", 3, 2, {
    title: "Read the policy",
    prompt: "```sql\nCREATE POLICY \"read own\" ON todos FOR SELECT\n  USING (user_id = auth.uid());\n```\nUser A runs `select * from todos`. What comes back?",
    options: ["All todos", "An error because there's no WHERE", "Only rows where `user_id` is A's id — Postgres adds the filter automatically", "Only A's todos created after the policy"],
    explanation: "RLS appends the policy as an invisible WHERE to every query, even `select *` without filters.",
  }, {
    title: "Leia a policy",
    prompt: "```sql\nCREATE POLICY \"read own\" ON todos FOR SELECT\n  USING (user_id = auth.uid());\n```\nO usuário A roda `select * from todos`. O que volta?",
    options: ["Todos os todos", "Um erro porque não há WHERE", "Só as linhas com `user_id` igual ao id de A — o Postgres junta o filtro sozinho", "Só os todos de A criados depois da policy"],
    explanation: "O RLS acrescenta a policy como um WHERE invisível a cada query, mesmo num `select *` sem filtros.",
  }),
];

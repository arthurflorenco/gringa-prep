import type { LessonDraftInput } from "@/lib/content/schema";

/** Semana 4 — HTTP/REST e criar uma API em Node. */
export const lessons: LessonDraftInput[] = [
  {
    id: "lesson-rest-http",
    kind: "lesson",
    topic: "rest-http",
    title: "HTTP and REST APIs",
    prompt: "Methods, URLs, status codes and JSON — how the front-end talks to the back-end.",
    difficulty: 1,
    estimatedMin: 8,
    tags: ["backend", "http"],
    body:
      "An **API** is how one program asks another for data. On the web, APIs speak **HTTP**: the client sends a **request**, the server answers with a **response**.\n\nA request has a **method**, a **URL**, **headers** and sometimes a **body** (usually JSON):\n\n```http\nPOST /orders\nAuthorization: Bearer eyJhb…\nContent-Type: application/json\n\n{ \"productId\": 7, \"quantity\": 2 }\n```\n\n**REST** is a style for designing APIs around **resources** (nouns) at URLs, with the **method** saying the action:\n\n| Method | Example | Meaning |\n|---|---|---|\n| GET | `/orders` | list / read |\n| POST | `/orders` | create |\n| PATCH | `/orders/7` | update part |\n| PUT | `/orders/7` | replace |\n| DELETE | `/orders/7` | remove |\n\nThe response has a **status code**: `200 OK`, `201 Created`, `400 Bad Request` (invalid input), `401 Unauthorized` (not logged in), `403 Forbidden` (no permission), `404 Not Found`, `500 Internal Server Error` (bug on the server).\n\nREST APIs are **stateless**: every request carries what the server needs — like the token in the `Authorization` header.",
    keyPoints: [
      "Request = method + URL + headers + body; response = status + body",
      "REST: resources as nouns, the method is the action",
      "2xx success, 4xx client error, 5xx server error",
      "Stateless: send the token on every request",
    ],
    pt: {
      title: "HTTP e APIs REST",
      prompt: "Métodos, URLs, códigos de status e JSON — como o front-end conversa com o back-end.",
      body:
        "Uma **API** é como um programa pede dados a outro. Na web, as APIs falam **HTTP**: o cliente envia um **pedido** (request), o servidor devolve uma **resposta** (response).\n\nUm pedido tem um **método**, uma **URL**, **headers** e às vezes um **corpo** (normalmente JSON):\n\n```http\nPOST /orders\nAuthorization: Bearer eyJhb…\nContent-Type: application/json\n\n{ \"productId\": 7, \"quantity\": 2 }\n```\n\n**REST** é um estilo de desenhar APIs em torno de **recursos** (substantivos) em URLs, com o **método** a dizer a ação:\n\n| Método | Exemplo | Significado |\n|---|---|---|\n| GET | `/orders` | listar / ler |\n| POST | `/orders` | criar |\n| PATCH | `/orders/7` | atualizar uma parte |\n| PUT | `/orders/7` | substituir |\n| DELETE | `/orders/7` | apagar |\n\nA resposta traz um **código de status**: `200 OK`, `201 Created`, `400 Bad Request` (dados inválidos), `401 Unauthorized` (sem login), `403 Forbidden` (sem permissão), `404 Not Found`, `500 Internal Server Error` (bug no servidor).\n\nAPIs REST são **stateless** (sem estado): cada pedido leva o que o servidor precisa — como o token no header `Authorization`.",
      keyPoints: [
        "Pedido = método + URL + headers + corpo; resposta = status + corpo",
        "REST: recursos como substantivos, o método é a ação",
        "2xx sucesso, 4xx erro do cliente, 5xx erro do servidor",
        "Stateless: envie o token em cada pedido",
      ],
    },
  },
  {
    id: "lesson-node-api",
    kind: "lesson",
    topic: "node-api",
    title: "Building an API with Node.js",
    prompt: "Routes, middleware, validation and errors — what happens inside the server.",
    difficulty: 2,
    estimatedMin: 9,
    tags: ["backend", "node"],
    body:
      "**Node.js** runs JavaScript on the server. With a framework like **Express** (or a Next.js route handler) you map routes to functions:\n\n```js\napp.use(express.json());           // middleware: parse JSON bodies\napp.use(requireAuth);              // middleware: who is calling?\n\napp.post('/orders', async (req, res) => {\n  const input = OrderSchema.safeParse(req.body);   // 1. validate\n  if (!input.success) return res.status(400).json(input.error);\n  const order = await orders.create(req.user.id, input.data); // 2. business logic\n  res.status(201).json(order);                     // 3. respond\n});\n```\n\nWhere the data comes from: `req.params` (`/orders/:id`), `req.query` (`?page=2`), `req.body` (JSON) and `req.headers`.\n\n**Middleware** are functions that run in a chain before the handler — logging, parsing, authentication, rate limiting. They either respond (e.g. `401`) or call `next()`.\n\nRules that interviewers look for:\n- **Validate on the server**, even if the front-end already did (anyone can call the API).\n- **Secrets** in environment variables (`process.env.DATABASE_URL`), never in the code.\n- **Handle errors**: `try/catch` or an error middleware; return clear `4xx`/`5xx` without leaking stack traces.\n- Keep routes thin: business rules in a **service**, SQL in a **data** module — easy to test.",
    keyPoints: [
      "Route = method + path → handler function",
      "params, query, body, headers",
      "Middleware chain: log → parse → auth → handler",
      "Validate on the server, secrets in env vars, handle errors",
    ],
    pt: {
      title: "Criar uma API com Node.js",
      prompt: "Rotas, middleware, validação e erros — o que acontece dentro do servidor.",
      body:
        "O **Node.js** roda JavaScript no servidor. Com um framework como o **Express** (ou um route handler do Next.js) você liga rotas a funções:\n\n```js\napp.use(express.json());           // middleware: ler corpos JSON\napp.use(requireAuth);              // middleware: quem está a chamar?\n\napp.post('/orders', async (req, res) => {\n  const input = OrderSchema.safeParse(req.body);   // 1. validar\n  if (!input.success) return res.status(400).json(input.error);\n  const order = await orders.create(req.user.id, input.data); // 2. regra de negócio\n  res.status(201).json(order);                     // 3. responder\n});\n```\n\nDe onde vêm os dados: `req.params` (`/orders/:id`), `req.query` (`?page=2`), `req.body` (JSON) e `req.headers`.\n\n**Middlewares** são funções que rodam em cadeia antes do handler — log, parsing, autenticação, rate limiting. Ou respondem (ex.: `401`) ou chamam `next()`.\n\nO que os entrevistadores querem ouvir:\n- **Validar no servidor**, mesmo que o front-end já valide (qualquer um pode chamar a API).\n- **Segredos** em variáveis de ambiente (`process.env.DATABASE_URL`), nunca no código.\n- **Tratar erros**: `try/catch` ou um middleware de erro; devolver `4xx`/`5xx` claros sem expor o stack trace.\n- Rotas finas: regras de negócio num **service**, SQL num módulo de **dados** — fácil de testar.",
      keyPoints: [
        "Rota = método + caminho → função handler",
        "params, query, body, headers",
        "Cadeia de middleware: log → parse → auth → handler",
        "Validar no servidor, segredos em env vars, tratar erros",
      ],
    },
  },
];

import type { LessonDraftInput } from "@/lib/content/schema";

/** Semana 8 — IA para Product/AI Engineers e para quem usa IA no dia a dia. */
export const lessons: LessonDraftInput[] = [
  {
    id: "lesson-ai-code-review",
    kind: "lesson",
    topic: "ai-safety",
    title: "Reviewing AI-generated code",
    prompt: "The interview format replacing live coding — and the checklist that makes you good at it.",
    difficulty: 1,
    estimatedMin: 8,
    tags: ["ai", "code-review"],
    body:
      "More and more companies replace live coding with a **code review exercise**: they show you a pull request (often written by AI) and ask what you'd comment. They want to see if you can read unfamiliar code, find real problems, **prioritize** them and explain them kindly.\n\nAI code usually *looks* clean. Its typical problems:\n- **Security**: missing ownership check (IDOR), SQL built with strings, secrets in the client, no input validation.\n- **Correctness**: missing `await`, wrong `useEffect` deps, mutated state, off-by-one, unhandled errors, invented APIs.\n- **Performance**: N+1 queries, no pagination, sequential awaits.\n- **Scope**: changes nobody asked for, new dependencies for one line.\n\nA review checklist:\n1. What is this PR supposed to do? Does it do **only** that?\n2. Who can call it, and is that checked on the server?\n3. What happens with bad input, empty data, errors, two requests at once?\n4. Are there tests that would fail if the logic broke?\n5. Can I explain every line?\n\nHow to say it: **what** is wrong → **why** it matters → **a concrete fix**. Start with the most severe (security, data loss), then bugs, then style. Example: *\"This lets any logged-in user read any invoice by changing the id. Could we scope the query to `userId: user.id` and return 404 otherwise?\"*\n\nIf you ship AI code, **you own it**.",
    keyPoints: [
      "Code review exercises are replacing live coding",
      "AI code looks clean but misses auth, errors and edge cases",
      "Checklist: scope, who can call it, bad input, tests, explain every line",
      "Comment = what + why + fix, most severe first",
    ],
    pt: {
      title: "Rever código gerado por IA",
      prompt: "O formato de entrevista que está a substituir o live coding — e a checklist que te deixa bom nisso.",
      body:
        "Cada vez mais empresas trocam o live coding por um **exercício de code review**: mostram um pull request (muitas vezes escrito por IA) e perguntam o que você comentaria. Querem ver se consegue ler código desconhecido, achar problemas reais, **priorizá-los** e explicá-los com educação.\n\nO código de IA costuma *parecer* limpo. Os problemas típicos:\n- **Segurança**: falta verificar o dono (IDOR), SQL montado com strings, segredos no cliente, nenhuma validação.\n- **Correção**: `await` em falta, deps erradas no `useEffect`, state mutado, off-by-one, erros não tratados, APIs inventadas.\n- **Performance**: queries N+1, sem paginação, awaits em sequência.\n- **Escopo**: mudanças que ninguém pediu, dependências novas para uma linha.\n\nUma checklist de review:\n1. O que este PR devia fazer? Faz **só** isso?\n2. Quem pode chamar, e isso é verificado no servidor?\n3. O que acontece com dados maus, vazios, erros, dois pedidos ao mesmo tempo?\n4. Há testes que falhariam se a lógica quebrasse?\n5. Consigo explicar cada linha?\n\nComo dizer: **o que** está errado → **porque** importa → **uma correção concreta**. Comece pelo mais grave (segurança, perda de dados), depois bugs, depois estilo. Exemplo: *\"Isto deixa qualquer usuário com login ler qualquer fatura trocando o id. Podemos limitar a query a `userId: user.id` e devolver 404 caso contrário?\"*\n\nSe você publica código da IA, **ele é seu**.",
      keyPoints: [
        "Exercícios de code review estão a substituir o live coding",
        "Código de IA parece limpo mas esquece auth, erros e casos-limite",
        "Checklist: escopo, quem pode chamar, dados maus, testes, explicar cada linha",
        "Comentário = o quê + porquê + correção, o mais grave primeiro",
      ],
    },
  },
  {
    id: "lesson-ai-llm-basics",
    kind: "lesson",
    topic: "ai-llm-basics",
    title: "LLMs in a product",
    prompt: "Tokens, context, stateless calls, hallucinations, cost and latency — what every product engineer must know.",
    difficulty: 1,
    estimatedMin: 9,
    tags: ["ai", "llm"],
    body:
      "An LLM (like Claude or GPT) predicts text, one **token** at a time. A token is a chunk of text (~4 characters in English). You pay per **input + output tokens**, and each model has a **context window**: the maximum tokens it can read in one request.\n\nCalls are **stateless**: the model remembers nothing between requests. A chat works because **your server** sends the conversation history every time — so long chats must be trimmed or summarized.\n\nA request has a **system prompt** (stable instructions: role, rules, format) and **messages** (the user's input). From your backend:\n\n```ts\nconst msg = await client.messages.create({\n  model, max_tokens: 1024,\n  system: 'You summarize support tickets in 2 sentences.',\n  messages: [{ role: 'user', content: ticket }],\n});\n```\n\nThings that break in production:\n- **Hallucinations**: confident but false answers. Ground the model in real data (RAG), allow \"I don't know\", ask for citations.\n- **Format**: free text breaks `JSON.parse`. Use structured output with a schema and validate (Zod).\n- **Latency**: answers take seconds — **stream** them.\n- **Cost**: limit `max_tokens`, cache the stable part of the prompt, use smaller models where quality holds.\n- **Keys**: the API key lives on the server, never in the browser. Add auth and rate limits.\n\nAnd decide with data: build a small **eval set** before changing prompts or models.",
    keyPoints: [
      "Tokens = cost and context limit; calls are stateless",
      "System prompt = stable rules; messages = the input",
      "Hallucinations → ground with real data, allow 'I don't know'",
      "Server-side key, streaming, structured output, evals",
    ],
    pt: {
      title: "LLMs num produto",
      prompt: "Tokens, contexto, chamadas sem estado, alucinações, custo e latência — o que todo product engineer tem de saber.",
      body:
        "Um LLM (como o Claude ou o GPT) prevê texto, um **token** de cada vez. Um token é um pedaço de texto (~4 caracteres em inglês). Paga-se por **tokens de entrada + saída**, e cada modelo tem uma **janela de contexto**: o máximo de tokens que lê num pedido.\n\nAs chamadas são **sem estado**: o modelo não lembra nada entre pedidos. Um chat funciona porque **o seu servidor** envia o histórico da conversa a cada vez — por isso conversas longas têm de ser cortadas ou resumidas.\n\nUm pedido tem um **system prompt** (instruções estáveis: papel, regras, formato) e **mensagens** (a entrada do usuário). No seu back-end:\n\n```ts\nconst msg = await client.messages.create({\n  model, max_tokens: 1024,\n  system: 'Resumes tickets de suporte em 2 frases.',\n  messages: [{ role: 'user', content: ticket }],\n});\n```\n\nO que quebra em produção:\n- **Alucinações**: respostas confiantes mas falsas. Baseie o modelo em dados reais (RAG), permita \"não sei\", peça citações.\n- **Formato**: texto livre quebra o `JSON.parse`. Use saída estruturada com schema e valide (Zod).\n- **Latência**: as respostas demoram segundos — faça **streaming**.\n- **Custo**: limite o `max_tokens`, faça cache da parte estável do prompt, use modelos menores onde a qualidade se mantém.\n- **Chaves**: a chave da API fica no servidor, nunca no navegador. Ponha auth e limites de uso.\n\nE decida com dados: monte um pequeno **conjunto de avaliação** antes de mudar prompts ou modelos.",
      keyPoints: [
        "Tokens = custo e limite de contexto; chamadas sem estado",
        "System prompt = regras estáveis; mensagens = a entrada",
        "Alucinações → basear em dados reais, permitir 'não sei'",
        "Chave no servidor, streaming, saída estruturada, evals",
      ],
    },
  },
  {
    id: "lesson-ai-rag",
    kind: "lesson",
    topic: "ai-rag",
    title: "RAG: answering from your own data",
    prompt: "Embeddings, chunking, vector search with pgvector, and the permission bug everyone forgets.",
    difficulty: 2,
    estimatedMin: 9,
    tags: ["ai", "rag"],
    body:
      "The model doesn't know your company's docs or your user's data. **RAG** (Retrieval-Augmented Generation) fixes that without training: **find** the relevant pieces of your data and **put them in the prompt**.\n\n**Indexing** (ahead of time):\n1. Split documents into **chunks** (a few paragraphs, with a bit of overlap) and keep metadata (title, URL, owner).\n2. Create an **embedding** for each chunk — a vector of numbers representing its meaning.\n3. Store it, e.g. in Postgres with **pgvector**.\n\n**Answering** (per question):\n1. Embed the question.\n2. Find the **nearest chunks** (`ORDER BY embedding <-> $1 LIMIT 5`) — **filtered by what this user may access**.\n3. Send them to the model with instructions: answer only from these sources, cite them, say \"I don't know\" otherwise.\n\n```sql\nSELECT content, title FROM doc_chunks\nWHERE org_id = $2              -- permissions!\nORDER BY embedding <-> $1\nLIMIT 5;\n```\n\nTips: semantic search misses exact codes/IDs → combine with keyword search (**hybrid**). Evaluate retrieval (did the right chunk come back?) and generation (was the answer grounded?) separately. RAG is for fresh facts with sources; fine-tuning is for style/format.",
    keyPoints: [
      "RAG = retrieve your data → put it in the prompt → generate",
      "Chunk + embed + store (pgvector) ahead of time",
      "Filter retrieval by permissions — the model sees everything you send",
      "Answer only from sources, cite them; evaluate retrieval and answers",
    ],
    pt: {
      title: "RAG: responder com os seus dados",
      prompt: "Embeddings, pedaços, busca vetorial com pgvector, e o bug de permissões que todos esquecem.",
      body:
        "O modelo não conhece os docs da sua empresa nem os dados do seu usuário. O **RAG** (Retrieval-Augmented Generation) resolve isso sem treino: **encontrar** os pedaços relevantes dos seus dados e **pô-los no prompt**.\n\n**Indexação** (antes):\n1. Dividir os documentos em **pedaços** (alguns parágrafos, com um pouco de sobreposição) e guardar metadados (título, URL, dono).\n2. Criar um **embedding** para cada pedaço — um vetor de números que representa o significado.\n3. Guardar, por exemplo no Postgres com **pgvector**.\n\n**Responder** (por pergunta):\n1. Embedding da pergunta.\n2. Achar os **pedaços mais próximos** (`ORDER BY embedding <-> $1 LIMIT 5`) — **filtrados pelo que este usuário pode aceder**.\n3. Enviá-los ao modelo com instruções: responder só com estas fontes, citá-las, dizer \"não sei\" caso contrário.\n\n```sql\nSELECT content, title FROM doc_chunks\nWHERE org_id = $2              -- permissões!\nORDER BY embedding <-> $1\nLIMIT 5;\n```\n\nDicas: a busca semântica falha em códigos/IDs exatos → combine com busca por palavras (**híbrida**). Avalie a busca (o pedaço certo veio?) e a geração (a resposta baseou-se nele?) em separado. RAG é para factos atuais com fontes; fine-tuning é para estilo/formato.",
      keyPoints: [
        "RAG = buscar os seus dados → pôr no prompt → gerar",
        "Dividir + embeddings + guardar (pgvector) antes",
        "Filtrar a busca por permissões — o modelo vê tudo o que você envia",
        "Responder só com as fontes, citá-las; avaliar busca e respostas",
      ],
    },
  },
  {
    id: "lesson-ai-product",
    kind: "lesson",
    topic: "ai-product",
    title: "Building an AI feature that's safe",
    prompt: "Structured output, tool use, agents, prompt injection, evals and monitoring.",
    difficulty: 2,
    estimatedMin: 10,
    tags: ["ai", "product"],
    body:
      "Shipping an AI demo is easy; shipping an AI **feature** means treating the model like an unreliable external API.\n\n**Structured output**: when code consumes the answer, ask for JSON with a schema (the API's structured output or a tool) and still **validate** it (Zod). Unknown category → fallback.\n\n**Tool use**: you describe functions (`searchOrders`, `createRefund`); the model **proposes** a call with arguments; **your code** validates, checks permissions and runs it. An **agent** is a loop where the model picks tools over several steps — powerful, but start with a single call or a fixed workflow and cap steps and cost.\n\n**Prompt injection**: any text the model reads (emails, web pages, documents, user input) can contain instructions like \"ignore your rules\". You can't fully prevent it with prompts, so **limit the damage**:\n- give tools the minimum permissions, scoped to the current user;\n- require **human confirmation** for actions (send, pay, delete);\n- never give a generic `runSql` or `fetch(anyUrl)` tool.\n\n**Evals**: a fixed set of real inputs with expected results or criteria, run before every prompt/model change. Without them every change is a guess.\n\n**Operations**: server-side key, timeouts, retries with backoff on 429/5xx, rate limits per user, and logs of latency, tokens and cost. Collect user feedback (👍/👎) and turn bad cases into new eval items.\n\n**Privacy** (GDPR): minimize personal data sent, know the provider's retention, tell users.",
    keyPoints: [
      "Structured output + validate; never trust the raw text",
      "Tools: the model proposes, your code checks and executes",
      "Prompt injection → least privilege + human confirmation",
      "Evals before changes; monitor cost, latency, feedback",
    ],
    pt: {
      title: "Construir uma feature de IA segura",
      prompt: "Saída estruturada, tool use, agentes, prompt injection, evals e monitorização.",
      body:
        "Fazer uma demo de IA é fácil; lançar uma **feature** de IA é tratar o modelo como uma API externa pouco confiável.\n\n**Saída estruturada**: quando código consome a resposta, peça JSON com schema (a saída estruturada da API ou uma tool) e mesmo assim **valide** (Zod). Categoria desconhecida → alternativa.\n\n**Tool use**: você descreve funções (`searchOrders`, `createRefund`); o modelo **propõe** uma chamada com argumentos; **o seu código** valida, verifica permissões e executa. Um **agente** é um loop em que o modelo escolhe tools ao longo de vários passos — poderoso, mas comece com uma chamada ou um fluxo fixo e limite passos e custo.\n\n**Prompt injection**: qualquer texto que o modelo lê (emails, páginas web, documentos, entrada do usuário) pode trazer instruções como \"ignora as tuas regras\". Não dá para impedir só com prompts, por isso **limite o estrago**:\n- tools com o mínimo de permissões, limitadas ao usuário atual;\n- **confirmação humana** para ações (enviar, pagar, apagar);\n- nunca dê uma tool genérica `runSql` ou `fetch(qualquerUrl)`.\n\n**Evals**: um conjunto fixo de entradas reais com resultados ou critérios esperados, rodado antes de cada mudança de prompt/modelo. Sem isso cada mudança é um palpite.\n\n**Operação**: chave no servidor, timeouts, retries com backoff em 429/5xx, limites por usuário, e logs de latência, tokens e custo. Recolha feedback (👍/👎) e transforme os maus casos em novos itens de avaliação.\n\n**Privacidade** (RGPD): minimize os dados pessoais enviados, conheça a retenção do fornecedor, avise os usuários.",
      keyPoints: [
        "Saída estruturada + validar; nunca confie no texto cru",
        "Tools: o modelo propõe, o seu código verifica e executa",
        "Prompt injection → mínimo privilégio + confirmação humana",
        "Evals antes das mudanças; monitorize custo, latência, feedback",
      ],
    },
  },
];

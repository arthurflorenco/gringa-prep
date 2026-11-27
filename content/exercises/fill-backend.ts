import type { ExerciseInput } from "@/lib/content/schema";
import { quiz } from "./_helpers";

/** Mais quizzes para os temas de back-end, dados, segurança e IA marcados "muito cobrado". */
export const exercises: ExerciseInput[] = [
  // ───────────── rest-http ─────────────
  quiz("rest-http", "http-headers-quiz", 2, 1, {
    title: "Headers",
    prompt: "Where does the client send the auth token and say that the body is JSON?",
    options: ["In the URL", "In request headers: `Authorization: Bearer …` and `Content-Type: application/json`", "In a cookie named JSON", "In the status code"],
    explanation: "Headers carry metadata about the request: auth, content type, accepted languages, caching rules.",
  }, {
    title: "Headers",
    prompt: "Onde o cliente envia o token de login e diz que o corpo é JSON?",
    options: ["Na URL", "Nos headers do pedido: `Authorization: Bearer …` e `Content-Type: application/json`", "Num cookie chamado JSON", "No código de status"],
    explanation: "Os headers levam metadados do pedido: autenticação, tipo de conteúdo, idiomas aceites, regras de cache.",
  }),
  quiz("rest-http", "http-versioning-quiz", 3, 3, {
    title: "Breaking change",
    prompt: "A mobile app (that users don't update right away) uses `GET /orders`. You need to rename a field. Safest approach?",
    options: ["Rename it today", "Delete the old endpoint", "Ask users to update", "Add the new field alongside the old one (or a `/v2`), migrate clients, then remove the old field later"],
    explanation: "Public APIs need backward compatibility: additive changes first, deprecate, then remove.",
  }, {
    title: "Mudança que quebra",
    prompt: "Uma app móvel (que os usuários não atualizam logo) usa `GET /orders`. Você precisa renomear um campo. Abordagem mais segura?",
    options: ["Renomear hoje", "Apagar o endpoint antigo", "Pedir aos usuários para atualizar", "Acrescentar o campo novo junto do antigo (ou um `/v2`), migrar os clientes e só depois remover o antigo"],
    explanation: "APIs públicas precisam de compatibilidade: primeiro mudanças que acrescentam, depois deprecar, e só então remover.",
  }),

  // ───────────── sql-transactions ─────────────
  quiz("sql-transactions", "sqlt-race-quiz", 3, 0, {
    title: "Race condition",
    prompt: "Two requests run `SELECT stock` (both see 1) and then `UPDATE … SET stock = 0`. Two items were sold, one existed. Best fix?",
    options: ["An atomic update: `UPDATE products SET stock = stock - 1 WHERE id = $1 AND stock > 0` and check the affected rows", "Add a `sleep` between the two queries", "Run the SELECT twice", "Use a bigger server"],
    explanation: "Let the database do check-and-change in one statement (or lock the row with `SELECT … FOR UPDATE` inside a transaction).",
  }, {
    title: "Race condition",
    prompt: "Dois pedidos rodam `SELECT stock` (ambos veem 1) e depois `UPDATE … SET stock = 0`. Venderam-se dois itens e só existia um. Melhor correção?",
    options: ["Um update atómico: `UPDATE products SET stock = stock - 1 WHERE id = $1 AND stock > 0` e ver as linhas afetadas", "Pôr um `sleep` entre as duas queries", "Rodar o SELECT duas vezes", "Usar um servidor maior"],
    explanation: "Deixe o banco verificar e mudar num só comando (ou bloquear a linha com `SELECT … FOR UPDATE` dentro de uma transação).",
  }),
  quiz("sql-transactions", "sqlt-rollback-quiz", 2, 2, {
    title: "Rollback",
    prompt: "Inside `BEGIN … COMMIT`, the 3rd of 4 statements fails. What happens to the first two?",
    options: ["They stay saved", "Only the first one stays", "They're undone — the transaction is rolled back as a whole", "They're saved twice"],
    explanation: "That's atomicity: a transaction is all or nothing.",
  }, {
    title: "Rollback",
    prompt: "Dentro de `BEGIN … COMMIT`, o 3º de 4 comandos falha. O que acontece aos dois primeiros?",
    options: ["Ficam guardados", "Só o primeiro fica", "São desfeitos — a transação é revertida inteira", "São guardados duas vezes"],
    explanation: "Isso é a atomicidade: uma transação é tudo ou nada.",
  }),
  quiz("sql-transactions", "sqlt-cascade-quiz", 2, 1, {
    title: "ON DELETE CASCADE",
    prompt: "`comments.post_id REFERENCES posts(id) ON DELETE CASCADE`. You delete a post. What happens?",
    options: ["The DELETE fails", "Its comments are deleted too", "Comments keep a broken post_id", "Comments move to another post"],
    explanation: "CASCADE is convenient for children that make no sense alone — but dangerous on important data. Many teams prefer soft delete.",
  }, {
    title: "ON DELETE CASCADE",
    prompt: "`comments.post_id REFERENCES posts(id) ON DELETE CASCADE`. Você apaga um post. O que acontece?",
    options: ["O DELETE falha", "Os comentários dele são apagados também", "Os comentários ficam com um post_id quebrado", "Os comentários passam para outro post"],
    explanation: "O CASCADE dá jeito para filhos que não fazem sentido sozinhos — mas é perigoso em dados importantes. Muitas equipes preferem soft delete.",
  }),

  // ───────────── data-modeling ─────────────
  quiz("data-modeling", "model-timestamps-quiz", 2, 3, {
    title: "Timestamps",
    prompt: "Your users are in Lisbon, São Paulo and Berlin. Which column type for `created_at` in Postgres?",
    options: ["`text`", "`date`", "`timestamp` without time zone", "`timestamptz` — store an absolute instant, convert to the user's zone in the UI"],
    explanation: "`timestamptz` stores UTC and avoids \"which time zone was this?\" bugs.",
  }, {
    title: "Timestamps",
    prompt: "Os seus usuários estão em Lisboa, São Paulo e Berlim. Que tipo de coluna para `created_at` no Postgres?",
    options: ["`text`", "`date`", "`timestamp` sem fuso", "`timestamptz` — guarda um instante absoluto, converta para o fuso do usuário na interface"],
    explanation: "O `timestamptz` guarda em UTC e evita bugs de \"em que fuso era isto?\".",
  }),

  // ───────────── authn-authz ─────────────
  quiz("authn-authz", "auth-mfa-quiz", 1, 2, {
    title: "MFA",
    prompt: "What does multi-factor authentication (MFA) add?",
    options: ["A longer password", "A faster login", "A second proof besides the password (an app code, a key), so a stolen password isn't enough", "Encryption of the database"],
    explanation: "Something you know + something you have. Very effective against phishing and credential stuffing.",
  }, {
    title: "MFA",
    prompt: "O que a autenticação multifator (MFA) acrescenta?",
    options: ["Uma senha mais longa", "Um login mais rápido", "Uma segunda prova além da senha (um código numa app, uma chave), para uma senha roubada não bastar", "Encriptação da base de dados"],
    explanation: "Algo que você sabe + algo que você tem. Muito eficaz contra phishing e credential stuffing.",
  }),
  quiz("authn-authz", "auth-refresh-token-quiz", 3, 0, {
    title: "Access and refresh tokens",
    prompt: "Why use a short-lived access token (15 min) plus a refresh token?",
    options: [
      "A stolen access token is only useful for minutes, while the refresh token (stored more safely, revocable) gets new ones",
      "To make requests faster",
      "Because JWTs can't be longer than 15 minutes",
      "To avoid HTTPS",
    ],
    explanation: "It balances stateless checks (no DB lookup per request) with the ability to revoke sessions.",
  }, {
    title: "Access e refresh tokens",
    prompt: "Porquê usar um access token de vida curta (15 min) mais um refresh token?",
    options: [
      "Um access token roubado só serve por minutos, e o refresh token (guardado com mais cuidado, revogável) obtém novos",
      "Para os pedidos serem mais rápidos",
      "Porque JWTs não podem durar mais de 15 minutos",
      "Para evitar HTTPS",
    ],
    explanation: "Equilibra verificação sem estado (sem consultar o banco a cada pedido) com a possibilidade de revogar sessões.",
  }),

  // ───────────── rls ─────────────
  quiz("rls", "rls-service-role-quiz", 3, 3, {
    title: "Service role key",
    prompt: "Where may the Supabase **service role** key be used?",
    options: ["In the React app, it's fine", "In a `NEXT_PUBLIC_` variable", "In the mobile app", "Only on the server (route handlers, cron jobs) — it bypasses RLS"],
    explanation: "The service role ignores every policy. Treat it like a database password.",
  }, {
    title: "Chave service role",
    prompt: "Onde pode ser usada a chave **service role** do Supabase?",
    options: ["Na app React, não há problema", "Numa variável `NEXT_PUBLIC_`", "Na app móvel", "Só no servidor (route handlers, cron jobs) — ela ignora o RLS"],
    explanation: "A service role ignora todas as policies. Trate-a como a senha da base de dados.",
  }),
  quiz("rls", "rls-team-quiz", 3, 1, {
    title: "Team access",
    prompt: "Projects belong to teams; users are members of teams (`team_members(team_id, user_id)`). Which policy lets members read their team's projects?",
    options: [
      "`USING (true)`",
      "`USING (team_id IN (SELECT team_id FROM team_members WHERE user_id = auth.uid()))`",
      "`USING (user_id = auth.uid())` on projects",
      "`WITH CHECK (team_id IS NOT NULL)`",
    ],
    explanation: "Policies can use subqueries. Index `team_members(user_id, team_id)` so the check stays fast.",
  }, {
    title: "Acesso por equipe",
    prompt: "Os projetos pertencem a equipes; os usuários são membros de equipes (`team_members(team_id, user_id)`). Que policy deixa os membros lerem os projetos da sua equipe?",
    options: [
      "`USING (true)`",
      "`USING (team_id IN (SELECT team_id FROM team_members WHERE user_id = auth.uid()))`",
      "`USING (user_id = auth.uid())` em projects",
      "`WITH CHECK (team_id IS NOT NULL)`",
    ],
    explanation: "Policies podem usar subqueries. Ponha um índice em `team_members(user_id, team_id)` para a verificação continuar rápida.",
  }),
  quiz("rls", "rls-why-quiz", 2, 2, {
    title: "Why RLS if the API checks?",
    prompt: "The API already checks ownership. Why add RLS too?",
    options: ["It's required by Postgres", "It makes queries faster", "Defense in depth: if one query in the code forgets the filter (or the client queries directly), the database still blocks it", "To replace authentication"],
    explanation: "One forgotten `WHERE user_id = …` is enough for a data leak. RLS is a safety net at the data layer.",
  }, {
    title: "Porquê RLS se a API já verifica?",
    prompt: "A API já verifica o dono. Porquê acrescentar RLS?",
    options: ["É obrigatório no Postgres", "Deixa as queries mais rápidas", "Defesa em profundidade: se uma query no código esquecer o filtro (ou o cliente consultar direto), o banco bloqueia na mesma", "Para substituir a autenticação"],
    explanation: "Um `WHERE user_id = …` esquecido chega para vazar dados. O RLS é uma rede de segurança na camada de dados.",
  }),
  quiz("rls", "rls-test-quiz", 3, 0, {
    title: "Testing policies",
    prompt: "How do you know your RLS policies actually work?",
    options: [
      "Write tests that query as user A and assert they can't read/update user B's rows (and as anon, nothing)",
      "Read them once carefully",
      "Turn RLS off in development",
      "Check that the app still loads",
    ],
    explanation: "Security rules deserve tests, especially the \"must NOT be able to\" cases.",
  }, {
    title: "Testar policies",
    prompt: "Como sabe se as suas policies de RLS funcionam mesmo?",
    options: [
      "Escrever testes que consultam como usuário A e verificam que não lê/atualiza as linhas do usuário B (e como anónimo, nada)",
      "Lê-las uma vez com atenção",
      "Desligar o RLS em desenvolvimento",
      "Ver se a app ainda abre",
    ],
    explanation: "Regras de segurança merecem testes, sobretudo os casos \"NÃO pode conseguir\".",
  }),
  quiz("rls", "rls-performance-quiz", 3, 2, {
    title: "Slow policies",
    prompt: "After adding RLS, listing notes became slow. The policy is `user_id = auth.uid()`. First thing to check?",
    options: ["Remove RLS", "Add more policies", "An index on `notes(user_id)` — the policy is a WHERE on every query", "Increase the server RAM"],
    explanation: "Policies behave like filters, so they need the same indexes as your normal WHERE clauses.",
  }, {
    title: "Policies lentas",
    prompt: "Depois de pôr RLS, listar as notas ficou lento. A policy é `user_id = auth.uid()`. Primeira coisa a verificar?",
    options: ["Tirar o RLS", "Acrescentar mais policies", "Um índice em `notes(user_id)` — a policy é um WHERE em cada query", "Aumentar a RAM do servidor"],
    explanation: "Policies comportam-se como filtros, então precisam dos mesmos índices que os seus WHERE normais.",
  }),

  // ───────────── db-indexes ─────────────
  quiz("db-indexes", "idx-unique-index-quiz", 2, 0, {
    title: "UNIQUE and indexes",
    prompt: "What does `CREATE UNIQUE INDEX ON users (lower(email))` give you?",
    options: ["Fast lookups by email **and** no duplicates ignoring case (Ana@x.com = ana@x.com)", "Only faster sorting", "Emails become lowercase automatically", "Nothing, functions aren't allowed in indexes"],
    explanation: "Expression indexes work when your query uses the same expression: `WHERE lower(email) = lower($1)`.",
  }, {
    title: "UNIQUE e índices",
    prompt: "O que te dá `CREATE UNIQUE INDEX ON users (lower(email))`?",
    options: ["Buscas rápidas por email **e** sem duplicados ignorando maiúsculas (Ana@x.com = ana@x.com)", "Só ordenação mais rápida", "Os emails ficam em minúsculas sozinhos", "Nada, funções não são permitidas em índices"],
    explanation: "Índices de expressão funcionam quando a query usa a mesma expressão: `WHERE lower(email) = lower($1)`.",
  }),
  quiz("db-indexes", "idx-like-quiz", 3, 3, {
    title: "LIKE and indexes",
    prompt: "A normal B-tree index on `name`. Which query can't use it efficiently?",
    options: ["`WHERE name = 'Ana'`", "`WHERE name LIKE 'An%'` (with the right operator class)", "`ORDER BY name LIMIT 10`", "`WHERE name LIKE '%na%'`"],
    explanation: "A leading wildcard can't use a sorted index. For \"contains\" search use full-text search or a trigram index (`pg_trgm`).",
  }, {
    title: "LIKE e índices",
    prompt: "Um índice B-tree normal em `name`. Que query não o consegue usar bem?",
    options: ["`WHERE name = 'Ana'`", "`WHERE name LIKE 'An%'` (com a operator class certa)", "`ORDER BY name LIMIT 10`", "`WHERE name LIKE '%na%'`"],
    explanation: "Um curinga no início não usa um índice ordenado. Para busca \"contém\" use full-text search ou um índice trigram (`pg_trgm`).",
  }),
  quiz("db-indexes", "idx-cache-quiz", 2, 1, {
    title: "Caching",
    prompt: "The home page runs the same expensive query on every visit, but the data changes once an hour. A good option?",
    options: ["Add an index on every column", "Cache the result (in memory/Redis or with Next.js revalidation) and refresh it when the data changes or every hour", "Run the query twice", "Remove the page"],
    explanation: "Caching trades freshness for speed. Know when to invalidate — that's the hard part.",
  }, {
    title: "Cache",
    prompt: "A página inicial roda a mesma query cara a cada visita, mas os dados mudam uma vez por hora. Uma boa opção?",
    options: ["Pôr índice em todas as colunas", "Guardar o resultado em cache (memória/Redis ou com revalidação do Next.js) e atualizar quando os dados mudam ou a cada hora", "Rodar a query duas vezes", "Remover a página"],
    explanation: "Cache troca frescura por velocidade. Saber quando invalidar é a parte difícil.",
  }),
  quiz("db-indexes", "idx-select-columns-quiz", 1, 2, {
    title: "SELECT *",
    prompt: "An API lists users but runs `SELECT * FROM users` (the table has a big `avatar_blob` and `password_hash`). Review comment?",
    options: ["Fine as is", "Add ORDER BY", "Select only the needed columns: faster, less data over the network, and no sensitive fields leaking", "Use DISTINCT"],
    explanation: "`SELECT *` is a performance and a security smell in APIs.",
  }, {
    title: "SELECT *",
    prompt: "Uma API lista usuários mas roda `SELECT * FROM users` (a tabela tem um `avatar_blob` grande e o `password_hash`). Comentário de review?",
    options: ["Está bem assim", "Acrescentar ORDER BY", "Selecionar só as colunas necessárias: mais rápido, menos dados na rede e nenhum campo sensível a vazar", "Usar DISTINCT"],
    explanation: "`SELECT *` é um cheiro de performance e de segurança em APIs.",
  }),

  // ───────────── IA ─────────────
  quiz("ai-safety", "aidev-explain-code-quiz", 2, 1, {
    title: "\"Walk me through this code\"",
    prompt: "In a take-home review, the interviewer asks you to explain a function you wrote with AI help, and you're not sure what one line does. Best answer?",
    options: ["Make something up confidently", "Be honest: say AI helped, explain what you do understand, how you'd verify that line (docs, a test) — and never ship code you can't explain", "Say the AI is always right", "Change the subject"],
    explanation: "Honesty + a verification habit beats bluffing. Many companies now explicitly allow AI but expect full understanding.",
  }, {
    title: "\"Explica-me este código\"",
    prompt: "Na revisão de um take-home, o entrevistador pede para explicar uma função que você escreveu com ajuda de IA, e você não tem certeza do que uma linha faz. Melhor resposta?",
    options: ["Inventar algo com confiança", "Ser honesto: dizer que a IA ajudou, explicar o que entende, como verificaria essa linha (docs, um teste) — e nunca enviar código que não sabe explicar", "Dizer que a IA está sempre certa", "Mudar de assunto"],
    explanation: "Honestidade + o hábito de verificar ganham ao bluff. Muitas empresas permitem IA mas esperam entendimento total.",
  }),
  quiz("ai-safety", "aidev-prompting-quiz", 2, 3, {
    title: "Asking AI for code",
    prompt: "Which request to a coding assistant usually gives the best result?",
    options: ["\"Make the app better\"", "\"Fix it\"", "\"Write everything for the checkout\"", "A specific task with context: the file, the expected behaviour, constraints (\"use our Zod schemas, no new dependencies\") and how to verify (\"tests must pass\")"],
    explanation: "Small, well-scoped tasks with acceptance criteria → reviewable diffs. Then review and run the tests yourself.",
  }, {
    title: "Pedir código à IA",
    prompt: "Que pedido a um assistente de código costuma dar o melhor resultado?",
    options: ["\"Melhora a app\"", "\"Corrige isso\"", "\"Escreve tudo do checkout\"", "Uma tarefa específica com contexto: o ficheiro, o comportamento esperado, restrições (\"usa os nossos schemas Zod, sem dependências novas\") e como verificar (\"os testes têm de passar\")"],
    explanation: "Tarefas pequenas e bem definidas com critérios de aceitação → diffs fáceis de rever. Depois reveja e rode os testes você mesmo.",
  }),
  quiz("ai-safety", "aidev-license-quiz", 3, 0, {
    title: "Generated code and secrets in history",
    prompt: "AI generated a config file and you committed it with a real API key. You remove the key in the next commit. Are you safe?",
    options: ["No — it's still in Git history; rotate (revoke) the key immediately and use env vars", "Yes, the latest commit is clean", "Yes, if the repo is private", "Only if you squash"],
    explanation: "Assume any committed secret is compromised. Rotation first, history cleanup second, and add secret scanning to CI.",
  }, {
    title: "Código gerado e segredos no histórico",
    prompt: "A IA gerou um ficheiro de config e você fez commit com uma chave de API real. Remove a chave no commit seguinte. Está seguro?",
    options: ["Não — ela continua no histórico do Git; troque (revogue) a chave já e use variáveis de ambiente", "Sim, o último commit está limpo", "Sim, se o repo for privado", "Só se fizer squash"],
    explanation: "Considere comprometido qualquer segredo que foi para o Git. Primeiro trocar a chave, depois limpar o histórico, e ponha secret scanning no CI.",
  }),
  quiz("ai-llm-basics", "llm-prompt-caching-quiz", 3, 2, {
    title: "Prompt caching",
    prompt: "Every request sends the same 5 000-token system prompt + a short user question. What reduces cost and latency?",
    options: ["Shorten the user question", "Send the system prompt only once per day", "Prompt caching: keep the long stable part first and identical, so the provider reuses it at a fraction of the price", "Use temperature 0"],
    explanation: "Caching works on an identical prefix — put stable content first, the changing parts (user input, dates) last.",
  }, {
    title: "Prompt caching",
    prompt: "Cada pedido envia o mesmo system prompt de 5 000 tokens + uma pergunta curta. O que reduz custo e latência?",
    options: ["Encurtar a pergunta do usuário", "Mandar o system prompt só uma vez por dia", "Prompt caching: manter a parte longa e estável no início e idêntica, para o fornecedor a reutilizar por uma fração do preço", "Usar temperatura 0"],
    explanation: "O cache funciona sobre um prefixo idêntico — ponha o conteúdo estável primeiro e as partes que mudam (pergunta, datas) no fim.",
  }),
  quiz("ai-llm-basics", "llm-few-shot-quiz", 2, 0, {
    title: "Examples in the prompt",
    prompt: "The model keeps answering in the wrong format. What usually helps most?",
    options: ["Show 2–3 examples of input → exact output in the prompt (few-shot), or use structured output", "Write the instructions in capital letters", "Repeat \"please\" several times", "Use a longer temperature"],
    explanation: "Examples communicate format better than descriptions. For machine-readable output, a JSON schema is even more reliable.",
  }, {
    title: "Exemplos no prompt",
    prompt: "O modelo continua a responder no formato errado. O que costuma ajudar mais?",
    options: ["Mostrar 2–3 exemplos de entrada → saída exata no prompt (few-shot), ou usar saída estruturada", "Escrever as instruções em maiúsculas", "Repetir \"por favor\" várias vezes", "Usar uma temperatura mais comprida"],
    explanation: "Exemplos comunicam o formato melhor do que descrições. Para saída lida por código, um JSON schema é ainda mais confiável.",
  }),
  quiz("ai-rag", "rag-hybrid-quiz", 3, 1, {
    title: "When vector search misses",
    prompt: "Users search for an exact error code like `ERR_4012` and vector search returns unrelated chunks. What helps?",
    options: ["Bigger embeddings", "Hybrid search: combine vector similarity with keyword/full-text search, then rerank", "Remove the error codes from the docs", "Lower the temperature"],
    explanation: "Embeddings capture meaning, not exact tokens. Keyword search catches IDs, codes and names.",
  }, {
    title: "Quando a busca vetorial falha",
    prompt: "Os usuários procuram um código de erro exato como `ERR_4012` e a busca vetorial devolve pedaços sem relação. O que ajuda?",
    options: ["Embeddings maiores", "Busca híbrida: combinar a similaridade vetorial com busca por palavras/full-text, e depois reordenar", "Tirar os códigos de erro dos docs", "Baixar a temperatura"],
    explanation: "Embeddings captam significado, não tokens exatos. A busca por palavras apanha IDs, códigos e nomes.",
  }),
  quiz("ai-rag", "rag-eval-quiz", 3, 3, {
    title: "Evaluating RAG",
    prompt: "Answers got worse after you changed the chunk size. How do you find out **where** it broke?",
    options: ["Ask the model if it's worse", "Change the prompt randomly", "Rebuild everything", "Evaluate retrieval and generation separately: did the right chunk come back (recall@k)? Given the right chunk, was the answer correct and grounded?"],
    explanation: "RAG has two failure points. Measuring them separately tells you whether to fix retrieval or the prompt.",
  }, {
    title: "Avaliar RAG",
    prompt: "As respostas pioraram depois de mudar o tamanho dos pedaços. Como descobre **onde** quebrou?",
    options: ["Perguntar ao modelo se piorou", "Mudar o prompt ao acaso", "Refazer tudo", "Avaliar a busca e a geração em separado: o pedaço certo veio (recall@k)? Com o pedaço certo, a resposta estava certa e baseada nele?"],
    explanation: "O RAG tem dois pontos de falha. Medi-los em separado diz se é para corrigir a busca ou o prompt.",
  }),
  quiz("rls", "rls-insert-default-quiz", 2, 0, {
    title: "Filling user_id",
    prompt: "With RLS `WITH CHECK (user_id = auth.uid())`, what's a clean way to set `user_id` on insert?",
    options: ["A column default `DEFAULT auth.uid()`, so the client doesn't send it (and can't fake it)", "Let the client send any user_id", "Leave it NULL", "Set it in localStorage"],
    explanation: "Defaults + WITH CHECK make inserts both convenient and safe.",
  }, {
    title: "Preencher o user_id",
    prompt: "Com RLS `WITH CHECK (user_id = auth.uid())`, qual é uma forma limpa de preencher o `user_id` no insert?",
    options: ["Um default na coluna `DEFAULT auth.uid()`, para o cliente não o enviar (nem o falsificar)", "Deixar o cliente enviar qualquer user_id", "Deixar NULL", "Guardar no localStorage"],
    explanation: "Default + WITH CHECK deixam os inserts práticos e seguros.",
  }),
];

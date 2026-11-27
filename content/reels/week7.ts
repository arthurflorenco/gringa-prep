import type { ReelSceneInput } from "@/lib/content/schema";

/** Reels da semana 7 — SQL, transações, modelagem, índices e autenticação. */
export const reels: Record<string, ReelSceneInput[]> = {
  "lesson-sql-basics": [
    {
      type: "title",
      say: "Almost every app keeps its data in tables. | SQL is how you ask questions to those tables.",
      headline: "SQL from zero",
      sub: "SELECT, WHERE, JOIN, GROUP BY",
      pt: {
        say: "Quase toda app guarda os dados em tabelas. | O SQL é como você faz perguntas a essas tabelas.",
        headline: "SQL do zero",
        sub: "SELECT, WHERE, JOIN, GROUP BY",
      },
    },
    {
      type: "compare",
      say: "Two tables. | Users has an id and a name. | Orders has a user id that points back to the user.",
      left: { label: "users", items: ["`id` 1 · Ana", "`id` 2 · Bruno"] },
      right: { label: "orders", items: ["`user_id` 1 · 30€", "`user_id` 1 · 80€"] },
      pt: {
        say: "Duas tabelas. | Users tem um id e um nome. | Orders tem um user id que aponta para o usuário.",
        left: { label: "users", items: ["`id` 1 · Ana", "`id` 2 · Bruno"] },
        right: { label: "orders", items: ["`user_id` 1 · 30€", "`user_id` 1 · 80€"] },
      },
    },
    {
      type: "code",
      say: "Read with select. | Choose the columns, the table, | filter with where, | then sort and limit.",
      code: "SELECT name\nFROM users\nWHERE country = 'PT'\nORDER BY name\nLIMIT 10;",
      highlight: [3],
      pt: { say: "Ler com select. | Escolha as colunas, a tabela, | filtre com where, | depois ordene e limite." },
    },
    {
      type: "compare",
      say: "Joining the two tables. | Inner join keeps only users with orders, so Bruno disappears. | Left join keeps everyone, and Bruno comes with null.",
      left: { label: "INNER JOIN", items: ["Ana · 30€", "Ana · 80€"] },
      right: { label: "LEFT JOIN", items: ["Ana · 30€", "Ana · 80€", "Bruno · `NULL`"] },
      pt: {
        say: "Juntar as duas tabelas. | O inner join só mantém usuários com pedidos, então o Bruno some. | O left join mantém todos, e o Bruno vem com null.",
        left: { label: "INNER JOIN", items: ["Ana · 30€", "Ana · 80€"] },
        right: { label: "LEFT JOIN", items: ["Ana · 30€", "Ana · 80€", "Bruno · `NULL`"] },
      },
    },
    {
      type: "fill",
      say: "Your turn. Total spent per user. Which clause is missing?",
      question: "Total spent per user:",
      code: "SELECT user_id, SUM(total)\nFROM orders\n___ user_id;",
      choices: ["GROUP BY", "ORDER BY", "WHERE"],
      answerIndex: 0,
      why: "Aggregates like sum, together with another column, need group by that column. One result row per user.",
      pt: {
        say: "Sua vez. Total gasto por usuário. Que cláusula falta?",
        question: "Total gasto por usuário:",
        why: "Agregações como sum, junto com outra coluna, precisam de group by nessa coluna. Uma linha de resultado por usuário.",
      },
    },
    {
      type: "quiz",
      say: "Quick check. Which query finds users who never ordered?",
      question: "Users who **never** ordered:",
      options: ["`JOIN orders … WHERE o.id IS NULL`", "`LEFT JOIN orders … WHERE o.id IS NULL`", "`LEFT JOIN orders … WHERE o.id = NULL`"],
      answerIndex: 1,
      why: "Left join keeps everyone, and is null finds the ones without a match. Equals null is never true.",
      pt: {
        say: "Pergunta rápida. Que query encontra usuários que nunca fizeram pedidos?",
        question: "Usuários que **nunca** fizeram pedidos:",
        options: ["`JOIN orders … WHERE o.id IS NULL`", "`LEFT JOIN orders … WHERE o.id IS NULL`", "`LEFT JOIN orders … WHERE o.id = NULL`"],
        why: "O left join mantém todos, e o is null encontra quem não tem par. Igual a null nunca é verdade.",
      },
    },
    {
      type: "truefalse",
      say: "True or false?",
      statement: "`COUNT(coupon)` counts every row, including the ones where coupon is NULL.",
      answer: false,
      why: "Count of a column ignores nulls. Count star counts every row.",
      pt: {
        say: "Verdadeiro ou falso?",
        statement: "`COUNT(coupon)` conta todas as linhas, incluindo aquelas em que coupon é NULL.",
        why: "Count de uma coluna ignora os nulls. Count asterisco conta todas as linhas.",
      },
    },
  ],

  "lesson-sql-transactions": [
    {
      type: "title",
      say: "Your code will have bugs. | The database is the last line of defense for your data.",
      headline: "Keys & transactions",
      sub: "How the database protects your data",
      pt: {
        say: "O seu código vai ter bugs. | A base de dados é a última linha de defesa dos seus dados.",
        headline: "Chaves e transações",
        sub: "Como a base protege os seus dados",
      },
    },
    {
      type: "list",
      say: "Four rules you declare once. | Primary key: a unique id per row. | Foreign key: the reference must exist. | Unique: no duplicates. | Check: simple rules like total not negative.",
      items: ["`PRIMARY KEY` — unique id per row", "`REFERENCES users(id)` — no orphans", "`UNIQUE (email)` — no duplicates", "`CHECK (total >= 0)` — simple rules"],
      pt: {
        say: "Quatro regras que você declara uma vez. | Chave primária: um id único por linha. | Chave estrangeira: a referência tem de existir. | Unique: sem duplicados. | Check: regras simples, como total não negativo.",
        items: ["`PRIMARY KEY` — id único por linha", "`REFERENCES users(id)` — sem órfãos", "`UNIQUE (email)` — sem duplicados", "`CHECK (total >= 0)` — regras simples"],
      },
    },
    {
      type: "visual",
      kind: "boxes",
      say: "A transfer of fifty euros. | Account A has one hundred, | B has twenty. | A goes down to fifty, | and B goes up to seventy. Both steps, or none.",
      labels: ["A = `100€`", "B = `20€`", "A = `50€`", "B = `70€`"],
      pt: {
        say: "Uma transferência de cinquenta euros. | A conta A tem cem, | B tem vinte. | A desce para cinquenta, | e B sobe para setenta. Os dois passos, ou nenhum.",
        labels: ["A = `100€`", "B = `20€`", "A = `50€`", "B = `70€`"],
      },
    },
    {
      type: "code",
      say: "That's a transaction. | Begin, the two updates, and commit. If anything fails, rollback undoes everything.",
      code: "BEGIN;\nUPDATE accounts SET balance = balance - 50 WHERE id = 'A';\nUPDATE accounts SET balance = balance + 50 WHERE id = 'B';\nCOMMIT;",
      highlight: [1, 4],
      pt: { say: "Isso é uma transação. | Begin, os dois updates, e commit. Se algo falhar, o rollback desfaz tudo." },
    },
    {
      type: "reveal",
      say: "ACID, the four guarantees of a transaction. Tap each letter.",
      cards: [
        { front: "A", back: "Atomicity — all or nothing" },
        { front: "C", back: "Consistency — constraints stay true" },
        { front: "I", back: "Isolation — no half-done work visible" },
        { front: "D", back: "Durability — committed survives a crash" },
      ],
      why: "Atomicity, consistency, isolation and durability. Give one short example per letter in the interview.",
      pt: {
        say: "ACID, as quatro garantias de uma transação. Toca em cada letra.",
        cards: [
          { front: "A", back: "Atomicidade — tudo ou nada" },
          { front: "C", back: "Consistência — as constraints continuam verdade" },
          { front: "I", back: "Isolamento — nada de trabalho a meio visível" },
          { front: "D", back: "Durabilidade — commitado sobrevive a uma queda" },
        ],
        why: "Atomicidade, consistência, isolamento e durabilidade. Dê um exemplo curto por letra na entrevista.",
      },
    },
    {
      type: "quiz",
      say: "Two signups with the same email arrive at the same time. What guarantees no duplicate?",
      question: "Guaranteed no duplicate emails:",
      options: ["Check in the code before inserting", "A `UNIQUE` constraint on `email`", "An `ORDER BY email`"],
      answerIndex: 1,
      why: "Checking in code first has a race condition. The unique constraint is enforced by the database itself.",
      pt: {
        say: "Dois cadastros com o mesmo email chegam ao mesmo tempo. O que garante que não há duplicado?",
        question: "Garantir que não há emails duplicados:",
        options: ["Verificar no código antes de inserir", "Uma constraint `UNIQUE` em `email`", "Um `ORDER BY email`"],
        why: "Verificar no código antes tem race condition. A constraint unique é aplicada pela própria base de dados.",
      },
    },
  ],

  "lesson-data-modeling": [
    {
      type: "title",
      say: "Before writing code, decide your tables. | A good model makes every feature easier.",
      headline: "Data modeling",
      sub: "1:N, N:N and normalization",
      pt: {
        say: "Antes de escrever código, decida as tabelas. | Um bom modelo deixa todas as funcionalidades mais fáceis.",
        headline: "Modelagem de dados",
        sub: "1:N, N:N e normalização",
      },
    },
    {
      type: "flow",
      say: "Three questions for every feature. | What are the nouns? | One or many, in both directions? | And what data belongs to the relationship itself?",
      steps: ["Find the nouns: user, project, task", "One or many — both directions?", "Data about the relationship → join table"],
      pt: {
        say: "Três perguntas para cada funcionalidade. | Quais são os substantivos? | Um ou muitos, nos dois sentidos? | E que dados pertencem à própria relação?",
        steps: ["Ache os substantivos: usuário, projeto, tarefa", "Um ou muitos — nos dois sentidos?", "Dados da relação → tabela de junção"],
      },
    },
    {
      type: "visual",
      kind: "tree",
      say: "Many to many needs a join table. | Students, | courses, | and enrollments in between, | with both foreign keys, | and the grade, which belongs to the relationship.",
      labels: ["`students`", "`courses`", "`enrollments`", " `student_id`, `course_id`", " `grade`"],
      pt: {
        say: "Muitos para muitos precisa de uma tabela de junção. | Alunos, | cursos, | e enrollments no meio, | com as duas chaves estrangeiras, | e a nota, que pertence à relação.",
        labels: ["`students`", "`courses`", "`enrollments`", " `student_id`, `course_id`", " `grade`"],
      },
    },
    {
      type: "order",
      say: "Your turn. A blog: put the tables in the order you'd create them, so every foreign key points to a table that already exists.",
      question: "Creation order (foreign keys need the parent first):",
      items: ["`users`", "`posts` (user_id → users)", "`tags`", "`post_tags` (post_id, tag_id)"],
      why: "Parents first: users before posts, and the join table post tags only after both posts and tags exist.",
      pt: {
        say: "Sua vez. Um blog: põe as tabelas na ordem em que as criaria, para cada chave estrangeira apontar para uma tabela que já existe.",
        question: "Ordem de criação (as chaves estrangeiras precisam do pai antes):",
        items: ["`users`", "`posts` (user_id → users)", "`tags`", "`post_tags` (post_id, tag_id)"],
        why: "Os pais primeiro: users antes de posts, e a tabela de junção post tags só depois de posts e tags existirem.",
      },
    },
    {
      type: "list",
      say: "Small choices that show seniority. | Money as numeric, never float. | Timestamps with time zone. | Index the foreign keys you search by.",
      items: ["Money → `numeric(10,2)` or cents", "`created_at timestamptz`", "Index the foreign keys you query"],
      pt: {
        say: "Pequenas escolhas que mostram senioridade. | Dinheiro como numeric, nunca float. | Timestamps com fuso horário. | Índice nas chaves estrangeiras que você busca.",
        items: ["Dinheiro → `numeric(10,2)` ou cêntimos", "`created_at timestamptz`", "Índice nas chaves estrangeiras que consulta"],
      },
    },
    {
      type: "quiz",
      say: "Quick check. A user has many posts. Where does the foreign key go?",
      question: "User 1 → N posts. The foreign key lives in…",
      options: ["`users.post_ids` (an array)", "`posts.user_id`", "A separate table"],
      answerIndex: 1,
      why: "In one to many, the foreign key goes on the many side. Arrays of ids can't be enforced or joined well.",
      pt: {
        say: "Pergunta rápida. Um usuário tem muitos posts. Onde fica a chave estrangeira?",
        question: "Usuário 1 → N posts. A chave estrangeira fica em…",
        options: ["`users.post_ids` (um array)", "`posts.user_id`", "Uma tabela separada"],
        why: "Em um para muitos, a chave estrangeira fica do lado muitos. Arrays de ids não podem ser garantidos nem usados bem em joins.",
      },
    },
  ],

  "lesson-db-indexes": [
    {
      type: "title",
      say: "The page takes three seconds to load. | Nine times out of ten, the fix is in the database.",
      headline: "Slow queries",
      sub: "Indexes and EXPLAIN",
      pt: {
        say: "A página demora três segundos a carregar. | Nove em cada dez vezes, a correção está na base de dados.",
        headline: "Queries lentas",
        sub: "Índices e EXPLAIN",
      },
    },
    {
      type: "compare",
      say: "Without an index, the database reads every row. | With an index, it jumps straight to the right ones, like the index of a book.",
      left: { label: "Seq Scan", items: ["Reads 2 000 000 rows", "180 ms"] },
      right: { label: "Index Scan", items: ["Jumps to 20 rows", "0.4 ms"] },
      pt: {
        say: "Sem índice, o banco lê todas as linhas. | Com índice, salta direto para as certas, como o índice de um livro.",
        left: { label: "Seq Scan", items: ["Lê 2 000 000 linhas", "180 ms"] },
        right: { label: "Index Scan", items: ["Salta para 20 linhas", "0,4 ms"] },
      },
    },
    {
      type: "code",
      say: "Create the index for the query you run most. | Then prove it with explain analyze.",
      code: "CREATE INDEX ON orders (user_id, created_at DESC);\n\nEXPLAIN ANALYZE\nSELECT * FROM orders\nWHERE user_id = 7\nORDER BY created_at DESC LIMIT 20;",
      highlight: [1, 3],
      pt: { say: "Crie o índice para a query que mais roda. | Depois prove com explain analyze." },
    },
    {
      type: "list",
      say: "What to index. | Columns in frequent where filters. | Foreign keys used in joins. | Columns you sort by.",
      items: ["Frequent `WHERE` filters", "Foreign keys used in `JOIN`", "`ORDER BY` columns"],
      pt: {
        say: "O que indexar. | Colunas em filtros where frequentes. | Chaves estrangeiras usadas em joins. | Colunas por que você ordena.",
        items: ["Filtros `WHERE` frequentes", "Chaves estrangeiras usadas em `JOIN`", "Colunas de `ORDER BY`"],
      },
    },
    {
      type: "truefalse",
      say: "True or false?",
      statement: "Adding an index on every column makes the whole app faster.",
      answer: false,
      why: "Every index slows down inserts, updates and deletes, and uses disk. Index what you actually query.",
      pt: {
        say: "Verdadeiro ou falso?",
        statement: "Pôr um índice em todas as colunas deixa a app toda mais rápida.",
        why: "Cada índice deixa os inserts, updates e deletes mais lentos e ocupa disco. Indexe o que você realmente consulta.",
      },
    },
    {
      type: "reveal",
      say: "Three classic slowdowns. Tap each one to see the fix.",
      cards: [
        { front: "N+1 queries", back: "One query per item in a loop → use a JOIN or `IN (…)`" },
        { front: "`OFFSET 100000`", back: "Still reads all skipped rows → cursor pagination" },
        { front: "`SELECT *`", back: "Fetches columns you don't need → list the columns" },
      ],
      why: "Batch the N plus one queries, paginate with a cursor, and only select the columns you need.",
      pt: {
        say: "Três lentidões clássicas. Toca em cada uma para ver a correção.",
        cards: [
          { front: "Queries N+1", back: "Uma query por item num loop → use JOIN ou `IN (…)`" },
          { front: "`OFFSET 100000`", back: "Lê todas as linhas puladas → paginação por cursor" },
          { front: "`SELECT *`", back: "Traz colunas de que não precisa → liste as colunas" },
        ],
        why: "Junte as queries N mais um, pagine com cursor, e selecione só as colunas que precisa.",
      },
    },
    {
      type: "quiz",
      say: "Explain shows a seq scan on two million rows for where user id equals seven. What's likely missing?",
      question: "`Seq Scan … rows=2 000 000` on `WHERE user_id = 7`:",
      options: ["An index on `user_id`", "A `LIMIT`", "A transaction"],
      answerIndex: 0,
      why: "A sequential scan on a big table with a selective filter is the classic sign of a missing index.",
      pt: {
        say: "O explain mostra um seq scan em dois milhões de linhas para where user id igual a sete. O que provavelmente falta?",
        question: "`Seq Scan … rows=2 000 000` em `WHERE user_id = 7`:",
        options: ["Um índice em `user_id`", "Um `LIMIT`", "Uma transação"],
        why: "Um scan sequencial numa tabela grande com um filtro seletivo é o sinal clássico de índice em falta.",
      },
    },
  ],

  "lesson-auth": [
    {
      type: "title",
      say: "Two words that sound alike and get confused in every interview. | Authentication and authorization.",
      headline: "AuthN vs AuthZ",
      sub: "Who you are vs what you can do",
      pt: {
        say: "Duas palavras parecidas que se confundem em toda entrevista. | Autenticação e autorização.",
        headline: "AuthN vs AuthZ",
        sub: "Quem você é vs o que pode fazer",
      },
    },
    {
      type: "compare",
      say: "Authentication proves who you are: the login. | Authorization decides what you can do with this specific resource.",
      left: { label: "AuthN · who", items: ["Login", "Password, Google, magic link", "Fails → `401`"] },
      right: { label: "AuthZ · what", items: ["Can I edit invoice 42?", "Owner, role, RLS", "Fails → `403` / `404`"] },
      pt: {
        say: "A autenticação prova quem você é: o login. | A autorização decide o que você pode fazer com este recurso específico.",
        left: { label: "AuthN · quem", items: ["Login", "Senha, Google, magic link", "Falha → `401`"] },
        right: { label: "AuthZ · o quê", items: ["Posso editar a fatura 42?", "Dono, papel, RLS", "Falha → `403` / `404`"] },
      },
    },
    {
      type: "flow",
      say: "The login flow. | Send email and password over HTTPS, | compare with the stored hash, | issue a session or token in an HttpOnly cookie, | and every request carries it.",
      steps: ["Email + password over HTTPS", "Compare with bcrypt hash", "Session / JWT in HttpOnly cookie", "Each request → `req.user`"],
      pt: {
        say: "O fluxo de login. | Enviar email e senha por HTTPS, | comparar com o hash guardado, | emitir uma sessão ou token num cookie HttpOnly, | e cada pedido leva-o.",
        steps: ["Email + senha por HTTPS", "Comparar com o hash bcrypt", "Sessão / JWT em cookie HttpOnly", "Cada pedido → `req.user`"],
      },
    },
    {
      type: "fill",
      say: "Your turn. This query lets anyone read any invoice. Complete the filter so users only see their own.",
      question: "Scope the query to the owner:",
      code: "db.invoice.find({\n  id: req.params.id,\n  userId: ___,\n});",
      choices: ["req.user.id", "req.params.userId", "req.body.userId"],
      answerIndex: 0,
      why: "The user comes from the verified session, never from the URL or the body, which the client controls.",
      pt: {
        say: "Sua vez. Esta query deixa qualquer um ler qualquer fatura. Completa o filtro para cada usuário ver só as dele.",
        question: "Limite a query ao dono:",
        why: "O usuário vem da sessão verificada, nunca da URL nem do corpo, que o cliente controla.",
      },
    },
    {
      type: "reveal",
      say: "Session or JWT? Tap each card to compare.",
      cards: [
        { front: "Session", back: "Random id in a cookie, data on the server — easy to revoke" },
        { front: "JWT", back: "Signed token with claims — no DB lookup, valid until it expires" },
      ],
      why: "Sessions are easy to revoke. JWTs avoid a lookup, so keep them short lived with a refresh token.",
      pt: {
        say: "Sessão ou JWT? Toca em cada cartão para comparar.",
        cards: [
          { front: "Sessão", back: "Id aleatório num cookie, dados no servidor — fácil de revogar" },
          { front: "JWT", back: "Token assinado com dados — sem consulta ao banco, vale até expirar" },
        ],
        why: "Sessões são fáceis de revogar. JWTs evitam a consulta, então use validade curta com refresh token.",
      },
    },
    {
      type: "truefalse",
      say: "True or false?",
      statement: "Hiding the Delete button for non-admins is enough to protect the delete action.",
      answer: false,
      why: "Anyone can send the request without the interface. The server or the database must check permission on every request.",
      pt: {
        say: "Verdadeiro ou falso?",
        statement: "Esconder o botão Apagar para quem não é admin chega para proteger a ação de apagar.",
        why: "Qualquer um pode enviar o pedido sem a interface. O servidor ou a base de dados tem de verificar a permissão em cada pedido.",
      },
    },
    {
      type: "quiz",
      say: "Last one. How should passwords be stored?",
      question: "Passwords are stored…",
      options: ["Encrypted, to show them later", "As a bcrypt or argon2 hash", "In Base64"],
      answerIndex: 1,
      why: "You never need the original password. Store a slow, salted hash and compare hashes at login.",
      pt: {
        say: "Última. Como as senhas devem ser guardadas?",
        question: "As senhas são guardadas…",
        options: ["Encriptadas, para mostrar depois", "Como hash bcrypt ou argon2", "Em Base64"],
        why: "Você nunca precisa da senha original. Guarde um hash lento e com salt e compare os hashes no login.",
      },
    },
  ],
};

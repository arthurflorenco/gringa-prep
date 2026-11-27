import type { LessonDraftInput } from "@/lib/content/schema";

/** Semana 7 — Dados, back-end e segurança. */
export const lessons: LessonDraftInput[] = [
  {
    id: "lesson-sql-basics",
    kind: "lesson",
    topic: "sql-joins",
    title: "SQL from zero: SELECT, WHERE, JOIN, GROUP BY",
    prompt: "Reading data from a relational database — the queries every backend dev writes daily.",
    difficulty: 1,
    estimatedMin: 10,
    tags: ["sql", "backend"],
    body:
      "A relational database (Postgres, MySQL) stores data in **tables**: rows and columns. Tables are linked by **keys**. Example:\n\n`users(id, name, country)` and `orders(id, user_id, total, created_at)` — `orders.user_id` points to `users.id`.\n\n**Read** with `SELECT`:\n\n```sql\nSELECT name FROM users WHERE country = 'PT' ORDER BY name LIMIT 10;\n```\n\n**Combine tables** with `JOIN`:\n\n```sql\nSELECT u.name, o.total\nFROM users u\nJOIN orders o ON o.user_id = u.id;   -- only users WITH orders\n```\n\n- `INNER JOIN` (or just `JOIN`): only rows that match on both sides.\n- `LEFT JOIN`: all rows from the left table; missing matches are `NULL`. `LEFT JOIN … WHERE o.id IS NULL` = users **without** orders.\n\n**Aggregate** with `COUNT`, `SUM`, `AVG` + `GROUP BY`:\n\n```sql\nSELECT user_id, SUM(total) AS spent\nFROM orders\nGROUP BY user_id\nHAVING SUM(total) > 100;   -- filter groups (WHERE filters rows)\n```\n\nTraps: compare with `IS NULL`, never `= NULL`; `COUNT(*)` counts rows but `COUNT(col)` ignores NULLs; joining a 1:N relation repeats the \"one\" side, so sums can double.",
    keyPoints: [
      "SELECT columns FROM table WHERE condition ORDER BY … LIMIT …",
      "INNER JOIN = matches only; LEFT JOIN keeps all left rows (NULLs)",
      "GROUP BY + aggregates; HAVING filters groups",
      "IS NULL, COUNT(*) vs COUNT(col), joins can duplicate rows",
    ],
    pt: {
      title: "SQL do zero: SELECT, WHERE, JOIN, GROUP BY",
      prompt: "Ler dados de uma base relacional — as queries que todo dev back-end escreve todo dia.",
      body:
        "Uma base de dados relacional (Postgres, MySQL) guarda dados em **tabelas**: linhas e colunas. As tabelas ligam-se por **chaves**. Exemplo:\n\n`users(id, name, country)` e `orders(id, user_id, total, created_at)` — `orders.user_id` aponta para `users.id`.\n\n**Ler** com `SELECT`:\n\n```sql\nSELECT name FROM users WHERE country = 'PT' ORDER BY name LIMIT 10;\n```\n\n**Juntar tabelas** com `JOIN`:\n\n```sql\nSELECT u.name, o.total\nFROM users u\nJOIN orders o ON o.user_id = u.id;   -- só usuários COM pedidos\n```\n\n- `INNER JOIN` (ou só `JOIN`): só as linhas com par nos dois lados.\n- `LEFT JOIN`: todas as linhas da tabela da esquerda; quem não tem par vem `NULL`. `LEFT JOIN … WHERE o.id IS NULL` = usuários **sem** pedidos.\n\n**Agregar** com `COUNT`, `SUM`, `AVG` + `GROUP BY`:\n\n```sql\nSELECT user_id, SUM(total) AS spent\nFROM orders\nGROUP BY user_id\nHAVING SUM(total) > 100;   -- filtra grupos (o WHERE filtra linhas)\n```\n\nArmadilhas: compare com `IS NULL`, nunca `= NULL`; `COUNT(*)` conta linhas mas `COUNT(coluna)` ignora NULLs; juntar uma relação 1:N repete o lado \"um\", então as somas podem dobrar.",
      keyPoints: [
        "SELECT colunas FROM tabela WHERE condição ORDER BY … LIMIT …",
        "INNER JOIN = só pares; LEFT JOIN mantém as linhas da esquerda (NULLs)",
        "GROUP BY + agregações; HAVING filtra grupos",
        "IS NULL, COUNT(*) vs COUNT(coluna), joins podem duplicar linhas",
      ],
    },
  },
  {
    id: "lesson-sql-transactions",
    kind: "lesson",
    topic: "sql-transactions",
    title: "Keys, constraints and transactions",
    prompt: "How the database protects your data: primary/foreign keys, UNIQUE, CHECK and ACID transactions.",
    difficulty: 2,
    estimatedMin: 8,
    tags: ["sql", "backend"],
    body:
      "The database is your **last line of defense** for data quality — rules there apply to every app, script and bug.\n\n```sql\nCREATE TABLE orders (\n  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),\n  user_id    uuid NOT NULL REFERENCES users(id),\n  total      numeric(10,2) NOT NULL CHECK (total >= 0),\n  created_at timestamptz NOT NULL DEFAULT now()\n);\nCREATE UNIQUE INDEX ON users (email);\n```\n\n- **Primary key**: unique id of each row.\n- **Foreign key** (`REFERENCES`): the value must exist in the other table — no orphan orders. Deleting a referenced user fails unless you choose `ON DELETE CASCADE` / `SET NULL`.\n- **UNIQUE**: no duplicates, even with two requests at the same millisecond (checking in code first has a race condition).\n- **NOT NULL** / **CHECK**: required values and simple rules.\n\nA **transaction** groups statements so they succeed or fail together:\n\n```sql\nBEGIN;\nUPDATE accounts SET balance = balance - 50 WHERE id = 'A';\nUPDATE accounts SET balance = balance + 50 WHERE id = 'B';\nCOMMIT;   -- or ROLLBACK if anything failed\n```\n\n**ACID**: Atomicity (all or nothing), Consistency (constraints stay true), Isolation (concurrent transactions don't see half-done work), Durability (committed = survives a crash).\n\nSchema changes go through versioned **migrations** in the repo.",
    keyPoints: [
      "PK identifies rows; FK keeps references valid",
      "UNIQUE / NOT NULL / CHECK enforce rules for every client",
      "Transactions: BEGIN … COMMIT, all or nothing",
      "ACID: atomicity, consistency, isolation, durability",
    ],
    pt: {
      title: "Chaves, constraints e transações",
      prompt: "Como a base de dados protege os seus dados: chaves primária/estrangeira, UNIQUE, CHECK e transações ACID.",
      body:
        "A base de dados é a sua **última linha de defesa** da qualidade dos dados — as regras lá valem para toda app, script e bug.\n\n```sql\nCREATE TABLE orders (\n  id         uuid PRIMARY KEY DEFAULT gen_random_uuid(),\n  user_id    uuid NOT NULL REFERENCES users(id),\n  total      numeric(10,2) NOT NULL CHECK (total >= 0),\n  created_at timestamptz NOT NULL DEFAULT now()\n);\nCREATE UNIQUE INDEX ON users (email);\n```\n\n- **Chave primária**: id único de cada linha.\n- **Chave estrangeira** (`REFERENCES`): o valor tem de existir na outra tabela — nada de pedidos órfãos. Apagar um usuário referenciado falha, a não ser que escolha `ON DELETE CASCADE` / `SET NULL`.\n- **UNIQUE**: sem duplicados, mesmo com dois pedidos no mesmo milissegundo (verificar no código antes tem race condition).\n- **NOT NULL** / **CHECK**: valores obrigatórios e regras simples.\n\nUma **transação** agrupa comandos para darem certo ou falharem juntos:\n\n```sql\nBEGIN;\nUPDATE accounts SET balance = balance - 50 WHERE id = 'A';\nUPDATE accounts SET balance = balance + 50 WHERE id = 'B';\nCOMMIT;   -- ou ROLLBACK se algo falhou\n```\n\n**ACID**: Atomicidade (tudo ou nada), Consistência (as constraints continuam verdade), Isolamento (transações simultâneas não veem trabalho a meio), Durabilidade (commitado = sobrevive a uma queda).\n\nMudanças de schema passam por **migrações** versionadas no repositório.",
      keyPoints: [
        "A PK identifica linhas; a FK mantém referências válidas",
        "UNIQUE / NOT NULL / CHECK aplicam regras para todos os clientes",
        "Transações: BEGIN … COMMIT, tudo ou nada",
        "ACID: atomicidade, consistência, isolamento, durabilidade",
      ],
    },
  },
  {
    id: "lesson-data-modeling",
    kind: "lesson",
    topic: "data-modeling",
    title: "Data modeling: 1:N and N:N",
    prompt: "Designing tables for real features — and the questions interviewers ask about it.",
    difficulty: 2,
    estimatedMin: 8,
    tags: ["sql", "modeling"],
    body:
      "Modeling = deciding the **tables** and how they **relate**. Start from the nouns of the feature (user, project, task) and ask \"one or many?\" in both directions.\n\n**One-to-many (1:N)**: a user has many posts, a post has one author → foreign key on the **many** side: `posts.user_id`.\n\n**Many-to-many (N:N)**: students ↔ courses → a **join table**:\n\n```sql\nCREATE TABLE enrollments (\n  student_id uuid REFERENCES students(id),\n  course_id  uuid REFERENCES courses(id),\n  grade      int,                  -- data about the relationship\n  PRIMARY KEY (student_id, course_id)\n);\n```\n\n**Normalize**: store each fact once and reference it by id (a customer's email lives in `customers`, not copied into every order). Copy on purpose only when the value must be **frozen in time** — the price and shipping address at purchase.\n\nPractical choices interviewers like:\n- money as `numeric(10,2)` or integer cents, never float;\n- `created_at`/`updated_at` timestamps with time zone;\n- UUIDs for ids exposed in URLs (but still check ownership);\n- `deleted_at` for soft delete when you need history;\n- indexes on foreign keys you query by.",
    keyPoints: [
      "1:N → foreign key on the many side",
      "N:N → join table (+ relationship attributes)",
      "Normalize; copy only data frozen in time",
      "numeric for money, timestamps, UUIDs, index FKs",
    ],
    pt: {
      title: "Modelagem de dados: 1:N e N:N",
      prompt: "Desenhar tabelas para funcionalidades reais — e as perguntas que os entrevistadores fazem.",
      body:
        "Modelar = decidir as **tabelas** e como se **relacionam**. Comece pelos substantivos da funcionalidade (usuário, projeto, tarefa) e pergunte \"um ou muitos?\" nos dois sentidos.\n\n**Um-para-muitos (1:N)**: um usuário tem muitos posts, um post tem um autor → chave estrangeira do lado **muitos**: `posts.user_id`.\n\n**Muitos-para-muitos (N:N)**: alunos ↔ cursos → uma **tabela de junção**:\n\n```sql\nCREATE TABLE enrollments (\n  student_id uuid REFERENCES students(id),\n  course_id  uuid REFERENCES courses(id),\n  grade      int,                  -- dado sobre a relação\n  PRIMARY KEY (student_id, course_id)\n);\n```\n\n**Normalize**: guarde cada facto uma vez e referencie pelo id (o email do cliente fica em `customers`, não copiado em cada pedido). Copie de propósito só quando o valor tem de ficar **congelado no tempo** — o preço e a morada de entrega no momento da compra.\n\nEscolhas práticas que os entrevistadores gostam:\n- dinheiro como `numeric(10,2)` ou cêntimos inteiros, nunca float;\n- timestamps `created_at`/`updated_at` com fuso horário;\n- UUIDs para ids expostos em URLs (mas continue a verificar o dono);\n- `deleted_at` para soft delete quando precisa de histórico;\n- índices nas chaves estrangeiras usadas em buscas.",
      keyPoints: [
        "1:N → chave estrangeira do lado muitos",
        "N:N → tabela de junção (+ atributos da relação)",
        "Normalize; copie só dados congelados no tempo",
        "numeric para dinheiro, timestamps, UUIDs, índices nas FKs",
      ],
    },
  },
  {
    id: "lesson-db-indexes",
    kind: "lesson",
    topic: "db-indexes",
    title: "Indexes, EXPLAIN and slow queries",
    prompt: "Why a query is slow and how to prove your fix worked.",
    difficulty: 2,
    estimatedMin: 8,
    tags: ["sql", "performance"],
    body:
      "Without an index, `WHERE user_id = 7` makes the database read **every row** (a *sequential scan*). An **index** is a sorted structure (B-tree) that jumps straight to the matching rows — like the index of a book.\n\n```sql\nCREATE INDEX orders_user_created_idx ON orders (user_id, created_at DESC);\n```\n\n**Measure, don't guess**:\n\n```sql\nEXPLAIN ANALYZE\nSELECT * FROM orders WHERE user_id = 7 ORDER BY created_at DESC LIMIT 20;\n-- before: Seq Scan on orders … 180 ms\n-- after:  Index Scan using orders_user_created_idx … 0.4 ms\n```\n\nWhat to index: columns in frequent `WHERE`, `JOIN` (foreign keys!) and `ORDER BY`. **Composite** indexes work left to right: `(user_id, created_at)` helps \"by user, newest first\", not \"by date only\".\n\nThe cost: every index slows down `INSERT/UPDATE/DELETE` and uses disk. Don't index everything.\n\nOther classic slowdowns:\n- **N+1 queries**: one query for the list + one per item. Use a JOIN or `WHERE id IN (…)`.\n- **Deep `OFFSET`**: `OFFSET 100000` still reads 100 000 rows. Use **cursor pagination**: `WHERE created_at < :last LIMIT 20`.\n- `SELECT *` on wide tables when you need 2 columns.",
    keyPoints: [
      "No index → sequential scan of the whole table",
      "Index WHERE / JOIN / ORDER BY columns; composites left→right",
      "EXPLAIN ANALYZE before and after",
      "Indexes cost writes; watch for N+1 and deep OFFSET",
    ],
    pt: {
      title: "Índices, EXPLAIN e queries lentas",
      prompt: "Porque uma query é lenta e como provar que a correção funcionou.",
      body:
        "Sem índice, `WHERE user_id = 7` obriga o banco a ler **todas as linhas** (um *sequential scan*). Um **índice** é uma estrutura ordenada (B-tree) que salta direto para as linhas certas — como o índice de um livro.\n\n```sql\nCREATE INDEX orders_user_created_idx ON orders (user_id, created_at DESC);\n```\n\n**Meça, não adivinhe**:\n\n```sql\nEXPLAIN ANALYZE\nSELECT * FROM orders WHERE user_id = 7 ORDER BY created_at DESC LIMIT 20;\n-- antes:  Seq Scan on orders … 180 ms\n-- depois: Index Scan using orders_user_created_idx … 0.4 ms\n```\n\nO que indexar: colunas em `WHERE`, `JOIN` (chaves estrangeiras!) e `ORDER BY` frequentes. Índices **compostos** funcionam da esquerda para a direita: `(user_id, created_at)` ajuda \"por usuário, mais recentes primeiro\", não \"só por data\".\n\nO custo: cada índice deixa `INSERT/UPDATE/DELETE` mais lentos e ocupa disco. Não indexe tudo.\n\nOutras lentidões clássicas:\n- **Queries N+1**: uma query para a lista + uma por item. Use JOIN ou `WHERE id IN (…)`.\n- **`OFFSET` profundo**: `OFFSET 100000` ainda lê 100 000 linhas. Use **paginação por cursor**: `WHERE created_at < :ultimo LIMIT 20`.\n- `SELECT *` em tabelas largas quando precisa de 2 colunas.",
      keyPoints: [
        "Sem índice → scan sequencial da tabela inteira",
        "Indexe colunas de WHERE / JOIN / ORDER BY; compostos da esquerda→direita",
        "EXPLAIN ANALYZE antes e depois",
        "Índices custam escritas; cuidado com N+1 e OFFSET profundo",
      ],
    },
  },
  {
    id: "lesson-auth",
    kind: "lesson",
    topic: "authn-authz",
    title: "Authentication vs authorization",
    prompt: "Who are you vs what can you do — sessions, JWTs, passwords and the most common security bug.",
    difficulty: 2,
    estimatedMin: 9,
    tags: ["security", "backend"],
    body:
      "**Authentication (AuthN)** = proving **who** you are (login). **Authorization (AuthZ)** = deciding **what** you can do with a resource.\n\nLogin flow:\n1. The user sends email + password over HTTPS.\n2. The server compares with the stored **hash** (bcrypt/argon2 — never store passwords, not even encrypted).\n3. It issues a credential: a **session** (random id in a cookie, data on the server — easy to revoke) or a **JWT** (signed token with claims — no lookup per request, but valid until it expires; keep it short-lived + refresh token).\n4. Each request sends that credential; middleware turns it into `req.user`.\n\nStore the credential in an **HttpOnly, Secure, SameSite** cookie — JavaScript (and XSS) can't read it.\n\nThe most common bug is **broken access control / IDOR**:\n\n```js\n// ❌ any logged-in user reads any invoice\nconst invoice = await db.invoice.find(req.params.id);\n// ✅ scope to the owner\nconst invoice = await db.invoice.find({ id: req.params.id, userId: req.user.id });\n```\n\nHiding a button is UX, not security: **every request** must be authorized on the server — or by the database with **Row Level Security** (Postgres/Supabase), which adds the owner filter to every query.\n\n\"Sign in with Google\" (OAuth/OIDC) gives you a verified identity without ever seeing the Google password.",
    keyPoints: [
      "AuthN = who you are; AuthZ = what you can do",
      "Hash passwords (bcrypt/argon2); HttpOnly cookies",
      "Session (revocable) vs JWT (stateless, short-lived)",
      "Authorize every request on the server / with RLS — IDOR is the #1 bug",
    ],
    pt: {
      title: "Autenticação vs autorização",
      prompt: "Quem você é vs o que pode fazer — sessões, JWTs, senhas e o bug de segurança mais comum.",
      body:
        "**Autenticação (AuthN)** = provar **quem** você é (login). **Autorização (AuthZ)** = decidir **o que** você pode fazer com um recurso.\n\nFluxo de login:\n1. O usuário envia email + senha por HTTPS.\n2. O servidor compara com o **hash** guardado (bcrypt/argon2 — nunca guarde senhas, nem encriptadas).\n3. Emite uma credencial: uma **sessão** (id aleatório num cookie, dados no servidor — fácil de revogar) ou um **JWT** (token assinado com dados — sem consulta por pedido, mas vale até expirar; validade curta + refresh token).\n4. Cada pedido envia essa credencial; um middleware transforma em `req.user`.\n\nGuarde a credencial num cookie **HttpOnly, Secure, SameSite** — o JavaScript (e um XSS) não consegue lê-la.\n\nO bug mais comum é o **controlo de acesso quebrado / IDOR**:\n\n```js\n// ❌ qualquer usuário com login lê qualquer fatura\nconst invoice = await db.invoice.find(req.params.id);\n// ✅ limitado ao dono\nconst invoice = await db.invoice.find({ id: req.params.id, userId: req.user.id });\n```\n\nEsconder um botão é UX, não segurança: **cada pedido** tem de ser autorizado no servidor — ou pela base de dados com **Row Level Security** (Postgres/Supabase), que junta o filtro do dono a cada query.\n\n\"Entrar com Google\" (OAuth/OIDC) dá uma identidade verificada sem você ver a senha do Google.",
      keyPoints: [
        "AuthN = quem você é; AuthZ = o que pode fazer",
        "Hash nas senhas (bcrypt/argon2); cookies HttpOnly",
        "Sessão (revogável) vs JWT (sem estado, validade curta)",
        "Autorize cada pedido no servidor / com RLS — o IDOR é o bug nº 1",
      ],
    },
  },
];

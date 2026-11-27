import type { ExerciseInput } from "@/lib/content/schema";
import { quiz } from "./_helpers";

/**
 * SQL do zero até entrevista. Tabelas usadas nos exemplos:
 *   users(id, name, country)          orders(id, user_id, total, created_at)
 */
const TABLES_EN = "Tables: `users(id, name, country)` and `orders(id, user_id, total, created_at)`.";
const TABLES_PT = "Tabelas: `users(id, name, country)` e `orders(id, user_id, total, created_at)`.";

export const exercises: ExerciseInput[] = [
  // ───────────────────────── SELECT, WHERE, JOIN ─────────────────────────
  quiz("sql-joins", "sql-select-where-quiz", 1, 2, {
    title: "SELECT and WHERE",
    prompt: `${TABLES_EN}\nWhich query lists the **names** of users from Portugal?`,
    options: ["`SELECT * FROM users`", "`SELECT name FROM users IF country = 'PT'`", "`SELECT name FROM users WHERE country = 'PT'`", "`GET name FROM users WHERE country = 'PT'`"],
    explanation: "`SELECT` columns `FROM` table `WHERE` condition. Strings use single quotes.",
  }, {
    title: "SELECT e WHERE",
    prompt: `${TABLES_PT}\nQue query lista os **nomes** dos usuários de Portugal?`,
    options: ["`SELECT * FROM users`", "`SELECT name FROM users IF country = 'PT'`", "`SELECT name FROM users WHERE country = 'PT'`", "`GET name FROM users WHERE country = 'PT'`"],
    explanation: "`SELECT` colunas `FROM` tabela `WHERE` condição. Textos usam aspas simples.",
  }),
  quiz("sql-joins", "sql-order-limit-quiz", 1, 1, {
    title: "Top 5",
    prompt: `${TABLES_EN}\nThe 5 most expensive orders?`,
    options: ["`SELECT * FROM orders LIMIT 5 ORDER BY total`", "`SELECT * FROM orders ORDER BY total DESC LIMIT 5`", "`SELECT TOP total FROM orders`", "`SELECT * FROM orders WHERE total = MAX LIMIT 5`"],
    explanation: "`ORDER BY … DESC` sorts from highest to lowest, then `LIMIT` cuts. `ORDER BY` comes before `LIMIT`.",
  }, {
    title: "Top 5",
    prompt: `${TABLES_PT}\nOs 5 pedidos mais caros?`,
    options: ["`SELECT * FROM orders LIMIT 5 ORDER BY total`", "`SELECT * FROM orders ORDER BY total DESC LIMIT 5`", "`SELECT TOP total FROM orders`", "`SELECT * FROM orders WHERE total = MAX LIMIT 5`"],
    explanation: "`ORDER BY … DESC` ordena do maior para o menor e o `LIMIT` corta. `ORDER BY` vem antes do `LIMIT`.",
  }),
  quiz("sql-joins", "sql-inner-join-quiz", 2, 0, {
    title: "INNER JOIN",
    prompt: `${TABLES_EN}\nAna has 2 orders, Bruno has 0. How many rows does this return?\n\`\`\`sql\nSELECT u.name, o.total\nFROM users u\nJOIN orders o ON o.user_id = u.id;\n\`\`\``,
    options: ["2 — only rows with a match in both tables", "3 — Bruno appears with NULL", "1 — one per user", "0 — JOIN needs a WHERE"],
    explanation: "`JOIN` (= `INNER JOIN`) keeps only pairs that match. Bruno has no orders, so he disappears.",
  }, {
    title: "INNER JOIN",
    prompt: `${TABLES_PT}\nA Ana tem 2 pedidos, o Bruno tem 0. Quantas linhas isto devolve?\n\`\`\`sql\nSELECT u.name, o.total\nFROM users u\nJOIN orders o ON o.user_id = u.id;\n\`\`\``,
    options: ["2 — só as linhas com correspondência nas duas tabelas", "3 — o Bruno aparece com NULL", "1 — uma por usuário", "0 — JOIN precisa de WHERE"],
    explanation: "`JOIN` (= `INNER JOIN`) só mantém os pares que combinam. O Bruno não tem pedidos, então some.",
  }),
  quiz("sql-joins", "sql-left-join-quiz", 2, 1, {
    title: "LEFT JOIN",
    prompt: `${TABLES_EN}\nSame data (Ana 2 orders, Bruno 0). Now with \`LEFT JOIN\`:\n\`\`\`sql\nSELECT u.name, o.total\nFROM users u\nLEFT JOIN orders o ON o.user_id = u.id;\n\`\`\``,
    options: ["2 rows", "3 rows — Bruno appears once with `total = NULL`", "4 rows", "An error"],
    explanation: "`LEFT JOIN` keeps **every** row from the left table; missing matches come as `NULL`.",
  }, {
    title: "LEFT JOIN",
    prompt: `${TABLES_PT}\nOs mesmos dados (Ana 2 pedidos, Bruno 0). Agora com \`LEFT JOIN\`:\n\`\`\`sql\nSELECT u.name, o.total\nFROM users u\nLEFT JOIN orders o ON o.user_id = u.id;\n\`\`\``,
    options: ["2 linhas", "3 linhas — o Bruno aparece uma vez com `total = NULL`", "4 linhas", "Um erro"],
    explanation: "`LEFT JOIN` mantém **todas** as linhas da tabela da esquerda; quem não tem par vem com `NULL`.",
  }),
  quiz("sql-joins", "sql-anti-join-quiz", 3, 3, {
    title: "Users without orders",
    prompt: `${TABLES_EN}\nWhich query lists users who **never** ordered?`,
    options: [
      "`SELECT u.name FROM users u JOIN orders o ON o.user_id = u.id WHERE o.id IS NULL`",
      "`SELECT name FROM users WHERE orders = 0`",
      "`SELECT u.name FROM users u LEFT JOIN orders o ON o.user_id = u.id WHERE o.total = NULL`",
      "`SELECT u.name FROM users u LEFT JOIN orders o ON o.user_id = u.id WHERE o.id IS NULL`",
    ],
    explanation: "LEFT JOIN + `IS NULL` on the right side = rows with no match (an \"anti-join\"; `NOT EXISTS` also works). `= NULL` is never true — use `IS NULL`. An INNER JOIN already removed them.",
  }, {
    title: "Usuários sem pedidos",
    prompt: `${TABLES_PT}\nQue query lista os usuários que **nunca** fizeram pedidos?`,
    options: [
      "`SELECT u.name FROM users u JOIN orders o ON o.user_id = u.id WHERE o.id IS NULL`",
      "`SELECT name FROM users WHERE orders = 0`",
      "`SELECT u.name FROM users u LEFT JOIN orders o ON o.user_id = u.id WHERE o.total = NULL`",
      "`SELECT u.name FROM users u LEFT JOIN orders o ON o.user_id = u.id WHERE o.id IS NULL`",
    ],
    explanation: "LEFT JOIN + `IS NULL` do lado direito = linhas sem par (um \"anti-join\"; `NOT EXISTS` também serve). `= NULL` nunca é verdade — use `IS NULL`. O INNER JOIN já os tinha removido.",
  }),
  quiz("sql-joins", "sql-group-by-quiz", 2, 2, {
    title: "GROUP BY",
    prompt: `${TABLES_EN}\nTotal spent **per user**?`,
    options: [
      "`SELECT user_id, total FROM orders`",
      "`SELECT user_id, SUM(total) FROM orders`",
      "`SELECT user_id, SUM(total) FROM orders GROUP BY user_id`",
      "`SELECT SUM(user_id) FROM orders GROUP BY total`",
    ],
    explanation: "Aggregates (`SUM`, `COUNT`, `AVG`) with other columns need `GROUP BY` those columns — one result row per group.",
  }, {
    title: "GROUP BY",
    prompt: `${TABLES_PT}\nTotal gasto **por usuário**?`,
    options: [
      "`SELECT user_id, total FROM orders`",
      "`SELECT user_id, SUM(total) FROM orders`",
      "`SELECT user_id, SUM(total) FROM orders GROUP BY user_id`",
      "`SELECT SUM(user_id) FROM orders GROUP BY total`",
    ],
    explanation: "Agregações (`SUM`, `COUNT`, `AVG`) junto com outras colunas precisam de `GROUP BY` nessas colunas — uma linha de resultado por grupo.",
  }),
  quiz("sql-joins", "sql-having-quiz", 3, 1, {
    title: "WHERE or HAVING?",
    prompt: `${TABLES_EN}\nUsers who spent **more than 100 in total**:`,
    options: [
      "`SELECT user_id FROM orders WHERE SUM(total) > 100 GROUP BY user_id`",
      "`SELECT user_id FROM orders GROUP BY user_id HAVING SUM(total) > 100`",
      "`SELECT user_id FROM orders WHERE total > 100`",
      "`SELECT user_id FROM orders HAVING total > 100`",
    ],
    explanation: "`WHERE` filters rows **before** grouping; `HAVING` filters groups **after** aggregating. `WHERE total > 100` finds single big orders, not big spenders.",
  }, {
    title: "WHERE ou HAVING?",
    prompt: `${TABLES_PT}\nUsuários que gastaram **mais de 100 no total**:`,
    options: [
      "`SELECT user_id FROM orders WHERE SUM(total) > 100 GROUP BY user_id`",
      "`SELECT user_id FROM orders GROUP BY user_id HAVING SUM(total) > 100`",
      "`SELECT user_id FROM orders WHERE total > 100`",
      "`SELECT user_id FROM orders HAVING total > 100`",
    ],
    explanation: "`WHERE` filtra linhas **antes** de agrupar; `HAVING` filtra grupos **depois** de agregar. `WHERE total > 100` acha pedidos grandes, não quem gastou muito.",
  }),
  quiz("sql-joins", "sql-count-null-quiz", 3, 2, {
    title: "COUNT and NULL",
    prompt: "`orders.coupon` is NULL in 3 of 10 rows. What do `COUNT(*)` and `COUNT(coupon)` return?",
    options: ["10 and 10", "7 and 7", "10 and 7", "10 and 3"],
    explanation: "`COUNT(*)` counts rows; `COUNT(column)` ignores NULLs. Classic interview trap.",
  }, {
    title: "COUNT e NULL",
    prompt: "`orders.coupon` é NULL em 3 de 10 linhas. O que devolvem `COUNT(*)` e `COUNT(coupon)`?",
    options: ["10 e 10", "7 e 7", "10 e 7", "10 e 3"],
    explanation: "`COUNT(*)` conta linhas; `COUNT(coluna)` ignora NULLs. Armadilha clássica de entrevista.",
  }),
  quiz("sql-joins", "sql-join-duplicates-quiz", 3, 0, {
    title: "Why did the total double?",
    prompt: "You join `orders` with `order_items` (several items per order) and then `SUM(orders.total)`. The revenue looks way too high. Why?",
    options: [
      "The join repeats each order once per item, so its total is summed several times — aggregate items first or sum at the right level",
      "SUM is broken with joins",
      "You need DISTINCT on the whole query",
      "NULL totals count double",
    ],
    explanation: "A 1:N join multiplies the \"one\" side. Sum `order_items` in a subquery/CTE, or sum `orders.total` without joining items.",
  }, {
    title: "Porque o total dobrou?",
    prompt: "Você faz join de `orders` com `order_items` (vários itens por pedido) e depois `SUM(orders.total)`. A receita fica alta demais. Porquê?",
    options: [
      "O join repete cada pedido uma vez por item, então o total é somado várias vezes — agregue os itens antes ou some no nível certo",
      "O SUM não funciona com joins",
      "Falta DISTINCT na query inteira",
      "Totais NULL contam a dobrar",
    ],
    explanation: "Um join 1:N multiplica o lado \"um\". Some os `order_items` numa subquery/CTE, ou some `orders.total` sem juntar os itens.",
  }),
  {
    id: "sql-joins-explain",
    kind: "concept",
    topic: "sql-joins",
    title: "INNER JOIN vs LEFT JOIN",
    prompt: "Interview classic: **What's the difference between an INNER JOIN and a LEFT JOIN?** Use an example with users and orders.",
    difficulty: 2,
    estimatedMin: 5,
    tags: ["interview-classic"],
    modelAnswer:
      "A JOIN combines rows from two tables using a condition, usually a foreign key: `orders.user_id = users.id`.\n\nAn **INNER JOIN** returns only rows that have a match on **both** sides — users with at least one order. A **LEFT JOIN** returns **all** rows from the left table, and when there's no match the right-side columns come as **NULL**.\n\nFor example, to list every user with their number of orders, including people who never bought anything, I'd use `users LEFT JOIN orders` and `COUNT(orders.id)` grouped by user — users without orders get 0. And `LEFT JOIN … WHERE orders.id IS NULL` finds users who never ordered.",
    rubric: ["Join combines tables by a key (foreign key = primary key)", "INNER: only rows matching on both sides", "LEFT: all rows from the left, NULL when no match", "Concrete example (users without orders / counting)"],
    rubricKeys: [
      ["foreign key", "chave estrangeira", "user_id", "on ", "key", "chave"],
      ["inner", "both", "ambos", "ambas", "match", "correspond"],
      ["left", "all rows", "todas as linhas", "null"],
      ["for example", "por exemplo", "never", "nunca", "count", "without orders", "sem pedidos"],
    ],
    pt: {
      title: "INNER JOIN vs LEFT JOIN",
      prompt: "Clássico de entrevista: **Qual a diferença entre INNER JOIN e LEFT JOIN?** Use um exemplo com usuários e pedidos.",
      modelAnswer:
        "Um JOIN combina linhas de duas tabelas por uma condição, normalmente uma chave estrangeira: `orders.user_id = users.id`.\n\nO **INNER JOIN** devolve só as linhas que têm par **nos dois lados** — usuários com pelo menos um pedido. O **LEFT JOIN** devolve **todas** as linhas da tabela da esquerda e, quando não há par, as colunas da direita vêm **NULL**.\n\nPor exemplo, para listar todos os usuários com o número de pedidos, incluindo quem nunca comprou, uso `users LEFT JOIN orders` e `COUNT(orders.id)` agrupado por usuário — quem não tem pedidos fica com 0. E `LEFT JOIN … WHERE orders.id IS NULL` acha quem nunca fez pedidos.",
      rubric: ["O join combina tabelas por uma chave (chave estrangeira = chave primária)", "INNER: só linhas com par nos dois lados", "LEFT: todas as linhas da esquerda, NULL quando não há par", "Exemplo concreto (usuários sem pedidos / contagem)"],
    },
  },

  // ───────────────────────── Chaves, constraints e transações ─────────────────────────
  quiz("sql-transactions", "sql-pk-fk-quiz", 1, 0, {
    title: "Primary and foreign keys",
    prompt: "In `orders(id, user_id, total)`, what are `id` and `user_id`?",
    options: ["`id` = primary key (unique row id); `user_id` = foreign key pointing to `users.id`", "Both are primary keys", "`user_id` = primary key; `id` = foreign key", "Both are indexes, not keys"],
    explanation: "The primary key identifies each row. A foreign key references another table's primary key and the database guarantees it exists.",
  }, {
    title: "Chave primária e estrangeira",
    prompt: "Em `orders(id, user_id, total)`, o que são `id` e `user_id`?",
    options: ["`id` = chave primária (id único da linha); `user_id` = chave estrangeira que aponta para `users.id`", "Ambos são chaves primárias", "`user_id` = chave primária; `id` = chave estrangeira", "Ambos são índices, não chaves"],
    explanation: "A chave primária identifica cada linha. A chave estrangeira referencia a chave primária de outra tabela e o banco garante que ela existe.",
  }),
  quiz("sql-transactions", "sql-fk-delete-quiz", 2, 2, {
    title: "Deleting a parent",
    prompt: "`orders.user_id` references `users.id` with the default `ON DELETE` behaviour. You delete a user who has orders. What happens?",
    options: ["The orders are deleted too", "The orders keep a `user_id` that points to nothing", "The DELETE fails with a foreign key violation", "The user_id becomes NULL"],
    explanation: "The default (`NO ACTION`/`RESTRICT`) blocks it. You choose `ON DELETE CASCADE` (delete children) or `SET NULL` explicitly — or soft-delete the user.",
  }, {
    title: "Apagar o pai",
    prompt: "`orders.user_id` referencia `users.id` com o `ON DELETE` padrão. Você apaga um usuário que tem pedidos. O que acontece?",
    options: ["Os pedidos são apagados também", "Os pedidos ficam com um `user_id` que aponta para nada", "O DELETE falha com violação de chave estrangeira", "O user_id vira NULL"],
    explanation: "O padrão (`NO ACTION`/`RESTRICT`) bloqueia. Você escolhe `ON DELETE CASCADE` (apaga os filhos) ou `SET NULL` explicitamente — ou faz soft delete do usuário.",
  }),
  quiz("sql-transactions", "sql-unique-quiz", 2, 1, {
    title: "Duplicate emails",
    prompt: "Two signups with the same email arrive at the same millisecond. Your code checks \"does this email exist?\" before inserting. How do you **guarantee** no duplicates?",
    options: ["Check twice in the code", "A `UNIQUE` constraint on `users.email` — the database rejects the second insert", "Add `ORDER BY email`", "Use a LEFT JOIN"],
    explanation: "Check-then-insert has a race condition. Constraints are enforced by the database atomically; handle the error (→ `409 Conflict`).",
  }, {
    title: "Emails duplicados",
    prompt: "Dois cadastros com o mesmo email chegam no mesmo milissegundo. O seu código verifica \"este email existe?\" antes de inserir. Como **garantir** que não há duplicados?",
    options: ["Verificar duas vezes no código", "Uma constraint `UNIQUE` em `users.email` — o banco rejeita o segundo insert", "Adicionar `ORDER BY email`", "Usar um LEFT JOIN"],
    explanation: "Verificar-e-depois-inserir tem race condition. Constraints são aplicadas pelo banco de forma atómica; trate o erro (→ `409 Conflict`).",
  }),
  quiz("sql-transactions", "sql-transaction-quiz", 2, 3, {
    title: "Transferring money",
    prompt: "Moving 50€ from account A to B needs two UPDATEs. The server crashes after the first. How do you avoid losing the money?",
    options: ["Run the UPDATEs in the opposite order", "Add an index on balance", "Retry the second UPDATE manually", "Wrap both in a transaction (`BEGIN … COMMIT`): either both apply or neither does"],
    explanation: "A transaction is **atomic**: if anything fails before `COMMIT`, it rolls back. That's the A in ACID.",
  }, {
    title: "Transferir dinheiro",
    prompt: "Passar 50€ da conta A para a B precisa de dois UPDATEs. O servidor cai depois do primeiro. Como não perder o dinheiro?",
    options: ["Rodar os UPDATEs na ordem inversa", "Pôr um índice no saldo", "Repetir o segundo UPDATE à mão", "Pôr os dois numa transação (`BEGIN … COMMIT`): ou os dois acontecem, ou nenhum"],
    explanation: "Uma transação é **atómica**: se algo falhar antes do `COMMIT`, tudo é desfeito (rollback). É o A de ACID.",
  }),
  quiz("sql-transactions", "sql-acid-quiz", 3, 1, {
    title: "ACID",
    prompt: "Which line about ACID is correct?",
    options: [
      "Atomicity = queries run fast",
      "Atomicity: all or nothing · Consistency: constraints stay valid · Isolation: concurrent transactions don't see each other's half-done work · Durability: committed data survives a crash",
      "Isolation = each user has their own database",
      "Durability = data is cached in memory",
    ],
    explanation: "Postgres gives you ACID transactions. Interviewers like a one-line example per letter.",
  }, {
    title: "ACID",
    prompt: "Que frase sobre ACID está certa?",
    options: [
      "Atomicidade = as queries rodam rápido",
      "Atomicidade: tudo ou nada · Consistência: as constraints continuam válidas · Isolamento: transações simultâneas não veem o trabalho a meio uma da outra · Durabilidade: o que foi commitado sobrevive a uma queda",
      "Isolamento = cada usuário tem a sua base de dados",
      "Durabilidade = os dados ficam em cache na memória",
    ],
    explanation: "O Postgres dá transações ACID. Entrevistadores gostam de um exemplo curto por letra.",
  }),
  quiz("sql-transactions", "sql-not-null-check-quiz", 2, 2, {
    title: "Data rules in the database",
    prompt: "Which constraint stops an order with a negative total from being saved, no matter which code inserts it?",
    options: ["`UNIQUE (total)`", "`DEFAULT 0`", "`CHECK (total >= 0)`", "`INDEX ON total`"],
    explanation: "`CHECK` validates each row; `NOT NULL` forbids missing values. Rules in the database protect against every client and script.",
  }, {
    title: "Regras de dados no banco",
    prompt: "Que constraint impede que um pedido com total negativo seja guardado, venha de que código vier?",
    options: ["`UNIQUE (total)`", "`DEFAULT 0`", "`CHECK (total >= 0)`", "`INDEX ON total`"],
    explanation: "`CHECK` valida cada linha; `NOT NULL` proíbe valores em falta. Regras no banco protegem contra qualquer cliente e script.",
  }),
  quiz("sql-transactions", "sql-migration-quiz", 2, 0, {
    title: "Changing the schema",
    prompt: "How do teams usually change the database schema (add a column, a table)?",
    options: [
      "With versioned **migrations** in the repo (SQL files run in order in every environment)",
      "Clicking in the production dashboard",
      "Each developer changes their own database by hand",
      "Deleting and recreating the database on each deploy",
    ],
    explanation: "Migrations make schema changes reviewable, repeatable and identical in dev, staging and production.",
  }, {
    title: "Mudar o schema",
    prompt: "Como as equipes costumam mudar o schema da base de dados (acrescentar coluna, tabela)?",
    options: [
      "Com **migrações** versionadas no repositório (ficheiros SQL rodados em ordem em cada ambiente)",
      "Clicando no painel de produção",
      "Cada dev muda a sua base à mão",
      "Apagando e recriando a base em cada deploy",
    ],
    explanation: "Migrações tornam as mudanças de schema revisáveis, repetíveis e iguais em dev, staging e produção.",
  }),
  {
    id: "sql-transaction-explain",
    kind: "concept",
    topic: "sql-transactions",
    title: "What is a transaction?",
    prompt: "**What is a database transaction and when do you need one?** Give a real example.",
    difficulty: 2,
    estimatedMin: 5,
    tags: ["interview-classic"],
    modelAnswer:
      "A transaction groups several statements so they behave as **one unit**: either all of them are committed or, if anything fails, everything is **rolled back**. That's atomicity, the A in ACID — with consistency, isolation and durability.\n\nI need one whenever a business operation writes more than one row or table and a half-done state would be wrong. For example, creating an order: insert the order, insert its items and decrease the stock. If the stock update fails, I don't want an order without stock reserved, so I wrap it in `BEGIN … COMMIT`. Another classic is moving money between two accounts.",
    rubric: ["Several statements as one unit: commit or rollback", "Atomicity / ACID", "When: multiple writes that must stay consistent", "Concrete example (order + items + stock, bank transfer)"],
    rubricKeys: [
      ["commit", "rollback", "one unit", "uma unidade", "all or nothing", "tudo ou nada", "begin"],
      ["atomic", "atomic", "acid", "isolation", "isolamento", "durab"],
      ["several", "multiple", "more than one", "varias", "mais de uma", "consisten"],
      ["for example", "por exemplo", "order", "pedido", "stock", "transfer", "account", "conta"],
    ],
    pt: {
      title: "O que é uma transação?",
      prompt: "**O que é uma transação na base de dados e quando você precisa de uma?** Dê um exemplo real.",
      modelAnswer:
        "Uma transação agrupa vários comandos para se comportarem como **uma unidade**: ou todos são confirmados (commit) ou, se algo falhar, tudo é **desfeito** (rollback). Isso é a atomicidade, o A de ACID — junto com consistência, isolamento e durabilidade.\n\nPreciso de uma sempre que uma operação de negócio escreve mais de uma linha ou tabela e um estado a meio seria errado. Por exemplo, criar um pedido: inserir o pedido, inserir os itens e baixar o stock. Se a baixa de stock falhar, não quero um pedido sem stock reservado, então envolvo tudo em `BEGIN … COMMIT`. Outro clássico é transferir dinheiro entre duas contas.",
      rubric: ["Vários comandos como uma unidade: commit ou rollback", "Atomicidade / ACID", "Quando: várias escritas que têm de ficar consistentes", "Exemplo concreto (pedido + itens + stock, transferência bancária)"],
    },
  },

  // ───────────────────────── Modelagem ─────────────────────────
  quiz("data-modeling", "model-1n-quiz", 1, 1, {
    title: "One-to-many",
    prompt: "A user has many posts; a post has one author. Where does the relationship live?",
    options: ["A `post_ids` array column in `users`", "A `user_id` foreign key column in `posts`", "A separate table `users_posts`", "In the application code only"],
    explanation: "In 1:N the foreign key goes on the **many** side (`posts.user_id`). Arrays of ids can't be enforced or joined well.",
  }, {
    title: "Um-para-muitos",
    prompt: "Um usuário tem muitos posts; um post tem um autor. Onde fica a relação?",
    options: ["Uma coluna array `post_ids` em `users`", "Uma coluna chave estrangeira `user_id` em `posts`", "Uma tabela separada `users_posts`", "Só no código da aplicação"],
    explanation: "Em 1:N a chave estrangeira fica do lado **muitos** (`posts.user_id`). Arrays de ids não podem ser garantidos nem usados bem em joins.",
  }),
  quiz("data-modeling", "model-nn-quiz", 2, 2, {
    title: "Many-to-many",
    prompt: "Students take many courses and courses have many students. Each enrollment has a `grade`. How do you model it?",
    options: [
      "`students.course_id` and `courses.student_id`",
      "A JSON column `courses` in `students`",
      "A join table `enrollments(student_id, course_id, grade)` with both foreign keys",
      "Duplicate the student row for each course",
    ],
    explanation: "N:N needs a join table. Attributes of the **relationship** (grade, enrolled_at) live there. Add a unique/composite key on (student_id, course_id).",
  }, {
    title: "Muitos-para-muitos",
    prompt: "Alunos fazem muitos cursos e cursos têm muitos alunos. Cada inscrição tem uma `grade` (nota). Como modelar?",
    options: [
      "`students.course_id` e `courses.student_id`",
      "Uma coluna JSON `courses` em `students`",
      "Uma tabela de junção `enrollments(student_id, course_id, grade)` com as duas chaves estrangeiras",
      "Duplicar a linha do aluno para cada curso",
    ],
    explanation: "N:N precisa de tabela de junção. Atributos da **relação** (nota, data de inscrição) ficam nela. Acrescente uma chave única/composta em (student_id, course_id).",
  }),
  quiz("data-modeling", "model-normalize-quiz", 2, 0, {
    title: "Duplicated data",
    prompt: "Every row of `orders` stores the customer's name, email and address. The customer changes email. What's the problem?",
    options: [
      "You must update many rows and they can get out of sync — normalize: keep customers in their own table and reference them by `customer_id`",
      "No problem, duplication makes reads faster",
      "Emails can't be changed in SQL",
      "Orders should have no customer at all",
    ],
    explanation: "Normalization removes duplicated facts. Exception: data that must be frozen in time, like the **shipping address at purchase time**, is copied on purpose.",
  }, {
    title: "Dados duplicados",
    prompt: "Cada linha de `orders` guarda o nome, email e morada do cliente. O cliente muda de email. Qual é o problema?",
    options: [
      "Tem de atualizar muitas linhas e elas podem ficar inconsistentes — normalize: clientes na sua tabela e referenciados por `customer_id`",
      "Nenhum, duplicar deixa as leituras mais rápidas",
      "Emails não podem mudar em SQL",
      "Pedidos não deviam ter cliente",
    ],
    explanation: "Normalizar remove factos duplicados. Exceção: dados que têm de ficar congelados no tempo, como a **morada de entrega no momento da compra**, são copiados de propósito.",
  }),
  quiz("data-modeling", "model-money-quiz", 2, 3, {
    title: "Storing money",
    prompt: "Which type is safest for prices like `19.99`?",
    options: ["`float`", "`text`", "`real`", "`numeric(10,2)` (or integer cents)"],
    explanation: "Floats have rounding errors (`0.1 + 0.2 ≠ 0.3`). Use exact decimals or store cents as integers.",
  }, {
    title: "Guardar dinheiro",
    prompt: "Que tipo é mais seguro para preços como `19.99`?",
    options: ["`float`", "`text`", "`real`", "`numeric(10,2)` (ou cêntimos em inteiro)"],
    explanation: "Floats têm erros de arredondamento (`0.1 + 0.2 ≠ 0.3`). Use decimais exatos ou guarde cêntimos como inteiros.",
  }),
  quiz("data-modeling", "model-uuid-quiz", 3, 1, {
    title: "IDs in URLs",
    prompt: "Your URLs look like `/invoices/1042`. A user changes it to `/invoices/1043`. Besides fixing authorization, what helps?",
    options: ["Nothing else matters", "Non-guessable ids (UUIDs) for public URLs — but authorization is still required", "Hiding the URL bar", "Sorting invoices randomly"],
    explanation: "Sequential ids leak counts and invite guessing. UUIDs make it harder — but they're **not** security; the ownership check is.",
  }, {
    title: "IDs nas URLs",
    prompt: "As suas URLs são como `/invoices/1042`. Um usuário troca para `/invoices/1043`. Além de corrigir a autorização, o que ajuda?",
    options: ["Mais nada importa", "Ids difíceis de adivinhar (UUIDs) em URLs públicas — mas a autorização continua obrigatória", "Esconder a barra de endereço", "Ordenar as faturas ao acaso"],
    explanation: "Ids sequenciais revelam contagens e convidam a adivinhar. UUIDs dificultam — mas **não** são segurança; a verificação do dono é.",
  }),

  // ───────────────────────── Índices e performance ─────────────────────────
  quiz("db-indexes", "idx-what-quiz", 1, 2, {
    title: "What is an index?",
    prompt: "What does an index on `orders(user_id)` do?",
    options: ["Sorts the table on disk forever", "Makes every query faster", "Keeps a separate sorted structure (B-tree) so lookups by `user_id` don't scan the whole table", "Prevents duplicate user_ids"],
    explanation: "Like a book index: jump to the rows instead of reading every page. It's not a constraint (that's `UNIQUE`).",
  }, {
    title: "O que é um índice?",
    prompt: "O que faz um índice em `orders(user_id)`?",
    options: ["Ordena a tabela no disco para sempre", "Deixa todas as queries mais rápidas", "Mantém uma estrutura ordenada separada (B-tree) para buscas por `user_id` não lerem a tabela inteira", "Impede user_ids duplicados"],
    explanation: "Como o índice de um livro: salta para as linhas em vez de ler todas as páginas. Não é uma constraint (isso é o `UNIQUE`).",
  }),
  quiz("db-indexes", "idx-cost-quiz", 2, 1, {
    title: "The cost of indexes",
    prompt: "Why not add an index on every column?",
    options: ["Postgres allows only one index per table", "Each index slows down INSERT/UPDATE/DELETE and uses storage; unused ones are pure cost", "Indexes make reads slower", "Indexes are deleted every night"],
    explanation: "Index what you filter, join and sort by often. Measure with `EXPLAIN ANALYZE`.",
  }, {
    title: "O custo dos índices",
    prompt: "Porque não pôr índice em todas as colunas?",
    options: ["O Postgres só permite um índice por tabela", "Cada índice deixa INSERT/UPDATE/DELETE mais lentos e ocupa espaço; os que não são usados são só custo", "Índices deixam as leituras mais lentas", "Os índices são apagados toda noite"],
    explanation: "Indexe o que você filtra, junta e ordena com frequência. Meça com `EXPLAIN ANALYZE`.",
  }),
  quiz("db-indexes", "idx-explain-quiz", 2, 3, {
    title: "Reading EXPLAIN",
    prompt: "`EXPLAIN ANALYZE` shows `Seq Scan on orders … rows=2 000 000` for `WHERE user_id = 7`. What does that tell you?",
    options: ["The query is optimal", "The table is empty", "There's a syntax error", "Postgres read the whole table — probably no usable index on `user_id`"],
    explanation: "A sequential scan on a big table for a selective filter is the classic sign of a missing index. After `CREATE INDEX`, expect an `Index Scan`.",
  }, {
    title: "Ler o EXPLAIN",
    prompt: "O `EXPLAIN ANALYZE` mostra `Seq Scan on orders … rows=2 000 000` para `WHERE user_id = 7`. O que isso diz?",
    options: ["A query está ótima", "A tabela está vazia", "Há um erro de sintaxe", "O Postgres leu a tabela inteira — provavelmente não há índice utilizável em `user_id`"],
    explanation: "Um scan sequencial numa tabela grande com um filtro seletivo é o sinal clássico de índice em falta. Depois do `CREATE INDEX`, espere um `Index Scan`.",
  }),
  quiz("db-indexes", "idx-composite-quiz", 3, 0, {
    title: "Composite index",
    prompt: "You have an index on `(user_id, created_at)`. Which query can use it best?",
    options: [
      "`WHERE user_id = 7 ORDER BY created_at DESC LIMIT 20`",
      "`WHERE created_at > now() - interval '1 day'` (without user_id)",
      "`WHERE total > 100`",
      "`WHERE lower(name) = 'ana'`",
    ],
    explanation: "Composite indexes work left-to-right: filter by the first column, then sort/filter by the next. Without `user_id`, the index helps little.",
  }, {
    title: "Índice composto",
    prompt: "Há um índice em `(user_id, created_at)`. Que query o usa melhor?",
    options: [
      "`WHERE user_id = 7 ORDER BY created_at DESC LIMIT 20`",
      "`WHERE created_at > now() - interval '1 day'` (sem user_id)",
      "`WHERE total > 100`",
      "`WHERE lower(name) = 'ana'`",
    ],
    explanation: "Índices compostos funcionam da esquerda para a direita: filtra pela primeira coluna e ordena/filtra pela seguinte. Sem `user_id`, o índice ajuda pouco.",
  }),
  quiz("db-indexes", "idx-n-plus-one-quiz", 3, 2, {
    title: "N+1 queries",
    prompt: "A page lists 50 posts and, in a loop, runs one query per post to fetch its author. What is this and the fix?",
    options: [
      "Normal behaviour; nothing to fix",
      "A missing index; add one on posts.id",
      "The N+1 problem — fetch authors in one query (JOIN or `WHERE id IN (…)`, or the ORM's include)",
      "A CORS problem",
    ],
    explanation: "1 query for the list + N queries for each item = slow pages. Batch it into one or two queries.",
  }, {
    title: "Queries N+1",
    prompt: "Uma página lista 50 posts e, num loop, roda uma query por post para buscar o autor. O que é isto e a correção?",
    options: [
      "Comportamento normal; não há o que corrigir",
      "Índice em falta; pôr um em posts.id",
      "O problema N+1 — buscar os autores numa query (JOIN ou `WHERE id IN (…)`, ou o include do ORM)",
      "Um problema de CORS",
    ],
    explanation: "1 query para a lista + N queries, uma por item = páginas lentas. Junte numa ou duas queries.",
  }),
  quiz("db-indexes", "idx-offset-quiz", 3, 1, {
    title: "Deep pagination",
    prompt: "`ORDER BY created_at DESC LIMIT 20 OFFSET 100000` is slow. Better approach?",
    options: [
      "Increase the LIMIT",
      "Keyset/cursor pagination: `WHERE created_at < :last_seen ORDER BY created_at DESC LIMIT 20` with an index on `created_at`",
      "Use `SELECT *`",
      "Cache every page forever",
    ],
    explanation: "OFFSET still reads and throws away 100 000 rows. A cursor jumps straight to the next page via the index.",
  }, {
    title: "Paginação profunda",
    prompt: "`ORDER BY created_at DESC LIMIT 20 OFFSET 100000` está lento. Melhor abordagem?",
    options: [
      "Aumentar o LIMIT",
      "Paginação por cursor (keyset): `WHERE created_at < :ultimo_visto ORDER BY created_at DESC LIMIT 20` com índice em `created_at`",
      "Usar `SELECT *`",
      "Guardar cada página em cache para sempre",
    ],
    explanation: "O OFFSET continua a ler e deitar fora 100 000 linhas. O cursor salta direto para a página seguinte pelo índice.",
  }),
  {
    id: "db-index-explain",
    kind: "concept",
    topic: "db-indexes",
    title: "What is an index and when would you add one?",
    prompt: "**What is a database index? When would you add one — and when not?** Mention how you'd check it helped.",
    difficulty: 2,
    estimatedMin: 5,
    tags: ["interview-classic"],
    modelAnswer:
      "An index is a separate, sorted data structure — usually a **B-tree** — that lets the database find rows by a column without scanning the whole table, like the index at the back of a book.\n\nI add one on columns used often in `WHERE`, `JOIN` and `ORDER BY`, especially foreign keys like `orders.user_id`. The trade-off is that every index **slows down writes** and uses storage, so I don't index everything or columns with very few distinct values.\n\nTo check, I run `EXPLAIN ANALYZE`: before, a slow query shows a `Seq Scan`; after `CREATE INDEX` it should show an `Index Scan` and a lower time. For example, listing a user's last orders went from a full scan to a few milliseconds with an index on `(user_id, created_at)`.",
    rubric: ["Separate sorted structure (B-tree) to avoid full scans", "When: frequent WHERE / JOIN / ORDER BY, foreign keys", "Trade-off: slower writes + storage", "Verify with EXPLAIN (Seq Scan → Index Scan)"],
    rubricKeys: [
      ["b-tree", "btree", "sorted", "ordenad", "full scan", "scan", "whole table", "tabela inteira", "book", "livro"],
      ["where", "join", "order by", "foreign key", "chave estrangeira", "user_id"],
      ["write", "insert", "escrita", "storage", "espaco", "trade-off", "tradeoff", "cost", "custo"],
      ["explain", "seq scan", "index scan", "analyze"],
    ],
    pt: {
      title: "O que é um índice e quando criar um?",
      prompt: "**O que é um índice numa base de dados? Quando você cria um — e quando não?** Diga como verificaria que ajudou.",
      modelAnswer:
        "Um índice é uma estrutura de dados separada e ordenada — normalmente uma **B-tree** — que deixa o banco encontrar linhas por uma coluna sem ler a tabela inteira, como o índice no fim de um livro.\n\nCrio um em colunas muito usadas em `WHERE`, `JOIN` e `ORDER BY`, sobretudo chaves estrangeiras como `orders.user_id`. O trade-off é que cada índice **deixa as escritas mais lentas** e ocupa espaço, por isso não indexo tudo nem colunas com pouquíssimos valores diferentes.\n\nPara verificar, rodo `EXPLAIN ANALYZE`: antes, a query lenta mostra um `Seq Scan`; depois do `CREATE INDEX` deve mostrar um `Index Scan` e um tempo menor. Por exemplo, listar os últimos pedidos de um usuário passou de um scan completo para poucos milissegundos com um índice em `(user_id, created_at)`.",
      rubric: ["Estrutura ordenada separada (B-tree) para evitar ler a tabela toda", "Quando: WHERE / JOIN / ORDER BY frequentes, chaves estrangeiras", "Trade-off: escritas mais lentas + espaço", "Verificar com EXPLAIN (Seq Scan → Index Scan)"],
    },
  },
];

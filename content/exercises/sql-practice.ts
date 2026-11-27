import type { ExerciseInput } from "@/lib/content/schema";
import { sqlEx } from "./_helpers";

/** SQL para digitar, do SELECT ao CTE e funções de janela. Datasets em content/sql/datasets.ts. */
export const exercises: ExerciseInput[] = [
  // ───────────── Básico ─────────────
  sqlEx("sql-joins", "sqlp-pt-users", 1, "shop", "SELECT name FROM users WHERE country = 'PT' ORDER BY name;", {
    title: "Users from Portugal",
    prompt: "List the **names** of users whose country is `'PT'`, in alphabetical order.",
    hints: ["`SELECT name FROM users WHERE …`", "Text uses single quotes; finish with `ORDER BY name`."],
  }, {
    title: "Usuários de Portugal",
    prompt: "Liste os **nomes** dos usuários cujo país é `'PT'`, por ordem alfabética.",
    hints: ["`SELECT name FROM users WHERE …`", "Texto usa aspas simples; termine com `ORDER BY name`."],
  }, { ordered: true, starter: "SELECT * FROM users;" }),

  sqlEx("sql-joins", "sqlp-expensive-products", 1, "shop", "SELECT name, price FROM products WHERE price > 30 ORDER BY price DESC;", {
    title: "Expensive products",
    prompt: "Show `name` and `price` of products that cost **more than 30**, most expensive first.",
    hints: ["Filter with `WHERE price > 30`.", "`ORDER BY price DESC`."],
  }, {
    title: "Produtos caros",
    prompt: "Mostre `name` e `price` dos produtos que custam **mais de 30**, do mais caro para o mais barato.",
    hints: ["Filtre com `WHERE price > 30`.", "`ORDER BY price DESC`."],
  }, { ordered: true }),

  sqlEx("sql-joins", "sqlp-null-country", 1, "shop", "SELECT name FROM users WHERE country IS NULL;", {
    title: "Missing country",
    prompt: "Which users have **no country** registered? Return their names.",
    hints: ["`= NULL` is never true in SQL.", "Use `IS NULL`."],
    explanation: "NULL means \"unknown\", so any comparison with `=` gives unknown. Always `IS NULL` / `IS NOT NULL`.",
  }, {
    title: "País em falta",
    prompt: "Que usuários **não têm país** registado? Devolva os nomes.",
    hints: ["`= NULL` nunca é verdade em SQL.", "Use `IS NULL`."],
    explanation: "NULL quer dizer \"desconhecido\", então qualquer comparação com `=` dá desconhecido. Use sempre `IS NULL` / `IS NOT NULL`.",
  }, { starter: "SELECT name FROM users WHERE country = NULL;" }),

  sqlEx("sql-joins", "sqlp-count-status", 1, "shop", "SELECT status, COUNT(*) FROM orders GROUP BY status;", {
    title: "Orders per status",
    prompt: "How many orders are there **per status**? Return `status` and the count.",
    hints: ["`COUNT(*)` with `GROUP BY status`."],
  }, {
    title: "Pedidos por status",
    prompt: "Quantos pedidos existem **por status**? Devolva `status` e a contagem.",
    hints: ["`COUNT(*)` com `GROUP BY status`."],
  }),

  // ───────────── JOINs ─────────────
  sqlEx("sql-joins", "sqlp-orders-with-names", 2, "shop", "SELECT o.id, u.name FROM orders o JOIN users u ON u.id = o.user_id WHERE o.status = 'paid' ORDER BY o.id;", {
    title: "Paid orders with customer name",
    prompt: "For each **paid** order, return the order `id` and the customer's `name`, ordered by order id.",
    hints: ["Join `orders` with `users` on `users.id = orders.user_id`.", "Filter `status = 'paid'` and `ORDER BY o.id`."],
  }, {
    title: "Pedidos pagos com o nome do cliente",
    prompt: "Para cada pedido **pago**, devolva o `id` do pedido e o `name` do cliente, ordenado pelo id do pedido.",
    hints: ["Junte `orders` com `users` em `users.id = orders.user_id`.", "Filtre `status = 'paid'` e `ORDER BY o.id`."],
  }, { ordered: true }),

  sqlEx("sql-joins", "sqlp-users-without-orders", 2, "shop", "SELECT u.name FROM users u LEFT JOIN orders o ON o.user_id = u.id WHERE o.id IS NULL;", {
    title: "Users who never ordered",
    prompt: "List the names of users who **never** placed an order.",
    hints: ["An INNER JOIN would drop them — use `LEFT JOIN`.", "Keep rows where the order side is `NULL`."],
    explanation: "LEFT JOIN keeps every user; those without a match have NULL order columns. `NOT EXISTS (SELECT 1 FROM orders WHERE user_id = u.id)` also works.",
  }, {
    title: "Usuários que nunca compraram",
    prompt: "Liste os nomes dos usuários que **nunca** fizeram um pedido.",
    hints: ["Um INNER JOIN deixava-os de fora — use `LEFT JOIN`.", "Fique com as linhas em que o lado do pedido é `NULL`."],
    explanation: "O LEFT JOIN mantém todos os usuários; quem não tem par fica com as colunas do pedido a NULL. `NOT EXISTS (SELECT 1 FROM orders WHERE user_id = u.id)` também funciona.",
  }),

  sqlEx("sql-joins", "sqlp-order-totals", 2, "shop", "SELECT order_id, SUM(quantity * unit_price) AS total FROM order_items GROUP BY order_id ORDER BY order_id;", {
    title: "Order totals",
    prompt: "Calculate the **total of each order** from `order_items` (quantity × unit_price). Return `order_id` and `total`, ordered by `order_id`.",
    hints: ["`SUM(quantity * unit_price)`", "`GROUP BY order_id`"],
  }, {
    title: "Total de cada pedido",
    prompt: "Calcule o **total de cada pedido** a partir de `order_items` (quantity × unit_price). Devolva `order_id` e `total`, ordenado por `order_id`.",
    hints: ["`SUM(quantity * unit_price)`", "`GROUP BY order_id`"],
  }, { ordered: true }),

  sqlEx("sql-joins", "sqlp-spent-per-user", 2, "shop", "SELECT u.name, SUM(oi.quantity * oi.unit_price) AS spent FROM users u JOIN orders o ON o.user_id = u.id JOIN order_items oi ON oi.order_id = o.id WHERE o.status = 'paid' GROUP BY u.id, u.name ORDER BY spent DESC;", {
    title: "Who spent the most",
    prompt: "How much did each customer spend on **paid** orders? Return `name` and `spent`, biggest spender first.",
    hints: ["Three tables: users → orders → order_items.", "Filter paid orders, `GROUP BY u.id, u.name`, `ORDER BY spent DESC`."],
  }, {
    title: "Quem gastou mais",
    prompt: "Quanto cada cliente gastou em pedidos **pagos**? Devolva `name` e `spent`, do que gastou mais para o que gastou menos.",
    hints: ["Três tabelas: users → orders → order_items.", "Filtre os pagos, `GROUP BY u.id, u.name`, `ORDER BY spent DESC`."],
  }, { ordered: true }),

  sqlEx("sql-joins", "sqlp-having", 2, "shop", "SELECT user_id, COUNT(*) FROM orders GROUP BY user_id HAVING COUNT(*) >= 2;", {
    title: "Repeat customers",
    prompt: "Which `user_id`s have **2 or more orders** (any status)? Return `user_id` and the number of orders.",
    hints: ["Group by user and count.", "Filtering groups needs `HAVING`, not `WHERE`."],
  }, {
    title: "Clientes que voltam",
    prompt: "Que `user_id`s têm **2 ou mais pedidos** (qualquer status)? Devolva `user_id` e o número de pedidos.",
    hints: ["Agrupe por usuário e conte.", "Filtrar grupos pede `HAVING`, não `WHERE`."],
  }),

  sqlEx("sql-joins", "sqlp-never-sold", 2, "shop", "SELECT p.name FROM products p WHERE NOT EXISTS (SELECT 1 FROM order_items oi WHERE oi.product_id = p.id);", {
    title: "Products never sold",
    prompt: "Which products have **never** been in any order? Return their names.",
    hints: ["`LEFT JOIN … IS NULL` or `NOT EXISTS`."],
  }, {
    title: "Produtos nunca vendidos",
    prompt: "Que produtos **nunca** estiveram em nenhum pedido? Devolva os nomes.",
    hints: ["`LEFT JOIN … IS NULL` ou `NOT EXISTS`."],
  }),

  sqlEx("sql-joins", "sqlp-category-revenue", 3, "shop", "SELECT p.category, SUM(oi.quantity * oi.unit_price) AS revenue FROM order_items oi JOIN products p ON p.id = oi.product_id JOIN orders o ON o.id = oi.order_id WHERE o.status = 'paid' GROUP BY p.category ORDER BY revenue DESC;", {
    title: "Revenue per category",
    prompt: "Revenue per product **category**, counting only **paid** orders. Return `category` and `revenue`, highest first.",
    hints: ["Join order_items with products (category) and orders (status).", "`GROUP BY p.category ORDER BY revenue DESC`."],
  }, {
    title: "Receita por categoria",
    prompt: "Receita por **categoria** de produto, contando só pedidos **pagos**. Devolva `category` e `revenue`, da maior para a menor.",
    hints: ["Junte order_items com products (categoria) e orders (status).", "`GROUP BY p.category ORDER BY revenue DESC`."],
  }, { ordered: true }),

  sqlEx("sql-joins", "sqlp-monthly-orders", 3, "shop", "SELECT date_trunc('month', created_at)::date AS month, COUNT(*) FROM orders GROUP BY 1 ORDER BY 1;", {
    title: "Orders per month",
    prompt: "Count orders **per month**. Return the first day of the month (as a date) and the count, oldest month first.",
    hints: ["`date_trunc('month', created_at)` gives the start of the month.", "Cast with `::date` and `GROUP BY 1 ORDER BY 1`."],
  }, {
    title: "Pedidos por mês",
    prompt: "Conte os pedidos **por mês**. Devolva o primeiro dia do mês (como data) e a contagem, do mês mais antigo para o mais recente.",
    hints: ["`date_trunc('month', created_at)` dá o início do mês.", "Converta com `::date` e `GROUP BY 1 ORDER BY 1`."],
  }, { ordered: true }),

  sqlEx("sql-joins", "sqlp-above-average", 3, "shop", "SELECT name, price FROM products WHERE price > (SELECT AVG(price) FROM products);", {
    title: "Above the average price",
    prompt: "Which products cost **more than the average price** of all products? Return `name` and `price`.",
    hints: ["A subquery can compute the average: `(SELECT AVG(price) FROM products)`."],
  }, {
    title: "Acima do preço médio",
    prompt: "Que produtos custam **mais do que o preço médio** de todos os produtos? Devolva `name` e `price`.",
    hints: ["Uma subquery calcula a média: `(SELECT AVG(price) FROM products)`."],
  }),

  sqlEx("sql-joins", "sqlp-cte-first-order", 3, "shop", "WITH firsts AS (SELECT user_id, MIN(created_at) AS first_order FROM orders GROUP BY user_id) SELECT u.name, f.first_order FROM firsts f JOIN users u ON u.id = f.user_id ORDER BY f.first_order;", {
    title: "First order of each customer (CTE)",
    prompt: "Using a **CTE** (`WITH`), return each customer's `name` and the date of their **first** order, earliest first.",
    hints: ["`WITH firsts AS (SELECT user_id, MIN(created_at) … GROUP BY user_id)`", "Then join `firsts` with `users`."],
    explanation: "A CTE names a subquery so the main query reads top to bottom — interviewers like it for readability.",
  }, {
    title: "Primeiro pedido de cada cliente (CTE)",
    prompt: "Com uma **CTE** (`WITH`), devolva o `name` de cada cliente e a data do **primeiro** pedido, do mais antigo para o mais recente.",
    hints: ["`WITH firsts AS (SELECT user_id, MIN(created_at) … GROUP BY user_id)`", "Depois junte `firsts` com `users`."],
    explanation: "Uma CTE dá nome a uma subquery para a query principal ler-se de cima para baixo — os entrevistadores gostam pela legibilidade.",
  }, { ordered: true }),

  sqlEx("sql-joins", "sqlp-rank-window", 3, "shop", "SELECT name, category, price, RANK() OVER (PARTITION BY category ORDER BY price DESC) AS rank FROM products ORDER BY category, rank;", {
    title: "Rank inside each category",
    prompt: "Rank products by price **within their category** (most expensive = 1). Return `name`, `category`, `price`, `rank`, ordered by category then rank.",
    hints: ["Window function: `RANK() OVER (PARTITION BY category ORDER BY price DESC)`.", "Window functions don't collapse rows like GROUP BY."],
    explanation: "`PARTITION BY` restarts the ranking for each category. Classic for \"top N per group\".",
  }, {
    title: "Ranking dentro de cada categoria",
    prompt: "Faça o ranking dos produtos por preço **dentro da categoria** (o mais caro = 1). Devolva `name`, `category`, `price`, `rank`, ordenado por categoria e depois rank.",
    hints: ["Função de janela: `RANK() OVER (PARTITION BY category ORDER BY price DESC)`.", "Funções de janela não juntam linhas como o GROUP BY."],
    explanation: "O `PARTITION BY` recomeça o ranking em cada categoria. Clássico para \"top N por grupo\".",
  }, { ordered: true }),

  // ───────────── Blog: N:N e contagens ─────────────
  sqlEx("data-modeling", "sqlp-comments-per-post", 2, "blog", "SELECT p.title, COUNT(c.id) AS comments FROM posts p LEFT JOIN comments c ON c.post_id = p.id WHERE p.published GROUP BY p.id, p.title ORDER BY comments DESC, p.title;", {
    title: "Comments per published post",
    prompt: "For every **published** post, return `title` and its number of comments (**0 included**), most commented first, then by title.",
    hints: ["LEFT JOIN keeps posts without comments.", "`COUNT(c.id)` counts only real comments (NULLs are ignored)."],
    explanation: "`COUNT(*)` would count 1 for posts without comments, because the LEFT JOIN still produces one row.",
  }, {
    title: "Comentários por post publicado",
    prompt: "Para cada post **publicado**, devolva o `title` e o número de comentários (**incluindo 0**), do mais comentado para o menos, depois por título.",
    hints: ["O LEFT JOIN mantém os posts sem comentários.", "`COUNT(c.id)` conta só comentários reais (os NULLs são ignorados)."],
    explanation: "O `COUNT(*)` contaria 1 para posts sem comentários, porque o LEFT JOIN ainda gera uma linha.",
  }, { ordered: true }),

  sqlEx("data-modeling", "sqlp-posts-by-tag", 2, "blog", "SELECT p.title FROM posts p JOIN post_tags pt ON pt.post_id = p.id JOIN tags t ON t.id = pt.tag_id WHERE t.name = 'sql';", {
    title: "Posts tagged 'sql'",
    prompt: "Many-to-many: list the titles of posts that have the tag **`sql`**.",
    hints: ["Go through the join table: posts → post_tags → tags.", "Filter `t.name = 'sql'`."],
  }, {
    title: "Posts com a tag 'sql'",
    prompt: "Muitos-para-muitos: liste os títulos dos posts que têm a tag **`sql`**.",
    hints: ["Passe pela tabela de junção: posts → post_tags → tags.", "Filtre `t.name = 'sql'`."],
  }),

  sqlEx("data-modeling", "sqlp-tag-counts", 2, "blog", "SELECT t.name, COUNT(pt.post_id) AS posts FROM tags t LEFT JOIN post_tags pt ON pt.tag_id = t.id GROUP BY t.id, t.name ORDER BY posts DESC, t.name;", {
    title: "Posts per tag",
    prompt: "How many posts does each tag have? Include tags with **0** posts. Return `name` and `posts`, most used first, then by name.",
    hints: ["Start from `tags` and LEFT JOIN `post_tags`.", "`COUNT(pt.post_id)`"],
  }, {
    title: "Posts por tag",
    prompt: "Quantos posts tem cada tag? Inclua tags com **0** posts. Devolva `name` e `posts`, das mais usadas para as menos, depois por nome.",
    hints: ["Comece em `tags` e faça LEFT JOIN de `post_tags`.", "`COUNT(pt.post_id)`"],
  }, { ordered: true }),

  sqlEx("data-modeling", "sqlp-active-commenters", 3, "blog", "SELECT a.name FROM authors a WHERE EXISTS (SELECT 1 FROM comments c JOIN posts p ON p.id = c.post_id WHERE c.author_id = a.id AND p.author_id <> a.id);", {
    title: "Commented on someone else's post",
    prompt: "Which authors wrote at least one comment on a post **written by someone else**? Return their names (once each).",
    hints: ["`EXISTS` with a subquery avoids duplicates.", "Join comments with posts and compare `p.author_id <> a.id`."],
  }, {
    title: "Comentou no post de outra pessoa",
    prompt: "Que autores escreveram pelo menos um comentário num post **de outra pessoa**? Devolva os nomes (uma vez cada).",
    hints: ["`EXISTS` com subquery evita duplicados.", "Junte comments com posts e compare `p.author_id <> a.id`."],
  }),
];

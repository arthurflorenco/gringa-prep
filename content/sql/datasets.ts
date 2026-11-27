/**
 * Bases de dados dos exercícios SQL (Postgres via PGlite). Pequenas e conhecidas, com casos-limite
 * de propósito: usuário sem pedidos, país NULL, pedido cancelado, post sem comentários, tag sem posts.
 */
export const DATASETS = {
  shop: {
    tables: [
      "users(id, name, country, created_at)",
      "products(id, name, category, price)",
      "orders(id, user_id → users, status, created_at)",
      "order_items(order_id → orders, product_id → products, quantity, unit_price)",
    ],
    sql: `
CREATE TABLE users (id int PRIMARY KEY, name text NOT NULL, country text, created_at date NOT NULL);
CREATE TABLE products (id int PRIMARY KEY, name text NOT NULL, category text NOT NULL, price numeric(10,2) NOT NULL);
CREATE TABLE orders (id int PRIMARY KEY, user_id int NOT NULL REFERENCES users(id), status text NOT NULL, created_at date NOT NULL);
CREATE TABLE order_items (order_id int REFERENCES orders(id), product_id int REFERENCES products(id), quantity int NOT NULL, unit_price numeric(10,2) NOT NULL, PRIMARY KEY (order_id, product_id));
INSERT INTO users VALUES
 (1,'Ana','PT','2025-01-10'),(2,'Bruno','BR','2025-02-03'),(3,'Carla','PT','2025-02-20'),(4,'Diego','ES','2025-03-15'),
 (5,'Eva','DE','2025-04-01'),(6,'Felipe','BR','2025-05-12'),(7,'Gabi',NULL,'2025-06-30'),(8,'Hugo','PT','2025-07-07');
INSERT INTO products VALUES
 (1,'Coffee beans','food',12.50),(2,'Mug','home',8.00),(3,'Laptop stand','office',45.00),(4,'Notebook','office',4.50),
 (5,'Headphones','tech',89.90),(6,'Keyboard','tech',59.00),(7,'Tea','food',6.00),(8,'Desk lamp','home',32.00),
 (9,'Monitor arm','office',27.00),(10,'Webcam','tech',49.00);
INSERT INTO orders VALUES
 (1,1,'paid','2025-03-01'),(2,1,'paid','2025-04-12'),(3,2,'paid','2025-04-15'),(4,3,'cancelled','2025-05-02'),
 (5,3,'paid','2025-05-20'),(6,4,'paid','2025-06-01'),(7,5,'pending','2025-06-18'),(8,2,'paid','2025-07-04'),
 (9,6,'paid','2025-07-21'),(10,1,'paid','2025-08-09'),(11,8,'pending','2025-08-30'),(12,4,'paid','2025-09-14');
INSERT INTO order_items VALUES
 (1,1,2,12.50),(1,2,1,8.00),(2,5,1,89.90),(3,3,1,45.00),(3,4,3,4.50),(4,6,1,59.00),(5,7,4,6.00),(5,2,2,8.00),
 (6,6,1,59.00),(6,8,1,32.00),(7,1,1,12.50),(8,5,1,89.90),(8,7,2,6.00),(9,3,2,45.00),(10,4,5,4.50),(10,1,1,12.50),
 (11,2,1,8.00),(12,5,1,89.90),(12,6,1,59.00);`,
  },
  blog: {
    tables: [
      "authors(id, name)",
      "posts(id, author_id → authors, title, published, created_at)",
      "comments(id, post_id → posts, author_id → authors, body)",
      "tags(id, name)",
      "post_tags(post_id → posts, tag_id → tags)",
    ],
    sql: `
CREATE TABLE authors (id int PRIMARY KEY, name text NOT NULL);
CREATE TABLE posts (id int PRIMARY KEY, author_id int NOT NULL REFERENCES authors(id), title text NOT NULL, published boolean NOT NULL, created_at date NOT NULL);
CREATE TABLE comments (id int PRIMARY KEY, post_id int NOT NULL REFERENCES posts(id), author_id int NOT NULL REFERENCES authors(id), body text NOT NULL);
CREATE TABLE tags (id int PRIMARY KEY, name text NOT NULL UNIQUE);
CREATE TABLE post_tags (post_id int REFERENCES posts(id), tag_id int REFERENCES tags(id), PRIMARY KEY (post_id, tag_id));
INSERT INTO authors VALUES (1,'Ana'),(2,'Bruno'),(3,'Carla'),(4,'Diego');
INSERT INTO posts VALUES
 (1,1,'Intro to SQL',true,'2025-01-05'),(2,1,'JOINs explained',true,'2025-02-10'),(3,2,'React hooks',true,'2025-02-18'),
 (4,2,'Draft: Next.js',false,'2025-03-01'),(5,3,'RLS in Supabase',true,'2025-03-22'),(6,1,'Indexes',true,'2025-04-02');
INSERT INTO comments VALUES
 (1,1,2,'Great intro!'),(2,1,3,'Thanks'),(3,2,3,'Very clear'),(4,2,2,'Bookmarked'),(5,2,4,'More examples?'),
 (6,3,1,'Nice'),(7,5,1,'Super useful'),(8,5,2,'Thanks Carla');
INSERT INTO tags VALUES (1,'sql'),(2,'react'),(3,'security'),(4,'career');
INSERT INTO post_tags VALUES (1,1),(2,1),(3,2),(4,2),(5,1),(5,3),(6,1);`,
  },
} as const;

export type DatasetName = keyof typeof DATASETS;

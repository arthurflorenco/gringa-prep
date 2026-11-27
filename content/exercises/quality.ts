import type { ExerciseInput } from "@/lib/content/schema";
import { quiz } from "./_helpers";

/** Testes, decisões técnicas (trade-offs) e soft delete / auditoria — nível júnior/mid. */
export const exercises: ExerciseInput[] = [
  // ───────────── testing ─────────────
  quiz("testing", "test-unit-quiz", 1, 1, {
    title: "Unit test",
    prompt: "Which is a **unit** test?",
    options: ["Clicking through the checkout in a real browser", "Calling `calculateDiscount(100, 'VIP')` and asserting it returns 80", "Calling the API with a real database", "Load-testing with 1 000 users"],
    explanation: "Unit = one piece of logic in isolation, fast, no network/DB. Pure functions are the easiest to unit-test.",
  }, {
    title: "Teste unitário",
    prompt: "Qual destes é um teste **unitário**?",
    options: ["Clicar no checkout num navegador real", "Chamar `calculateDiscount(100, 'VIP')` e verificar que devolve 80", "Chamar a API com uma base de dados real", "Teste de carga com 1 000 usuários"],
    explanation: "Unitário = uma peça de lógica isolada, rápida, sem rede/banco. Funções puras são as mais fáceis de testar.",
  }),
  quiz("testing", "test-integration-quiz", 2, 2, {
    title: "Integration test",
    prompt: "You want to be sure `POST /orders` validates input, saves to the database and returns 201. Which test?",
    options: ["A unit test with everything mocked", "A visual snapshot", "An integration test: call the endpoint against a test database and check the response and the saved row", "A manual test once"],
    explanation: "Integration tests catch problems between pieces (SQL, validation, serialization) that unit tests with mocks hide.",
  }, {
    title: "Teste de integração",
    prompt: "Você quer ter certeza de que `POST /orders` valida, guarda na base e devolve 201. Que teste?",
    options: ["Um teste unitário com tudo mockado", "Um snapshot visual", "Um teste de integração: chamar o endpoint com uma base de teste e verificar a resposta e a linha guardada", "Um teste manual uma vez"],
    explanation: "Testes de integração apanham problemas entre as peças (SQL, validação, serialização) que os testes unitários com mocks escondem.",
  }),
  quiz("testing", "test-e2e-quiz", 2, 0, {
    title: "End-to-end test",
    prompt: "What's an e2e test good for, and what's its cost?",
    options: ["Testing a real user journey (login → buy) in a browser; slower and more fragile, so keep few of them for critical flows", "Testing one function quickly", "Replacing all other tests", "Measuring code coverage"],
    explanation: "Tools like Playwright run a real browser. Use them for the flows that must never break.",
  }, {
    title: "Teste end-to-end",
    prompt: "Para que serve um teste e2e, e qual é o custo?",
    options: ["Testar uma jornada real do usuário (login → compra) num navegador; mais lento e frágil, então tenha poucos, para os fluxos críticos", "Testar uma função rapidamente", "Substituir todos os outros testes", "Medir a cobertura de código"],
    explanation: "Ferramentas como o Playwright rodam um navegador real. Use-as para os fluxos que nunca podem quebrar.",
  }),
  quiz("testing", "test-aaa-quiz", 1, 3, {
    title: "Structure of a test",
    prompt: "What is the Arrange–Act–Assert pattern?",
    options: ["A way to name branches", "A CI tool", "A mocking library", "Set up the data → run the thing being tested → check the result; one behaviour per test"],
    explanation: "Readable tests are documentation. A good name says the behaviour: `returns 404 when the order belongs to another user`.",
  }, {
    title: "Estrutura de um teste",
    prompt: "O que é o padrão Arrange–Act–Assert?",
    options: ["Uma forma de nomear branches", "Uma ferramenta de CI", "Uma biblioteca de mocks", "Preparar os dados → executar o que se testa → verificar o resultado; um comportamento por teste"],
    explanation: "Testes legíveis são documentação. Um bom nome diz o comportamento: `devolve 404 quando o pedido é de outro usuário`.",
  }),
  quiz("testing", "test-mock-quiz", 2, 1, {
    title: "When to mock",
    prompt: "Your function charges a card with Stripe and then sends an email. In a unit test, what do you mock?",
    options: ["Everything, including your own logic", "The external services (Stripe, email) — and assert they were called with the right data", "Nothing; call the real Stripe", "Only the database"],
    explanation: "Mock what you don't own or what is slow/unsafe. Over-mocking your own code makes tests pass while the app is broken.",
  }, {
    title: "Quando usar mocks",
    prompt: "A sua função cobra um cartão com o Stripe e depois envia um email. Num teste unitário, o que você mocka?",
    options: ["Tudo, incluindo a sua lógica", "Os serviços externos (Stripe, email) — e verifica que foram chamados com os dados certos", "Nada; chama o Stripe de verdade", "Só a base de dados"],
    explanation: "Faça mock do que não é seu ou do que é lento/inseguro. Mockar demais o seu código faz os testes passarem com a app quebrada.",
  }),
  quiz("testing", "test-coverage-quiz", 2, 2, {
    title: "100% coverage",
    prompt: "The project has 100% line coverage. Does that mean it has no bugs?",
    options: ["Yes", "Yes, if CI is green", "No — coverage shows code was executed, not that the right things were asserted or that edge cases were tried", "Only for TypeScript projects"],
    explanation: "Coverage is a hint of what is **not** tested. Assertions and edge cases are what matter.",
  }, {
    title: "100% de cobertura",
    prompt: "O projeto tem 100% de cobertura de linhas. Isso quer dizer que não tem bugs?",
    options: ["Sim", "Sim, se o CI estiver verde", "Não — a cobertura mostra que o código rodou, não que se verificaram as coisas certas nem que se testaram os casos-limite", "Só em projetos TypeScript"],
    explanation: "A cobertura indica o que **não** está testado. O que importa são as verificações e os casos-limite.",
  }),
  quiz("testing", "test-bug-first-quiz", 2, 3, {
    title: "Fixing a bug",
    prompt: "A user reports that discounts are applied twice. Good engineering habit?",
    options: ["Fix it quickly and deploy", "Add a comment", "Restart the server", "First write a failing test that reproduces the bug, then fix it — the test prevents it coming back"],
    explanation: "A regression test turns a bug report into permanent protection. Interviewers love hearing this.",
  }, {
    title: "Corrigir um bug",
    prompt: "Um usuário reporta que os descontos são aplicados duas vezes. Bom hábito de engenharia?",
    options: ["Corrigir rápido e publicar", "Pôr um comentário", "Reiniciar o servidor", "Primeiro escrever um teste que falha e reproduz o bug, depois corrigir — o teste impede que volte"],
    explanation: "Um teste de regressão transforma um bug reportado em proteção permanente. Os entrevistadores adoram ouvir isto.",
  }),
  quiz("testing", "test-flaky-quiz", 3, 0, {
    title: "Flaky test",
    prompt: "A test passes locally but fails randomly in CI. Common causes?",
    options: ["Depending on time/order/randomness, real network calls, or not awaiting async work — fix the cause, don't just add retries", "CI servers are always broken", "The test file is too long", "TypeScript version"],
    explanation: "Control time (fake timers), isolate data per test, await promises, and mock the network.",
  }, {
    title: "Teste instável (flaky)",
    prompt: "Um teste passa localmente mas falha ao acaso no CI. Causas comuns?",
    options: ["Depender de hora/ordem/aleatoriedade, chamadas reais à rede, ou não esperar trabalho async — corrija a causa, não só ponha retries", "Os servidores de CI estão sempre quebrados", "O ficheiro de teste é longo demais", "A versão do TypeScript"],
    explanation: "Controle o tempo (fake timers), isole os dados por teste, faça await das promises e mocke a rede.",
  }),
  quiz("testing", "test-what-to-test-quiz", 2, 1, {
    title: "What to test first",
    prompt: "You have one day to add tests to an app with none. Where do you start?",
    options: ["Snapshot tests of every component", "The business rules and flows that would hurt most if they broke: payments, permissions, data validation", "CSS", "Third-party libraries"],
    explanation: "Test by risk. A few integration tests on critical paths give the most confidence per hour.",
  }, {
    title: "O que testar primeiro",
    prompt: "Você tem um dia para pôr testes numa app que não tem nenhum. Por onde começa?",
    options: ["Snapshots de todos os componentes", "As regras de negócio e os fluxos que mais doeriam se quebrassem: pagamentos, permissões, validação de dados", "O CSS", "Bibliotecas de terceiros"],
    explanation: "Teste por risco. Alguns testes de integração nos caminhos críticos dão mais confiança por hora.",
  }),
  quiz("testing", "test-ci-quiz", 1, 2, {
    title: "Tests in CI",
    prompt: "Why run tests in CI on every pull request?",
    options: ["To make PRs slower", "Because GitHub requires it", "So no change is merged without passing the checks — bugs are caught before main, not by users", "To generate documentation"],
    explanation: "CI = the same checks (typecheck, lint, tests, build) for everyone, automatically.",
  }, {
    title: "Testes no CI",
    prompt: "Porquê rodar os testes no CI em cada pull request?",
    options: ["Para os PRs ficarem mais lentos", "Porque o GitHub obriga", "Para nenhuma mudança entrar sem passar nas verificações — os bugs são apanhados antes da main, não pelos usuários", "Para gerar documentação"],
    explanation: "CI = as mesmas verificações (typecheck, lint, testes, build) para todos, automaticamente.",
  }),

  // ───────────── tradeoffs ─────────────
  quiz("tradeoffs", "to-build-vs-buy-quiz", 2, 2, {
    title: "Build or buy",
    prompt: "Your startup needs login with email, Google and password reset. Junior/mid answer that interviewers like?",
    options: ["Build our own auth from scratch — it's more fun", "Avoid login entirely", "Use a proven provider (Supabase Auth, Clerk, Auth.js) — auth is security-critical and not our product; build only what makes us different", "Store passwords in a spreadsheet"],
    explanation: "Trade-off: less control vs speed and security. Say what you'd gain and what you'd give up (cost, lock-in).",
  }, {
    title: "Construir ou comprar",
    prompt: "A sua startup precisa de login por email, Google e recuperação de senha. Resposta júnior/mid de que os entrevistadores gostam?",
    options: ["Construir o nosso auth do zero — é mais divertido", "Não ter login", "Usar um fornecedor comprovado (Supabase Auth, Clerk, Auth.js) — auth é crítico para a segurança e não é o nosso produto; construir só o que nos diferencia", "Guardar senhas numa folha de cálculo"],
    explanation: "Trade-off: menos controlo vs velocidade e segurança. Diga o que ganharia e o que perderia (custo, dependência do fornecedor).",
  }),
  quiz("tradeoffs", "to-sql-nosql-quiz", 2, 0, {
    title: "SQL or NoSQL",
    prompt: "A typical SaaS with users, teams, projects and invoices (lots of relations, money). Sensible default?",
    options: ["A relational database (Postgres): relations, constraints and transactions fit this data", "A document database because it's trendy", "JSON files on disk", "localStorage"],
    explanation: "Postgres is the default for most products. Choose NoSQL for a concrete reason (huge scale on simple access patterns, flexible documents), not by fashion.",
  }, {
    title: "SQL ou NoSQL",
    prompt: "Um SaaS típico com usuários, equipes, projetos e faturas (muitas relações, dinheiro). Escolha padrão sensata?",
    options: ["Uma base relacional (Postgres): relações, constraints e transações encaixam nestes dados", "Uma base de documentos porque está na moda", "Ficheiros JSON no disco", "localStorage"],
    explanation: "O Postgres é o padrão para a maioria dos produtos. Escolha NoSQL por uma razão concreta (escala enorme com acessos simples, documentos flexíveis), não por moda.",
  }),
  quiz("tradeoffs", "to-monolith-quiz", 3, 1, {
    title: "Microservices?",
    prompt: "Team of 4, new product. A colleague wants 8 microservices. Your view?",
    options: ["Yes — microservices are always better", "Start with a well-structured monolith (clear modules); split later if a real need appears (scaling, team ownership)", "Use 20 services to be safe", "No backend at all"],
    explanation: "Microservices add deploys, networking and debugging cost. For small teams the trade-off rarely pays off early.",
  }, {
    title: "Microsserviços?",
    prompt: "Equipe de 4, produto novo. Um colega quer 8 microsserviços. A sua opinião?",
    options: ["Sim — microsserviços são sempre melhores", "Começar com um monólito bem estruturado (módulos claros); separar mais tarde se aparecer uma necessidade real (escala, equipes donas)", "Usar 20 serviços por segurança", "Não ter back-end"],
    explanation: "Microsserviços acrescentam custo de deploys, rede e depuração. Para equipes pequenas o trade-off raramente compensa no início.",
  }),
  quiz("tradeoffs", "to-premature-quiz", 2, 3, {
    title: "Premature optimization",
    prompt: "Before launch, a colleague wants to add Redis caching \"in case we get traffic\". What do you ask?",
    options: ["Which Redis version?", "Can we add three caches?", "Nothing — caching is always good", "Do we have a measured problem? Caching adds complexity and stale-data bugs; ship simple, measure, then optimize the real bottleneck"],
    explanation: "Good engineers ask for evidence. Mention the cost of the solution, not only its benefit.",
  }, {
    title: "Otimização prematura",
    prompt: "Antes do lançamento, um colega quer pôr cache com Redis \"caso tenhamos tráfego\". O que pergunta?",
    options: ["Que versão do Redis?", "Podemos pôr três caches?", "Nada — cache é sempre bom", "Temos um problema medido? O cache acrescenta complexidade e bugs de dados desatualizados; lançar simples, medir, e depois otimizar o gargalo real"],
    explanation: "Bons engenheiros pedem evidência. Mencione o custo da solução, não só o benefício.",
  }),
  quiz("tradeoffs", "to-state-quiz", 2, 2, {
    title: "Where to keep state",
    prompt: "A product list has filters (category, sort, page) that users want to share by link. Where should the filter state live?",
    options: ["A global store (Redux)", "localStorage", "In the URL search params — shareable, survives refresh, works with server rendering", "A cookie"],
    explanation: "Pick state location by need: URL for shareable view state, local state for UI details, server for real data.",
  }, {
    title: "Onde guardar o state",
    prompt: "Uma lista de produtos tem filtros (categoria, ordem, página) que os usuários querem partilhar por link. Onde deve ficar o state dos filtros?",
    options: ["Numa store global (Redux)", "No localStorage", "Nos search params da URL — partilhável, sobrevive ao refresh, funciona com renderização no servidor", "Num cookie"],
    explanation: "Escolha onde fica o state pela necessidade: URL para state de vista partilhável, state local para detalhes da interface, servidor para os dados reais.",
  }),
  quiz("tradeoffs", "to-sync-async-quiz", 3, 0, {
    title: "Slow work in a request",
    prompt: "Generating a PDF report takes 40 seconds. The request times out. Better design?",
    options: ["Put the job on a queue/background worker, return `202 Accepted` with a job id, and notify or let the UI poll until it's ready", "Increase the timeout to 5 minutes", "Tell users to wait", "Generate it in the browser always"],
    explanation: "Long work doesn't belong in a request/response cycle. Background jobs + status = resilient and scalable.",
  }, {
    title: "Trabalho lento dentro de um pedido",
    prompt: "Gerar um relatório em PDF demora 40 segundos. O pedido dá timeout. Melhor desenho?",
    options: ["Pôr o trabalho numa fila/worker em segundo plano, devolver `202 Accepted` com um id do job, e notificar ou deixar a interface consultar até estar pronto", "Aumentar o timeout para 5 minutos", "Pedir aos usuários para esperar", "Gerar sempre no navegador"],
    explanation: "Trabalho longo não cabe num ciclo pedido/resposta. Jobs em segundo plano + estado = resiliente e escalável.",
  }),
  quiz("tradeoffs", "to-tech-debt-quiz", 2, 1, {
    title: "Tech debt",
    prompt: "The deadline is Friday and the clean solution needs 3 more days. A mature answer?",
    options: ["Always refuse shortcuts", "Ship a simpler version that's safe (tests on the risky part), write down the debt in a ticket with the reason, and plan to pay it back", "Ship anything and never mention it", "Miss the deadline without telling anyone"],
    explanation: "Debt is a tool when it's deliberate and visible. Never cut corners on security or data integrity.",
  }, {
    title: "Dívida técnica",
    prompt: "O prazo é sexta e a solução limpa precisa de mais 3 dias. Uma resposta madura?",
    options: ["Recusar sempre atalhos", "Entregar uma versão mais simples mas segura (testes na parte arriscada), registar a dívida num ticket com o motivo, e planear pagá-la", "Entregar qualquer coisa e nunca falar disso", "Falhar o prazo sem avisar ninguém"],
    explanation: "Dívida é uma ferramenta quando é deliberada e visível. Nunca corte caminho na segurança ou na integridade dos dados.",
  }),
  quiz("tradeoffs", "to-framework-quiz", 1, 3, {
    title: "Choosing a library",
    prompt: "Which criteria matter most when choosing a library for production?",
    options: ["Number of GitHub stars only", "The newest one", "Whatever the AI suggested", "Fits the problem, maintained (recent releases, issues answered), team knows it or can learn it, bundle size/security, and an exit path"],
    explanation: "State your criteria in interviews — it shows judgment more than the specific choice.",
  }, {
    title: "Escolher uma biblioteca",
    prompt: "Que critérios importam mais ao escolher uma biblioteca para produção?",
    options: ["Só o número de estrelas no GitHub", "A mais nova", "A que a IA sugeriu", "Resolve o problema, é mantida (releases recentes, issues respondidas), a equipe conhece ou consegue aprender, tamanho/segurança, e um plano de saída"],
    explanation: "Diga os seus critérios na entrevista — mostra mais julgamento do que a escolha em si.",
  }),
  quiz("tradeoffs", "to-ssr-cost-quiz", 3, 2, {
    title: "Rendering trade-off",
    prompt: "Every page of the blog is rendered on the server per request, and the hosting bill is high. Posts change a few times a day. Option?",
    options: ["Move everything to client-side rendering", "Buy a bigger server", "Render statically and revalidate when a post changes (or every few minutes) — CDN-fast and cheap", "Remove images"],
    explanation: "Match rendering to how often data changes. Dynamic rendering for personalized data only.",
  }, {
    title: "Trade-off de renderização",
    prompt: "Todas as páginas do blog são renderizadas no servidor a cada pedido, e a conta da hospedagem está alta. Os posts mudam algumas vezes por dia. Opção?",
    options: ["Passar tudo para renderização no cliente", "Comprar um servidor maior", "Renderizar estático e revalidar quando um post muda (ou a cada poucos minutos) — rápido como CDN e barato", "Tirar as imagens"],
    explanation: "Combine a renderização com a frequência com que os dados mudam. Renderização dinâmica só para dados personalizados.",
  }),
  quiz("tradeoffs", "to-ai-vs-rules-quiz", 2, 1, {
    title: "LLM or plain code?",
    prompt: "You need to validate that a VAT number has the right format. Use an LLM?",
    options: ["Yes, AI is more modern", "No — a deterministic rule (regex/library) is cheaper, faster, testable and always the same; use LLMs for fuzzy language tasks", "Yes, with a bigger model", "Only on weekends"],
    explanation: "Product engineers are judged on picking the simplest tool that works. LLMs shine on ambiguous text, not on exact rules.",
  }, {
    title: "LLM ou código normal?",
    prompt: "Você precisa validar que um NIF/VAT tem o formato certo. Usa um LLM?",
    options: ["Sim, IA é mais moderna", "Não — uma regra determinística (regex/biblioteca) é mais barata, rápida, testável e sempre igual; use LLMs para tarefas de linguagem vagas", "Sim, com um modelo maior", "Só ao fim de semana"],
    explanation: "Product engineers são avaliados por escolher a ferramenta mais simples que funciona. LLMs brilham em texto ambíguo, não em regras exatas.",
  }),
  {
    id: "tradeoffs-explain",
    kind: "concept",
    topic: "tradeoffs",
    title: "Tell me about a technical decision you made",
    prompt: "Very common for junior/mid: **Tell me about a technical decision you made. What were the options and the trade-offs?**",
    difficulty: 2,
    estimatedMin: 6,
    tags: ["interview-classic"],
    modelAnswer:
      "In my last project I had to decide how to handle login. The options were building it myself with JWTs or using Supabase Auth.\n\nBuilding it would give me full control, but it would take weeks and it's easy to get security wrong: password hashing, resets, sessions. Supabase Auth was ready, secure and worked with Row Level Security, but it meant depending on a provider.\n\nI chose Supabase Auth because authentication isn't what makes the product different and the deadline was tight. To reduce the lock-in, I kept all auth calls in one module. As a result, login was done in two days and I spent the time on the core features. If the product grew a lot, I'd revisit the cost.",
    rubric: ["Clear context and the decision to make", "At least two options with pros and cons (trade-offs)", "The choice and why (criteria: time, risk, cost)", "Result and what you'd watch / do differently"],
    rubricKeys: [
      ["project", "projeto", "had to decide", "decide", "decisao", "needed", "precisava"],
      ["option", "opcao", "alternative", "alternativa", "pros", "cons", "trade-off", "tradeoff", "but", "mas"],
      ["chose", "escolhi", "because", "porque", "decided", "criteria", "criterio"],
      ["result", "resultado", "as a result", "revisit", "differently", "diferente", "learned", "aprendi"],
    ],
    pt: {
      title: "Fala-me de uma decisão técnica que tomaste",
      prompt: "Muito comum para júnior/mid: **Fale de uma decisão técnica que tomou. Quais eram as opções e os trade-offs?**",
      modelAnswer:
        "No meu último projeto tive de decidir como tratar o login. As opções eram fazer eu mesmo com JWTs ou usar o Supabase Auth.\n\nFazer eu daria controlo total, mas levaria semanas e é fácil errar na segurança: hash de senhas, recuperação, sessões. O Supabase Auth estava pronto, era seguro e funcionava com Row Level Security, mas significava depender de um fornecedor.\n\nEscolhi o Supabase Auth porque a autenticação não é o que diferencia o produto e o prazo era curto. Para reduzir a dependência, deixei todas as chamadas de auth num só módulo. O resultado foi o login pronto em dois dias e usei o tempo nas funcionalidades principais. Se o produto crescesse muito, reavaliaria o custo.",
      rubric: ["Contexto claro e a decisão a tomar", "Pelo menos duas opções com prós e contras (trade-offs)", "A escolha e o porquê (critérios: tempo, risco, custo)", "Resultado e o que vigiaria / faria diferente"],
    },
  },

  // ───────────── soft-delete-audit ─────────────
  quiz("soft-delete-audit", "sd-what-quiz", 1, 2, {
    title: "Soft delete",
    prompt: "What is a soft delete?",
    options: ["Deleting slowly", "Deleting from the cache only", "Marking the row as deleted (`deleted_at = now()`) instead of removing it, and hiding it from normal queries", "Moving the row to another database"],
    explanation: "It allows undo, history and audits. The cost: every query must exclude deleted rows.",
  }, {
    title: "Soft delete",
    prompt: "O que é um soft delete?",
    options: ["Apagar devagar", "Apagar só da cache", "Marcar a linha como apagada (`deleted_at = now()`) em vez de removê-la, e escondê-la das queries normais", "Mover a linha para outra base"],
    explanation: "Permite desfazer, histórico e auditorias. O custo: todas as queries têm de excluir as linhas apagadas.",
  }),
  quiz("soft-delete-audit", "sd-filter-quiz", 2, 0, {
    title: "Forgetting the filter",
    prompt: "After adding `deleted_at`, deleted projects still appear on one page. Most robust fix?",
    options: [
      "Filter by default in one place: a view (`active_projects`), RLS policy or a repository function — not `WHERE deleted_at IS NULL` repeated everywhere",
      "Remember to add the filter next time",
      "Hard delete everything",
      "Add a comment",
    ],
    explanation: "Centralize the rule so a new query can't forget it.",
  }, {
    title: "Esquecer o filtro",
    prompt: "Depois de pôr `deleted_at`, projetos apagados ainda aparecem numa página. Correção mais robusta?",
    options: [
      "Filtrar por padrão num só lugar: uma view (`active_projects`), uma policy de RLS ou uma função de repositório — não `WHERE deleted_at IS NULL` repetido em todo lado",
      "Lembrar de pôr o filtro da próxima vez",
      "Fazer hard delete de tudo",
      "Pôr um comentário",
    ],
    explanation: "Centralize a regra para uma query nova não a poder esquecer.",
  }),
  quiz("soft-delete-audit", "sd-unique-quiz", 3, 3, {
    title: "Soft delete and UNIQUE",
    prompt: "`users.email` is UNIQUE. A user deletes their account (soft) and wants to sign up again with the same email. Problem and fix?",
    options: ["No problem", "Make emails case-insensitive", "Remove the UNIQUE constraint", "The old row still holds the email — use a partial unique index: `CREATE UNIQUE INDEX … ON users(email) WHERE deleted_at IS NULL`"],
    explanation: "Partial indexes apply a rule only to active rows. A classic soft-delete gotcha.",
  }, {
    title: "Soft delete e UNIQUE",
    prompt: "`users.email` é UNIQUE. Um usuário apaga a conta (soft) e quer registar-se de novo com o mesmo email. Problema e correção?",
    options: ["Nenhum problema", "Deixar os emails sem distinção de maiúsculas", "Tirar a constraint UNIQUE", "A linha antiga ainda tem o email — use um índice único parcial: `CREATE UNIQUE INDEX … ON users(email) WHERE deleted_at IS NULL`"],
    explanation: "Índices parciais aplicam uma regra só às linhas ativas. Uma armadilha clássica do soft delete.",
  }),
  quiz("soft-delete-audit", "sd-gdpr-quiz", 2, 1, {
    title: "GDPR and soft delete",
    prompt: "A European user asks to have their personal data erased. You only soft-delete. Is that enough?",
    options: ["Yes, they can't see it", "No — under GDPR you must really erase or anonymize personal data (keeping only what the law requires, e.g. invoices)", "Yes, if the row is hidden from admins", "Only after 10 years"],
    explanation: "Soft delete is for product features, not for legal erasure. Plan a hard-delete/anonymization path.",
  }, {
    title: "RGPD e soft delete",
    prompt: "Um usuário europeu pede para apagar os seus dados pessoais. Você só faz soft delete. Chega?",
    options: ["Sim, ele não vê", "Não — pelo RGPD tem de apagar de verdade ou anonimizar os dados pessoais (guardando só o que a lei exige, ex.: faturas)", "Sim, se a linha ficar escondida dos admins", "Só passados 10 anos"],
    explanation: "Soft delete é para funcionalidades do produto, não para apagamento legal. Tenha um caminho de hard delete/anonimização.",
  }),
  quiz("soft-delete-audit", "sd-audit-log-quiz", 2, 2, {
    title: "Audit log",
    prompt: "\"Who changed the price of this invoice, and when?\" What gives you that answer?",
    options: ["The `updated_at` column", "Server logs from last week", "An append-only audit table (`entity, entity_id, action, actor_id, before, after, created_at`) written on every change", "Asking the team"],
    explanation: "`updated_at` only says when, not who or what. Audit rows are never updated or deleted.",
  }, {
    title: "Log de auditoria",
    prompt: "\"Quem mudou o preço desta fatura, e quando?\" O que te dá essa resposta?",
    options: ["A coluna `updated_at`", "Os logs do servidor da semana passada", "Uma tabela de auditoria só de inserção (`entity, entity_id, action, actor_id, before, after, created_at`) escrita em cada mudança", "Perguntar à equipe"],
    explanation: "O `updated_at` só diz quando, não quem nem o quê. Linhas de auditoria nunca são atualizadas nem apagadas.",
  }),
  quiz("soft-delete-audit", "sd-audit-where-quiz", 3, 0, {
    title: "Where to write the audit",
    prompt: "Where is the most reliable place to write audit rows?",
    options: [
      "In the same transaction as the change (or a database trigger), so a change can't happen without its audit record",
      "In the React component after the request succeeds",
      "In a nightly script",
      "In localStorage",
    ],
    explanation: "If the audit is written separately, a crash between the two leaves a change without a record.",
  }, {
    title: "Onde escrever a auditoria",
    prompt: "Qual é o lugar mais confiável para escrever as linhas de auditoria?",
    options: [
      "Na mesma transação da mudança (ou num trigger do banco), para não haver mudança sem o seu registo",
      "No componente React depois de o pedido dar certo",
      "Num script noturno",
      "No localStorage",
    ],
    explanation: "Se a auditoria for escrita à parte, uma falha entre as duas deixa uma mudança sem registo.",
  }),
  quiz("soft-delete-audit", "sd-restore-quiz", 1, 3, {
    title: "Undo",
    prompt: "The product team wants an \"Undo\" for 30 days after a project is deleted. Which approach fits?",
    options: ["Hard delete + backups", "Ask users to be careful", "Copy the project to an email", "Soft delete with `deleted_at`, a \"Restore\" action that sets it back to NULL, and a job that hard-deletes after 30 days"],
    explanation: "Soft delete + scheduled purge gives undo without keeping data forever.",
  }, {
    title: "Desfazer",
    prompt: "A equipe de produto quer um \"Desfazer\" durante 30 dias depois de apagar um projeto. Que abordagem encaixa?",
    options: ["Hard delete + backups", "Pedir aos usuários para terem cuidado", "Copiar o projeto para um email", "Soft delete com `deleted_at`, uma ação \"Restaurar\" que o volta a NULL, e um job que faz hard delete depois de 30 dias"],
    explanation: "Soft delete + limpeza agendada dá o desfazer sem guardar dados para sempre.",
  }),
  quiz("soft-delete-audit", "sd-cascade-children-quiz", 3, 1, {
    title: "Children of a soft-deleted row",
    prompt: "A project is soft-deleted. Its tasks still show up in \"My tasks\". Why?",
    options: ["A cache bug", "Soft delete doesn't cascade like `ON DELETE CASCADE`: queries for tasks must also exclude tasks whose project is deleted (join/filter or a view)", "Tasks are always global", "Postgres ignores deleted_at"],
    explanation: "Decide the rule for children explicitly — hide them via the parent, or soft-delete them in the same transaction.",
  }, {
    title: "Filhos de uma linha com soft delete",
    prompt: "Um projeto levou soft delete. As tarefas dele continuam a aparecer em \"Minhas tarefas\". Porquê?",
    options: ["Um bug de cache", "O soft delete não propaga como o `ON DELETE CASCADE`: as queries de tarefas também têm de excluir as tarefas de projetos apagados (join/filtro ou uma view)", "As tarefas são sempre globais", "O Postgres ignora o deleted_at"],
    explanation: "Decida explicitamente a regra para os filhos — esconder via o pai, ou fazer soft delete deles na mesma transação.",
  }),
  quiz("soft-delete-audit", "sd-audit-pii-quiz", 3, 2, {
    title: "What not to put in the audit log",
    prompt: "Your audit table stores `before` and `after` JSON of every change, including the users table. What should you be careful with?",
    options: ["JSON is too slow", "Audit logs can't use JSON", "Sensitive data: never store password hashes, tokens or full card numbers; minimize personal data and set retention", "Nothing, more data is better"],
    explanation: "An audit log full of secrets becomes the most valuable table to steal.",
  }, {
    title: "O que não pôr no log de auditoria",
    prompt: "A sua tabela de auditoria guarda o JSON `before` e `after` de cada mudança, incluindo a tabela de usuários. Com o que deve ter cuidado?",
    options: ["JSON é lento demais", "Logs de auditoria não podem usar JSON", "Dados sensíveis: nunca guardar hashes de senha, tokens ou números de cartão completos; minimizar dados pessoais e definir retenção", "Nada, mais dados é melhor"],
    explanation: "Um log de auditoria cheio de segredos vira a tabela mais valiosa para roubar.",
  }),
  quiz("tradeoffs", "to-consistency-quiz", 3, 2, {
    title: "Consistency vs simplicity",
    prompt: "After an order is paid you must update stock, send an email and notify the warehouse API. The warehouse API is sometimes down. Reasonable design?",
    options: ["Do all three in the request and fail the payment if the warehouse is down", "Skip the warehouse", "Commit the order + stock in a transaction, then send the email and warehouse call as background jobs with retries", "Call the warehouse first, before charging"],
    explanation: "Keep the critical, local part atomic; make the slow or unreliable external calls asynchronous and retryable.",
  }, {
    title: "Consistência vs simplicidade",
    prompt: "Depois de um pedido ser pago tem de atualizar o stock, enviar um email e avisar a API do armazém. A API do armazém às vezes está em baixo. Desenho razoável?",
    options: ["Fazer as três coisas no pedido e falhar o pagamento se o armazém estiver em baixo", "Ignorar o armazém", "Gravar pedido + stock numa transação e depois enviar o email e a chamada ao armazém como jobs em segundo plano com retries", "Chamar o armazém primeiro, antes de cobrar"],
    explanation: "Mantenha atómica a parte crítica e local; torne assíncronas e repetíveis as chamadas externas lentas ou instáveis.",
  }),
  quiz("soft-delete-audit", "sd-vs-archive-quiz", 2, 1, {
    title: "Archive or delete?",
    prompt: "Users want to hide finished projects but still see them in reports. Is that a delete?",
    options: ["Yes, hard delete", "No — it's a different state (`archived_at` / `status = 'archived'`), visible in reports, hidden from the main list", "Yes, soft delete", "Move them to a CSV"],
    explanation: "Model the real business states. Mixing \"archived\" with \"deleted\" leads to confusing filters later.",
  }, {
    title: "Arquivar ou apagar?",
    prompt: "Os usuários querem esconder projetos terminados mas continuar a vê-los nos relatórios. Isso é apagar?",
    options: ["Sim, hard delete", "Não — é outro estado (`archived_at` / `status = 'archived'`), visível nos relatórios e escondido da lista principal", "Sim, soft delete", "Passar para um CSV"],
    explanation: "Modele os estados reais do negócio. Misturar \"arquivado\" com \"apagado\" dá filtros confusos mais tarde.",
  }),
  quiz("soft-delete-audit", "sd-who-quiz", 1, 0, {
    title: "deleted_by",
    prompt: "Besides `deleted_at`, why store `deleted_by`?",
    options: ["To know who deleted it — support, audits and restoring with context", "It's required by Postgres", "To make deletes faster", "It replaces authentication"],
    explanation: "\"When\" and \"who\" are the first two questions in any incident.",
  }, {
    title: "deleted_by",
    prompt: "Além do `deleted_at`, porquê guardar `deleted_by`?",
    options: ["Para saber quem apagou — suporte, auditorias e restaurar com contexto", "O Postgres obriga", "Para os deletes serem mais rápidos", "Substitui a autenticação"],
    explanation: "\"Quando\" e \"quem\" são as duas primeiras perguntas em qualquer incidente.",
  }),
];

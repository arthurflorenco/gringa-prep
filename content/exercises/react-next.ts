import type { ExerciseInput } from "@/lib/content/schema";
import { quiz } from "./_helpers";

/** React (componentes, estado, hooks) e Next.js (App Router, renderização, dados). */
export const exercises: ExerciseInput[] = [
  // ───────────────────────── React ─────────────────────────
  quiz("react-hooks", "react-props-state-quiz", 1, 1, {
    title: "Props vs state",
    prompt: "What's the difference between **props** and **state**?",
    options: ["They are the same thing", "Props come from the parent and are read-only; state belongs to the component and changes over time with `setState`", "State comes from the parent; props are local", "Props are only for strings"],
    explanation: "Data flows down via props. When something must change (input text, open/closed), the component that owns it keeps it in state.",
  }, {
    title: "Props vs state",
    prompt: "Qual a diferença entre **props** e **state**?",
    options: ["São a mesma coisa", "Props vêm do pai e são só de leitura; o state pertence ao componente e muda com o tempo via `setState`", "O state vem do pai; as props são locais", "Props só servem para strings"],
    explanation: "Os dados descem via props. Quando algo precisa mudar (texto do input, aberto/fechado), o componente dono guarda isso no state.",
  }),
  quiz("react-hooks", "react-setstate-batch-quiz", 3, 0, {
    title: "Three setCount calls",
    prompt: "```jsx\nconst [count, setCount] = useState(0);\nfunction handleClick() {\n  setCount(count + 1);\n  setCount(count + 1);\n  setCount(count + 1);\n}\n```\nAfter one click, what is `count`?",
    options: ["1", "3", "0", "It throws"],
    explanation: "`count` is the value from **this** render (0) in all three calls, so each sets 1. To add 3, use the updater: `setCount(c => c + 1)` three times.",
  }, {
    title: "Três setCount",
    prompt: "```jsx\nconst [count, setCount] = useState(0);\nfunction handleClick() {\n  setCount(count + 1);\n  setCount(count + 1);\n  setCount(count + 1);\n}\n```\nDepois de um clique, quanto vale `count`?",
    options: ["1", "3", "0", "Dá erro"],
    explanation: "`count` é o valor **deste** render (0) nas três chamadas, então cada uma define 1. Para somar 3, use o updater: `setCount(c => c + 1)` três vezes.",
  }),
  quiz("react-hooks", "react-state-mutation-quiz", 2, 2, {
    title: "Why no re-render?",
    prompt: "```jsx\nconst [user, setUser] = useState({ name: 'Ana' });\nfunction rename() {\n  user.name = 'Bia';\n  setUser(user);\n}\n```\nThe screen doesn't update. Why?",
    options: ["`setUser` only works with strings", "Objects can't be in state", "You mutated the same object, so React sees the same reference and skips the update — use `setUser({ ...user, name: 'Bia' })`", "You need `useEffect`"],
    explanation: "React compares state by reference (`Object.is`). Always create new objects/arrays when updating.",
  }, {
    title: "Porque não re-renderiza?",
    prompt: "```jsx\nconst [user, setUser] = useState({ name: 'Ana' });\nfunction rename() {\n  user.name = 'Bia';\n  setUser(user);\n}\n```\nA tela não atualiza. Porquê?",
    options: ["`setUser` só funciona com strings", "Objetos não podem ir para o state", "Você mudou o mesmo objeto, então o React vê a mesma referência e ignora — use `setUser({ ...user, name: 'Bia' })`", "Falta um `useEffect`"],
    explanation: "O React compara o state por referência (`Object.is`). Crie sempre objetos/arrays novos ao atualizar.",
  }),
  quiz("react-hooks", "react-derived-state-quiz", 3, 3, {
    title: "Derived state",
    prompt: "You have `items` in state and want to show `total`. Best approach?",
    options: [
      "A second state `total` updated in a `useEffect` when items change",
      "Store `total` in localStorage",
      "Recalculate it in a `setInterval`",
      "Compute it during render: `const total = items.reduce((s, i) => s + i.price, 0)`",
    ],
    explanation: "If it can be calculated from props/state, don't store it. Extra state + effect = an extra render and bugs when they get out of sync. Use `useMemo` only if it's expensive.",
  }, {
    title: "State derivado",
    prompt: "Você tem `items` no state e quer mostrar o `total`. Melhor abordagem?",
    options: [
      "Um segundo state `total` atualizado num `useEffect` quando os items mudam",
      "Guardar o `total` no localStorage",
      "Recalcular num `setInterval`",
      "Calcular durante o render: `const total = items.reduce((s, i) => s + i.price, 0)`",
    ],
    explanation: "Se dá para calcular a partir de props/state, não guarde. State extra + effect = um render a mais e bugs quando ficam dessincronizados. Use `useMemo` só se for caro.",
  }),
  quiz("react-hooks", "react-effect-loop-quiz", 3, 1, {
    title: "Infinite loop",
    prompt: "```jsx\nuseEffect(() => {\n  setFilters({ ...filters, page: 1 });\n}, [filters]);\n```\nWhat happens?",
    options: ["It runs once", "An infinite loop: each run creates a new `filters` object, which changes the dependency and runs the effect again", "It never runs", "React ignores objects in dependencies"],
    explanation: "Setting state that is also a dependency re-triggers the effect forever. Usually the fix is to do it in the event handler that changed the filters.",
  }, {
    title: "Loop infinito",
    prompt: "```jsx\nuseEffect(() => {\n  setFilters({ ...filters, page: 1 });\n}, [filters]);\n```\nO que acontece?",
    options: ["Roda uma vez", "Um loop infinito: cada execução cria um objeto `filters` novo, que muda a dependência e roda o effect de novo", "Nunca roda", "O React ignora objetos nas dependências"],
    explanation: "Definir um state que também é dependência dispara o effect para sempre. Normalmente a correção é fazer isso no event handler que mudou os filtros.",
  }),
  quiz("react-hooks", "react-cleanup-quiz", 2, 0, {
    title: "Effect cleanup",
    prompt: "An effect starts `setInterval`. What happens if you don't return a cleanup?",
    options: ["The interval keeps running after the component unmounts (and a new one starts on each re-run) — return `() => clearInterval(id)`", "React clears it automatically", "The interval only runs once", "Nothing, intervals are paused when hidden"],
    explanation: "Subscriptions, timers and listeners must be cleaned up in the function the effect returns.",
  }, {
    title: "Limpeza do effect",
    prompt: "Um effect inicia um `setInterval`. O que acontece se você não devolver uma função de limpeza?",
    options: ["O intervalo continua a rodar depois de o componente sair da tela (e um novo começa a cada re-execução) — devolva `() => clearInterval(id)`", "O React limpa sozinho", "O intervalo só roda uma vez", "Nada, intervalos pausam quando escondidos"],
    explanation: "Subscrições, timers e listeners têm de ser limpos na função que o effect devolve.",
  }),
  quiz("react-hooks", "react-controlled-quiz", 2, 2, {
    title: "Controlled input",
    prompt: "What makes an input **controlled** in React?",
    options: ["It has a `name` attribute", "It's inside a `<form>`", "Its `value` comes from state and `onChange` updates that state", "It uses `useRef`"],
    explanation: "The state is the single source of truth. `useRef` / `defaultValue` gives an **uncontrolled** input (the DOM keeps the value).",
  }, {
    title: "Input controlado",
    prompt: "O que torna um input **controlado** no React?",
    options: ["Ter um atributo `name`", "Estar dentro de um `<form>`", "O `value` vem do state e o `onChange` atualiza esse state", "Usar `useRef`"],
    explanation: "O state é a única fonte da verdade. `useRef` / `defaultValue` dão um input **não controlado** (o DOM guarda o valor).",
  }),
  quiz("react-hooks", "react-lifting-state-quiz", 2, 3, {
    title: "Sharing state",
    prompt: "Two sibling components need the same `selectedId`. What's the standard React solution?",
    options: ["Each keeps its own copy and syncs with useEffect", "Use a global variable", "Store it in the URL only", "Lift the state up to the closest common parent and pass it down via props"],
    explanation: "Lift state up. If many distant components need it, then Context or a store (Zustand) — or the URL for shareable state.",
  }, {
    title: "Partilhar state",
    prompt: "Dois componentes irmãos precisam do mesmo `selectedId`. Qual é a solução padrão do React?",
    options: ["Cada um guarda a sua cópia e sincroniza com useEffect", "Usar uma variável global", "Guardar só na URL", "Subir o state para o pai comum mais próximo e passar via props"],
    explanation: "Suba o state (lifting state up). Se muitos componentes distantes precisam, então Context ou uma store (Zustand) — ou a URL para state partilhável.",
  }),
  quiz("react-hooks", "react-hooks-rules-quiz", 2, 1, {
    title: "Rules of hooks",
    prompt: "Which code breaks the rules of hooks?",
    options: [
      "`const [a, setA] = useState(0)` at the top of the component",
      "`if (isOpen) { const [x, setX] = useState(0) }`",
      "A custom hook `useUser()` that calls `useEffect`",
      "Calling `useMemo` before the return",
    ],
    explanation: "Hooks must be called in the same order on every render: top level only — never inside conditions, loops or after an early return.",
  }, {
    title: "Regras dos hooks",
    prompt: "Que código quebra as regras dos hooks?",
    options: [
      "`const [a, setA] = useState(0)` no topo do componente",
      "`if (isOpen) { const [x, setX] = useState(0) }`",
      "Um hook próprio `useUser()` que chama `useEffect`",
      "Chamar `useMemo` antes do return",
    ],
    explanation: "Os hooks têm de ser chamados na mesma ordem em todos os renders: só no topo — nunca dentro de condições, loops ou depois de um return antecipado.",
  }),
  quiz("react-hooks", "react-fetch-quiz", 3, 2, {
    title: "Fetching data",
    prompt: "In a client component you fetch data in `useEffect`. Which problem is real and what's the common fix?",
    options: [
      "Effects can't call fetch",
      "Data fetched in effects is always cached",
      "Race conditions and no caching/loading handling out of the box — use a library like TanStack Query (or fetch on the server in Next.js)",
      "It only works with axios",
    ],
    explanation: "Fast typing can make an old response arrive last; you also re-implement loading, errors, cache and retries. Server Components or TanStack Query solve most of it.",
  }, {
    title: "Buscar dados",
    prompt: "Num componente cliente você busca dados num `useEffect`. Que problema é real e qual a correção habitual?",
    options: [
      "Effects não podem chamar fetch",
      "Dados buscados em effects ficam sempre em cache",
      "Race conditions e nada de cache/loading pronto — usar uma biblioteca como TanStack Query (ou buscar no servidor no Next.js)",
      "Só funciona com axios",
    ],
    explanation: "Digitar rápido pode fazer uma resposta antiga chegar por último; você também reimplementa loading, erros, cache e retries. Server Components ou TanStack Query resolvem quase tudo.",
  }),

  // ───────────────────────── Next.js ─────────────────────────
  quiz("nextjs-rendering", "next-use-client-quiz", 2, 2, {
    title: "When to add 'use client'",
    prompt: "Which component **needs** `'use client'` in the App Router?",
    options: ["A component that reads from the database", "A layout with static text", "A like button with `useState` and `onClick`", "A page that fetches data with `await`"],
    explanation: "Components are Server Components by default. Add `'use client'` only where you need state, effects, event handlers or browser APIs — keep it at the leaves.",
  }, {
    title: "Quando pôr 'use client'",
    prompt: "Que componente **precisa** de `'use client'` no App Router?",
    options: ["Um componente que lê da base de dados", "Um layout com texto estático", "Um botão de like com `useState` e `onClick`", "Uma página que busca dados com `await`"],
    explanation: "Os componentes são Server Components por padrão. Ponha `'use client'` só onde precisa de state, effects, eventos ou APIs do navegador — o mais nas folhas possível.",
  }),
  quiz("nextjs-rendering", "next-server-secret-quiz", 3, 0, {
    title: "Secrets in components",
    prompt: "A Server Component uses `process.env.STRIPE_SECRET_KEY`. Is the key sent to the browser?",
    options: ["No — Server Component code runs only on the server; only the rendered result is sent", "Yes, all env vars are bundled", "Only in production", "Yes, unless you encrypt it"],
    explanation: "Server-only code never ships. In **client** components, only `NEXT_PUBLIC_` variables are available — and those are public. Mark sensitive modules with `import 'server-only'`.",
  }, {
    title: "Segredos em componentes",
    prompt: "Um Server Component usa `process.env.STRIPE_SECRET_KEY`. A chave é enviada para o navegador?",
    options: ["Não — o código do Server Component só roda no servidor; só o resultado renderizado é enviado", "Sim, todas as variáveis de ambiente vão no bundle", "Só em produção", "Sim, a não ser que você a encripte"],
    explanation: "Código só do servidor nunca é enviado. Em componentes **cliente**, só existem as variáveis `NEXT_PUBLIC_` — e essas são públicas. Marque módulos sensíveis com `import 'server-only'`.",
  }),
  quiz("nextjs-rendering", "next-ssg-ssr-csr-quiz", 2, 1, {
    title: "Pick the rendering",
    prompt: "A marketing page that changes once a month and must load fast and rank on Google. Best fit?",
    options: ["Client-side rendering (fetch in useEffect)", "Static generation (pre-rendered at build, optionally revalidated)", "Server-render on every request", "An iframe"],
    explanation: "Static HTML from a CDN is fastest and SEO-friendly. Use dynamic (per-request) rendering for personalized pages, CSR for highly interactive parts.",
  }, {
    title: "Escolha a renderização",
    prompt: "Uma página de marketing que muda uma vez por mês e tem de carregar rápido e aparecer no Google. Melhor opção?",
    options: ["Renderização no cliente (fetch num useEffect)", "Geração estática (pré-renderizada no build, com revalidação opcional)", "Renderizar no servidor a cada pedido", "Um iframe"],
    explanation: "HTML estático de uma CDN é o mais rápido e bom para SEO. Use renderização dinâmica (por pedido) para páginas personalizadas e CSR para partes muito interativas.",
  }),
  quiz("nextjs-rendering", "next-dynamic-quiz", 3, 3, {
    title: "What makes a page dynamic?",
    prompt: "Which of these forces a route to render **per request** instead of at build time?",
    options: ["Using Tailwind classes", "Importing a client component", "Having a `layout.tsx`", "Reading `cookies()`/`headers()` or the request's search params"],
    explanation: "Request-time data (cookies, headers, searchParams, uncached fetches) can only be known per request, so that part is rendered dynamically.",
  }, {
    title: "O que deixa uma página dinâmica?",
    prompt: "Qual destes obriga uma rota a renderizar **a cada pedido** em vez de no build?",
    options: ["Usar classes do Tailwind", "Importar um componente cliente", "Ter um `layout.tsx`", "Ler `cookies()`/`headers()` ou os search params do pedido"],
    explanation: "Dados do momento do pedido (cookies, headers, searchParams, fetch sem cache) só se sabem por pedido, então essa parte é renderizada dinamicamente.",
  }),
  quiz("nextjs-rendering", "next-server-action-quiz", 3, 1, {
    title: "Server Actions",
    prompt: "A form calls a Server Action `createPost(formData)`. What must the action still do?",
    options: [
      "Nothing — Server Actions are only callable from your own form",
      "Validate the input and check the user's authentication/authorization, like any public endpoint",
      "Return HTML",
      "Run `'use client'`",
    ],
    explanation: "A Server Action is exposed as an HTTP endpoint that anyone can call. Treat it like an API route: validate (Zod), authenticate, authorize, then `revalidatePath`.",
  }, {
    title: "Server Actions",
    prompt: "Um formulário chama uma Server Action `createPost(formData)`. O que a action ainda tem de fazer?",
    options: [
      "Nada — Server Actions só podem ser chamadas pelo seu formulário",
      "Validar os dados e verificar a autenticação/autorização do usuário, como qualquer endpoint público",
      "Devolver HTML",
      "Rodar `'use client'`",
    ],
    explanation: "Uma Server Action é exposta como um endpoint HTTP que qualquer um pode chamar. Trate como uma rota de API: valide (Zod), autentique, autorize e depois `revalidatePath`.",
  }),
  quiz("nextjs-rendering", "next-routing-quiz", 1, 2, {
    title: "File-based routing",
    prompt: "In the App Router, which file creates the page at `/blog/my-post`?",
    options: ["`pages/blog/my-post.html`", "`app/blog.tsx`", "`app/blog/[slug]/page.tsx`", "`routes.ts`"],
    explanation: "Folders are URL segments, `[slug]` is a dynamic segment and `page.tsx` makes it a route. `layout.tsx`, `loading.tsx` and `error.tsx` wrap it.",
  }, {
    title: "Rotas por ficheiros",
    prompt: "No App Router, que ficheiro cria a página em `/blog/meu-post`?",
    options: ["`pages/blog/meu-post.html`", "`app/blog.tsx`", "`app/blog/[slug]/page.tsx`", "`routes.ts`"],
    explanation: "Pastas são segmentos da URL, `[slug]` é um segmento dinâmico e `page.tsx` transforma em rota. `layout.tsx`, `loading.tsx` e `error.tsx` envolvem a página.",
  }),
  quiz("nextjs-rendering", "next-hydration-quiz", 3, 0, {
    title: "Hydration error",
    prompt: "A client component renders `new Date().toLocaleTimeString()` and you get a **hydration mismatch**. Why?",
    options: [
      "The server HTML and the first client render produce different text (different time), so React can't attach to the HTML",
      "Dates aren't allowed in React",
      "The component should be async",
      "CSS was missing",
    ],
    explanation: "The first client render must match the server HTML. Render time/random/`window`-dependent values after mount (in an effect) or only on the client.",
  }, {
    title: "Erro de hidratação",
    prompt: "Um componente cliente renderiza `new Date().toLocaleTimeString()` e dá **hydration mismatch**. Porquê?",
    options: [
      "O HTML do servidor e o primeiro render no cliente geram texto diferente (hora diferente), então o React não consegue ligar-se ao HTML",
      "Datas não são permitidas no React",
      "O componente devia ser async",
      "Faltava CSS",
    ],
    explanation: "O primeiro render no cliente tem de bater com o HTML do servidor. Valores de hora/aleatórios/dependentes de `window` devem ser renderizados depois de montar (num effect) ou só no cliente.",
  }),
  quiz("nextjs-rendering", "next-image-link-quiz", 1, 3, {
    title: "Built-in components",
    prompt: "Why use `<Link>` from `next/link` instead of a plain `<a>` for internal pages?",
    options: ["It's required for SEO", "It adds styles", "It works without JavaScript only", "It does client-side navigation and prefetches the page, so navigation feels instant"],
    explanation: "`<Link>` avoids a full reload and prefetches routes in view. Similarly `next/image` resizes and lazy-loads images.",
  }, {
    title: "Componentes incluídos",
    prompt: "Porque usar `<Link>` do `next/link` em vez de um `<a>` normal para páginas internas?",
    options: ["É obrigatório para SEO", "Acrescenta estilos", "Só funciona sem JavaScript", "Faz navegação no cliente e pré-carrega a página, então a navegação parece instantânea"],
    explanation: "O `<Link>` evita recarregar a página toda e pré-carrega as rotas visíveis. Do mesmo modo, o `next/image` redimensiona e carrega imagens de forma preguiçosa.",
  }),
  {
    id: "next-rendering-explain",
    kind: "concept",
    topic: "nextjs-rendering",
    title: "SSR vs SSG vs CSR",
    prompt: "Very common question: **Explain SSR, SSG and CSR. When would you use each in a Next.js app?**",
    difficulty: 2,
    estimatedMin: 6,
    tags: ["interview-classic"],
    modelAnswer:
      "They differ in **where and when** the HTML is produced.\n\n**SSG** (static generation) renders the page at **build time**; the HTML is served from a CDN, so it's the fastest and great for SEO — marketing pages, docs, blog posts. With revalidation it can refresh every few minutes.\n\n**SSR** (server-side rendering) renders on the **server for each request**, so it can use cookies and fresh data — a personalized dashboard or a page that depends on the logged-in user. It costs more server time.\n\n**CSR** (client-side rendering) sends JavaScript and the **browser** builds the UI and fetches data — good for highly interactive parts after load, but slower first paint and weaker SEO.\n\nIn the Next.js App Router I mix them: Server Components render static or dynamic HTML by default, and I add small client components only for interactivity. For example, a product page is static and revalidated, while the cart button is a client component.",
    rubric: ["SSG: built at build time, CDN, fastest/SEO (+ revalidation)", "SSR: rendered per request on the server, personalized/fresh data", "CSR: browser renders and fetches, interactive but slower first load/SEO", "Mix in Next.js with a concrete example (Server Components + small client components)"],
    rubricKeys: [
      ["build time", "build", "static", "estatic", "cdn", "revalidat"],
      ["each request", "every request", "per request", "cada pedido", "cada request", "personaliz", "cookie", "fresh"],
      ["browser", "navegador", "client side", "client-side", "javascript", "useeffect", "interactiv", "interativ"],
      ["server component", "use client", "for example", "por exemplo", "mix", "mistur", "next"],
    ],
    pt: {
      title: "SSR vs SSG vs CSR",
      prompt: "Pergunta muito comum: **Explique SSR, SSG e CSR. Quando usaria cada um numa app Next.js?**",
      modelAnswer:
        "A diferença é **onde e quando** o HTML é produzido.\n\n**SSG** (geração estática) renderiza a página **no build**; o HTML é servido de uma CDN, por isso é o mais rápido e ótimo para SEO — páginas de marketing, documentação, posts de blog. Com revalidação pode atualizar a cada poucos minutos.\n\n**SSR** (renderização no servidor) renderiza **no servidor a cada pedido**, então pode usar cookies e dados frescos — um dashboard personalizado ou uma página que depende do usuário com login. Custa mais tempo de servidor.\n\n**CSR** (renderização no cliente) envia JavaScript e o **navegador** monta a interface e busca os dados — bom para partes muito interativas depois de carregar, mas primeira pintura mais lenta e SEO mais fraco.\n\nNo App Router do Next.js eu misturo: os Server Components renderizam HTML estático ou dinâmico por padrão, e acrescento pequenos componentes cliente só para a interatividade. Por exemplo, a página de produto é estática e revalidada, e o botão do carrinho é um componente cliente.",
      rubric: ["SSG: feito no build, CDN, mais rápido/SEO (+ revalidação)", "SSR: renderizado por pedido no servidor, dados personalizados/frescos", "CSR: o navegador renderiza e busca dados, interativo mas primeira carga/SEO piores", "Mistura no Next.js com exemplo concreto (Server Components + componentes cliente pequenos)"],
    },
  },
];

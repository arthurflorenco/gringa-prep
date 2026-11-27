import type { LessonDraftInput } from "@/lib/content/schema";

/** Semana 5 — TypeScript e React. Semana 6 — Next.js. */
export const lessons: LessonDraftInput[] = [
  {
    id: "lesson-typescript",
    kind: "lesson",
    topic: "typescript",
    title: "TypeScript in 10 minutes",
    prompt: "Types, unions, optional fields and why types disappear at runtime.",
    difficulty: 1,
    estimatedMin: 9,
    tags: ["typescript"],
    body:
      "TypeScript is **JavaScript + types**. The compiler checks your code **before** it runs and then removes the types — the browser runs plain JavaScript.\n\n```ts\ntype User = {\n  id: string;\n  name: string;\n  bio?: string;            // optional → string | undefined\n  role: 'admin' | 'member'; // union of literals\n};\n\nfunction greet(user: User): string {\n  return `Hi, ${user.name}`;\n}\n```\n\n**Unions** (`string | number`) mean \"one of these\". Before using something specific, you **narrow** with `typeof`, `in` or a field like `status`:\n\n```ts\nfunction format(v: string | number) {\n  return typeof v === 'number' ? v.toFixed(2) : v;\n}\n```\n\n**Generics** keep types connected: `function first<T>(items: T[]): T | undefined`.\n\nUseful helpers: `Partial<User>`, `Pick<User, 'id' | 'name'>`, `Omit<User, 'id'>`, `Record<string, number>`.\n\nThe big trap: **types don't exist at runtime**. `await res.json() as User` doesn't check anything. Data from APIs and forms must be **validated** (e.g. with Zod).\n\nPrefer `unknown` over `any`: `unknown` forces you to check before using it.",
    keyPoints: [
      "Types are checked at compile time and erased at runtime",
      "Unions + narrowing (typeof, in, status field)",
      "Optional ? → value | undefined",
      "Validate external data (Zod); avoid any, prefer unknown",
    ],
    pt: {
      title: "TypeScript em 10 minutos",
      prompt: "Tipos, uniões, campos opcionais e porque os tipos desaparecem ao rodar.",
      body:
        "TypeScript é **JavaScript + tipos**. O compilador verifica o código **antes** de rodar e depois remove os tipos — o navegador roda JavaScript normal.\n\n```ts\ntype User = {\n  id: string;\n  name: string;\n  bio?: string;            // opcional → string | undefined\n  role: 'admin' | 'member'; // união de literais\n};\n\nfunction greet(user: User): string {\n  return `Oi, ${user.name}`;\n}\n```\n\n**Uniões** (`string | number`) significam \"um destes\". Antes de usar algo específico, você **estreita** com `typeof`, `in` ou um campo como `status`:\n\n```ts\nfunction format(v: string | number) {\n  return typeof v === 'number' ? v.toFixed(2) : v;\n}\n```\n\n**Generics** mantêm os tipos ligados: `function first<T>(items: T[]): T | undefined`.\n\nHelpers úteis: `Partial<User>`, `Pick<User, 'id' | 'name'>`, `Omit<User, 'id'>`, `Record<string, number>`.\n\nA grande armadilha: **tipos não existem ao rodar**. `await res.json() as User` não verifica nada. Dados de APIs e formulários têm de ser **validados** (ex.: com Zod).\n\nPrefira `unknown` a `any`: o `unknown` obriga a verificar antes de usar.",
      keyPoints: [
        "Os tipos são verificados na compilação e apagados ao rodar",
        "Uniões + estreitamento (typeof, in, campo status)",
        "Opcional ? → valor | undefined",
        "Valide dados externos (Zod); evite any, prefira unknown",
      ],
    },
  },
  {
    id: "lesson-react-hooks",
    kind: "lesson",
    topic: "react-hooks",
    title: "React: components, state and effects",
    prompt: "Props, useState, re-renders, useEffect and the classic traps.",
    difficulty: 2,
    estimatedMin: 10,
    tags: ["react"],
    body:
      "A React **component** is a function that returns UI. It receives **props** (read-only, from the parent) and can keep **state** (data that changes).\n\n```jsx\nfunction Counter({ step }) {\n  const [count, setCount] = useState(0);\n  return <button onClick={() => setCount(c => c + step)}>{count}</button>;\n}\n```\n\nWhen state changes, React **re-renders** the component (calls the function again) and updates only what changed in the DOM. A re-render happens when its state changes, its parent re-renders, or a context it uses changes.\n\nState must be **immutable**: create new objects/arrays (`setItems([...items, item])`), never `items.push()` — React compares by reference.\n\nIf a value can be **computed** from props/state, compute it during render; don't store it in another state.\n\n`useEffect` synchronizes with something **outside** React (subscriptions, timers, fetching in client components):\n\n```jsx\nuseEffect(() => {\n  const id = setInterval(tick, 1000);\n  return () => clearInterval(id);   // cleanup\n}, []);                             // deps: when to re-run\n```\n\nNo array → runs after every render; `[]` → once after mount; `[x]` → when `x` changes. A missing dependency causes **stale values**.\n\n**Rules of hooks**: call them at the top level, never inside ifs or loops.",
    keyPoints: [
      "Props come from the parent; state belongs to the component",
      "New state → re-render; update immutably",
      "Derive values during render instead of extra state",
      "useEffect for outside systems, with deps and cleanup",
    ],
    pt: {
      title: "React: componentes, state e effects",
      prompt: "Props, useState, re-renders, useEffect e as armadilhas clássicas.",
      body:
        "Um **componente** React é uma função que devolve interface. Recebe **props** (só leitura, do pai) e pode guardar **state** (dados que mudam).\n\n```jsx\nfunction Counter({ step }) {\n  const [count, setCount] = useState(0);\n  return <button onClick={() => setCount(c => c + step)}>{count}</button>;\n}\n```\n\nQuando o state muda, o React **re-renderiza** o componente (chama a função de novo) e atualiza no DOM só o que mudou. Um re-render acontece quando o state muda, quando o pai re-renderiza ou quando um contexto usado muda.\n\nO state tem de ser **imutável**: crie objetos/arrays novos (`setItems([...items, item])`), nunca `items.push()` — o React compara por referência.\n\nSe um valor pode ser **calculado** a partir de props/state, calcule durante o render; não guarde noutro state.\n\nO `useEffect` sincroniza com algo **fora** do React (subscrições, timers, buscar dados em componentes cliente):\n\n```jsx\nuseEffect(() => {\n  const id = setInterval(tick, 1000);\n  return () => clearInterval(id);   // limpeza\n}, []);                             // deps: quando voltar a rodar\n```\n\nSem array → roda depois de todo render; `[]` → uma vez depois de montar; `[x]` → quando `x` muda. Uma dependência em falta causa **valores desatualizados**.\n\n**Regras dos hooks**: chame-os no topo, nunca dentro de ifs ou loops.",
      keyPoints: [
        "Props vêm do pai; o state pertence ao componente",
        "State novo → re-render; atualize sem mutar",
        "Calcule valores no render em vez de state extra",
        "useEffect para sistemas de fora, com deps e limpeza",
      ],
    },
  },
  {
    id: "lesson-nextjs",
    kind: "lesson",
    topic: "nextjs-rendering",
    title: "Next.js: server, client and rendering",
    prompt: "App Router, Server vs Client Components, static vs dynamic, and data mutations.",
    difficulty: 2,
    estimatedMin: 10,
    tags: ["nextjs", "react"],
    body:
      "Next.js is React with a **server**. In the **App Router**, folders are routes: `app/blog/[slug]/page.tsx` → `/blog/my-post`. `layout.tsx` wraps pages, `loading.tsx` and `error.tsx` handle states, `route.ts` creates API endpoints.\n\nComponents are **Server Components** by default: they run only on the server, can read the database or secrets, and send **no JavaScript** to the browser.\n\n```tsx\n// app/products/page.tsx (Server Component)\nexport default async function Page() {\n  const products = await db.product.findMany();\n  return <ProductList products={products} />;\n}\n```\n\nAdd `'use client'` only for components that need **state, effects, events or browser APIs** — keep them small, at the leaves.\n\n**Rendering**:\n- **Static** (SSG): built once, served from a CDN — fastest, great for SEO. Can be **revalidated**.\n- **Dynamic** (SSR): rendered per request — needed when you read cookies, headers or search params.\n- **Client** (CSR): the browser fetches and renders — for very interactive parts.\n\n**Mutations** use **Server Actions** or route handlers. A Server Action is a public endpoint: validate, authenticate and authorize inside it, then `revalidatePath()`.\n\n**Hydration**: React attaches to the server HTML; the first client render must produce the same output (no `Date.now()` or `window` during render).",
    keyPoints: [
      "Folders = routes; page, layout, loading, error, route",
      "Server Components by default; 'use client' only at the leaves",
      "Static (fast, SEO) vs dynamic (per request) vs client",
      "Server Actions are public endpoints: validate + auth",
    ],
    pt: {
      title: "Next.js: servidor, cliente e renderização",
      prompt: "App Router, Server vs Client Components, estático vs dinâmico, e mutações de dados.",
      body:
        "O Next.js é React com **servidor**. No **App Router**, pastas são rotas: `app/blog/[slug]/page.tsx` → `/blog/meu-post`. O `layout.tsx` envolve as páginas, `loading.tsx` e `error.tsx` tratam estados, e `route.ts` cria endpoints de API.\n\nOs componentes são **Server Components** por padrão: rodam só no servidor, podem ler a base de dados ou segredos e **não enviam JavaScript** ao navegador.\n\n```tsx\n// app/products/page.tsx (Server Component)\nexport default async function Page() {\n  const products = await db.product.findMany();\n  return <ProductList products={products} />;\n}\n```\n\nPonha `'use client'` só nos componentes que precisam de **state, effects, eventos ou APIs do navegador** — pequenos e nas folhas.\n\n**Renderização**:\n- **Estática** (SSG): gerada uma vez e servida de uma CDN — a mais rápida, ótima para SEO. Pode ser **revalidada**.\n- **Dinâmica** (SSR): renderizada a cada pedido — necessária quando lê cookies, headers ou search params.\n- **Cliente** (CSR): o navegador busca e renderiza — para partes muito interativas.\n\n**Mutações** usam **Server Actions** ou route handlers. Uma Server Action é um endpoint público: valide, autentique e autorize lá dentro, depois `revalidatePath()`.\n\n**Hidratação**: o React liga-se ao HTML do servidor; o primeiro render no cliente tem de gerar o mesmo resultado (nada de `Date.now()` ou `window` durante o render).",
      keyPoints: [
        "Pastas = rotas; page, layout, loading, error, route",
        "Server Components por padrão; 'use client' só nas folhas",
        "Estático (rápido, SEO) vs dinâmico (por pedido) vs cliente",
        "Server Actions são endpoints públicos: validar + auth",
      ],
    },
  },
];

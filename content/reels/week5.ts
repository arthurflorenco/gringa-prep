import type { ReelSceneInput } from "@/lib/content/schema";

/** Reels das semanas 5 e 6 — TypeScript, React e Next.js. */
export const reels: Record<string, ReelSceneInput[]> = {
  "lesson-typescript": [
    {
      type: "title",
      say: "TypeScript is JavaScript with types. | It catches bugs while you type, before the code even runs.",
      headline: "TypeScript",
      sub: "Bugs caught before they run",
      pt: {
        say: "TypeScript é JavaScript com tipos. | Ele apanha bugs enquanto você escreve, antes do código rodar.",
        headline: "TypeScript",
        sub: "Bugs apanhados antes de rodar",
      },
    },
    {
      type: "code",
      say: "A type describes the shape of your data. | The question mark means optional, | and a union lists the allowed values.",
      code: "type User = {\n  id: string;\n  name: string;\n  bio?: string;\n  role: 'admin' | 'member';\n};",
      highlight: [4, 5],
      pt: { say: "Um tipo descreve o formato dos dados. | O ponto de interrogação quer dizer opcional, | e uma união lista os valores permitidos." },
    },
    {
      type: "fill",
      say: "Your turn. This function receives a string or a number. Complete the check before calling to fixed.",
      question: "Narrow the union:",
      code: "function format(v: string | number) {\n  return ___ v === 'number' ? v.toFixed(2) : v;\n}",
      choices: ["typeof", "instanceof", "as"],
      answerIndex: 0,
      why: "typeof v equals number narrows the type, so inside that branch TypeScript knows to fixed exists.",
      pt: {
        say: "Sua vez. Esta função recebe uma string ou um número. Completa a verificação antes de chamar o to fixed.",
        question: "Estreite a união:",
        why: "typeof v igual a number estreita o tipo, então dentro desse ramo o TypeScript sabe que o to fixed existe.",
      },
    },
    {
      type: "reveal",
      say: "Four helpers you'll see in every codebase. Tap each card.",
      cards: [
        { front: "`Partial<T>`", back: "All fields optional — good for PATCH bodies" },
        { front: "`Pick<T, K>`", back: "Only the fields you list" },
        { front: "`Omit<T, K>`", back: "Everything except those fields" },
        { front: "`Record<K, V>`", back: "An object with keys K and values V" },
      ],
      why: "Partial makes fields optional, Pick keeps some, Omit removes some, and Record maps keys to values.",
      pt: {
        say: "Quatro helpers que você vai ver em todo projeto. Toca em cada cartão.",
        cards: [
          { front: "`Partial<T>`", back: "Todos os campos opcionais — bom para corpos de PATCH" },
          { front: "`Pick<T, K>`", back: "Só os campos que você lista" },
          { front: "`Omit<T, K>`", back: "Tudo menos esses campos" },
          { front: "`Record<K, V>`", back: "Um objeto com chaves K e valores V" },
        ],
        why: "Partial deixa os campos opcionais, Pick mantém alguns, Omit tira alguns, e Record liga chaves a valores.",
      },
    },
    {
      type: "compare",
      say: "The biggest trap. | At compile time, types protect you. | At runtime, they are gone, so data from APIs must be validated.",
      left: { label: "Compile time", items: ["Types checked", "Errors in the editor", "Autocomplete"] },
      right: { label: "Runtime", items: ["Types erased", "`as User` checks nothing", "Validate with Zod"] },
      pt: {
        say: "A maior armadilha. | Na compilação, os tipos protegem você. | Ao rodar, eles somem, então dados de APIs têm de ser validados.",
        left: { label: "Compilação", items: ["Tipos verificados", "Erros no editor", "Autocomplete"] },
        right: { label: "Ao rodar", items: ["Tipos apagados", "`as User` não verifica nada", "Validar com Zod"] },
      },
    },
    {
      type: "truefalse",
      say: "True or false?",
      statement: "Writing `const user = data as User` makes sure the API really returned a valid user.",
      answer: false,
      why: "As only tells the compiler to trust you. To be sure, validate the data at runtime, for example with Zod.",
      pt: {
        say: "Verdadeiro ou falso?",
        statement: "Escrever `const user = data as User` garante que a API devolveu mesmo um usuário válido.",
        why: "O as só diz ao compilador para confiar em você. Para ter certeza, valide os dados ao rodar, por exemplo com Zod.",
      },
    },
    {
      type: "quiz",
      say: "Last one. Which is safer for data you don't know yet: any or unknown?",
      question: "Safer type for unknown data?",
      options: ["`any`", "`unknown`", "They're the same"],
      answerIndex: 1,
      why: "Unknown forces you to check the value before using it. Any turns type checking off.",
      pt: {
        say: "Última. Qual é mais seguro para dados que você ainda não conhece: any ou unknown?",
        question: "Tipo mais seguro para dados desconhecidos?",
        options: ["`any`", "`unknown`", "São iguais"],
        why: "O unknown obriga a verificar o valor antes de usar. O any desliga a verificação de tipos.",
      },
    },
  ],

  "lesson-react-hooks": [
    {
      type: "title",
      say: "React builds the interface from small functions called components. | Let's see how they keep and change data.",
      headline: "React",
      sub: "Components, state and effects",
      pt: {
        say: "O React monta a interface com pequenas funções chamadas componentes. | Vamos ver como elas guardam e mudam dados.",
        headline: "React",
        sub: "Componentes, state e effects",
      },
    },
    {
      type: "compare",
      say: "Two kinds of data. | Props come from the parent and are read only. | State belongs to the component and changes over time.",
      left: { label: "props", items: ["From the parent", "Read-only", "`<Card title=\"Hi\" />`"] },
      right: { label: "state", items: ["Owned by the component", "Changes with `setX`", "Triggers a re-render"] },
      pt: {
        say: "Dois tipos de dados. | As props vêm do pai e são só de leitura. | O state pertence ao componente e muda com o tempo.",
        left: { label: "props", items: ["Vêm do pai", "Só leitura", "`<Card title=\"Oi\" />`"] },
        right: { label: "state", items: ["Pertence ao componente", "Muda com `setX`", "Provoca um re-render"] },
      },
    },
    {
      type: "visual",
      kind: "boxes",
      say: "Watch a counter. | count starts at zero. | Click: set count runs, React renders again, count is one. | Click again: two.",
      labels: ["count = `0`", "count = `1`", "count = `2`"],
      pt: {
        say: "Olha um contador. | count começa em zero. | Clique: o set count roda, o React renderiza de novo, count é um. | Outro clique: dois.",
        labels: ["count = `0`", "count = `1`", "count = `2`"],
      },
    },
    {
      type: "quiz",
      say: "Predict it. Three set count calls in the same click, starting at zero. What's count after?",
      question: "After one click, `count` is…",
      code: "setCount(count + 1);\nsetCount(count + 1);\nsetCount(count + 1);",
      options: ["`1`", "`3`", "`0`"],
      answerIndex: 0,
      why: "All three use the count of this render, zero, so each sets one. Use the updater, c arrow c plus one, to add three.",
      pt: {
        say: "Prevê. Três set count no mesmo clique, a começar em zero. Quanto fica count?",
        question: "Depois de um clique, `count` vale…",
        options: ["`1`", "`3`", "`0`"],
        why: "As três usam o count deste render, zero, então cada uma define um. Use o updater, c seta c mais um, para somar três.",
      },
    },
    {
      type: "code",
      say: "use effect talks to the world outside React. | Start the timer, | return a cleanup to stop it, | and the dependency array says when to run again.",
      code: "useEffect(() => {\n  const id = setInterval(tick, 1000);\n  return () => clearInterval(id);\n}, []);",
      highlight: [2, 3, 4],
      pt: { say: "O use effect fala com o mundo fora do React. | Inicia o timer, | devolve uma limpeza para parar, | e o array de dependências diz quando rodar de novo." },
    },
    {
      type: "list",
      say: "Three traps interviewers ask about. | Mutating state, like push, doesn't re-render. | Values you can compute shouldn't be extra state. | Hooks inside an if break the rules.",
      items: ["`items.push(x)` → no re-render; use `[...items, x]`", "Computable value? Compute it in render", "Hooks only at the top level"],
      pt: {
        say: "Três armadilhas que os entrevistadores perguntam. | Mutar o state, como push, não re-renderiza. | Valores que dá para calcular não devem ser state extra. | Hooks dentro de um if quebram as regras.",
        items: ["`items.push(x)` → sem re-render; use `[...items, x]`", "Dá para calcular? Calcule no render", "Hooks só no topo"],
      },
    },
    {
      type: "truefalse",
      say: "True or false?",
      statement: "An empty dependency array `[]` makes the effect run after every render.",
      answer: false,
      why: "With an empty array it runs once after mount. With no array at all, it runs after every render.",
      pt: {
        say: "Verdadeiro ou falso?",
        statement: "Um array de dependências vazio `[]` faz o effect rodar depois de todo render.",
        why: "Com o array vazio roda uma vez depois de montar. Sem array nenhum, roda depois de todo render.",
      },
    },
  ],

  "lesson-nextjs": [
    {
      type: "title",
      say: "Next.js is React with a server. | Some of your components run there, and never reach the browser.",
      headline: "Next.js",
      sub: "Server, client and rendering",
      pt: {
        say: "O Next.js é React com servidor. | Parte dos seus componentes roda lá e nunca chega ao navegador.",
        headline: "Next.js",
        sub: "Servidor, cliente e renderização",
      },
    },
    {
      type: "visual",
      kind: "tree",
      say: "Folders are routes. | The app folder, | a layout for every page, | a blog folder, | a dynamic slug, | and its page file.",
      labels: ["`app/`", " `layout.tsx`", " `blog/`", "  `[slug]/`", "   `page.tsx` → `/blog/my-post`"],
      pt: {
        say: "Pastas são rotas. | A pasta app, | um layout para todas as páginas, | uma pasta blog, | um slug dinâmico, | e o ficheiro page.",
        labels: ["`app/`", " `layout.tsx`", " `blog/`", "  `[slug]/`", "   `page.tsx` → `/blog/meu-post`"],
      },
    },
    {
      type: "compare",
      say: "The key idea. | Server components read data and send no JavaScript. | Client components, marked use client, handle clicks and state.",
      left: { label: "Server (default)", items: ["Reads DB / secrets", "No JS shipped", "`async` + `await`"] },
      right: { label: "'use client'", items: ["`useState`, `onClick`", "Browser APIs", "Keep them small"] },
      pt: {
        say: "A ideia principal. | Server components leem dados e não enviam JavaScript. | Client components, marcados com use client, tratam cliques e state.",
        left: { label: "Servidor (padrão)", items: ["Lê banco / segredos", "Sem JS enviado", "`async` + `await`"] },
        right: { label: "'use client'", items: ["`useState`, `onClick`", "APIs do navegador", "Pequenos"] },
      },
    },
    {
      type: "order",
      say: "Your turn. Order these from built earliest to rendered latest.",
      question: "When is the HTML made? (earliest → latest)",
      items: ["Static: at build time", "Revalidated: rebuilt every few minutes", "Dynamic: on the server, per request", "Client: in the browser, after JavaScript loads"],
      why: "Static is made at build, revalidated pages refresh periodically, dynamic pages on each request, and client rendering only in the browser.",
      pt: {
        say: "Sua vez. Ordena do que é feito mais cedo ao que é renderizado mais tarde.",
        question: "Quando o HTML é feito? (mais cedo → mais tarde)",
        items: ["Estático: no build", "Revalidado: refeito a cada poucos minutos", "Dinâmico: no servidor, a cada pedido", "Cliente: no navegador, depois do JavaScript carregar"],
        why: "O estático é feito no build, as páginas revalidadas atualizam de tempos a tempos, as dinâmicas a cada pedido, e a renderização no cliente só no navegador.",
      },
    },
    {
      type: "quiz",
      say: "Quick check. Which component needs use client?",
      question: "Which one needs `'use client'`?",
      options: ["A page that reads products from the database", "A like button with `useState`", "A static footer"],
      answerIndex: 1,
      why: "State and click handlers only work in client components. Reading the database is better on the server.",
      pt: {
        say: "Pergunta rápida. Que componente precisa de use client?",
        question: "Qual precisa de `'use client'`?",
        options: ["Uma página que lê produtos da base", "Um botão de like com `useState`", "Um rodapé estático"],
        why: "State e cliques só funcionam em componentes cliente. Ler a base de dados é melhor no servidor.",
      },
    },
    {
      type: "truefalse",
      say: "True or false?",
      statement: "A Server Action can only be called by your own form, so it doesn't need to check the user.",
      answer: false,
      why: "A Server Action is a public endpoint. Validate the input and check authentication and permissions inside it.",
      pt: {
        say: "Verdadeiro ou falso?",
        statement: "Uma Server Action só pode ser chamada pelo seu formulário, então não precisa verificar o usuário.",
        why: "Uma Server Action é um endpoint público. Valide os dados e verifique a autenticação e as permissões lá dentro.",
      },
    },
  ],
};

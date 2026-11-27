import type { ExerciseInput } from "@/lib/content/schema";
import { quiz } from "./_helpers";

/** TypeScript do básico ao que cai em entrevista. */
export const exercises: ExerciseInput[] = [
  quiz("typescript", "ts-why-quiz", 1, 2, {
    title: "Why TypeScript?",
    prompt: "What's the main benefit of TypeScript for a team?",
    options: ["It makes the code run faster in the browser", "It replaces tests", "It catches type errors while you write code (before running it) and documents data shapes for editors and teammates", "It removes the need for JavaScript"],
    explanation: "Types are checked at **compile time** and then erased — the browser runs plain JavaScript. The win is fewer bugs, safer refactors and autocomplete.",
  }, {
    title: "Porquê TypeScript?",
    prompt: "Qual é o principal benefício do TypeScript para uma equipe?",
    options: ["Deixa o código mais rápido no navegador", "Substitui os testes", "Apanha erros de tipo enquanto você escreve (antes de rodar) e documenta o formato dos dados para o editor e os colegas", "Elimina a necessidade de JavaScript"],
    explanation: "Os tipos são verificados em **tempo de compilação** e depois apagados — o navegador roda JavaScript normal. O ganho é menos bugs, refatorações seguras e autocomplete.",
  }),
  quiz("typescript", "ts-runtime-quiz", 3, 1, {
    title: "Types at runtime",
    prompt: "```ts\ntype User = { name: string; age: number };\nconst user = (await res.json()) as User;\n```\nThe API actually returns `{ name: 'Ana' }` (no `age`). What happens?",
    options: ["TypeScript throws an error at runtime", "Nothing complains: `as` only tells the compiler to trust you; `user.age` is `undefined` at runtime", "The `age` field is filled with 0", "The request fails"],
    explanation: "Types don't exist at runtime. Data from outside (APIs, forms) must be **validated** (e.g. Zod `User.parse(data)`), not just cast.",
  }, {
    title: "Tipos em tempo de execução",
    prompt: "```ts\ntype User = { name: string; age: number };\nconst user = (await res.json()) as User;\n```\nA API devolve na verdade `{ name: 'Ana' }` (sem `age`). O que acontece?",
    options: ["O TypeScript lança um erro em tempo de execução", "Ninguém reclama: o `as` só diz ao compilador para confiar em você; `user.age` é `undefined` ao rodar", "O campo `age` é preenchido com 0", "O pedido falha"],
    explanation: "Tipos não existem em tempo de execução. Dados de fora (APIs, formulários) têm de ser **validados** (ex.: Zod `User.parse(data)`), não só convertidos com `as`.",
  }),
  quiz("typescript", "ts-union-narrowing-quiz", 2, 3, {
    title: "Narrowing a union",
    prompt: "```ts\nfunction format(value: string | number) {\n  return value.toFixed(2);\n}\n```\nWhy does TypeScript complain, and what's the fix?",
    options: ["It doesn't complain", "`toFixed` doesn't exist in JavaScript", "Unions aren't allowed in parameters", "`value` might be a string, which has no `toFixed` — narrow first: `typeof value === 'number' ? value.toFixed(2) : value`"],
    explanation: "With a union you can only use what all members share. `typeof`, `in`, `instanceof` or a discriminant field **narrow** the type inside the branch.",
  }, {
    title: "Estreitar uma união",
    prompt: "```ts\nfunction format(value: string | number) {\n  return value.toFixed(2);\n}\n```\nPorque o TypeScript reclama e qual é a correção?",
    options: ["Não reclama", "`toFixed` não existe em JavaScript", "Uniões não são permitidas em parâmetros", "`value` pode ser string, que não tem `toFixed` — estreite primeiro: `typeof value === 'number' ? value.toFixed(2) : value`"],
    explanation: "Com uma união você só pode usar o que todos os membros partilham. `typeof`, `in`, `instanceof` ou um campo discriminante **estreitam** o tipo dentro do ramo.",
  }),
  quiz("typescript", "ts-optional-quiz", 2, 0, {
    title: "Optional properties",
    prompt: "`type Profile = { bio?: string }`. What's the type of `profile.bio`?",
    options: ["`string | undefined`", "`string`", "`string | null`", "`any`"],
    explanation: "`?` means the property may be missing, so reading it gives `string | undefined`. Use `profile.bio ?? ''` or `profile.bio?.length`.",
  }, {
    title: "Propriedades opcionais",
    prompt: "`type Profile = { bio?: string }`. Qual é o tipo de `profile.bio`?",
    options: ["`string | undefined`", "`string`", "`string | null`", "`any`"],
    explanation: "O `?` diz que a propriedade pode faltar, então ler dá `string | undefined`. Use `profile.bio ?? ''` ou `profile.bio?.length`.",
  }),
  quiz("typescript", "ts-generics-quiz", 3, 1, {
    title: "Generics",
    prompt: "```ts\nfunction first<T>(items: T[]): T | undefined {\n  return items[0];\n}\nconst x = first([3, 5]);\n```\nWhat is the type of `x`?",
    options: ["`any`", "`number | undefined`", "`T`", "`number[]`"],
    explanation: "`T` is inferred from the argument (`number`), so the function returns `number | undefined`. Generics keep the link between input and output types.",
  }, {
    title: "Generics",
    prompt: "```ts\nfunction first<T>(items: T[]): T | undefined {\n  return items[0];\n}\nconst x = first([3, 5]);\n```\nQual é o tipo de `x`?",
    options: ["`any`", "`number | undefined`", "`T`", "`number[]`"],
    explanation: "`T` é inferido do argumento (`number`), então a função devolve `number | undefined`. Generics mantêm a ligação entre o tipo de entrada e de saída.",
  }),
  quiz("typescript", "ts-utility-types-quiz", 3, 2, {
    title: "Utility types",
    prompt: "`type User = { id: string; name: string; email: string }`. A PATCH body may contain any subset of `name` and `email`, but never `id`. Which type fits?",
    options: ["`User`", "`Required<User>`", "`Partial<Omit<User, 'id'>>`", "`Pick<User, 'id'>`"],
    explanation: "`Omit` removes `id`, `Partial` makes the rest optional. Also know `Pick`, `Required`, `Record<K, V>` and `ReturnType`.",
  }, {
    title: "Utility types",
    prompt: "`type User = { id: string; name: string; email: string }`. Um corpo de PATCH pode ter qualquer parte de `name` e `email`, mas nunca `id`. Que tipo encaixa?",
    options: ["`User`", "`Required<User>`", "`Partial<Omit<User, 'id'>>`", "`Pick<User, 'id'>`"],
    explanation: "`Omit` tira o `id`, `Partial` deixa o resto opcional. Conheça também `Pick`, `Required`, `Record<K, V>` e `ReturnType`.",
  }),
  quiz("typescript", "ts-discriminated-quiz", 3, 0, {
    title: "Discriminated unions",
    prompt: "Best way to type the state of a request?",
    options: [
      "`{ status: 'loading' } | { status: 'error'; error: string } | { status: 'success'; data: User[] }`",
      "`{ loading: boolean; error?: string; data?: User[] }`",
      "`any`",
      "`{ status: string; payload: unknown }`",
    ],
    explanation: "Each state carries exactly its data; checking `status` narrows the type, and impossible combos (loading **and** error) can't exist.",
  }, {
    title: "Uniões discriminadas",
    prompt: "Melhor forma de tipar o estado de um pedido à API?",
    options: [
      "`{ status: 'loading' } | { status: 'error'; error: string } | { status: 'success'; data: User[] }`",
      "`{ loading: boolean; error?: string; data?: User[] }`",
      "`any`",
      "`{ status: string; payload: unknown }`",
    ],
    explanation: "Cada estado leva exatamente os seus dados; verificar o `status` estreita o tipo, e combinações impossíveis (loading **e** error) deixam de existir.",
  }),
  quiz("typescript", "ts-readonly-const-quiz", 2, 3, {
    title: "as const",
    prompt: "`const ROLES = ['admin', 'editor'] as const; type Role = typeof ROLES[number];` What is `Role`?",
    options: ["`string`", "`string[]`", "`readonly string[]`", "`'admin' | 'editor'`"],
    explanation: "`as const` keeps the literal values, and `[number]` turns the tuple into a union. A common way to derive a type from a list.",
  }, {
    title: "as const",
    prompt: "`const ROLES = ['admin', 'editor'] as const; type Role = typeof ROLES[number];` O que é `Role`?",
    options: ["`string`", "`string[]`", "`readonly string[]`", "`'admin' | 'editor'`"],
    explanation: "`as const` mantém os valores literais e `[number]` transforma a tupla numa união. Forma comum de derivar um tipo de uma lista.",
  }),
  quiz("typescript", "ts-react-props-quiz", 2, 1, {
    title: "Typing React props",
    prompt: "How do you type a Button that takes a `label` and an optional `onClick`?",
    options: [
      "`function Button(props: any)`",
      "`function Button({ label, onClick }: { label: string; onClick?: () => void })`",
      "`function Button(label: string, onClick: Function)`",
      "Props can't be typed",
    ],
    explanation: "Props are one object; destructure and type it (inline or with a `type ButtonProps`). Avoid `any` and the broad `Function` type.",
  }, {
    title: "Tipar props no React",
    prompt: "Como se tipa um Button que recebe `label` e um `onClick` opcional?",
    options: [
      "`function Button(props: any)`",
      "`function Button({ label, onClick }: { label: string; onClick?: () => void })`",
      "`function Button(label: string, onClick: Function)`",
      "Props não podem ser tipadas",
    ],
    explanation: "As props são um objeto; desestruture e tipe (inline ou com um `type ButtonProps`). Evite `any` e o tipo genérico `Function`.",
  }),
];

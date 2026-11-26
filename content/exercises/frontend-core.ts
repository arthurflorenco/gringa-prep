import type { LegacyExerciseInput } from "@/lib/content/schema";

/** TypeScript, React e Next.js — prévia das semanas 2 e 3 (muito cobrado em vagas de front-end). */
export const exercises: LegacyExerciseInput[] = [
  {
    id: "ts-type-vs-interface",
    kind: "concept",
    topic: "typescript",
    title: "type vs interface",
    prompt: "When do you use `type` and when do you use `interface` in TypeScript? Is there a practical difference?",
    difficulty: 1,
    estimatedMin: 5,
    tags: ["typescript"],
    modelAnswer:
      "For object shapes they are almost interchangeable. Interfaces can be reopened and merged (declaration merging) and extended with extends, which is useful for public library types. Type aliases can express things interfaces can't: unions, intersections, mapped and conditional types, tuples and primitives. In practice I follow the codebase convention; when there's none, I use type for most things — props, unions, API responses — and interface when I expect consumers to extend it.",
    rubric: [
      "Mostly interchangeable for object shapes",
      "Interface: declaration merging / extends",
      "Type: unions, intersections, mapped/conditional types",
      "Pragmatic: follow the team convention",
    ],
  },
  {
    id: "ts-unknown-vs-any",
    kind: "quiz",
    topic: "typescript",
    title: "unknown vs any",
    prompt: "You receive JSON from `fetch`. Which type should `data` have before you validate it?",
    difficulty: 1,
    estimatedMin: 2,
    tags: ["typescript"],
    options: ["any — it's flexible", "unknown — forces you to narrow/validate first", "object", "never"],
    answerIndex: 1,
    explanation:
      "`unknown` accepts any value but won't let you use it until you narrow it (typeof checks, a type guard or a schema like Zod). `any` turns type checking off and lets bugs through.",
  },
  {
    id: "react-useeffect-deps",
    kind: "concept",
    topic: "react-hooks",
    title: "useEffect dependency array",
    prompt:
      "Explain what the dependency array of `useEffect` does. What happens with `[]`, with no array at all, and when you forget a dependency? When **shouldn't** you use an effect?",
    difficulty: 2,
    estimatedMin: 6,
    tags: ["react", "hooks"],
    modelAnswer:
      "The effect runs after render, and React re-runs it only when a value in the dependency array changed (compared with Object.is). With [] it runs once after mount (twice in dev Strict Mode to surface missing cleanups). With no array it runs after every render. If you forget a dependency, the effect keeps a stale closure — it sees old props/state. Effects are for synchronising with something outside React: subscriptions, timers, DOM APIs, network. You shouldn't use them to derive state from props (compute it during render) or to react to user events (do it in the event handler).",
    rubric: [
      "Runs after render, re-runs when deps change",
      "[] vs no array vs specific deps",
      "Missing dep = stale closure",
      "Cleanup function for subscriptions/timers",
      "Don't use effects for derived state or event logic",
    ],
    followUp: "Why does your effect run twice in development?",
  },
  {
    id: "react-rerender-quiz",
    kind: "quiz",
    topic: "react-hooks",
    title: "What causes a re-render?",
    prompt: "Which of these does **not** by itself cause a component to re-render?",
    difficulty: 2,
    estimatedMin: 2,
    tags: ["react", "rendering"],
    options: [
      "Its state changes via setState",
      "Its parent re-renders",
      "A context it consumes changes value",
      "A ref's .current is changed",
    ],
    answerIndex: 3,
    explanation:
      "Mutating `ref.current` doesn't schedule a render — that's the point of refs. State changes, parent renders (unless memoised) and consumed context changes all re-render.",
  },
  {
    id: "react-keys",
    kind: "concept",
    topic: "react-hooks",
    title: "Why keys matter",
    prompt: "Why does React need a `key` in lists, and what goes wrong if you use the array index as key in a list that can be reordered or filtered?",
    difficulty: 1,
    estimatedMin: 4,
    tags: ["react", "rendering"],
    modelAnswer:
      "Keys tell React which item is which between renders, so it can reuse the right component instance and DOM node. With index keys, if an item is removed or the list is sorted, the indexes shift: React thinks item 0 is still item 0 and keeps its state, so you get inputs showing the wrong text, wrong animations or unnecessary re-renders. Use a stable id from the data. Index is fine only for static lists that never change order.",
    rubric: ["Keys identify items across renders", "Index keys break when order changes", "Symptom: state attached to the wrong row", "Use a stable id"],
  },
  {
    id: "next-server-vs-client",
    kind: "concept",
    topic: "nextjs-rendering",
    title: "Server vs Client Components",
    prompt:
      "In the Next.js App Router, what's the difference between a Server Component and a Client Component? How do you decide which one a page/section should be?",
    difficulty: 2,
    estimatedMin: 6,
    tags: ["nextjs", "rsc"],
    modelAnswer:
      "Server Components render on the server only: they can read the database or secrets directly, their code never ships to the browser, and they reduce bundle size. They can't use state, effects or browser APIs. Client Components ('use client') are pre-rendered to HTML too, but then hydrate in the browser so they can use state, effects, event handlers and browser APIs. By default everything is a Server Component; I push 'use client' as far down the tree as possible — for example a page fetches data on the server and passes it to a small interactive client component like a filter or a form.",
    rubric: [
      "Server: runs only on the server, no JS shipped, can access DB/secrets",
      "Client: hydrates, can use state/effects/events",
      "Both produce HTML on first load",
      "Keep 'use client' at the leaves",
    ],
  },
  {
    id: "next-ssr-ssg",
    kind: "quiz",
    topic: "nextjs-rendering",
    title: "Static or dynamic?",
    prompt: "A marketing page shows the same content to everyone and changes once a week. Which rendering strategy fits best?",
    difficulty: 1,
    estimatedMin: 2,
    tags: ["nextjs"],
    options: [
      "Render on every request (SSR)",
      "Static generation with revalidation (ISR)",
      "Client-side fetch with a spinner",
      "No pre-rendering at all",
    ],
    answerIndex: 1,
    explanation:
      "Content that is the same for everyone and changes rarely should be pre-rendered and cached (served from the CDN), then regenerated on a schedule or on demand when it changes.",
  },
];

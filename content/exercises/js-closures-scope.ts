import type { ExerciseInput } from "@/lib/content/schema";

export const exercises: ExerciseInput[] = [
  {
    id: "closure-explain",
    kind: "concept",
    topic: "js-closures-scope",
    title: "What is a closure?",
    prompt:
      "Explain what a closure is, as you would to an interviewer, and give **one real example** where you used one (React hooks count).",
    difficulty: 1,
    estimatedMin: 5,
    tags: ["fundamentals"],
    modelAnswer:
      "A closure is a function that remembers the variables from the scope where it was created, even after that outer function has returned. In JavaScript every function closes over its lexical scope. A practical example: a debounce helper keeps the timer id in a closure between calls. In React, every event handler and effect closes over the props and state of the render it was created in — which is also why you get stale closures if you forget a dependency in useEffect or useCallback.",
    rubric: [
      "Function + the lexical scope it was created in",
      "Variables survive after the outer function returns",
      "Concrete example (debounce, counter, module pattern, React handler)",
      "Bonus: mentions stale closures in React",
    ],
    followUp: "What is a stale closure and how do you fix it in a useEffect?",
  },
  {
    id: "var-let-loop",
    kind: "quiz",
    topic: "js-closures-scope",
    title: "var in a loop",
    prompt:
      "What does this log?\n\n```js\nfor (var i = 0; i < 3; i++) {\n  setTimeout(() => console.log(i), 0);\n}\n```",
    difficulty: 1,
    estimatedMin: 2,
    tags: ["output", "scope"],
    options: ["0 1 2", "3 3 3", "undefined ×3", "2 2 2"],
    answerIndex: 1,
    explanation:
      "`var` is function-scoped, so all three callbacks share the same `i`, which is 3 when they run. With `let`, each iteration gets its own binding and it logs 0 1 2.",
  },
  {
    id: "this-arrow",
    kind: "quiz",
    topic: "js-closures-scope",
    title: "this in arrow functions",
    prompt:
      "```js\nconst user = {\n  name: 'Ana',\n  regular() { return this.name; },\n  arrow: () => this?.name,\n};\nconsole.log(user.regular(), user.arrow());\n```\n\nIn a browser ES module, what is logged?",
    difficulty: 2,
    estimatedMin: 2,
    tags: ["this"],
    options: ["Ana Ana", "Ana undefined", "undefined Ana", "TypeError"],
    answerIndex: 1,
    explanation:
      "Regular methods get `this` from how they're called (`user.regular()` → user). Arrow functions don't have their own `this`; they take it from the surrounding scope — at module top level that's `undefined`.",
  },
  {
    id: "code-debounce",
    kind: "code",
    topic: "js-closures-scope",
    title: "Implement debounce",
    prompt:
      "Implement `debounce(fn, wait)`.\n\nThe returned function should only call `fn` after it **stops being called for `wait` ms**, using the arguments of the **last** call. This is the classic search-input question.",
    difficulty: 2,
    estimatedMin: 10,
    tags: ["classic", "closures"],
    language: "ts",
    starter:
      "export function debounce<A extends unknown[]>(\n  fn: (...args: A) => void,\n  wait: number,\n): (...args: A) => void {\n  // your code here\n}\n",
    solution:
      "export function debounce<A extends unknown[]>(\n  fn: (...args: A) => void,\n  wait: number,\n): (...args: A) => void {\n  let timer: ReturnType<typeof setTimeout> | undefined;\n  return (...args: A) => {\n    clearTimeout(timer);\n    timer = setTimeout(() => fn(...args), wait);\n  };\n}\n",
    hints: ["Keep the timer id in a variable outside the returned function (closure).", "Clear the previous timer on every call."],
    tests: [
      {
        name: "calls once after the wait",
        code: "let calls = 0;\nconst d = debounce(() => { calls++; }, 20);\nd(); d(); d();\nexpect(calls).toBe(0);\nawait sleep(40);\nexpect(calls).toBe(1);",
      },
      {
        name: "uses the last arguments",
        code: "let got = '';\nconst d = debounce((v: string) => { got = v; }, 20);\nd('a'); d('ab'); d('abc');\nawait sleep(40);\nexpect(got).toBe('abc');",
      },
      {
        name: "can fire again later",
        hidden: true,
        code: "let calls = 0;\nconst d = debounce(() => { calls++; }, 10);\nd(); await sleep(25); d(); await sleep(25);\nexpect(calls).toBe(2);",
      },
    ],
  },
  {
    id: "code-once-memo",
    kind: "code",
    topic: "js-closures-scope",
    title: "memoize",
    prompt:
      "Implement `memoize(fn)` for functions that take **one primitive argument**.\n\nThe first call with a given argument runs `fn`; later calls with the same argument return the cached result without calling `fn` again.",
    difficulty: 1,
    estimatedMin: 8,
    tags: ["closures"],
    language: "ts",
    starter:
      "export function memoize<A extends string | number, R>(fn: (arg: A) => R): (arg: A) => R {\n  // your code here\n}\n",
    solution:
      "export function memoize<A extends string | number, R>(fn: (arg: A) => R): (arg: A) => R {\n  const cache = new Map<A, R>();\n  return (arg) => {\n    if (!cache.has(arg)) cache.set(arg, fn(arg));\n    return cache.get(arg) as R;\n  };\n}\n",
    hints: ["Use a `Map` — it distinguishes `1` from `'1'`, a plain object doesn't."],
    tests: [
      {
        name: "caches results",
        code: "let calls = 0;\nconst sq = memoize((n: number) => { calls++; return n * n; });\nexpect(sq(4)).toBe(16);\nexpect(sq(4)).toBe(16);\nexpect(calls).toBe(1);",
      },
      {
        name: "different args are different entries",
        code: "let calls = 0;\nconst f = memoize((n: number) => { calls++; return n; });\nf(1); f(2); f(1);\nexpect(calls).toBe(2);",
      },
      {
        name: "number vs string keys",
        hidden: true,
        code: "let calls = 0;\nconst f = memoize((v: string | number) => { calls++; return typeof v; });\nexpect(f(1)).toBe('number');\nexpect(f('1')).toBe('string');\nexpect(calls).toBe(2);",
      },
      {
        name: "caches falsy results",
        hidden: true,
        code: "let calls = 0;\nconst f = memoize((n: number) => { calls++; return n > 10 ? 1 : 0; });\nf(1); f(1);\nexpect(calls).toBe(1);",
      },
    ],
  },
];

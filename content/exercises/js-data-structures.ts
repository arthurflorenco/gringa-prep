import type { LegacyExerciseInput } from "@/lib/content/schema";

export const exercises: LegacyExerciseInput[] = [
  {
    id: "immutability-react",
    kind: "concept",
    topic: "js-data-structures",
    title: "Why immutability matters in React",
    prompt:
      "A teammate writes:\n\n```js\nconst addItem = (item) => {\n  items.push(item);\n  setItems(items);\n};\n```\n\nThe list doesn't update on screen. Explain **why**, and show the fix.",
    difficulty: 1,
    estimatedMin: 5,
    tags: ["react", "references"],
    modelAnswer:
      "React decides whether to re-render by comparing the old and new state with Object.is — a reference check. push mutates the same array, so the reference doesn't change and React bails out. The fix is to create a new array: setItems(prev => [...prev, item]). Using the updater form also avoids stale state when several updates happen in a row. The same rule applies to objects: spread into a new object instead of mutating.",
    rubric: [
      "React compares state by reference (Object.is)",
      "push mutates — same reference, so no re-render",
      "Fix: new array with spread or concat",
      "Bonus: updater function setItems(prev => …)",
    ],
  },
  {
    id: "shallow-copy-quiz",
    kind: "quiz",
    topic: "js-data-structures",
    title: "Spread is shallow",
    prompt:
      "```js\nconst a = { user: { name: 'Ana' }, tags: ['x'] };\nconst b = { ...a };\nb.user.name = 'Bia';\nb.tags = ['y'];\nconsole.log(a.user.name, a.tags[0]);\n```",
    difficulty: 2,
    estimatedMin: 2,
    tags: ["references"],
    options: ["Ana x", "Bia x", "Bia y", "Ana y"],
    answerIndex: 1,
    explanation:
      "Spread copies one level. `b.user` is the same object as `a.user`, so changing its name affects both. Reassigning `b.tags` points `b` to a new array and leaves `a.tags` alone.",
  },
  {
    id: "code-group-by",
    kind: "code",
    topic: "js-data-structures",
    title: "groupBy",
    prompt:
      "Implement `groupBy(items, key)` that returns an object where each key is a value of `item[key]` and each value is the array of items with that value, **keeping the original order**.\n\n```ts\ngroupBy([{ t: 'a', n: 1 }, { t: 'b', n: 2 }, { t: 'a', n: 3 }], 't')\n// { a: [{t:'a',n:1},{t:'a',n:3}], b: [{t:'b',n:2}] }\n```",
    difficulty: 1,
    estimatedMin: 8,
    tags: ["arrays", "reduce"],
    language: "ts",
    starter:
      "export function groupBy<T, K extends keyof T>(items: T[], key: K): Record<string, T[]> {\n  // your code here\n}\n",
    solution:
      "export function groupBy<T, K extends keyof T>(items: T[], key: K): Record<string, T[]> {\n  const out: Record<string, T[]> = {};\n  for (const item of items) {\n    const k = String(item[key]);\n    (out[k] ??= []).push(item);\n  }\n  return out;\n}\n",
    hints: ["`??=` assigns only when the left side is null/undefined."],
    tests: [
      {
        name: "groups by key",
        code: "const r = groupBy([{ t: 'a', n: 1 }, { t: 'b', n: 2 }, { t: 'a', n: 3 }], 't');\nexpect(r).toEqual({ a: [{ t: 'a', n: 1 }, { t: 'a', n: 3 }], b: [{ t: 'b', n: 2 }] });",
      },
      { name: "empty input", code: "expect(groupBy([] as { t: string }[], 't')).toEqual({});" },
      {
        name: "does not mutate input",
        hidden: true,
        code: "const input = [{ t: 'a' }, { t: 'b' }];\nconst copy = JSON.stringify(input);\ngroupBy(input, 't');\nexpect(JSON.stringify(input)).toBe(copy);",
      },
    ],
  },
  {
    id: "code-deep-equal",
    kind: "code",
    topic: "js-data-structures",
    title: "deepEqual",
    prompt:
      "Implement `deepEqual(a, b)` for JSON-like values: primitives, arrays and plain objects (no Dates, Maps or cycles).\n\nTwo values are equal when they have the same type and the same content, recursively. Key order in objects doesn't matter.",
    difficulty: 2,
    estimatedMin: 15,
    tags: ["recursion", "classic"],
    language: "ts",
    starter: "export function deepEqual(a: unknown, b: unknown): boolean {\n  // your code here\n}\n",
    solution:
      "export function deepEqual(a: unknown, b: unknown): boolean {\n  if (Object.is(a, b)) return true;\n  if (typeof a !== 'object' || typeof b !== 'object' || a === null || b === null) return false;\n  if (Array.isArray(a) !== Array.isArray(b)) return false;\n  const ka = Object.keys(a);\n  const kb = Object.keys(b);\n  if (ka.length !== kb.length) return false;\n  return ka.every((k) =>\n    Object.prototype.hasOwnProperty.call(b, k) &&\n    deepEqual((a as Record<string, unknown>)[k], (b as Record<string, unknown>)[k]),\n  );\n}\n",
    hints: ["Handle the primitive / null cases first, then compare keys recursively.", "`[]` and `{}` should not be equal."],
    tests: [
      { name: "primitives", code: "expect(deepEqual(1, 1)).toBe(true);\nexpect(deepEqual('a', 'b')).toBe(false);\nexpect(deepEqual(null, null)).toBe(true);" },
      { name: "nested objects", code: "expect(deepEqual({ a: { b: [1, 2] } }, { a: { b: [1, 2] } })).toBe(true);\nexpect(deepEqual({ a: { b: [1, 2] } }, { a: { b: [2, 1] } })).toBe(false);" },
      { name: "key order does not matter", code: "expect(deepEqual({ x: 1, y: 2 }, { y: 2, x: 1 })).toBe(true);" },
      { name: "array vs object", hidden: true, code: "expect(deepEqual([], {})).toBe(false);\nexpect(deepEqual({ a: undefined }, { b: undefined })).toBe(false);" },
      { name: "null vs object", hidden: true, code: "expect(deepEqual(null, {})).toBe(false);" },
    ],
  },
];

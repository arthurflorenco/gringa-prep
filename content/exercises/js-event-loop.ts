import type { ExerciseInput } from "@/lib/content/schema";

export const exercises: ExerciseInput[] = [
  {
    id: "event-loop-explain",
    kind: "concept",
    topic: "js-event-loop",
    title: "Explain the event loop",
    prompt:
      "An interviewer asks: **\"JavaScript is single-threaded. How can it handle a network request and a click at the same time?\"**\n\nExplain the event loop in 4–6 sentences. Mention the call stack, Web APIs, the task queue and the microtask queue.",
    difficulty: 2,
    estimatedMin: 6,
    tags: ["fundamentals"],
    modelAnswer:
      "JavaScript runs on a single call stack, so only one piece of JS executes at a time. Slow work like timers, network requests or DOM events is handed to the host environment (browser Web APIs or libuv in Node), which runs it outside the stack. When that work finishes, its callback is queued. The event loop keeps checking: when the call stack is empty, it first drains the entire microtask queue (promise callbacks, queueMicrotask), then takes one task from the task queue (setTimeout, events), runs it, and repeats. That's why a long synchronous loop freezes the UI: nothing else can run until the stack is empty.",
    rubric: [
      "Single call stack — one thing runs at a time",
      "Async work is delegated to Web APIs / the runtime",
      "Microtasks (promises) run before the next task (setTimeout, events)",
      "Long synchronous code blocks rendering and input",
    ],
    followUp: "Where does rendering (paint) happen in this cycle?",
  },
  {
    id: "event-loop-order-1",
    kind: "quiz",
    topic: "js-event-loop",
    title: "Output order: timers vs promises",
    prompt:
      "What does this log?\n\n```js\nconsole.log('A');\nsetTimeout(() => console.log('B'), 0);\nPromise.resolve().then(() => console.log('C'));\nconsole.log('D');\n```",
    difficulty: 1,
    estimatedMin: 2,
    tags: ["output"],
    options: ["A B C D", "A D C B", "A D B C", "A C D B"],
    answerIndex: 1,
    explanation:
      "Synchronous code first (A, D). Then the microtask queue is drained (C). Only then the next task runs — the setTimeout callback (B).",
  },
  {
    id: "event-loop-order-2",
    kind: "quiz",
    topic: "js-event-loop",
    title: "Output order: async/await",
    prompt:
      "What does this log?\n\n```js\nasync function run() {\n  console.log('1');\n  await null;\n  console.log('2');\n}\nrun();\nconsole.log('3');\n```",
    difficulty: 2,
    estimatedMin: 2,
    tags: ["output", "async-await"],
    options: ["1 2 3", "1 3 2", "3 1 2", "2 1 3"],
    answerIndex: 1,
    explanation:
      "An async function runs synchronously until the first `await`. Everything after `await` is scheduled as a microtask, so '3' logs before '2'.",
  },
  {
    id: "promise-all-vs-allsettled",
    kind: "concept",
    topic: "js-event-loop",
    title: "Promise.all vs Promise.allSettled",
    prompt:
      "You load a dashboard that needs 3 API calls: user, projects and notifications. Notifications are optional.\n\nWhich of `Promise.all`, `Promise.allSettled`, `Promise.race` and `Promise.any` would you use, and why? What happens with `Promise.all` if one request fails?",
    difficulty: 2,
    estimatedMin: 5,
    tags: ["promises"],
    modelAnswer:
      "Promise.all runs everything in parallel but rejects as soon as any promise rejects — so a failing notifications call would break the whole dashboard. Here I'd use Promise.allSettled: it waits for all of them and gives me a status per result, so I can render user and projects and show a small fallback for notifications. Alternatively, Promise.all for the required calls plus a separate catch on the optional one. race resolves/rejects with the first to settle (useful for timeouts) and any resolves with the first success (useful for fallbacks/mirrors).",
    rubric: [
      "Promise.all is fail-fast: one rejection rejects everything",
      "allSettled returns status for every promise",
      "Runs requests in parallel instead of sequential awaits",
      "Knows a use case for race (timeout) or any (first success)",
    ],
  },
  {
    id: "code-sleep-retry",
    kind: "code",
    topic: "js-event-loop",
    title: "Retry with backoff",
    prompt:
      "Implement `retry(fn, attempts, delayMs)`.\n\n- Call the async function `fn`.\n- If it rejects, wait `delayMs` and try again, up to `attempts` total calls.\n- Resolve with the first successful value.\n- If every attempt fails, reject with the **last** error.",
    difficulty: 2,
    estimatedMin: 12,
    tags: ["async-await", "promises"],
    language: "ts",
    starter:
      "export async function retry<T>(\n  fn: () => Promise<T>,\n  attempts: number,\n  delayMs: number,\n): Promise<T> {\n  // your code here\n}\n",
    solution:
      "const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));\n\nexport async function retry<T>(\n  fn: () => Promise<T>,\n  attempts: number,\n  delayMs: number,\n): Promise<T> {\n  let lastError: unknown;\n  for (let i = 0; i < attempts; i++) {\n    try {\n      return await fn();\n    } catch (err) {\n      lastError = err;\n      if (i < attempts - 1) await sleep(delayMs);\n    }\n  }\n  throw lastError;\n}\n",
    hints: [
      "A `for` loop with `try { return await fn() } catch {}` is enough.",
      "Remember `return await` inside try — without `await` the catch never sees the rejection.",
    ],
    tests: [
      {
        name: "resolves on first success",
        code: "const v = await retry(async () => 42, 3, 1);\nexpect(v).toBe(42);",
      },
      {
        name: "retries until it works",
        code: "let calls = 0;\nconst v = await retry(async () => { calls++; if (calls < 3) throw new Error('nope'); return 'ok'; }, 5, 1);\nexpect(v).toBe('ok');\nexpect(calls).toBe(3);",
      },
      {
        name: "rejects with the last error",
        code: "let calls = 0;\nlet message = '';\ntry { await retry(async () => { calls++; throw new Error('fail ' + calls); }, 3, 1); } catch (e) { message = (e as Error).message; }\nexpect(message).toBe('fail 3');\nexpect(calls).toBe(3);",
      },
      {
        name: "waits between attempts",
        hidden: true,
        code: "let calls = 0;\nconst start = Date.now();\ntry { await retry(async () => { calls++; throw new Error('x'); }, 3, 40); } catch {}\nexpect(Date.now() - start >= 70).toBe(true);",
      },
    ],
  },
  {
    id: "code-promise-all",
    kind: "code",
    topic: "js-event-loop",
    title: "Implement Promise.all",
    prompt:
      "Implement `promiseAll(promises)` without using `Promise.all`.\n\n- Resolve with an array of results **in the original order** (not the order they finish).\n- Reject as soon as any promise rejects.\n- An empty array resolves to `[]`.\n- Plain values (not promises) are allowed in the input.",
    difficulty: 3,
    estimatedMin: 15,
    tags: ["promises", "classic"],
    language: "ts",
    starter:
      "export function promiseAll<T>(promises: Array<T | Promise<T>>): Promise<T[]> {\n  // your code here\n}\n",
    solution:
      "export function promiseAll<T>(promises: Array<T | Promise<T>>): Promise<T[]> {\n  return new Promise((resolve, reject) => {\n    const results: T[] = new Array(promises.length);\n    let done = 0;\n    if (promises.length === 0) return resolve([]);\n    promises.forEach((p, i) => {\n      Promise.resolve(p).then((value) => {\n        results[i] = value;\n        done++;\n        if (done === promises.length) resolve(results);\n      }, reject);\n    });\n  });\n}\n",
    hints: [
      "Keep a counter of resolved promises and write each result at its index.",
      "`Promise.resolve(x)` turns plain values into promises.",
    ],
    tests: [
      {
        name: "keeps order",
        code: "const slow = new Promise<number>((r) => setTimeout(() => r(1), 30));\nconst fast = new Promise<number>((r) => setTimeout(() => r(2), 5));\nexpect(await promiseAll([slow, fast])).toEqual([1, 2]);",
      },
      { name: "empty array", code: "expect(await promiseAll([])).toEqual([]);" },
      { name: "plain values", code: "expect(await promiseAll([1, Promise.resolve(2), 3])).toEqual([1, 2, 3]);" },
      {
        name: "rejects fast",
        code: "let err = '';\nconst bad = Promise.reject(new Error('boom'));\nbad.catch(() => {});\ntry { await promiseAll([Promise.resolve(1), bad]); } catch (e) { err = (e as Error).message; }\nexpect(err).toBe('boom');",
      },
    ],
  },
];

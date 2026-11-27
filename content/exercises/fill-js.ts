import type { ExerciseInput } from "@/lib/content/schema";
import { quiz } from "./_helpers";

/** Mais quizzes de JavaScript — o tipo "o que imprime?" que cai em entrevistas júnior/mid. */
export const exercises: ExerciseInput[] = [
  // ───────────── js-basics ─────────────
  quiz("js-basics", "jsb-typeof-null-quiz", 2, 2, {
    title: "typeof null",
    prompt: "What does `typeof null` return?",
    options: ["`'null'`", "`'undefined'`", "`'object'`", "`'number'`"],
    explanation: "A famous historical bug in JavaScript. To check for null, use `value === null`.",
  }, {
    title: "typeof null",
    prompt: "O que devolve `typeof null`?",
    options: ["`'null'`", "`'undefined'`", "`'object'`", "`'number'`"],
    explanation: "Um bug histórico famoso do JavaScript. Para testar null, use `value === null`.",
  }),
  quiz("js-basics", "jsb-const-object-quiz", 2, 1, {
    title: "const and objects",
    prompt: "```js\nconst user = { name: 'Ana' };\nuser.name = 'Bia';\nconsole.log(user.name);\n```\nWhat happens?",
    options: ["TypeError: assignment to constant", "Prints `Bia`", "Prints `Ana`", "SyntaxError"],
    explanation: "`const` stops **reassigning** the variable, not changing the object it points to. `user = {}` would throw.",
  }, {
    title: "const e objetos",
    prompt: "```js\nconst user = { name: 'Ana' };\nuser.name = 'Bia';\nconsole.log(user.name);\n```\nO que acontece?",
    options: ["TypeError: atribuição a constante", "Imprime `Bia`", "Imprime `Ana`", "SyntaxError"],
    explanation: "O `const` impede **reatribuir** a variável, não mudar o objeto para onde ela aponta. `user = {}` daria erro.",
  }),
  quiz("js-basics", "jsb-nullish-quiz", 2, 3, {
    title: "?? vs ||",
    prompt: "`const qty = input.quantity ?? 1;` with `input.quantity = 0`. What is `qty`? And with `||` instead?",
    options: ["1 and 1", "0 and 0", "1 and 0", "0 and 1"],
    explanation: "`??` only falls back on `null`/`undefined`, so 0 stays. `||` falls back on any falsy value (0, '', false) — a classic bug with quantities and prices.",
  }, {
    title: "?? vs ||",
    prompt: "`const qty = input.quantity ?? 1;` com `input.quantity = 0`. Quanto vale `qty`? E com `||` no lugar?",
    options: ["1 e 1", "0 e 0", "1 e 0", "0 e 1"],
    explanation: "O `??` só usa o padrão para `null`/`undefined`, então o 0 fica. O `||` usa para qualquer valor falsy (0, '', false) — bug clássico com quantidades e preços.",
  }),
  quiz("js-basics", "jsb-optional-chaining-quiz", 1, 0, {
    title: "Optional chaining",
    prompt: "`user` is `undefined`. What does `user?.address?.city` return?",
    options: ["`undefined`", "A TypeError", "`null`", "`''`"],
    explanation: "`?.` stops and returns `undefined` when the left side is null/undefined, instead of throwing.",
  }, {
    title: "Optional chaining",
    prompt: "`user` é `undefined`. O que devolve `user?.address?.city`?",
    options: ["`undefined`", "Um TypeError", "`null`", "`''`"],
    explanation: "O `?.` para e devolve `undefined` quando o lado esquerdo é null/undefined, em vez de dar erro.",
  }),
  quiz("js-basics", "jsb-float-quiz", 2, 1, {
    title: "0.1 + 0.2",
    prompt: "What does `0.1 + 0.2 === 0.3` return in JavaScript, and why does it matter?",
    options: ["`true` — JavaScript is exact", "`false` — floating point can't represent some decimals exactly, so keep money in integer cents", "It throws", "`true` only in strict mode"],
    explanation: "`0.1 + 0.2` is `0.30000000000000004`. For money, use integer cents (or a decimal library); compare floats with a tolerance.",
  }, {
    title: "0.1 + 0.2",
    prompt: "O que devolve `0.1 + 0.2 === 0.3` em JavaScript, e porque isso importa?",
    options: ["`true` — o JavaScript é exato", "`false` — vírgula flutuante não representa alguns decimais exatamente, por isso guarde dinheiro em cêntimos inteiros", "Dá erro", "`true` só em strict mode"],
    explanation: "`0.1 + 0.2` dá `0.30000000000000004`. Para dinheiro, use cêntimos inteiros (ou uma biblioteca de decimais); compare floats com tolerância.",
  }),
  quiz("js-basics", "jsb-spread-copy-quiz", 3, 2, {
    title: "Shallow copy",
    prompt: "```js\nconst a = { user: { name: 'Ana' } };\nconst b = { ...a };\nb.user.name = 'Bia';\nconsole.log(a.user.name);\n```",
    options: ["`Ana`", "`undefined`", "`Bia` — spread copies only the first level; nested objects are shared", "A TypeError"],
    explanation: "Spread is a **shallow** copy. For nested data, copy each level (`{ ...a, user: { ...a.user, name } }`) or use `structuredClone`.",
  }, {
    title: "Cópia rasa",
    prompt: "```js\nconst a = { user: { name: 'Ana' } };\nconst b = { ...a };\nb.user.name = 'Bia';\nconsole.log(a.user.name);\n```",
    options: ["`Ana`", "`undefined`", "`Bia` — o spread só copia o primeiro nível; objetos aninhados são partilhados", "Um TypeError"],
    explanation: "O spread é uma cópia **rasa**. Para dados aninhados, copie cada nível (`{ ...a, user: { ...a.user, name } }`) ou use `structuredClone`.",
  }),

  // ───────────── js-control-flow ─────────────
  quiz("js-control-flow", "jsc-switch-fallthrough-quiz", 2, 3, {
    title: "switch without break",
    prompt: "```js\nconst role = 'editor';\nswitch (role) {\n  case 'admin': console.log('A');\n  case 'editor': console.log('E');\n  case 'viewer': console.log('V');\n}\n```\nWhat is printed?",
    options: ["`E`", "`A E V`", "Nothing", "`E` then `V`"],
    explanation: "Without `break` (or `return`), execution **falls through** to the next cases. Always end cases with `break`.",
  }, {
    title: "switch sem break",
    prompt: "```js\nconst role = 'editor';\nswitch (role) {\n  case 'admin': console.log('A');\n  case 'editor': console.log('E');\n  case 'viewer': console.log('V');\n}\n```\nO que é impresso?",
    options: ["`E`", "`A E V`", "Nada", "`E` e depois `V`"],
    explanation: "Sem `break` (ou `return`), a execução **continua** para os casos seguintes. Termine sempre os casos com `break`.",
  }),
  quiz("js-control-flow", "jsc-for-in-of-quiz", 2, 1, {
    title: "for…in vs for…of",
    prompt: "`const tags = ['js', 'sql'];` What does `for (const t in tags) console.log(t)` print?",
    options: ["`js` and `sql`", "`0` and `1` — `for…in` loops over keys (indexes), `for…of` over values", "Nothing", "An error"],
    explanation: "Use `for…of` for array values, `for…in` (or `Object.keys`) for object keys.",
  }, {
    title: "for…in vs for…of",
    prompt: "`const tags = ['js', 'sql'];` O que `for (const t in tags) console.log(t)` imprime?",
    options: ["`js` e `sql`", "`0` e `1` — o `for…in` percorre chaves (índices), o `for…of` percorre valores", "Nada", "Um erro"],
    explanation: "Use `for…of` para valores de arrays, `for…in` (ou `Object.keys`) para chaves de objetos.",
  }),
  quiz("js-control-flow", "jsc-early-return-quiz", 1, 0, {
    title: "Readable conditions",
    prompt: "Which version is usually preferred in code review?",
    options: [
      "Guard clauses: `if (!user) return null; if (!user.active) return null; return <Profile />;`",
      "Three nested `if` blocks with the main code in the deepest one",
      "A ternary inside a ternary inside a ternary",
      "A `while(true)` with `break`s",
    ],
    explanation: "Early returns keep the happy path flat and easy to read.",
  }, {
    title: "Condições legíveis",
    prompt: "Que versão é normalmente preferida num code review?",
    options: [
      "Guard clauses: `if (!user) return null; if (!user.active) return null; return <Profile />;`",
      "Três `if` aninhados com o código principal no mais fundo",
      "Um ternário dentro de um ternário dentro de outro",
      "Um `while(true)` com `break`s",
    ],
    explanation: "Returns antecipados deixam o caminho principal plano e fácil de ler.",
  }),
  quiz("js-control-flow", "jsc-truthy-array-quiz", 2, 2, {
    title: "Empty array in an if",
    prompt: "```js\nconst results = [];\nif (results) console.log('found');\nelse console.log('empty');\n```",
    options: ["`empty`", "Nothing", "`found` — an empty array is truthy; check `results.length`", "An error"],
    explanation: "Objects and arrays are always truthy, even empty. Use `if (results.length > 0)`.",
  }, {
    title: "Array vazio num if",
    prompt: "```js\nconst results = [];\nif (results) console.log('found');\nelse console.log('empty');\n```",
    options: ["`empty`", "Nada", "`found` — um array vazio é truthy; verifique `results.length`", "Um erro"],
    explanation: "Objetos e arrays são sempre truthy, mesmo vazios. Use `if (results.length > 0)`.",
  }),
  quiz("js-control-flow", "jsc-try-finally-quiz", 3, 1, {
    title: "try / catch / finally",
    prompt: "```js\nfunction f() {\n  try { throw new Error('x'); }\n  catch { return 'caught'; }\n  finally { console.log('cleanup'); }\n}\nconsole.log(f());\n```",
    options: ["`caught` only", "`cleanup` then `caught`", "`caught` then `cleanup`", "An uncaught error"],
    explanation: "`finally` always runs — even after `return` — before the function actually returns. Good place to release resources.",
  }, {
    title: "try / catch / finally",
    prompt: "```js\nfunction f() {\n  try { throw new Error('x'); }\n  catch { return 'caught'; }\n  finally { console.log('cleanup'); }\n}\nconsole.log(f());\n```",
    options: ["Só `caught`", "`cleanup` e depois `caught`", "`caught` e depois `cleanup`", "Um erro não tratado"],
    explanation: "O `finally` roda sempre — mesmo depois de `return` — antes de a função realmente devolver. Bom sítio para libertar recursos.",
  }),

  // ───────────── js-functions ─────────────
  quiz("js-functions", "jsf-default-params-quiz", 1, 2, {
    title: "Default parameters",
    prompt: "`function greet(name = 'friend') { return 'Hi ' + name; }` What does `greet(undefined)` return? And `greet(null)`?",
    options: ["`Hi friend` and `Hi friend`", "`Hi undefined` and `Hi null`", "`Hi friend` and `Hi null`", "An error"],
    explanation: "Defaults apply only when the argument is `undefined` (missing). `null` is a real value.",
  }, {
    title: "Parâmetros padrão",
    prompt: "`function greet(name = 'friend') { return 'Hi ' + name; }` O que devolve `greet(undefined)`? E `greet(null)`?",
    options: ["`Hi friend` e `Hi friend`", "`Hi undefined` e `Hi null`", "`Hi friend` e `Hi null`", "Um erro"],
    explanation: "O padrão só vale quando o argumento é `undefined` (em falta). `null` é um valor de verdade.",
  }),
  quiz("js-functions", "jsf-pure-quiz", 2, 1, {
    title: "Pure functions",
    prompt: "Which function is **pure**?",
    options: [
      "`(items) => { items.push(1); return items; }`",
      "`(price, rate) => price * (1 + rate)`",
      "`() => Date.now()`",
      "`(user) => { db.save(user); return user; }`",
    ],
    explanation: "Pure = same input → same output, no side effects (mutation, I/O, time). Easy to test and reason about.",
  }, {
    title: "Funções puras",
    prompt: "Que função é **pura**?",
    options: [
      "`(items) => { items.push(1); return items; }`",
      "`(price, rate) => price * (1 + rate)`",
      "`() => Date.now()`",
      "`(user) => { db.save(user); return user; }`",
    ],
    explanation: "Pura = mesma entrada → mesma saída, sem efeitos colaterais (mutação, I/O, tempo). Fácil de testar e de entender.",
  }),
  quiz("js-functions", "jsf-callback-quiz", 2, 3, {
    title: "Passing a function",
    prompt: "```js\nbutton.addEventListener('click', handleClick());\n```\nWhat's the bug?",
    options: ["`addEventListener` needs three arguments", "`click` should be `onClick`", "Nothing", "`handleClick()` runs immediately and passes its **return value**; pass the function itself: `handleClick`"],
    explanation: "Same bug in React: `onClick={save()}` calls `save` during render. Use `onClick={save}` or `onClick={() => save(id)}`.",
  }, {
    title: "Passar uma função",
    prompt: "```js\nbutton.addEventListener('click', handleClick());\n```\nQual é o bug?",
    options: ["O `addEventListener` precisa de três argumentos", "`click` devia ser `onClick`", "Nenhum", "`handleClick()` roda logo e passa o **valor devolvido**; passe a própria função: `handleClick`"],
    explanation: "Mesmo bug no React: `onClick={save()}` chama `save` durante o render. Use `onClick={save}` ou `onClick={() => save(id)}`.",
  }),
  quiz("js-functions", "jsf-arrow-object-quiz", 3, 0, {
    title: "Returning an object from an arrow",
    prompt: "`const toUser = (name) => { name: name };` What does `toUser('Ana')` return?",
    options: ["`undefined` — the braces are a function body; wrap the object in parentheses: `=> ({ name })`", "`{ name: 'Ana' }`", "`'Ana'`", "A SyntaxError"],
    explanation: "`{` after `=>` starts a block. `name:` becomes a label. Return objects with `=> ({ … })`.",
  }, {
    title: "Devolver um objeto numa arrow",
    prompt: "`const toUser = (name) => { name: name };` O que devolve `toUser('Ana')`?",
    options: ["`undefined` — as chaves são o corpo da função; envolva o objeto em parênteses: `=> ({ name })`", "`{ name: 'Ana' }`", "`'Ana'`", "Um SyntaxError"],
    explanation: "Um `{` depois de `=>` abre um bloco. `name:` vira um label. Devolva objetos com `=> ({ … })`.",
  }),
  quiz("js-functions", "jsf-rest-quiz", 1, 1, {
    title: "Rest parameters",
    prompt: "`function sum(...nums) { return nums.reduce((a, b) => a + b, 0); }` What is `sum(1, 2, 3)` and what is `nums`?",
    options: ["`6`, and `nums` is an arguments object", "`6`, and `nums` is a real array `[1, 2, 3]`", "`123`", "An error"],
    explanation: "`...nums` collects the remaining arguments into an array. The `0` start value makes `sum()` return 0 instead of throwing.",
  }, {
    title: "Parâmetros rest",
    prompt: "`function sum(...nums) { return nums.reduce((a, b) => a + b, 0); }` Quanto dá `sum(1, 2, 3)` e o que é `nums`?",
    options: ["`6`, e `nums` é um objeto arguments", "`6`, e `nums` é um array de verdade `[1, 2, 3]`", "`123`", "Um erro"],
    explanation: "O `...nums` junta os argumentos restantes num array. O valor inicial `0` faz `sum()` devolver 0 em vez de dar erro.",
  }),

  // ───────────── js-data-structures ─────────────
  quiz("js-data-structures", "jsd-map-filter-quiz", 1, 2, {
    title: "map vs filter vs find",
    prompt: "You need **the first** user whose email is verified. Which method?",
    options: ["`users.map(u => u.verified)`", "`users.filter(u => u.verified)`", "`users.find(u => u.verified)`", "`users.forEach(u => u.verified)`"],
    explanation: "`find` returns the first match (or `undefined`). `filter` returns all matches as an array; `map` transforms each item.",
  }, {
    title: "map vs filter vs find",
    prompt: "Você precisa do **primeiro** usuário com email verificado. Que método?",
    options: ["`users.map(u => u.verified)`", "`users.filter(u => u.verified)`", "`users.find(u => u.verified)`", "`users.forEach(u => u.verified)`"],
    explanation: "O `find` devolve o primeiro que bate (ou `undefined`). O `filter` devolve todos num array; o `map` transforma cada item.",
  }),
  quiz("js-data-structures", "jsd-reduce-quiz", 2, 0, {
    title: "reduce",
    prompt: "`[{ price: 10, qty: 2 }, { price: 5, qty: 1 }].reduce((sum, i) => sum + i.price * i.qty, 0)` returns…",
    options: ["`25`", "`17`", "`15`", "`NaN`"],
    explanation: "10×2 + 5×1 = 25. Always pass the initial value (`0`), or an empty array throws.",
  }, {
    title: "reduce",
    prompt: "`[{ price: 10, qty: 2 }, { price: 5, qty: 1 }].reduce((sum, i) => sum + i.price * i.qty, 0)` devolve…",
    options: ["`25`", "`17`", "`15`", "`NaN`"],
    explanation: "10×2 + 5×1 = 25. Passe sempre o valor inicial (`0`), senão um array vazio dá erro.",
  }),
  quiz("js-data-structures", "jsd-sort-numbers-quiz", 2, 3, {
    title: "Sorting numbers",
    prompt: "What does `[10, 1, 2].sort()` return?",
    options: ["`[1, 2, 10]`", "`[10, 2, 1]`", "An error", "`[1, 10, 2]` — default sort compares as strings; use `sort((a, b) => a - b)`"],
    explanation: "Default `sort` converts to strings. Also remember it **mutates** the array — use `toSorted` or copy first.",
  }, {
    title: "Ordenar números",
    prompt: "O que devolve `[10, 1, 2].sort()`?",
    options: ["`[1, 2, 10]`", "`[10, 2, 1]`", "Um erro", "`[1, 10, 2]` — o sort padrão compara como texto; use `sort((a, b) => a - b)`"],
    explanation: "O `sort` padrão converte para strings. E lembre-se que ele **muta** o array — use `toSorted` ou copie antes.",
  }),
  quiz("js-data-structures", "jsd-set-quiz", 2, 1, {
    title: "Removing duplicates",
    prompt: "Shortest way to remove duplicate ids from `['a', 'b', 'a', 'c']`?",
    options: ["A nested for loop", "`[...new Set(ids)]`", "`ids.unique()`", "`JSON.parse(JSON.stringify(ids))`"],
    explanation: "A `Set` only keeps unique values; spread turns it back into an array. `Set.has` is also O(1) for lookups.",
  }, {
    title: "Remover duplicados",
    prompt: "A forma mais curta de remover ids duplicados de `['a', 'b', 'a', 'c']`?",
    options: ["Um for dentro de outro", "`[...new Set(ids)]`", "`ids.unique()`", "`JSON.parse(JSON.stringify(ids))`"],
    explanation: "Um `Set` só guarda valores únicos; o spread transforma de volta em array. O `Set.has` também procura em O(1).",
  }),
  quiz("js-data-structures", "jsd-map-lookup-quiz", 3, 2, {
    title: "Lookups in a loop",
    prompt: "For each of 10 000 orders you do `users.find(u => u.id === order.userId)` (10 000 users). What's the problem and the fix?",
    options: ["No problem", "Use `forEach` instead of `find`", "It's O(n×m) — build a `Map` once (`new Map(users.map(u => [u.id, u]))`) and use `map.get(id)`", "Sort the users first"],
    explanation: "100 million comparisons vs 20 000 operations. Indexing by id is a pattern you'll use constantly.",
  }, {
    title: "Buscas dentro de um loop",
    prompt: "Para cada um de 10 000 pedidos você faz `users.find(u => u.id === order.userId)` (10 000 usuários). Qual é o problema e a correção?",
    options: ["Nenhum problema", "Usar `forEach` em vez de `find`", "É O(n×m) — crie um `Map` uma vez (`new Map(users.map(u => [u.id, u]))`) e use `map.get(id)`", "Ordenar os usuários antes"],
    explanation: "100 milhões de comparações vs 20 000 operações. Indexar por id é um padrão que você vai usar sempre.",
  }),

  // ───────────── js-closures-scope ─────────────
  quiz("js-closures-scope", "jscl-var-loop-quiz", 3, 1, {
    title: "var in a loop",
    prompt: "```js\nfor (var i = 0; i < 3; i++) {\n  setTimeout(() => console.log(i), 0);\n}\n```",
    options: ["`0 1 2`", "`3 3 3` — `var` is function-scoped, so all callbacks share one `i`", "`undefined` ×3", "An error"],
    explanation: "With `let`, each iteration gets a new binding and it prints `0 1 2`. Classic interview question.",
  }, {
    title: "var num loop",
    prompt: "```js\nfor (var i = 0; i < 3; i++) {\n  setTimeout(() => console.log(i), 0);\n}\n```",
    options: ["`0 1 2`", "`3 3 3` — o `var` tem escopo de função, então todos os callbacks partilham o mesmo `i`", "`undefined` ×3", "Um erro"],
    explanation: "Com `let`, cada iteração tem uma variável nova e imprime `0 1 2`. Pergunta clássica de entrevista.",
  }),
  quiz("js-closures-scope", "jscl-counter-quiz", 2, 2, {
    title: "Closure counter",
    prompt: "```js\nfunction makeCounter() {\n  let count = 0;\n  return () => ++count;\n}\nconst a = makeCounter();\nconst b = makeCounter();\na(); a();\nconsole.log(a(), b());\n```",
    options: ["`3 3`", "`1 1`", "`3 1` — each call to makeCounter creates its own `count`", "`2 1`"],
    explanation: "Each closure remembers its own scope. That's how you get private state without classes.",
  }, {
    title: "Contador com closure",
    prompt: "```js\nfunction makeCounter() {\n  let count = 0;\n  return () => ++count;\n}\nconst a = makeCounter();\nconst b = makeCounter();\na(); a();\nconsole.log(a(), b());\n```",
    options: ["`3 3`", "`1 1`", "`3 1` — cada chamada a makeCounter cria o seu próprio `count`", "`2 1`"],
    explanation: "Cada closure lembra-se do seu próprio escopo. É assim que se tem estado privado sem classes.",
  }),
  quiz("js-closures-scope", "jscl-tdz-quiz", 3, 0, {
    title: "Using let before declaring",
    prompt: "```js\nconsole.log(total);\nlet total = 5;\n```",
    options: ["ReferenceError — `let`/`const` are in the temporal dead zone until declared", "`undefined`", "`5`", "`null`"],
    explanation: "With `var` it would print `undefined` (hoisting). `let`/`const` are hoisted too but can't be accessed before the declaration.",
  }, {
    title: "Usar let antes de declarar",
    prompt: "```js\nconsole.log(total);\nlet total = 5;\n```",
    options: ["ReferenceError — `let`/`const` estão na temporal dead zone até serem declarados", "`undefined`", "`5`", "`null`"],
    explanation: "Com `var` imprimiria `undefined` (hoisting). `let`/`const` também sobem, mas não podem ser acedidos antes da declaração.",
  }),
  quiz("js-closures-scope", "jscl-this-quiz", 3, 3, {
    title: "Losing this",
    prompt: "```js\nconst cart = {\n  items: [1, 2],\n  count() { return this.items.length; },\n};\nconst fn = cart.count;\nfn();\n```\nWhat happens?",
    options: ["Returns 2", "Returns 0", "Returns undefined", "TypeError — `this` is not `cart` when the method is called without it; bind it or use `() => cart.count()`"],
    explanation: "`this` depends on **how** a function is called. Detached methods lose it. Arrow functions don't have their own `this`.",
  }, {
    title: "Perder o this",
    prompt: "```js\nconst cart = {\n  items: [1, 2],\n  count() { return this.items.length; },\n};\nconst fn = cart.count;\nfn();\n```\nO que acontece?",
    options: ["Devolve 2", "Devolve 0", "Devolve undefined", "TypeError — o `this` não é `cart` quando o método é chamado sem ele; faça bind ou use `() => cart.count()`"],
    explanation: "O `this` depende de **como** a função é chamada. Métodos soltos perdem-no. Arrow functions não têm `this` próprio.",
  }),
  quiz("js-closures-scope", "jscl-module-scope-quiz", 2, 1, {
    title: "Why closures matter",
    prompt: "Where do closures show up in real React/Node code?",
    options: ["Only in old jQuery code", "Event handlers and effects capturing state, debounce/throttle, middleware factories (`requireRole('admin')`) and memoization", "Only in classes", "Nowhere in modern code"],
    explanation: "Interviewers like a real example: a handler using a stale value from an old render, or a factory that returns a configured middleware.",
  }, {
    title: "Porque as closures importam",
    prompt: "Onde aparecem closures em código real de React/Node?",
    options: ["Só em código jQuery antigo", "Handlers e effects que capturam o state, debounce/throttle, fábricas de middleware (`requireRole('admin')`) e memoização", "Só em classes", "Em lado nenhum no código moderno"],
    explanation: "Os entrevistadores gostam de um exemplo real: um handler a usar um valor antigo de um render anterior, ou uma fábrica que devolve um middleware configurado.",
  }),

  // ───────────── js-event-loop ─────────────
  quiz("js-event-loop", "jse-order-quiz", 3, 2, {
    title: "Output order",
    prompt: "```js\nconsole.log('A');\nsetTimeout(() => console.log('B'), 0);\nPromise.resolve().then(() => console.log('C'));\nconsole.log('D');\n```",
    options: ["`A B C D`", "`A D B C`", "`A D C B`", "`A C D B`"],
    explanation: "Sync code first (A, D), then **microtasks** (promise → C), then **tasks** (setTimeout → B).",
  }, {
    title: "Ordem de saída",
    prompt: "```js\nconsole.log('A');\nsetTimeout(() => console.log('B'), 0);\nPromise.resolve().then(() => console.log('C'));\nconsole.log('D');\n```",
    options: ["`A B C D`", "`A D B C`", "`A D C B`", "`A C D B`"],
    explanation: "Primeiro o código síncrono (A, D), depois as **microtasks** (promise → C), depois as **tasks** (setTimeout → B).",
  }),
  quiz("js-event-loop", "jse-async-return-quiz", 2, 0, {
    title: "What an async function returns",
    prompt: "`async function getTotal() { return 42; }` What is `getTotal()`?",
    options: ["A Promise that resolves to 42", "42", "undefined", "A function"],
    explanation: "Async functions always return a Promise. You need `await getTotal()` (or `.then`) to get 42.",
  }, {
    title: "O que uma função async devolve",
    prompt: "`async function getTotal() { return 42; }` O que é `getTotal()`?",
    options: ["Uma Promise que resolve para 42", "42", "undefined", "Uma função"],
    explanation: "Funções async devolvem sempre uma Promise. Precisa de `await getTotal()` (ou `.then`) para ter 42.",
  }),
  quiz("js-closures-scope", "jscl-debounce-why-quiz", 2, 3, {
    title: "Why debounce a search box?",
    prompt: "A search input calls the API on every keystroke. Why wrap the call in `debounce(fn, 300)`?",
    options: ["To make typing faster", "To cache results forever", "To cancel the network", "To call the API only after the user stops typing for 300 ms — fewer requests and fewer out-of-order responses"],
    explanation: "Debounce is built with a closure that remembers the pending timer between calls.",
  }, {
    title: "Porquê debounce numa busca?",
    prompt: "Um campo de busca chama a API a cada tecla. Porquê envolver a chamada em `debounce(fn, 300)`?",
    options: ["Para digitar mais depressa", "Para guardar os resultados para sempre", "Para cancelar a rede", "Para chamar a API só depois de o usuário parar de digitar por 300 ms — menos pedidos e menos respostas fora de ordem"],
    explanation: "O debounce é feito com uma closure que lembra o timer pendente entre chamadas.",
  }),
];

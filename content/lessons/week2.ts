import type { LessonDraftInput } from "@/lib/content/schema";

/** Semana 2 — JavaScript do zero. A ordem do array é a ordem das aulas. */
export const lessons: LessonDraftInput[] = [
  {
    id: "lesson-js-first-steps",
    kind: "lesson",
    topic: "js-basics",
    title: "JavaScript: first steps and console.log",
    prompt: "Where JavaScript runs and how to see what your code does.",
    difficulty: 1,
    estimatedMin: 6,
    tags: ["basics", "javascript"],
    body:
      "JavaScript runs in the **browser** (to make pages interactive) and on the **server** with Node.js. It's the language of React and Next.js.\n\nThe most important tool for a beginner is `console.log`: it prints a value so you can **see** what your code is doing.\n\n```js\nconsole.log('Hello!');\nconsole.log(2 + 3);        // 5\nconst name = 'Ana';\nconsole.log('Name:', name); // Name: Ana\n```\n\nIn the browser, open DevTools (`Cmd + Option + I` on Mac) → **Console** tab to see the output and the errors.\n\n**Reading an error** is a skill. Example:\n\n```\nTypeError: Cannot read properties of undefined (reading 'name')\n```\n\nIt means: you wrote `something.name`, but `something` is `undefined`. Look at the line number, then `console.log` the value before that line.\n\n**Comments** are ignored by JavaScript: `// one line` or `/* several lines */`. TypeScript is JavaScript **plus types** — everything you learn here works there too.",
    keyPoints: [
      "JavaScript runs in the browser and on the server (Node.js)",
      "console.log shows values — your first debugging tool",
      "Read errors: type of error + message + line number",
      "TypeScript = JavaScript + types",
    ],
    pt: {
      title: "JavaScript: primeiros passos e console.log",
      prompt: "Onde o JavaScript roda e como ver o que o seu código faz.",
      body:
        "O JavaScript roda no **navegador** (para deixar as páginas interativas) e no **servidor** com Node.js. É a linguagem do React e do Next.js.\n\nA ferramenta mais importante para quem está começando é o `console.log`: ele imprime um valor para você **ver** o que o código está fazendo.\n\n```js\nconsole.log('Olá!');\nconsole.log(2 + 3);        // 5\nconst name = 'Ana';\nconsole.log('Nome:', name); // Nome: Ana\n```\n\nNo navegador, abra o DevTools (`Cmd + Option + I` no Mac) → aba **Console** para ver as saídas e os erros.\n\n**Ler um erro** é uma habilidade. Exemplo:\n\n```\nTypeError: Cannot read properties of undefined (reading 'name')\n```\n\nSignifica: você escreveu `algo.name`, mas `algo` é `undefined`. Olhe o número da linha e faça `console.log` do valor antes dessa linha.\n\n**Comentários** são ignorados pelo JavaScript: `// uma linha` ou `/* várias linhas */`. TypeScript é JavaScript **com tipos** — tudo o que você aprender aqui funciona lá também.",
      keyPoints: [
        "O JavaScript roda no navegador e no servidor (Node.js)",
        "console.log mostra valores — a sua primeira ferramenta de debug",
        "Ler erros: tipo do erro + mensagem + número da linha",
        "TypeScript = JavaScript + tipos",
      ],
    },
  },
  {
    id: "lesson-variables-types",
    kind: "lesson",
    topic: "js-basics",
    title: "Variables and data types",
    prompt: "const, let, and the basic types of values.",
    difficulty: 1,
    estimatedMin: 8,
    tags: ["basics", "javascript"],
    body:
      "A **variable** is a name that holds a value.\n\n```js\nconst city = 'Zurich'; // const: can't be reassigned\nlet age = 30;          // let: can change later\nage = 31;              // ok\n// city = 'Bern';      // TypeError: Assignment to constant variable\n```\n\nRule: use `const` by default, `let` only when the value must change. Avoid `var` (old, confusing scope).\n\n**Primitive types:**\n- **string** — text: `'hello'`, `\"hello\"` or `` `hello ${name}` `` (template string)\n- **number** — `42`, `3.14`, `-1` (JS has one number type)\n- **boolean** — `true` or `false`\n- **undefined** — a variable that has no value yet\n- **null** — \"intentionally empty\", set by you\n\n**Objects and arrays** (more in week 3):\n\n```js\nconst user = { name: 'Ana', age: 30 };   // object: key → value\nconst tags = ['js', 'react'];             // array: ordered list\nconsole.log(user.name, tags[0]);          // Ana js\n```\n\n`typeof` tells you the type: `typeof 42` → `'number'`, `typeof 'hi'` → `'string'`.",
    keyPoints: [
      "const by default, let when the value changes, never var",
      "Primitives: string, number, boolean, undefined, null",
      "Object = { key: value }; array = [ordered, list]",
      "typeof shows the type of a value",
    ],
    pt: {
      title: "Variáveis e tipos de dados",
      prompt: "const, let e os tipos básicos de valores.",
      body:
        "Uma **variável** é um nome que guarda um valor.\n\n```js\nconst city = 'Zurich'; // const: não pode ser reatribuída\nlet age = 30;          // let: pode mudar depois\nage = 31;              // ok\n// city = 'Bern';      // TypeError: Assignment to constant variable\n```\n\nRegra: use `const` por padrão e `let` só quando o valor precisa mudar. Evite `var` (antigo, escopo confuso).\n\n**Tipos primitivos:**\n- **string** — texto: `'hello'`, `\"hello\"` ou `` `hello ${name}` `` (template string)\n- **number** — `42`, `3.14`, `-1` (o JS tem um só tipo de número)\n- **boolean** — `true` ou `false`\n- **undefined** — uma variável que ainda não tem valor\n- **null** — \"vazio de propósito\", definido por você\n\n**Objetos e arrays** (mais na semana 3):\n\n```js\nconst user = { name: 'Ana', age: 30 };   // objeto: chave → valor\nconst tags = ['js', 'react'];             // array: lista ordenada\nconsole.log(user.name, tags[0]);          // Ana js\n```\n\nO `typeof` diz o tipo: `typeof 42` → `'number'`, `typeof 'hi'` → `'string'`.",
      keyPoints: [
        "const por padrão, let quando o valor muda, nunca var",
        "Primitivos: string, number, boolean, undefined, null",
        "Objeto = { chave: valor }; array = [lista, ordenada]",
        "typeof mostra o tipo de um valor",
      ],
    },
  },
  {
    id: "lesson-operators",
    kind: "lesson",
    topic: "js-basics",
    title: "Operators and comparisons",
    prompt: "Math, ===, logical operators and truthy/falsy.",
    difficulty: 1,
    estimatedMin: 8,
    tags: ["basics", "javascript"],
    body:
      "**Arithmetic:** `+  -  *  /` and `%` (remainder): `10 % 3` → `1`. A number is even when `n % 2 === 0`.\n\nCareful: `+` with a string **joins text**: `'2' + 2` → `'22'`. Convert first: `Number('2') + 2` → `4`.\n\n**Comparison:** `>  <  >=  <=`, and equality:\n- `===` strict equal: same value **and** same type. `2 === 2` → true, `2 === '2'` → false.\n- `!==` strict not-equal.\n- Avoid `==`: it converts types (`2 == '2'` → true) and causes bugs.\n\n**Logical:**\n- `&&` AND — true if both are true\n- `||` OR — true if at least one is true\n- `!` NOT — inverts: `!true` → false\n\n**Truthy and falsy.** In an `if`, every value becomes true or false. The **falsy** values are: `false`, `0`, `''` (empty string), `null`, `undefined`, `NaN`. Everything else is truthy — including `'0'`, `[]` and `{}`.\n\n```js\nconst name = '';\nconsole.log(name || 'Anonymous'); // 'Anonymous' (default value)\nconsole.log(name ?? 'Anonymous'); // '' (?? only replaces null/undefined)\n```",
    keyPoints: [
      "% gives the remainder; n % 2 === 0 means even",
      "Always use === and !==, not ==",
      "&& (and), || (or), ! (not)",
      "Falsy: false, 0, '', null, undefined, NaN — everything else is truthy",
    ],
    pt: {
      title: "Operadores e comparações",
      prompt: "Contas, ===, operadores lógicos e truthy/falsy.",
      body:
        "**Aritméticos:** `+  -  *  /` e `%` (resto da divisão): `10 % 3` → `1`. Um número é par quando `n % 2 === 0`.\n\nCuidado: `+` com uma string **junta texto**: `'2' + 2` → `'22'`. Converta antes: `Number('2') + 2` → `4`.\n\n**Comparação:** `>  <  >=  <=` e igualdade:\n- `===` igualdade estrita: mesmo valor **e** mesmo tipo. `2 === 2` → true, `2 === '2'` → false.\n- `!==` diferença estrita.\n- Evite `==`: ele converte tipos (`2 == '2'` → true) e causa bugs.\n\n**Lógicos:**\n- `&&` E — verdadeiro se os dois forem verdadeiros\n- `||` OU — verdadeiro se pelo menos um for verdadeiro\n- `!` NÃO — inverte: `!true` → false\n\n**Truthy e falsy.** Num `if`, todo valor vira verdadeiro ou falso. Os valores **falsy** são: `false`, `0`, `''` (string vazia), `null`, `undefined`, `NaN`. Todo o resto é truthy — incluindo `'0'`, `[]` e `{}`.\n\n```js\nconst name = '';\nconsole.log(name || 'Anónimo'); // 'Anónimo' (valor padrão)\nconsole.log(name ?? 'Anónimo'); // '' (?? só substitui null/undefined)\n```",
      keyPoints: [
        "% dá o resto; n % 2 === 0 quer dizer par",
        "Use sempre === e !==, não ==",
        "&& (e), || (ou), ! (não)",
        "Falsy: false, 0, '', null, undefined, NaN — todo o resto é truthy",
      ],
    },
  },
  {
    id: "lesson-conditionals",
    kind: "lesson",
    topic: "js-control-flow",
    title: "Conditionals: if, else and the ternary",
    prompt: "Making the code choose between paths.",
    difficulty: 1,
    estimatedMin: 6,
    tags: ["basics", "javascript"],
    body:
      "An `if` runs a block only when a condition is true:\n\n```js\nconst hours = 9;\n\nif (hours > 8) {\n  console.log('Overtime');\n} else if (hours === 8) {\n  console.log('Full day');\n} else {\n  console.log('Part time');\n}\n```\n\nJavaScript checks from top to bottom and runs **only the first** branch that matches.\n\n**Ternary** — a short if/else that returns a value:\n\n```js\nconst label = hours > 8 ? 'Overtime' : 'Normal';\n```\n\nRead it as: condition **?** value if true **:** value if false. Very common in React: `{isLoading ? <Spinner /> : <List />}`.\n\n**Early return** keeps code flat and easy to read:\n\n```js\nfunction canEdit(user) {\n  if (!user) return false;        // stop early\n  if (user.role === 'admin') return true;\n  return user.isOwner;\n}\n```",
    keyPoints: [
      "if / else if / else — only the first matching branch runs",
      "Ternary: condition ? valueIfTrue : valueIfFalse",
      "Early return avoids deep nesting",
      "Ternaries are everywhere in React JSX",
    ],
    pt: {
      title: "Condicionais: if, else e o ternário",
      prompt: "Fazer o código escolher entre caminhos.",
      body:
        "Um `if` executa um bloco só quando a condição é verdadeira:\n\n```js\nconst hours = 9;\n\nif (hours > 8) {\n  console.log('Hora extra');\n} else if (hours === 8) {\n  console.log('Dia completo');\n} else {\n  console.log('Meio período');\n}\n```\n\nO JavaScript verifica de cima para baixo e executa **só o primeiro** ramo que corresponde.\n\n**Ternário** — um if/else curto que devolve um valor:\n\n```js\nconst label = hours > 8 ? 'Hora extra' : 'Normal';\n```\n\nLeia assim: condição **?** valor se verdadeiro **:** valor se falso. Muito comum no React: `{isLoading ? <Spinner /> : <List />}`.\n\n**Early return (retorno antecipado)** deixa o código plano e fácil de ler:\n\n```js\nfunction canEdit(user) {\n  if (!user) return false;        // parar cedo\n  if (user.role === 'admin') return true;\n  return user.isOwner;\n}\n```",
      keyPoints: [
        "if / else if / else — só o primeiro ramo que corresponde roda",
        "Ternário: condição ? valorSeVerdadeiro : valorSeFalso",
        "Early return evita muitos níveis de aninhamento",
        "Ternários estão por todo lado no JSX do React",
      ],
    },
  },
  {
    id: "lesson-loops",
    kind: "lesson",
    topic: "js-control-flow",
    title: "Loops: for, for…of and while",
    prompt: "Repeating code without copying it.",
    difficulty: 1,
    estimatedMin: 8,
    tags: ["basics", "javascript"],
    body:
      "A **loop** repeats a block of code.\n\n**Classic `for`** — when you need a counter:\n\n```js\nfor (let i = 0; i < 3; i++) {\n  console.log(i); // 0, 1, 2\n}\n```\n\nThree parts: start (`let i = 0`), condition to keep going (`i < 3`), step after each round (`i++` = add 1).\n\n**`for…of`** — go through every item of an array (or every character of a string). The most readable:\n\n```js\nconst prices = [10, 20, 5];\nlet total = 0;\nfor (const price of prices) {\n  total += price; // same as total = total + price\n}\nconsole.log(total); // 35\n```\n\n**`while`** — repeat while a condition is true (careful not to create an infinite loop):\n\n```js\nlet n = 3;\nwhile (n > 0) {\n  console.log(n);\n  n--; // without this line the loop never ends\n}\n```\n\n- `break` exits the loop now. `continue` skips to the next round.\n- The pattern **\"accumulator\"** (start with `0` or `[]`, update inside the loop, use after) solves many interview exercises.",
    keyPoints: [
      "for (start; condition; step) when you need an index",
      "for…of to go through each item of an array or string",
      "while repeats while a condition is true — avoid infinite loops",
      "Accumulator pattern: start a variable, update it in the loop",
    ],
    pt: {
      title: "Loops: for, for…of e while",
      prompt: "Repetir código sem copiar e colar.",
      body:
        "Um **loop** repete um bloco de código.\n\n**`for` clássico** — quando você precisa de um contador:\n\n```js\nfor (let i = 0; i < 3; i++) {\n  console.log(i); // 0, 1, 2\n}\n```\n\nTrês partes: início (`let i = 0`), condição para continuar (`i < 3`) e passo depois de cada volta (`i++` = somar 1).\n\n**`for…of`** — passar por cada item de um array (ou cada letra de uma string). É o mais legível:\n\n```js\nconst prices = [10, 20, 5];\nlet total = 0;\nfor (const price of prices) {\n  total += price; // o mesmo que total = total + price\n}\nconsole.log(total); // 35\n```\n\n**`while`** — repete enquanto a condição for verdadeira (cuidado para não criar um loop infinito):\n\n```js\nlet n = 3;\nwhile (n > 0) {\n  console.log(n);\n  n--; // sem esta linha o loop nunca termina\n}\n```\n\n- `break` sai do loop agora. `continue` pula para a próxima volta.\n- O padrão **\"acumulador\"** (começar com `0` ou `[]`, atualizar dentro do loop, usar depois) resolve muitos exercícios de entrevista.",
      keyPoints: [
        "for (início; condição; passo) quando precisa de um índice",
        "for…of para passar por cada item de um array ou string",
        "while repete enquanto a condição for verdadeira — evite loops infinitos",
        "Padrão acumulador: criar uma variável e atualizá-la no loop",
      ],
    },
  },
  {
    id: "lesson-functions",
    kind: "lesson",
    topic: "js-functions",
    title: "Functions: parameters and return",
    prompt: "Packing code into reusable pieces.",
    difficulty: 1,
    estimatedMin: 10,
    tags: ["basics", "javascript"],
    body:
      "A **function** is a reusable block of code. It receives inputs (**parameters**) and gives back an output (**return value**).\n\n```js\nfunction add(a, b) {   // a and b are parameters\n  return a + b;        // return sends the result back\n}\n\nconst result = add(2, 3); // 2 and 3 are arguments\nconsole.log(result);      // 5\n```\n\n- **Parameter** = the name in the definition (`a`). **Argument** = the real value you pass (`2`).\n- `return` ends the function immediately. Without `return`, the function returns `undefined`.\n\n**Arrow function** — a shorter way, very common in modern code and React:\n\n```js\nconst add = (a, b) => a + b;          // one expression: return is automatic\nconst greet = (name) => {\n  const msg = `Hello, ${name}!`;\n  return msg;                          // with { } you need return\n};\n```\n\n**With TypeScript** you also write the types:\n\n```ts\nfunction add(a: number, b: number): number {\n  return a + b;\n}\n```\n\nGood functions do **one thing**, have a clear name (a verb: `calculateTotal`, `isValid`) and, when possible, are **pure**: same input → same output, no side effects. Pure functions are easy to test.",
    keyPoints: [
      "Parameters are the inputs; return is the output",
      "Without return, a function returns undefined",
      "Arrow function: (a, b) => a + b",
      "One job per function, verb names, pure when possible",
    ],
    pt: {
      title: "Funções: parâmetros e return",
      prompt: "Empacotar código em peças reutilizáveis.",
      body:
        "Uma **função** é um bloco de código reutilizável. Recebe entradas (**parâmetros**) e devolve uma saída (**valor de retorno**).\n\n```js\nfunction add(a, b) {   // a e b são parâmetros\n  return a + b;        // return devolve o resultado\n}\n\nconst result = add(2, 3); // 2 e 3 são argumentos\nconsole.log(result);      // 5\n```\n\n- **Parâmetro** = o nome na definição (`a`). **Argumento** = o valor real que você passa (`2`).\n- `return` termina a função na hora. Sem `return`, a função devolve `undefined`.\n\n**Arrow function** — uma forma mais curta, muito comum em código moderno e no React:\n\n```js\nconst add = (a, b) => a + b;          // uma expressão: o return é automático\nconst greet = (name) => {\n  const msg = `Olá, ${name}!`;\n  return msg;                          // com { } precisa de return\n};\n```\n\n**Com TypeScript** você também escreve os tipos:\n\n```ts\nfunction add(a: number, b: number): number {\n  return a + b;\n}\n```\n\nBoas funções fazem **uma coisa**, têm um nome claro (um verbo: `calculateTotal`, `isValid`) e, quando possível, são **puras**: mesma entrada → mesma saída, sem efeitos colaterais. Funções puras são fáceis de testar.",
      keyPoints: [
        "Parâmetros são as entradas; return é a saída",
        "Sem return, uma função devolve undefined",
        "Arrow function: (a, b) => a + b",
        "Uma tarefa por função, nomes com verbo, puras quando possível",
      ],
    },
  },
];

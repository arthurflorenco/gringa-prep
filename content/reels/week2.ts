import type { ReelSceneInput } from "@/lib/content/schema";

/** Reels da semana 2 — JavaScript do zero. */
export const reels: Record<string, ReelSceneInput[]> = {
  "lesson-js-first-steps": [
    {
      type: "title",
      say: "JavaScript is the language that makes pages come alive. It runs in the browser, and on the server with Node.",
      headline: "JavaScript: first steps",
      sub: "console.log and reading errors",
      pt: {
        say: "JavaScript é a linguagem que dá vida às páginas. Ela roda no navegador, e no servidor com o Node.",
        headline: "JavaScript: primeiros passos",
        sub: "console.log e ler erros",
      },
    },
    {
      type: "code",
      say: "Your first tool is console dot log. It prints a value so you can see what your code is doing.",
      code: "console.log('Hello!');\nconsole.log(2 + 3);   // 5\nconst name = 'Ana';\nconsole.log('Name:', name);",
      highlight: [1, 4],
      pt: {
        say: "A sua primeira ferramenta é o console ponto log. Ele mostra um valor para você ver o que o código está fazendo.",
        code: "console.log('Olá!');\nconsole.log(2 + 3);   // 5\nconst name = 'Ana';\nconsole.log('Nome:', name);",
      },
    },
    {
      type: "flow",
      say: "Where do you see it? Open DevTools with Command Option I, go to the Console tab, and read the output and the errors.",
      steps: ["`Cmd + Option + I`", "Console tab", "See values and errors"],
      pt: {
        say: "Onde você vê isso? Abra o DevTools com Command Option I, vá para a aba Console, e leia os valores e os erros.",
        steps: ["`Cmd + Option + I`", "Aba Console", "Ver valores e erros"],
      },
    },
    {
      type: "code",
      say: "Reading errors is a skill. This one means: you wrote something dot name, but something is undefined.",
      code: "TypeError: Cannot read properties\n  of undefined (reading 'name')",
      highlight: [2],
      pt: { say: "Ler erros é uma habilidade. Este quer dizer: você escreveu alguma coisa ponto name, mas essa coisa é undefined." },
    },
    {
      type: "quiz",
      say: "Quick check. You get this error: cannot read properties of undefined, reading name. What's the problem?",
      question: "`Cannot read properties of undefined (reading 'name')` — what's wrong?",
      options: ["`name` is misspelled", "The thing before `.name` is `undefined`", "The browser is broken"],
      answerIndex: 1,
      why: "You tried `x.name` while `x` was `undefined`. `console.log(x)` before that line.",
      pt: {
        say: "Pergunta rápida. Aparece este erro: cannot read properties of undefined, reading name. Qual é o problema?",
        question: "`Cannot read properties of undefined (reading 'name')` — o que está errado?",
        options: ["`name` está escrito errado", "O que vem antes de `.name` é `undefined`", "O navegador está quebrado"],
        why: "Você tentou `x.name` com o `x` valendo `undefined`. Faça `console.log(x)` antes dessa linha.",
      },
    },
    {
      type: "list",
      say: "Two more things. Comments start with two slashes and are ignored. And TypeScript is just JavaScript plus types.",
      items: ["`// comment` — ignored by JS", "TypeScript = JavaScript + types", "Everything you learn here works in TS"],
      pt: {
        say: "Mais duas coisas. Comentários começam com duas barras e são ignorados. E TypeScript é só JavaScript mais tipos.",
        items: ["`// comentário` — o JS ignora", "TypeScript = JavaScript + tipos", "Tudo o que você aprende aqui funciona em TS"],
      },
    },
  ],

  "lesson-variables-types": [
    {
      type: "title",
      say: "A variable is a name that holds a value. Like a labelled box.",
      headline: "Variables & types",
      sub: "const, let and the basic types",
      pt: {
        say: "Uma variável é um nome que guarda um valor. Como uma caixa com etiqueta.",
        headline: "Variáveis e tipos",
        sub: "const, let e os tipos básicos",
      },
    },
    {
      type: "compare",
      say: "Use const by default: it can't be reassigned. Use let only when the value must change. Avoid var.",
      left: { label: "const", items: ["Can't be reassigned", "Use by default", "`const city = 'Zurich'`"] },
      right: { label: "let", items: ["Can change", "Counters, totals", "`let age = 30; age = 31`"] },
      pt: {
        say: "Use const por padrão: ela não pode ser reatribuída. Use let só quando o valor precisa mudar. Evite var.",
        left: { label: "const", items: ["Não pode ser reatribuída", "Use por padrão", "`const city = 'Zurich'`"] },
        right: { label: "let", items: ["Pode mudar", "Contadores, totais", "`let age = 30; age = 31`"] },
      },
    },
    {
      type: "list",
      say: "The basic types. String is text. Number is a number. Boolean is true or false. Undefined means no value yet. Null means empty on purpose.",
      items: ["string — `'hello'`", "number — `42`, `3.14`", "boolean — `true` / `false`", "undefined — no value yet", "null — empty on purpose"],
      pt: {
        say: "Os tipos básicos. String é texto. Number é número. Boolean é verdadeiro ou falso. Undefined é sem valor ainda. Null é vazio de propósito.",
        items: ["string — `'olá'`", "number — `42`, `3.14`", "boolean — `true` / `false`", "undefined — sem valor ainda", "null — vazio de propósito"],
      },
    },
    {
      type: "quiz",
      say: "Quick check. A counter that goes up every click. const or let?",
      question: "A counter that goes up on every click: `const` or `let`?",
      options: ["`const`", "`let`", "`var`"],
      answerIndex: 1,
      why: "The value changes, so `let`. `const` would throw an error on reassign.",
      pt: {
        say: "Pergunta rápida. Um contador que sobe a cada clique. const ou let?",
        question: "Um contador que sobe a cada clique: `const` ou `let`?",
        options: ["`const`", "`let`", "`var`"],
        why: "O valor muda, por isso `let`. Com `const` daria erro ao reatribuir.",
      },
    },
    {
      type: "code",
      say: "Objects group values by key. Arrays are ordered lists, and the first position is zero.",
      code: "const user = { name: 'Ana', age: 30 };\nconst tags = ['js', 'react'];\nconsole.log(user.name, tags[0]); // Ana js",
      highlight: [3],
      pt: { say: "Objetos agrupam valores por chave. Arrays são listas ordenadas, e a primeira posição é zero." },
    },
    {
      type: "quiz",
      say: "Last one. What is typeof 42?",
      question: "`typeof 42` returns…",
      options: ["`'string'`", "`'number'`", "`'boolean'`"],
      answerIndex: 1,
      why: "42 is a number. `typeof '42'` (with quotes) would be `'string'`.",
      pt: {
        say: "Última. Quanto dá typeof 42?",
        question: "`typeof 42` devolve…",
        options: ["`'string'`", "`'number'`", "`'boolean'`"],
        why: "42 é um número. `typeof '42'` (com aspas) seria `'string'`.",
      },
    },
  ],

  "lesson-operators": [
    {
      type: "title",
      say: "Operators do maths, compare values and combine conditions. A few of them hide classic traps.",
      headline: "Operators",
      sub: "Maths, ===, && and ||",
      pt: {
        say: "Operadores fazem contas, comparam valores e combinam condições. Alguns escondem armadilhas clássicas.",
        headline: "Operadores",
        sub: "Contas, ===, && e ||",
      },
    },
    {
      type: "code",
      say: "The percent sign gives the remainder of a division. A number is even when the remainder by two is zero.",
      code: "10 % 3      // 1\n7 % 2       // 1 → odd\n8 % 2 === 0 // true → even",
      highlight: [3],
      pt: {
        say: "O sinal de porcentagem dá o resto da divisão. Um número é par quando o resto por dois é zero.",
        code: "10 % 3      // 1\n7 % 2       // 1 → ímpar\n8 % 2 === 0 // true → par",
      },
    },
    {
      type: "code",
      say: "Careful: plus with a string joins text. Convert to a number first.",
      code: "'2' + 2          // '22'  (text!)\nNumber('2') + 2  // 4",
      highlight: [1],
      pt: {
        say: "Cuidado: o mais com uma string junta texto. Converta para número primeiro.",
        code: "'2' + 2          // '22'  (texto!)\nNumber('2') + 2  // 4",
      },
    },
    {
      type: "compare",
      say: "Always use triple equals. It checks the value and the type. Double equals converts types and causes bugs.",
      left: { label: "== avoid", items: ["`2 == '2'` → true", "Converts types", "Hidden bugs"] },
      right: { label: "=== use", items: ["`2 === '2'` → false", "Value and type", "Predictable"] },
      pt: {
        say: "Use sempre o igual triplo. Ele compara o valor e o tipo. O igual duplo converte tipos e causa bugs.",
        left: { label: "== evitar", items: ["`2 == '2'` → true", "Converte tipos", "Bugs escondidos"] },
        right: { label: "=== usar", items: ["`2 === '2'` → false", "Valor e tipo", "Previsível"] },
      },
    },
    {
      type: "quiz",
      say: "Quick check. What is the result of the string two plus the number two?",
      question: "`'2' + 2` is…",
      options: ["`4`", "`'22'`", "An error"],
      answerIndex: 1,
      why: "With a string, `+` joins text. Use `Number('2') + 2` to get 4.",
      pt: {
        say: "Pergunta rápida. Quanto dá a string dois mais o número dois?",
        question: "`'2' + 2` dá…",
        options: ["`4`", "`'22'`", "Um erro"],
        why: "Com uma string, o `+` junta texto. Use `Number('2') + 2` para dar 4.",
      },
    },
    {
      type: "list",
      say: "Logical operators. And is true if both are true. Or is true if at least one is. Not inverts.",
      items: ["`&&` — AND: both true", "`||` — OR: at least one true", "`!` — NOT: inverts"],
      pt: {
        say: "Operadores lógicos. E é verdadeiro se os dois forem. Ou é verdadeiro se pelo menos um for. Not inverte.",
        items: ["`&&` — E: os dois verdadeiros", "`||` — OU: pelo menos um verdadeiro", "`!` — NÃO: inverte"],
      },
    },
    {
      type: "list",
      say: "Falsy values become false in an if. There are only six: false, zero, empty string, null, undefined and NaN. Everything else is truthy.",
      items: ["`false`, `0`, `''`", "`null`, `undefined`, `NaN`", "Everything else is truthy — even `'0'` and `[]`"],
      pt: {
        say: "Valores falsy viram falso num if. São só seis: false, zero, string vazia, null, undefined e NaN. Todo o resto é truthy.",
        items: ["`false`, `0`, `''`", "`null`, `undefined`, `NaN`", "Todo o resto é truthy — até `'0'` e `[]`"],
      },
    },
    {
      type: "quiz",
      say: "Last one. Which of these values is falsy?",
      question: "Which one is **falsy**?",
      options: ["`'0'`", "`[]`", "`0`", "`'false'`"],
      answerIndex: 2,
      why: "The number `0` is falsy. `'0'` and `'false'` are non-empty strings, so truthy.",
      pt: {
        say: "Última. Qual destes valores é falsy?",
        question: "Qual é **falsy**?",
        options: ["`'0'`", "`[]`", "`0`", "`'false'`"],
        why: "O número `0` é falsy. `'0'` e `'false'` são strings não vazias, por isso truthy.",
      },
    },
  ],

  "lesson-conditionals": [
    {
      type: "title",
      say: "Code makes decisions with if. If this is true, do that. Otherwise, do something else.",
      headline: "if, else & ternary",
      sub: "Making decisions in code",
      pt: {
        say: "O código toma decisões com o if. Se isto for verdade, faz aquilo. Senão, faz outra coisa.",
        headline: "if, else e ternário",
        sub: "Tomar decisões no código",
      },
    },
    {
      type: "code",
      say: "JavaScript checks from top to bottom and runs only the first branch that matches.",
      code: "if (hours > 8) {\n  console.log('Overtime');\n} else if (hours === 8) {\n  console.log('Full day');\n} else {\n  console.log('Part time');\n}",
      highlight: [1, 3, 5],
      pt: {
        say: "O JavaScript verifica de cima para baixo e roda só o primeiro bloco que bater.",
        code: "if (hours > 8) {\n  console.log('Hora extra');\n} else if (hours === 8) {\n  console.log('Dia completo');\n} else {\n  console.log('Meio período');\n}",
      },
    },
    {
      type: "quiz",
      say: "Quick check. With hours equal to ten, what gets printed?",
      question: "With `hours = 10`, what is printed?",
      options: ["Overtime", "Full day", "Part time", "Overtime and Full day"],
      answerIndex: 0,
      why: "10 > 8 is true, so the first branch runs and the rest is skipped.",
      pt: {
        say: "Pergunta rápida. Com hours igual a dez, o que aparece?",
        question: "Com `hours = 10`, o que aparece?",
        options: ["Hora extra", "Dia completo", "Meio período", "Hora extra e Dia completo"],
        why: "10 > 8 é verdade, então roda o primeiro bloco e o resto é ignorado.",
      },
    },
    {
      type: "code",
      say: "The ternary is a short if else that returns a value. Condition, question mark, value if true, colon, value if false.",
      code: "const label = hours > 8 ? 'Overtime' : 'Normal';\n\n// in React:\n{isLoading ? <Spinner /> : <List />}",
      highlight: [1, 4],
      pt: { say: "O ternário é um if else curto que devolve um valor. Condição, ponto de interrogação, valor se verdade, dois pontos, valor se falso." },
    },
    {
      type: "code",
      say: "Early return: leave the function as soon as you know the answer. The code stays flat and easy to read.",
      code: "function canEdit(user) {\n  if (!user) return false;\n  if (user.role === 'admin') return true;\n  return user.isOwner;\n}",
      highlight: [2, 3],
      pt: { say: "Early return: saia da função assim que souber a resposta. O código fica plano e fácil de ler." },
    },
    {
      type: "quiz",
      say: "Last one. What does age greater or equal to eighteen, question mark, adult, colon, minor, return when age is sixteen?",
      question: "`age >= 18 ? 'adult' : 'minor'` with `age = 16`?",
      options: ["`'adult'`", "`'minor'`", "`true`"],
      answerIndex: 1,
      why: "16 >= 18 is false, so it returns the value after the `:`.",
      pt: {
        say: "Última. age maior ou igual a dezoito, interrogação, adult, dois pontos, minor. Com age igual a dezesseis, o que devolve?",
        question: "`age >= 18 ? 'adult' : 'minor'` com `age = 16`?",
        options: ["`'adult'`", "`'minor'`", "`true`"],
        why: "16 >= 18 é falso, então devolve o valor depois dos `:`.",
      },
    },
  ],

  "lesson-loops": [
    {
      type: "title",
      say: "A loop repeats a block of code. Instead of writing the same line ten times, you write it once.",
      headline: "Loops",
      sub: "for, for…of and while",
      pt: {
        say: "Um loop repete um bloco de código. Em vez de escrever a mesma linha dez vezes, você escreve uma vez.",
        headline: "Loops",
        sub: "for, for…of e while",
      },
    },
    {
      type: "code",
      say: "The classic for has three parts: where it starts, the condition to keep going, and the step after each round.",
      code: "for (let i = 0; i < 3; i++) {\n  console.log(i); // 0, 1, 2\n}",
      highlight: [1],
      pt: { say: "O for clássico tem três partes: onde começa, a condição para continuar, e o passo depois de cada volta." },
    },
    {
      type: "quiz",
      say: "Quick check. How many times does this loop run, with i starting at zero and i less than three?",
      question: "`for (let i = 0; i < 3; i++)` runs how many times?",
      options: ["2", "3", "4"],
      answerIndex: 1,
      why: "i = 0, 1, 2 → three times. When i becomes 3, `i < 3` is false and it stops.",
      pt: {
        say: "Pergunta rápida. Quantas vezes este loop roda, com i começando em zero e i menor que três?",
        question: "`for (let i = 0; i < 3; i++)` roda quantas vezes?",
        options: ["2", "3", "4"],
        why: "i = 0, 1, 2 → três vezes. Quando i vira 3, `i < 3` é falso e para.",
      },
    },
    {
      type: "code",
      say: "for of goes through every item of an array. This is the accumulator pattern: start at zero, add inside the loop, use it after.",
      code: "const prices = [10, 20, 5];\nlet total = 0;\nfor (const price of prices) {\n  total += price;\n}\nconsole.log(total); // 35",
      highlight: [2, 4],
      pt: { say: "O for of passa por cada item de um array. Este é o padrão acumulador: começa em zero, soma dentro do loop, e usa depois." },
    },
    {
      type: "code",
      say: "while repeats while a condition is true. Don't forget to change the variable, or the loop never ends.",
      code: "let n = 3;\nwhile (n > 0) {\n  console.log(n);\n  n--; // without this: infinite loop\n}",
      highlight: [4],
      pt: {
        say: "O while repete enquanto a condição for verdadeira. Não esqueça de mudar a variável, senão o loop nunca acaba.",
        code: "let n = 3;\nwhile (n > 0) {\n  console.log(n);\n  n--; // sem isto: loop infinito\n}",
      },
    },
    {
      type: "list",
      say: "Two keywords. break exits the loop now. continue skips to the next round.",
      items: ["`break` — exit the loop now", "`continue` — skip to the next round", "Accumulator: start, update in the loop, use after"],
      pt: {
        say: "Duas palavras-chave. break sai do loop agora. continue pula para a próxima volta.",
        items: ["`break` — sair do loop agora", "`continue` — pular para a próxima volta", "Acumulador: começar, atualizar no loop, usar depois"],
      },
    },
    {
      type: "quiz",
      say: "Last one. You want to sum all numbers in an array. What's the first step?",
      question: "Summing an array — first step?",
      options: ["`let total = 0` before the loop", "`total = 0` inside the loop", "Use `while (true)`"],
      answerIndex: 0,
      why: "The accumulator starts **before** the loop; inside, you only add to it.",
      pt: {
        say: "Última. Você quer somar todos os números de um array. Qual é o primeiro passo?",
        question: "Somar um array — primeiro passo?",
        options: ["`let total = 0` antes do loop", "`total = 0` dentro do loop", "Usar `while (true)`"],
        why: "O acumulador começa **antes** do loop; lá dentro você só vai somando.",
      },
    },
  ],

  "lesson-functions": [
    {
      type: "title",
      say: "A function is a reusable block of code. It receives inputs and gives back an output.",
      headline: "Functions",
      sub: "Parameters and return",
      pt: {
        say: "Uma função é um bloco de código reutilizável. Ela recebe entradas e devolve uma saída.",
        headline: "Funções",
        sub: "Parâmetros e return",
      },
    },
    {
      type: "flow",
      say: "Think of a machine. Inputs go in as parameters, the function does its work, and return sends the result back.",
      steps: ["Inputs: `2`, `3`", "`add(a, b)` does the work", "`return a + b`", "Output: `5`"],
      pt: {
        say: "Pense numa máquina. As entradas entram como parâmetros, a função faz o trabalho, e o return devolve o resultado.",
        steps: ["Entradas: `2`, `3`", "`add(a, b)` faz o trabalho", "`return a + b`", "Saída: `5`"],
      },
    },
    {
      type: "code",
      say: "a and b are parameters, the names in the definition. Two and three are arguments, the real values you pass.",
      code: "function add(a, b) {\n  return a + b;\n}\n\nconst result = add(2, 3); // 5",
      highlight: [1, 5],
      pt: { say: "a e b são parâmetros, os nomes na definição. Dois e três são argumentos, os valores reais que você passa." },
    },
    {
      type: "quiz",
      say: "Quick check. A function without return. What does it give back?",
      question: "A function with no `return` gives back…",
      options: ["`0`", "`null`", "`undefined`", "An error"],
      answerIndex: 2,
      why: "Without `return`, every function returns `undefined`.",
      pt: {
        say: "Pergunta rápida. Uma função sem return. O que ela devolve?",
        question: "Uma função sem `return` devolve…",
        options: ["`0`", "`null`", "`undefined`", "Um erro"],
        why: "Sem `return`, toda função devolve `undefined`.",
      },
    },
    {
      type: "code",
      say: "The arrow function is a shorter way, used everywhere in React. With one expression, the return is automatic.",
      code: "const add = (a, b) => a + b;\n\nconst greet = (name) => {\n  return `Hello, ${name}!`;\n};",
      highlight: [1],
      pt: {
        say: "A arrow function é uma forma mais curta, usada em todo lado no React. Com uma só expressão, o return é automático.",
        code: "const add = (a, b) => a + b;\n\nconst greet = (name) => {\n  return `Olá, ${name}!`;\n};",
      },
    },
    {
      type: "list",
      say: "Good functions do one thing, have a verb as name, and when possible are pure: same input, same output, no side effects.",
      items: ["One job per function", "Verb names: `calculateTotal`, `isValid`", "Pure: same input → same output", "Pure functions are easy to test"],
      pt: {
        say: "Boas funções fazem uma coisa só, têm um verbo no nome, e quando possível são puras: mesma entrada, mesma saída, sem efeitos colaterais.",
        items: ["Uma tarefa por função", "Nome com verbo: `calculateTotal`, `isValid`", "Pura: mesma entrada → mesma saída", "Funções puras são fáceis de testar"],
      },
    },
    {
      type: "quiz",
      say: "Last one. In add of two and three, what are two and three?",
      question: "In `add(2, 3)`, what are `2` and `3`?",
      options: ["Parameters", "Arguments", "Return values"],
      answerIndex: 1,
      why: "Arguments are the real values you pass; parameters are the names `a` and `b`.",
      pt: {
        say: "Última. Em add de dois e três, o que são o dois e o três?",
        question: "Em `add(2, 3)`, o que são `2` e `3`?",
        options: ["Parâmetros", "Argumentos", "Valores de retorno"],
        why: "Argumentos são os valores reais que você passa; parâmetros são os nomes `a` e `b`.",
      },
    },
  ],
};

import type { ExerciseInput } from "@/lib/content/schema";

/** Semana 1 — como a web funciona, HTML, CSS, terminal e Git. A ordem do array é a ordem das aulas. */
export const lessons: ExerciseInput[] = [
  {
    id: "lesson-how-web-works",
    kind: "lesson",
    topic: "web-basics",
    title: "How the web works",
    prompt: "What happens between typing a URL and seeing a page.",
    difficulty: 1,
    estimatedMin: 8,
    tags: ["basics"],
    body:
      "Every website is a conversation between two computers: the **client** (your browser) and the **server** (a computer somewhere that stores the site).\n\n**1. You type a URL** like `https://shop.com/products`.\n- `https` is the protocol (the language they talk, encrypted).\n- `shop.com` is the domain (the name of the server).\n- `/products` is the path (which page you want).\n\n**2. DNS finds the address.** Computers don't use names, they use IP addresses like `93.184.216.34`. DNS is the internet's phone book: it turns `shop.com` into an IP.\n\n**3. The browser sends an HTTP request** to that IP: \"GET /products, please\".\n\n**4. The server sends an HTTP response**: a status code (`200` = OK, `404` = not found, `500` = server error) and the content — usually HTML.\n\n**5. The browser renders the page.** It reads three languages:\n- **HTML** = the structure and content (the skeleton).\n- **CSS** = the appearance (colours, layout, fonts).\n- **JavaScript** = the behaviour (clicks, forms, updating the page without reloading).\n\nThe front-end is everything that runs in the browser. The back-end is what runs on the server (logic, database).",
    keyPoints: [
      "Client = browser that asks; server = computer that answers",
      "DNS translates a domain name into an IP address",
      "HTTP request → HTTP response with a status code (200, 404, 500)",
      "HTML = structure, CSS = style, JavaScript = behaviour",
    ],
    pt: {
      title: "Como a web funciona",
      prompt: "O que acontece entre digitar uma URL e ver a página.",
      body:
        "Todo site é uma conversa entre dois computadores: o **cliente** (o seu navegador) e o **servidor** (um computador em algum lugar que guarda o site).\n\n**1. Você digita uma URL** como `https://shop.com/products`.\n- `https` é o protocolo (a língua em que eles conversam, criptografada).\n- `shop.com` é o domínio (o nome do servidor).\n- `/products` é o caminho (que página você quer).\n\n**2. O DNS encontra o endereço.** Computadores não usam nomes, usam endereços IP como `93.184.216.34`. O DNS é a lista telefônica da internet: transforma `shop.com` num IP.\n\n**3. O navegador envia um pedido HTTP (request)** para esse IP: \"GET /products, por favor\".\n\n**4. O servidor manda uma resposta HTTP (response)**: um código de status (`200` = OK, `404` = não encontrado, `500` = erro no servidor) e o conteúdo — normalmente HTML.\n\n**5. O navegador desenha a página.** Ele lê três linguagens:\n- **HTML** = a estrutura e o conteúdo (o esqueleto).\n- **CSS** = a aparência (cores, layout, fontes).\n- **JavaScript** = o comportamento (cliques, formulários, atualizar a página sem recarregar).\n\nO front-end é tudo o que roda no navegador. O back-end é o que roda no servidor (lógica, base de dados).",
      keyPoints: [
        "Cliente = navegador que pede; servidor = computador que responde",
        "O DNS traduz um nome de domínio num endereço IP",
        "Pedido HTTP → resposta HTTP com código de status (200, 404, 500)",
        "HTML = estrutura, CSS = estilo, JavaScript = comportamento",
      ],
    },
  },
  {
    id: "lesson-html-basics",
    kind: "lesson",
    topic: "html",
    title: "HTML: the structure of a page",
    prompt: "Tags, elements, attributes and semantic HTML.",
    difficulty: 1,
    estimatedMin: 8,
    tags: ["basics", "html"],
    body:
      "HTML describes **what** is on the page. It is made of **elements**, written with **tags**:\n\n```html\n<h1>Hello</h1>\n<p>This is a <strong>paragraph</strong>.</p>\n<a href=\"https://google.com\">Go to Google</a>\n<img src=\"cat.png\" alt=\"A sleeping cat\" />\n```\n\n- `<h1>` opens, `</h1>` closes. What's between them is the content.\n- `href`, `src` and `alt` are **attributes**: extra information about the element.\n- Some elements have no content and close themselves, like `<img />`.\n\n**Basic page structure:**\n\n```html\n<!doctype html>\n<html lang=\"en\">\n  <head>\n    <title>My site</title>\n  </head>\n  <body>\n    <header>…</header>\n    <main>…</main>\n    <footer>…</footer>\n  </body>\n</html>\n```\n\n`<head>` has information about the page (title, fonts). `<body>` has what the user sees.\n\n**Semantic HTML** means using the tag that describes the meaning: `<button>` for buttons (not a `<div>` with a click), `<nav>` for navigation, `<main>`, `<article>`, `<form>`, `<label>`. It helps screen readers (accessibility), SEO and other developers.",
    keyPoints: [
      "Element = opening tag + content + closing tag",
      "Attributes add information: href, src, alt, class, id",
      "<head> = information about the page; <body> = visible content",
      "Semantic tags (button, nav, main, form) help accessibility and SEO",
    ],
    pt: {
      title: "HTML: a estrutura de uma página",
      prompt: "Tags, elementos, atributos e HTML semântico.",
      body:
        "O HTML descreve **o que** existe na página. Ele é feito de **elementos**, escritos com **tags**:\n\n```html\n<h1>Olá</h1>\n<p>Isto é um <strong>parágrafo</strong>.</p>\n<a href=\"https://google.com\">Ir para o Google</a>\n<img src=\"gato.png\" alt=\"Um gato dormindo\" />\n```\n\n- `<h1>` abre, `</h1>` fecha. O que fica no meio é o conteúdo.\n- `href`, `src` e `alt` são **atributos**: informação extra sobre o elemento.\n- Alguns elementos não têm conteúdo e se fecham sozinhos, como `<img />`.\n\n**Estrutura básica de uma página:**\n\n```html\n<!doctype html>\n<html lang=\"pt\">\n  <head>\n    <title>Meu site</title>\n  </head>\n  <body>\n    <header>…</header>\n    <main>…</main>\n    <footer>…</footer>\n  </body>\n</html>\n```\n\nO `<head>` tem informação sobre a página (título, fontes). O `<body>` tem o que o usuário vê.\n\n**HTML semântico** é usar a tag que descreve o significado: `<button>` para botões (não uma `<div>` com clique), `<nav>` para navegação, `<main>`, `<article>`, `<form>`, `<label>`. Isso ajuda leitores de tela (acessibilidade), SEO e outros desenvolvedores.",
      keyPoints: [
        "Elemento = tag de abertura + conteúdo + tag de fecho",
        "Atributos acrescentam informação: href, src, alt, class, id",
        "<head> = informação sobre a página; <body> = conteúdo visível",
        "Tags semânticas (button, nav, main, form) ajudam acessibilidade e SEO",
      ],
    },
  },
  {
    id: "lesson-css-basics",
    kind: "lesson",
    topic: "css-basics",
    title: "CSS: selectors, box model and flexbox",
    prompt: "How to style elements and place them on the page.",
    difficulty: 1,
    estimatedMin: 10,
    tags: ["basics", "css"],
    body:
      "CSS says **how** elements look. A CSS rule has a **selector** (which elements) and **declarations** (property: value):\n\n```css\n.card {\n  color: #333;\n  padding: 16px;\n  border: 1px solid #ddd;\n}\n```\n\n**Selectors you must know:**\n- `p` — every `<p>` element\n- `.card` — every element with `class=\"card\"` (reusable, the most used)\n- `#header` — the element with `id=\"header\"` (unique on the page)\n\n**The box model.** Every element is a box made of 4 layers, from inside to outside:\n- **content** → **padding** (space inside the border) → **border** → **margin** (space outside, between boxes).\n- Use `box-sizing: border-box` so `width` includes padding and border (Tailwind does this by default).\n\n**Flexbox** puts children in a row or column and aligns them:\n\n```css\n.row {\n  display: flex;\n  justify-content: space-between; /* main axis (horizontal) */\n  align-items: center;            /* cross axis (vertical) */\n  gap: 12px;\n}\n```\n\nCentering something both ways: `display: flex; justify-content: center; align-items: center;`.\n\n**Responsive** = the layout adapts to the screen, using media queries (`@media (min-width: 768px) { … }`). In Tailwind, `md:flex` means \"flex from medium screens up\".",
    keyPoints: [
      "Rule = selector + { property: value }",
      ".class is reusable; #id is unique",
      "Box model: content → padding → border → margin",
      "Flexbox: display:flex + justify-content (main axis) + align-items (cross axis)",
    ],
    pt: {
      title: "CSS: seletores, box model e flexbox",
      prompt: "Como estilizar elementos e posicioná-los na página.",
      body:
        "O CSS diz **como** os elementos aparecem. Uma regra CSS tem um **seletor** (que elementos) e **declarações** (propriedade: valor):\n\n```css\n.card {\n  color: #333;\n  padding: 16px;\n  border: 1px solid #ddd;\n}\n```\n\n**Seletores que você precisa saber:**\n- `p` — todos os elementos `<p>`\n- `.card` — todos os elementos com `class=\"card\"` (reutilizável, o mais usado)\n- `#header` — o elemento com `id=\"header\"` (único na página)\n\n**O box model (modelo de caixa).** Todo elemento é uma caixa com 4 camadas, de dentro para fora:\n- **conteúdo** → **padding** (espaço dentro da borda) → **border** (borda) → **margin** (espaço de fora, entre caixas).\n- Use `box-sizing: border-box` para o `width` incluir o padding e a borda (o Tailwind já faz isso).\n\n**Flexbox** coloca os filhos em linha ou coluna e alinha-os:\n\n```css\n.row {\n  display: flex;\n  justify-content: space-between; /* eixo principal (horizontal) */\n  align-items: center;            /* eixo cruzado (vertical) */\n  gap: 12px;\n}\n```\n\nCentralizar nos dois sentidos: `display: flex; justify-content: center; align-items: center;`.\n\n**Responsivo** = o layout se adapta à tela, usando media queries (`@media (min-width: 768px) { … }`). No Tailwind, `md:flex` significa \"flex a partir de telas médias\".",
      keyPoints: [
        "Regra = seletor + { propriedade: valor }",
        ".classe é reutilizável; #id é único",
        "Box model: conteúdo → padding → border → margin",
        "Flexbox: display:flex + justify-content (eixo principal) + align-items (eixo cruzado)",
      ],
    },
  },
  {
    id: "lesson-terminal",
    kind: "lesson",
    topic: "terminal-git",
    title: "The terminal: the 8 commands you need",
    prompt: "Moving around folders and running a project from the terminal.",
    difficulty: 1,
    estimatedMin: 7,
    tags: ["basics", "terminal"],
    body:
      "The terminal lets you control the computer by typing commands. Developers use it every day to run projects, install packages and use Git.\n\n```bash\npwd                 # where am I? (print working directory)\nls                  # list files in this folder\ncd projects         # go into the folder \"projects\"\ncd ..               # go back one folder\nmkdir my-app        # create a folder\ntouch index.html    # create an empty file\nnpm install         # install the project's packages (from package.json)\nnpm run dev         # start the project in development mode\n```\n\n**Concepts:**\n- A **path** is the address of a file: `/Users/ana/projects/my-app`.\n- `npm` is the package manager of JavaScript. A **package** is code someone else wrote that you reuse (React, for example). `package.json` lists the project's packages and scripts.\n- `Ctrl + C` stops a running command (like the dev server).\n- `Tab` auto-completes names. Use it — it avoids typos.",
    keyPoints: [
      "pwd, ls, cd, cd .. to move around",
      "mkdir creates folders, touch creates files",
      "npm install installs packages; npm run dev starts the project",
      "Ctrl + C stops a running command",
    ],
    pt: {
      title: "O terminal: os 8 comandos de que você precisa",
      prompt: "Navegar entre pastas e rodar um projeto pelo terminal.",
      body:
        "O terminal permite controlar o computador digitando comandos. Desenvolvedores usam todos os dias para rodar projetos, instalar pacotes e usar o Git.\n\n```bash\npwd                 # onde estou? (print working directory)\nls                  # listar os ficheiros desta pasta\ncd projects         # entrar na pasta \"projects\"\ncd ..               # voltar uma pasta\nmkdir my-app        # criar uma pasta\ntouch index.html    # criar um ficheiro vazio\nnpm install         # instalar os pacotes do projeto (do package.json)\nnpm run dev         # iniciar o projeto em modo de desenvolvimento\n```\n\n**Conceitos:**\n- Um **caminho (path)** é o endereço de um ficheiro: `/Users/ana/projects/my-app`.\n- O `npm` é o gerenciador de pacotes do JavaScript. Um **pacote** é código que outra pessoa escreveu e que você reutiliza (o React, por exemplo). O `package.json` lista os pacotes e scripts do projeto.\n- `Ctrl + C` para um comando que está rodando (como o servidor de desenvolvimento).\n- `Tab` completa nomes automaticamente. Use — evita erros de digitação.",
      keyPoints: [
        "pwd, ls, cd, cd .. para navegar",
        "mkdir cria pastas, touch cria ficheiros",
        "npm install instala pacotes; npm run dev inicia o projeto",
        "Ctrl + C para um comando em execução",
      ],
    },
  },
  {
    id: "lesson-git-basics",
    kind: "lesson",
    topic: "terminal-git",
    title: "Git: commits, branches and pull requests",
    prompt: "Saving versions of your code and working in a team.",
    difficulty: 1,
    estimatedMin: 10,
    tags: ["basics", "git"],
    body:
      "**Git** saves the history of your code: every version, who changed what and why. **GitHub** is a website that hosts Git repositories online so teams can share them.\n\n**Vocabulary:**\n- **Repository (repo)**: a project folder tracked by Git.\n- **Commit**: a saved snapshot of the code, with a message explaining the change.\n- **Branch**: a separate line of work. `main` is the stable one; you create a branch for each feature so you don't break `main`.\n- **Push**: send your commits to GitHub. **Pull**: bring other people's commits to your computer.\n- **Pull request (PR)**: a request to merge your branch into `main`. Teammates review the code before it's merged.\n- **Merge conflict**: when two people changed the same lines; Git asks you to choose.\n\n**The daily flow:**\n\n```bash\ngit switch -c feat/login     # create a branch and move to it\n# … edit files …\ngit status                   # what changed?\ngit add .                    # choose the changes to save\ngit commit -m \"feat: add login form\"\ngit push -u origin feat/login\n# then open a pull request on GitHub\n```\n\nIn interviews, teams want to see that you work in **small commits**, on **branches**, and through **pull requests** with review.",
    keyPoints: [
      "Commit = snapshot of the code with a message",
      "Branch = separate line of work; main stays stable",
      "Push sends to GitHub; pull brings changes from GitHub",
      "Pull request = ask to merge a branch, with code review",
    ],
    pt: {
      title: "Git: commits, branches e pull requests",
      prompt: "Guardar versões do código e trabalhar em equipe.",
      body:
        "O **Git** guarda o histórico do código: cada versão, quem mudou o quê e por quê. O **GitHub** é um site que guarda repositórios Git online para as equipes partilharem.\n\n**Vocabulário:**\n- **Repositório (repo)**: a pasta de um projeto acompanhada pelo Git.\n- **Commit**: uma \"foto\" guardada do código, com uma mensagem explicando a mudança.\n- **Branch**: uma linha de trabalho separada. A `main` é a estável; você cria uma branch para cada funcionalidade para não estragar a `main`.\n- **Push**: enviar os seus commits para o GitHub. **Pull**: trazer os commits dos outros para o seu computador.\n- **Pull request (PR)**: um pedido para juntar a sua branch na `main`. Os colegas revisam o código antes do merge.\n- **Merge conflict (conflito)**: quando duas pessoas mudaram as mesmas linhas; o Git pede para você escolher.\n\n**O fluxo do dia a dia:**\n\n```bash\ngit switch -c feat/login     # criar uma branch e ir para ela\n# … editar ficheiros …\ngit status                   # o que mudou?\ngit add .                    # escolher as mudanças a guardar\ngit commit -m \"feat: add login form\"\ngit push -u origin feat/login\n# depois abrir um pull request no GitHub\n```\n\nNas entrevistas, as equipes querem ver que você trabalha com **commits pequenos**, em **branches** e com **pull requests** revisados.",
      keyPoints: [
        "Commit = foto do código com uma mensagem",
        "Branch = linha de trabalho separada; a main fica estável",
        "Push envia para o GitHub; pull traz mudanças do GitHub",
        "Pull request = pedir para juntar uma branch, com revisão de código",
      ],
    },
  },
];

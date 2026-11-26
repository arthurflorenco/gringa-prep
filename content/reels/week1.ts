import type { ReelSceneInput } from "@/lib/content/schema";

/** Reels da semana 1 (id da aula → cenas). Cada cena: `say` = o que a voz diz. */
export const reels: Record<string, ReelSceneInput[]> = {
  "lesson-how-web-works": [
    {
      type: "title",
      say: "What really happens when you type a website address and press Enter? Let's follow the trip.",
      headline: "How the web works",
      sub: "From URL to page in 5 steps",
      pt: {
        say: "O que acontece de verdade quando você digita o endereço de um site e aperta Enter? Vamos seguir a viagem.",
        headline: "Como a web funciona",
        sub: "Da URL à página em 5 passos",
      },
    },
    {
      type: "compare",
      say: "Every website is a conversation between two computers. The client asks. The server answers.",
      left: { label: "Client", items: ["Your browser", "Asks for pages", "Chrome, Safari, your phone"] },
      right: { label: "Server", items: ["A computer far away", "Stores the site", "Answers the requests"] },
      pt: {
        say: "Todo site é uma conversa entre dois computadores. O cliente pede. O servidor responde.",
        left: { label: "Cliente", items: ["O seu navegador", "Pede as páginas", "Chrome, Safari, o seu celular"] },
        right: { label: "Servidor", items: ["Um computador longe", "Guarda o site", "Responde aos pedidos"] },
      },
    },
    {
      type: "flow",
      say: "Step by step: you type the URL, DNS finds the server's IP address, the browser sends a request, the server sends a response, and the browser draws the page.",
      steps: ["You type `shop.com/products`", "DNS: `shop.com` → `93.184.216.34`", "Browser sends an HTTP request", "Server sends an HTTP response", "Browser renders the page"],
      pt: {
        say: "Passo a passo: você digita a URL, o DNS encontra o endereço IP do servidor, o navegador envia um pedido, o servidor manda uma resposta, e o navegador desenha a página.",
        steps: ["Você digita `shop.com/products`", "DNS: `shop.com` → `93.184.216.34`", "O navegador envia um pedido HTTP", "O servidor manda uma resposta HTTP", "O navegador desenha a página"],
      },
    },
    {
      type: "quiz",
      say: "Quick check. What does DNS do?",
      question: "What does DNS do?",
      options: ["Draws the page", "Turns a domain name into an IP address", "Stores your passwords"],
      answerIndex: 1,
      why: "DNS is the internet's phone book: name in, IP address out.",
      pt: {
        say: "Pergunta rápida. O que o DNS faz?",
        question: "O que o DNS faz?",
        options: ["Desenha a página", "Transforma um nome de domínio num endereço IP", "Guarda as suas senhas"],
        why: "O DNS é a lista telefônica da internet: entra um nome, sai um endereço IP.",
      },
    },
    {
      type: "list",
      say: "The response always brings a status code. 200 means OK. 404 means not found. 500 means the server broke.",
      items: ["`200` — OK, here's your page", "`404` — not found", "`500` — error on the server"],
      pt: {
        say: "A resposta sempre traz um código de status. 200 quer dizer OK. 404 quer dizer não encontrado. 500 quer dizer que o servidor quebrou.",
        items: ["`200` — OK, aqui está a página", "`404` — não encontrado", "`500` — erro no servidor"],
      },
    },
    {
      type: "list",
      say: "The browser reads three languages. HTML is the structure. CSS is the look. JavaScript is the behaviour.",
      items: ["HTML = structure (the skeleton)", "CSS = appearance (colours, layout)", "JavaScript = behaviour (clicks, updates)"],
      pt: {
        say: "O navegador lê três linguagens. HTML é a estrutura. CSS é a aparência. JavaScript é o comportamento.",
        items: ["HTML = estrutura (o esqueleto)", "CSS = aparência (cores, layout)", "JavaScript = comportamento (cliques, atualizações)"],
      },
    },
    {
      type: "quiz",
      say: "Last one. You open a link and see 404. What happened?",
      question: "You open a link and see `404`. What happened?",
      options: ["The server crashed", "The page doesn't exist", "Your internet is off", "Everything is OK"],
      answerIndex: 1,
      why: "404 = not found. A crash on the server would be 500.",
      pt: {
        say: "Última. Você abre um link e aparece 404. O que aconteceu?",
        question: "Você abre um link e aparece `404`. O que aconteceu?",
        options: ["O servidor quebrou", "A página não existe", "A sua internet caiu", "Está tudo OK"],
        why: "404 = não encontrado. Se o servidor quebrasse, seria 500.",
      },
    },
    {
      type: "title",
      say: "Summary: front-end is what runs in the browser. Back-end is what runs on the server. You just learned how they talk.",
      headline: "Front-end ↔ back-end",
      sub: "Browser asks, server answers.",
      pt: {
        say: "Resumo: front-end é o que roda no navegador. Back-end é o que roda no servidor. Você acabou de aprender como eles conversam.",
        headline: "Front-end ↔ back-end",
        sub: "O navegador pede, o servidor responde.",
      },
    },
  ],

  "lesson-html-basics": [
    {
      type: "title",
      say: "HTML describes what is on the page. Titles, text, links, images. Let's see how it's written.",
      headline: "HTML: the skeleton",
      sub: "Tags, elements and attributes",
      pt: {
        say: "O HTML descreve o que existe na página. Títulos, textos, links, imagens. Vamos ver como se escreve.",
        headline: "HTML: o esqueleto",
        sub: "Tags, elementos e atributos",
      },
    },
    {
      type: "code",
      say: "An element has an opening tag, the content, and a closing tag with a slash. This h1 is a big title.",
      code: "<h1>Hello</h1>\n<p>This is a paragraph.</p>",
      highlight: [1],
      pt: {
        say: "Um elemento tem uma tag de abertura, o conteúdo, e uma tag de fecho com barra. Este h1 é um título grande.",
        code: "<h1>Olá</h1>\n<p>Isto é um parágrafo.</p>",
      },
    },
    {
      type: "code",
      say: "Attributes add extra information. href says where the link goes. src says which image. alt describes the image for people who can't see it.",
      code: '<a href="https://google.com">Google</a>\n<img src="cat.png" alt="A sleeping cat" />',
      highlight: [1, 2],
      pt: {
        say: "Atributos acrescentam informação. href diz para onde o link vai. src diz qual imagem. alt descreve a imagem para quem não consegue ver.",
        code: '<a href="https://google.com">Google</a>\n<img src="gato.png" alt="Um gato dormindo" />',
      },
    },
    {
      type: "quiz",
      say: "Quick check. In this link, which part is the attribute?",
      question: 'In `<a href="/about">About</a>`, what is `href`?',
      options: ["The tag", "An attribute", "The content"],
      answerIndex: 1,
      why: "`a` is the tag, `href` is an attribute, and `About` is the content.",
      pt: {
        say: "Pergunta rápida. Neste link, qual parte é o atributo?",
        question: 'Em `<a href="/about">Sobre</a>`, o que é `href`?',
        options: ["A tag", "Um atributo", "O conteúdo"],
        why: "`a` é a tag, `href` é um atributo, e `Sobre` é o conteúdo.",
      },
    },
    {
      type: "compare",
      say: "A page has two parts. The head has information about the page. The body has what the user sees.",
      left: { label: "<head>", items: ["Page title", "Fonts and styles", "Invisible info"] },
      right: { label: "<body>", items: ["Header, main, footer", "Text and images", "Everything you see"] },
      pt: {
        say: "Uma página tem duas partes. O head tem informação sobre a página. O body tem o que o usuário vê.",
        left: { label: "<head>", items: ["Título da página", "Fontes e estilos", "Informação invisível"] },
        right: { label: "<body>", items: ["Header, main, footer", "Textos e imagens", "Tudo o que você vê"] },
      },
    },
    {
      type: "list",
      say: "Semantic HTML means using the tag that describes the meaning. A button for buttons, not a div. It helps accessibility and SEO.",
      items: ["`<button>` for buttons — not a `<div>`", "`<nav>` for navigation", "`<main>`, `<article>`, `<form>`, `<label>`"],
      pt: {
        say: "HTML semântico é usar a tag que descreve o significado. Um button para botões, não uma div. Isso ajuda a acessibilidade e o SEO.",
        items: ["`<button>` para botões — não uma `<div>`", "`<nav>` para navegação", "`<main>`, `<article>`, `<form>`, `<label>`"],
      },
    },
    {
      type: "quiz",
      say: "Last one. Which tag should you use for a clickable button?",
      question: "Best tag for a clickable button?",
      options: ["`<div>`", "`<span>`", "`<button>`", "`<p>`"],
      answerIndex: 2,
      why: "`<button>` works with the keyboard and screen readers for free.",
      pt: {
        say: "Última. Que tag você deve usar para um botão clicável?",
        question: "Melhor tag para um botão clicável?",
        options: ["`<div>`", "`<span>`", "`<button>`", "`<p>`"],
        why: "`<button>` já funciona com teclado e leitores de tela, sem esforço.",
      },
    },
  ],

  "lesson-css-basics": [
    {
      type: "title",
      say: "HTML is the skeleton. CSS is the clothes. It decides colours, spacing and where things go.",
      headline: "CSS: the look",
      sub: "Selectors, box model, flexbox",
      pt: {
        say: "O HTML é o esqueleto. O CSS é a roupa. Ele decide cores, espaçamentos e onde cada coisa fica.",
        headline: "CSS: a aparência",
        sub: "Seletores, box model, flexbox",
      },
    },
    {
      type: "code",
      say: "A CSS rule has a selector, which says which elements, and declarations: property, colon, value.",
      code: ".card {\n  color: #333;\n  padding: 16px;\n}",
      highlight: [1],
      pt: { say: "Uma regra de CSS tem um seletor, que diz quais elementos, e declarações: propriedade, dois pontos, valor." },
    },
    {
      type: "compare",
      say: "The two selectors you'll use most. A class, with a dot, can be reused many times. An id, with a hash, is unique on the page.",
      left: { label: ".class", items: ["Starts with a dot", "Reusable", "The most used"] },
      right: { label: "#id", items: ["Starts with #", "Unique on the page", "Use less"] },
      pt: {
        say: "Os dois seletores que você mais vai usar. Uma classe, com ponto, pode ser reutilizada muitas vezes. Um id, com cerquilha, é único na página.",
        left: { label: ".classe", items: ["Começa com ponto", "Reutilizável", "A mais usada"] },
        right: { label: "#id", items: ["Começa com #", "Único na página", "Usar menos"] },
      },
    },
    {
      type: "flow",
      say: "The box model. Every element is a box. From inside to outside: content, padding, border, and margin.",
      steps: ["content", "padding — space inside", "border", "margin — space outside"],
      pt: {
        say: "O box model. Todo elemento é uma caixa. De dentro para fora: conteúdo, padding, borda e margem.",
        steps: ["conteúdo (content)", "padding — espaço de dentro", "borda (border)", "margin — espaço de fora"],
      },
    },
    {
      type: "quiz",
      say: "Quick check. You want more space between two cards. Which property?",
      question: "More space **between** two cards — which property?",
      options: ["padding", "margin", "color"],
      answerIndex: 1,
      why: "margin is the space outside the box. padding is inside.",
      pt: {
        say: "Pergunta rápida. Você quer mais espaço entre dois cartões. Qual propriedade?",
        question: "Mais espaço **entre** dois cartões — qual propriedade?",
        options: ["padding", "margin", "color"],
        why: "margin é o espaço de fora da caixa. padding é o de dentro.",
      },
    },
    {
      type: "code",
      say: "Flexbox puts children in a row and aligns them. justify-content works on the main axis, align-items on the cross axis.",
      code: ".row {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  gap: 12px;\n}",
      highlight: [2, 3, 4],
      pt: { say: "O flexbox coloca os filhos numa linha e alinha. justify-content trabalha no eixo principal, align-items no eixo cruzado." },
    },
    {
      type: "quiz",
      say: "Last one. How do you center something both horizontally and vertically?",
      question: "Center something both ways?",
      options: ["`display: flex` + `justify-content: center` + `align-items: center`", "`margin: 16px`", "`color: center`"],
      answerIndex: 0,
      why: "That trio is the classic way to center with flexbox.",
      pt: {
        say: "Última. Como você centraliza algo na horizontal e na vertical?",
        question: "Centralizar algo nos dois sentidos?",
        options: ["`display: flex` + `justify-content: center` + `align-items: center`", "`margin: 16px`", "`color: center`"],
        why: "Esse trio é a forma clássica de centralizar com flexbox.",
      },
    },
  ],

  "lesson-terminal": [
    {
      type: "title",
      say: "The terminal lets you control the computer by typing. Developers use it every day. You only need eight commands to start.",
      headline: "The terminal",
      sub: "8 commands you need",
      pt: {
        say: "O terminal deixa você controlar o computador digitando. Desenvolvedores usam todo dia. Para começar, você só precisa de oito comandos.",
        headline: "O terminal",
        sub: "8 comandos de que você precisa",
      },
    },
    {
      type: "code",
      say: "To move around: pwd shows where you are. ls lists the files. cd enters a folder. cd dot dot goes back one folder.",
      code: "pwd           # where am I?\nls            # list files\ncd projects   # enter a folder\ncd ..         # go back one folder",
      highlight: [3, 4],
      pt: {
        say: "Para andar pelas pastas: pwd mostra onde você está. ls lista os arquivos. cd entra numa pasta. cd ponto ponto volta uma pasta.",
        code: "pwd           # onde estou?\nls            # listar arquivos\ncd projects   # entrar numa pasta\ncd ..         # voltar uma pasta",
      },
    },
    {
      type: "code",
      say: "To create things: mkdir creates a folder. touch creates an empty file.",
      code: "mkdir my-app      # create a folder\ntouch index.html  # create a file",
      highlight: [1, 2],
      pt: {
        say: "Para criar coisas: mkdir cria uma pasta. touch cria um arquivo vazio.",
        code: "mkdir my-app      # criar uma pasta\ntouch index.html  # criar um arquivo",
      },
    },
    {
      type: "quiz",
      say: "Quick check. You're inside a folder and want to go back to the previous one. What do you type?",
      question: "Go back one folder?",
      options: ["`cd ..`", "`ls`", "`mkdir ..`", "`pwd`"],
      answerIndex: 0,
      why: "`..` means the parent folder, and `cd` moves you there.",
      pt: {
        say: "Pergunta rápida. Você está dentro de uma pasta e quer voltar para a anterior. O que você digita?",
        question: "Voltar uma pasta?",
        options: ["`cd ..`", "`ls`", "`mkdir ..`", "`pwd`"],
        why: "`..` quer dizer a pasta de cima, e o `cd` leva você até lá.",
      },
    },
    {
      type: "code",
      say: "For JavaScript projects: npm install downloads the packages listed in package.json. npm run dev starts the project.",
      code: "npm install   # install packages\nnpm run dev   # start the project",
      highlight: [1, 2],
      pt: {
        say: "Para projetos JavaScript: npm install baixa os pacotes listados no package.json. npm run dev liga o projeto.",
        code: "npm install   # instalar pacotes\nnpm run dev   # ligar o projeto",
      },
    },
    {
      type: "list",
      say: "Two shortcuts that save your life. Control C stops a running command. Tab completes names for you.",
      items: ["`Ctrl + C` — stop a running command", "`Tab` — auto-complete names", "A package = code someone else wrote that you reuse"],
      pt: {
        say: "Dois atalhos que salvam a sua vida. Control C para um comando que está rodando. Tab completa os nomes para você.",
        items: ["`Ctrl + C` — parar um comando", "`Tab` — completar nomes", "Pacote = código que outra pessoa escreveu e você reutiliza"],
      },
    },
    {
      type: "quiz",
      say: "Last one. The dev server is running and you want to stop it. What do you press?",
      question: "Stop the running dev server?",
      options: ["`Tab`", "`Ctrl + C`", "`cd ..`"],
      answerIndex: 1,
      why: "`Ctrl + C` interrupts whatever is running in the terminal.",
      pt: {
        say: "Última. O servidor de desenvolvimento está rodando e você quer parar. O que você aperta?",
        question: "Parar o servidor que está rodando?",
        options: ["`Tab`", "`Ctrl + C`", "`cd ..`"],
        why: "`Ctrl + C` interrompe o que estiver rodando no terminal.",
      },
    },
  ],

  "lesson-git-basics": [
    {
      type: "title",
      say: "Git saves the history of your code. Every version, who changed what, and why. GitHub keeps it online so the team can share it.",
      headline: "Git & GitHub",
      sub: "Commits, branches, pull requests",
      pt: {
        say: "O Git guarda o histórico do seu código. Cada versão, quem mudou o quê, e porquê. O GitHub guarda isso online para a equipe partilhar.",
        headline: "Git e GitHub",
        sub: "Commits, branches, pull requests",
      },
    },
    {
      type: "list",
      say: "The vocabulary. A repo is a project folder tracked by Git. A commit is a saved snapshot. A branch is a separate line of work.",
      items: ["Repo — a project tracked by Git", "Commit — a snapshot with a message", "Branch — a separate line of work", "`main` — the stable branch"],
      pt: {
        say: "O vocabulário. Um repo é uma pasta de projeto controlada pelo Git. Um commit é uma foto salva do código. Uma branch é uma linha de trabalho separada.",
        items: ["Repo — projeto controlado pelo Git", "Commit — uma foto do código com mensagem", "Branch — linha de trabalho separada", "`main` — a branch estável"],
      },
    },
    {
      type: "compare",
      say: "Push sends your commits to GitHub. Pull brings other people's commits to your computer.",
      left: { label: "push ↑", items: ["Your computer → GitHub", "Share your work"] },
      right: { label: "pull ↓", items: ["GitHub → your computer", "Get the team's work"] },
      pt: {
        say: "Push envia os seus commits para o GitHub. Pull traz os commits das outras pessoas para o seu computador.",
        left: { label: "push ↑", items: ["Seu computador → GitHub", "Partilhar o seu trabalho"] },
        right: { label: "pull ↓", items: ["GitHub → seu computador", "Receber o trabalho da equipe"] },
      },
    },
    {
      type: "quiz",
      say: "Quick check. What is a commit?",
      question: "What is a commit?",
      options: ["A copy of the whole computer", "A saved snapshot of the code with a message", "A message to a teammate"],
      answerIndex: 1,
      why: "A commit is a snapshot of your code, with a message saying what changed.",
      pt: {
        say: "Pergunta rápida. O que é um commit?",
        question: "O que é um commit?",
        options: ["Uma cópia do computador inteiro", "Uma foto salva do código com uma mensagem", "Uma mensagem para um colega"],
        why: "Um commit é uma foto do código, com uma mensagem a dizer o que mudou.",
      },
    },
    {
      type: "code",
      say: "The daily flow. Create a branch, change files, add, commit with a clear message, and push.",
      code: 'git switch -c feat/login\ngit status\ngit add .\ngit commit -m "feat: add login form"\ngit push -u origin feat/login',
      highlight: [1, 4],
      pt: { say: "O fluxo do dia a dia. Criar uma branch, mudar arquivos, add, commit com uma mensagem clara, e push." },
    },
    {
      type: "flow",
      say: "Then you open a pull request. A teammate reviews the code, and only then it's merged into main.",
      steps: ["Branch `feat/login`", "Pull request", "Code review", "Merge into `main`"],
      pt: {
        say: "Depois você abre um pull request. Um colega revisa o código, e só então ele entra na main.",
        steps: ["Branch `feat/login`", "Pull request", "Revisão de código", "Merge na `main`"],
      },
    },
    {
      type: "quiz",
      say: "Last one. Why work on a branch instead of directly on main?",
      question: "Why work on a branch, not directly on `main`?",
      options: ["It's faster to type", "So you don't break the stable code before review", "Git doesn't allow main"],
      answerIndex: 1,
      why: "`main` stays stable; your change only enters after a pull request and review.",
      pt: {
        say: "Última. Por que trabalhar numa branch em vez de direto na main?",
        question: "Por que trabalhar numa branch e não direto na `main`?",
        options: ["É mais rápido de digitar", "Para não quebrar o código estável antes da revisão", "O Git não deixa usar a main"],
        why: "A `main` fica estável; a sua mudança só entra depois de um pull request e revisão.",
      },
    },
  ],
};

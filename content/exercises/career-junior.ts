import type { ExerciseInput } from "@/lib/content/schema";
import { quiz } from "./_helpers";

/**
 * Entrevista comportamental para júnior/mid (Portugal e internacional). As respostas-modelo são
 * exemplos para adaptar à tua história — o importante é a estrutura (STAR) e as frases prontas.
 */
type Beh = { title: string; prompt: string; rubric: string[]; modelAnswer: string };
const behavioral = (topic: string, id: string, difficulty: 1 | 2 | 3, rubricKeys: string[][], en: Beh, pt: Beh, timeLimitSec = 120): ExerciseInput => ({
  id,
  kind: "behavioral",
  topic,
  title: en.title,
  prompt: en.prompt,
  difficulty,
  estimatedMin: 6,
  tags: ["behavioral", "junior"],
  timeLimitSec,
  rubric: en.rubric,
  rubricKeys,
  modelAnswer: en.modelAnswer,
  pt,
});

export const exercises: ExerciseInput[] = [
  // ───────────── pitch ─────────────
  behavioral("pitch", "pitch-career-change", 2, [
    ["before", "previously", "used to", "antes", "trabalhava"],
    ["learned", "studied", "built", "course", "aprendi", "estudei", "construi", "curso"],
    ["transfer", "brings", "helps", "skills", "experience", "ajuda", "experiencia", "competencias"],
    ["now", "looking", "role", "next step", "agora", "procuro", "vaga"],
  ], {
    title: "Why did you switch to tech?",
    prompt: "Common for career changers: **\"Why did you decide to become a developer?\"** Answer in under 2 minutes.",
    rubric: ["Short context of the previous career (no apology)", "What you did to learn (concrete: projects, courses, hours)", "How the previous experience helps you as a developer", "Ends looking forward: what you want in this role"],
    modelAnswer:
      "Before tech, I worked for five years in customer support. I kept noticing the same problems in the tools we used, so I started automating small things with spreadsheets and scripts, and I realised I enjoyed building more than anything else.\n\nOver the last year I studied full-stack development seriously: JavaScript, React, Next.js, Postgres. I built a booking app that a local business still uses, with authentication and payments.\n\nMy support background helps a lot: I'm used to listening to users, explaining technical things simply and staying calm under pressure. Now I'm looking for a junior role in a product team where I can ship real features and keep learning from experienced engineers.",
  }, {
    title: "Porque mudaste para tecnologia?",
    prompt: "Comum para quem muda de carreira: **\"Porque decidiu ser programador?\"** Responda em menos de 2 minutos.",
    rubric: ["Contexto curto da carreira anterior (sem pedir desculpa)", "O que fez para aprender (concreto: projetos, cursos, horas)", "Como a experiência anterior ajuda como dev", "Termina a olhar para a frente: o que quer nesta vaga"],
    modelAnswer:
      "Antes da tecnologia, trabalhei cinco anos em apoio ao cliente. Via sempre os mesmos problemas nas ferramentas que usávamos, então comecei a automatizar pequenas coisas com folhas de cálculo e scripts, e percebi que o que mais gostava era de construir.\n\nNo último ano estudei desenvolvimento full-stack a sério: JavaScript, React, Next.js, Postgres. Construí uma app de reservas que um negócio local ainda usa, com autenticação e pagamentos.\n\nA minha experiência em suporte ajuda muito: estou habituado a ouvir os usuários, explicar coisas técnicas de forma simples e manter a calma sob pressão. Agora procuro uma vaga júnior numa equipe de produto onde possa entregar funcionalidades reais e continuar a aprender com engenheiros experientes.",
  }),
  behavioral("pitch", "pitch-proud-project", 2, [
    ["built", "project", "app", "construi", "projeto"],
    ["problem", "users", "needed", "problema", "usuarios", "precisava"],
    ["decided", "chose", "because", "escolhi", "decidi", "porque", "trade-off"],
    ["%", "users", "result", "learned", "resultado", "aprendi", "hours", "horas"],
  ], {
    title: "A project you're proud of",
    prompt: "**\"Tell me about a project you're proud of.\"** Pick one project and go deep.",
    rubric: ["What it is and who uses it (the problem)", "Your role and the stack, briefly", "One interesting technical decision or challenge", "Result with a number + what you learned"],
    modelAnswer:
      "I'm proud of a booking app I built for a small yoga studio. They were managing classes on WhatsApp and losing bookings.\n\nI built it alone with Next.js, Supabase and Stripe. The interesting part was preventing double bookings when two people book the last spot at the same time. I solved it in the database with a constraint and a transaction instead of checking in the code.\n\nThe studio now has about 120 active users, and no-shows dropped because of the reminder emails. I learned that the hard problems are often in the data, and that talking to the real users early saves a lot of rework.",
  }, {
    title: "Um projeto de que te orgulhas",
    prompt: "**\"Fale de um projeto de que se orgulha.\"** Escolha um projeto e aprofunde.",
    rubric: ["O que é e quem usa (o problema)", "O seu papel e a stack, rapidamente", "Uma decisão técnica ou desafio interessante", "Resultado com um número + o que aprendeu"],
    modelAnswer:
      "Orgulho-me de uma app de reservas que fiz para um pequeno estúdio de yoga. Eles geriam as aulas pelo WhatsApp e perdiam reservas.\n\nFiz sozinho com Next.js, Supabase e Stripe. A parte interessante foi evitar reservas duplicadas quando duas pessoas reservam a última vaga ao mesmo tempo. Resolvi na base de dados com uma constraint e uma transação, em vez de verificar no código.\n\nO estúdio tem agora cerca de 120 usuários ativos, e as faltas diminuíram por causa dos emails de lembrete. Aprendi que os problemas difíceis estão muitas vezes nos dados, e que falar cedo com os usuários reais poupa muito retrabalho.",
  }),
  behavioral("pitch", "pitch-why-company", 1, [
    ["product", "your", "mission", "produto", "missao", "empresa"],
    ["stack", "react", "next", "typescript", "node", "postgres", "ai", "ia"],
    ["learn", "grow", "mentor", "aprender", "crescer", "team", "equipe"],
    ["contribute", "help", "bring", "contribuir", "ajudar", "trazer"],
  ], {
    title: "Why this company?",
    prompt: "**\"Why do you want to work here?\"** (Prepare it for each company — this is the template.)",
    rubric: ["Something specific about the product or mission (shows research)", "Connection with the stack / how they work", "What you want to learn there", "What you'll bring to the team"],
    modelAnswer:
      "I've been using your product for invoicing, and I like how simple you made something that's usually painful. I read your engineering blog post about moving to Next.js and adding AI to categorize expenses, and that's exactly the kind of work I want to do.\n\nYour stack, TypeScript, React and Postgres, is what I've been building with, so I can contribute early. I'm also excited that you do code reviews and pair programming, because I learn fastest with feedback.\n\nI'd bring care for the user from my support background and the habit of testing what I build.",
  }, {
    title: "Porquê esta empresa?",
    prompt: "**\"Porque quer trabalhar aqui?\"** (Prepare para cada empresa — este é o modelo.)",
    rubric: ["Algo específico do produto ou missão (mostra pesquisa)", "Ligação com a stack / a forma de trabalhar", "O que quer aprender lá", "O que vai trazer à equipe"],
    modelAnswer:
      "Uso o vosso produto para faturação e gosto de como tornaram simples uma coisa que costuma ser chata. Li o artigo do vosso blog de engenharia sobre a mudança para Next.js e o uso de IA para categorizar despesas, e é exatamente esse tipo de trabalho que quero fazer.\n\nA vossa stack, TypeScript, React e Postgres, é o que tenho usado, então consigo contribuir cedo. Também me entusiasma que façam code reviews e pair programming, porque aprendo mais depressa com feedback.\n\nTrago o cuidado com o usuário do meu passado em suporte e o hábito de testar o que construo.",
  }),
  behavioral("pitch", "pitch-weakness", 2, [
    ["weakness", "struggle", "used to", "fraqueza", "dificuldade", "costumava"],
    ["example", "for example", "once", "por exemplo", "uma vez"],
    ["now", "started", "improve", "working on", "agora", "comecei", "melhorar"],
    ["result", "better", "since then", "resultado", "melhor", "desde"],
  ], {
    title: "Your biggest weakness",
    prompt: "**\"What's your biggest weakness?\"** Be honest, specific, and show what you're doing about it.",
    rubric: ["A real weakness (not 'I'm a perfectionist')", "A concrete example of when it affected you", "What you're doing to improve", "Evidence it's getting better"],
    modelAnswer:
      "I used to stay stuck on a problem for too long before asking for help, because I wanted to solve everything myself.\n\nFor example, in a project I lost almost two days on a deployment error that a more experienced friend explained in ten minutes.\n\nNow I use a simple rule: if I'm stuck for more than an hour, I write down what I tried and ask. Writing it down often solves it, and when it doesn't, my question is clear. Since then I unblock much faster and I learn more from each conversation.",
  }, {
    title: "A tua maior fraqueza",
    prompt: "**\"Qual é a sua maior fraqueza?\"** Seja honesto, específico, e mostre o que está a fazer em relação a isso.",
    rubric: ["Uma fraqueza real (não 'sou perfeccionista')", "Um exemplo concreto de quando o afetou", "O que está a fazer para melhorar", "Sinais de que está a melhorar"],
    modelAnswer:
      "Eu ficava tempo demais preso num problema antes de pedir ajuda, porque queria resolver tudo sozinho.\n\nPor exemplo, num projeto perdi quase dois dias com um erro de deploy que um amigo mais experiente explicou em dez minutos.\n\nAgora uso uma regra simples: se estou preso há mais de uma hora, escrevo o que tentei e pergunto. Escrever muitas vezes já resolve, e quando não resolve, a minha pergunta fica clara. Desde então desbloqueio muito mais depressa e aprendo mais em cada conversa.",
  }),

  // ───────────── behavioral-star ─────────────
  behavioral("behavioral-star", "star-feedback", 2, [
    ["review", "feedback", "pull request", "comment", "comentario", "revisao"],
    ["felt", "first", "understood", "asked", "senti", "percebi", "perguntei"],
    ["changed", "fixed", "applied", "i ", "mudei", "corrigi", "apliquei"],
    ["learned", "since", "now", "result", "aprendi", "desde", "resultado"],
  ], {
    title: "Receiving tough feedback",
    prompt: "**\"Tell me about a time you received critical feedback.\"** Use STAR.",
    rubric: ["Situation: what was reviewed and by whom", "Your reaction — curiosity, not defensiveness", "Action: what you changed", "Result and what you do differently now"],
    modelAnswer:
      "In my first team project, a senior developer left twenty comments on my pull request. My component worked, but it fetched data in three places and had no error handling.\n\nAt first it felt like a lot, but I asked him for fifteen minutes to understand the reasoning instead of just fixing the comments one by one.\n\nI moved the data fetching to one place, added loading and error states, and wrote two tests. The next PR had only three comments. Since then I review my own diff before asking for review, and I treat comments as free mentoring.",
  }, {
    title: "Receber feedback difícil",
    prompt: "**\"Fale de uma vez em que recebeu feedback crítico.\"** Use STAR.",
    rubric: ["Situação: o que foi revisto e por quem", "A sua reação — curiosidade, não defesa", "Ação: o que mudou", "Resultado e o que faz diferente hoje"],
    modelAnswer:
      "No meu primeiro projeto em equipe, um dev sénior deixou vinte comentários no meu pull request. O componente funcionava, mas buscava dados em três sítios e não tratava erros.\n\nNo início pareceu muito, mas pedi-lhe quinze minutos para perceber o raciocínio em vez de só corrigir os comentários um a um.\n\nPassei a busca de dados para um só lugar, acrescentei estados de loading e de erro, e escrevi dois testes. O PR seguinte teve só três comentários. Desde então reviso o meu próprio diff antes de pedir revisão, e trato os comentários como mentoria grátis.",
  }),
  behavioral("behavioral-star", "star-deadline", 2, [
    ["deadline", "prazo", "friday", "sexta", "days", "dias"],
    ["prioritiz", "priorit", "scope", "escopo", "must", "essencial"],
    ["told", "communicat", "informed", "avisei", "comuniquei", "manager", "gestor"],
    ["delivered", "shipped", "result", "entreguei", "resultado", "later", "depois"],
  ], {
    title: "A tight deadline",
    prompt: "**\"Tell me about a time you had to deliver under a tight deadline.\"**",
    rubric: ["Situation and why it was tight", "How you prioritized / cut scope", "How you communicated early", "Result and the follow-up"],
    modelAnswer:
      "We had a demo for a client on Friday and on Tuesday the export feature still wasn't done. There wasn't time for everything we had planned.\n\nI listed what the client really needed to see: exporting to CSV. PDF and scheduling were nice to have. I told my manager on Tuesday, not on Thursday, and proposed shipping CSV first.\n\nWe agreed, I delivered CSV export with tests on Thursday, and the demo went well. PDF export shipped the following sprint. I learned that communicating early turns a crisis into a planning decision.",
  }, {
    title: "Um prazo apertado",
    prompt: "**\"Fale de uma vez em que teve de entregar com um prazo apertado.\"**",
    rubric: ["Situação e porque era apertado", "Como priorizou / cortou escopo", "Como comunicou cedo", "Resultado e o seguimento"],
    modelAnswer:
      "Tínhamos uma demo para um cliente na sexta e na terça a funcionalidade de exportação ainda não estava pronta. Não havia tempo para tudo o que tínhamos planeado.\n\nListei o que o cliente precisava mesmo de ver: exportar para CSV. PDF e agendamento eram extras. Avisei o meu gestor na terça, não na quinta, e propus entregar primeiro o CSV.\n\nConcordámos, entreguei a exportação CSV com testes na quinta, e a demo correu bem. A exportação em PDF saiu no sprint seguinte. Aprendi que comunicar cedo transforma uma crise numa decisão de planeamento.",
  }),
  behavioral("behavioral-star", "star-learn-fast", 2, [
    ["didn't know", "new", "never", "nao sabia", "novo", "nunca"],
    ["docs", "documentation", "tutorial", "small", "documentacao", "pequeno"],
    ["asked", "built", "prototype", "perguntei", "construi", "prototipo"],
    ["shipped", "result", "days", "week", "entreguei", "resultado", "dias", "semana"],
  ], {
    title: "Learning something quickly",
    prompt: "**\"Tell me about a time you had to learn a new technology quickly.\"** (Juniors get this a lot.)",
    rubric: ["What you had to learn and why", "Your method (docs, small prototype, asking)", "How you applied it to the real task", "Result + how you learn now"],
    modelAnswer:
      "In a freelance project, the client needed payments and I had never used Stripe.\n\nI read the official docs for the checkout flow first, then built a tiny prototype outside the project, just one product and one payment in test mode. When I didn't understand webhooks, I asked in the Stripe community and read their example code.\n\nAfter two days I added it to the real app, with the webhook verified on the server and tests for the payment status. It went live that week. Now I always start a new technology with a small prototype before touching the real code.",
  }, {
    title: "Aprender algo depressa",
    prompt: "**\"Fale de uma vez em que teve de aprender uma tecnologia nova rapidamente.\"** (Júniores recebem muito esta.)",
    rubric: ["O que tinha de aprender e porquê", "O seu método (docs, protótipo pequeno, perguntar)", "Como aplicou na tarefa real", "Resultado + como aprende hoje"],
    modelAnswer:
      "Num projeto freelance, o cliente precisava de pagamentos e eu nunca tinha usado o Stripe.\n\nLi primeiro a documentação oficial do fluxo de checkout, depois construí um protótipo minúsculo fora do projeto, só um produto e um pagamento em modo de teste. Quando não percebi os webhooks, perguntei na comunidade do Stripe e li o código de exemplo.\n\nDepois de dois dias pus na app real, com o webhook verificado no servidor e testes para o estado do pagamento. Foi para produção nessa semana. Agora começo sempre uma tecnologia nova com um protótipo pequeno antes de mexer no código real.",
  }),
  behavioral("behavioral-star", "star-ai-usage", 2, [
    ["copilot", "claude", "cursor", "chatgpt", "ai", "ia"],
    ["review", "read", "understand", "test", "reviso", "leio", "entendo", "testo"],
    ["wrong", "bug", "mistake", "caught", "errado", "erro", "apanhei"],
    ["responsib", "own", "explain", "responsavel", "explicar"],
  ], {
    title: "How you use AI at work",
    prompt: "Now asked in almost every interview: **\"How do you use AI tools in your work? Give an example where it got something wrong.\"**",
    rubric: ["Honest about which tools and for what", "Your review process (read, test, check docs)", "A concrete example of catching an AI mistake", "Ownership: you can explain and are responsible for the code"],
    modelAnswer:
      "I use Claude and Copilot every day, mainly for boilerplate, writing tests, and explaining unfamiliar code. I don't use them to decide the architecture.\n\nI review AI code like a pull request from a colleague: I read every line, run it, check the docs for any API I don't know, and make sure there are tests for the edge cases.\n\nFor example, the AI generated an endpoint that worked, but it didn't check that the record belonged to the logged-in user. Anyone could read other people's invoices by changing the id. I caught it in review and added the ownership check and a test. If I commit the code, it's mine, so I need to be able to explain every line.",
  }, {
    title: "Como usas IA no trabalho",
    prompt: "Agora perguntam em quase todas as entrevistas: **\"Como usa ferramentas de IA no trabalho? Dê um exemplo em que ela errou.\"**",
    rubric: ["Honesto sobre que ferramentas e para quê", "O seu processo de revisão (ler, testar, ver docs)", "Um exemplo concreto de apanhar um erro da IA", "Responsabilidade: sabe explicar e responde pelo código"],
    modelAnswer:
      "Uso o Claude e o Copilot todos os dias, sobretudo para código repetitivo, escrever testes e explicar código que não conheço. Não os uso para decidir a arquitetura.\n\nReviso o código da IA como um pull request de um colega: leio cada linha, rodo, vejo a documentação de qualquer API que não conheço, e garanto que há testes para os casos-limite.\n\nPor exemplo, a IA gerou um endpoint que funcionava, mas não verificava se o registo pertencia ao usuário com login. Qualquer um lia as faturas dos outros trocando o id. Apanhei na revisão e acrescentei a verificação do dono e um teste. Se faço commit do código, ele é meu, então tenho de saber explicar cada linha.",
  }),
  behavioral("behavioral-star", "star-disagree-senior", 3, [
    ["senior", "lead", "disagree", "discord", "senior"],
    ["data", "measured", "example", "dados", "medi", "exemplo", "benchmark"],
    ["asked", "proposed", "suggested", "listened", "perguntei", "propus", "sugeri", "ouvi"],
    ["decided", "agreed", "result", "learned", "decidimos", "concordamos", "resultado", "aprendi"],
  ], {
    title: "Disagreeing with a senior",
    prompt: "**\"Tell me about a time you disagreed with someone more senior.\"**",
    rubric: ["Situation: what the disagreement was about", "You brought data/examples, not just opinion", "You listened and stayed respectful; the team decided", "Outcome and what you learned (even if you were wrong)"],
    modelAnswer:
      "On my last project, the tech lead wanted to add a caching layer before launch. I thought it was too early, because we didn't have users yet and caching would add bugs with stale data.\n\nInstead of just saying no, I measured: the slowest page took 300 milliseconds, and the real problem was one missing index. I showed the numbers in our meeting and proposed adding the index and monitoring first.\n\nHe agreed, with the condition that we'd revisit after launch. The index fixed it, and we never needed the cache. What I learned is that bringing data makes disagreements easy, and that I should ask why someone wants something before arguing.",
  }, {
    title: "Discordar de alguém mais sénior",
    prompt: "**\"Fale de uma vez em que discordou de alguém mais sénior.\"**",
    rubric: ["Situação: sobre o que era a discordância", "Trouxe dados/exemplos, não só opinião", "Ouviu e manteve o respeito; a equipe decidiu", "Resultado e o que aprendeu (mesmo que estivesse errado)"],
    modelAnswer:
      "No meu último projeto, o tech lead queria pôr uma camada de cache antes do lançamento. Eu achava cedo demais, porque ainda não tínhamos usuários e o cache traria bugs de dados desatualizados.\n\nEm vez de só dizer que não, medi: a página mais lenta demorava 300 milissegundos, e o problema real era um índice em falta. Mostrei os números na reunião e propus pôr o índice e monitorizar primeiro.\n\nEle concordou, com a condição de revermos depois do lançamento. O índice resolveu e nunca precisámos do cache. Aprendi que trazer dados torna as discordâncias fáceis, e que devo perguntar porque alguém quer algo antes de argumentar.",
  }),

  // ───────────── Quizzes de técnica de entrevista ─────────────
  quiz("pitch", "pitch-length-quiz", 1, 1, {
    title: "\"Tell me about yourself\" — how long?",
    prompt: "How long should your answer to \"Tell me about yourself\" be?",
    options: ["10 seconds", "About 60–90 seconds: present → key experience/project → why this role", "5–10 minutes, your full life story", "As long as possible to show passion"],
    explanation: "Short enough to keep attention, with one hook (a project with a number) that invites questions.",
  }, {
    title: "\"Fale de si\" — quanto tempo?",
    prompt: "Quanto tempo deve durar a resposta a \"Fale de si\"?",
    options: ["10 segundos", "Cerca de 60–90 segundos: presente → experiência/projeto principal → porquê esta vaga", "5–10 minutos, a história completa", "O máximo possível, para mostrar paixão"],
    explanation: "Curto o suficiente para manter a atenção, com um gancho (um projeto com um número) que convida a perguntas.",
  }),
  quiz("pitch", "pitch-salary-quiz", 2, 2, {
    title: "Salary expectations",
    prompt: "A recruiter in Portugal asks your salary expectations for a junior role. A professional answer?",
    options: ["\"Whatever you want to pay\"", "Refuse to answer", "Give a researched range (gross per year), mention you're flexible for the right role and ask about the full package", "Give a number 3x the market to negotiate down"],
    explanation: "Research ranges for your city and level (Glassdoor, Levels.fyi, local reports). In Portugal salaries are usually discussed as gross annual (14 payments).",
  }, {
    title: "Expectativa salarial",
    prompt: "Um recrutador em Portugal pergunta a sua expectativa salarial para uma vaga júnior. Uma resposta profissional?",
    options: ["\"O que quiserem pagar\"", "Recusar responder", "Dar uma faixa pesquisada (bruto anual), dizer que é flexível para a vaga certa e perguntar pelo pacote completo", "Dar um número 3x acima do mercado para negociar para baixo"],
    explanation: "Pesquise as faixas para a sua cidade e nível (Glassdoor, Levels.fyi, relatórios locais). Em Portugal o salário costuma ser falado em bruto anual (14 pagamentos).",
  }),
  quiz("pitch", "pitch-questions-quiz", 1, 3, {
    title: "\"Do you have any questions?\"",
    prompt: "At the end the interviewer asks if you have questions. Best move?",
    options: ["\"No, everything was clear\"", "Only ask about holidays", "Ask about the salary only", "Ask 2–3 real questions: what a junior's first 3 months look like, how code review works, the biggest challenge of the team"],
    explanation: "Good questions show interest and help you decide. Prepare them in advance.",
  }, {
    title: "\"Tem alguma pergunta?\"",
    prompt: "No fim o entrevistador pergunta se tem perguntas. Melhor atitude?",
    options: ["\"Não, ficou tudo claro\"", "Perguntar só sobre férias", "Perguntar só pelo salário", "Fazer 2–3 perguntas reais: como são os primeiros 3 meses de um júnior, como funciona o code review, o maior desafio da equipe"],
    explanation: "Boas perguntas mostram interesse e ajudam-no a decidir. Prepare-as antes.",
  }),
  quiz("pitch", "pitch-dont-know-quiz", 2, 0, {
    title: "When you don't know",
    prompt: "In a technical interview you're asked about something you've never used (e.g. Kubernetes). Best answer?",
    options: [
      "\"I haven't used it yet. What I know is that it orchestrates containers… In a case like this I'd start by reading the docs and trying a small example.\"",
      "Invent an answer",
      "\"No idea.\" and stay silent",
      "Change the subject to React",
    ],
    explanation: "Honesty + what you do know + how you'd learn it. Juniors aren't expected to know everything; they're expected to be coachable.",
  }, {
    title: "Quando não sabe",
    prompt: "Numa entrevista técnica perguntam algo que nunca usou (ex.: Kubernetes). Melhor resposta?",
    options: [
      "\"Ainda não usei. O que sei é que orquestra containers… Num caso assim começaria por ler a documentação e experimentar um exemplo pequeno.\"",
      "Inventar uma resposta",
      "\"Não faço ideia.\" e ficar calado",
      "Mudar de assunto para React",
    ],
    explanation: "Honestidade + o que sabe + como aprenderia. Não se espera que um júnior saiba tudo; espera-se que aprenda com facilidade.",
  }),
  quiz("pitch", "pitch-portugal-quiz", 2, 1, {
    title: "Interviews in Portugal",
    prompt: "Many tech interviews in Portugal mix Portuguese and English. What's smart preparation?",
    options: ["Only prepare in English", "Prepare your pitch, projects and STAR stories in **both** languages, and the technical vocabulary in English (it's used even in Portuguese conversations)", "Only prepare in Portuguese", "Don't prepare, improvise"],
    explanation: "Practising in Portuguese first lowers the anxiety; the same structure then transfers to English interviews abroad.",
  }, {
    title: "Entrevistas em Portugal",
    prompt: "Muitas entrevistas de tecnologia em Portugal misturam português e inglês. Qual é uma preparação inteligente?",
    options: ["Preparar só em inglês", "Preparar o pitch, os projetos e as histórias STAR nas **duas** línguas, e o vocabulário técnico em inglês (é usado mesmo em conversas em português)", "Preparar só em português", "Não preparar, improvisar"],
    explanation: "Praticar primeiro em português baixa a ansiedade; a mesma estrutura passa depois para as entrevistas em inglês lá fora.",
  }),
  quiz("pitch", "pitch-take-home-quiz", 2, 3, {
    title: "Take-home assignment",
    prompt: "You get a take-home: \"build a small API with tests, 4 hours\". What impresses reviewers most at junior/mid level?",
    options: ["Using as many libraries as possible", "Working 30 hours on it", "Extra features nobody asked for", "Clean, working scope + tests on the important logic + a README with how to run it, decisions and what you'd do with more time"],
    explanation: "They evaluate judgment and communication, not volume. The README is where you show trade-offs.",
  }, {
    title: "Desafio para casa (take-home)",
    prompt: "Recebe um take-home: \"constrói uma API pequena com testes, 4 horas\". O que mais impressiona quem avalia, a nível júnior/mid?",
    options: ["Usar o máximo de bibliotecas possível", "Trabalhar 30 horas nele", "Funcionalidades extra que ninguém pediu", "Escopo limpo e a funcionar + testes na lógica importante + um README com como rodar, as decisões e o que faria com mais tempo"],
    explanation: "Avaliam julgamento e comunicação, não volume. O README é onde mostra os trade-offs.",
  }),
  quiz("behavioral-star", "star-structure-quiz", 1, 2, {
    title: "What is STAR?",
    prompt: "What does the STAR method stand for?",
    options: ["Strategy, Team, Action, Review", "Skills, Talent, Ambition, Results", "Situation, Task, Action, Result", "Start, Talk, Answer, Repeat"],
    explanation: "Keep S and T short (2 sentences), spend most time on **your** Action, finish with a measurable Result + learning.",
  }, {
    title: "O que é STAR?",
    prompt: "O que significa o método STAR?",
    options: ["Strategy, Team, Action, Review", "Skills, Talent, Ambition, Results", "Situation, Task, Action, Result", "Start, Talk, Answer, Repeat"],
    explanation: "S e T curtos (2 frases), a maior parte do tempo na **sua** Ação, e termine com um Resultado mensurável + o que aprendeu.",
  }),
  quiz("behavioral-star", "star-we-vs-i-quiz", 2, 0, {
    title: "\"We\" or \"I\"?",
    prompt: "Which sentence is stronger in a behavioral answer?",
    options: [
      "\"I found the slow query with EXPLAIN, added an index and cut the page load from 3s to 300ms.\"",
      "\"We worked hard and the team improved performance.\"",
      "\"Things got better over time.\"",
      "\"My manager fixed it.\"",
    ],
    explanation: "Interviewers hire **you**. Say what you did, with specifics and a number, while giving credit to the team where due.",
  }, {
    title: "\"Nós\" ou \"eu\"?",
    prompt: "Que frase é mais forte numa resposta comportamental?",
    options: [
      "\"Encontrei a query lenta com o EXPLAIN, criei um índice e baixei o carregamento da página de 3s para 300ms.\"",
      "\"Trabalhámos muito e a equipe melhorou a performance.\"",
      "\"As coisas melhoraram com o tempo.\"",
      "\"O meu gestor resolveu.\"",
    ],
    explanation: "Os entrevistadores contratam **você**. Diga o que fez, com detalhes e um número, dando crédito à equipe quando for o caso.",
  }),
  quiz("behavioral-star", "star-failure-quiz", 2, 3, {
    title: "Talking about failure",
    prompt: "\"Tell me about a mistake you made.\" Which answer works best?",
    options: ["\"I've never made a mistake.\"", "Blaming a colleague", "A tiny mistake with no consequences", "A real mistake, owned; how you fixed it fast; what you changed so it doesn't happen again"],
    explanation: "They're testing ownership and learning. The \"what I changed\" part (a test, a checklist, an alert) is the strongest bit.",
  }, {
    title: "Falar de um erro",
    prompt: "\"Fale de um erro que cometeu.\" Que resposta funciona melhor?",
    options: ["\"Nunca cometi um erro.\"", "Culpar um colega", "Um erro minúsculo sem consequências", "Um erro real, assumido; como corrigiu depressa; o que mudou para não voltar a acontecer"],
    explanation: "Estão a testar responsabilidade e aprendizagem. A parte \"o que mudei\" (um teste, uma checklist, um alerta) é a mais forte.",
  }),
  quiz("behavioral-star", "star-numbers-quiz", 1, 1, {
    title: "Results with numbers",
    prompt: "Which result sounds most convincing?",
    options: ["\"It went well.\"", "\"Support tickets about login dropped by about 40% in the first month.\"", "\"Everyone was happy.\"", "\"It was the best feature ever.\""],
    explanation: "Even approximate numbers (time saved, users, %, errors) make a story credible. Prepare 2–3 numbers per project.",
  }, {
    title: "Resultados com números",
    prompt: "Que resultado soa mais convincente?",
    options: ["\"Correu bem.\"", "\"Os tickets de suporte sobre login caíram cerca de 40% no primeiro mês.\"", "\"Todos ficaram felizes.\"", "\"Foi a melhor funcionalidade de sempre.\""],
    explanation: "Até números aproximados (tempo poupado, usuários, %, erros) tornam a história credível. Prepare 2–3 números por projeto.",
  }),
  quiz("behavioral-star", "star-ask-help-quiz", 2, 2, {
    title: "Asking for help as a junior",
    prompt: "\"How do you handle being stuck?\" What do interviewers want to hear from a junior?",
    options: ["\"I never get stuck.\"", "\"I ask a senior immediately, every time.\"", "A balance: try for a set time, write down what you tried, then ask a clear question — and share what you learned", "\"I wait until someone notices.\""],
    explanation: "Independence + knowing when to ask. A timebox (e.g. 1 hour) is a great concrete detail.",
  }, {
    title: "Pedir ajuda como júnior",
    prompt: "\"O que faz quando está preso?\" O que os entrevistadores querem ouvir de um júnior?",
    options: ["\"Nunca fico preso.\"", "\"Pergunto logo a um sénior, sempre.\"", "Um equilíbrio: tentar durante um tempo definido, escrever o que tentou, e depois fazer uma pergunta clara — e partilhar o que aprendeu", "\"Espero que alguém repare.\""],
    explanation: "Autonomia + saber quando perguntar. Um limite de tempo (ex.: 1 hora) é um ótimo detalhe concreto.",
  }),
];

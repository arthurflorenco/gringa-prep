/**
 * Traduções PT dos exercícios escritos antes de o `pt` passar a ser obrigatório.
 * Conteúdo novo deve trazer o bloco `pt` inline, no próprio exercício.
 */
export const legacyPt: Record<string, Record<string, unknown>> = {
  // ---------- Assíncrono / event loop ----------
  "event-loop-explain": {
    title: "Explique o event loop",
    prompt:
      "O entrevistador pergunta: **\"JavaScript tem uma única thread. Como ele consegue lidar com uma requisição de rede e um clique ao mesmo tempo?\"**\n\nExplique o event loop em 4–6 frases. Fale da call stack, das Web APIs, da fila de tasks e da fila de microtasks.",
    modelAnswer:
      "O JavaScript roda numa única call stack, então só um trecho de JS executa por vez. Trabalhos lentos, como timers, requisições de rede ou eventos do DOM, são entregues ao ambiente (Web APIs do navegador ou libuv no Node), que os executa fora da stack. Quando terminam, o callback vai para uma fila. O event loop fica verificando: quando a call stack está vazia, primeiro esvazia toda a fila de microtasks (callbacks de promises, queueMicrotask), depois pega uma task da fila de tasks (setTimeout, eventos), executa e repete. Por isso um loop síncrono longo congela a interface: nada mais roda até a stack esvaziar.",
    rubric: [
      "Uma única call stack — uma coisa por vez",
      "Trabalho assíncrono é delegado às Web APIs / runtime",
      "Microtasks (promises) rodam antes da próxima task (setTimeout, eventos)",
      "Código síncrono longo bloqueia a renderização e o input",
    ],
    followUp: "Em que momento deste ciclo acontece a renderização (paint)?",
  },
  "event-loop-order-1": {
    title: "Ordem de saída: timers vs promises",
    prompt:
      "O que este código imprime?\n\n```js\nconsole.log('A');\nsetTimeout(() => console.log('B'), 0);\nPromise.resolve().then(() => console.log('C'));\nconsole.log('D');\n```",
    options: ["A B C D", "A D C B", "A D B C", "A C D B"],
    explanation:
      "Primeiro o código síncrono (A, D). Depois a fila de microtasks é esvaziada (C). Só então roda a próxima task — o callback do setTimeout (B).",
  },
  "event-loop-order-2": {
    title: "Ordem de saída: async/await",
    prompt:
      "O que este código imprime?\n\n```js\nasync function run() {\n  console.log('1');\n  await null;\n  console.log('2');\n}\nrun();\nconsole.log('3');\n```",
    options: ["1 2 3", "1 3 2", "3 1 2", "2 1 3"],
    explanation:
      "Uma função async roda de forma síncrona até o primeiro `await`. Tudo depois do `await` é agendado como microtask, então '3' aparece antes de '2'.",
  },
  "promise-all-vs-allsettled": {
    title: "Promise.all vs Promise.allSettled",
    prompt:
      "Você carrega um dashboard que precisa de 3 chamadas à API: usuário, projetos e notificações. As notificações são opcionais.\n\nQual destes você usaria: `Promise.all`, `Promise.allSettled`, `Promise.race` ou `Promise.any`? Por quê? O que acontece com `Promise.all` se uma requisição falhar?",
    modelAnswer:
      "Promise.all roda tudo em paralelo, mas rejeita assim que qualquer promise rejeita — então uma falha nas notificações quebraria o dashboard inteiro. Aqui eu usaria Promise.allSettled: ele espera todas e devolve o status de cada resultado, então consigo mostrar usuário e projetos e um aviso pequeno no lugar das notificações. Outra opção: Promise.all para as chamadas obrigatórias e um catch separado na opcional. race resolve/rejeita com a primeira que terminar (útil para timeouts) e any resolve com o primeiro sucesso (útil para fallbacks).",
    rubric: [
      "Promise.all falha rápido: uma rejeição rejeita tudo",
      "allSettled devolve o status de cada promise",
      "Roda as requisições em paralelo, não com awaits em sequência",
      "Conhece um uso para race (timeout) ou any (primeiro sucesso)",
    ],
  },
  "code-sleep-retry": {
    title: "Tentar de novo com espera (retry)",
    prompt:
      "Implemente `retry(fn, attempts, delayMs)`.\n\n- Chame a função assíncrona `fn`.\n- Se ela rejeitar, espere `delayMs` e tente de novo, até `attempts` chamadas no total.\n- Resolva com o primeiro valor de sucesso.\n- Se todas as tentativas falharem, rejeite com o **último** erro.",
    hints: [
      "Um loop `for` com `try { return await fn() } catch {}` resolve.",
      "Lembre do `return await` dentro do try — sem `await`, o catch nunca vê a rejeição.",
    ],
  },
  "code-promise-all": {
    title: "Implemente Promise.all",
    prompt:
      "Implemente `promiseAll(promises)` sem usar `Promise.all`.\n\n- Resolva com um array de resultados **na ordem original** (não na ordem em que terminam).\n- Rejeite assim que qualquer promise rejeitar.\n- Um array vazio resolve para `[]`.\n- Valores simples (não promises) são permitidos.",
    hints: [
      "Guarde um contador de promises resolvidas e escreva cada resultado no seu índice.",
      "`Promise.resolve(x)` transforma valores simples em promises.",
    ],
  },

  // ---------- Escopo e closures ----------
  "closure-explain": {
    title: "O que é uma closure?",
    prompt:
      "Explique o que é uma closure, como faria para um entrevistador, e dê **um exemplo real** em que você usou uma (hooks do React contam).",
    modelAnswer:
      "Uma closure é uma função que lembra as variáveis do escopo onde foi criada, mesmo depois de a função de fora já ter terminado. Em JavaScript toda função guarda o seu escopo léxico. Exemplo prático: um debounce guarda o id do timer numa closure entre as chamadas. No React, cada handler de evento e cada effect guarda as props e o state do render em que foi criado — por isso aparecem 'stale closures' quando você esquece uma dependência no useEffect ou no useCallback.",
    rubric: [
      "Função + o escopo léxico onde foi criada",
      "As variáveis continuam vivas depois de a função de fora terminar",
      "Exemplo concreto (debounce, contador, módulo, handler do React)",
      "Bônus: menciona stale closures no React",
    ],
    followUp: "O que é uma stale closure e como corrigir num useEffect?",
  },
  "var-let-loop": {
    title: "var dentro de um loop",
    prompt:
      "O que este código imprime?\n\n```js\nfor (var i = 0; i < 3; i++) {\n  setTimeout(() => console.log(i), 0);\n}\n```",
    options: ["0 1 2", "3 3 3", "undefined ×3", "2 2 2"],
    explanation:
      "`var` tem escopo de função, então os três callbacks partilham o mesmo `i`, que vale 3 quando eles rodam. Com `let`, cada volta do loop tem o seu próprio `i` e imprime 0 1 2.",
  },
  "this-arrow": {
    title: "this em arrow functions",
    prompt:
      "```js\nconst user = {\n  name: 'Ana',\n  regular() { return this.name; },\n  arrow: () => this?.name,\n};\nconsole.log(user.regular(), user.arrow());\n```\n\nNum módulo ES no navegador, o que é impresso?",
    options: ["Ana Ana", "Ana undefined", "undefined Ana", "TypeError"],
    explanation:
      "Métodos normais recebem o `this` pela forma como são chamados (`user.regular()` → user). Arrow functions não têm `this` próprio: usam o do escopo de fora — no topo de um módulo, isso é `undefined`.",
  },
  "code-debounce": {
    title: "Implemente debounce",
    prompt:
      "Implemente `debounce(fn, wait)`.\n\nA função devolvida só deve chamar `fn` depois de **parar de ser chamada por `wait` ms**, usando os argumentos da **última** chamada. É a pergunta clássica da caixa de pesquisa.",
    hints: ["Guarde o id do timer numa variável fora da função devolvida (closure).", "Limpe o timer anterior a cada chamada."],
  },
  "code-once-memo": {
    title: "memoize",
    prompt:
      "Implemente `memoize(fn)` para funções que recebem **um argumento primitivo**.\n\nA primeira chamada com um argumento executa `fn`; as chamadas seguintes com o mesmo argumento devolvem o resultado guardado, sem chamar `fn` de novo.",
    hints: ["Use um `Map` — ele diferencia `1` de `'1'`; um objeto simples não."],
  },

  // ---------- Arrays, objetos, imutabilidade ----------
  "immutability-react": {
    title: "Por que a imutabilidade importa no React",
    prompt:
      "Um colega escreve:\n\n```js\nconst addItem = (item) => {\n  items.push(item);\n  setItems(items);\n};\n```\n\nA lista não atualiza na tela. Explique **por quê** e mostre a correção.",
    modelAnswer:
      "O React decide se renderiza de novo comparando o state antigo com o novo usando Object.is — uma comparação de referência. O push altera o mesmo array, então a referência não muda e o React não renderiza. A correção é criar um array novo: setItems(prev => [...prev, item]). Usar a forma com função (updater) também evita state desatualizado quando há várias atualizações seguidas. A mesma regra vale para objetos: espalhe num objeto novo em vez de alterar o existente.",
    rubric: [
      "O React compara o state por referência (Object.is)",
      "push altera o array — mesma referência, sem re-render",
      "Correção: array novo com spread ou concat",
      "Bônus: função updater setItems(prev => …)",
    ],
  },
  "shallow-copy-quiz": {
    title: "O spread é raso",
    prompt:
      "```js\nconst a = { user: { name: 'Ana' }, tags: ['x'] };\nconst b = { ...a };\nb.user.name = 'Bia';\nb.tags = ['y'];\nconsole.log(a.user.name, a.tags[0]);\n```",
    options: ["Ana x", "Bia x", "Bia y", "Ana y"],
    explanation:
      "O spread copia só um nível. `b.user` é o mesmo objeto que `a.user`, então mudar o nome afeta os dois. Reatribuir `b.tags` faz `b` apontar para um array novo e não mexe em `a.tags`.",
  },
  "code-group-by": {
    title: "groupBy",
    prompt:
      "Implemente `groupBy(items, key)`, que devolve um objeto em que cada chave é um valor de `item[key]` e cada valor é o array de itens com esse valor, **mantendo a ordem original**.\n\n```ts\ngroupBy([{ t: 'a', n: 1 }, { t: 'b', n: 2 }, { t: 'a', n: 3 }], 't')\n// { a: [{t:'a',n:1},{t:'a',n:3}], b: [{t:'b',n:2}] }\n```",
    hints: ["`??=` só atribui quando o lado esquerdo é null/undefined."],
  },
  "code-deep-equal": {
    title: "deepEqual",
    prompt:
      "Implemente `deepEqual(a, b)` para valores tipo JSON: primitivos, arrays e objetos simples (sem Dates, Maps ou ciclos).\n\nDois valores são iguais quando têm o mesmo tipo e o mesmo conteúdo, recursivamente. A ordem das chaves nos objetos não importa.",
    hints: ["Trate primeiro os casos de primitivo / null, depois compare as chaves recursivamente.", "`[]` e `{}` não devem ser iguais."],
  },

  // ---------- Carreira ----------
  "pitch-tell-me-about-yourself": {
    title: "Fale sobre você",
    prompt:
      "**\"Tell me about yourself.\"** (Fale sobre você.)\n\nEscreva a sua resposta de 90 segundos em inglês. Estrutura: **presente** (função e o que você constrói hoje) → **passado** (como chegou aqui, 1–2 destaques) → **futuro** (por que esta vaga / este país).",
    rubric: [
      "Começa pelo presente, não pela infância",
      "Um projeto concreto com um número (usuários, tempo poupado, receita)",
      "Diz a stack, rapidamente",
      "Termina com o porquê desta empresa / vaga",
      "Menos de ~200 palavras",
    ],
    modelAnswer:
      "Sou desenvolvedor full-stack com uma base forte de produto e design. Hoje estou construindo uma aplicação web de operações de campo para uma empresa de instalação de alumínio — Next.js, TypeScript e Supabase — que substituiu as folhas de horas em papel das equipes e funciona offline na obra. Antes disso tive o meu próprio estúdio fazendo sites premium para clientes portugueses, onde aprendi a falar com clientes e a cuidar de um produto de ponta a ponta. Estou me mudando para a Suíça e procuro uma equipe onde possa crescer como engenheiro, entregar funcionalidades para usuários e aprender com pessoas mais seniores — e o produto de vocês encaixa bem porque …",
  },
  "pitch-project-deep-dive": {
    title: "Fale de um projeto",
    prompt:
      "**\"Walk me through a project you're proud of.\"** (Explique um projeto de que se orgulha.)\n\nEscolha um projeto. Explique: o **problema**, o **seu papel**, a **arquitetura** numa frase, **uma decisão difícil** e o seu trade-off, e o **resultado**.",
    rubric: [
      "Problema explicado do ponto de vista do usuário",
      "Claro sobre o que *você* fez vs a equipe / ferramentas de IA",
      "Uma decisão técnica com uma alternativa que você rejeitou",
      "Resultado com uma métrica ou efeito concreto",
      "O que faria diferente",
    ],
    modelAnswer:
      "O problema: as equipes de instalação registravam horas em papel e o escritório digitava tudo de novo, com erros frequentes. Desenhei e construí a app sozinho: front-end em Next.js, Supabase para autenticação e Postgres, e IndexedDB via Dexie para funcionar offline. A decisão mais difícil foi offline primeiro versus portal do cliente primeiro. As equipes trabalham em caves sem sinal, então escolhi offline primeiro, aceitando a complexidade da sincronização e dos conflitos — usei 'a última escrita ganha' por campo, com histórico de auditoria. Resultado: as horas são registradas uma vez, na obra, e o escritório deixou de redigitar. Da próxima vez eu escreveria testes automáticos para a lógica de sincronização mais cedo.",
  },
  "star-conflict": {
    title: "Desacordo com um cliente ou colega",
    prompt:
      "**\"Tell me about a time you disagreed with a client or teammate.\"** (Conte uma vez em que discordou de um cliente ou colega.)\n\nResponda com **STAR**: Situação, Tarefa, Ação, Resultado. Mantenha o conflito profissional e mostre o que aprendeu.",
    rubric: [
      "S e T em no máximo 2 frases",
      "A ação é sobre *você* (eu, não nós)",
      "Mostra que ouviu e usou dados, não só que tinha razão",
      "Resultado + o que aprendeu",
    ],
    modelAnswer:
      "Situação: um cliente queria uma introdução animada pesada na página inicial. Tarefa: eu era responsável pelo design e pela entrega, e sabia que isso ia piorar o carregamento no celular. Ação: em vez de só dizer não, fiz duas versões e mostrei as notas do Lighthouse e uma gravação num celular médio; propus uma animação mais leve que mantinha a identidade da marca. Resultado: escolheram a versão leve, a página carregava em menos de 2 segundos e voltaram para um segundo projeto. Aprendi a levar evidências e opções, não opiniões.",
  },
  "star-mistake": {
    title: "Um erro que você cometeu",
    prompt:
      "**\"Tell me about a mistake you made in production.\"** (Conte um erro que cometeu em produção.)\n\nUse STAR. O entrevistador quer ver responsabilidade, como você corrigiu e que processo mudou para não acontecer de novo.",
    rubric: [
      "Erro real, assumido sem culpar outras pessoas",
      "Mitigação imediata (rollback, hotfix, comunicação)",
      "Causa raiz explicada de forma simples",
      "Mudança de processo (teste, checklist, monitoramento)",
    ],
    modelAnswer:
      "Situação: publiquei uma mudança no formulário de horas numa sexta à noite. Tarefa: a funcionalidade era minha. Ação: na segunda, um chefe de equipe me disse que as horas não estavam salvando — uma validação que adicionei rejeitava registros sem projeto. Fiz rollback em minutos, avisei o escritório sobre quais registros conferir, e depois corrigi a validação com uma mensagem de erro clara. Resultado: nenhum dado se perdeu de vez. Desde então não publico tarde às sextas, adicionei um teste para esse formulário e configurei monitoramento de erros para saber antes dos usuários.",
  },
  "star-why-switzerland": {
    title: "Por que este país?",
    prompt:
      "**\"Why do you want to work here, in this country?\"** (Por que quer trabalhar aqui, neste país?)\n\nEscreva uma resposta curta e honesta que ligue os seus planos pessoais à empresa. Mencione a autorização de trabalho, se for relevante, e o seu plano para a língua local.",
    rubric: [
      "Motivo pessoal honesto, em poucas palavras",
      "Deixa clara a autorização de trabalho / disponibilidade",
      "Liga à empresa, não só ao país",
      "Menciona que está aprendendo a língua local",
    ],
    modelAnswer:
      "Estou me mudando para a Suíça e já tenho uma autorização B, então posso começar sem patrocínio de visto. Estou aprendendo alemão — estou no [seu nível] e quero chegar ao [próximo nível] até [data]. O que me atrai na equipe de vocês é que constroem um produto usado todos os dias por pessoas não técnicas, que é exatamente o tipo de trabalho que tenho feito — e quero fazer isso numa equipe com práticas de engenharia mais fortes do que as que tive trabalhando sozinho.",
  },

  // ---------- TypeScript / React / Next ----------
  "ts-type-vs-interface": {
    title: "type vs interface",
    prompt: "Quando você usa `type` e quando usa `interface` em TypeScript? Existe diferença prática?",
    modelAnswer:
      "Para formatos de objeto, são quase equivalentes. Interfaces podem ser reabertas e juntadas (declaration merging) e estendidas com extends, o que é útil para tipos públicos de bibliotecas. Type aliases expressam coisas que interfaces não conseguem: uniões, interseções, tipos mapeados e condicionais, tuplas e primitivos. Na prática sigo a convenção do projeto; quando não há, uso type para quase tudo — props, uniões, respostas de API — e interface quando espero que outras pessoas a estendam.",
    rubric: [
      "Quase equivalentes para formatos de objeto",
      "Interface: declaration merging / extends",
      "Type: uniões, interseções, tipos mapeados/condicionais",
      "Pragmático: seguir a convenção da equipe",
    ],
  },
  "ts-unknown-vs-any": {
    title: "unknown vs any",
    prompt: "Você recebe JSON do `fetch`. Que tipo `data` deve ter antes de você validar?",
    options: ["any — é flexível", "unknown — obriga a verificar/validar primeiro", "object", "never"],
    explanation:
      "`unknown` aceita qualquer valor mas não deixa você usá-lo até restringir o tipo (verificações com typeof, um type guard ou um schema como Zod). `any` desliga a verificação de tipos e deixa os bugs passarem.",
  },
  "react-useeffect-deps": {
    title: "O array de dependências do useEffect",
    prompt:
      "Explique o que faz o array de dependências do `useEffect`. O que acontece com `[]`, sem array nenhum e quando você esquece uma dependência? Quando você **não** deve usar um effect?",
    modelAnswer:
      "O effect roda depois do render, e o React só o roda de novo quando um valor do array de dependências mudou (comparado com Object.is). Com [] ele roda uma vez depois de montar (duas vezes em desenvolvimento com Strict Mode, para revelar cleanups em falta). Sem array, roda depois de cada render. Se você esquece uma dependência, o effect fica com uma closure desatualizada — vê props/state antigos. Effects servem para sincronizar com algo fora do React: subscrições, timers, APIs do DOM, rede. Não se usa para calcular state a partir de props (calcule durante o render) nem para reagir a eventos do usuário (faça no handler do evento).",
    rubric: [
      "Roda depois do render e de novo quando as dependências mudam",
      "[] vs sem array vs dependências específicas",
      "Dependência esquecida = closure desatualizada",
      "Função de cleanup para subscrições/timers",
      "Não usar effects para state derivado ou lógica de eventos",
    ],
    followUp: "Por que o seu effect roda duas vezes em desenvolvimento?",
  },
  "react-rerender-quiz": {
    title: "O que causa um re-render?",
    prompt: "Qual destas opções **não** faz, sozinha, um componente renderizar de novo?",
    options: [
      "O state dele muda via setState",
      "O componente pai renderiza de novo",
      "Um context que ele usa muda de valor",
      "O .current de uma ref é alterado",
    ],
    explanation:
      "Alterar `ref.current` não agenda um render — é exatamente para isso que servem as refs. Mudança de state, render do pai (sem memo) e mudança de context fazem renderizar.",
  },
  "react-keys": {
    title: "Por que as keys importam",
    prompt: "Por que o React precisa de uma `key` em listas, e o que dá errado se você usar o índice do array como key numa lista que pode ser reordenada ou filtrada?",
    modelAnswer:
      "As keys dizem ao React qual item é qual entre renders, para ele reutilizar a instância e o nó do DOM certos. Com o índice como key, se um item é removido ou a lista é ordenada, os índices mudam: o React acha que o item 0 continua sendo o item 0 e mantém o state dele, então aparecem inputs com o texto errado, animações erradas ou renders desnecessários. Use um id estável vindo dos dados. O índice só serve para listas estáticas que nunca mudam de ordem.",
    rubric: ["Keys identificam os itens entre renders", "Keys por índice quebram quando a ordem muda", "Sintoma: state preso à linha errada", "Usar um id estável"],
  },
  "next-server-vs-client": {
    title: "Server vs Client Components",
    prompt:
      "No App Router do Next.js, qual é a diferença entre um Server Component e um Client Component? Como você decide o que uma página/secção deve ser?",
    modelAnswer:
      "Server Components renderizam só no servidor: podem ler a base de dados ou segredos diretamente, o código nunca vai para o navegador e reduzem o tamanho do bundle. Não podem usar state, effects ou APIs do navegador. Client Components ('use client') também são pré-renderizados em HTML, mas depois são hidratados no navegador, então podem usar state, effects, handlers de eventos e APIs do navegador. Por padrão tudo é Server Component; eu empurro o 'use client' o mais para baixo possível na árvore — por exemplo, a página busca os dados no servidor e passa para um pequeno componente interativo, como um filtro ou formulário.",
    rubric: [
      "Server: só no servidor, não envia JS, acessa BD/segredos",
      "Client: hidrata, pode usar state/effects/eventos",
      "Os dois geram HTML no primeiro carregamento",
      "Manter 'use client' nas folhas da árvore",
    ],
  },
  "next-ssr-ssg": {
    title: "Estático ou dinâmico?",
    prompt: "Uma página de marketing mostra o mesmo conteúdo para todos e muda uma vez por semana. Que estratégia de renderização encaixa melhor?",
    options: [
      "Renderizar a cada pedido (SSR)",
      "Geração estática com revalidação (ISR)",
      "Fetch no cliente com um spinner",
      "Sem pré-renderização nenhuma",
    ],
    explanation:
      "Conteúdo igual para todos e que muda pouco deve ser pré-renderizado e guardado em cache (servido pela CDN), e regenerado num horário ou quando muda.",
  },

  // ---------- Back-end e segurança ----------
  "authn-vs-authz": {
    title: "Autenticação vs autorização",
    prompt:
      "Explique a diferença entre autenticação e autorização. Depois: um usuário com login muda a URL de `/projects/12` para `/projects/13` e vê o projeto de outra empresa. Qual das duas falhou, e onde deve ficar a verificação?",
    modelAnswer:
      "Autenticação responde 'quem é você?' — login, sessões, tokens. Autorização responde 'você pode fazer isto a este recurso?'. No exemplo, a autenticação funcionou — o usuário tem login — mas a autorização falhou: é um IDOR / falha de controle de acesso, o risco número um da OWASP. A verificação tem de ficar no servidor, junto dos dados: no handler da API ou, melhor ainda, na base de dados com Row Level Security, para que uma consulta ao projeto 13 não devolva nada se o usuário não pertencer àquela empresa. Esconder o link na interface não é um controle de segurança.",
    rubric: [
      "AuthN = identidade, AuthZ = permissão sobre um recurso",
      "O exemplo é falha de controle de acesso / IDOR",
      "Verificação no servidor ou na BD, nunca só na interface",
      "Menciona RLS ou verificação de dono em cada pedido",
    ],
  },
  "rls-explain": {
    title: "O que é Row Level Security?",
    prompt:
      "Explique Row Level Security no Postgres (como o Supabase usa). Escreva — em palavras ou SQL — uma policy para que os usuários só vejam as linhas de `projects` cujo `company_id` corresponde à empresa deles.",
    modelAnswer:
      "RLS permite que a base de dados filtre linhas por usuário. Você ativa na tabela e, a partir daí, toda consulta é combinada automaticamente com as policies que definir; sem uma policy que corresponda, nenhuma linha é devolvida. No Supabase o id do usuário vem do JWT via auth.uid(). Exemplo:\n\nalter table projects enable row level security;\ncreate policy \"membros da empresa leem projetos\" on projects for select using (company_id in (select company_id from memberships where user_id = auth.uid()));\n\nPolicies separadas para insert/update usam WITH CHECK, para o usuário não conseguir escrever linhas noutra empresa. A vantagem é que, mesmo com um bug na API ou uma consulta direta do cliente, os dados não vazam.",
    rubric: [
      "O RLS é aplicado pela BD em toda consulta",
      "RLS ativo + nenhuma policy = nenhum acesso",
      "USING filtra leituras; WITH CHECK protege escritas",
      "Usa o id do usuário autenticado (auth.uid())",
      "Defesa em profundidade mesmo com consultas do cliente",
    ],
    followUp: "Qual é o risco da chave service_role no Supabase?",
  },
  "data-modeling-nn": {
    title: "Modelar muitos-para-muitos",
    prompt:
      "Um projeto pode ter vários trabalhadores e um trabalhador pode estar em vários projetos. Cada atribuição tem uma função (lead/helper) e uma data de início. Desenhe as tabelas (nomes, colunas principais, chaves/constraints).",
    modelAnswer:
      "Três tabelas. projects(id pk, name, company_id fk). workers(id pk, name, company_id fk). E uma tabela de ligação project_assignments(project_id fk → projects, worker_id fk → workers, role text check (role in ('lead','helper')), started_at date not null, primary key (project_id, worker_id)). A chave primária composta impede atribuições duplicadas; a função e a data ficam na tabela de ligação porque descrevem a relação, não o projeto nem o trabalhador. Eu adicionaria um índice em worker_id para listar rapidamente os projetos de um trabalhador, já que o índice da PK cobre as buscas por project_id.",
    rubric: [
      "Tabela de ligação para N:N",
      "Atributos da relação ficam na tabela de ligação",
      "Chaves estrangeiras + PK composta ou unique",
      "Índice para a busca no sentido inverso",
    ],
  },
  "sql-join-quiz": {
    title: "LEFT JOIN",
    prompt:
      "Você quer **todos** os projetos, incluindo os que ainda não têm registros de horas, com o total de horas de cada um.\n\n```sql\nSELECT p.name, COALESCE(SUM(t.hours), 0) AS total\nFROM projects p\n____ time_entries t ON t.project_id = p.id\nGROUP BY p.name;\n```\n\nQue join vai no espaço?",
    options: ["INNER JOIN", "LEFT JOIN", "RIGHT JOIN", "CROSS JOIN"],
    explanation:
      "LEFT JOIN mantém todas as linhas da tabela da esquerda (projects) mesmo sem correspondência; o lado em falta fica NULL, que o COALESCE transforma em 0. INNER JOIN eliminaria os projetos sem registros.",
  },
  "testing-pyramid": {
    title: "Unitário, integração e e2e",
    prompt:
      "Explique a diferença entre testes unitários, de integração e end-to-end. Para uma app web com login e um formulário de horas, dê **um exemplo de cada** que você escreveria de verdade.",
    modelAnswer:
      "Testes unitários verificam uma função isolada e são rápidos — por exemplo, uma função que calcula o total de horas a partir da hora de início e fim, incluindo turnos que passam da meia-noite. Testes de integração verificam várias peças juntas, muitas vezes com uma base de dados real — por exemplo, a rota da API que guarda um registro de horas rejeita um usuário que não está naquele projeto. Testes end-to-end usam a app real num navegador — por exemplo, o Playwright faz login, preenche as horas e vê o registro na lista. Eu teria muitos unitários, um bom número de integração nas regras críticas como permissões, e poucos e2e nas jornadas principais, porque são mais lentos e instáveis.",
    rubric: [
      "Unitário: isolado, rápido, lógica pura",
      "Integração: peças juntas (API + BD)",
      "E2E: navegador real, jornada do usuário",
      "Exemplo concreto de cada",
      "Pirâmide/troféu: poucos e2e, foco nas regras críticas",
    ],
  },
  "soft-delete": {
    title: "Soft delete e log de auditoria",
    prompt:
      "Um cliente apagou um projeto sem querer, quer recuperá-lo e também quer saber **quem** o apagou. Como você desenharia a exclusão para as duas coisas serem possíveis? Quais são as desvantagens?",
    modelAnswer:
      "Soft delete: em vez de DELETE, preencher deleted_at = now() e deleted_by = id do usuário, e filtrar deleted_at IS NULL nas consultas — idealmente numa view ou numa policy de RLS, para ninguém esquecer o filtro. Recuperar é só limpar o deleted_at. Para 'quem fez o quê', uma tabela audit_log só de acréscimo (actor_id, action, entity, entity_id, before/after em JSON, created_at), escrita pela API ou por um trigger da BD. Desvantagens: toda consulta tem de excluir as linhas apagadas, as constraints únicas precisam ser parciais (where deleted_at is null), a tabela cresce e, pelo RGPD, ainda é preciso um caminho de exclusão real para dados pessoais.",
    rubric: [
      "deleted_at / deleted_by em vez de DELETE",
      "Filtro por padrão (view, RLS ou escopo da consulta)",
      "Log de auditoria separado, só de acréscimo",
      "Desvantagens: constraints únicas, crescimento, RGPD",
    ],
  },
  "ai-code-review": {
    title: "Revisar código gerado por IA",
    prompt:
      "Hoje os entrevistadores perguntam: **\"How do you use AI tools, and how do you make sure the code is correct?\"** (Como você usa ferramentas de IA e como garante que o código está correto?) Dê uma resposta honesta com a sua checklist.",
    modelAnswer:
      "Uso a IA como um par rápido: estrutura inicial, código repetitivo, explorar uma API que não conheço, escrever uma primeira versão de testes. Continuo responsável por cada linha que vai para produção. Antes de fazer merge verifico: faz o que foi pedido e nada mais; casos-limite e tratamento de erros; segurança — inputs validados, autorização no servidor, nenhum segredo; dependências novas existem, são mantidas e necessárias; e está coberto por testes que eu entendo. Se não consigo explicar um trecho de código numa revisão, não faço merge.",
    rubric: [
      "Honesto sobre como usa",
      "Responsabilidade: você responde pelo que vai para produção",
      "Checklist concreta (escopo, erros, segurança, dependências, testes)",
      "Consegue explicar cada linha",
    ],
  },
};

/** Frase de entrevista em PT para os termos antigos. */
export const legacyTermLinesPt: Record<string, string> = {
  "term-call-stack": "Um loop síncrono longo bloqueia a call stack, então a interface não responde.",
  "term-microtask": "Os callbacks de promises são microtasks, por isso rodam antes de qualquer callback de setTimeout.",
  "term-non-blocking": "O Node escala bem para APIs com muito I/O porque o I/O dele não bloqueia.",
  "term-race-condition": "Digitar rápido na pesquisa causava uma race condition, então cancelei os pedidos antigos com AbortController.",
  "term-closure": "O debounce guarda o timer numa closure entre as chamadas.",
  "term-hoisting": "Por causa do hoisting, posso chamar uma function declaration antes de ela aparecer no ficheiro.",
  "term-pure-function": "Mantenho o cálculo de horas como função pura, então é trivial de testar.",
  "term-immutability": "O React depende da imutabilidade para detectar mudanças pela referência.",
  "term-side-effect": "Isolo os efeitos colaterais nas bordas e mantenho a lógica central pura.",
  "term-ownership": "Assumi a responsabilidade pela release e coordenei o rollback eu mesmo.",
  "term-trade-off": "O trade-off foi mais complexidade na sincronização em troca de funcionar offline.",
  "term-stakeholder": "Alinhava com os stakeholders toda semana com uma demo curta.",
  "term-scope-creep": "Para evitar scope creep, escrevi o que entrava na v1 e passei o resto para o backlog.",
  "term-mvp": "O MVP só tinha folhas de horas; os relatórios vieram depois de vermos o uso real.",
  "term-type-narrowing": "Tipo as respostas da API como unknown e restrinjo com um schema Zod.",
  "term-generic": "O helper de retry é genérico, então mantém o tipo de retorno da função que envolve.",
  "term-discriminated-union": "Cada exercício é uma discriminated union pelo campo `kind`, então o renderizador é type-safe.",
  "term-reconciliation": "Keys estáveis ajudam a reconciliation a reutilizar os nós certos do DOM.",
  "term-stale-closure": "O intervalo mostrava valores antigos — uma stale closure — então usei a forma updater do setState.",
  "term-hydration": "Houve um erro de hydration porque eu renderizava a hora atual no servidor.",
  "term-rsc": "A lista é um Server Component; só o filtro é Client Component.",
  "term-idempotent": "Tornei o endpoint de sync idempotente para que tentar de novo não crie duplicados.",
  "term-foreign-key": "A chave estrangeira garante que todo registro de horas pertence a um projeto existente.",
  "term-join-table": "As atribuições são uma tabela de ligação entre projetos e trabalhadores, com a função nela.",
  "term-idor": "Trocar o id na URL é um IDOR, então cada pedido verifica o dono no servidor.",
  "term-least-privilege": "O cliente só recebe a anon key; a service role key fica no servidor — privilégio mínimo.",
  "term-policy": "Uma policy com auth.uid() garante que cada empresa só vê os seus projetos.",
  "term-flaky-test": "O teste era instável porque dependia do tempo real, então injetei um relógio falso.",
  "term-regression": "Adicionei um teste de regressão antes de corrigir o bug.",
  "term-audit-trail": "As exclusões são soft e toda mudança vai para um histórico de auditoria.",
};

/**
 * Palavras-chave da correção automática para os conceitos/comportamentais que não as trazem inline.
 * Um array por ponto da rubrica (mesma ordem); basta UMA expressão bater para o ponto contar.
 * Pôr variantes em EN e PT. Palavras com ≥4 letras aceitam sufixos (index → indexes, indexing).
 * Chave especial `__max_words:N__` = o ponto conta se a resposta tiver no máximo N palavras.
 */
export const rubricKeys: Record<string, string[][]> = {
  "web-type-url-concept": [
    ["dns", "ip address", "endereco ip", "domain"],
    ["http request", "request", "https", "pedido", "requisicao"],
    ["status code", "200", "response", "resposta", "html"],
    ["render", "css", "javascript", "desenha", "renderiza"],
  ],
  "web-html-css-js-concept": [
    ["html", "structure", "estrutura", "content", "conteudo"],
    ["css", "style", "layout", "appearance", "aparencia", "estilo"],
    ["javascript", "behavior", "behaviour", "interaction", "comportamento", "interacao", "click", "clique"],
    ["for example", "for instance", "por exemplo", "button", "botao", "color", "cor"],
  ],
  "html-semantic-concept": [
    ["meaning", "semantic", "significado", "semantica", "describes", "descreve"],
    ["accessibility", "screen reader", "keyboard", "acessibilidade", "leitor de tela", "teclado", "a11y"],
    ["seo", "search engine", "google", "readab", "legib"],
    ["<nav", "<button", "<main", "<article", "<header", "<footer", "<form", "nav", "article"],
  ],
  "css-responsive-concept": [
    ["screen size", "adapt", "tamanho de tela", "tamanho da tela", "devices", "dispositivos", "responsive", "responsivo"],
    ["media quer", "breakpoint"],
    ["mobile first", "mobile-first", "small screen", "tela pequena", "celular primeiro"],
    ["min-width", "max-width", "grid-template", "grid-cols", "flex-direction", "md:grid", "md:flex", "sm:", "lg:", "tailwind"],
  ],
  "git-branch-pr-concept": [
    ["branch", "main"],
    ["commit", "message", "mensagem"],
    ["pull request", "push", " pr "],
    ["review", "revisao", "revisa", "ci", "pipeline", "tests", "testes", "merge"],
  ],
  "js-let-const-var-concept": [
    ["block scope", "block-scoped", "escopo de bloco", "function scope", "function-scoped", "escopo de funcao", "hoist"],
    ["reassign", "reatribu", "cannot change", "nao pode mudar"],
    ["by default", "por padrao", "avoid var", "evitar var", "evite var"],
    ["properties", "propriedades", "mutate", "mutar", "object", "objeto"],
  ],
  "js-function-concept": [
    ["reusable", "reutiliza", "reuse", "block of code", "bloco de codigo"],
    ["parameter", "parametro"],
    ["argument", "argumento"],
    ["return", "undefined", "retorna", "devolve"],
  ],
  "event-loop-explain": [
    ["call stack", "single thread", "single-threaded", "one thing at a time", "uma coisa de cada vez", "pilha"],
    ["web api", "runtime", "browser api", "libuv", "delegat", "delega"],
    ["microtask", "promise", "macrotask", "task queue", "fila", "settimeout"],
    ["block", "bloqueia", "freeze", "congela", "long task", "rendering", "renderiz"],
  ],
  "promise-all-vs-allsettled": [
    ["fail fast", "fail-fast", "one rejection", "rejects", "rejeita", "falha"],
    ["allsettled", "status", "fulfilled", "rejected"],
    ["parallel", "paralelo", "concurrent", "ao mesmo tempo", "simultane"],
    ["race", "promise any", "timeout", "first success", "primeira"],
  ],
  "closure-explain": [
    ["lexical scope", "escopo lexico", "scope", "escopo", "remembers", "lembra"],
    ["returns", "retorna", "after the outer", "depois da funcao", "survive", "sobrevive", "still access", "continua"],
    ["counter", "contador", "debounce", "module", "modulo", "handler", "for example", "por exemplo"],
    ["stale closure", "stale", "useeffect", "react"],
  ],
  "immutability-react": [
    ["reference", "referencia", "object is", "same object", "mesmo objeto"],
    ["push", "mutate", "mutat", "muta", "re-render", "rerender"],
    ["spread", "...", "concat", "new array", "novo array", "copy", "copia"],
    ["prev", "updater", "setitems", "funcao de atualizacao"],
  ],
  "pitch-tell-me-about-yourself": [
    ["currently", "today", "right now", "i am a", "i'm a", "atualmente", "hoje", "sou"],
    ["users", "%", "hours", "revenue", "usuarios", "utilizadores", "horas", "clientes", "built", "construi"],
    ["react", "next", "typescript", "node", "supabase", "postgres", "javascript", "stack"],
    ["your company", "this role", "this position", "your team", "vaga", "empresa de voces", "join", "excited"],
    ["__max_words:200__"],
  ],
  "pitch-project-deep-dive": [
    ["users", "problem", "pain", "usuarios", "utilizadores", "problema", "dor"],
    ["i built", "i decided", "i implemented", "my part", "my role", "eu fiz", "eu construi", "meu papel"],
    ["instead of", "alternative", "trade-off", "tradeoff", "chose", "em vez de", "alternativa", "escolhi"],
    ["%", "reduced", "increased", "saved", "result", "reduzi", "aumentou", "resultado"],
    ["differently", "next time", "would change", "diferente", "mudaria", "proxima vez"],
  ],
  "star-conflict": [
    ["situation", "project", "team", "when", "situacao", "projeto", "equipe", "quando"],
    ["i decided", "i asked", "i proposed", "i listened", "i suggested", "eu propus", "eu perguntei", "eu ouvi", "decidi"],
    ["listen", "data", "metrics", "ouvi", "dados", "understood", "entendi", "perspective", "perspectiva"],
    ["result", "learned", "resultado", "aprendi", "outcome", "agreed", "concordamos"],
  ],
  "star-mistake": [
    ["mistake", "my fault", "i broke", "i forgot", "erro", "errei", "minha culpa", "esqueci"],
    ["rollback", "hotfix", "revert", "communicat", "informed", "reverti", "avisei", "comuniquei"],
    ["root cause", "because", "causa", "porque", "happened", "aconteceu"],
    ["test", "checklist", "monitor", "process", "teste", "processo", "alert", "alerta"],
  ],
  "star-why-switzerland": [
    ["because", "reason", "family", "partner", "quality", "porque", "motivo", "familia"],
    ["permit", "visa", "available", "availability", "relocat", "visto", "permissao", "disponivel", "disponibilidade"],
    ["your company", "your product", "this company", "empresa", "produto", "team", "equipe"],
    ["german", "french", "italian", "language", "alemao", "frances", "italiano", "idioma", "lingua", "portuguese", "portugues"],
  ],
  "ts-type-vs-interface": [
    ["interchangeab", "both", "same", "ambos", "parecidos", "object shape", "formato"],
    ["declaration merging", "merge", "extends", "estende"],
    ["union", "intersection", "uniao", "interseccao", "mapped", "conditional", "|"],
    ["convention", "consisten", "team", "convencao", "consisten", "equipe", "padrao do time"],
  ],
  "react-useeffect-deps": [
    ["after render", "depois do render", "re-run", "runs again", "roda de novo", "dependenc"],
    ["empty array", "[]", "array vazio", "no array", "sem array", "every render", "todo render"],
    ["stale", "missing dep", "old value", "valor antigo", "desatualizado"],
    ["cleanup", "clean up", "return a function", "unsubscribe", "clearinterval", "cleartimeout", "limpeza"],
    ["derived", "derivad", "event handler", "evento", "you might not need"],
  ],
  "react-keys": [
    ["identify", "identifica", "track", "across renders", "entre renders"],
    ["index", "indice", "order changes", "reorder", "ordem muda"],
    ["wrong", "state", "estado", "errado", "bug", "input"],
    ["stable id", "unique id", "id estavel", "id unico", "database id", "uuid"],
  ],
  "next-server-vs-client": [
    ["server component", "only on the server", "no javascript", "database", "secret", "so no servidor", "banco", "segredo"],
    ["use client", "hydrat", "hidrat", "state", "useeffect", "onclick", "event", "estado", "evento"],
    ["html", "first load", "primeiro carregamento", "pre-render", "ssr"],
    ["leaves", "leaf", "folhas", "small", "pequeno", "as low as", "o mais baixo"],
  ],
  "authn-vs-authz": [
    ["authentication", "authorization", "identity", "permission", "autenticacao", "autorizacao", "identidade", "permissao"],
    ["broken access control", "idor", "another user", "outro usuario", "outro utilizador", "someone else"],
    ["server", "backend", "database", "servidor", "banco", "never only", "nunca so", "ui"],
    ["rls", "row level", "ownership", "owner", "dono", "user_id", "every request", "cada pedido"],
  ],
  "rls-explain": [
    ["database", "every query", "banco", "cada query", "postgres", "enforced"],
    ["enable", "no policy", "sem policy", "sem politica", "deny", "nega", "blocked", "bloquea"],
    ["using", "with check", "read", "write", "leitura", "escrita"],
    ["auth uid", "auth.uid", "user id", "user_id", "authenticated", "autenticado"],
    ["defence in depth", "defense in depth", "client", "anon key", "cliente", "camada", "even if"],
  ],
  "data-modeling-nn": [
    ["join table", "junction", "tabela de juncao", "tabela intermediaria", "tabela associativa", "many to many"],
    ["attribute", "atributo", "role", "date", "quantity", "quantidade", "relationship", "relacao"],
    ["foreign key", "fk", "chave estrangeira", "composite", "composta", "unique", "primary key"],
    ["index", "indice", "reverse", "lookup", "inverso"],
  ],
  "testing-pyramid": [
    ["unit", "unitario", "isolated", "isolado", "fast", "rapido"],
    ["integration", "integracao", "api", "database", "banco"],
    ["e2e", "end to end", "end-to-end", "playwright", "cypress", "browser", "navegador"],
    ["for example", "por exemplo", "login", "checkout", "function", "funcao"],
    ["pyramid", "piramide", "trophy", "fewer", "menos", "critical", "critico"],
  ],
  "soft-delete": [
    ["deleted_at", "deleted at", "deleted_by", "flag", "marca"],
    ["filter", "filtr", "view", "rls", "scope", "where"],
    ["audit", "auditoria", "append", "log", "historico", "history"],
    ["unique", "unico", "gdpr", "rgpd", "lgpd", "growth", "cresce", "hard delete"],
  ],
  "ai-code-review": [
    ["i use", "copilot", "claude", "chatgpt", "cursor", "eu uso", "uso"],
    ["responsib", "ownership", "own", "responsavel", "responsabilidade"],
    ["security", "tests", "errors", "edge case", "seguranca", "testes", "erros", "checklist", "review"],
    ["explain", "understand", "every line", "explicar", "entender", "cada linha"],
  ],
};

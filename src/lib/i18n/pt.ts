/** Strings da interface. Centralizadas para facilitar traduzir para EN depois. */
export const t = {
  nav: { today: "Hoje", library: "Biblioteca", glossary: "Glossário", progress: "Progresso", settings: "Ajustes" },
  sections: {
    lesson: "Aula do dia",
    review: "Revisão",
    terms: "Termos técnicos",
    learn: "Conceitos",
    practice: "Código e code review",
    speak: "Fala / escrita",
  },
  sectionHints: {
    lesson: "Lê com calma. Depois vêm as perguntas sobre isto.",
    review: "Perguntas de dias anteriores para manter a memória fresca.",
    terms: "Vocabulário que vais usar em entrevista.",
    learn: "Explica em inglês, como se estivesses na entrevista.",
    practice: "Escreve código ou SQL e revê um PR — o formato das entrevistas de hoje.",
    speak: "Responde em voz alta e escreve os pontos-chave.",
  },
  kinds: { lesson: "Aula", concept: "Conceito", quiz: "Quiz", code: "Código", behavioral: "Comportamental", term: "Termo", review: "Code review", sql: "SQL" },
  ratings: { 1: "Errei", 2: "Difícil", 3: "Bom", 4: "Fácil" } as Record<number, string>,
  actions: {
    start: "Começar",
    continue: "Continuar",
    submit: "Ver resposta",
    run: "Correr testes",
    next: "Próximo",
    skip: "Saltar",
    reveal: "Mostrar solução",
    hint: "Dica",
    more: "Quero mais um exercício",
  },
} as const;

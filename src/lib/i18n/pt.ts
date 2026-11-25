/** Strings da interface. Centralizadas para facilitar traduzir para EN depois. */
export const t = {
  nav: { today: "Hoje", library: "Biblioteca", glossary: "Glossário", progress: "Progresso", settings: "Ajustes" },
  sections: {
    review: "Revisão",
    terms: "Termos técnicos",
    learn: "Conceitos",
    practice: "Código",
    speak: "Fala / escrita",
  },
  sectionHints: {
    review: "Perguntas de dias anteriores para manter a memória fresca.",
    terms: "Vocabulário que vais usar em entrevista.",
    learn: "Explica em inglês, como se estivesses na entrevista.",
    practice: "Escreve código e corre os testes.",
    speak: "Responde em voz alta e escreve os pontos-chave.",
  },
  kinds: { concept: "Conceito", quiz: "Quiz", code: "Código", behavioral: "Comportamental", term: "Termo" },
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

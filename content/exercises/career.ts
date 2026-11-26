import type { LegacyExerciseInput } from "@/lib/content/schema";

export const exercises: LegacyExerciseInput[] = [
  {
    id: "pitch-tell-me-about-yourself",
    kind: "behavioral",
    topic: "pitch",
    title: "Tell me about yourself",
    prompt:
      "**\"Tell me about yourself.\"**\n\nWrite your 90-second answer in English. Structure: **present** (role and what you build now) → **past** (how you got here, 1–2 highlights) → **future** (why this role / this country).",
    difficulty: 2,
    estimatedMin: 10,
    tags: ["pitch"],
    timeLimitSec: 120,
    rubric: [
      "Starts with the present, not with childhood",
      "One concrete project with a number (users, time saved, revenue)",
      "Says which stack, briefly",
      "Ends with why this company / role",
      "Under ~200 words",
    ],
    modelAnswer:
      "I'm a full-stack developer with a strong product and design background. Right now I'm building a field-operations web app for an aluminium installation company — Next.js, TypeScript and Supabase — that replaced paper timesheets for their teams and works offline on site. Before that I ran my own studio building premium websites for Portuguese clients, which is where I learned to talk to clients and own a product end to end. I'm moving to Switzerland and I'm looking for a team where I can grow as an engineer, ship user-facing features and learn from more senior people — and your product is a great fit because …",
  },
  {
    id: "pitch-project-deep-dive",
    kind: "behavioral",
    topic: "pitch",
    title: "Walk me through a project",
    prompt:
      "**\"Walk me through a project you're proud of.\"**\n\nPick one project. Explain: the **problem**, **your role**, the **architecture** in one sentence, **one hard decision** and its trade-off, and the **result**.",
    difficulty: 2,
    estimatedMin: 12,
    tags: ["pitch", "architecture"],
    timeLimitSec: 180,
    rubric: [
      "Problem framed from the user's point of view",
      "Clear about what *you* did vs the team / AI tools",
      "One technical decision with an alternative you rejected",
      "Result with a metric or concrete outcome",
      "What you'd do differently",
    ],
    modelAnswer:
      "The problem: installation teams logged hours on paper and the office re-typed everything, with frequent errors. I designed and built the app alone: Next.js front end, Supabase for auth and Postgres, and IndexedDB via Dexie for offline. The hardest decision was offline-first versus a client portal first. Teams work in basements without signal, so I chose offline-first, accepting the complexity of sync and conflict resolution — I used last-write-wins per field with an audit trail. Result: timesheets are entered once, on site, and the office stopped re-typing. Next time I'd add automated tests for the sync logic earlier.",
  },
  {
    id: "star-conflict",
    kind: "behavioral",
    topic: "behavioral-star",
    title: "Disagreement with a stakeholder",
    prompt:
      "**\"Tell me about a time you disagreed with a client or teammate.\"**\n\nAnswer with **STAR**: Situation, Task, Action, Result. Keep the conflict professional and show what you learned.",
    difficulty: 2,
    estimatedMin: 10,
    tags: ["star"],
    timeLimitSec: 150,
    rubric: [
      "S and T in 2 sentences max",
      "Action is about *you* (I, not we)",
      "Shows listening and data, not just being right",
      "Result + what you learned",
    ],
    modelAnswer:
      "Situation: a client wanted a heavy animated intro on their homepage. Task: I was responsible for design and delivery, and I knew it would hurt load time on mobile. Action: instead of just saying no, I built two versions and showed them the Lighthouse scores and a recording on a mid-range phone; I proposed a lighter animation that kept the brand feel. Result: they chose the lighter version, the page loaded in under 2 seconds, and they came back for a second project. I learned to bring evidence and options, not opinions.",
  },
  {
    id: "star-mistake",
    kind: "behavioral",
    topic: "behavioral-star",
    title: "A mistake you made",
    prompt:
      "**\"Tell me about a mistake you made in production.\"**\n\nUse STAR. Interviewers want ownership, how you fixed it, and what process you changed so it doesn't happen again.",
    difficulty: 2,
    estimatedMin: 10,
    tags: ["star"],
    timeLimitSec: 150,
    rubric: [
      "Real mistake, owned without blaming others",
      "Immediate mitigation (rollback, hotfix, communication)",
      "Root cause explained simply",
      "Process change (test, checklist, monitoring)",
    ],
    modelAnswer:
      "Situation: I deployed a change to the timesheet form on a Friday evening. Task: it was my feature. Action: on Monday a team lead told me hours weren't saving — a validation I added rejected entries without a project. I rolled back within minutes, told the office which entries to re-check, then fixed the validation with a clear error message. Result: no data was lost permanently. Since then I don't deploy late on Fridays, I added a test for that form, and I set up error monitoring so I find out before users do.",
  },
  {
    id: "star-why-switzerland",
    kind: "behavioral",
    topic: "behavioral-star",
    title: "Why this country?",
    prompt:
      "**\"Why do you want to work here, in this country?\"**\n\nWrite a short, honest answer that connects your personal plans with the company. Mention work authorisation if relevant and your plan for the local language.",
    difficulty: 1,
    estimatedMin: 6,
    tags: ["motivation"],
    timeLimitSec: 90,
    rubric: [
      "Honest personal reason, briefly",
      "Clarifies work permit / availability",
      "Connects to the company, not only to the country",
      "Mentions learning the local language",
    ],
    modelAnswer:
      "I'm relocating to Switzerland and I already have a B permit, so I can start without sponsorship. I'm learning German — I'm at [your level] now and aiming for [next level] by [date]. What attracts me to your team specifically is that you build a product used every day by non-technical people, which is exactly the kind of work I've been doing — and I want to do it in a team with stronger engineering practices than I've had as a solo developer.",
  },
];

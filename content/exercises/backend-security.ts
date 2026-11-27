import type { LegacyExerciseInput } from "@/lib/content/schema";

/** Temas mais cobrados para full-stack: dados, autorização, testes, auditoria. */
export const exercises: LegacyExerciseInput[] = [
  {
    id: "authn-vs-authz",
    kind: "concept",
    topic: "authn-authz",
    title: "Authentication vs authorisation",
    prompt:
      "Explain the difference between authentication and authorisation. Then: a logged-in user changes the URL from `/projects/12` to `/projects/13` and sees another company's project. Which one failed, and where should the check live?",
    difficulty: 2,
    estimatedMin: 6,
    tags: ["security"],
    modelAnswer:
      "Authentication answers 'who are you?' — login, sessions, tokens. Authorisation answers 'are you allowed to do this to this resource?'. In the example authentication worked — the user is logged in — but authorisation failed: this is an IDOR / broken access control, OWASP's number one risk. The check must live on the server, next to the data: in the API handler or, better, in the database with Row Level Security, so that a query for project 13 returns nothing unless the user belongs to that company. Hiding the link in the UI is not a security control.",
    rubric: [
      "AuthN = identity, AuthZ = permission on a resource",
      "Example is broken access control / IDOR",
      "Check on the server or DB, never only in the UI",
      "Mentions RLS or ownership check per request",
    ],
  },
  {
    id: "rls-explain",
    kind: "concept",
    topic: "rls",
    title: "What is Row Level Security?",
    prompt:
      "Explain Row Level Security in Postgres (as used by Supabase). Write — in words or SQL — a policy so that users only see rows of `projects` whose `company_id` matches their company.",
    difficulty: 3,
    estimatedMin: 8,
    tags: ["security", "postgres", "supabase"],
    modelAnswer:
      "RLS lets the database filter rows per user. You enable it on a table, and then every query is automatically combined with the policies you define; without a matching policy, no rows are returned. In Supabase the user's id comes from the JWT via auth.uid(). Example:\n\nalter table projects enable row level security;\ncreate policy \"company members read projects\" on projects for select using (company_id in (select company_id from memberships where user_id = auth.uid()));\n\nSeparate policies for insert/update use WITH CHECK so users can't write rows into another company. The advantage is that even a bug in the API or a direct client query can't leak data.",
    rubric: [
      "RLS is enforced by the DB on every query",
      "Enable RLS + no policy = no access",
      "USING filters reads; WITH CHECK guards writes",
      "Uses the authenticated user's id (auth.uid())",
      "Defence in depth even with client-side queries",
    ],
    followUp: "What's the risk of the service_role key in Supabase?",
  },
  {
    id: "data-modeling-nn",
    kind: "concept",
    topic: "data-modeling",
    title: "Modelling many-to-many",
    prompt:
      "A project can have many workers and a worker can be on many projects. Each assignment has a role (lead/helper) and a start date. Design the tables (names, key columns, keys/constraints).",
    difficulty: 2,
    estimatedMin: 8,
    tags: ["sql", "modeling"],
    modelAnswer:
      "Three tables. projects(id pk, name, company_id fk). workers(id pk, name, company_id fk). And a join table project_assignments(project_id fk → projects, worker_id fk → workers, role text check (role in ('lead','helper')), started_at date not null, primary key (project_id, worker_id)). The composite primary key prevents duplicate assignments; the role and date live on the join table because they describe the relationship, not the project or the worker. I'd add an index on worker_id to quickly list a worker's projects, since the PK index already covers lookups by project_id.",
    rubric: [
      "Join table for N:N",
      "Attributes of the relationship live on the join table",
      "Foreign keys + composite PK or unique constraint",
      "Index for the reverse lookup",
    ],
  },
  {
    id: "sql-join-quiz",
    kind: "quiz",
    topic: "sql-joins",
    title: "LEFT JOIN",
    prompt:
      "You want **all** projects, including those with no time entries yet, with the total hours of each.\n\n```sql\nSELECT p.name, COALESCE(SUM(t.hours), 0) AS total\nFROM projects p\n____ time_entries t ON t.project_id = p.id\nGROUP BY p.name;\n```\n\nWhich join goes in the blank?",
    difficulty: 1,
    estimatedMin: 2,
    tags: ["sql"],
    options: ["INNER JOIN", "LEFT JOIN", "RIGHT JOIN", "CROSS JOIN"],
    answerIndex: 1,
    explanation:
      "LEFT JOIN keeps every row from the left table (projects) even with no match; the missing side is NULL, which COALESCE turns into 0. INNER JOIN would drop projects with no entries.",
  },
  {
    id: "testing-pyramid",
    kind: "concept",
    topic: "testing",
    title: "Unit, integration and e2e",
    prompt:
      "Explain the difference between unit, integration and end-to-end tests. For a web app with login and a timesheet form, give **one example of each** that you would actually write.",
    difficulty: 2,
    estimatedMin: 7,
    tags: ["testing"],
    modelAnswer:
      "Unit tests check one function in isolation and are fast — e.g. a function that calculates the total hours from start/end times, including overnight shifts. Integration tests check several pieces working together, often with a real database — e.g. the API route that saves a time entry rejects a user who isn't on that project. End-to-end tests drive the real app in a browser — e.g. Playwright logs in, fills the timesheet and sees it in the list. I'd have many unit tests, a good number of integration tests on critical rules like permissions, and a few e2e tests on the main user journeys, because e2e are slower and flakier.",
    rubric: [
      "Unit: isolated, fast, pure logic",
      "Integration: pieces together (API + DB)",
      "E2E: real browser, user journey",
      "Concrete example for each",
      "Pyramid/trophy: fewer e2e, focus on critical rules",
    ],
  },
  {
    id: "soft-delete",
    kind: "concept",
    topic: "soft-delete-audit",
    title: "Soft delete and audit log",
    prompt:
      "A client deleted a project by mistake and wants it back, and also wants to know **who** deleted it. How would you design deletion so both are possible? What are the downsides?",
    difficulty: 2,
    estimatedMin: 7,
    tags: ["architecture", "sql"],
    modelAnswer:
      "Soft delete: instead of DELETE, set deleted_at = now() and deleted_by = user id, and filter deleted_at IS NULL in queries — ideally in a view or an RLS policy so nobody forgets the filter. Restoring is just clearing deleted_at. For 'who did what', an append-only audit_log table (actor_id, action, entity, entity_id, before/after JSON, created_at), written by the API or a database trigger. Downsides: every query must exclude deleted rows, unique constraints need to be partial (where deleted_at is null), the table grows, and for GDPR you still need a real hard-delete path for personal data.",
    rubric: [
      "deleted_at / deleted_by instead of DELETE",
      "Default filtering (view, RLS or query scope)",
      "Separate append-only audit log",
      "Downsides: unique constraints, growth, GDPR hard delete",
    ],
  },
  {
    id: "ai-code-review",
    kind: "concept",
    topic: "ai-safety",
    title: "Reviewing AI-generated code",
    prompt:
      "Interviewers now ask: **\"How do you use AI tools, and how do you make sure the code is correct?\"** Give an honest answer with your checklist.",
    difficulty: 2,
    estimatedMin: 6,
    tags: ["ai", "quality"],
    modelAnswer:
      "I use AI as a fast pair: scaffolding, boilerplate, exploring an unfamiliar API, writing a first version of tests. I stay responsible for every line that ships. Before merging I check: does it do what was asked and nothing more; edge cases and error handling; security — inputs validated, authorisation on the server, no secrets; new dependencies are real, maintained and needed; and it's covered by tests that I understand. If I can't explain a piece of code in a review, I don't merge it.",
    rubric: [
      "Honest about how you use it",
      "Ownership: you're responsible for what ships",
      "Concrete checklist (scope, errors, security, deps, tests)",
      "Can explain every line",
    ],
  },
];

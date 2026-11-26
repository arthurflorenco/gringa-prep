# gringa-prep

**Daily, active practice for developers preparing for tech interviews abroad** (Switzerland, UK, EU, remote).

Every day you get a short session (~45 min) built from an 8-week track that starts **from zero** (how the web works, HTML, CSS, Git, JavaScript basics) and ends at interview level (React, Next.js, SQL, auth, testing, architecture):

- **Lesson of the day** — a short explanation before any question.

- **Review** — questions from previous days, scheduled with [FSRS](https://github.com/open-spaced-repetition/ts-fsrs) spaced repetition (the algorithm behind modern Anki).
- **Technical terms** — English vocabulary with a ready-to-use interview sentence.
- **Concepts** — open questions you answer *in English*, then compare against a model answer and a rubric.
- **Code** — TypeScript exercises with visible and hidden tests, run in a sandboxed Web Worker in your browser.
- **Speak / write** — behavioral (STAR) and pitch questions with a timer.

No account, no server, no API key. Your progress lives in your browser (IndexedDB) and can be exported as JSON.

> UI is in Portuguese (pt-BR). All content exists in **English and Portuguese** — switch per question with the EN | PT toggle (or `T`).

## Stack

Next.js 16 (App Router) · React 19 · TypeScript (strict) · Tailwind CSS v4 · GSAP · Dexie (IndexedDB) · ts-fsrs · CodeMirror 6 · Sucrase · Zod · Vitest

## Getting started

```bash
npm install
npm run dev        # http://localhost:3000
npm run check      # typecheck + lint + content validation + tests
```

Simulate another day with `?date=YYYY-MM-DD` (e.g. `/?date=2026-12-01`) — useful to check that reviews come back.

## How it works

| Piece | Where |
| --- | --- |
| Content (topics, exercises, glossary) | `content/` — plain TypeScript, validated with Zod |
| Daily session builder (pure, deterministic) | `src/lib/daily/build-session.ts` |
| Spaced repetition | `src/lib/srs/` |
| Local database + backup | `src/lib/db/` |
| Code runner (Worker + mini `expect`) | `src/lib/runner/` |

The session for a day is built once and stored, so it doesn't change while you work through it. Wrong answers come back the next day; easy ones come back weeks later.

## Contributing exercises

1. Pick a topic slug from `content/topics.ts` (or add one).
2. Add an object to a file in `content/exercises/` (`concept`, `quiz`, `code`, `behavioral`) or `content/lessons/` (`lesson`). Every item needs a `pt` block with the Portuguese text. Use the existing ones as templates.
3. For `code`, provide `starter`, `solution` and `tests`. CI checks that **every solution passes its tests and every starter fails**.
4. Run `npm run check` and open a PR.

## Roadmap

- [x] Daily session, FSRS review, concept / quiz / code / behavioral / glossary
- [ ] SQL exercises in the browser with PGlite (joins, indexes + `EXPLAIN`, Row Level Security)
- [ ] Weekend mock interview mode
- [ ] Optional AI feedback on written answers (bring your own Anthropic key)
- [ ] Weeks 2–8 of content, Playwright e2e, English UI

## License

MIT

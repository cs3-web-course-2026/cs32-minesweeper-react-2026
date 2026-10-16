# CS32 Minesweeper (React) — 2026

![CI](https://github.com/cs3-web-course-2026/cs32-minesweeper-react-2026/actions/workflows/ci.yml/badge.svg)

**Live demo:** https://cs3-web-course-2026.github.io/cs32-minesweeper-react-2026/

A shared classroom repository where every student builds their own Minesweeper game in React
(Vite + CSS Modules). Each student works in their own folder under `src/pages/` and submits work
as pull requests, reviewed by both an AI reviewer and the teacher before merging. Every merge
into `main` is deployed automatically to GitHub Pages.

## Getting access

This is a **shared repository**, not something you fork.

1. Open a new issue in
   [team-access](https://github.com/cs3-web-course-2026/team-access/issues/new/choose) using
   the **"Запит у команду"** form and select the **`cs-32`** team.
2. Wait for the request to be reviewed and approved — you're added to the `cs-32` team
   automatically once it is (no separate invitation to accept).
3. Clone the repo directly:

   ```bash
   git clone https://github.com/cs3-web-course-2026/cs32-minesweeper-react-2026.git
   ```

If GitHub tells you to fork the repository, it means you don't have access yet — go back to
step 1. Pull requests opened from a fork cannot be merged.

## Local setup

You need [Node.js](https://nodejs.org/) 22.12 or newer (24 LTS recommended) and [pnpm](https://pnpm.io/installation) (`corepack enable` is enough).

```bash
pnpm install
pnpm dev
```

The app is served at `http://localhost:5173` (or the next free port).

| Script             | What it does                                       |
| ------------------ | -------------------------------------------------- |
| `pnpm dev`         | Start the Vite dev server with hot reload          |
| `pnpm build`       | Create a production build in `dist/`               |
| `pnpm preview`     | Preview the production build locally               |
| `pnpm lint`        | Run both linters below                             |
| `pnpm lint:js`     | [Oxlint](https://oxc.rs/docs/guide/usage/linter) on JS/JSX |
| `pnpm lint:css`    | Stylelint on `src/**/*.css`                        |

## Repository structure

Your whole submission lives inside **one folder named after you**, in `SurnameName` format
(surname first, given name second, PascalCase, no separator), under `src/pages/`:

```
src/
├── components/          # Shared scaffold (Layout) — do not modify
├── pages/
│   ├── Game/            # List of implementations — add one entry for yourself
│   ├── MockGame/        # Reference implementation from the teacher
│   ├── SmithWill/       # ← your folder: components, hooks, utils, CSS Modules
│   │   ├── index.jsx
│   │   └── Game.module.css
│   └── ...
├── App.jsx              # Add one <Route> for your page
└── main.jsx
```

Outside your own folder you make exactly **two** edits:

1. One `<Route>` in `src/App.jsx` with a kebab-case path (`smith-will`).
2. One entry in the `implementations` list in `src/pages/Game/index.jsx`.

Never modify other students' folders or other shared files (`main.jsx`, `global.css`,
`package.json`, configs, workflows, …).

## Labs

| Lab      | Scope           | What you build                                                                                                                                       |
| -------- | --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| **lab3** | React migration | A fully playable Minesweeper as a React app: functional components and hooks, pure game logic, immutable state updates, CSS Modules, accessible UI. |

The full assignment and grading rubric are in [`docs/lab3_en.md`](docs/lab3_en.md) (Ukrainian
original: [`docs/lab3.md`](docs/lab3.md)).

Code style, accessibility, and structural conventions are documented in
[`.github/copilot-instructions.md`](.github/copilot-instructions.md) — read it before you start;
it's also what both AI reviewers check your PR against.

## Submitting your work

1. Create a branch `lab3/SurnameName-short-description` and commit your changes.
2. Open a pull request into `main` with a title in this format:

   ```
   lab{number}: <short, lowercase description>
   ```

   Examples: `lab3: implement react minesweeper`, `lab3: add flood-fill reveal`.

3. Fill in the PR template — describe what you built and add a screenshot of the game.
4. Wait for the automated checks and AI review, then address any feedback.

## Automated checks

Every pull request is checked automatically before it can be merged:

- **CI** (GitHub Actions) — `pnpm lint` (Oxlint + Stylelint) and `pnpm build`. The whole
  project is linted and built, so a broken import or a lint error anywhere fails the check.
- **AI code review** (CodeRabbit) — checks your PR against the conventions in
  `.github/copilot-instructions.md`: naming, folder rules, React patterns, accessibility, and
  the two allowed shared-file edits. Reviews are friendly but direct about anything that blocks
  a merge.

Run the same checks locally before pushing:

```bash
pnpm lint
pnpm build
```

Formatting is handled by Prettier (`.prettierrc`); the recommended VS Code extensions in
`.vscode/extensions.json` format on save and show lint errors inline.

## Maintainers

Setting up a new course repo (GitHub Pages, SPA redirect, workflows, branch protection) is
described in [`docs/setup-new-repo.md`](docs/setup-new-repo.md).

## Questions

If something is unclear — access, a rule in the conventions doc, or feedback on a
PR — ask in the course channel or tag the teacher on your PR.

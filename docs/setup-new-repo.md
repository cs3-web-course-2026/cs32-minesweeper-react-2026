# Setting Up a New Course Repo with GitHub Pages & CI

Replace every occurrence of `csNN-minesweeper-react-2026` and `cs3-web-course-2026` below
with the actual repo name and GitHub org for the new course group.

---

## 1. Clone and scaffold

```bash
git clone https://github.com/cs3-web-course-2026/csNN-minesweeper-react-2026.git
cd csNN-minesweeper-react-2026
pnpm install
```

---

## 2. Configure Vite base path

Edit `vite.config.js` — make the base conditional so dev server works at `/`
while the production build uses the GitHub Pages sub-path:

```js
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => ({
  base: mode === "production" ? "/csNN-minesweeper-react-2026/" : "/",
  plugins: [react()],
}));
```

---

## 3. Configure React Router basename

Edit `src/main.jsx` — use `import.meta.env.BASE_URL` so the router always matches
the Vite base, in both dev and production:

```jsx
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./global.css";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/$/, "")}>
      <App />
    </BrowserRouter>
  </StrictMode>,
);
```

> `BASE_URL` has a trailing slash — the `.replace(/\/$/, '')` strips it for React Router.

---

## 4. Fix global styles import

Rename `src/global.module.css` → `src/global.css` (plain CSS, not a CSS Module),
then update the import in `main.jsx`:

```bash
mv src/global.module.css src/global.css
```

The import line is already correct if you copied step 3 above (`import './global.css'`).

> **Why this matters:** Files named `*.module.css` are processed by Vite's CSS Modules
> pipeline. While element selectors like `:root`, `body`, and `a` technically pass through,
> the file is not treated as a plain global stylesheet — `:root` custom properties and base
> resets (font, margin, background) are not reliably applied, leaving the page with browser
> defaults (Times serif font, white background, blue link colours). Renaming to `.css` makes
> Vite inject it as a normal global stylesheet.

---

## 5. Use React Router `<Link>` for internal navigation

Any component that links to an internal route must use `<Link>` from `react-router-dom`,
not a plain `<a href>`. Plain `<a>` tags ignore the `basename` and will navigate to
the wrong URL in production.

```jsx
// Good
import { Link } from 'react-router-dom'
<Link to="/mock-game">View →</Link>

// Bad — ignores basename
<a href="/mock-game">View →</a>
```

---

## 6. Fix direct-URL access (GitHub Pages SPA redirect)

GitHub Pages is a static file server. Visiting a route like `/csNN-minesweeper-react-2026/game`
directly returns a 404 because no `game/index.html` file exists on disk.
The fix is a `404.html` that encodes the path into a query string and redirects to the
root, where `index.html` decodes it before React boots.

### `public/404.html`

Create this file — Vite copies everything in `public/` into `dist/` as-is:

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>cs-NN-minesweeper-game-react</title>
    <script>
      var pathSegmentsToKeep = 1; // number of sub-path segments: /csNN-minesweeper-react-2026
      var location = window.location;
      var redirectUrl =
        location.protocol +
        "//" +
        location.hostname +
        (location.port ? ":" + location.port : "") +
        location.pathname
          .split("/")
          .slice(0, 1 + pathSegmentsToKeep)
          .join("/") +
        "/?p=/" +
        location.pathname
          .split("/")
          .slice(1 + pathSegmentsToKeep)
          .join("/")
          .replace(/&/g, "~and~") +
        (location.search
          ? "&q=" + location.search.slice(1).replace(/&/g, "~and~")
          : "") +
        location.hash;
      location.replace(redirectUrl);
    </script>
  </head>
  <body></body>
</html>
```

### `index.html` — add decode script inside `<head>`

```html
<script>
  // GitHub Pages SPA redirect — restore the path encoded by 404.html
  (function () {
    var redirect = sessionStorage.redirect;
    delete sessionStorage.redirect;
    if (redirect && redirect !== location.href) {
      history.replaceState(null, null, redirect);
      return;
    }
    var search = location.search;
    if (search.length > 1) {
      var params = search.slice(1).split("&");
      var pParam = params.find(function (p) {
        return p.startsWith("p=/");
      });
      if (pParam) {
        var path = pParam.slice(2).replace(/~and~/g, "&");
        var qParam = params.find(function (p) {
          return p.startsWith("q=");
        });
        var query = qParam ? "?" + qParam.slice(2).replace(/~and~/g, "&") : "";
        history.replaceState(
          null,
          null,
          location.pathname.replace(/\/$/, "") + path + query + location.hash,
        );
      }
    }
  })();
</script>
```

**How it works:**

1. User visits `.../csNN-minesweeper-react-2026/game` directly
2. No file found → GitHub serves `404.html`
3. `404.html` redirects to `.../csNN-minesweeper-react-2026/?p=/game`
4. `index.html` loads, the script restores the original URL via `history.replaceState`
5. React Router sees `/game` and renders the correct page

---

## 7. Create GitHub Actions workflows

Create two files:

### `.github/workflows/ci.yml` — runs on every PR

```yaml
name: CI

on:
  pull_request:
    branches: [main]

permissions:
  contents: read

jobs:
  ci:
    name: Lint & Build
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7

      - name: Set up pnpm
        uses: pnpm/action-setup@v4

      - name: Set up Node.js
        uses: actions/setup-node@v7
        with:
          node-version: 24
          cache: pnpm

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Lint
        run: pnpm run lint

      - name: Build
        run: pnpm run build
```

### `.github/workflows/deploy.yml` — runs on push to `main`

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: true

jobs:
  build:
    name: Lint & Build
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7

      - name: Set up pnpm
        uses: pnpm/action-setup@v4

      - name: Set up Node.js
        uses: actions/setup-node@v7
        with:
          node-version: 24
          cache: pnpm

      - name: Install dependencies
        run: pnpm install --frozen-lockfile

      - name: Lint
        run: pnpm run lint

      - name: Build
        run: pnpm run build

      - name: Upload build artifact
        uses: actions/upload-pages-artifact@v5
        with:
          path: dist

  deploy:
    name: Deploy to GitHub Pages
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v5
```

---

## 7. Enable GitHub Pages

1. Go to the repo on GitHub → **Settings → Pages**
2. Under **Source** select **GitHub Actions**
3. Save

Push to `main` — the deploy workflow will run and the site will be live at:
`https://cs3-web-course-2026.github.io/csNN-minesweeper-react-2026/`

---

## 8. Add the deployed URL to README.md

Once the site is live, add a **Live demo** link near the top of `README.md`:

```md
# CS-NN Minesweeper Game - React

**Live demo:** https://cs3-web-course-2026.github.io/csNN-minesweeper-react-2026/game

A React-based implementation...
```

---

## 9. Protect the main branch

1. Go to **Settings → Branches → Add branch protection rule**
2. **Branch name pattern**: `main`
3. Enable **Require status checks to pass before merging**
4. Search for and add: `CI / Lint & Build`
5. Enable **Require branches to be up to date before merging**
6. Optionally enable **Do not allow bypassing the above settings**
7. Save

> The `CI / Lint & Build` check only appears in the search after the first CI run.
> You can type it manually before that.

---

## 10. Enable AI code review and team access

1. Make sure the **CodeRabbit** GitHub App has access to the new repository
   (org **Settings → GitHub Apps → CodeRabbit → Repository access**). The review behaviour
   itself is configured in `.coderabbit.yaml` at the repo root.
2. Give the matching team (`cs-NN`) **Write** permission on the repository
   (repo **Settings → Collaborators and teams**). Students request membership through the
   [team-access](https://github.com/cs3-web-course-2026/team-access) repository — that flow
   only adds team membership, not repository permissions.
3. In `.github/copilot-instructions.md` and `README.md`, the team name `cs-31` must match the
   repository's group (`cs-NN`).

> Linting is done by [Oxlint](https://oxc.rs) (`.oxlintrc.json`) and Stylelint
> (`.stylelintrc.json`); both run through `pnpm run lint`, which CI executes before the build.

---

## Summary checklist

- [ ] `vite.config.js` — conditional `base` using `mode`
- [ ] `src/main.jsx` — `BrowserRouter` with `import.meta.env.BASE_URL`
- [ ] `src/global.module.css` renamed to `src/global.css`
- [ ] Internal links use `<Link>` not `<a href>`
- [ ] `public/404.html` created (GitHub Pages SPA redirect)
- [ ] `index.html` has the path-restore script in `<head>`
- [ ] `.github/workflows/ci.yml` created
- [ ] `.github/workflows/deploy.yml` created
- [ ] GitHub Pages source set to **GitHub Actions**
- [ ] `README.md` updated with live demo URL
- [ ] Branch protection rule requiring `CI / Lint & Build`
- [ ] CodeRabbit app enabled for the repository, `.coderabbit.yaml` present
- [ ] Team `cs-NN` has Write access to the repository

## What was done

<!-- Briefly describe what this PR implements or changes -->

## Screenshots

<!-- Add screenshots of your Minesweeper game here -->

## Checklist

- [ ] PR title follows the format `lab3: short description` (e.g. `lab3: implement react minesweeper`)
- [ ] All my code is inside my own `src/pages/{SurnameName}/` folder
- [ ] Outside my folder I only added one `<Route>` to `src/App.jsx` and one entry to `implementations` in `src/pages/Game/index.jsx`
- [ ] No other shared files were modified (`main.jsx`, `global.css`, `vite.config.js`, `package.json`, etc.)
- [ ] Only functional components with hooks are used — no class components
- [ ] No direct DOM manipulation (`document.querySelector`, `innerHTML`, etc.)
- [ ] No `alert()`, `confirm()`, or `prompt()` for game feedback
- [ ] State is never mutated directly — always use the setter from `useState` / `dispatch`
- [ ] Styles are applied via CSS Modules (`import styles from './…module.css'`)
- [ ] The game is playable: reveal, flag, win/loss detection, mine counter all work
- [ ] `pnpm run lint` and `pnpm run build` pass locally

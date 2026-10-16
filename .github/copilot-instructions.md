# Copilot Instructions for Minesweeper — Lab 3 (React)

These instructions guide GitHub Copilot when generating or suggesting code for this project.
This is **Lab 3**: a React implementation of the Minesweeper game built with Vite and CSS Modules.
Follow all conventions below consistently across every file.

---

## Meaningful Naming

Always use full, descriptive names for every variable, parameter, function, and component. Never
use single-letter names or cryptic abbreviations.

### Variable and parameter naming

| Avoid                    | Use instead                          |
| ------------------------ | ------------------------------------ |
| `r`                      | `row`                                |
| `c`                      | `col`                                |
| `nr`                     | `neighbourRow`                       |
| `nc`                     | `neighbourCol`                       |
| `dr`                     | `directionalRow`                     |
| `dc`                     | `directionalCol`                     |
| `i`, `j` (in grid loops) | `row`, `col`                         |
| `n`                      | `count` or a domain-specific name    |
| `el`                     | `element`                            |
| `btn`                    | `button`                             |
| `val`                    | `value`                              |
| `arr`                    | domain-specific name (e.g. `cells`)  |
| `e`                      | `event`                              |
| `cb`                     | `callback` or a verb like `onReveal` |

### Component and hook naming

- **Components** use PascalCase and describe the UI element: `GameBoard`, `CellButton`,
  `StatusBar`, `MineCounter`.
- **Custom hooks** start with `use` and describe the value/behaviour they encapsulate:
  `useGameState`, `useTimer`, `useMineCounter`.
- **Event-handler props** start with `on`: `onCellClick`, `onCellRightClick`, `onRestart`.
- **Handler implementations** inside a component start with `handle`: `handleCellClick`,
  `handleRestart`.

### Function naming

- Use verb-noun pairs: `revealCell`, `countAdjacentMines`, `toggleFlag`, `checkWinCondition`,
  `createBoard`, `placeMines`.

### General rules

- Prioritise readability over brevity.
- Names must be self-documenting: a reader should understand intent without needing a comment.
- Use camelCase for variables, functions, and props; PascalCase for components and types;
  UPPER_SNAKE_CASE for top-level constants.

---

## Enums and Constants

Use constant objects (enum-style) instead of raw string or number literals wherever a fixed set
of values exists. Define these objects in a dedicated constants file or at the top of the
relevant module.

### Pattern

```js
// src/pages/{SurnameName}/constants/game.js
export const CELL_STATE = {
  CLOSED: "closed",
  OPEN: "open",
  FLAGGED: "flagged",
};

export const GAME_STATUS = {
  IDLE: "idle",
  PLAYING: "playing",
  WON: "won",
  LOST: "lost",
};

export const CELL_CONTENT = {
  MINE: "mine",
  EMPTY: "empty",
};
```

### Usage

```jsx
// Good
if (cell.state === CELL_STATE.FLAGGED) { ... }
if (gameStatus === GAME_STATUS.WON) { ... }

// Bad — never use raw literals scattered through components
if (cell.state === 'flagged') { ... }
if (gameStatus === 'won') { ... }
```

### Rules

- Always reference the constant object in logic, conditionals, and JSX class conditions.
- Never duplicate the same string or magic number in more than one place.
- Group related constants into a single exported object.
- Place constant objects in your own `constants/game.js` (relative to your `src/pages/{SurnameName}/` folder).

---

## Project Structure

Each student works in a **fully self-contained folder** under `src/pages/{SurnameName}/`.
All constants, utils, hooks, and sub-components live _inside_ that folder — never in shared
top-level directories. This eliminates merge conflicts between students and makes code-review
boundaries obvious.

```
src/
├── components/             # Shared scaffold only (Layout, Nav) — do not modify
├── pages/
│   ├── Game/
│   │   └── index.jsx        # Add your entry to the implementations list here
│   └── {SurnameName}/       # ← your entire submission lives here
│       ├── index.jsx         # Page entry point (export default)
│       ├── Game.module.css
│       ├── constants/
│       │   └── game.js       # CELL_STATE, GAME_STATUS, CELL_CONTENT, …
│       ├── utils/            # (a single utils.js file is also fine for a small project)
│       │   ├── board.js      # createBoard, placeMines, calculateAdjacency
│       │   ├── reveal.js     # revealCell, floodFillReveal
│       │   └── checks.js     # checkWinCondition, isInBounds
│       ├── hooks/
│       │   ├── useGameState.js
│       │   └── useTimer.js
│       └── components/
│           ├── Board.jsx
│           ├── Board.module.css
│           ├── CellButton.jsx
│           ├── CellButton.module.css
│           ├── Timer.jsx
│           ├── Timer.module.css
│           ├── GameStatus.jsx
│           ├── GameStatus.module.css
│           ├── RestartButton.jsx
│           └── RestartButton.module.css
├── App.jsx                   # Do not modify — only add your route
└── main.jsx                  # Do not modify
```

> **Rule:** never place your files anywhere outside `src/pages/{SurnameName}/`,
> except for the two required shared-file edits described in the Repository Structure section.
> Never modify files that belong to another student or to the shared scaffold.

---

## Spacing and Formatting

Consistent spacing makes code easier to scan and review.

### Group separation

Separate distinct groups of code with a single blank line:

1. **Imports** — grouped: React, third-party, local.
2. **Constants / configuration** — one block before the component.
3. **Component function** — props destructured in parameters.
4. **Hooks** (state, effects, custom hooks) — at the top of the component body.
5. **Event handlers** — `handle*` functions after hooks.
6. **Return / JSX** — preceded by a blank line.

### Example

```jsx
import { useState, useCallback } from "react";

import { CELL_STATE, GAME_STATUS } from "./constants/game";
import { createBoard, revealCell, toggleFlag } from "./utils/board";
import CellButton from "./components/CellButton";

import styles from "./Game.module.css";

const DEFAULT_ROWS = 9;
const DEFAULT_COLS = 9;
const DEFAULT_MINE_COUNT = 10;

function Game() {
  const [board, setBoard] = useState(() =>
    createBoard(DEFAULT_ROWS, DEFAULT_COLS),
  );
  const [gameStatus, setGameStatus] = useState(GAME_STATUS.IDLE);
  const [flagsPlaced, setFlagsPlaced] = useState(0);

  const handleCellClick = useCallback(
    (row, col) => {
      if (gameStatus === GAME_STATUS.WON || gameStatus === GAME_STATUS.LOST) {
        return;
      }

      setBoard((previousBoard) => revealCell(previousBoard, row, col));
    },
    [gameStatus],
  );

  const handleRestart = useCallback(() => {
    setBoard(createBoard(DEFAULT_ROWS, DEFAULT_COLS));
    setGameStatus(GAME_STATUS.IDLE);
    setFlagsPlaced(0);
  }, []);

  return (
    <main className={styles.game}>
      <header className={styles.statusBar}>
        <button type="button" onClick={handleRestart} aria-label="Restart game">
          🔄
        </button>
        <span>{DEFAULT_MINE_COUNT - flagsPlaced} mines remaining</span>
      </header>

      <div className={styles.board} role="grid">
        {board.map((boardRow, row) =>
          boardRow.map((cell, col) => (
            <CellButton
              key={`${row}-${col}`}
              cell={cell}
              row={row}
              col={col}
              onReveal={handleCellClick}
              onFlag={handleCellRightClick}
            />
          )),
        )}
      </div>
    </main>
  );
}

export default Game;
```

### Rules

- One blank line between logical sections inside a component.
- Two blank lines between top-level declarations / component definitions.
- A blank line before every `return` statement (except single-expression arrow functions).
- No trailing whitespace.
- Use 2-space indentation consistently.

---

## React Component Conventions

### Functional components only

Use functional components with hooks — no class components.

```jsx
// Good
function CellButton({ cell, row, col, onReveal, onFlag }) { ... }

// Bad
class CellButton extends React.Component { ... }
```

### Props

- Destructure props in the function signature.
- Use descriptive prop names (`onReveal`, not `onClick`).
- Keep components focused: one responsibility per component.

### Key prop

When rendering lists, always use a stable, unique `key` — never use the array index when the
list items can change:

```jsx
// Good — stable key based on domain identity
board.map((row, rowIndex) =>
  row.map((cell, colIndex) => (
    <CellButton key={`${rowIndex}-${colIndex}`} ... />
  ))
)

// Bad — index key in a dynamic list
cells.map((cell, index) => <CellButton key={index} ... />)
```

### Immutable state updates

Never mutate state directly. Always create a new array/object:

```jsx
// Good
setBoard((previousBoard) =>
  previousBoard.map((boardRow, row) =>
    boardRow.map((cell, col) => {
      if (row === targetRow && col === targetCol) {
        return { ...cell, state: CELL_STATE.OPEN };
      }

      return cell;
    }),
  ),
);

// Bad — direct mutation
board[row][col].state = CELL_STATE.OPEN;
setBoard(board);
```

---

## Pure Logic vs. React

Game logic (board creation, mine placement, flood-fill reveal, win/loss detection) must be
written as **pure functions** in your own `src/pages/{SurnameName}/` folder (a `utils.js` file or a `utils/` folder) and imported by hooks or components — never
written inline inside JSX or event handlers.

```
utils/board.js     — createBoard, placeMines, calculateAdjacency
utils/reveal.js    — revealCell, floodFillReveal
utils/checks.js    — checkWinCondition, isInBounds
```

### Rules

- Pure functions receive all inputs as parameters and return new values — no side effects.
- They must not import from React or call `useState` / `useEffect`.
- Cover pure functions with unit tests if the course requires it.

---

## State Management

All mutable game state lives in React state (via `useState` or `useReducer`) inside a custom
hook — never as module-level `let`/`var` declarations.

### Preferred pattern — `useReducer` for complex state

```js
// src/pages/{SurnameName}/hooks/useGameState.js
import { useReducer, useCallback } from "react";

import { GAME_STATUS } from "../constants/game";
import { createBoard } from "../utils/board";

const DEFAULT_CONFIG = { rows: 9, cols: 9, mineCount: 10 };

function createInitialState(config = DEFAULT_CONFIG) {
  return {
    board: createBoard(config.rows, config.cols),
    gameStatus: GAME_STATUS.IDLE,
    flagsPlaced: 0,
    elapsedSeconds: 0,
    config,
  };
}

function gameReducer(state, action) {
  switch (action.type) {
    case "RESTART":
      return createInitialState(state.config);
    case "REVEAL_CELL":
    // return updated state
    case "TOGGLE_FLAG":
    // return updated state
    default:
      return state;
  }
}

export function useGameState() {
  const [state, dispatch] = useReducer(
    gameReducer,
    undefined,
    createInitialState,
  );

  const restart = useCallback(() => dispatch({ type: "RESTART" }), []);

  return { state, restart };
}
```

### Rules

- Do not declare `let isGameRunning`, `let flagsPlaced`, etc. at module level.
- All runtime state belongs in `useState` / `useReducer`.
- Pass state slices as props or expose them via a custom hook — never use mutable global
  objects.

---

## Semantic JSX

Use the correct HTML elements in JSX. Never use `<div>` or `<span>` for interactive controls.

### Structure

Every page must use landmark elements:

```jsx
function GamePage() {
  return (
    <>
      <header className={styles.statusBar}>
        <button type="button" aria-label="Restart game" onClick={handleRestart}>
          🔄
        </button>
        <span id="mine-counter">{minesRemaining} mines</span>
        <span id="timer">{elapsedSeconds}s</span>
      </header>

      <main>
        <div
          className={styles.board}
          role="grid"
          aria-label="Minesweeper board"
        >
          {/* cells */}
        </div>
        <p role="status" aria-live="polite">
          {gameMessage}
        </p>
      </main>
    </>
  );
}
```

### Rules

- Use `<main>` for the primary game area.
- Use `<header>` for the status bar and controls.
- Use `<button type="button">` for every interactive cell and control.
- Give `index.html` a meaningful `<title>` — never leave it as "Document".

---

## Accessibility

All users must be able to understand and interact with the game.

### Required attributes

- `lang` is already set on `<html>` in `index.html` — do not remove it.
- Every `<img>` must have an `alt` attribute:
  ```jsx
  <img src={flagIcon} alt="Flag" />
  <img src={sparkle} alt="" /> {/* decorative */}
  ```
- Every `<button>` without visible text must have `aria-label`:
  ```jsx
  <button type="button" aria-label="Restart game">
    🔄
  </button>
  ```

### Dynamic game feedback

Update a JSX element instead of calling `alert()`:

```jsx
// Good
<p role="status" aria-live="polite">
  {gameMessage}
</p>;

// Bad
alert("You won!");
```

### Cell buttons

Each rendered cell must carry an `aria-label` describing its current state:

```jsx
function CellButton({ cell, row, col, onReveal, onFlag }) {
  const label = `Row ${row + 1}, column ${col + 1}, ${cell.state}`;

  return (
    <button
      type="button"
      aria-label={label}
      className={styles[cell.state]}
      onClick={() => onReveal(row, col)}
      onContextMenu={(event) => {
        event.preventDefault();
        onFlag(row, col);
      }}
    />
  );
}
```

---

## CSS Modules

This project uses CSS Modules (`.module.css`). Follow these rules:

### Import and usage

```jsx
import styles from './Game.module.css';

// Good
<div className={styles.board}>

// Bad — global class strings
<div className="board">
```

### Conditional classes

Use template literals or a utility; never string-concatenate raw class names:

```jsx
const cellClass = [
  styles.cell,
  cell.state === CELL_STATE.OPEN ? styles.open : "",
  cell.hasMine && cell.state === CELL_STATE.OPEN ? styles.mine : "",
]
  .filter(Boolean)
  .join(" ");
```

### No magic-number font sizes

```css
/* Bad */
.cell {
  font-size: 600%;
}

/* Good */
.cell {
  font-size: var(--cell-font-size, 1.5rem);
}
```

### No duplicate declarations

Never declare the same property twice in the same rule block.

### Domain values as custom properties

```css
/* In your module or a shared variables file */
:root {
  --board-columns: 9;
  --cell-size: 2.5rem;
  --animation-duration: 0.3s;
}
```

---

## General Best Practices

- **Pure functions** — game logic in your `utils` module must be free of side effects.
- **Single responsibility** — each component and function does exactly one thing.
- **No magic numbers** — use named constants (`DEFAULT_MINE_COUNT`, `DIRECTIONS`).
- **Early returns** — use guard clauses to reduce nesting.
- **No direct DOM access** — never call `document.querySelector` / `getElementById` inside
  React components. Use refs (`useRef`) only when absolutely necessary (e.g. focusing an
  element after an interaction).
- **`useEffect` discipline** — always supply a dependency array. Clean up timers and
  subscriptions in the cleanup function.
- **Consistent style** — apply all rules above to every file in the project, not just new code.

---

## Repository Access and Forking

Students must have **direct write access** to this repository to push branches and open pull
requests. Do **not** fork the repository — pull requests from forks cannot be merged into the
main workflow.

### If you see a "You must fork this repository" message

This means your GitHub account has not been granted access yet. To get access:

1. Open a new issue in
   **[team-access](https://github.com/cs3-web-course-2026/team-access/issues/new/choose)**
   using the **"Запит у команду"** form and select the **`cs-32`** team.
2. Wait for the request to be reviewed and approved — once approved you are added to the
   `cs-32` team automatically (no separate invitation to accept).
3. Clone the repository directly (no fork needed).

### Reviewer checks for forked PRs

If a pull request originates from a **fork** (the head repository is different from the base
repository), do **not** approve or merge it. Leave a `REQUEST_CHANGES` review with the
following guidance:

> It looks like this PR was opened from a fork. In this course we work directly in the shared
> repository, so fork-based PRs cannot be merged. Here's what to do:
>
> 1. Request access by opening an issue in
>    [team-access](https://github.com/cs3-web-course-2026/team-access/issues/new/choose)
>    (use the "Запит у команду" form, team `cs-32`).
> 2. Once the request is approved, clone the main repo, recreate your branch there, and open
>    a new PR from that branch.
>
> No need to redo your work — just copy your files into the new branch. Feel free to ask if
> you need help!

---

## Repository Structure

All files submitted by a student must be placed inside a dedicated folder under `src/pages/`,
named after the student using the `SurnameName` format (e.g. `SmithJohn/`, `MokhNazar/`).

### Rules

- Every new file must reside under `src/pages/{SurnameName}/` — never in the repository root
  or any other folder.
- The folder name must follow the `SurnameName` convention: surname first, given name second,
  no separator, each part capitalised (PascalCase).
- Outside your own folder, exactly **two** shared-file edits are permitted and required:
  1. Add one `<Route>` entry to `src/App.jsx`. The route `path` must follow the kebab-case
     format `{surname-name}` (e.g. `smith-john`, `mokh-nazar`). No other changes to that
     file are permitted.
  2. Add one entry to the `implementations` list in `src/pages/Game/index.jsx`. No other
     changes to that file are permitted.
- Do not modify any other shared files (`src/main.jsx`, `src/global.css`,
  `index.html`, config files, etc.).
- Do not add styles to `src/global.css` or any other shared stylesheet. All styles
  must live inside your own `src/pages/{SurnameName}/` folder using CSS Modules.

### Examples

```
src/pages/
├── SmithWill/
│   ├── index.jsx
│   ├── Game.module.css
│   └── components/
│       ├── CellButton.jsx
│       └── StatusBar.jsx
└── DeppJohny/
    ├── index.jsx
    └── Game.module.css
```

---

## Pull Request Conventions

### Title format

Every pull request title must begin with a lab identifier followed by a colon and a space:

```
lab{number}: <short description>
```

### Example for this repo

```
lab3: implement React Minesweeper
lab3: add flood-fill reveal
lab3: add flag toggling and win detection
```

### Rules

- This repository is **Lab 3** — all PR titles must use `lab3:`.
- The description after the colon must be lowercase and concise.
- The head branch should be named `lab3/SurnameName-short-description`
  (e.g. `lab3/MokhNazar-add-reveal-logic`). A mismatch is a style note, not a blocker.
- No PR should be opened without the `lab3:` prefix — reviewers will reject titles that do not
  follow this format.

### Reviewer checks

When reviewing a pull request, verify all of the following before approving:

1. **PR title** starts with `lab3: ` as described above.

2. **All changed files** are inside the author's own `src/pages/{SurnameName}/` folder, with
   exactly two permitted shared-file edits:
   - One `<Route>` entry added to `src/App.jsx`. The route `path` must be kebab-case
     (`{surname-name}`). Any other change to `src/App.jsx` is a **high-severity** issue.
   - One entry added to the `implementations` list in `src/pages/Game/index.jsx`. Any other
     change to that file is a **high-severity** issue.
     No other files outside the student's folder should be added, modified, or deleted. Shared
     infrastructure files (`main.jsx`, `global.css`, `vite.config.js`, `package.json`,
     etc.) must not be touched.
   - If `src/global.css` or any other shared stylesheet was modified, flag it as a
     **high-severity** issue and request changes: all styles must live in the student's own
     CSS Module files inside `src/pages/{SurnameName}/`.

3. **No peer's folder has been fully deleted.** If the diff shows that every file under a
   `src/pages/{SurnameName}/` folder belonging to _another_ student has been removed, flag it
   immediately.
   - Request changes explaining which folder was unintentionally deleted and asking the author
     to restore it (e.g. `git checkout main -- src/pages/SmithWill`) before the PR can be
     merged.

4. **React functional components only.** Verify that no class components are used anywhere in
   the student's folder.
   - If a class component is found, flag it as a **medium-severity** issue and ask the student
     to rewrite it as a functional component with hooks.

5. **No direct DOM manipulation.** Verify that the student's code does not contain
   `document.querySelector`, `document.getElementById`, `addEventListener` (outside React),
   `innerHTML`, `createElement`, `classList`, etc.
   - If DOM manipulation is found, this is a **high-severity** issue — request changes with a
     comment explaining that all DOM updates must go through React state and JSX, not direct
     DOM API calls.

6. **No `alert()` / `confirm()` / `prompt()`.** Game feedback (win, loss) must be shown via
   JSX state, not browser dialogs.
   - If found, flag as **high-severity** and request changes.

7. **State immutability.** Verify that state is never mutated directly (e.g. `board[r][c].state = …`
   followed by `setBoard(board)`).
   - If direct mutation is found, flag as **high-severity**.

8. **Pure logic separation.** Game logic functions (`createBoard`, `revealCell`, etc.) should
   live in a `utils` module (or equivalent) inside the student's own `src/pages/{SurnameName}/` folder — not inline inside JSX or event handlers.
   - If logic is duplicated inline, flag as a **medium-severity** issue and suggest extraction.

9. **CSS Modules used.** Styles must be imported as a CSS Module and applied via `styles.*`
   — not as plain global class strings.
   - If global classes are used, flag as a **low-severity** issue.

10. **Playable game.** The submission must produce a working Minesweeper:
    - Board is rendered dynamically from state.
    - Left-click reveals a cell.
    - Right-click toggles a flag.
    - Win and loss states are detected and displayed in the UI.
    - Mine count / remaining flags indicator is updated in the UI.

11. **Component structure.** The interface must be split into small, logically separated
    components (e.g. `Board`, `Cell`/`CellButton`, `Timer`, `GameStatus`, `RestartButton`) that
    interact through props — not one monolithic component and not one giant `index.jsx`.
    - If the whole UI lives in a single component, flag it as a **medium-severity** issue and
      suggest which parts to extract.

---

## Grading Rubric (Lab 3, max 10 points)

Reviewers (human and AI) should tag substantive findings with the rubric category they affect,
so the author sees what costs points. The full assignment is in
[`docs/lab3_en.md`](../docs/lab3_en.md).

| Category                   | Points | What to look at                                                         |
| -------------------------- | ------ | ----------------------------------------------------------------------- |
| Project setup              | 1      | Personal folder, one `<Route>`, one `implementations` entry            |
| Component structure        | 2      | Logical split into components and how they interact through props       |
| State management           | 2      | Game logic migrated correctly, state in hooks, immutable updates, props |
| Styling                    | 1      | CSS Modules used (`styles.*`), no global class strings                  |
| Code quality               | 2      | Clean code, no duplication, readability, React standards, naming       |
| Code review (by the author)| 2      | Depth and usefulness of the review the author wrote for a peer's PR     |

Notes for reviewers:

- The work is graded only if the PDF report (with the PR link) is submitted on Moodle — this is
  outside the repository and cannot be checked in a PR.
- A review by the **instructor is mandatory**; a review by another student is optional. The AI
  review is an additional aid and never replaces the instructor's approval.
- The repository name must contain `-react-` (e.g. `cs13-minesweeper-react-2026`).


# Practical Work №3. Component-Based Approach and React Basics

## Goal
Learn the basics of the **React** library and its key concepts (**components**, **state**, **props**). Gain practical experience refactoring an existing JavaScript application (the **Minesweeper** game) built in previous lab works, using a **component-based approach**. Learn to apply modern styling approaches (**CSS Modules**).

## Assignment
Re-implement (rewrite) the Minesweeper game you built earlier (HTML, CSS, JS) in **React**, following a **component-based architecture**.

1. In `src/pages`, add a personal directory in the format `{SurnameName}`.
2. In `src/App.jsx`, add a `Route` to your game page that uses the path `{surname-name}`.
3. In `src/pages/Game/index.jsx`, add your game implementation to the list (`implementations`).
4. In the directory you created (`src/pages/{SurnameName}`), create the main game component.
5. Rewrite Minesweeper using a component-based approach. Split the interface and the logic into smaller, logically separated components (for example: `Board`, `Cell`, `Timer`, `GameStatus`, `RestartButton`).
6. Use **CSS Modules** to style the game components.

## Grading
* **Project setup:** 1 point (routing, personal directory).
* **Component structure:** 2 points (logical split of the interface into separate components and how they interact).
* **State management:** 2 points (correct migration of the game logic, working with state and passing props).
* **Styling:** 1 point (use of CSS Modules).
* **Code quality:** 2 points (clean code, no duplication, readability and adherence to React standards).
* **High-quality code review:** 2 points (depth of analysis of another student's code, useful comments and suggestions).

**Maximum score: 10 points.**

> **Note:** The work is graded only if a report has been submitted.

> **Important:** For this lab work you must use a repository whose name contains **`-react-`**. Example: `cs13-minesweeper-react-2026`. This avoids conflicts with the repository created earlier without React and clearly marks the version of the project.

## Submission Requirements
1. Implement the solution in your own directory (`src/pages/{SurnameName}`), update the routing file (e.g. `src/App.jsx`), and add your implementation to the Play Game page (`src/pages/Game/index.jsx`).
2. Create a separate branch named in the format: `lab3/[Surname][Name]-[short description, e.g. react-migration]`.
3. Push your changes to the repository (commit + push) and open a Pull Request.
4. Go through a code review by the **instructor (mandatory)** and by another student (optional).
5. Review the code of another course participant (optional).
6. Prepare a report in PDF format and upload it to the Moodle platform. Submitting the report is mandatory. The report template can be found in the **"Additional materials"** section.

**The report must contain:**
* Details of how the work was done.
* A link to your Pull Request in the group's GitHub repository.
* A link to the Pull Request of another student whose code you reviewed (optional).

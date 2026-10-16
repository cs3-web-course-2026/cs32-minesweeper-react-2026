import styles from './About.module.css';

function About() {
  return (
    <div className={styles.about}>
      <h1>About Minesweeper</h1>

      <div className={styles.aboutContent}>
        <section className={styles.aboutSection} data-spot>
          <h2>What is Minesweeper?</h2>
          <p>
            Minesweeper is a single-player puzzle video game. The objective of
            the game is to clear a rectangular board containing hidden &quot;mines&quot;
            or bombs without detonating any of them, with help from clues about
            the number of neighboring mines in each field.
          </p>
        </section>

        <section className={styles.aboutSection} data-spot>
          <h2>How to Play</h2>
          <ol>
            <li>
              <strong>Left-click</strong> to reveal a cell
            </li>
            <li>
              <strong>Right-click</strong> to flag a cell you think contains a
              mine
            </li>
            <li>Numbers show how many mines are adjacent to that cell</li>
            <li>Use logic to determine where the mines are located</li>
            <li>Clear all non-mine cells to win!</li>
          </ol>
        </section>

        <section className={styles.aboutSection} data-spot>
          <h2>Game Rules</h2>
          <ul>
            <li>Each cell is either a mine or a number</li>
            <li>Numbers indicate how many mines are in the 8 adjacent cells</li>
            <li>If you click on a mine, the game is over</li>
            <li>
              If you click on a cell with no adjacent mines, all adjacent cells
              will be revealed
            </li>
            <li>
              Flag cells you think contain mines to avoid accidentally clicking
              them
            </li>
          </ul>
        </section>

        <section className={styles.aboutSection} data-spot>
          <h2>History</h2>
          <p>
            Minesweeper was created by Robert Donner and Curt Johnson in 1989.
            It became widely known when it was included with Microsoft Windows
            3.1 in 1992. The game has since become a classic and has been ported
            to many different platforms and programming languages.
          </p>
        </section>
      </div>
    </div>
  );
}

export default About;

import { Link } from 'react-router-dom';

import styles from './Home.module.css';

const FEATURES = [
  {
    icon: '🎮',
    label: 'Game controller',
    title: 'Game Logic',
    text: 'Mine placement, number hints, and flood-fill reveal as pure utility functions.',
    arabic: '01',
    roman: 'I',
  },
  {
    icon: '🚩',
    label: 'Flag',
    title: 'Flag System',
    text: 'Right-click to flag mines. Track remaining mine count in real time.',
    arabic: '02',
    roman: 'II',
  },
  {
    icon: '⚛️',
    label: 'React icon',
    title: 'React Hooks',
    text: 'Use useState, useReducer and custom hooks to manage all game state.',
    arabic: '03',
    roman: 'III',
  },
  {
    icon: '♿',
    label: 'Accessibility',
    title: 'Accessible UI',
    text: 'Semantic HTML, ARIA labels, and keyboard-friendly interactions throughout.',
    arabic: '04',
    roman: 'IV',
  },
];

function Home() {
  return (
    <div className={styles.home}>
      <section className={styles.hero}>
        <span className={styles.mineIcon} role="img" aria-label="Mine">
          💣
        </span>
        <span className={styles.eyebrow}>React Lab · CS-32 · 2026</span>
        <h1>
          Build <span className={styles.heroAccent}>Minesweeper</span>
          <br />
          with React
        </h1>
        <p className={styles.heroSubtitle}>
          A hands-on React lab for CS-32 students. Implement the classic puzzle
          game using hooks, state management, and modern component architecture.
        </p>
        <div className={styles.heroActions}>
          <Link to="/game" className={styles.primaryBtn}>
            View Implementations →
          </Link>
          <Link to="/about" className={styles.secondaryBtn}>
            How to Play
          </Link>
        </div>
      </section>

      <hr className={styles.divider} />

      <section className={styles.features}>
        <p className={styles.sectionLabel}>What you&apos;ll build</p>
        <h2 className={styles.sectionTitle}>Lab 3 Requirements</h2>
        <div className={styles.featureGrid}>
          {FEATURES.map((feature) => (
            <div key={feature.title} className={styles.featureCard} data-spot>
              <span className={styles.numArabic} aria-hidden="true">
                {feature.arabic}
              </span>
              <span className={styles.numRoman} aria-hidden="true">
                {feature.roman}
              </span>
              <span
                className={styles.featureIcon}
                role="img"
                aria-label={feature.label}
              >
                {feature.icon}
              </span>
              <h3>{feature.title}</h3>
              <p>{feature.text}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default Home;

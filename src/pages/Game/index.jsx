import { Link } from 'react-router-dom';

import styles from './Game.module.css';

function ImplementationLink({ link }) {
  if (link.startsWith('http')) {
    return (
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        className={styles.linkBtn}
      >
        View Implementation →
      </a>
    );
  }

  if (link !== '#') {
    return (
      <Link to={`/${link}`} className={styles.linkBtn}>
        View Implementation →
      </Link>
    );
  }

  return (
    <span className={styles.linkBtn} aria-disabled="true">
      View Implementation →
    </span>
  );
}

const STATUS_CLASS = {
  Complete: styles.statusComplete,
  'In Progress': styles.statusInProgress,
  Planning: styles.statusPlanning,
};

const DIFFICULTY_CLASS = {
  Beginner: styles.difficultyBeginner,
  Intermediate: styles.difficultyIntermediate,
  Advanced: styles.difficultyAdvanced,
};

const CARD_STATUS_CLASS = {
  Complete: styles.cardStatusComplete,
  'In Progress': styles.cardStatusInProgress,
  Planning: styles.cardStatusPlanning,
};

function Game() {
  // Add your implementations here by editing this array
  const implementations = [
    {
      id: 1,
      title: 'Mock Minesweeper Game',
      description:
        'A fully functional minesweeper implementation with timer, flagging, and win/lose detection. This serves as an example for students.',
      author: 'Example Implementation',
      link: 'mock-game',
      difficulty: 'Beginner',
      status: 'Complete',
    },
    {
      id: 2,
      title: 'Basic Minesweeper',
      description: 'A simple implementation with basic game mechanics',
      author: 'Author Name',
      link: '#',
      difficulty: 'Beginner',
      status: 'Complete',
    },
    {
      id: 3,
      title: 'Advanced Minesweeper',
      description: 'Features timer, high scores, and custom difficulty',
      author: 'Author name',
      link: '#',
      difficulty: 'Intermediate',
      status: 'In Progress',
    },
    {
      id: 4,
      title: 'Minesweeper with Themes',
      description: 'Multiple visual themes and sound effects',
      author: 'Author name',
      link: '#',
      difficulty: 'Advanced',
      status: 'Planning',
    },
    {
      id: 5,
      title: 'Сапер у стилі мультфільмів 1930-х',
      description:
        'React-версія Сапера з таймером, лічильником мін, прапорцями та flood-fill; «гумові» анімації в дусі старих мультфільмів.',
      author: 'Karpova Bohdana',
      link: 'karpova-bohdana',
      difficulty: 'Intermediate',
      status: 'Complete',
    },
    {
      id: 6,
      title: 'Звичайний Сапер (Minesweeper)',
      description:
        'React-версія Сапера з звичайним flood-fill відкриттям, таймером, лічильником прапорців та повною підтримкою доступності й клавіатури.',
      author: 'Chernous Valerii',
      link: 'chernous-valerii',
    },
    {
      id: 7,
      title: 'React Minesweeper 90-s style',
      description: 'Рефакторинг класичного Сапера з використанням React-компонентів, управління станом та CSS Modules.',
      author: 'Linkov Oleksandr',
      link: 'linkov-oleksandr',
      difficulty: 'Beginner',
      status: 'Complete',
    },
    {
      id: 8,
      title: 'Minesweeper React',
      description: 'React-версія Сапера з компонентизацією, таймером, лічильником прапорців, підтриманням доступності (ARIA) та клавіатурними скороченнями (клавіша F).',
      author: 'Kovtun Oleksandra',
      link: 'kovtun-oleksandra',
      difficulty: 'Intermediate',
      status: 'Complete',
    },
    {
      id: 9,
      title: 'SUPER MEGA Minesweeper',
      description: 'React-версія Сапера з таймером, лічильником прапорців та крутою назвою.',
      author: 'Ostapenko Rodion',
      link: 'ostapenko-rodion',
      difficulty: 'Beginner',
      status: 'Complete',
    },
    {
      id: 10,
      title: 'Minesweeper by Oleksii Khomiakov',
      description: 'A React implementation with component architecture, modular CSS, and state management.',
      author: 'Oleksii Khomiakov',
      link: 'khomiakov-oleksii',
      difficulty: 'Beginner',
      status: 'Complete',
   },
   {
      id: 11,
      title: '🌸 Pinky Minesweeper 🌸',
      description: 'Adaptive React-version of the Minesweeper game with a timer, mine counter, flags, and using CSS Modules.',
      author: 'Uskova Olexandra',
      link: 'uskova-olexandra',
      difficulty: 'Intermediate',
      status: 'Complete',
   },
    ];

  return (
    <div className={styles.gameContainer}>
      <div className={styles.gameHeader}>
        <h1>Student Implementations</h1>
        <p>Browse student minesweeper implementations</p>
        <div className={styles.instructions}>
          <p>
            <strong>To add implementations:</strong> Edit the implementations
            array in the code
          </p>
        </div>
      </div>

      <div className={styles.implementationsList}>
        {implementations.map((impl) => (
          <div
            key={impl.id}
            data-spot
            className={[
              styles.implementationCard,
              CARD_STATUS_CLASS[impl.status],
            ]
              .filter(Boolean)
              .join(' ')}
          >
            <div className={styles.cardHeader}>
              <h3>{impl.title}</h3>
              <div className={styles.badges}>
                <span
                  className={[styles.badge, STATUS_CLASS[impl.status]]
                    .filter(Boolean)
                    .join(' ')}
                >
                  {impl.status}
                </span>
                <span
                  className={[styles.badge, DIFFICULTY_CLASS[impl.difficulty]]
                    .filter(Boolean)
                    .join(' ')}
                >
                  {impl.difficulty}
                </span>
              </div>
            </div>
            <p className={styles.author}>by {impl.author}</p>
            <p className={styles.description}>{impl.description}</p>
            <div className={styles.cardActions}>
              <ImplementationLink link={impl.link} />
            </div>
          </div>
        ))}
      </div>

      {implementations.length === 0 && (
        <div className={styles.emptyState}>
          <h2>No implementations yet</h2>
          <p>Add implementations by editing the code</p>
        </div>
      )}
    </div>
  );
}

export default Game;

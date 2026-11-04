import { Outlet, NavLink } from 'react-router-dom';
import ThemeSwitcher from '../ThemeSwitcher';
import styles from './Layout.module.css';

// Feeds the cursor position to cards marked with data-spot (see global.css).
function handleSpotlight(event) {
  const card = event.target.closest?.('[data-spot]');
  if (!card) return;
  const rect = card.getBoundingClientRect();
  card.style.setProperty('--mx', `${event.clientX - rect.left}px`);
  card.style.setProperty('--my', `${event.clientY - rect.top}px`);
}

function Layout() {
  return (
    <div className={styles.layout} onMouseMove={handleSpotlight}>
      <header className={styles.layoutHeader}>
        <nav className={styles.layoutNav} aria-label="Main">
          <NavLink to="/" className={styles.navBrand}>
            <span className={styles.navBrandIcon}>💣</span>
            <span className={styles.navBrandText}>
              <h2>Minesweeper</h2>
              <span className={styles.navBrandSub}>CS-32 · Lab</span>
            </span>
          </NavLink>
          <div className={styles.navRight}>
            <ul className={styles.navLinks}>
              <li>
                <NavLink
                  to="/"
                  end
                  className={({ isActive }) =>
                    `${styles.navLink} ${isActive ? styles.active : ''}`
                  }
                >
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/about"
                  className={({ isActive }) =>
                    `${styles.navLink} ${isActive ? styles.active : ''}`
                  }
                >
                  About
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/game"
                  className={({ isActive }) =>
                    `${styles.navLink} ${isActive ? styles.active : ''}`
                  }
                >
                  Implementations
                </NavLink>
              </li>
            </ul>
            <ThemeSwitcher />
          </div>
        </nav>
      </header>

      <main className={styles.layoutMain}>
        <Outlet />
      </main>

      <footer className={styles.layoutFooter}>
        <span className={styles.footerOrnament} aria-hidden="true">
          ✦
        </span>
        <p>© 2026 CS-32 Minesweeper Lab. Built with React &amp; Vite.</p>
      </footer>
    </div>
  );
}

export default Layout;

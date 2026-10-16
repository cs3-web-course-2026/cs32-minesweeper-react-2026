import { useState, useEffect, useRef, useId } from 'react';
import styles from './ThemeSwitcher.module.css';

const MODE_KEY = 'theme';
const STYLE_KEY = 'theme-style';

const STYLES = [
  { id: 'aurora', label: 'Aurora Glass', hint: 'Frosted glass, indigo glow' },
  { id: 'bento', label: 'Bento Gold', hint: 'Editorial serif, big tiles' },
  { id: 'heritage', label: 'Heritage Emerald', hint: 'Academic classic' },
  { id: 'midnight', label: 'Midnight Grid', hint: 'Technical, neon gold' },
];

const MODES = [
  { id: 'dark', label: 'Dark' },
  { id: 'light', label: 'Light' },
];

// index.html applies the saved appearance before first paint — read it back.
function readAttr(name, allowed, fallback) {
  const value = document.documentElement.dataset[name];
  return allowed.some((item) => item.id === value) ? value : fallback;
}

function save(key, value) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Storage unavailable (private mode) — choice still applies for this visit.
  }
}

function ThemeSwitcher() {
  const [style, setStyle] = useState(() => readAttr('style', STYLES, 'aurora'));
  const [mode, setMode] = useState(() => readAttr('theme', MODES, 'dark'));
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const triggerRef = useRef(null);
  const panelId = useId();

  useEffect(() => {
    document.documentElement.dataset.style = style;
    document.documentElement.dataset.theme = mode;
  }, [style, mode]);

  useEffect(() => {
    if (!open) return undefined;

    const handlePointerDown = (event) => {
      if (!rootRef.current?.contains(event.target)) setOpen(false);
    };
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  const handleStyleChange = (next) => {
    setStyle(next);
    save(STYLE_KEY, next);
  };

  const handleModeChange = (next) => {
    setMode(next);
    save(MODE_KEY, next);
  };

  const current = STYLES.find((item) => item.id === style);

  return (
    <div className={styles.root} ref={rootRef}>
      <button
        ref={triggerRef}
        type="button"
        className={styles.trigger}
        aria-expanded={open}
        aria-controls={panelId}
        aria-label={`Appearance: ${current.label}, ${mode} mode`}
        onClick={() => setOpen((value) => !value)}
      >
        <span
          className={styles.swatch}
          data-swatch={style}
          aria-hidden="true"
        />
        <span className={styles.triggerLabel}>{current.label}</span>
        <svg
          viewBox="0 0 24 24"
          className={`${styles.chevron} ${open ? styles.chevronOpen : ''}`}
          aria-hidden="true"
          focusable="false"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>

      {open && (
        <div id={panelId} className={styles.panel}>
          <fieldset className={styles.group}>
            <legend className={styles.legend}>Style</legend>
            {STYLES.map((item) => (
              // Label text is nested in spans (name + hint); the rule can't see it.
              // oxlint-disable-next-line jsx-a11y/label-has-associated-control
              <label
                key={item.id}
                htmlFor={`${panelId}-style-${item.id}`}
                className={styles.option}
              >
                <input
                  id={`${panelId}-style-${item.id}`}
                  type="radio"
                  name="theme-style"
                  value={item.id}
                  checked={style === item.id}
                  onChange={() => handleStyleChange(item.id)}
                  className={styles.srOnly}
                />
                <span
                  className={styles.swatch}
                  data-swatch={item.id}
                  aria-hidden="true"
                />
                <span className={styles.optionText}>
                  <span className={styles.optionLabel}>{item.label}</span>
                  <span className={styles.optionHint}>{item.hint}</span>
                </span>
              </label>
            ))}
          </fieldset>

          <fieldset className={styles.group}>
            <legend className={styles.legend}>Mode</legend>
            <div className={styles.segment}>
              {MODES.map((item) => (
                <label key={item.id} className={styles.segmentItem}>
                  <input
                    type="radio"
                    name="theme-mode"
                    value={item.id}
                    checked={mode === item.id}
                    onChange={() => handleModeChange(item.id)}
                    className={styles.srOnly}
                  />
                  <svg
                    viewBox="0 0 24 24"
                    className={styles.modeIcon}
                    aria-hidden="true"
                    focusable="false"
                  >
                    {item.id === 'dark' ? (
                      <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
                    ) : (
                      <>
                        <circle cx="12" cy="12" r="4" />
                        <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
                      </>
                    )}
                  </svg>
                  {item.label}
                </label>
              ))}
            </div>
          </fieldset>
        </div>
      )}
    </div>
  );
}

export default ThemeSwitcher;

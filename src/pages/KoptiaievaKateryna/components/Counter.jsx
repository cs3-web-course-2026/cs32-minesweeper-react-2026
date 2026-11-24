import styles from './Counter.module.css';


function Counter({ icon, label, children }) {
  return (
    <p className={styles.counter}>
      <span className={styles.label}>
        <span aria-hidden="true">{icon}</span> {label}
      </span>
      <span className={styles.value}>{children}</span>
    </p>
  );
}


export default Counter;

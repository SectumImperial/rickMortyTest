import styles from "./footer.module.scss";

export function Footer() {
  return (
    <footer className={styles.footer}>
      <p className={styles.text}>
        Make with <span>❤️</span> for the MobProgramming team
      </p>
    </footer>
  );
}

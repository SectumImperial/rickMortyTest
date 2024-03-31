import { FC } from "react";
import styles from "./footer.module.scss";

export const Footer: FC = () => (
  <footer className={styles.footer}>
    <p className={styles.text}>
      Make with <span>❤️</span> for the MobProgramming team
    </p>
  </footer>
);

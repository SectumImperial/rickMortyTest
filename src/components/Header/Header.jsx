import styles from "./header.module.scss";
import { Link } from "@mui/material";
import { Logo, Nav } from "../";
import { LINKS } from './constants'

export function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <Link href="./">
          <Logo />
          <span className={styles.hiddenText}>Главная страница</span>
        </Link>

        <Nav links={LINKS} />
      </div>
    </header>
  );
}

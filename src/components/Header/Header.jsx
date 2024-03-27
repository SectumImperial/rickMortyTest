import styles from "./header.module.scss";
import { Link } from "react-router-dom";
import { Logo, Nav } from "../";
import { LINKS } from "./constants";

export const Header = () => (
  <header className={styles.header}>
    <div className={styles.headerContent}>
      <Link to="./">
        <Logo />
        <span className={styles.hiddenText}>Главная страница</span>
      </Link>

      <Nav links={LINKS} />
    </div>
  </header>
);

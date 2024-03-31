import { Link } from "react-router-dom";
import { FC } from "react";
import styles from "./header.module.scss";
import { Logo, Nav } from "..";
import { LINKS } from "./constants";

export const Header: FC = () => (
  <header className={styles.header}>
    <div className={styles.headerContent}>
      <Link to="./">
        <Logo />
        <span className={styles.hiddenText}>Main page</span>
      </Link>

      <Nav links={LINKS} />
    </div>
  </header>
);

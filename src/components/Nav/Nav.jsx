import { useState } from "react";
import { Link } from "@mui/material";
import styles from "./nav.module.scss";

export function Nav({ links }) {
  const [isOpen, setIsOpen] = useState(false);
  const classesBurger = isOpen
    ? `${styles.burger} ${styles.burgerOpen}`
    : `${styles.burger}`;
  const classesList = isOpen
    ? `${styles.list} ${styles.listOpen}`
    : `${styles.list}`;

  const handleBurgerCLick = () => {
    setIsOpen(!isOpen);
  };

  return (
    <nav className={styles.nav}>
      <div className={classesBurger} onClick={handleBurgerCLick}></div>
      <ul className={classesList}>
        {links.map((link) => {
          return (
            <li key={link.text}>
              <Link
                underline="none"
                href={link.url}
                color="black"
                className={styles.link}
              >
                {link.text}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

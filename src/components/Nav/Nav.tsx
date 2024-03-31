import { useState } from "react";
import { Link } from "@mui/material";
import styles from "./nav.module.scss";

interface NavLink {
  text: string;
  url: string;
}

interface NavProps {
  links: NavLink[];
}
export function Nav({ links }: NavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const classesBurger = isOpen
    ? `${styles.burger} ${styles.burgerOpen}`
    : `${styles.burger}`;
  const classesList = isOpen
    ? `${styles.list} ${styles.listOpen}`
    : `${styles.list}`;

  const handleBurgerCLick = () => {
    document.querySelector("body")?.classList.toggle(styles.unScroll);
    setIsOpen(!isOpen);
  };

  return (
    <nav className={styles.nav}>
      {isOpen && (
        <div
          className={styles.backgroundOverlayOpen}
          onClick={() => setIsOpen(false)}
        />
      )}
      <div className={classesBurger} onClick={handleBurgerCLick}></div>
      <ul className={classesList}>
        {links.map((link: NavLink) => {
          return (
            <li key={link.text}>
              <Link
                underline="none"
                href={link.url}
                color="black"
                className={styles.link}
                onClick={() => setIsOpen(false)}
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

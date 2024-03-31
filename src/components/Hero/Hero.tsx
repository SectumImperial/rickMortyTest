import styles from "./hero.module.scss";
import { IMG_SOURCE } from "./constants";

interface HeroProps {
  type: "names" | "circle" | "rickAndMorty";
}

export function Hero({ type = "names" }: HeroProps) {
  const source = IMG_SOURCE[type] || IMG_SOURCE.names;
  const imgClass = styles[type] || styles.name;
  return (
    <img
      alt={type}
      src={source}
      className={`${imgClass} ${styles.heroImage}`}
    />
  );
}

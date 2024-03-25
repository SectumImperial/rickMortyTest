import styles from "./locationsCards.module.scss";
import { LocationCard } from "..";

export function LocationsCards({ locations }) {
  return (
    <section className={styles.cards}>
      {locations.map((location) => (
        <LocationCard location={location} key={location.id} />
      ))}
    </section>
  );
}

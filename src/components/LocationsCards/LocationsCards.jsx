import styles from "./locationsCards.module.scss";
import { LocationCard } from "..";

export const LocationsCards = ({ locations }) => (
  <section className={styles.cards}>
    {locations.map((location) => (
      <LocationCard location={location} key={location.id} />
    ))}
  </section>
);

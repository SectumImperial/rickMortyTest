import styles from "./locationsCards.module.scss";
import { LocationCard } from "..";
import { LocationsCardProps } from "../../interfaces/interfaces";

export const LocationsCards = ({ locations }: LocationsCardProps) => (
  <section className={styles.cards}>
    {locations.map((location) => (
      <LocationCard location={location} key={location.id} />
    ))}
  </section>
);

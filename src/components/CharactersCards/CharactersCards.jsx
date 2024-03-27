import styles from "./charactersCards.module.scss";
import { CharacterCard } from "..";

export const CharactersCards = ({ characters }) => (
  <section className={styles.cards}>
    {characters.map((character) => (
      <CharacterCard character={character} key={character.id} />
    ))}
  </section>
);

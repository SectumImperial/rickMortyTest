import styles from "./charactersCards.module.scss";
import { CharacterCard } from "..";

export function CharactersCards({ characters }) {
  return (
    <section className={styles.cards}>
      {characters.map((character) => (
        <CharacterCard character={character} key={character.id} />
      ))}
    </section>
  );
}

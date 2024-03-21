import styles from "./charactersCards.module.scss";
import { CharacterCard } from "..";

export function CharactersCards({ characters }) {
  const charactersArray = characters.map((character) => (
    <CharacterCard character={character} />
  ));
  return <section className={styles.cards}>{charactersArray}</section>;
}

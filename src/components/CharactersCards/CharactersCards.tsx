import { FC } from "react";
import styles from "./charactersCards.module.scss";
import { CharacterCard } from "..";
import { CharactersCardProps } from "../../interfaces/interfaces";

export const CharactersCards: FC<CharactersCardProps> = ({
  characters,
}: CharactersCardProps) => {
  return (
    <section className={styles.cards}>
      {characters.map((character) => (
        <CharacterCard character={character} key={character.id} />
      ))}
    </section>
  );
};

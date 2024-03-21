import styles from "./mainCharacters.module.scss";
import { TEST_DATA_LABEL } from "./constants";
import {
  Hero,
  FilterInput,
  SelectField,
  CharactersCards,
  LoadMoreButton,
} from "..";

const testDataCharacter = {
  img: "./testImage.png",
  characterName: "Rick Sanchez",
  species: "Human",
};

let testArray = [];
for (let i = 0; i < 8; i++) {
  testArray.push(testDataCharacter);
}

export function MainCharacters() {
  return (
    <main className={styles.main}>
      <div className={styles.hero}>
        <Hero className={styles.heroImage} />
      </div>
      <ul className={styles.filterList}>
        <li className={styles.filterItem} key={Date.now()}>
          <FilterInput />
        </li>
        {TEST_DATA_LABEL.map((item) => (
          <li key={item.label} className={styles.filterItem}>
            <SelectField
              sx={{
                maxWidth: "240",
                margin: "0",
              }}
              props={{
                label: item.label,
                items: item.items,
              }}
            />
          </li>
        ))}
      </ul>
      <section className={styles.contentCard}>
        <CharactersCards characters={testArray} />
      </section>
      <div className={styles.loadMoreButton}>
        <LoadMoreButton />
      </div>
    </main>
  );
}

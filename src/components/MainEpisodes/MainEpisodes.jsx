import styles from "./mainEpisodes.module.scss";
import {
  Hero,
  FilterInput,
  LoadMoreButton,
  EpisodesCards
} from "..";


const testDataSeries = {
    series: "Pilot",
    date: "December 2, 2013",
    episode: "SE01E01",
  };
  
  let testArray = [];
  for (let i = 0; i < 12; i++) {
    testArray.push(testDataSeries);
  }

  export function MainEpisodes() {
    return (
        <main className={styles.main}>
          <div className={styles.hero}>
            <Hero className={styles.heroImage} type="rickAndMorty" />
          </div>
          <ul className={styles.filterList}>
            <li className={`${styles.filterItem} ${styles.filterField}`} key={Date.now()}>
              <FilterInput text='Filter by name or episode (ex. S01 or S01E02)'/>
            </li>
          </ul>
          <section>
            <EpisodesCards episodes={testArray}/>
          </section>
          <div className={styles.loadMoreButton}>
            <LoadMoreButton />
          </div>
        </main>
      );
  }
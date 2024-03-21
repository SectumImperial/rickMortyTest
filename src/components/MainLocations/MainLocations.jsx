import styles from "./mainLocations.module.scss";
import { useState } from 'react'; 
import { TEST_DATA_LABEL } from "./constants";
import {
  Hero,
  FilterInput,
  SelectField,
  LocationsCards,
  LoadMoreButton,
  FiltersModal
} from "..";

const testDataPlanet = {
  locationName: "Earth (C-137)",
  dimension: "Planet",
};

let testArray = [];
for (let i = 0; i < 12; i++) {
  testArray.push(testDataPlanet);
}

export function MainLocations() {
  const [isFiltersVisible, setIsFiltersVisible] = useState(false);
  const toggleFilters = () => {
    setIsFiltersVisible(!isFiltersVisible);
  };

  return (
    <main className={styles.main}>
      <div className={styles.hero}>
        <Hero className={styles.heroImage} type="circle" />
      </div>

      <div className={styles.advancedFiltersButton}>
        <button onClick={toggleFilters}>ADVANCED FILTERS</button>
      </div>
      <FiltersModal isOpen={isFiltersVisible} handleClose={toggleFilters}>
        <div> <ul className={styles.filterList}>
        <li className={`${styles.filterItem} ${styles.filterField}`} key={Date.now()}>
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
      </ul></div>
      </FiltersModal>
      <ul className={styles.filterList}>
        <li className={`${styles.filterItem} ${styles.filterField}`} key={Date.now()}>
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
      <section>
        <LocationsCards locations={testArray}/>
      </section>
      <div className={styles.loadMoreButton}>
        <LoadMoreButton />
      </div>
    </main>
  );
}

import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./mainCharacters.module.scss";
import { ITEMS_PER_PAGE, TEST_DATA_LABEL } from "./constants";
import {
  fetchCharacters,
  setFilter,
  selectFilters,
  selectFilteredCharacters,
} from "../../store/characterSlice";
import {
  Hero,
  FilterInput,
  SelectField,
  CharactersCards,
  LoadMoreButton,
  FiltersModal,
  Loading,
} from "..";

export function MainCharacters() {
  const dispatch = useDispatch();
  const characters = useSelector(selectFilteredCharacters);
  const [itemsPerPage, setItemsPerPage] = useState(ITEMS_PER_PAGE);
  
  // const [statusOptions, setStatusOptions] = useState([]);
  // const [speciesOptions, setSpeciesOptions] = useState([]);
  // const [genderOptions, setGenderOptions] = useState([]);

  const characterLoading = useSelector((state) => state.characters.loading);

  useEffect(() => {
    if (characterLoading === "idle") {
      dispatch(fetchCharacters());
    }
  }, [characterLoading, dispatch]);

  // useEffect(() => {
  //   if (characterLoading === 'succeeded') {
  //     setStatusOptions(getUniqueValues(characters, 'status'));
  //     setSpeciesOptions(getUniqueValues(characters, 'species'));
  //     setGenderOptions(getUniqueValues(characters, 'gender'));
  //   }
  // }, [characterLoading, characters]);

  const handleLoadMoreClick = useCallback(() => {
    setItemsPerPage((prev) => prev + ITEMS_PER_PAGE);
  }, []);

  return (
    <main className={styles.main}>
      <div className={styles.hero}>
        <Hero className={styles.heroImage} />
      </div>
      <ul className={styles.filterList}>
        <li className={`${styles.filterItem} ${styles.filterField}`}>
          <FilterInput
            filterName="name"
            text="Filter by name..."
            action={selectFilters}
          />
        </li>
        {TEST_DATA_LABEL.map((item) => (
          <li
            key={item.label}
            className={`${styles.filterItem} ${styles.filterSelect}`}
          >
            <SelectField
              props={{
                label: item.label,
                items: item.items,
                filterName: item.label.toLowerCase(),
                action: setFilter,
              }}
            />
          </li>
        ))}
      </ul>
      <div className={styles.advancedFiltersButton}>
        <FiltersModal modalData={TEST_DATA_LABEL} />
      </div>
      {characterLoading === "loading" ? (
        <Loading />
      ) : (
        <section className={styles.contentCard}>
          <CharactersCards characters={characters.slice(0, itemsPerPage)} />
        </section>
      )}
      <div
        className={styles.loadMoreButtonContainer}
        onClick={handleLoadMoreClick}
      >
        {characters.length > itemsPerPage && (
          <LoadMoreButton onClick={handleLoadMoreClick} />
        )}
      </div>
    </main>
  );
}

import { useEffect, useState, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./mainCharacters.module.scss";

import { getUniqueValues } from "../../helpers/helpers";
import { ITEMS_PER_PAGE } from "./constants";
import {
  fetchCharacters,
  setFilter,
  selectFilters,
  selectFilteredCharacters,
  selectAllCharacters,
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
  const allCharacters = useSelector(selectAllCharacters);
  const [itemsPerPage, setItemsPerPage] = useState(ITEMS_PER_PAGE);

  const characterLoading = useSelector((state) => state.characters.loading);

  useEffect(() => {
    if (characterLoading === "idle") {
      dispatch(fetchCharacters());
    }
  }, [characterLoading, dispatch]);
  const statusOptions = useMemo(
    () => getUniqueValues(allCharacters, "status"),
    [allCharacters]
  );
  const speciesOptions = useMemo(
    () => getUniqueValues(allCharacters, "species"),
    [allCharacters]
  );
  const genderOptions = useMemo(
    () => getUniqueValues(allCharacters, "gender"),
    [allCharacters]
  );

  const handleLoadMoreClick = useCallback(() => {
    setItemsPerPage((prev) => prev + ITEMS_PER_PAGE);
  }, []);

  const selectFilterLabels = useMemo(
    () => [
      { label: "Species", items: speciesOptions, action: setFilter },
      { label: "Gender", items: genderOptions, action: setFilter },
      { label: "Status", items: statusOptions, action: setFilter },
    ],
    [statusOptions, speciesOptions, genderOptions]
  );

  const content = useMemo(() => {
    return characters.length > 0 ? (
      <CharactersCards characters={characters.slice(0, itemsPerPage)} />
    ) : (
      <section className={styles.loading}>
        <p>Nothing found. Try other filters.</p>
        <Loading />
      </section>
    );
  }, [characters, itemsPerPage]);

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
            type="characters"
          />
        </li>
        {selectFilterLabels.map((selectItem) => (
          <li className={styles.filterSelect}>
            <SelectField
              props={{
                label: selectItem.label,
                items: selectItem.items,
                filterName: selectItem.label.toLowerCase(),
                action: selectItem.action,
              }}
            />
          </li>
        ))}
      </ul>
      <div className={styles.advancedFiltersButton}>
        <FiltersModal modalData={selectFilterLabels} />
      </div>
      {characterLoading === "loading" ? (
        <Loading />
      ) : (
        <section className={styles.contentCard}>{content}</section>
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

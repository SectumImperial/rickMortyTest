import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./mainCharacters.module.scss";

import { getUniqueValues } from "../../helpers/helpers";
import { ITEMS_PER_PAGE_INITIAL } from "./constants";
import {
  fetchCharacters,
  setCharacterFilter,
  selectCharactersFilters,
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
  UpToButton,
} from "..";

export function MainCharacters() {
  const dispatch = useDispatch();
  const loadMoreRef = useRef(null);
  const heroImage = useRef(null);
  const characters = useSelector(selectFilteredCharacters);
  const allCharacters = useSelector(selectAllCharacters);
  const [itemsPerPage, setItemsPerPage] = useState(ITEMS_PER_PAGE_INITIAL);
  const [currentPage, setCurrentPage] = useState(1);
  const [isUpToButtonVisible, setIsUpToButtonVisible] = useState(true);
  const [isLoadMoreClicked, setIsLoadMoreClicked] = useState(false); 

  const maxPage = useSelector((state) => state.characters.maxPage);
  const characterLoading = useSelector((state) => state.characters.loading);

  const prevPageRef = useRef();
  useEffect(() => {

      dispatch(fetchCharacters({ page: currentPage }));
    
  }, [dispatch, currentPage]);

  useEffect(() => {
    if (isLoadMoreClicked) {
      loadMoreRef.current?.scrollIntoView({ behavior: "smooth" });
      setIsLoadMoreClicked(false); 
    }
  }, [characters.length, characterLoading, isLoadMoreClicked]);

  const statusOptions = useMemo(
    () => getUniqueValues(allCharacters, "status"),
    [allCharacters],
  );
  const speciesOptions = useMemo(
    () => getUniqueValues(allCharacters, "species"),
    [allCharacters],
  );
  const genderOptions = useMemo(
    () => getUniqueValues(allCharacters, "gender"),
    [allCharacters],
  );

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsUpToButtonVisible(scrollTop > window.innerHeight / 2);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLoadMoreClick = useCallback(() => {
    setCurrentPage((prev) => prev + 1);
    setItemsPerPage((prev) => prev + ITEMS_PER_PAGE_INITIAL);
    setIsLoadMoreClicked(true); 
  }, []);

  const handleUpButtonClick = useCallback(() => {
    heroImage.current?.scrollIntoView({ behavior: "smooth" });
    setIsUpToButtonVisible(false);
  }, []);

  const selectFilterLabels = useMemo(
    () => [
      { label: "Species", items: speciesOptions, action: setCharacterFilter },
      { label: "Gender", items: genderOptions, action: setCharacterFilter },
      { label: "Status", items: statusOptions, action: setCharacterFilter },
    ],
    [statusOptions, speciesOptions, genderOptions],
  );

  const content = useMemo(() => {
    return characters.length > 0 ? (
      <CharactersCards characters={characters.slice(0, itemsPerPage)} />
    ) : characterLoading === "succeeded" ? (
      <section className={styles.notFiltersMessage}>
        <p>Nothing found. Try other filters.</p>
      </section>
    ) : (
      <section className={styles.loading}>
        <Loading />
      </section>
    );
  }, [characters, itemsPerPage, characterLoading]);

  return (
    <main className={styles.main}>
      <div className={styles.hero} ref={heroImage}>
        <Hero className={styles.heroImage} />
      </div>
      <ul className={styles.filterList}>
        <li className={`${styles.filterItem} ${styles.filterField}`}>
          <FilterInput
            filterName="name"
            text="Filter by name..."
            action={selectCharactersFilters}
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
      <section className={styles.contentCard}>{content}</section>
      {characterLoading === "loading" && (
        <div className={styles.loadingIndicator}>
          <Loading />
        </div>
      )}
      <div
        ref={loadMoreRef}
        className={styles.loadMoreButtonContainer}
        onClick={handleLoadMoreClick}
      >
        {currentPage <= maxPage && <LoadMoreButton />}
      </div>
      {currentPage > 2 && isUpToButtonVisible && (
        <div className={styles.upToButton} onClick={handleUpButtonClick}>
          <UpToButton />
        </div>
      )}
    </main>
  );
}

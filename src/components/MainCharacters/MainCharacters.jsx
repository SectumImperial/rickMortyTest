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

  const maxPage = useSelector((state) => state.characters.maxPage);
  const characterLoading = useSelector((state) => state.characters.loading);
  const characters = useSelector(selectFilteredCharacters);
  const allCharacters = useSelector(selectAllCharacters);

  const error = useSelector((state) => state.characters.error);
  const hasMore = useSelector((state) => state.characters.hasMore);

  const [itemsPerPage, setItemsPerPage] = useState(ITEMS_PER_PAGE_INITIAL);
  const [currentPage, setCurrentPage] = useState(1);
  const [isUpToButtonVisible, setIsUpToButtonVisible] = useState(true);
  const [isLoadMoreClicked, setIsLoadMoreClicked] = useState(false);
  const [isNeedMore, setIsNeedMore] = useState(true);


  const loadMoreRef = useRef(null);
  const heroImage = useRef(null);

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

  useEffect(() => {
    if (isNeedMore && !error) {
      dispatch(fetchCharacters({ page: currentPage }));
      setIsNeedMore(false);
    }
  }, [dispatch, currentPage, isNeedMore, hasMore, error]);

  useEffect(() => {
    if (isLoadMoreClicked) {
      loadMoreRef.current?.scrollIntoView({ behavior: "smooth" });
      setIsLoadMoreClicked(false);
    }
  }, [characters.length, characterLoading, isLoadMoreClicked]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsUpToButtonVisible(scrollTop > window.innerHeight / 2);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLoadMoreClick = useCallback(() => {
    if (error) return;
    setCurrentPage((prev) => prev + 1);
    setItemsPerPage((prev) => prev + ITEMS_PER_PAGE_INITIAL);
    setIsLoadMoreClicked(true);
  }, [error]);

  const handleUpButtonClick = useCallback(() => {
    heroImage.current?.scrollIntoView({ behavior: "smooth" });
    setIsUpToButtonVisible(false);
  }, []);

  const handleFiltersChange = useCallback(() => {
    setIsNeedMore(true);
  }, []);

  const selectFilterLabels = useMemo(
    () => [
      { label: "Species", items: speciesOptions, action: setCharacterFilter },
      { label: "Gender", items: genderOptions, action: setCharacterFilter },
      { label: "Status", items: statusOptions, action: setCharacterFilter },
    ],
    [statusOptions, speciesOptions, genderOptions]
  );

  const content = useMemo(() => {
    if (!characters || characters.length === 0) {
      return (
        <section className={styles.notFiltersMessage}>
          <p>Nothing found. Try other filters.</p>
        </section>
      );
    }
    if (characters.length < itemsPerPage && currentPage !== maxPage)
      setIsNeedMore(true);
    return <CharactersCards characters={characters.slice(0, itemsPerPage)} />;
  }, [characters, itemsPerPage, currentPage, maxPage]);

  return (
    <main className={styles.main}>
      <div className={styles.hero} ref={heroImage}>
        <Hero className={styles.heroImage} />
      </div>
      <ul className={styles.filterList} onChange={handleFiltersChange}>
        <li className={`${styles.filterItem} ${styles.filterField}`}>
          <FilterInput
            filterName="name"
            text="Filter by name..."
            action={selectCharactersFilters}
            type="characters"
          />
        </li>
        {selectFilterLabels.map((selectItem) => (
          <li
            className={styles.filterSelect}
            key={selectItem.label}
            onClick={handleFiltersChange}
          >
            <SelectField
              props={{
                label: selectItem.label,
                items: selectItem.items,
                filterName: selectItem.label.toLowerCase(),
                action: selectItem.action,
                type: "characters",
              }}
            />
          </li>
        ))}
      </ul>
      <div className={styles.advancedFiltersButton}>
        <FiltersModal modalData={selectFilterLabels} />
      </div>
      <section className={styles.contentCard}>{content}</section>
      {characterLoading && (
        <div className={styles.loadingIndicator}>
          <Loading />
        </div>
      )}
      <div
        ref={loadMoreRef}
        className={styles.loadMoreButtonContainer}
        onClick={handleLoadMoreClick}
      >
        {currentPage <= maxPage && hasMore && <LoadMoreButton />}
        {(!hasMore || error) && characters.length !== 0 && <p>No more characters</p>} 
      </div>
      {currentPage > 2 && isUpToButtonVisible && (
        <div className={styles.upToButton} onClick={handleUpButtonClick}>
          <UpToButton />
        </div>
      )}
    </main>
  );
}

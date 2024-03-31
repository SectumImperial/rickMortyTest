import { useEffect, useState, useMemo, useCallback, useRef } from "react";
import styles from "./mainCharacters.module.scss";
import { AppState, SelectFilterLabel } from "../../interfaces/interfaces";
import { getUniqueValues, sortByIdAsc } from "../../helpers/helpers";
import { ITEMS_PER_PAGE_INITIAL, TYPE } from "./constants";
import {
  fetchCharacters,
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
import { useAppDispatch, useAppSelector } from "../../store/hooks";

export function MainCharacters() {
  const dispatch = useAppDispatch();

  const maxPage = useAppSelector((state: AppState) => state.characters.maxPage);
  const characterLoading = useAppSelector(
    (state: AppState) => state.characters.loading,
  );
  const characters = useAppSelector(selectFilteredCharacters);
  const allCharacters = useAppSelector(selectAllCharacters);

  const error = useAppSelector((state: AppState) => state.characters.error);
  const hasMore = useAppSelector((state: AppState) => state.characters.hasMore);

  const [itemsPerPage, setItemsPerPage] = useState<number>(
    ITEMS_PER_PAGE_INITIAL,
  );
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isNeedMore, setIsNeedMore] = useState<boolean>(true);

  const [isUpToButtonVisible, setIsUpToButtonVisible] = useState<boolean>(true);
  const [isLoadMoreClicked, setIsLoadMoreClicked] = useState<boolean>(false);

  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const heroImage = useRef<HTMLDivElement | null>(null);

  const orderedCharacters = useMemo(
    () => sortByIdAsc(characters),
    [characters],
  );

  useEffect(() => {
    if (isNeedMore && !error) {
      void dispatch(
        fetchCharacters({
          page: currentPage,
        }),
      );
      setIsNeedMore(false);
    }
  }, [dispatch, currentPage, isNeedMore, hasMore, error]);

  useEffect(() => {
    if (isLoadMoreClicked && loadMoreRef.current) {
      loadMoreRef.current.scrollIntoView({ behavior: "smooth" });
      setIsLoadMoreClicked(false);
    }
  }, [orderedCharacters.length, characterLoading, isLoadMoreClicked]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsUpToButtonVisible(scrollTop > window.innerHeight / 2);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Handlers
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

  // Selector fields
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

  const selectFilterLabels: SelectFilterLabel[] = useMemo(
    () => [
      { label: "Species", items: speciesOptions },
      { label: "Gender", items: genderOptions },
      { label: "Status", items: statusOptions },
    ],
    [statusOptions, speciesOptions, genderOptions],
  );

  // Content variables
  const content = useMemo(() => {
    if (!orderedCharacters || orderedCharacters.length === 0) {
      return (
        <section className={styles.notFiltersMessage}>
          <p>Nothing found. Try other filters.</p>
        </section>
      );
    }
    if (orderedCharacters.length < itemsPerPage && currentPage !== maxPage)
      setIsNeedMore(true);
    return (
      <CharactersCards characters={orderedCharacters.slice(0, itemsPerPage)} />
    );
  }, [orderedCharacters, itemsPerPage, currentPage, maxPage]);

  return (
    <main className={styles.main}>
      <div className={styles.hero} ref={heroImage}>
        <Hero type={"names"} />
      </div>
      <ul
        className={styles.filterList}
        onChange={handleFiltersChange}
        onClick={handleFiltersChange}
      >
        <li className={`${styles.filterItem} ${styles.filterField}`}>
          <FilterInput filterName="name" text="Filter by name..." type={TYPE} />
        </li>
        {selectFilterLabels.map((selectItem) => (
          <li
            className={styles.filterSelect}
            key={selectItem.label}
            onClick={handleFiltersChange}
          >
            <SelectField
              label={selectItem.label}
              items={selectItem.items}
              filterName={selectItem.label.toLowerCase()}
              type={TYPE}
            />
          </li>
        ))}
      </ul>
      <div className={styles.advancedFiltersButton}>
        <FiltersModal modalData={selectFilterLabels} type={TYPE} />
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
        {currentPage <= maxPage && hasMore && orderedCharacters.length > 0 && (
          <LoadMoreButton />
        )}
        {!hasMore && characters.length !== 0 && <p>No more characters</p>}
      </div>
      {currentPage > 2 && isUpToButtonVisible && (
        <div className={styles.upToButton} onClick={handleUpButtonClick}>
          <UpToButton />
        </div>
      )}
    </main>
  );
}

import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import styles from "./mainEpisodes.module.scss";
import {
  fetchEpisodes,
  selectFilteredEpisodes,
} from "../../store/episodeSlice";
import { ITEMS_PER_PAGE_INITIAL } from "./constants";
import {
  Hero,
  FilterInput,
  LoadMoreButton,
  EpisodesCards,
  Loading,
  UpToButton,
} from "..";
import { AppState } from "../../interfaces/interfaces";
import { useAppDispatch, useAppSelector } from "../../store/hooks";

export function MainEpisodes() {
  const dispatch = useAppDispatch();

  const [itemsPerPage, setItemsPerPage] = useState<number>(
    ITEMS_PER_PAGE_INITIAL,
  );
  const [isUpToButtonVisible, setIsUpToButtonVisible] = useState<boolean>(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isLoadMoreClicked, setIsLoadMoreClicked] = useState<boolean>(false);
  const [isNeedMore, setIsNeedMore] = useState<boolean>(true);

  const episodes = useAppSelector(selectFilteredEpisodes);
  const episodeLoading = useAppSelector(
    (state: AppState) => state.episodes.loading,
  );
  const maxPage = useAppSelector((state: AppState) => state.episodes.maxPage);
  const error = useAppSelector((state: AppState) => state.locations.error);
  const hasMore = useAppSelector((state: AppState) => state.locations.hasMore);

  const loadMoreRef = useRef<HTMLDivElement>(null);
  const heroImage = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isNeedMore && !error) {
      void dispatch(fetchEpisodes({ page: currentPage }));
      setIsNeedMore(false);
    }
  }, [dispatch, currentPage, isNeedMore, hasMore, error]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsUpToButtonVisible(scrollTop > window.innerHeight / 2);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isLoadMoreClicked) {
      loadMoreRef.current?.scrollIntoView({ behavior: "smooth" });
      setIsLoadMoreClicked(false);
    }
  }, [episodes.length, episodeLoading, isLoadMoreClicked]);

  // Handlers
  const handleUpButtonClick = useCallback(() => {
    heroImage.current?.scrollIntoView({ behavior: "smooth" });
    setIsUpToButtonVisible(false);
  }, []);

  const handleLoadMoreClick = useCallback(() => {
    if (error) return;
    setCurrentPage((prev) => prev + 1);
    setItemsPerPage((prev) => prev + ITEMS_PER_PAGE_INITIAL);
    setIsLoadMoreClicked(true);
  }, [error]);

  const handleFilterChange = useCallback(() => {
    setIsNeedMore(true);
  }, []);

  // Content
  const content = useMemo(() => {
    if (!episodes || episodes.length === 0) {
      return (
        <section className={styles.notFiltersMessage}>
          <p>Nothing found. Try other filters.</p>
        </section>
      );
    }
    if (episodes.length < itemsPerPage && currentPage !== maxPage)
      setIsNeedMore(true);

    return <EpisodesCards episodes={episodes.slice(0, itemsPerPage)} />;
  }, [episodes, itemsPerPage, maxPage, currentPage]);

  return (
    <main className={styles.main}>
      <div className={styles.hero} ref={heroImage}>
        <Hero type="rickAndMorty" />
      </div>
      <ul className={styles.filterList} onChange={handleFilterChange}>
        <li className={styles.filterField}>
          <FilterInput
            filterName="name"
            text="Filter by name or episode (ex. S01 or S01E02)"
            type="episodes"
          />
        </li>
      </ul>
      <section className={styles.contentCard}>{content}</section>
      {episodeLoading && (
        <div className={styles.loadingIndicator}>
          <Loading />
        </div> 
      )}
      <div
        ref={loadMoreRef}
        className={styles.loadMoreButtonContainer}
        onClick={handleLoadMoreClick}
      >
        {currentPage <= maxPage && hasMore && episodes.length > 0 && (
          <LoadMoreButton />
        )}
        {(!hasMore || error) && episodes.length !== 0 && (
          <p>No more episodes</p>
        )}
      </div>
      {currentPage > 2 && isUpToButtonVisible && (
        <div className={styles.upToButton} onClick={handleUpButtonClick}>
          <UpToButton />
        </div>
      )}
    </main>
  );
}

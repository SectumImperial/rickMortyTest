import { useEffect, useState, useCallback, useMemo, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./mainEpisodes.module.scss";
import {
  fetchEpisodes,
  selectFilteredEpisodes,
  selectEpisodeFilters,
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

export function MainEpisodes() {
  const dispatch = useDispatch();

  const [itemsPerPage, setItemsPerPage] = useState(ITEMS_PER_PAGE_INITIAL);
  const [isUpToButtonVisible, setIsUpToButtonVisible] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoadMoreClicked, setIsLoadMoreClicked] = useState(false);
  const [isNeedMore, setIsNeedMore] = useState(true);

  const episodes = useSelector(selectFilteredEpisodes);
  const episodeLoading = useSelector((state) => state.episodes.loading);
  const maxPage = useSelector((state) => state.episodes.maxPage);
  const error = useSelector((state) => state.locations.error);
  const hasMore = useSelector((state) => state.locations.hasMore);

  const loadMoreRef = useRef(null);
  const heroImage = useRef(null);

  useEffect(() => {
    if (isNeedMore && !error) {
      dispatch(fetchEpisodes({ page: currentPage }));
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
        <Hero className={styles.heroImage} type="rickAndMorty" />
      </div>
      <ul className={styles.filterList} onChange={handleFilterChange}>
        <li className={styles.filterField}>
          <FilterInput
            filterName="name"
            text="Filter by name or episode (ex. S01 or S01E02)"
            action={selectEpisodeFilters}
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
        {currentPage <= maxPage && hasMore && <LoadMoreButton />}
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

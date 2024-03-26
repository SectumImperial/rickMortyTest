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

  const loadMoreRef = useRef(null);
  const heroImage = useRef(null);

  const episodes = useSelector(selectFilteredEpisodes);
  const episodeLoading = useSelector((state) => state.episodes.loading);
  const maxPage = useSelector((state) => state.episodes.maxPage);

  const prevPageRef = useRef();
  useEffect(() => {
    if (prevPageRef.current !== currentPage) {
      dispatch(fetchEpisodes({ page: currentPage }));
    }
    prevPageRef.current = currentPage;
  }, [dispatch, currentPage]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsUpToButtonVisible(scrollTop > window.innerHeight / 2);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (episodeLoading === "succeeded") {
      loadMoreRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [episodes.length, episodeLoading]);

  const handleUpButtonClick = useCallback(() => {
    heroImage.current?.scrollIntoView({ behavior: "smooth" });
    setIsUpToButtonVisible(false);
  }, []);

  const handleLoadMoreClick = useCallback(() => {
    setCurrentPage((prev) => prev + 1);
    setItemsPerPage((prev) => prev + ITEMS_PER_PAGE_INITIAL);
  }, []);

  const content = useMemo(() => {
    return episodeLoading === "loading" ? (
      <Loading />
    ) : episodes.length > 0 ? (
      <EpisodesCards episodes={episodes.slice(0, itemsPerPage)} />
    ) : (
      <p>Nothing found. Try other filters.</p>
    );
  }, [episodes, itemsPerPage, episodeLoading]);

  return (
    <main className={styles.main}>
      <div className={styles.hero} ref={heroImage}>
        <Hero className={styles.heroImage} type="rickAndMorty" />
      </div>
      <ul className={styles.filterList}>
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
      {episodeLoading === "loading" && (
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

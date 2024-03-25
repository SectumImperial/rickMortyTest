import { useEffect, useState, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import styles from "./mainEpisodes.module.scss";
import {
  fetchEpisodes,
  selectFilteredEpisodes,
  selectEpisodeFilters
} from "../../store/episodeSlice";
import { ITEMS_PER_PAGE } from "./constants";
import { Hero, FilterInput, LoadMoreButton, EpisodesCards, Loading } from "..";

export function MainEpisodes() {
  const dispatch = useDispatch();
  const episodes = useSelector(selectFilteredEpisodes);
  const [itemsPerPage, setItemsPerPage] = useState(ITEMS_PER_PAGE);
  const episodeLoading = useSelector((state) => state.episodes.loading);

  useEffect(() => {
    if (episodeLoading === "idle") {
      dispatch(fetchEpisodes());
    }
  }, [episodeLoading, dispatch]);

  const handleLoadMoreClick = useCallback(() => {
    setItemsPerPage((prev) => prev + ITEMS_PER_PAGE);
  }, []);

  const content = useMemo(() => {
    return episodeLoading === 'loading' ? (
      <Loading />
    ) : episodes.length > 0 ? (
      <EpisodesCards episodes={episodes.slice(0, itemsPerPage)} />
    ) : (
      <p>Nothing found. Try other filters.</p>
    );
  }, [episodes, itemsPerPage, episodeLoading]);

  return (
    <main className={styles.main}>
      <div className={styles.hero}>
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
      <section className={styles.contentCard}>
        {content}
      </section>
      {episodeLoading !== 'loading' && episodes.length > itemsPerPage && (
        <div
        className={styles.loadMoreButtonContainer}
        onClick={handleLoadMoreClick}
      >
        {episodes.length > itemsPerPage && (
          <LoadMoreButton onClick={handleLoadMoreClick} />
        )}
      </div>
      )}
    </main>
  );
}

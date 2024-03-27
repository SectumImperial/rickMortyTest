import React, { useEffect, useMemo, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import styles from "./mainEpisodeDetail.module.scss";
import { fetchCharactersByIds } from "../../store/characterSlice";
import { GoBackLink, CharacterCard, Loading } from "..";
import { fetchEpisodesByIds } from "../../store/episodeSlice";

export const MainEpisodeDetail = () => {
  const dispatch = useDispatch();
  const { episodeId } = useParams();
  const top = useRef(null);

  const episodeLoading = useSelector((state) => state.episodes.loading);
  const casts = useSelector((state) => state.characters.charactersByIds);

  const episode = useSelector((state) =>
    state.episodes.episodesByIds.find(
      (episode) => episode.id.toString() === episodeId,
    ),
  );

  useEffect(() => {
    if (episodeLoading || !episode) {
      dispatch(fetchEpisodesByIds(episodeId));
    }
  }, [episodeLoading, dispatch, episode, episodeId]);

  useEffect(() => {
    if (!episodeLoading && episode && episode.characters) {
      dispatch(fetchCharactersByIds(episode.characters));
    }
  }, [dispatch, episodeLoading, episode]);

  useEffect(() => {
    top.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const nameEpisode = useMemo(() => {
    if (!episodeLoading && episode) return episode.name;
  }, [episode, episodeLoading]);

  const episodeNumber = useMemo(() => {
    if (!episodeLoading && episode) return episode.episode;
  }, [episode, episodeLoading]);

  const airDate = useMemo(() => {
    if (!episodeLoading && episode) return episode.air_date;
  }, [episode, episodeLoading]);

  const mainEpisodeInfo = useMemo(
    () =>
      episode ? (
        <>
          <h1 className={styles.name}>{nameEpisode}</h1>
          <dl className={styles.dl}>
            <div className={styles.episodeInfoItem}>
              <dt className={styles.dt}>Episode</dt>
              <dd className={styles.dd}>{episodeNumber}</dd>
            </div>
            <div className={styles.episodeInfoItem}>
              <dt className={styles.dt}>Date</dt>
              <dd className={styles.dd}>{airDate}</dd>
            </div>
          </dl>
        </>
      ) : (
        <div className={styles.error}>Episode not found</div>
      ),
    [episode, nameEpisode, episodeNumber, airDate],
  );

  const castContent = useMemo(
    () =>
      casts && casts.length > 0 ? (
        <>
          {casts.map((cast) => (
            <CharacterCard character={cast} />
          ))}
        </>
      ) : (
        <div className={styles.loading}>
          <Loading />
        </div>
      ),
    [casts],
  );

  return (
    <main className={styles.main}>
      <div className={styles.top} ref={top}>
        <nav className={styles.nav}>
          <GoBackLink url="/episodes" />
        </nav>
        <div className={styles.episodesInfo}>{mainEpisodeInfo}</div>
      </div>
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Cast</h3>
        <section className={styles.castCards}>{castContent}</section>
      </section>
    </main>
  );
};

import React, { useEffect, useMemo, useRef } from "react";
import { useParams } from "react-router-dom";
import styles from "./mainEpisodeDetail.module.scss";
import { fetchCharactersByIds } from "../../store/characterSlice";
import { GoBackLink, CharacterCard, Loading } from "..";
import { fetchEpisodesByIds } from "../../store/episodeSlice";
import { AppState } from "../../interfaces/interfaces";
import { useAppDispatch, useAppSelector } from "../../store/hooks";

export const MainEpisodeDetail = () => {
  const dispatch = useAppDispatch();
  const { episodeId } = useParams<{ episodeId: string }>();
  const top = useRef<HTMLDivElement>(null);

  const episodeLoading = useAppSelector(
    (state: AppState) => state.episodes.loading,
  );
  const casts = useAppSelector(
    (state: AppState) => state.characters.charactersByIds,
  );

  const episode = useAppSelector((state: AppState) =>
    state.episodes.episodesByIds.find(
      (episode) => episode.id.toString() === episodeId,
    ),
  );

  useEffect(() => {
    if ((episodeLoading || !episode) && episodeId) {
      void dispatch(fetchEpisodesByIds(episodeId));
    }
  }, [episodeLoading, dispatch, episode, episodeId]);

  useEffect(() => {
    if (!episodeLoading && episode && episode.characters) {
      void dispatch(fetchCharactersByIds(episode.characters));
    }
  }, [dispatch, episodeLoading, episode]);

  useEffect(() => {
    top.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const nameEpisode = useMemo(() => {
    if (!episodeLoading && episode) return episode.name;
    return "";
  }, [episode, episodeLoading]);

  const episodeNumber = useMemo(() => {
    if (!episodeLoading && episode) return episode.episode;
    return "";
  }, [episode, episodeLoading]);

  const airDate = useMemo(() => {
    if (!episodeLoading && episode) return episode.air_date;
    return "";
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

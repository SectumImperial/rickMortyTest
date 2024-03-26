import React, { useEffect, useState, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import styles from "./mainEpisodeDetail.module.scss";
import { selectAllCharacters } from "../../store/characterSlice";
import { GoBackLink } from "..";
import { fetchEpisodesByIds } from "../../store/episodeSlice";

export const MainEpisodeDetail = () => {
  const { episodeId } = useParams();
  const dispatch = useDispatch();
  const charactersInStore = useSelector(selectAllCharacters);

  const episodeLoading = useSelector((state) => state.episodes.loading);

  const episode = useSelector((state) =>
    state.episodes.entities.find(
      (episode) => episode.id.toString() === episodeId,
    ),
  );

  const nameEpisode = useMemo(() => {
    if (episodeLoading === "succeeded" && episode) return episode.name;
  }, [episode, episodeLoading]);

  const episodeNumber = useMemo(() => {
    if (episodeLoading === "succeeded" && episode) return episode.episode;
  }, [episode, episodeLoading]);

  const airDate = useMemo(() => {
    if (episodeLoading === "succeeded" && episode) return episode.air_date;
  }, [episode, episodeLoading]);

  useEffect(() => {
    if (episodeLoading === "idle") {
      dispatch(fetchEpisodesByIds());
    }
  }, [episodeLoading, dispatch]);

  const mainEpisodeInfo = useMemo(
    () =>
      episode ? (
        <>
          <h1 className={styles.name}>{nameEpisode}</h1>
          <dl className={styles.dl}>
            <div className={styles.locationInfoItem}>
              <dt className={styles.dt}>Episode</dt>
              <dd className={styles.dd}>{episodeNumber}</dd>
            </div>
            <div className={styles.locationInfoItem}>
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

  return (
    <main className={styles.main}>
      <div className={styles.top}>
        <nav className={styles.nav}>
          <GoBackLink url="/episodes" />
        </nav>
        <div className={styles.episodesInfo}>{mainEpisodeInfo}</div>
      </div>
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Cast</h3>
        {/* <div> {residents.map(resident => (
      <Link to={`/characters/${resident.id}`} key={resident.id}>
        <CharacterCard character={resident} />
      </Link>
    ))}</div> */}
      </section>
    </main>
  );
};

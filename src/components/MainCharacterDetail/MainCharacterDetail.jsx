import { useDispatch, useSelector } from "react-redux";
import { useEffect, useMemo, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import styles from "./mainCharacterDetail.module.scss";
import { fetchCharactersByIds } from "../../store/characterSlice";
import { fetchEpisodesByIds } from "../../store/episodeSlice";
import { GoBackLink, Loading } from "../";
import { INFORMATION_FIELDS } from "./constants";
import { extractNumbersFromEnd } from "./helpers";

export const MainCharacterDetail = () => {
  const dispatch = useDispatch();
  const { characterId } = useParams();
  const top = useRef(null);

  const characterLoading = useSelector((state) => state.characters.loading);
  const episodeLoading = useSelector((state) => state.episodes.loading);
  const character = useSelector((state) =>
    state.characters.charactersByIds.find(
      (char) => char.id.toString() === characterId,
    ),
  );
  const episodes = useSelector((state) => state.episodes.episodesByIds);

  useEffect(() => {
    if (character) {
      dispatch(fetchEpisodesByIds(character.episode));
    }
  }, [dispatch, character]);

  useEffect(() => {
    dispatch(fetchCharactersByIds(characterId));
  }, [dispatch, characterId]);

  useEffect(() => {
    top.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const imageSrc = useMemo(() => {
    if (!characterLoading && character) return character.image;
  }, [characterLoading, character]);
  const nameCharacter = useMemo(() => {
    if (!characterLoading && character) return character.name;
  }, [characterLoading, character]);

  const informationContent = useMemo(() => {
    if (!characterLoading && character) {
      return INFORMATION_FIELDS.map((item) => {
        const field = character[item];
        if (field) {
          const content = typeof field === "object" ? field.name : field;
          const key = field?.name || item;
          const isLink = typeof field === "object" && field.url;

          if (isLink)
            return (
              <Link
                to={`/${extractNumbersFromEnd(field.url).join("/")}`}
                key={key}
                className={`${styles.informationItem} ${
                  isLink ? styles.linkedItem : ""
                }`}
              >
                <dt className={styles.dt}>
                  {item[0].toUpperCase() + item.slice(1)}
                </dt>
                <dd className={styles.dd}>{content || "Unknown"}</dd>
              </Link>
            );

          return (
            <div
              key={key}
              className={`${styles.informationItem} ${
                isLink ? styles.linkedItem : ""
              }`}
            >
              <dt className={styles.dt}>
                {item[0].toUpperCase() + item.slice(1)}
              </dt>
              <dd className={styles.dd}>{content || "Unknown"}</dd>
            </div>
          );
        }
        return null;
      }).filter(Boolean);
    }
    return [];
  }, [character, characterLoading]);

  const mainCharacterInfo = useMemo(() => {
    if (!character || characterLoading) {
      return (
        <div className={styles.error}>
          {characterLoading ? <Loading /> : <p>Character not found</p>}
        </div>
      );
    }
    return (
      <>
        <img src={imageSrc} className={styles.image} alt={nameCharacter} />
        <h1 className={styles.name}>{nameCharacter}</h1>
      </>
    );
  }, [character, imageSrc, nameCharacter, characterLoading]);

  const episodesContent = useMemo(() => {
    if (!episodeLoading) {
      return episodes.map(({ id, episode, name, air_date }) => (
        <Link
          to={`/episodes/${id}`}
          key={id}
          className={`${styles.episodeDetails} ${styles.linkedItem}`}
        >
          <span className={styles.episodeEpisode}>{episode}</span>
          <span className={styles.episodeNames}>{name}</span>
          <span className={styles.episodeDate}>{air_date}</span>
        </Link>
      ));
    }
    return <p>Loading episodes...</p>;
  }, [episodes, episodeLoading]);

  return (
    <main className={styles.main}>
      <div className={styles.top} ref={top}>
        <nav className={styles.nav}>
          <GoBackLink url="/characters" />
        </nav>
        <div className={styles.charactersInfo}>{mainCharacterInfo}</div>
      </div>
      <section className={styles.information}>
        <section className={styles.informationSection}>
          <h3 className={styles.title}>Information</h3>
          <dl>{informationContent}</dl>
        </section>
        <section className={styles.informationSection}>
          <h3 className={styles.title}>Episodes</h3>
          <div className={styles.episodeContent}>{episodesContent}</div>
        </section>
      </section>
    </main>
  );
};

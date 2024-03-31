import { useEffect, useMemo, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import styles from "./mainCharacterDetail.module.scss";
import { fetchCharactersByIds } from "../../store/characterSlice";
import { fetchEpisodesByIds } from "../../store/episodeSlice";
import { GoBackLink, Loading } from "..";
import { INFORMATION_FIELDS } from "./constants";
import { extractNumbersFromEnd } from "./helpers";
import { AppState, Character, Episode } from "../../interfaces/interfaces";
import { useAppSelector, useAppDispatch } from "../../store/hooks";

type CharacterField = (typeof INFORMATION_FIELDS)[number];

const getFieldValue = (
  character: Character,
  field: CharacterField,
): string | { name: string; url: string } | undefined => {
  switch (field) {
    case "gender":
    case "status":
    case "species":
    case "type":
      return character[field];
    case "origin":
    case "location":
      return character[field];
    default:
      return undefined;
  }
};

export const MainCharacterDetail = () => {
  const dispatch = useAppDispatch();
  const { characterId } = useParams<{ characterId: string }>();
  const top = useRef<HTMLDivElement>(null);

  const characterLoading = useAppSelector(
    (state: AppState) => state.characters.loading,
  );
  const episodeLoading = useAppSelector(
    (state: AppState) => state.episodes.loading,
  );

  const character = useAppSelector((state: AppState) =>
    state.characters.charactersByIds.find(
      (char) => char.id.toString() === characterId,
    ),
  );

  const episodes: Episode[] = useAppSelector(
    (state: AppState) => state.episodes.episodesByIds,
  );

  useEffect(() => {
    if (character) {
      void dispatch(fetchEpisodesByIds(character.episode));
    }
  }, [dispatch, character]);

  useEffect(() => {
    if (typeof characterId !== "undefined") {
      void dispatch(fetchCharactersByIds([characterId]));
    }
  }, [dispatch, characterId]);

  useEffect(() => {
    top.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const imageSrc = useMemo(() => character?.image, [character]);
  const nameCharacter = useMemo(() => character?.name, [character]);

  const informationContent = useMemo(() => {
    if (!characterLoading && character) {
      return INFORMATION_FIELDS.map((field) => {
        const fieldValue = getFieldValue(character, field);
        if (fieldValue) {
          const content =
            typeof fieldValue === "object" ? fieldValue.name : fieldValue;
          const key = typeof fieldValue === "object" ? fieldValue.url : field;
          const isLink = typeof fieldValue === "object" && fieldValue.url;

          if (isLink)
            return (
              <Link
                to={`/${extractNumbersFromEnd(fieldValue.url).join("/")}`}
                key={key}
                className={`${styles.informationItem} ${
                  isLink ? styles.linkedItem : ""
                }`}
              >
                <dt className={styles.dt}>
                  {field[0].toUpperCase() + field.slice(1)}
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
                {field[0].toUpperCase() + field.slice(1)}
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

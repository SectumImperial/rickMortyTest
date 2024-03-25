import { useDispatch, useSelector } from "react-redux";
import { useEffect, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import styles from "./mainCharacterDetail.module.scss";
import { fetchCharacters } from "../../store/characterSlice";
import { GoBackLink } from "../";
import { INFORMATION_FIELDS } from "./constants";
import { extractNumbersFromEnd } from "./helpers";

export const MainCharacterDetail = () => {
  const dispatch = useDispatch();
  const { characterId } = useParams();
  const characterLoading = useSelector((state) => state.characters.loading);
  const character = useSelector((state) =>
    state.characters.entities.find(
      (char) => char.id.toString() === characterId,
    ),
  );

  useEffect(() => {
    if (characterLoading === "idle") {
      dispatch(fetchCharacters());
    }
  }, [characterLoading, dispatch]);

  const imageSrc = useMemo(() => {
    if (characterLoading === "succeeded" && character) return character.image;
  }, [character, characterLoading]);
  const nameCharacter = useMemo(() => {
    if (characterLoading === "succeeded" && character) return character.name;
  }, [character, characterLoading]);

  const informationContent = useMemo(() => {
    if (characterLoading === "succeeded" && character) {
      return INFORMATION_FIELDS.map((item) => {
        const field = character[item];
        if (field) {
          const content = typeof field === "object" ? field.name : field;
          const key =
            typeof field === "object" && field.url ? field.name : item;
          const isLink = typeof field === "object" && field.url;

          if (isLink)
            return (
              <Link
                to={`/${extractNumbersFromEnd(field.url).join("/")}`}
                key={key}
                className={`${styles.informationItem} ${isLink ? styles.linkedItem : ""}`}
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
              className={`${styles.informationItem} ${isLink ? styles.linkedItem : ""}`}
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

  const mainCharacterInfo = useMemo(
    () =>
      character ? (
        <>
          <img src={imageSrc} className={styles.image} alt={nameCharacter} />
          <h1 className={styles.name}>{nameCharacter}</h1>
        </>
      ) : (
        <div className={styles.error}>Character not found</div>
      ),
    [character, imageSrc, nameCharacter],
  );

  return (
    <main className={styles.main}>
      <div className={styles.top}>
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
        <section className={styles.information}>
          <h3 className={styles.title}>Episodes</h3>
        </section>
      </section>
    </main>
  );
};

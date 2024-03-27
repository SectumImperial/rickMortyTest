import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { GoBackLink, CharacterCard, Loading } from "../";
import { fetchLocationsByIds } from "../../store/locationsSlice";
import { fetchCharactersByIds } from "../../store/characterSlice";
import styles from "./mainLocationDetail.module.scss";

export function MainLocationDetail() {
  const dispatch = useDispatch();
  const { locationId } = useParams();

  const locationLoading = useSelector((state) => state.locations.loadingById);

  const location = useSelector((state) =>
    state.locations.locationsByIds.find(
      (location) => location.id.toString() === locationId,
    ),
  );

  const residents = useSelector((state) => state.characters.charactersByIds);

  useEffect(() => {
    if (locationLoading) {
      dispatch(fetchLocationsByIds(locationId));
    }
  }, [locationLoading, dispatch, locationId]);

  useEffect(() => {
    if (
      !locationLoading &&
      location &&
      location.residents &&
      location.residents.length > 0
    ) {
      dispatch(fetchCharactersByIds(location.residents));
    }
  }, [dispatch, locationLoading, location]);

  const nameLocation = useMemo(() => {
    if (!locationLoading && location) return location.name;
  }, [location, locationLoading]);

  const typeLocation = useMemo(() => {
    if (!locationLoading && location) return location.type;
  }, [location, locationLoading]);

  const typeDimension = useMemo(() => {
    if (!locationLoading && location) return location.dimension;
  }, [location, locationLoading]);

  const mainLocationInfo = useMemo(
    () =>
      location ? (
        <>
          <h1 className={styles.name}>{nameLocation}</h1>
          <dl className={styles.dl}>
            <div className={styles.locationInfoItem}>
              <dt className={styles.dt}>Type</dt>
              <dd className={styles.dd}>{typeLocation}</dd>
            </div>
            <div className={styles.locationInfoItem}>
              <dt className={styles.dt}>Dimension</dt>
              <dd className={styles.dd}>{typeDimension}</dd>
            </div>
          </dl>
        </>
      ) : (
        <div className={styles.error}>
          <Loading />
        </div>
      ),
    [location, nameLocation, typeDimension, typeLocation],
  );

  const residentContent = useMemo(() => {
    if (!residents) {
      return (
        <div className={styles.error}>
          <Loading />
        </div>
      );
    }
    if (residents.length === 0) {
      return <div className={styles.error}>There are no residents</div>;
    }
    return (
      <>
        {residents.map((resident) => (
          <CharacterCard character={resident} key={resident.id} />
        ))}
      </>
    );
  }, [residents]);

  return (
    <main className={styles.main}>
      <div className={styles.top}>
        <nav className={styles.nav}>
          <GoBackLink url="/locations" />
        </nav>
        <div className={styles.locationsInfo}>{mainLocationInfo}</div>
      </div>
      <section className={styles.section}>
        <h3 className={styles.sectionTitle}>Residents</h3>
        <section className={styles.residentCards}>{residentContent}</section>
      </section>
    </main>
  );
}

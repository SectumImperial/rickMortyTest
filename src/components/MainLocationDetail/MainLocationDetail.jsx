import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { GoBackLink } from "../";
import { fetchLocations } from "../../store/locationsSlice";
import styles from "./mainLocationDetail.module.scss";

export function MainLocationDetail() {
  const dispatch = useDispatch();
  const { locationId } = useParams();

  const locationLoading = useSelector((state) => state.locations.loading);
  const location = useSelector((state) =>
    state.locations.entities.find((loc) => loc.id.toString() === locationId),
  );

  const nameLocation = useMemo(() => {
    if (locationLoading === "succeeded" && location) return location.name;
  }, [location, locationLoading]);

  const typeLocation = useMemo(() => {
    if (locationLoading === "succeeded" && location) return location.type;
  }, [location, locationLoading]);

  const typeDimension = useMemo(() => {
    if (locationLoading === "succeeded" && location) return location.dimension;
  }, [location, locationLoading]);

  useEffect(() => {
    if (locationLoading === "idle") {
      dispatch(fetchLocations());
    }
  }, [locationLoading, dispatch]);

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
        <div className={styles.error}>Location not found</div>
      ),
    [location, nameLocation, typeDimension],
  );

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
      </section>
    </main>
  );
}

import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect, useMemo } from "react";
import {
  selectAllLocations,
  fetchLocations,
  selectLocationsFilters,
  setLocationsFilter,
  selectFilteredLocations,
} from "../../store/locationsSlice";
import styles from "./mainLocations.module.scss";
import { ITEMS_PER_PAGE } from "./constants";
import { getUniqueValues } from "../../helpers/helpers";
import {
  Hero,
  FilterInput,
  SelectField,
  LocationsCards,
  LoadMoreButton,
  FiltersModal,
  Loading,
} from "..";

export function MainLocations() {
  const dispatch = useDispatch();
  const allLocations = useSelector(selectAllLocations);
  const locations = useSelector(selectFilteredLocations);

  const [itemsPerPage, setItemsPerPage] = useState(ITEMS_PER_PAGE);
  const locationLoading = useSelector((state) => state.locations.loading);

  useEffect(() => {
    if (locationLoading === "idle") {
      dispatch(fetchLocations());
    }
  }, [locationLoading, dispatch]);

  const typeOptions = useMemo(
    () => getUniqueValues(allLocations, "type"),
    [allLocations],
  );
  const dimensionOptions = useMemo(
    () => getUniqueValues(allLocations, "dimension"),
    [allLocations],
  );

  const selectFilterLabels = useMemo(
    () => [
      { label: "Type", items: typeOptions, action: setLocationsFilter },
      { label: "Dimension", items: dimensionOptions, action: setLocationsFilter },
    ],
    [typeOptions, dimensionOptions],
  );

  const content = useMemo(() => {
    return locations.length > 0 ? (
      <LocationsCards locations={locations.slice(0, itemsPerPage)} />
    ) : (
      <section className={styles.loading}>
        <p>Nothing found. Try other filters.</p>
        <Loading />
      </section>
    );
  }, [locations, itemsPerPage]);

  const handleLoadMoreClick = () => {
    setItemsPerPage(itemsPerPage + ITEMS_PER_PAGE);
  };

  return (
    <main className={styles.main}>
      <div className={styles.hero}>
        <Hero className={styles.heroImage} type="circle" />
      </div>
      <ul className={styles.filterList}>
        <li className={`${styles.filterItem} ${styles.filterField}`}>
          <FilterInput
            filterName="name"
            text="Filter by name..."
            action={selectLocationsFilters}
            type="locations"
          />
        </li>
        {selectFilterLabels.map((selectItem) => (
          <li className={styles.filterSelect}>
            <SelectField
              props={{
                label: selectItem.label,
                items: selectItem.items,
                filterName: selectItem.label.toLowerCase(),
                action: selectItem.action,
              }}
            />
          </li>
        ))}
      </ul>
      <div className={styles.advancedFiltersButton}>
        <FiltersModal modalData={selectFilterLabels} />
      </div>

      {locationLoading === "loading" ? (
        <Loading />
      ) : (
        <section className={styles.contentCard}>{content}</section>
      )}
      <div />
      <div className={styles.loadMoreButtonContainer}>
        {locations.length > itemsPerPage && (
          <div
            className={styles.loadMoreButtonContainer}
            onClick={handleLoadMoreClick}
          >
            <LoadMoreButton />
          </div>
        )}
      </div>
    </main>
  );
}

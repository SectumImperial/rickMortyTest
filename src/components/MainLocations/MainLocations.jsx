import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import {
  selectAllLocations,
  fetchLocations,
  selectFilters,
} from "../../store/locationsSlice";
import styles from "./mainLocations.module.scss";
import { TEST_DATA_LABEL, ITEMS_PER_PAGE } from "./constants";
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
  const locations = useSelector(selectAllLocations);

  const [itemsPerPage, setItemsPerPage] = useState(ITEMS_PER_PAGE);

  const locationLoading = useSelector((state) => state.locations.loading);

  useEffect(() => {
    if (locationLoading === "idle") {
      dispatch(fetchLocations());
    }
  }, [locationLoading, dispatch]);

  let content;
  switch (locationLoading) {
    case "loading":
      content = (
        <div className={styles.loading}>
          <Loading />
        </div>
      );
      break;
    case "succeeded":
      const locationsPage = locations.slice(0, itemsPerPage);
      content = <LocationsCards locations={locationsPage} />;
      break;

    default:
      content = (
        <div className={styles.loading}>
          <Loading />
        </div>
      );
  }

  const handleLoadMoreClick = () => {
    setItemsPerPage(itemsPerPage + ITEMS_PER_PAGE);
  };

  const selectInputs = TEST_DATA_LABEL.map((item) => (
    <li key={item.label} className={styles.filterSelect}>
      <SelectField
        sx={{
          margin: "0",
        }}
        props={{
          label: item.label,
          items: item.items,
        }}
      />
    </li>
  ));

  return (
    <main className={styles.main}>
      <div className={styles.hero}>
        <Hero className={styles.heroImage} type="circle" />
      </div>

      <ul className={styles.filterList}>
        <li
          className={`${styles.filterItem} ${styles.filterField}`}
          key={Date.now()}
        >
          <FilterInput
            filterName="name"
            text="Filter by name..."
            action={selectFilters}
          />
        </li>
        {selectInputs}
      </ul>

      <div className={styles.advancedFiltersButton}>
        <FiltersModal modalData={TEST_DATA_LABEL} />
      </div>

      <section>{content}</section>
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

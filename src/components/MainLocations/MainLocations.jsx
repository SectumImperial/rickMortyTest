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
import { ITEMS_PER_PAGE_INITIAL } from "./constants";
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
  const locationLoading = useSelector((state) => state.locations.loading);
  const maxPage = useSelector(state => state.locations.maxPage)
  const [itemsPerPage, setItemsPerPage] = useState(ITEMS_PER_PAGE_INITIAL);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    dispatch(fetchLocations({ page: currentPage }));
  }, [dispatch, currentPage]);


  const typeOptions = useMemo(
    () => getUniqueValues(allLocations, "type"),
    [allLocations]
  );
  const dimensionOptions = useMemo(
    () => getUniqueValues(allLocations, "dimension"),
    [allLocations]
  );

  const selectFilterLabels = useMemo(
    () => [
      { label: "Type", items: typeOptions, action: setLocationsFilter },
      {
        label: "Dimension",
        items: dimensionOptions,
        action: setLocationsFilter,
      },
    ],
    [typeOptions, dimensionOptions]
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
    setCurrentPage(currentPage + 1);
    setItemsPerPage(itemsPerPage + ITEMS_PER_PAGE_INITIAL);
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
      <div
        className={styles.loadMoreButtonContainer}
        onClick={handleLoadMoreClick}
      >
        {currentPage <= maxPage && <LoadMoreButton />}
      </div>
    </main>
  );
}

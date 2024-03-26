import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect, useMemo, useRef, useCallback } from "react";
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
  UpToButton,
} from "..";

export function MainLocations() {
  const dispatch = useDispatch();
  const allLocations = useSelector(selectAllLocations);
  const locations = useSelector(selectFilteredLocations);
  const loadMoreRef = useRef(null);
  const heroImage = useRef(null);
  const locationLoading = useSelector((state) => state.locations.loading);
  const maxPage = useSelector((state) => state.locations.maxPage);
  const [itemsPerPage, setItemsPerPage] = useState(ITEMS_PER_PAGE_INITIAL);
  const [currentPage, setCurrentPage] = useState(1);
  const [isUpToButtonVisible, setIsUpToButtonVisible] = useState(true);

  const prevPageRef = useRef();
  useEffect(() => {
    if (prevPageRef.current !== currentPage) {
      dispatch(fetchLocations({ page: currentPage }));
    }
    prevPageRef.current = currentPage;
  }, [dispatch, currentPage]);

  useEffect(() => {
    if (locationLoading === "succeeded") {
      loadMoreRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [locations.length, locationLoading]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsUpToButtonVisible(scrollTop > window.innerHeight / 2);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
      {
        label: "Dimension",
        items: dimensionOptions,
        action: setLocationsFilter,
      },
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

  const handleLoadMoreClick = useCallback(() => {
    setCurrentPage(currentPage + 1);
    setItemsPerPage(itemsPerPage + ITEMS_PER_PAGE_INITIAL);
  });

  const handleUpButtonClick = useCallback(() => {
    heroImage.current?.scrollIntoView({ behavior: "smooth" });
    setIsUpToButtonVisible(false);
  }, []);

  return (
    <main className={styles.main}>
      <div className={styles.hero} ref={heroImage}>
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
      <section className={styles.contentCard}>{content}</section>
      {locationLoading === "loading" && (
        <div className={styles.loadingIndicator}>
          <Loading />
        </div>
      )}
      <div
        className={styles.loadMoreButtonContainer}
        onClick={handleLoadMoreClick}
        ref={loadMoreRef}
      >
        {currentPage <= maxPage && <LoadMoreButton />}
      </div>
      {currentPage > 2 && isUpToButtonVisible && (
        <div className={styles.upToButton} onClick={handleUpButtonClick}>
          <UpToButton />
        </div>
      )}
    </main>
  );
}

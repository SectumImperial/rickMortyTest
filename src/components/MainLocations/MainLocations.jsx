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
  const locationLoading = useSelector((state) => state.locations.loading);
  const maxPage = useSelector((state) => state.locations.maxPage);
  const error = useSelector((state) => state.locations.error);
  const hasMore = useSelector((state) => state.locations.hasMore);

  const [itemsPerPage, setItemsPerPage] = useState(ITEMS_PER_PAGE_INITIAL);
  const [currentPage, setCurrentPage] = useState(1);
  const [isUpToButtonVisible, setIsUpToButtonVisible] = useState(true);
  const [isLoadMoreClicked, setIsLoadMoreClicked] = useState(false);
  const [isNeedMore, setIsNeedMore] = useState(true);

  const loadMoreRef = useRef(null);
  const heroImage = useRef(null);

  useEffect(() => {
    if (isNeedMore && !error) {
      dispatch(fetchLocations({ page: currentPage }));
      setIsNeedMore(false);
    }
  }, [dispatch, currentPage, isNeedMore, hasMore, error]);

  useEffect(() => {
    if (isLoadMoreClicked) {
      loadMoreRef.current?.scrollIntoView({ behavior: "smooth" });
      setIsLoadMoreClicked(false);
    }
  }, [locations.length, locationLoading, isLoadMoreClicked]);

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
    if (error) return;
    setCurrentPage(currentPage + 1);
    setItemsPerPage(itemsPerPage + ITEMS_PER_PAGE_INITIAL);
    setIsLoadMoreClicked(true);
  }, [currentPage, itemsPerPage, error]);

  const handleUpButtonClick = useCallback(() => {
    heroImage.current?.scrollIntoView({ behavior: "smooth" });
    setIsUpToButtonVisible(false);
  }, []);

  const handleFiltersChange = useCallback(() => {
    setIsNeedMore(true);
  }, []);

  return (
    <main className={styles.main}>
      <div className={styles.hero} ref={heroImage}>
        <Hero className={styles.heroImage} type="circle" />
      </div>
      <ul className={styles.filterList} onChange={handleFiltersChange}>
        <li
          key={"Filter"}
          className={`${styles.filterItem} ${styles.filterField}`}
        >
          <FilterInput
            filterName="name"
            text="Filter by name..."
            action={selectLocationsFilters}
            type="locations"
          />
        </li>
        {selectFilterLabels.map((selectItem) => (
          <li
            className={styles.filterSelect}
            key={selectItem.label}
            onClick={handleFiltersChange}
          >
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
      {locationLoading && (
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

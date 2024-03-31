import { useDispatch } from "react-redux";
import {
  setCharacterFilter,
  resetCharacterFilters,
} from "../store/characterSlice";
import {
  setLocationsFilter,
  resetLocationsFilters,
} from "../store/locationsSlice";
import { setEpisodeFilter, resetEpisodeFilters } from "../store/episodeSlice";
import { AppDispatch } from "../store/store";

interface FilterActions {
  setFilter: (payload: { filterName: string; value: string }) => {
    type: string;
    payload: string;
  };
  resetFilters: () => { type: string };
}

const filterActions: Record<FilterType, FilterActions> = {
  characters: {
    setFilter: setCharacterFilter as unknown as FilterActions["setFilter"],
    resetFilters:
      resetCharacterFilters as unknown as FilterActions["resetFilters"],
  },
  locations: {
    setFilter: setLocationsFilter as unknown as FilterActions["setFilter"],
    resetFilters:
      resetLocationsFilters as unknown as FilterActions["resetFilters"],
  },
  episodes: {
    setFilter: setEpisodeFilter as unknown as FilterActions["setFilter"],
    resetFilters:
      resetEpisodeFilters as unknown as FilterActions["resetFilters"],
  },
};

interface UseFiltersReturnType {
  updateFilter: (filterName: string, value: string) => void;
  resetAllFilters: () => void;
  getCurrentFilters: (type: string) => Record<string, string>;
}

type FilterType = "characters" | "locations" | "episodes";

export const useFilters = (type: FilterType): UseFiltersReturnType => {
  const dispatch = useDispatch<AppDispatch>();

  const actions: FilterActions = filterActions[type];

  const updateFilter = (filterName: string, value: string): void => {
    void dispatch(actions.setFilter({ filterName, value }));
    const currentFilters = getCurrentFilters();
    currentFilters[filterName] = value;
    localStorage.setItem(`${type}Filters`, JSON.stringify(currentFilters));
  };

  const resetAllFilters = (): void => {
    void dispatch(actions.resetFilters());
    localStorage.removeItem(`${type}Filters`);
  };

  const getCurrentFilters = (): Record<string, string> => {
    return JSON.parse(localStorage.getItem(`${type}Filters`) || "{}") as Record<
      string,
      string
    >;
  };

  return { updateFilter, resetAllFilters, getCurrentFilters };
};

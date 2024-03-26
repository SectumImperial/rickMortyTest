import { useDispatch } from "react-redux";
import { setCharacterFilter, resetCharacterFilters } from "../store/characterSlice";
import {
  setLocationsFilter,
  resetLocationsFilters,
} from "../store/locationsSlice";
import { setEpisodeFilter, resetEpisodeFilters } from "../store/episodeSlice";

const filterActions = {
  characters: {
    setFilter: setCharacterFilter,
    resetFilters: resetCharacterFilters,
  },
  locations: {
    setFilter: setLocationsFilter,
    resetFilters: resetLocationsFilters,
  },
  episodes: {
    setFilter: setEpisodeFilter,
    resetFilters: resetEpisodeFilters,
  },
};

export const useFilters = (type = "characters") => {
  const dispatch = useDispatch();

  const actions = filterActions[type];
  const updateFilter = (filterName, value) => {
    dispatch(actions.setFilter({ filterName, value }));
    const currentFilters =
      JSON.parse(localStorage.getItem(`${type}Filters`)) || {};
    currentFilters[filterName] = value;
    localStorage.setItem(`${type}Filters`, JSON.stringify(currentFilters));
  };

  const resetAllFilters = () => {
    dispatch(actions.resetFilters());
    localStorage.removeItem(`${type}Filters`);
  };

  return { updateFilter, resetAllFilters };
};

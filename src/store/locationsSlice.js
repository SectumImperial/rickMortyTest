import {
  createSlice,
  createAsyncThunk,
  createSelector,
} from "@reduxjs/toolkit";
import axios from "axios";

export const fetchLocations = createAsyncThunk(
  "locations/fetchCharacters",
  async (filters, { getState }) => {
    const {
      locations: { filters: currentFilters },
    } = getState();
    const queryParams = new URLSearchParams({
      ...currentFilters,
      ...filters,
    }).toString();

    const response = await axios.get(
      `https://rickandmortyapi.com/api/location/?${queryParams}`,
    );
    return response.data;
  },
);

export const fetchLocationsByIds = createAsyncThunk(
  "locations/fetchLocationsByIds",
  async (locationIds) => {
    const ids = Array.isArray(locationIds)
      ? locationIds.map((url) => url.split("/").pop())
      : locationIds;
    const response = await axios.get(
      `https://rickandmortyapi.com/api/location/${ids}`,
    );
    return response.data;
  },
);

const initialState = {
  maxPage: 2,
  entities: [],
  locationsByIds: [],
  loadingById: true,
  loading: true,
  error: null,
  errorStatus: null,
  filters: JSON.parse(localStorage.getItem("locationsFilters")) || {
    name: "",
    type: "",
    dimension: "",
  },
};

const locationsSlice = createSlice({
  name: "locations",
  initialState,
  reducers: {
    setLocationsFilter(state, action) {
      const { filterName, value } = action.payload;
      state.filters[filterName] = value;
      localStorage.setItem("locationsFilters", JSON.stringify(state.filters));
    },
    resetLocationsFilters(state) {
      state.filters = {};
      localStorage.removeItem("locationsFilters");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLocations.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchLocations.fulfilled, (state, action) => {
        state.loading = false;
        state.entities = [...state.entities, ...action.payload.results];
        state.maxPage = action.payload.info.pages;
      })
      .addCase(fetchLocations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.error = action.error.message;
        state.errorStatus = action.error.code;
      })
      .addCase(fetchLocationsByIds.fulfilled, (state, action) => {
        const locationsData = Array.isArray(action.payload)
          ? action.payload
          : [action.payload];
        const newLocations = new Map(
          state.locationsByIds.map((location) => [location.id, location]),
        );

        locationsData.forEach((location) => {
          newLocations.set(location.id, location);
        });

        state.locationsByIds = Array.from(newLocations.values());
        state.loadingById = false;
        state.error = null;
        state.errorStatus = null;
      })
      .addCase(fetchLocationsByIds.rejected, (state, action) => {
        state.loadingById = false;
        state.error = action.error.message;
      });
  },
});

export const { setLocationsFilter, resetLocationsFilters } =
  locationsSlice.actions;

export const selectAllLocations = (state) => state.locations.entities;
export const selectLocationsFilters = (state) => state.locations.filters;

export const selectFilteredLocations = createSelector(
  [(state) => state.locations],
  (locations) => {
    const { entities, filters } = locations;
    return entities.filter(
      (location) =>
        (!filters.name ||
          location.name.toLowerCase().includes(filters.name.toLowerCase())) &&
        (!filters.type || location.type === filters.type) &&
        (!filters.dimension || location.dimension === filters.dimension),
    );
  },
);

export default locationsSlice.reducer;

import {
  createSlice,
  createAsyncThunk,
  createSelector,
  PayloadAction,
} from "@reduxjs/toolkit";
import axios from "axios";

import {
  AppState,
  FetchArgs,
  FetchLocationPayload,
  LocationRootState,
  LocationState,
  FilterValue,
} from "../interfaces/interfaces";


export const fetchLocations = createAsyncThunk<
  FetchLocationPayload,
  FetchArgs,
  { state: LocationRootState }
>("locations/fetchLocations", async (args, { getState }) => {
  const {
    locations: { filters },
  } = getState();

  const queryParams = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value) {
      queryParams.set(key, value);
    }
  });

  if (args.page !== undefined) {
    queryParams.set("page", args.page.toString());
  }

  const response = await axios.get(
    `https://rickandmortyapi.com/api/location/?${queryParams}`
  );
  return response.data as FetchLocationPayload;
});

export const fetchLocationsByIds = createAsyncThunk(
  "locations/fetchLocationsByIds",
  async (locationIds) => {
    const ids = Array.isArray(locationIds)
      ? locationIds.map((url) => url.split("/").pop())
      : locationIds;
    const response = await axios.get(
      `https://rickandmortyapi.com/api/location/${ids}`
    );
    return response.data;
  }
);

const initialState: LocationState = {
  maxPage: 2,
  entities: [],
  locationsByIds: [],
  loading: true,
  error: null,
  hasMore: true,
  filters: JSON.parse(localStorage.getItem("locationsFilters") || "") || {
    name: "",
    type: "",
    dimension: "",
  },
};

type FilterName = "name" | "type" | "dimension";

interface FilterAction {
  filterName: FilterName;
  value: FilterValue;
}

const locationsSlice = createSlice({
  name: "locations",
  initialState,
  reducers: {
    setLocationsFilter(state, action: PayloadAction<FilterAction>) {
      const { filterName, value } = action.payload;
      state.filters[filterName] = value;
      localStorage.setItem("locationsFilters", JSON.stringify(state.filters));
      state.hasMore = true;
    },
    resetLocationsFilters(state) {
      state.filters = {
        name: "",
        type: "",
        dimension: "",
      };
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
        const newLocations = new Map(
          state.entities.map((loc) => [loc.id, loc])
        );

        action.payload.results.forEach((loc) => {
          newLocations.set(loc.id, loc);
        });

        state.entities = Array.from(newLocations.values());
        state.maxPage = action.payload.info.pages;
        state.error = null;

        state.loading = false;
        state.entities = [...state.entities, ...action.payload.results];
        state.maxPage = action.payload.info.pages;
        state.hasMore = !!action.payload.info.next;
      })
      .addCase(fetchLocations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.error = action.error.message;
      })
      .addCase(fetchLocationsByIds.fulfilled, (state, action) => {
        const locationsData = Array.isArray(action.payload)
          ? action.payload
          : [action.payload];

        state.locationsByIds = locationsData;
        state.error = null;
      })
      .addCase(fetchLocationsByIds.rejected, (state, action) => {
        state.error = action.error.message;
      });
  },
});

export const { setLocationsFilter, resetLocationsFilters } =
  locationsSlice.actions;

export const selectAllLocations = (state: AppState) => state.locations.entities;
export const selectLocationsFilters = (state: AppState) => state.locations.filters;

export const selectFilteredLocations = createSelector(
  [(state) => state.locations],
  (locations) => {
    const { entities, filters } = locations;
    return entities.filter(
      (location: { name: string; type: string; dimension: string; }) =>
        (!filters.name ||
          location.name.toLowerCase().includes(filters.name.toLowerCase())) &&
        (!filters.type || location.type === filters.type) &&
        (!filters.dimension || location.dimension === filters.dimension)
    );
  }
);

export default locationsSlice.reducer;

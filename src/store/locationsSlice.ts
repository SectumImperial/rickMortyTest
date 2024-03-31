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
  Location,
} from "../interfaces/interfaces";

import { parseJSON } from "./helpers";

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
    `https://rickandmortyapi.com/api/location/`,
    {
      params: Object.fromEntries(queryParams),
    },
  );
  return response.data as FetchLocationPayload;
});

type LocationUrls = string | string[];

export const fetchLocationsByIds = createAsyncThunk<
  FetchLocationPayload,
  LocationUrls
>("locations/fetchLocationsByIds", async (locationIds) => {
  let ids: string;

  if (Array.isArray(locationIds)) {
    ids = locationIds.map((url) => url.split("/").pop() ?? "").join(",");
  } else {
    ids = locationIds;
  }
  const response = await axios.get(
    `https://rickandmortyapi.com/api/location/${ids}`,
  );
  return response.data as FetchLocationPayload;
});

const initialState: LocationState = {
  maxPage: 2,
  entities: [],
  locationsByIds: [],
  loading: true,
  error: null,
  hasMore: true,
  filters: parseJSON(localStorage.getItem("locationsFilters"), {
    name: "",
    type: "",
    dimension: "",
  }),
};

type FilterName = "name" | "type" | "dimension";

interface FilterAction {
  filterName: FilterName;
  value: FilterValue;
}

function isLocation(payload: FetchLocationPayload | Location): payload is Location {
  return "id" in payload;
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

  if (action.payload.results && Array.isArray(action.payload.results)) {
    const newLocations = new Map<number, Location>(
      state.entities.map((location) => [location.id, location])
    );

    action.payload.results.forEach((location) => {
      newLocations.set(location.id, location);
    });

    state.entities = Array.from(newLocations.values());
  } else {
    console.error("Unexpected payload structure:", action.payload);
  }

  state.maxPage = action.payload.info?.pages || 1;
  state.error = null;
  state.hasMore = !!action.payload.info?.next;
      })
      .addCase(fetchLocations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.error = action.error.message;
      })
      .addCase(fetchLocationsByIds.fulfilled, (state, action) => {
  let locationsData: Location[];

        if (Array.isArray(action.payload)) {
          locationsData = action.payload;
        } else if (isLocation(action.payload)) {
          locationsData = [action.payload];
        } else {
          console.error("Unexpected payload structure:", action.payload);
          locationsData = [];
        }

        state.locationsByIds = locationsData;
        state.loading = false;
      })
      .addCase(fetchLocationsByIds.rejected, (state, action) => {
        state.error = action.error.message;
      });
  },
});

export const { setLocationsFilter, resetLocationsFilters } =
  locationsSlice.actions;

export const selectAllLocations = (state: AppState): Location[] =>
  state.locations.entities;

export const selectLocationsFilters = (
  state: AppState,
): LocationState["filters"] => state.locations.filters;

export const selectFilteredLocations = createSelector<
  [
    (state: AppState) => Location[],
    (state: AppState) => LocationState["filters"],
  ],
  Location[]
>([selectAllLocations, selectLocationsFilters], (locations, filters) =>
  locations.filter(
    (location) =>
      (!filters.name ||
        location.name.toLowerCase().includes(filters.name.toLowerCase())) &&
      (!filters.type || location.type === filters.type) &&
      (!filters.dimension || location.dimension === filters.dimension),
  ),
);

export default locationsSlice.reducer;

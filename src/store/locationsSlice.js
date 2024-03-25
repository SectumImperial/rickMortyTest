import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchLocations = createAsyncThunk(
  "locations/fetchLocations",
  async (queryParams) => {
    const response = await axios.get(
      "https://rickandmortyapi.com/api/location",
      {
        params: queryParams,
      },
    );
    return response.data;
  },
);
const initialState = {
  entities: [],
  loading: "idle",
  error: null,
  filters: {
    name: "",
    type: "",
    dimension: "",
  },
};

const locationsSlice = createSlice({
  name: "locations",
  initialState,
  reducers: {
    setFilter(state, action) {
      const { filterName, value } = action.payload;
      state.filters[filterName] = value;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLocations.pending, (state) => {
        state.loading = "loading";
      })
      .addCase(fetchLocations.fulfilled, (state, action) => {
        state.loading = "succeeded";
        state.entities = action.payload.results;
      })
      .addCase(fetchLocations.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.error.message;
      });
  },
});

export const { setFilter } = locationsSlice.actions;

export const selectAllLocations = (state) => state.locations.entities;
export const selectFilters = (state) => state.locations.filters;
export const selectFilteredLocations = (state) => {
  const { entities, filters } = state.locations;
  return entities.filter(
    (location) =>
      location.name.toLowerCase().includes(filters.name.toLowerCase()) &&
      location.status.toLowerCase().includes(filters.status.toLowerCase()),
  );
};

export default locationsSlice.reducer;

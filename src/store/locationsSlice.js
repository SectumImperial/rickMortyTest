import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
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

export const fetchCharactersByIds = createAsyncThunk(
  "locations/fetchCharactersByIds",
  async (residentUrls) => {
    const ids = residentUrls.map((url) => url.split("/").pop());
    const response = await axios.get(
      `https://rickandmortyapi.com/api/character/${ids}`,
    );
    return response.data;
  },
);

const initialState = {
  maxPage: 2,
  entities: [],
  residentsData: [],
  loading: "idle",
  residentLoading: "idle",
  error: null,
  errorResident: null,
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
        state.loading = "loading";
      })
      .addCase(fetchLocations.fulfilled, (state, action) => {
        state.loading = "succeeded";
        state.entities = [...state.entities, ...action.payload.results];
        state.maxPage = action.payload.info.pages;
      })
      .addCase(fetchLocations.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchCharactersByIds.fulfilled, (state, action) => {
        const residentsData = Array.isArray(action.payload) ? action.payload : [action.payload];
        const newResidents = new Map(state.residentsData.map(resident => [resident.id, resident]));
      
        residentsData.forEach(resident => {
          newResidents.set(resident.id, resident);
        });
      
        state.residentsData = Array.from(newResidents.values());
      })
      .addCase(fetchCharactersByIds.rejected, (state, action) => {
        state.residentLoading = "failed";
        state.errorResident = action.error.message;
      })
      .addCase(fetchCharactersByIds.pending, (state) => {
        state.residentLoading = "loading";
      });
  },
});

export const { setLocationsFilter, resetLocationsFilters } =
  locationsSlice.actions;

export const selectAllLocations = (state) => state.locations.entities;
export const selectLocationsFilters = (state) => state.locations.filters;
export const selectFilteredLocations = (state) => {
  const { entities, filters } = state.locations;
  return entities.filter(
    (location) =>
      (!filters.name ||
        location.name.toLowerCase().includes(filters.name.toLowerCase())) &&
      (!filters.type || location.type === filters.type) &&
      (!filters.dimension || location.dimension === filters.dimension),
  );
};

export default locationsSlice.reducer;

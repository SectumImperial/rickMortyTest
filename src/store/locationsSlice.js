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

export const fetchCharactersByIds = createAsyncThunk(
  "locations/fetchCharactersByIds",
  async (residentUrls) => {
    const ids = residentUrls.map(url => url.split('/').pop());
    const response = await axios.get(`https://rickandmortyapi.com/api/character/${ids}`);
    return response.data;
  }
);

const initialState = {
  entities: [],
  charactersByIds: {},
  loading: "idle",
  error: null,
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
        state.entities = action.payload.results;
      })
      .addCase(fetchLocations.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchCharactersByIds.fulfilled, (state, action) => {
        const residentUrls = action.meta.arg;
        const residentsData = action.payload; 
        console.log(residentsData)
        residentUrls.forEach((url, index) => {
          const id = url.split('/').pop(); 
          if (!state.charactersByIds[id]) {
            state.charactersByIds[id] = [];
          }
          state.charactersByIds[id].push(residentsData[index]);
        });
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

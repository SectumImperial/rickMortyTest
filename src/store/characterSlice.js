import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchCharacters = createAsyncThunk(
  "characters/fetchCharacters",
  async (queryParams) => {
    const response = await axios.get(
      "https://rickandmortyapi.com/api/character",
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
  filters: JSON.parse(localStorage.getItem("characterFilters")) || {
    name: "",
    species: "",
    status: "",
    gender: "",
  },
};
const charactersSlice = createSlice({
  name: "characters",
  initialState,
  reducers: {
    setFilter(state, action) {
      const { filterName, value } = action.payload;
      state.filters[filterName] = value;
      localStorage.setItem("characterFilters", JSON.stringify(state.filters));
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCharacters.pending, (state) => {
        state.loading = "loading";
      })
      .addCase(fetchCharacters.fulfilled, (state, action) => {
        state.loading = "succeeded";
        state.entities = action.payload.results;
      })
      .addCase(fetchCharacters.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.error.message;
      });
  },
});

export const { setFilter } = charactersSlice.actions;

export const selectAllCharacters = (state) => state.characters.entities;
export const selectFilters = (state) => state.characters.filters;
export const selectFilteredCharacters = (state) => {
  const { entities, filters } = state.characters;
  return entities.filter(
    (character) =>
      (!filters.name ||
        character.name.toLowerCase().includes(filters.name.toLowerCase())) &&
      (!filters.species || character.species === filters.species) &&
      (!filters.status || character.status === filters.status) &&
      (!filters.gender || character.gender === filters.gender),
  );
};
export default charactersSlice.reducer;

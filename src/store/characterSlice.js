import {
  createSlice,
  createAsyncThunk,
  createSelector,
} from "@reduxjs/toolkit";
import axios from "axios";


export const fetchCharacters = createAsyncThunk(
  "characters/fetchCharacters",
  async (filters, { getState }) => {
    const { characters: { filters: currentFilters } } = getState();
    const queryParams = new URLSearchParams({
      ...currentFilters,
      ...filters, 
    }).toString();
    
    const response = await axios.get(
      `https://rickandmortyapi.com/api/character/?${queryParams}`
    );
    return response.data;
  }
);

const initialState = {
  maxPage: 1,
  entities: [],
  charactersByIds: [],
  loading: "idle",
  byIdsLoading: "idle",
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
    setCharacterFilter(state, action) {
      const { filterName, value } = action.payload;
      state.filters[filterName] = value;
      localStorage.setItem("characterFilters", JSON.stringify(state.filters));
    },
    resetCharacterFilters(state) {
      state.filters = {};
      localStorage.removeItem("characterFilters");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCharacters.pending, (state) => {
        state.loading = "loading";
      })
      .addCase(fetchCharacters.fulfilled, (state, action) => {
        state.loading = "succeeded";
        state.entities = [...state.entities, ...action.payload.results]
        state.maxPage = action.payload.info.pages
      })
      .addCase(fetchCharacters.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.error.message;
      });
  },
});

export const { setCharacterFilter, resetCharacterFilters } =
  charactersSlice.actions;

export const selectMaxPage = (state) => state.maxPage;

export const selectAllCharacters = (state) => state.characters.entities;
export const selectCharactersFilters = (state) => state.characters.filters;
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

export const selectCharactersByIds = createSelector(
  [selectAllCharacters, (state, characterIds) => characterIds],
  (characters, characterIds) => {
    return characters.filter((character) =>
      characterIds.includes(character.id.toString()),
    );
  },
);

export default charactersSlice.reducer;

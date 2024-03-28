import {
  createSlice,
  createAsyncThunk,
  createSelector,
} from "@reduxjs/toolkit";
import axios from "axios";

export const fetchCharacters = createAsyncThunk(
  "characters/fetchCharacters",

  async (filters, { getState }) => {
    const {
      characters: { filters: currentFilters },
    } = getState();
    const queryParams = new URLSearchParams({
      ...currentFilters,
      ...filters,
    }).toString();
    const response = await axios.get(
      `https://rickandmortyapi.com/api/character/?${queryParams}`,
    );
    return response.data;
  },
);

export const fetchCharactersByIds = createAsyncThunk(
  "characters/fetchCharactersByIds",
  async (residentUrls) => {
    const ids = Array.isArray(residentUrls)
      ? residentUrls.map((url) => url.split("/").pop())
      : residentUrls;
    const response = await axios.get(
      `https://rickandmortyapi.com/api/character/${ids}`,
    );
    return response.data;
  },
);

const initialState = {
  maxPage: 1,
  entities: [],
  charactersByIds: [],
  loading: null,
  error: null,
  hasMore: true,
  filters: JSON.parse(localStorage.getItem("charactersFilters")) || {
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
      localStorage.setItem("charactersFilters", JSON.stringify(state.filters));
      state.hasMore = true;
    },
    resetCharacterFilters(state) {
      state.filters = {};
      localStorage.removeItem("charactersFilters");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCharacters.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCharacters.fulfilled, (state, action) => {
        state.loading = false;
        const newCharacters = new Map(
          state.entities.map((char) => [char.id, char]),
        );

        action.payload.results.forEach((char) => {
          newCharacters.set(char.id, char);
        });

        state.entities = Array.from(newCharacters.values());
        state.maxPage = action.payload.info.pages;
        state.error = null;
        state.hasMore = !!action.payload.info.next;
      })
      .addCase(fetchCharacters.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchCharactersByIds.fulfilled, (state, action) => {
        const charactersData = Array.isArray(action.payload)
          ? action.payload
          : [action.payload];

        state.charactersByIds = charactersData;
        state.loading = false;
      })
      .addCase(fetchCharactersByIds.rejected, (state, action) => {
        state.loading = false;
        state.errorResident = action.error.message;
      })
      .addCase(fetchCharactersByIds.pending, (state) => {
        state.loading = false;
      });
  },
});

export const { setCharacterFilter, resetCharacterFilters } =
  charactersSlice.actions;

export const selectMaxPage = (state) => state.maxPage;

export const selectAllCharacters = (state) => state.characters.entities;
export const selectCharactersFilters = (state) => state.characters.filters;
export const selectFilteredCharacters = createSelector(
  [(state) => state.characters],
  (characters) => {
    const { entities, filters } = characters;
    return entities.filter(
      (character) =>
        (!filters.name ||
          character.name.toLowerCase().includes(filters.name.toLowerCase())) &&
        (!filters.species || character.species === filters.species) &&
        (!filters.status || character.status === filters.status) &&
        (!filters.gender || character.gender === filters.gender),
    );
  },
);

export const selectCharactersByIds = createSelector(
  [selectAllCharacters, (state, characterIds) => characterIds],
  (characters, characterIds) => {
    return characters.filter((character) =>
      characterIds.includes(character.id.toString()),
    );
  },
);

export default charactersSlice.reducer;

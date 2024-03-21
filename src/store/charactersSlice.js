import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

export const fetchCharacters = createAsyncThunk(
  'characters/fetchCharacters',
  async (queryParams) => {
    const response = await axios.get('https://rickandmortyapi.com/api/character', {
      params: queryParams,
    });
    return response.data;
  }
);
const initialState = {
  entities: [],
  loading: 'idle',
  error: null,
  filters: {
    name: '',
    status: '',
  },
};

const charactersSlice = createSlice({
  name: 'characters',
  initialState,
  reducers: {
    setFilter(state, action) {
      const { filterName, value } = action.payload;
      state.filters[filterName] = value;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCharacters.pending, (state) => {
        state.loading = 'loading';
      })
      .addCase(fetchCharacters.fulfilled, (state, action) => {
        state.loading = 'succeeded';
        state.entities = action.payload.results;
      })
      .addCase(fetchCharacters.rejected, (state, action) => {
        state.loading = 'failed';
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
      character.name.toLowerCase().includes(filters.name.toLowerCase()) &&
      character.status.toLowerCase().includes(filters.status.toLowerCase())
  );
};

export default charactersSlice.reducer;

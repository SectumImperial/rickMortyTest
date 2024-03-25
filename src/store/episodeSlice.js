import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { createSelector } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchEpisodes = createAsyncThunk(
  "episodes/fetchEpisodes",
  async (queryParams) => {
    const response = await axios.get(
      "https://rickandmortyapi.com/api/episode",
      { params: queryParams },
    );
    return response.data;
  },
);

const initialState = {
  entities: [],
  loading: "idle",
  error: null,
  filters: JSON.parse(localStorage.getItem("episodeFilters")) || {
    name: "",
  },
};

const episodesSlice = createSlice({
  name: "episodes",
  initialState,
  reducers: {
    setEpisodeFilter(state, action) {
      const { filterName, value } = action.payload;
      state.filters[filterName] = value;
      localStorage.setItem("episodeFilters", JSON.stringify(state.filters));
    },
    resetEpisodeFilters(state) {
      state.filters = {};
      localStorage.removeItem("episodeFilters");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEpisodes.pending, (state) => {
        state.loading = "loading";
      })
      .addCase(fetchEpisodes.fulfilled, (state, action) => {
        state.loading = "succeeded";
        state.entities = action.payload.results;
      })
      .addCase(fetchEpisodes.rejected, (state, action) => {
        state.loading = "failed";
        state.error = action.error.message;
      });
  },
});

export const { setEpisodeFilter, resetEpisodeFilters } = episodesSlice.actions;

export const selectAllEpisodes = (state) => state.episodes.entities;
export const selectEpisodeFilters = (state) => state.episodes.filters;
export const selectFilteredEpisodes = createSelector(
  [selectAllEpisodes, selectEpisodeFilters],
  (entities, filters) => {
    return entities.filter(
      (episode) => {
        const filterString = filters.name.toLowerCase();
        return (
          episode.name.toLowerCase().includes(filterString) ||
          episode.episode.toLowerCase().includes(filterString)
        );
      }
    );
  }
);


export default episodesSlice.reducer;

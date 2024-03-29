import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { createSelector } from "@reduxjs/toolkit";
import axios from "axios";

import {
  AppState,
  FetchArgs,
  FetchEpisodePayload,
  EpisodeRootState,
  EpisodeState,
  FilterValue
} from "../interfaces/interfaces";

export const fetchEpisodes = createAsyncThunk<
  FetchEpisodePayload,
  FetchArgs,
  { state: EpisodeRootState }
>("episodes/fetchEpisodes", async (args, { getState }) => {
  const {
    episodes: { filters },
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
    `https://rickandmortyapi.com/api/episode/?${queryParams}`
  );
  return response.data as FetchEpisodePayload;
});

export const fetchEpisodesByIds = createAsyncThunk(
  "episodes/fetchEpisodesByIds",
  async (episodeIds) => {
    const ids = Array.isArray(episodeIds)
      ? episodeIds.map((url) => url.split("/").pop())
      : episodeIds;
    const response = await axios.get(
      `https://rickandmortyapi.com/api/episode/${ids}`,
    );
    return response.data;
  },
);

const initialState: EpisodeState = {
  maxPage: 1,
  entities: [],
  loading: null,
  episodesByIds: [],
  error: null,
  hasMore: true,
  filters: JSON.parse(localStorage.getItem("episodesFilters") || "") || {
    name: "",
  },
};

type FilterName = "name";

interface FilterAction {
  filterName: FilterName;
  value: FilterValue;
}

const episodesSlice = createSlice({
  name: "episodes",
  initialState,
  reducers: {
    setEpisodeFilter(state, action: PayloadAction<FilterAction>) {
      const { filterName, value } = action.payload;
      if (typeof filterName === "string")  state.filters[filterName] = value;
      localStorage.setItem("episodesFilters", JSON.stringify(state.filters));
    },
    resetEpisodeFilters(state) {
      state.filters = {
        name: "",
      };
      localStorage.removeItem("episodesFilters");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchEpisodes.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchEpisodes.fulfilled, (state, action) => {
        state.loading = false;
        const newEpisodes = new Map(
          state.entities.map((episode) => [episode.id, episode]),
        );
        action.payload.results.forEach((episode) => {
          newEpisodes.set(episode.id, episode);
        });

        state.entities = Array.from(newEpisodes.values());
        state.maxPage = action.payload.info.pages;
        state.error = null;
        state.hasMore = !!action.payload.info.next;
      })
      .addCase(fetchEpisodes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchEpisodesByIds.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchEpisodesByIds.fulfilled, (state, action) => {
        const episodesData = Array.isArray(action.payload)
          ? action.payload
          : [action.payload];

        state.episodesByIds = episodesData;
        state.loading = false;
        state.error = null;
      })
      .addCase(fetchEpisodesByIds.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { setEpisodeFilter, resetEpisodeFilters } = episodesSlice.actions;

export const selectAllEpisodes = (state: AppState) => state.episodes.entities;
export const selectEpisodeFilters = (state: AppState) => state.episodes.filters;
export const selectFilteredEpisodes = createSelector(
  [selectAllEpisodes, selectEpisodeFilters],
  (entities, filters) => {
    return entities.filter((episode) => {
      const filterString = filters.name.toLowerCase();
      return (
        episode.name.toLowerCase().includes(filterString) ||
        episode.episode.toLowerCase().includes(filterString)
      );
    });
  },
);

export const selectEpisodesByIds = createSelector(
  [selectAllEpisodes, (state, episodeIds) => episodeIds],
  (episodes, episodeIds) => {
    return episodes.filter((episode) =>
      episodeIds.includes(String(episode.id)),
    );
  },
);

export default episodesSlice.reducer;

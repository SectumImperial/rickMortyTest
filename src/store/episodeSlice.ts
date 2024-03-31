import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { createSelector } from "@reduxjs/toolkit";
import axios from "axios";

import {
  AppState,
  FetchArgs,
  FetchEpisodePayload,
  EpisodeRootState,
  EpisodeState,
  FilterValue,
  Episode,
} from "../interfaces/interfaces";

import { parseJSON } from "./helpers";

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
  const response = await axios.get(`https://rickandmortyapi.com/api/episode/`, {
    params: Object.fromEntries(queryParams),
  });
  return response.data as FetchEpisodePayload;
});

type EpisodeUrls = string | string[];

export const fetchEpisodesByIds = createAsyncThunk<
  FetchEpisodePayload,
  EpisodeUrls
>("episodes/fetchEpisodesByIds", async (residentUrls) => {
  let ids: string;

  if (Array.isArray(residentUrls)) {
    ids = residentUrls.map((url) => url.split("/").pop() ?? "").join(",");
  } else {
    ids = residentUrls;
  }
  const response = await axios.get(
    `https://rickandmortyapi.com/api/episode/${ids}`,
  );
  return response.data as FetchEpisodePayload;
});

const initialState: EpisodeState = {
  maxPage: 1,
  entities: [],
  episodesByIds: [],
  loading: null,
  error: null,
  hasMore: true,
  filters: parseJSON(localStorage.getItem("episodesFilters"), {
    name: "",
  }),
};

type FilterName = "name";

interface FilterAction {
  filterName: FilterName;
  value: FilterValue;
}

function isEpisode(payload: FetchEpisodePayload | Episode): payload is Episode {
  return "id" in payload && "name" in payload;
}

const episodesSlice = createSlice({
  name: "episodes",
  initialState,
  reducers: {
    setEpisodeFilter(state, action: PayloadAction<FilterAction>) {
      const { filterName, value } = action.payload;
      if (typeof filterName === "string") state.filters[filterName] = value;
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
        const newEpisodes = new Map<number, Episode>(
          state.entities.map((episode) => [episode.id, episode]),
        );

        if (action.payload.results && Array.isArray(action.payload.results)) {
          action.payload.results.forEach((episode) => {
            newEpisodes.set(episode.id, episode);
          });
        } else {
          console.error(
            "Unexpected payload structure in fetchEpisodes:",
            action.payload,
          );
        }

        state.entities = Array.from(newEpisodes.values());
        state.maxPage = action.payload.info?.pages || 1;
        state.error = null;
        state.hasMore = !!action.payload.info?.next;
      })
      .addCase(fetchEpisodes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchEpisodesByIds.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchEpisodesByIds.fulfilled, (state, action) => {
        let episodesData: Episode[];

        if (Array.isArray(action.payload)) {
          episodesData = action.payload;
        } else if (isEpisode(action.payload)) {
          episodesData = [action.payload];
        } else {
          console.error("Unexpected payload structure:", action.payload);
          episodesData = [];
        }

        state.episodesByIds = episodesData;
        state.loading = false;
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
export const selectFilteredEpisodes = createSelector<
  [typeof selectAllEpisodes, typeof selectEpisodeFilters],
  Episode[]
>([selectAllEpisodes, selectEpisodeFilters], (episodes, filters) =>
  episodes.filter((episode) =>
    episode.name.toLowerCase().includes(filters.name.toLowerCase()),
  ),
);

export const selectEpisodesByIds = createSelector<
  [
    typeof selectAllEpisodes,
    (state: AppState, episodeIds: string[]) => string[],
  ],
  Episode[]
>(
  [selectAllEpisodes, (state: AppState, episodeIds: string[]) => episodeIds],
  (episodes, episodeIds) =>
    episodes.filter((episode) => episodeIds.includes(episode.id.toString())),
);

export default episodesSlice.reducer;

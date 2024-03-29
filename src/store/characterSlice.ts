import {
  createSlice,
  createAsyncThunk,
  createSelector,
  PayloadAction,
} from "@reduxjs/toolkit";
import axios from "axios";

import {
  AppState,
  CharacterState,
  FetchCharactersPayload,
  Character,
  FetchArgs,
  CharacterRootState,
  FilterValue
} from "../interfaces/interfaces";

export const fetchCharacters = createAsyncThunk<
  FetchCharactersPayload,
  FetchArgs,
  { state: CharacterRootState }
>("characters/fetchCharacters", async (args, { getState }) => {
  const {
    characters: { filters },
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
  const response = await axios.get(`https://rickandmortyapi.com/api/character/`, {
    params: Object.fromEntries(queryParams)
  });
  return response.data as FetchCharactersPayload;
});


type ResidentUrls = string | string[];

export const fetchCharactersByIds = createAsyncThunk<FetchCharactersPayload, ResidentUrls>(
  "characters/fetchCharactersByIds",
  async (residentUrls) => {
    let ids: string;

    if (Array.isArray(residentUrls)) {
      ids = residentUrls.map(url => url.split('/').pop() ?? '').join(',');
    } else {
      ids = residentUrls;
    }
    const response = await axios.get(
      `https://rickandmortyapi.com/api/character/${ids}`
    );
    return response.data as FetchCharactersPayload;
  }
);


function parseJSON<T>(value: string | null, defaultValue: T): T {
  try {
    return value ? (JSON.parse(value) as T) : defaultValue;
  } catch {
    return defaultValue;
  }
}

const initialState: CharacterState = {
  maxPage: 1,
  entities: [],
  charactersByIds: [],
  loading: null,
  error: null,
  hasMore: true,
  filters: parseJSON(localStorage.getItem("charactersFilters"), {
    name: "",
    species: "",
    status: "",
    gender: "",
  }),
};

type FilterName = "name" | "species" | "status" | "gender";

interface FilterAction {
  filterName: FilterName;
  value: FilterValue;
}



const charactersSlice = createSlice({
  name: "characters",
  initialState,
  reducers: {
    setCharacterFilter(state, action: PayloadAction<FilterAction>) {
      const { filterName, value } = action.payload;
      if (typeof filterName === "string") state.filters[filterName] = value;

      localStorage.setItem("charactersFilters", JSON.stringify(state.filters));
      state.hasMore = true;
    },
    resetCharacterFilters(state) {
      state.filters = {
        name: "",
        species: "",
        status: "",
        gender: "",
      };
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
          state.entities.map((char) => [char.id, char])
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
        const charactersData = Array.isArray(action.payload) ? action.payload : action.payload.results;

        state.charactersByIds = charactersData;
        state.loading = false;
      })
      .addCase(fetchCharactersByIds.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchCharactersByIds.pending, (state) => {
        state.loading = false;
      });
  },
});

export const { setCharacterFilter, resetCharacterFilters } =
  charactersSlice.actions;

export const selectMaxPage = (state: CharacterState) => state.maxPage;

  export const selectAllCharacters = (state: AppState): Character[] => state.characters.entities;
  export const selectFilters = (state: AppState) => state.characters.filters;
  
  export const selectFilteredCharacters = createSelector(
    [selectAllCharacters, selectFilters],
    (entities: Character[], filters) => entities.filter((character: Character) => (
      (!filters.name || character.name.toLowerCase().includes(filters.name.toLowerCase())) &&
      (!filters.species || character.species === filters.species) &&
      (!filters.status || character.status === filters.status) &&
      (!filters.gender || character.gender === filters.gender)
    ))
  );

  export const selectCharactersByIds = createSelector<
  [typeof selectAllCharacters, (state: AppState, characterIds: string[]) => string[]],
  Character[]
>(
  [selectAllCharacters, (state: AppState, characterIds: string[]) => characterIds],
  (characters: Character[], characterIds: string[]) => characters.filter(character =>
    characterIds.includes(character.id.toString())
  )
);

export default charactersSlice.reducer;

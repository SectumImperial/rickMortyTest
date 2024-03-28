export interface Character {
  id: number;
  name: string;
  status: string;
  species: string;
  type: string;
  gender: string;
  origin: {
    name: string;
    url: string;
  };
  location: {
    name: string;
    url: string;
  };
  image: string;
  episode: string[];
  url: string;
  created: string;
}

export interface CharacterCardProps {
  character: Character;
}

export interface CharactersCardProps {
  characters: Character[];
}

interface CharacterState {
  maxPage: number;
  entities: Character[]; 
  charactersByIds: Character[];
  loading: boolean | null;
  error: string | null;
  hasMore: boolean;
  filters: {
    name: string;
    species: string;
    status: string;
    gender: string;
  };
}

interface AppState {
  characters: CharacterState;
  locations: LocationState;
  episodes: EpisodeState;
}


interface FetchCharactersPayload {
  results: Character[];
  info: {
    pages: number;
    next: string | null;
  };
}

interface FilterPayload {
  filterName: keyof CharactersState['filters'];
  value: string;
}


import { createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

export const fetchCharacters = createAsyncThunk<FetchCharactersPayload, { page: number }, { state: CharactersState }>(
  'characters/fetchCharacters',
  async (args, { getState }) => {
    const state = getState();
    const { filters } = state;
    // Параметры запроса на основе filters...
    const response = await fetch(`https://rickandmortyapi.com/api/character/?page=${args.page}`);
    const data: FetchCharactersPayload = await response.json();
    return data;
  }
);
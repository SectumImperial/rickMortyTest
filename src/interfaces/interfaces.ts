// Characters
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

export interface CharacterState {
  maxPage: number;
  entities: Character[]; 
  charactersByIds: Character[];
  loading: boolean | null;
  error: string | null | undefined;
  hasMore: boolean;
  filters: {
    name: string;
    species: string;
    status: string;
    gender: string;
  };
}

export interface CharacterRootState {
  characters: CharacterState;
}

export interface FetchCharactersPayload {
  results: Character[];
  info: {
    pages: number;
    next: string | null;
  };
}

// Locations
export interface Location {
  id: number;
  name: string;
  status: string;
  type: string;
  dimension: string;
  residents: [];
  episode: string[];
  url: string;
  created: string;
}

export interface LocationState {
  maxPage: number;
  entities: Location[]; 
  locationsByIds: Location[];
  loading: boolean | null;
  error: string | null | undefined;
  hasMore: boolean;
  filters: {
    name: string;
    type: string;
    dimension: string;
  };
}

export interface LocationRootState {
  locations: LocationState;
}

export interface FetchLocationPayload {
  results: Location[];
  info: {
    pages: number;
    next: string | null;
  };
}

// Episodes
export interface Episode {
  id: number;
  name: string;
  air_date: string;
  episode: string;
  characters: string[];
  url: string;
  created: string;
}

export interface EpisodeState {
  episodesByIds: any;
  maxPage: number;
  entities: Episode[];
  loading: boolean | null;
  error: string | null | undefined;
  hasMore: boolean;
  filters: {
    name: string;
  };
}

export interface EpisodeRootState {
  episodes: EpisodeState;
}

export interface FetchEpisodePayload {
  results: Episode[];
  info: {
    pages: number;
    next: string | null;
  };
}

export interface EpisodesCardProps {
  episodes: Episode[];
}

export interface EpisodeCardProps {
  episodeData: Episode;
}

// Rest
export interface AppState {
  characters: CharacterState;
  locations: LocationState;
  episodes: EpisodeState;
}

export interface SelectFilterLabel {
  label: string;
  items: string[];
}

export interface FetchArgs {
  page?: number;
}

export type FilterValue = string;
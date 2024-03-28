import { configureStore } from "@reduxjs/toolkit";
import charactersReducer from "./characterSlice";
import locationsReducer from "./locationsSlice";
import episodesReducer from "./episodeSlice";

export const store = configureStore({
  reducer: {
    characters: charactersReducer,
    locations: locationsReducer,
    episodes: episodesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
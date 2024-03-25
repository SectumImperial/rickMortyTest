import { configureStore } from "@reduxjs/toolkit";
import charactersReducer from "./characterSlice";
import locationsReducer from "./locationsSlice";

export const store = configureStore({
  reducer: {
    characters: charactersReducer,
    locations: locationsReducer,
  },
});

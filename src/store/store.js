import { configureStore } from '@reduxjs/toolkit';
import charactersReducer from './charactersSlice'; // Предполагается, что слайс называется charactersSlice

export const store = configureStore({
  reducer: {
    characters: charactersReducer,
  },
});

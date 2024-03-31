import { Route, Routes, Navigate } from "react-router-dom";
import { FC } from "react";
import {
  MainCharacters,
  MainLocations,
  MainEpisodes,
  MainCharacterDetail,
  MainLocationDetail,
  MainEpisodeDetail,
  ErrorPage,
} from "..";

export const RoutesComponent: FC = () => (
  <Routes>
    <Route
      path="/characters"
      element={<MainCharacters />}
      errorElement={<ErrorPage />}
    />
    <Route
      path="/locations"
      element={<MainLocations />}
      errorElement={<ErrorPage />}
    />
    <Route
      path="/episodes"
      element={<MainEpisodes />}
      errorElement={<ErrorPage />}
    />
    <Route
      path="/characters/:characterId"
      element={<MainCharacterDetail />}
      errorElement={<ErrorPage />}
    />
    <Route
      path="/locations/:locationId"
      element={<MainLocationDetail />}
      errorElement={<ErrorPage />}
    />
    <Route
      path="/episodes/:episodeId"
      element={<MainEpisodeDetail />}
      errorElement={<ErrorPage />}
    />
    <Route
      path="/"
      element={<Navigate to="/characters" replace />}
      errorElement={<ErrorPage />}
    />
  </Routes>
);

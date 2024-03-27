import { Provider } from "react-redux";
import { store } from "./store/store";
import "./App.scss";
import { Container } from "@mui/material";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import {
  Footer,
  Header,
  MainCharacters,
  MainLocations,
  MainEpisodes,
  MainCharacterDetail,
  MainLocationDetail,
  MainEpisodeDetail,
  ErrorPage,
} from "./components";

const App = () => (
  <Provider store={store}>
    <Router>
      <Container
        className="container"
        maxWidth="false"
        disableGutters
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
        }}
      >
        <Header />
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
        <Footer />
      </Container>
    </Router>
  </Provider>
);

export default App;

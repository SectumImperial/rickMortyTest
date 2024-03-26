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
          <Route path="/characters" element={<MainCharacters />} />
          <Route path="/locations" element={<MainLocations />} />
          <Route path="/episodes" element={<MainEpisodes />} />
          <Route
            path="/characters/:characterId"
            element={<MainCharacterDetail />}
          />
          <Route
            path="/locations/:locationId"
            element={<MainLocationDetail />}
          />
          {/* <Route
            path="/episodes/:episodeId"
            element={<MainEpisodesDetail />}
          /> */}
          <Route path="/" element={<Navigate to="/characters" replace />} />
        </Routes>
        <Footer />
      </Container>
    </Router>
  </Provider>
);

export default App;

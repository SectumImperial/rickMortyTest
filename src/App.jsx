import "./App.scss";
import { Container } from "@mui/material";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { Fragment } from "react";
import {
  Footer,
  Header,
  MainCharacters,
  MainLocations,
  MainEpisodes,
} from "./components";

function App() {
  return (
    <Fragment>
      <Router>
        <Container
          className="container"
          maxWidth="false"
          disableGutters
          sx={{
            display: "flex",
            flexDirection: "column", // Добавлено для вертикального выравнивания
            minHeight: "100vh", // Добавлено, чтобы Footer оставался внизу, если потребуется
          }}
        >
          <Header />
          <Routes>
            <Route path="/characters" element={<MainCharacters />} />
            <Route path="/locations" element={<MainLocations />} />
            <Route path="/episodes" element={<MainEpisodes />} />
            <Route path="/" element={<Navigate to="/characters" replace />} />
          </Routes>
          <Footer />
        </Container>
      </Router>
    </Fragment>
  );
}

export default App;

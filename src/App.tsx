import { Provider } from "react-redux";
import { store } from "./store/store";
import "./App.scss";
import { Container } from "@mui/material";
import { BrowserRouter as Router } from "react-router-dom";
import { Footer, Header, RoutesComponent } from "./components";

export const App = () => (
  <Provider store={store}>
    <Router>
      <Container
        className="container"
        maxWidth={false}
        disableGutters
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
        }}
      >
        <Header />
        <RoutesComponent />
        <Footer />
      </Container>
    </Router>
  </Provider>
);

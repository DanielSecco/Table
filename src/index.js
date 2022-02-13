import { StrictMode } from "react";
import ReactDOM from "react-dom";
import { StyledEngineProvider } from "@mui/material/styles";
import App from "./App";

const rootElement = document.getElementById("root");
ReactDOM.render(
  <StyledEngineProvider injectFirst>
    <App />
  </StyledEngineProvider>,
  rootElement
);

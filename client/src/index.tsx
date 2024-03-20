import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { Provider } from "react-redux";
import { store } from "./store";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@mui/material";
import theme from "./shared/theme/theme";
import { AuthWrap } from "./components/AuthWrap";

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);

root.render(
  <Provider store={store}>
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <React.StrictMode>
          <AuthWrap>
            <App />
          </AuthWrap>
        </React.StrictMode>
      </BrowserRouter>
    </ThemeProvider>
  </Provider>
);

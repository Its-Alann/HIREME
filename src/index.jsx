import React from "react";
import "./index.css";
import { render } from "react-dom";
import App from "./App";
import { AuthContextProvider } from "./context/AuthContext";

const rootNode = document.getElementById("root");
render(
  <AuthContextProvider>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </AuthContextProvider>,
  rootNode
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals

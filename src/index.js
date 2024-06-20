import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import AuthContext from "./components/authContext/AuthContext";
import { BrowserRouter } from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <AuthContext>
    <BrowserRouter basename={process.env.PUBLIC_URL}>
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </BrowserRouter>
  </AuthContext>,
);

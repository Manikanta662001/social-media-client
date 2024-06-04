import React, { useMemo } from "react";
import { BrowserRouter, Navigate, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/loginPage/index";
import HomePage from "./pages/homePage/index";
import ProfilePage from "./pages/profilePage/index";
import { useSelector } from "react-redux";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { themeSettings } from "./theme";
import state from "./state";
function App() {
  const mode = useSelector((state) => state.mode);
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  const isAuthenticated = Boolean(useSelector((state) => state.token));
  return (
    <div className="app">
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route
              path="/home"
              element={isAuthenticated ? <HomePage /> : <Navigate to={"/"} />}
            />
            <Route
              path="/profile/:userId"
              element={
                isAuthenticated ? <ProfilePage /> : <Navigate to={"/"} />
              }
            />
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;

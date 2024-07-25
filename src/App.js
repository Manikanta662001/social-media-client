import React, { useEffect, useMemo } from "react";
import { Navigate, Routes, Route, useNavigate } from "react-router-dom";
import LoginPage from "./pages/loginPage/index";
import HomePage from "./pages/homePage/index";
import ProfilePage from "./pages/profilePage/index";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { createTheme } from "@mui/material/styles";
import { themeSettings } from "./theme";
import { useUserContext } from "./components/authContext/AuthContext";
import { getTokenFromCookie } from "./utils/utils";
import { BE_URL } from "./utils/constants";
import ChatPage from "./pages/chatpage";

function App() {
  const { mode, isLogedIn, setUser, setIsLogedIn } = useUserContext();
  const theme = useMemo(() => createTheme(themeSettings(mode)), [mode]);
  const navigate = useNavigate();
  const getUser = async () => {
    try {
      const response = await fetch(BE_URL + `/getUser`, {
        method: "GET",
        headers: { Authorization: `Bearer ${getTokenFromCookie()}` },
      });
      const userData = await response.json();
      if (!response.ok) {
        throw new Error(userData.error);
      }
      if (userData) {
        setUser(userData);
        setIsLogedIn(true);
        navigate("/home");
      }
    } catch (error) {
      console.error(error?.message);
    }
  };
  useEffect(() => {
    getUser();
  }, []);
  return (
    <div className="app">
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route
            path="/home"
            element={isLogedIn ? <HomePage /> : <Navigate to={"/"} />}
          />
          <Route
            path="/profile/:userId"
            element={isLogedIn ? <ProfilePage /> : <Navigate to={"/"} />}
          />
          <Route
            path="/chat"
            element={isLogedIn ? <ChatPage /> : <Navigate to={"/"} />}
          />
        </Routes>
      </ThemeProvider>
    </div>
  );
}

export default App;

import React, { createContext, useContext, useState } from "react";
import io from "socket.io-client";
import { BE_URL } from "../../utils/constants";
//for local
const socket = io("http://localhost:5000");
//for live
// const socket = io(BE_URL);

const UserContext = createContext();
const AuthContext = ({ children }) => {
  const [mode, setMode] = useState("light");
  const [isLogedIn, setIsLogedIn] = useState(false);
  const [user, setUser] = useState({});
  const [allPosts, setAllPosts] = useState([]);
  const allValues = {
    mode,
    setMode,
    user,
    setUser,
    allPosts,
    setAllPosts,
    isLogedIn,
    setIsLogedIn,
    socket,
  };
  return (
    <div>
      <UserContext.Provider value={allValues}>{children}</UserContext.Provider>
    </div>
  );
};

export default AuthContext;
export const useUserContext = () => useContext(UserContext);

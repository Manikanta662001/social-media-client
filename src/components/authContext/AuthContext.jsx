import React, { createContext, useContext, useState } from "react";

const UserContext = createContext();
const AuthContext = ({ children }) => {
  const [mode, setMode] = useState("light");
  const [isLogedIn, setIsLogedIn] = useState(false);
  const [user, setUser] = useState({});
  const [allposts, setAllPosts] = useState({});
  const allValues = {
    mode,
    setMode,
    user,
    setUser,
    allposts,
    setAllPosts,
    isLogedIn,
    setIsLogedIn,
  };
  return (
    <div>
      <UserContext.Provider value={allValues}>{children}</UserContext.Provider>
    </div>
  );
};

export default AuthContext;
export const useUserContext = () => useContext(UserContext);

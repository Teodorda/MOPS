import React, { useContext, useEffect, useState } from "react";
import axios from "axios";

import { API_URL, USER_JWT_LOCALSTORAGE_KEY } from "./const";

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [userJwt, setUserJwt] = useState();
  const [loading, setLoading] = useState(true);

  const getCurrentUser = (userJwt) => {
    axios
      .post(`${API_URL}/currentUser`, { userJwt: userJwt })
      .then(({ data: user }) => {
        setCurrentUser(user.user);
        setLoading(false);
      })
      .catch((err) => {
        console.log("ERR", err);
        setLoading(false);
      });
  };

  useEffect(() => {
    const currentJwt =
      localStorage.getItem(USER_JWT_LOCALSTORAGE_KEY) ||
      sessionStorage.getItem(USER_JWT_LOCALSTORAGE_KEY);
    if (currentJwt) {
      setUserJwt(currentJwt);

      getCurrentUser(currentJwt);
    } else {
      setLoading(false);
    }
  }, []);

  const login = (newUserJwt, rememberMe = true) => {
    setUserJwt(newUserJwt);
    if (rememberMe) {
      localStorage.setItem(USER_JWT_LOCALSTORAGE_KEY, newUserJwt);
    } else {
      sessionStorage.setItem(USER_JWT_LOCALSTORAGE_KEY, newUserJwt);
    }
    getCurrentUser(newUserJwt);
  };

  const logout = () => {
    setUserJwt(null);
    setCurrentUser(null);
    localStorage.removeItem(USER_JWT_LOCALSTORAGE_KEY);
    sessionStorage.removeItem(USER_JWT_LOCALSTORAGE_KEY);
  };

  const isAdmin = () => {
    return currentUser?.user_metadata?.admin === "true";
  };

  const value = {
    userJwt,
    login,
    logout,
    currentUser,
    isAdmin,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

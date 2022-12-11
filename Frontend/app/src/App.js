import React, { useCallback } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useAuth } from "./AuthContext";

import { Login, Register, Donations, Requests, Profile } from "./pages";

function App() {
  const { userJwt } = useAuth();

  const getRoutes = useCallback(() => {
    if (userJwt) {
      return (
        <>
          <Route exact path="/login" element={<Login />} />
          <Route path="/donations" element={<Donations />} />
          <Route path="/requests" element={<Requests />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="*" element={<Navigate to="/donations" />} />
        </>
      );
    }

    return (
      <>
        <Route exact path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </>
    );
  }, [userJwt]);
  return (
    <Router>
      <Routes>{getRoutes()}</Routes>
    </Router>
  );
}

export default App;

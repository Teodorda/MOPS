import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

import { useAuth } from "../AuthContext";

export default function Nav() {
  const { logout, isAdmin } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const onLogout = () => {
    logout();
    navigate("/login");
  };
  const currentTab = location.pathname.toLowerCase();

  return (
    <nav className="navbar navbar-dark align-items-start sidebar sidebar-dark accordion bg-gradient-primary p-0">
      <div className="container-fluid d-flex flex-column p-0">
        <Link
          className="navbar-brand d-flex justify-content-center align-items-center sidebar-brand m-0"
          to="#"
        >
          <div className="sidebar-brand-icon rotate-n-15">
            <i className="fas fa-hands-helping"></i>
          </div>
          <div className="d-flex flex-column sidebar-brand-text mx-1">
            <span>Helping Hands</span>
            {isAdmin() && <span className="badge badge-dark">Admin</span>}
          </div>
        </Link>
        <hr className="sidebar-divider my-0" />
        <ul className="nav navbar-nav text-light" id="accordionSidebar">
          <li className="nav-item" role="presentation">
            <Link
              className={`nav-link ${
                currentTab === "/profile" ? "active" : ""
              }`}
              to="/profile"
            >
              <i className="fas fa-user"></i>
              <span>Profil</span>
            </Link>
          </li>
          <li className="nav-item" role="presentation">
            <Link
              className={`nav-link ${
                currentTab === "/donations" ? "active" : ""
              }`}
              to="/donations"
            >
              <i className="fas fa-table"></i>
              <span>Produse</span>
            </Link>
          </li>
          <li className="nav-item" role="presentation">
            <Link
              className={`nav-link ${
                currentTab === "/requests" ? "active" : ""
              }`}
              to="/requests"
            >
              <i className="fas fa-table"></i>
              <span>Cerere</span>
            </Link>
          </li>
          <li className="nav-item" role="presentation" style={{padding: '10px', boxSizing: 'border-box'}}>
            <button className="btn btn-warning text-dark nav-link w-100" onClick={onLogout}>
              <i className="fas fa-user text-dark"></i>
              <span>Signout</span>
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
}

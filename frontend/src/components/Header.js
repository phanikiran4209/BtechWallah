import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./Header.css";

const Header = () => {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="logo">
          <h1>📊 Freelancer PM</h1>
        </div>
        <nav className="nav">
          <Link 
            to="/" 
            className={`nav-link ${isActive('/') ? 'active' : ''}`}
          >
            Dashboard
          </Link>
          <Link 
            to="/clients" 
            className={`nav-link ${isActive('/clients') ? 'active' : ''}`}
          >
            Clients
          </Link>
          <Link 
            to="/projects" 
            className={`nav-link ${isActive('/projects') ? 'active' : ''}`}
          >
            Projects
          </Link>
          <Link 
            to="/invoices" 
            className={`nav-link ${isActive('/invoices') ? 'active' : ''}`}
          >
            Invoices
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;
import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "../Home.css";

const Home: React.FC = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <>
      <header>
        <nav className="navbar">
          <Link to="/" className="navbar-brand">
            Home
          </Link>
          {user ? (
            <div className="dropdown">
              <button
                className="btn btn-secondary dropdown-toggle"
                type="button"
                id="dropdownMenuButton"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                {user.first_name}
              </button>
              <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                <Link to="/shoppinglist" className="dropdown-item">
                  Shopping List
                </Link>
                <button className="dropdown-item" onClick={logout}>
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <Link to="/login" className="nav-link">
              Login
            </Link>
          )}
        </nav>
      </header>
      <main>
        <h1>Welcome to the Home page</h1>
      </main>
    </>
  );
};

export default Home;

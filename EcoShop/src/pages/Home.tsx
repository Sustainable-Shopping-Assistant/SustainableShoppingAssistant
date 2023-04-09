import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "../Home.css";

const Home: React.FC = () => {
  const { user, logout } = useContext(AuthContext);
  const [showDropdown, setShowDropdown] = useState(false);

  const handleToggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  const handleHideDropdown = () => {
    setShowDropdown(false);
  };

  return (
    <>
      <header>
        <nav className="navbar">
          <Link to="/" className="navbar-brand">
            Home
          </Link>
          <div className="auth-links">
            {user ? (
              <div className="dropdown">
                <button
                  className="btn btn-secondary dropdown-toggle"
                  type="button"
                  id="dropdownMenuButton"
                  data-toggle="dropdown"
                  aria-haspopup="true"
                  aria-expanded="false"
                  onClick={handleToggleDropdown}
                >
                  {user.first_name} ▼ <span className="caret"></span>
                </button>
                {showDropdown && (
                  <div className="dropdown-menu" aria-labelledby="dropdownMenuButton">
                    <Link to="/shoppinglist" className="dropdown-item" onClick={handleHideDropdown}>
                      Shopping List
                    </Link>
                  </div>
                )}
              </div>
            ) : (
              <><Link to="/signup" className="auth-link">
                  Sign up
                </Link><Link to="/login" className="auth-link">
                    Log in
                  </Link></>
            )}
            {user && (
              <button className="btn btn-primary ml-auto" onClick={logout}>
                Log out
              </button>
            )}
          </div>
        </nav>
      </header>
      <main>
        <h1>Welcome to the Home page</h1>
      </main>
    </>
  );
};

export default Home;

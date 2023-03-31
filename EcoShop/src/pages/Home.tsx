import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import "../Home.css";

const Home: React.FC = () => {
  const { user, logout } = useContext(AuthContext);
  return (
    <>
      <header>
        <nav>
          <Link to="/">Home</Link>
          {user ? (
            <div className="user-nav">
              <span>{user.first_name}</span>
              <button onClick={logout}>Logout</button>
            </div>
          ) : (
            <Link to="/login">Login</Link>
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

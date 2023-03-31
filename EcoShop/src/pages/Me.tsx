import axios from "axios";
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

const url = "http://localhost:8080";

interface IUser {
  name: string;
  email: string;
}

const Me = () => {
  const [user, setUser] = useState<IUser | null>(null);
  const { authenticated, loading } = useAuth();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${url}/me`, {
          headers: { Authorization: `Bearer ${Cookies.get("jwt")}` },
        });
        const { user } = res.data;
        setUser(user);
      } catch (err) {
        console.error(err);
      }
    };

    if (authenticated && !loading) {
      fetchUser();
    }
  }, [authenticated, loading]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!authenticated) {
    return <div>You must be logged in to view this page.</div>;
  }

  return (
    <div>
      <h1>Your Profile</h1>
      {user ? (
        <>
          <p>Name: {user.name}</p>
          <p>Email: {user.email}</p>
        </>
      ) : (
        <div>Loading user data...</div>
      )}
    </div>
  );
};

export default Me;

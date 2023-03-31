import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Logout = () => {
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!currentUser) {
      setLoading(true);
      navigate("/login");
    } else {
      setLoading(false);
    }
  }, [currentUser, navigate]);

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logout();
      setLoading(false);
      navigate("/");
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Logout</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <>
          <p>Are you sure you want to logout?</p>
          <button onClick={handleLogout} disabled={loading}>
            Logout
          </button>
        </>
      )}
    </div>
  );
};

export default Logout;

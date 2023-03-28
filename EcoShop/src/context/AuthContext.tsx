import { createContext, useState, useEffect, useContext, ReactNode } from "react";
import Cookies from "js-cookie";
import axios from "axios";

interface IUser {
  name: string;
  email: string;
}

interface IAuthContext {
  user: IUser | null;
  authenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  children: ReactNode;
}

const AuthContext = createContext<IAuthContext>({
  user: null,
  authenticated: false,
  loading: true,
  login: () => Promise.resolve(),
  logout: () => {},
  children: null
});

const AuthProvider = ({ children }: IAuthContext) => {
  const [user, setUser] = useState<IUser | null>(null);
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = Cookies.get("jwt");

    if (!token) {
      setLoading(false);
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await axios.get("/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const { user } = res.data;

        setUser(user);
        setAuthenticated(true);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await axios.post("/api/auth/login", { email, password });
      const { token } = res.data;

      // Store the JWT in a cookie with a 1-day expiry
      Cookies.set("jwt", token, { expires: 1 });

      const userRes = await axios.get("/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const { user } = userRes.data;

      setUser(user);
      setAuthenticated(true);
    } catch (err) {
      console.error(err);
    }
  };

  const logout = () => {
    Cookies.remove("jwt");
    setUser(null);
    setAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{ user, authenticated, loading, login, logout, children }}
    >
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};

export { AuthProvider, useAuth, AuthContext };

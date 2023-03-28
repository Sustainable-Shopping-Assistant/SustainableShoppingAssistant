import { useContext } from "react";
import { Route, Navigate, RouteProps } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const PrivateRoute: React.FC<RouteProps> = ({ path, element }) => {
  const { authenticated } = useContext(AuthContext);

  if (authenticated) {
    return <Route path={path} element={element} />;
  }
  return <Navigate to="/login" />;
};

export default PrivateRoute;

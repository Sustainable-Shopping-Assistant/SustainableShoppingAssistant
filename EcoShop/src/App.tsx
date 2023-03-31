/**
 * 1. The AuthProvider wraps the entire app, providing access to the authentication context throughout the application.
 * 2. The Router component wraps the MainLayout component, enabling routing functionality.
 * 3. The MainLayout component wraps the Switch component, which is responsible for rendering the appropriate route based on the current URL.
 * 4. The Route components inside the Switch component define the paths and corresponding components to render for each path.
 * 5. The PrivateRoute component is used to protect the Protected page, ensuring that only authenticated users can access it.
 */

import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import PrivateRoute from "./components/PrivateRoute";
import MainLayout from "./layouts/MainLayout";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Me from "./pages/Me";
import Protected from "./pages/Protected";

const App: React.FC = () => {
  return (
    <AuthProvider user={null} authenticated={false} loading={false} login={function (_email: string, _password: string): Promise<void> {
      throw new Error("Function not implemented.");
    } } logout={function (): void {
      throw new Error("Function not implemented.");
    } }>
      <Router>
        <MainLayout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/me" element={<Me />} />
            <Route
              path="/protected"
              element={<PrivateRoute element={<Protected />} />}
            />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </MainLayout>
      </Router>
    </AuthProvider>
  );
};

export default App;

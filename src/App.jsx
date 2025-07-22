import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import SidebarMainMenu from "./components/Sidebar/SidebarMainMenu";
import Dashboard from "./pages/Dashboard";
import AllProducts from "./pages/AllProducts";
import Categories from "./pages/Categories";
import KanbanBoards from "./pages/KanbanBoards";
import AuthPage from "./pages/AuthPage";
import { AuthProvider, useAuth } from "./context/AuthContext";

const PrivateRoute = ({ children }) => {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <PrivateRoute>
        <SidebarMainMenu />
      </PrivateRoute>

      <Routes>
        <Route path="/login" element={<AuthPage />} />

        <Route
          path="/"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />

        <Route
          path="/kanban-board"
          element={
            <PrivateRoute>
              <KanbanBoards />
            </PrivateRoute>
          }
        />

        <Route
          path="/products"
          element={
            <PrivateRoute>
              <AllProducts />
            </PrivateRoute>
          }
        />

        <Route
          path="/category"
          element={
            <PrivateRoute>
              <Categories />
            </PrivateRoute>
          }
        />
      </Routes>
    </AuthProvider>
  );
}

export default App;

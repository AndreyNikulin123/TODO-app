import React from "react";
import { useAuth } from "./hooks/useAuth";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthProvider";
import { LoginPage } from "./pages/login-page/LoginPage";
import HomePage from "./pages/home-page/HomePage";

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!import.meta.env.VITE_ENABLE_AUTH) return <>{children}</>;

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/"
            element={<ProtectedRoute>{<HomePage />}</ProtectedRoute>}
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;

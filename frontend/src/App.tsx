import React, { Suspense, lazy } from 'react';
import { useAuth } from './hooks/useAuth';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider } from './context/AuthProvider';
import { LoadingFallback } from './shared/ui/LoadingFallback';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const LoginPage = lazy(() =>
  import('./pages/login-page/LoginPage').then((m) => ({
    default: m.LoginPage,
  })),
);
const HomePage = lazy(() =>
  import('./pages/home-page/HomePage').then((m) => ({ default: m.HomePage })),
);

const RegisterPage = lazy(() =>
  import('./pages/register-page/RegisterPage').then((m) => ({
    default: m.RegisterPage,
  })),
);

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingFallback />;
  }

  if (!import.meta.env.VITE_ENABLE_AUTH) {
    return <>{children}</>;
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route
                path="/"
                element={<ProtectedRoute>{<HomePage />}</ProtectedRoute>}
              />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;

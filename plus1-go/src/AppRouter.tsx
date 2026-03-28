import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useEffect } from 'react';
import { isAuthenticated } from './lib/auth';
import App from './App';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';

// Protected Route Component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  if (!isAuthenticated()) {
    // Redirect to unified login page (outside /go path)
    useEffect(() => {
      window.location.href = '/login?platform=go';
    }, []);
    return <div className="min-h-screen flex items-center justify-center">Redirecting to login...</div>;
  }
  return <>{children}</>;
}

export default function AppRouter({ basename = '' }: { basename?: string }) {
  return (
    <BrowserRouter basename={basename}>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<App />} />
        
        {/* Login/Register - redirect to unified pages (outside /go) */}
        <Route 
          path="/login" 
          element={
            <RedirectComponent url="/login?platform=go" message="Redirecting to login..." />
          } 
        />
        <Route 
          path="/register" 
          element={
            <RedirectComponent url="/register?platform=go" message="Redirecting to registration..." />
          } 
        />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />

        {/* Catch all - redirect to home */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
}

// Helper component for redirects
function RedirectComponent({ url, message }: { url: string; message: string }) {
  useEffect(() => {
    window.location.href = url;
  }, [url]);
  
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-gray-600">{message}</p>
      </div>
    </div>
  );
}

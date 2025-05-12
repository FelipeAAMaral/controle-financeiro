
import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import Login from "./pages/auth/Login";
import AuthCallback from "./pages/auth/AuthCallback";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import MainLayout from "./components/layout/MainLayout";
import Perfil from "./pages/Perfil";
import ForgotPassword from "./pages/auth/ForgotPassword";
import Register from "./pages/auth/Register";
import Dashboard from "./pages/Dashboard";
import NotFound from "./pages/NotFound";

// Add a loading component to use with lazy loading
const LoadingFallback = () => (
  <div className="flex items-center justify-center min-h-screen p-6 bg-gray-50">
    <div className="w-full max-w-md space-y-4">
      <Skeleton className="h-12 w-full rounded-lg" />
      <Skeleton className="h-32 w-full rounded-lg" />
      <div className="grid grid-cols-3 gap-4">
        <Skeleton className="h-24 rounded-lg" />
        <Skeleton className="h-24 rounded-lg" />
        <Skeleton className="h-24 rounded-lg" />
      </div>
    </div>
  </div>
);

const AppRoutes = () => {
  return (
    <Routes>
      {/* Auth Routes - Public */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/auth/callback" element={<AuthCallback />} />
      
      {/* Protected Routes - Require Authentication */}
      <Route path="/" element={
        <ProtectedRoute>
          <MainLayout>
            <Dashboard />
          </MainLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/perfil" element={
        <ProtectedRoute>
          <MainLayout>
            <Perfil />
          </MainLayout>
        </ProtectedRoute>
      } />
      
      {/* Add other protected routes following the same pattern */}
      
      {/* 404 - Not Found Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;

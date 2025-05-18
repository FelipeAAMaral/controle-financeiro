import { Route, Routes } from "react-router-dom";
import { lazy, Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import Login from "./pages/auth/Login";
import AuthCallback from "./pages/auth/AuthCallback";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import MainLayout from "./components/layout/MainLayout";
import Perfil from "./pages/Perfil";
import ForgotPassword from "./pages/auth/ForgotPassword";
import Register from "./pages/auth/Register";
import Home from "./pages/Dashboard";
import NotFound from "./pages/NotFound";
import ControleMensal from "./pages/ControleMensal";
import Indicadores from "./pages/Indicadores";
import GastosRecorrentes from "./pages/GastosRecorrentes";
import NovoGastoRecorrente from "./pages/NovoGastoRecorrente";
import Objetivos from "./pages/Objetivos";
import EditarObjetivo from "./pages/EditarObjetivo";
import Transacoes from "./pages/Transacoes";
import Viagens from "./pages/Viagens";
import Configuracoes from "./pages/Configuracoes";
import SaudeFin from "./pages/SaudeFin";
import InvestimentosDashboard from "./pages/InvestimentosDashboard";
import DatabaseSetup from "./pages/DatabaseSetup";
import TestDb from "./pages/TestDb";

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
  // Add console log to check routes rendering
  console.log("Rendering AppRoutes component");
  
  return (
    <Routes>
      {/* Auth Routes - Public */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/auth/callback" element={<AuthCallback />} />
      
      {/* Test Routes */}
      <Route path="/test-db" element={<TestDb />} />
      
      {/* Database Setup */}
      <Route path="/database-setup" element={
        <ProtectedRoute>
          <MainLayout>
            <DatabaseSetup />
          </MainLayout>
        </ProtectedRoute>
      } />
      
      {/* Protected Routes - Require Authentication */}
      <Route path="/" element={
        <ProtectedRoute>
          <MainLayout>
            <Home />
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
      
      <Route path="/controle-mensal" element={
        <ProtectedRoute>
          <MainLayout>
            <ControleMensal />
          </MainLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/indicadores" element={
        <ProtectedRoute>
          <MainLayout>
            <Indicadores />
          </MainLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/gastos-recorrentes" element={
        <ProtectedRoute>
          <MainLayout>
            <GastosRecorrentes />
          </MainLayout>
        </ProtectedRoute>
      } />

      <Route path="/gastos-recorrentes/novo" element={
        <ProtectedRoute>
          <MainLayout>
            <NovoGastoRecorrente />
          </MainLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/objetivos" element={
        <ProtectedRoute>
          <MainLayout>
            <Objetivos />
          </MainLayout>
        </ProtectedRoute>
      } />
      
      {/* Add route for editing objectives */}
      <Route path="/objetivos/editar/:id" element={
        <ProtectedRoute>
          <MainLayout>
            <EditarObjetivo />
          </MainLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/transacoes" element={
        <ProtectedRoute>
          <MainLayout>
            <Transacoes />
          </MainLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/viagens" element={
        <ProtectedRoute>
          <MainLayout>
            <Viagens />
          </MainLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/saude-financeira" element={
        <ProtectedRoute>
          <MainLayout>
            <SaudeFin />
          </MainLayout>
        </ProtectedRoute>
      } />
      
      {/* New Investimentos route */}
      <Route path="/investimentos" element={
        <ProtectedRoute>
          <MainLayout>
            <InvestimentosDashboard />
          </MainLayout>
        </ProtectedRoute>
      } />
      
      <Route path="/configuracoes" element={
        <ProtectedRoute>
          <MainLayout>
            <Configuracoes />
          </MainLayout>
        </ProtectedRoute>
      } />
      
      {/* 404 - Not Found Route */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;

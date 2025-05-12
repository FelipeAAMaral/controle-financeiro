import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuthProvider } from "@/hooks/useAuth";
import MainLayout from "@/components/layout/MainLayout";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

// Páginas
import Dashboard from "./pages/Dashboard";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import AuthCallback from "./pages/auth/AuthCallback";
import NotFound from "./pages/NotFound";

// Placeholder para páginas futuras
import ControleMensal from "./pages/ControleMensal";
import Indicadores from "./pages/Indicadores";
import GastosRecorrentes from "./pages/GastosRecorrentes";
import Objetivos from "./pages/Objetivos";
import Transacoes from "./pages/Transacoes";
import Perfil from "./pages/Perfil";
import Configuracoes from "./pages/Configuracoes";

// Páginas de Viagens
import Viagens from "./pages/Viagens";
import NovaViagem from "./pages/NovaViagem";
import EditarViagem from "./pages/EditarViagem";
import DetalhesViagem from "./pages/DetalhesViagem";
import PlanejamentoGastos from "./pages/PlanejamentoGastos";

const queryClient = new QueryClient();

const App = () => {
  const { AuthProvider } = useAuthProvider();
  
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <TooltipProvider>
            <MainLayout>
              <Routes>
                {/* Rotas públicas */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/auth/callback" element={<AuthCallback />} />
                
                {/* Rotas protegidas */}
                <Route 
                  path="/" 
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  } 
                />
                {/* Redirect saude-financeira to home */}
                <Route 
                  path="/saude-financeira" 
                  element={
                    <ProtectedRoute>
                      <Navigate to="/" replace />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/controle-mensal" 
                  element={
                    <ProtectedRoute>
                      <ControleMensal />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/indicadores" 
                  element={
                    <ProtectedRoute>
                      <Indicadores />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/gastos-recorrentes" 
                  element={
                    <ProtectedRoute>
                      <GastosRecorrentes />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/objetivos" 
                  element={
                    <ProtectedRoute>
                      <Objetivos />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/transacoes" 
                  element={
                    <ProtectedRoute>
                      <Transacoes />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/perfil" 
                  element={
                    <ProtectedRoute>
                      <Perfil />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/configuracoes" 
                  element={
                    <ProtectedRoute>
                      <Configuracoes />
                    </ProtectedRoute>
                  } 
                />
                
                {/* Rotas de Viagens */}
                <Route 
                  path="/viagens" 
                  element={
                    <ProtectedRoute>
                      <Viagens />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/viagens/nova" 
                  element={
                    <ProtectedRoute>
                      <NovaViagem />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/viagens/:id" 
                  element={
                    <ProtectedRoute>
                      <DetalhesViagem />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/viagens/editar/:id" 
                  element={
                    <ProtectedRoute>
                      <EditarViagem />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/viagens/:id/planejamento-gastos" 
                  element={
                    <ProtectedRoute>
                      <PlanejamentoGastos />
                    </ProtectedRoute>
                  } 
                />
                
                {/* Rota padrão para páginas não encontradas */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </MainLayout>
            <Toaster />
            <Sonner />
          </TooltipProvider>
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

export default App;

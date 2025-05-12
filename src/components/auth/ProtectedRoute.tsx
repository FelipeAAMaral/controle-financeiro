
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

interface ProtectedRouteProps {
  children: JSX.Element;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading, session } = useAuth();
  const location = useLocation();
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [hasCheckedTokens, setHasCheckedTokens] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      console.log("ProtectedRoute - Checking session status", { 
        hasUser: !!user, 
        hasSession: !!session, 
        path: location.pathname 
      });
      
      // Verifica se há um token na URL (para casos de redirecionamento após autenticação externa)
      const params = new URLSearchParams(location.search);
      const accessToken = params.get('access_token');
      const refreshToken = params.get('refresh_token');
      
      if (accessToken && refreshToken) {
        console.log("ProtectedRoute - Tokens encontrados na URL, atualizando sessão");
        try {
          // Atualiza a sessão com os tokens da URL
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken
          });
          
          if (error) {
            console.error("Erro ao atualizar sessão:", error);
          } else {
            // Remove os tokens da URL por segurança
            window.history.replaceState({}, document.title, location.pathname);
            
            // Força um recarregamento da sessão para atualizar o contexto de autenticação
            const { data } = await supabase.auth.getSession();
            if (data.session) {
              console.log("ProtectedRoute - Sessão atualizada com sucesso após token na URL");
            }
          }
        } catch (err) {
          console.error("Erro ao processar tokens:", err);
        }
      }
      
      setHasCheckedTokens(true);
    };
    
    checkSession();
  }, [location, user, session]);

  // Combine loading states
  const isLoading = loading || (!hasCheckedTokens && !user);

  // Add debug logs
  console.log("ProtectedRoute - Current state:", { 
    user: !!user, 
    loading, 
    session: !!session, 
    isCheckingSession, 
    hasCheckedTokens,
    path: location.pathname 
  });

  // Show a loading state while checking authentication
  if (isLoading) {
    console.log("ProtectedRoute - Loading auth state");
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
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
  }

  // Redirect to login if user is not authenticated
  if (!session || !user) {
    console.log("ProtectedRoute - Not authenticated, redirecting to login");
    // Save current path for redirect after login
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // If authenticated, render the children
  console.log("ProtectedRoute - User authenticated, rendering protected content");
  return children;
};

export default ProtectedRoute;

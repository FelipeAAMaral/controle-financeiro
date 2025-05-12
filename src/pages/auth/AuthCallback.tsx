
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

export default function AuthCallback() {
  const navigate = useNavigate();
  const location = useLocation();
  const { fetchUserProfile } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [processing, setProcessing] = useState(true);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        console.log("Auth callback processing");
        setProcessing(true);
        
        // Check for hash params (used by some OAuth providers)
        const hashParams = new URLSearchParams(location.hash.substring(1));
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');
        
        // If tokens are in the hash, set them
        if (accessToken && refreshToken) {
          console.log("Auth callback - tokens found in hash, setting session");
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken
          });
          
          if (error) {
            console.error("Error setting session from hash:", error);
            throw error;
          }
          
          // Clear hash for security
          window.history.replaceState({}, document.title, window.location.pathname);
        }
        
        // Get current session
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error during auth callback:", error);
          setError("Falha na autenticação");
          toast.error("Falha na autenticação. Por favor, tente novamente.");
          setTimeout(() => navigate("/login"), 1500);
          return;
        }
        
        if (data.session) {
          console.log("Auth callback successful, session obtained");
          
          // Extrai o 'from' state do localStorage se existir
          let redirectTo = "/";
          const storedRedirectPath = localStorage.getItem("auth_redirect_path");
          
          if (storedRedirectPath) {
            redirectTo = storedRedirectPath;
            console.log("Redirecting to saved path:", redirectTo);
            // Limpa o caminho de redirecionamento após uso
            localStorage.removeItem("auth_redirect_path");
          }
          
          if (data.session.user) {
            try {
              await fetchUserProfile(data.session.user.id);
            } catch (err) {
              console.error("Error fetching user profile:", err);
            }
          }
          
          toast.success("Login realizado com sucesso!");
          navigate(redirectTo);
        } else {
          console.log("Auth callback processed but no session");
          navigate("/login");
        }
      } catch (err) {
        console.error("Unexpected error:", err);
        setError("Ocorreu um erro inesperado");
        toast.error("Ocorreu um erro inesperado. Por favor, tente novamente.");
        navigate("/login");
      } finally {
        setProcessing(false);
      }
    };

    handleAuthCallback();
  }, [navigate, fetchUserProfile, location.hash]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Autenticando...</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {processing && (
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        )}
      </div>
    </div>
  );
}

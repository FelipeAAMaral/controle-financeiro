
import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

export default function AuthCallback() {
  const navigate = useNavigate();
  const location = useLocation();
  const { fetchUserProfile } = useAuth();
  const [message, setMessage] = useState("Autenticando...");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        console.log("Auth callback processing");
        
        // Check if there's a hash in the URL (for email confirmations)
        const hashParams = location.hash ? new URLSearchParams(location.hash.substring(1)) : null;
        const accessToken = hashParams?.get('access_token');
        const type = hashParams?.get('type');
        
        if (accessToken && type === 'signup') {
          console.log("Email confirmation detected");
          setMessage("Email confirmado com sucesso! Autenticando...");
          
          // Set session with the provided token
          const { data, error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: hashParams.get('refresh_token') || '',
          });
          
          if (sessionError) {
            console.error("Error setting session:", sessionError);
            setError("Falha ao processar confirmação de email. Tente fazer login manualmente.");
            toast.error("Erro ao confirmar email. Por favor, tente fazer login.");
            setTimeout(() => navigate("/login"), 2000);
            return;
          }
          
          if (data.session) {
            toast.success("Email confirmado com sucesso!");
            // If we have user data, fetch their profile
            if (data.session.user) {
              try {
                await fetchUserProfile(data.session.user.id);
              } catch (err) {
                console.error("Error fetching user profile:", err);
              }
            }
            setTimeout(() => navigate("/"), 1000);
            return;
          }
        }
        
        // Handle normal callback flow (OAuth callbacks)
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error during auth callback:", error);
          setMessage("Falha na autenticação. Redirecionando para login...");
          toast.error("Falha na autenticação. Por favor, tente novamente.");
          setTimeout(() => navigate("/login"), 1500);
          return;
        }
        
        if (data.session) {
          console.log("Auth callback successful, session obtained");
          setMessage("Login realizado com sucesso! Redirecionando...");
          
          // If we have user data, fetch their profile
          if (data.session.user && typeof fetchUserProfile === 'function') {
            try {
              await fetchUserProfile(data.session.user.id);
            } catch (err) {
              console.error("Error fetching user profile:", err);
            }
          }
          
          toast.success("Login realizado com sucesso!");
          setTimeout(() => navigate("/"), 1000);
        } else {
          console.log("Auth callback processed but no session");
          setMessage("Autenticação processada. Redirecionando para login...");
          setTimeout(() => navigate("/login"), 1500);
        }
      } catch (err) {
        console.error("Unexpected error:", err);
        toast.error("Ocorreu um erro inesperado. Por favor, tente novamente.");
        navigate("/login");
      }
    };

    handleAuthCallback();
  }, [navigate, fetchUserProfile, location]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">{message}</h2>
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
      </div>
    </div>
  );
}

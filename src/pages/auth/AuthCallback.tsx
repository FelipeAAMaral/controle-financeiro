
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

export default function AuthCallback() {
  const navigate = useNavigate();
  const { fetchUserProfile } = useAuth();
  const [message, setMessage] = useState("Autenticando...");

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        console.log("Auth callback processing");
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
  }, [navigate, fetchUserProfile]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">{message}</h2>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
      </div>
    </div>
  );
}

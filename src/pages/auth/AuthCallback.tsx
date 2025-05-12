
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export default function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error during auth callback:", error);
          toast.error("Falha na autenticação. Por favor, tente novamente.");
          navigate("/login");
          return;
        }
        
        if (data.session) {
          toast.success("Login realizado com sucesso!");
        }
        
        // Redirect to the home page after successful authentication
        navigate("/");
      } catch (err) {
        console.error("Unexpected error:", err);
        toast.error("Ocorreu um erro inesperado. Por favor, tente novamente.");
        navigate("/login");
      }
    };

    handleAuthCallback();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Autenticando...</h2>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
      </div>
    </div>
  );
}

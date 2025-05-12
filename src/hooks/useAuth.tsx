
import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { Session, User } from "@supabase/supabase-js";

interface AuthUser {
  id: string;
  email: string;
  name: string | null;
  photoURL: string | null;
  provider?: 'email' | 'google';
}

interface AuthContextType {
  user: AuthUser | null;
  session: Session | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (data: Partial<AuthUser>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper function to convert Supabase user to our AuthUser type
const formatUser = (user: User, session: Session | null): AuthUser => {
  const userData = user.user_metadata || {};
  
  return {
    id: user.id,
    email: user.email || '',
    name: userData.name || userData.full_name || user.email?.split('@')[0] || null,
    photoURL: userData.avatar_url || null,
    provider: userData.provider || 'email'
  };
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  // Check for session on component mount
  useEffect(() => {
    const setupSession = async () => {
      try {
        // Get current session
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error("Error getting session:", error);
          return;
        }

        if (data.session) {
          setSession(data.session);
          const { user } = data.session;
          if (user) {
            setUser(formatUser(user, data.session));
          }
        }
      } catch (err) {
        console.error("Unexpected error during session check:", err);
      } finally {
        setLoading(false);
      }
    };

    setupSession();

    // Set up auth state change listener
    const { data } = supabase.auth.onAuthStateChange(async (event, newSession) => {
      if (event === 'SIGNED_IN' && newSession) {
        setSession(newSession);
        setUser(formatUser(newSession.user, newSession));
      } else if (event === 'SIGNED_OUT') {
        setSession(null);
        setUser(null);
      }
    });

    return () => {
      data.subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        setError(error.message);
        toast.error(error.message || "Erro ao fazer login");
        return;
      }

      if (data.user) {
        setUser(formatUser(data.user, data.session));
        setSession(data.session);
        toast.success("Login realizado com sucesso!");
        navigate("/");
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Erro ao fazer login";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });
      
      if (error) {
        setError(error.message);
        toast.error(error.message || "Erro ao fazer login com Google");
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Erro ao fazer login com Google";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      });
      
      if (error) {
        setError(error.message);
        toast.error(error.message || "Erro ao fazer cadastro");
        return;
      }

      if (data.user) {
        toast.success("Cadastro realizado com sucesso! Verifique seu email para confirmar sua conta.");
        navigate("/login");
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Erro ao fazer cadastro";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        toast.error(error.message || "Erro ao fazer logout");
        return;
      }
      
      setUser(null);
      setSession(null);
      toast.success("Logout realizado com sucesso");
      navigate("/login");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Erro ao fazer logout";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      });
      
      if (error) {
        setError(error.message);
        toast.error(error.message || "Erro ao enviar email de redefinição de senha");
        return;
      }
      
      toast.success("Um email com instruções para redefinir sua senha foi enviado");
      navigate("/login");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Erro ao redefinir senha";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (data: Partial<AuthUser>) => {
    try {
      setLoading(true);
      setError(null);
      
      if (!user) {
        throw new Error("Usuário não está logado");
      }
      
      const { error } = await supabase.auth.updateUser({
        data: {
          name: data.name,
          avatar_url: data.photoURL
        }
      });
      
      if (error) {
        setError(error.message);
        toast.error(error.message || "Erro ao atualizar perfil");
        return;
      }
      
      // Update local user state
      setUser({
        ...user,
        ...data
      });
      
      toast.success("Perfil atualizado com sucesso");
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Erro ao atualizar perfil";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    session,
    loading,
    error,
    login,
    loginWithGoogle,
    register,
    logout,
    resetPassword,
    updateProfile
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }
  
  return context;
};

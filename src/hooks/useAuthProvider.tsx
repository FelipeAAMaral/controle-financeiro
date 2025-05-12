
import { ReactNode, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { AuthContext } from "@/contexts/AuthContext";
import { AuthUser } from "@/types/auth";
import { formatUser } from "@/utils/authUtils";

// Create the hook that will provide the Auth functionality
export const useAuthProvider = () => {
  // Create the AuthProvider component that will wrap the app
  const AuthProvider = ({ children }: { children: ReactNode }) => {
    const navigate = useNavigate();
    const [user, setUser] = useState<AuthUser | null>(null);
    const [session, setSession] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Fetch user profile data from the database
    const fetchUserProfile = async (userId: string) => {
      try {
        console.log("Fetching user profile for:", userId);
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();
        
        if (error) {
          console.error("Error fetching user profile:", error);
          // If profile doesn't exist, create it
          if (error.code === 'PGRST116') {
            if (user) {
              await createUserProfile(userId);
            }
          }
          return;
        }
        
        if (data) {
          console.log("Profile data received:", data);
          // Merge database profile with auth user data
          setUser(prevUser => {
            if (!prevUser) return null;
            return {
              ...prevUser,
              name: data.name || prevUser.name,
              photoURL: data.avatar_url || prevUser.photoURL,
            };
          });
        }
      } catch (err) {
        console.error("Error in fetchUserProfile:", err);
      }
    };
    
    // Create user profile in the database if it doesn't exist
    const createUserProfile = async (userId: string) => {
      try {
        if (!user) return;
        
        const { error } = await supabase
          .from('profiles')
          .insert({
            id: userId,
            name: user.name,
            avatar_url: user.photoURL,
            created_at: new Date()
          });
        
        if (error) {
          console.error("Error creating user profile:", error);
        }
      } catch (err) {
        console.error("Error in createUserProfile:", err);
      }
    };

    // Check for session on component mount
    useEffect(() => {
      const setupSession = async () => {
        try {
          console.log("Setting up session...");
          setLoading(true);
          
          // Get current session
          const { data, error } = await supabase.auth.getSession();
          
          if (error) {
            console.error("Error getting session:", error);
            setLoading(false);
            return;
          }

          console.log("Session check result:", data.session ? "Session exists" : "No session");

          if (data.session) {
            setSession(data.session);
            const { user: authUser } = data.session;
            if (authUser) {
              const formattedUser = formatUser(authUser, data.session);
              console.log("Setting user from session:", formattedUser);
              setUser(formattedUser);
              
              // Fetch additional user data from database
              await fetchUserProfile(formattedUser.id);
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
        console.log("Auth state changed:", event, newSession ? "with session" : "no session");
        
        if (event === 'SIGNED_IN' && newSession) {
          console.log("SIGNED_IN event detected, updating user state");
          setSession(newSession);
          const authUser = formatUser(newSession.user, newSession);
          setUser(authUser);
          
          // Fetch additional user data from database
          await fetchUserProfile(authUser.id);
        } else if (event === 'SIGNED_OUT') {
          console.log("User signed out, clearing session and user data");
          setSession(null);
          setUser(null);
          
          // Limpa também o caminho de redirecionamento salvo
          localStorage.removeItem("auth_redirect_path");
        } else if (event === 'TOKEN_REFRESHED' && newSession) {
          // Importante para manter a sessão ativa
          console.log("Token refreshed, updating session");
          setSession(newSession);
          // Re-verify user on token refresh to ensure data is current
          const authUser = formatUser(newSession.user, newSession);
          setUser(authUser);
        }
      });

      return () => {
        data.subscription.unsubscribe();
      };
    }, []);

    // Basic auth methods
    const login = async (email: string, password: string) => {
      try {
        setLoading(true);
        setError(null);
        
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        
        if (error) {
          setError(error.message);
          toast.error(error.message || "Erro ao fazer login");
          throw error;
        }

        if (data.user) {
          const authUser = formatUser(data.user, data.session);
          setUser(authUser);
          setSession(data.session);
          await fetchUserProfile(authUser.id);
          toast.success("Login realizado com sucesso!");
          
          // Verifica se há um caminho de redirecionamento salvo
          const redirectTo = localStorage.getItem("auth_redirect_path") || "/";
          navigate(redirectTo);
          
          // Limpa o caminho após o redirecionamento
          if (localStorage.getItem("auth_redirect_path")) {
            localStorage.removeItem("auth_redirect_path");
          }
        }
      } catch (error: any) {
        console.error("Login error:", error);
      } finally {
        setLoading(false);
      }
    };

    // Other auth methods
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
      } catch (error: any) {
        console.error("Google login error:", error);
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
        
        const origin = window.location.origin;
        
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { name },
            emailRedirectTo: `${origin}/auth/callback`,
          }
        });
        
        if (error) {
          setError(error.message);
          toast.error(error.message || "Erro ao fazer cadastro");
          return;
        }

        if (data.user) {
          if (!data.session) {
            toast.success("Cadastro realizado com sucesso! Verifique seu email para confirmar sua conta.");
            navigate("/login", { state: { emailConfirmationPending: true, email } });
            return;
          }
          
          if (data.session) {
            const authUser = formatUser(data.user, data.session);
            setUser(authUser);
            setSession(data.session);
            await createUserProfile(data.user.id);
            toast.success("Cadastro realizado com sucesso!");
            navigate("/");
          } 
        }
      } catch (error: any) {
        console.error("Registration error:", error);
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
        
        // Limpa o caminho de redirecionamento salvo
        localStorage.removeItem("auth_redirect_path");
        
        toast.success("Logout realizado com sucesso");
        navigate("/login");
      } catch (error: any) {
        console.error("Logout error:", error);
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
      } catch (error: any) {
        console.error("Password reset error:", error);
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
        
        // Update user metadata in auth
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
        
        // Also update the profiles table
        const { error: profileError } = await supabase
          .from('profiles')
          .update({
            name: data.name,
            avatar_url: data.photoURL
          })
          .eq('id', user.id);
          
        if (profileError) {
          console.error("Error updating profile in database:", profileError);
        }
        
        // Update local user state
        setUser({
          ...user,
          ...data
        });
        
        toast.success("Perfil atualizado com sucesso");
      } catch (error: any) {
        console.error("Profile update error:", error);
        const errorMessage = error instanceof Error ? error.message : "Erro ao atualizar perfil";
        setError(errorMessage);
        toast.error(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    // Return the AuthContext provider with all authentication functions
    return (
      <AuthContext.Provider 
        value={{
          user,
          session,
          loading,
          error,
          login,
          loginWithGoogle,
          register,
          logout,
          resetPassword,
          updateProfile,
          fetchUserProfile
        }}
      >
        {children}
      </AuthContext.Provider>
    );
  };

  return { AuthProvider };
};

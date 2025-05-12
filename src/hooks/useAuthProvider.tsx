
import { ReactNode, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";
import { AuthContext } from "@/contexts/AuthContext";
import { AuthUser, AuthContextType } from "@/types/auth";
import { formatUser } from "@/utils/authUtils";
import { Session } from "@supabase/supabase-js";

// Create the hook that will provide the Auth functionality
export const useAuthProvider = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Fetch user profile data from the database
  const fetchUserProfile = async (userId: string) => {
    try {
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
        // Merge database profile with auth user data
        setUser(prevUser => {
          if (!prevUser) return null;
          return {
            ...prevUser,
            name: data.name || prevUser.name,
            photoURL: data.avatar_url || prevUser.photoURL,
            // Add any other profile fields you want to include
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
            const authUser = formatUser(user, data.session);
            setUser(authUser);
            
            // Fetch additional user data from database
            await fetchUserProfile(authUser.id);
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
      console.log("Auth state changed:", event, newSession?.user?.email);
      if (event === 'SIGNED_IN' && newSession) {
        setSession(newSession);
        const authUser = formatUser(newSession.user, newSession);
        setUser(authUser);
        
        // Fetch additional user data from database
        await fetchUserProfile(authUser.id);
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
      
      console.log("Attempting login with:", email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      
      if (error) {
        console.error("Login error:", error);
        setError(error.message);
        toast.error(error.message || "Erro ao fazer login");
        return;
      }

      if (data.user) {
        console.log("Login successful for:", data.user.email);
        const authUser = formatUser(data.user, data.session);
        setUser(authUser);
        setSession(data.session);
        
        // Fetch additional user data from database
        await fetchUserProfile(authUser.id);
        
        toast.success("Login realizado com sucesso!");
        navigate("/");
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Erro ao fazer login";
      console.error("Login exception:", errorMessage);
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
      
      const { error, data } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });
      
      if (error) {
        console.error("Google login error:", error);
        setError(error.message);
        toast.error(error.message || "Erro ao fazer login com Google");
        
        // Re-throw the error so the component can handle it specifically
        throw error;
      }
      
      // No need to set user/session here as the redirect will happen
      // and the auth state change listener will handle it
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Erro ao fazer login com Google";
      setError(errorMessage);
      toast.error(errorMessage);
      throw error; // Re-throw to allow component-level handling
    } finally {
      setLoading(false);
    }
  };

  const register = async (email: string, password: string, name: string) => {
    try {
      setLoading(true);
      setError(null);
      
      console.log("Attempting registration for:", email);
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
          // Configure redirection
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        }
      });
      
      if (error) {
        console.error("Registration error:", error);
        setError(error.message);
        toast.error(error.message || "Erro ao fazer cadastro");
        return;
      }

      if (data.user) {
        console.log("Registration successful, user created:", data.user.email);
        
        // Se o usuário tiver uma sessão, ele será logado automaticamente
        if (data.session) {
          console.log("User session available, user signed in automatically");
          const authUser = formatUser(data.user, data.session);
          setUser(authUser);
          setSession(data.session);
          
          // Create user profile in database
          await createUserProfile(data.user.id);
          
          toast.success("Cadastro realizado com sucesso! Você foi conectado automaticamente.");
          navigate("/");
        } else {
          // Tentar fazer login automático após o registro
          console.log("No session after registration, attempting automatic login");
          await login(email, password);
        }
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Erro ao fazer cadastro";
      console.error("Registration exception:", errorMessage);
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

  // Return the AuthProvider component and all authentication functions
  const AuthProvider = ({ children }: { children: ReactNode }) => {
    const value: AuthContextType = {
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
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
  };

  return { AuthProvider };
};

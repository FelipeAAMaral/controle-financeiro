import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Info } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

interface LocationState {
  emailConfirmationPending?: boolean;
  email?: string;
  from?: string;
}

const Login = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as LocationState;
  const [email, setEmail] = useState(state?.email || "");
  const [password, setPassword] = useState("");
  const [googleError, setGoogleError] = useState<string | null>(null);
  const { login, loginWithGoogle, loading, error, session, user } = useAuth();
  const [registrationMessage, setRegistrationMessage] = useState<string | null>(null);
  const [isEmailNotConfirmed, setIsEmailNotConfirmed] = useState(false);

  useEffect(() => {
    console.log("Login component - checking authentication status");
    
    // Armazena o caminho de origem para redirecionamento pós-login
    if (state?.from) {
      localStorage.setItem("auth_redirect_path", state.from);
    }
    
    // Redirect to homepage if already authenticated
    if (session && user) {
      console.log("User already authenticated, redirecting to home");
      const redirectPath = state?.from || localStorage.getItem("auth_redirect_path") || '/';
      
      if (redirectPath !== '/login') {
        navigate(redirectPath);
        
        // Limpa o caminho após o redirecionamento
        if (localStorage.getItem("auth_redirect_path")) {
          localStorage.removeItem("auth_redirect_path");
        }
      } else {
        navigate('/');
      }
    }
    
    // Message after successful registration
    if (state?.emailConfirmationPending) {
      setRegistrationMessage(
        "Conta criada com sucesso! Você pode fazer login agora."
      );
    }
  }, [session, state, navigate, user]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      setIsEmailNotConfirmed(false);
      console.log("Attempting login with email:", email);
      await login(email, password);
    } catch (err: any) {
      console.error("Login error:", err);
      // Check if the error is "email not confirmed"
      if (err?.code === "email_not_confirmed") {
        setIsEmailNotConfirmed(true);
      }
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setGoogleError(null);
      await loginWithGoogle();
    } catch (err) {
      setGoogleError("Falha na autenticação com Google. Verifique se o provedor está ativado no Supabase.");
      console.error("Google login error:", err);
    }
  };

  const handleResendVerification = async () => {
    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email
      });
      
      if (error) {
        toast.error("Erro ao reenviar o email de verificação: " + error.message);
      } else {
        toast.success("Email de verificação reenviado com sucesso!");
      }
    } catch (err) {
      console.error("Error resending verification email:", err);
      toast.error("Erro ao reenviar o email de verificação");
    }
  };

  // This prevents the blank screen on the login page
  console.log("Rendering Login component", { user, session, loading });

  // If already authenticated and not on login page, redirect to home
  if (session && user && !location.pathname.includes('/login')) {
    console.log("Redirecting to home from Login component");
    navigate('/');
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-blue-50 to-blue-100">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Login</CardTitle>
          <CardDescription>
            Entre com suas credenciais para acessar o sistema
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {registrationMessage && (
            <Alert variant="default" className="mb-6 border-green-500 bg-green-50">
              <Info className="h-4 w-4 text-green-500" />
              <AlertDescription className="text-green-800">
                {registrationMessage}
              </AlertDescription>
            </Alert>
          )}
          
          {isEmailNotConfirmed && (
            <Alert variant="default" className="mb-6 border-amber-500 bg-amber-50">
              <Info className="h-4 w-4 text-amber-500" />
              <AlertDescription className="text-amber-800">
                <div>Email não confirmado. Por favor, verifique sua caixa de entrada e confirme seu email.</div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleResendVerification} 
                  className="mt-2 text-xs"
                >
                  Reenviar email de verificação
                </Button>
              </AlertDescription>
            </Alert>
          )}
          
          {error && !isEmailNotConfirmed && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {googleError && (
            <Alert variant="default" className="mb-6 border-amber-500 bg-amber-50">
              <Info className="h-4 w-4 text-amber-500" />
              <AlertDescription className="text-amber-800">
                {googleError}
                <div className="mt-2 text-xs">
                  Para habilitar o login com Google, acesse o painel do Supabase, navegue até Authentication {'>'} Providers e ative o Google.
                </div>
              </AlertDescription>
            </Alert>
          )}
          
          {/* Google Login Button */}
          <Button
            type="button"
            variant="outline"
            onClick={handleGoogleLogin}
            className="w-full h-12 font-medium"
            disabled={loading}
          >
            <svg
              className="mr-2 h-5 w-5"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
            </svg>
            Entrar com o Google
          </Button>
          
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator className="w-full" />
            </div>
            <div className="relative flex justify-center">
              <span className="px-2 bg-white text-sm text-gray-500">
                ou use seu email
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Senha</Label>
                <Link
                  to="/forgot-password"
                  className="text-sm text-primary hover:underline"
                >
                  Esqueceu a senha?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="******"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Entrando..." : "Entrar"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <div className="text-sm text-gray-600">
            Não tem uma conta?{" "}
            <Link to="/register" className="text-primary hover:underline">
              Cadastre-se
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;

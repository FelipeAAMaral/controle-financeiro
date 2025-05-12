
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AlertCircle, Save, User } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";

const Perfil = () => {
  const { user, updateProfile, loading: authLoading, logout } = useAuth();
  const [name, setName] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [email, setEmail] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      console.log("User data loaded:", user);
      setName(user.name || "");
      setPhotoURL(user.photoURL || "");
      setEmail(user.email || "");
    }
  }, [user]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    try {
      await updateProfile({
        name,
        photoURL
      });
      toast.success("Perfil atualizado com sucesso");
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao atualizar perfil";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    const maxSize = 5 * 1024 * 1024; // 5MB
    
    if (file.size > maxSize) {
      toast.error("A imagem deve ter no máximo 5MB");
      return;
    }
    
    try {
      setIsSaving(true);
      
      // Upload to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `avatars/${fileName}`;
      
      const { error: uploadError, data } = await supabase
        .storage
        .from('user-content')
        .upload(filePath, file);
      
      if (uploadError) {
        throw new Error("Erro ao fazer upload da imagem");
      }
      
      // Get the public URL
      const { data: urlData } = supabase
        .storage
        .from('user-content')
        .getPublicUrl(filePath);
      
      if (urlData) {
        setPhotoURL(urlData.publicUrl);
        
        // Update profile immediately
        await updateProfile({
          photoURL: urlData.publicUrl
        });
        
        toast.success("Foto de perfil atualizada com sucesso");
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Erro ao atualizar foto do perfil";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
    }
  };

  // Add debug output to help diagnose issues
  console.log("Rendering Perfil component", { user, authLoading });

  // Show loading state while user data is being fetched
  if (authLoading) {
    return (
      <div className="container max-w-4xl py-6">
        <h1 className="text-2xl font-bold mb-6">Carregando perfil...</h1>
        <div className="grid gap-6 md:grid-cols-[1fr_2fr]">
          <Card className="animate-pulse">
            <CardContent className="h-64"></CardContent>
          </Card>
          <Card className="animate-pulse">
            <CardContent className="h-64"></CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex justify-center items-center h-full">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">Perfil não encontrado</CardTitle>
            <CardDescription>
              Você precisa estar logado para acessar esta página.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button className="w-full" onClick={() => navigate("/login")}>
              Ir para Login
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl py-6">
      <h1 className="text-2xl font-bold mb-6">Perfil do Usuário</h1>

      <div className="grid gap-6 md:grid-cols-[1fr_2fr]">
        {/* Coluna de Avatar e Informações Rápidas */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Foto de Perfil</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-4">
              <Avatar className="w-32 h-32">
                <AvatarImage src={photoURL} />
                <AvatarFallback>
                  <User className="w-12 h-12" />
                </AvatarFallback>
              </Avatar>
              
              <div className="w-full">
                <Label 
                  htmlFor="avatar" 
                  className="cursor-pointer w-full py-2 px-4 bg-primary text-primary-foreground rounded-md flex justify-center"
                >
                  Alterar foto
                </Label>
                <Input 
                  id="avatar" 
                  type="file" 
                  className="hidden" 
                  accept="image/*" 
                  onChange={handleAvatarUpload}
                />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Ações</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button 
                variant="outline" 
                className="w-full"
                onClick={handleLogout}
              >
                Sair da conta
              </Button>
            </CardContent>
          </Card>
        </div>
        
        {/* Coluna de Dados do Usuário */}
        <Card>
          <CardHeader>
            <CardTitle className="text-xl">Informações Pessoais</CardTitle>
            <CardDescription>
              Atualize suas informações pessoais
            </CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  disabled
                />
                <p className="text-sm text-muted-foreground">
                  O email não pode ser alterado
                </p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="name">Nome completo</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Seu nome completo"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="photo-url">URL da foto (opcional)</Label>
                <Input
                  id="photo-url"
                  value={photoURL}
                  onChange={(e) => setPhotoURL(e.target.value)}
                  placeholder="https://exemplo.com/foto.jpg"
                />
              </div>
              
              <div className="pt-4">
                <Button type="submit" disabled={isSaving || authLoading} className="w-full">
                  {isSaving ? (
                    <>
                      <span className="animate-spin mr-2">⊚</span>
                      Salvando...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Salvar alterações
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Perfil;

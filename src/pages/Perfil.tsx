
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

const Perfil = () => {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
    photo: user?.photoURL || "",
  });

  const [security, setSecurity] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleProfileChange = (field: string, value: string) => {
    setProfileData({ ...profileData, [field]: value });
  };

  const handleSecurityChange = (field: string, value: string) => {
    setSecurity({ ...security, [field]: value });
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simular atualização do perfil
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast.success("Perfil atualizado com sucesso!");
    setIsLoading(false);
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (security.newPassword !== security.confirmPassword) {
      toast.error("As senhas não coincidem");
      return;
    }
    
    setIsLoading(true);
    
    // Simular atualização da senha
    await new Promise(resolve => setTimeout(resolve, 1000));
    toast.success("Senha atualizada com sucesso!");
    setSecurity({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setIsLoading(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Meu Perfil</h1>
        <p className="text-gray-500">Gerencie suas informações pessoais e preferências de conta</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile">Perfil</TabsTrigger>
          <TabsTrigger value="security">Segurança</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Informações Pessoais</CardTitle>
              <CardDescription>
                Atualize suas informações pessoais
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleUpdateProfile}>
              <CardContent className="space-y-4">
                <div className="space-y-1">
                  <Label htmlFor="avatar">Foto de Perfil</Label>
                  <div className="flex items-center space-x-4">
                    <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center">
                      {profileData.photo ? (
                        <img
                          src={profileData.photo}
                          alt="Avatar"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-2xl text-gray-400">
                          {profileData.name?.charAt(0) || user?.email?.charAt(0) || "U"}
                        </span>
                      )}
                    </div>
                    <Button type="button" variant="outline">
                      Alterar foto
                    </Button>
                  </div>
                </div>

                <div className="space-y-1">
                  <Label htmlFor="name">Nome completo</Label>
                  <Input
                    id="name"
                    value={profileData.name}
                    onChange={(e) => handleProfileChange("name", e.target.value)}
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profileData.email}
                    disabled
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="phone">Telefone</Label>
                  <Input
                    id="phone"
                    value={profileData.phone}
                    onChange={(e) => handleProfileChange("phone", e.target.value)}
                    placeholder="(00) 00000-0000"
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Salvando..." : "Salvar Alterações"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
        
        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Segurança</CardTitle>
              <CardDescription>
                Atualize sua senha
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleUpdatePassword}>
              <CardContent className="space-y-4">
                <div className="space-y-1">
                  <Label htmlFor="currentPassword">Senha atual</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    value={security.currentPassword}
                    onChange={(e) => handleSecurityChange("currentPassword", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="newPassword">Nova senha</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={security.newPassword}
                    onChange={(e) => handleSecurityChange("newPassword", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-1">
                  <Label htmlFor="confirmPassword">Confirmar senha</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={security.confirmPassword}
                    onChange={(e) => handleSecurityChange("confirmPassword", e.target.value)}
                    required
                  />
                  {security.newPassword !== security.confirmPassword && security.confirmPassword && (
                    <p className="text-sm text-red-500">As senhas não coincidem</p>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? "Atualizando..." : "Atualizar Senha"}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Perfil;

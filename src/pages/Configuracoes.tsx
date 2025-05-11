
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

const Configuracoes = () => {
  const [notificationSettings, setNotificationSettings] = useState({
    emailAlerts: true,
    pushNotifications: true,
    monthlyReport: true,
    budgetAlerts: true,
    recurringExpenses: true,
  });

  const [preferences, setPreferences] = useState({
    currency: "BRL",
    dateFormat: "DD/MM/YYYY",
    theme: "light",
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleNotificationChange = (setting: string) => {
    setNotificationSettings({
      ...notificationSettings,
      [setting]: !notificationSettings[setting as keyof typeof notificationSettings],
    });
  };

  const handlePreferenceChange = (setting: string, value: string) => {
    setPreferences({
      ...preferences,
      [setting]: value,
    });
  };

  const handleSaveSettings = async () => {
    setIsLoading(true);
    
    // Simular salvamento de configurações
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast.success("Configurações salvas com sucesso!");
    setIsLoading(false);
  };

  const handleExportData = () => {
    // Simular exportação de dados
    toast.success("Exportação iniciada. Você receberá um email quando estiver pronto.");
  };

  const handleDeleteAccount = () => {
    // Aqui você implementaria a lógica para excluir a conta
    toast.error("Esta funcionalidade não está disponível no momento.");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Configurações</h1>
        <p className="text-gray-500">Gerencie suas preferências de sistema</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Notificações</CardTitle>
            <CardDescription>
              Configure como você deseja ser notificado
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="emailAlerts">Alertas por email</Label>
                <p className="text-sm text-muted-foreground">
                  Receba notificações importantes por email
                </p>
              </div>
              <Switch
                id="emailAlerts"
                checked={notificationSettings.emailAlerts}
                onCheckedChange={() => handleNotificationChange("emailAlerts")}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="pushNotifications">Notificações push</Label>
                <p className="text-sm text-muted-foreground">
                  Receba notificações no navegador
                </p>
              </div>
              <Switch
                id="pushNotifications"
                checked={notificationSettings.pushNotifications}
                onCheckedChange={() => handleNotificationChange("pushNotifications")}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="monthlyReport">Relatório mensal</Label>
                <p className="text-sm text-muted-foreground">
                  Receba um relatório resumido no início de cada mês
                </p>
              </div>
              <Switch
                id="monthlyReport"
                checked={notificationSettings.monthlyReport}
                onCheckedChange={() => handleNotificationChange("monthlyReport")}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="budgetAlerts">Alertas de orçamento</Label>
                <p className="text-sm text-muted-foreground">
                  Receba alertas quando estiver próximo de exceder seu orçamento
                </p>
              </div>
              <Switch
                id="budgetAlerts"
                checked={notificationSettings.budgetAlerts}
                onCheckedChange={() => handleNotificationChange("budgetAlerts")}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="recurringExpenses">Gastos recorrentes</Label>
                <p className="text-sm text-muted-foreground">
                  Receba lembretes sobre gastos recorrentes próximos
                </p>
              </div>
              <Switch
                id="recurringExpenses"
                checked={notificationSettings.recurringExpenses}
                onCheckedChange={() => handleNotificationChange("recurringExpenses")}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Preferências</CardTitle>
            <CardDescription>
              Personalize sua experiência
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="currency">Moeda</Label>
              <Select
                value={preferences.currency}
                onValueChange={(value) => handlePreferenceChange("currency", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma moeda" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BRL">Real Brasileiro (R$)</SelectItem>
                  <SelectItem value="USD">Dólar Americano (US$)</SelectItem>
                  <SelectItem value="EUR">Euro (€)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dateFormat">Formato de data</Label>
              <Select
                value={preferences.dateFormat}
                onValueChange={(value) => handlePreferenceChange("dateFormat", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um formato" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DD/MM/YYYY">DD/MM/YYYY</SelectItem>
                  <SelectItem value="MM/DD/YYYY">MM/DD/YYYY</SelectItem>
                  <SelectItem value="YYYY-MM-DD">YYYY-MM-DD</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="theme">Tema</Label>
              <Select
                value={preferences.theme}
                onValueChange={(value) => handlePreferenceChange("theme", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um tema" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Claro</SelectItem>
                  <SelectItem value="dark">Escuro</SelectItem>
                  <SelectItem value="system">Sistema</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Dados da Conta</CardTitle>
          <CardDescription>
            Exporte ou exclua seus dados
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between">
            <div className="space-y-0.5 mb-2 sm:mb-0">
              <h3 className="text-base font-medium">Exportar dados</h3>
              <p className="text-sm text-muted-foreground">
                Baixe um arquivo com todos os seus dados financeiros
              </p>
            </div>
            <Button variant="outline" onClick={handleExportData}>
              Exportar
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-t pt-4">
            <div className="space-y-0.5 mb-2 sm:mb-0">
              <h3 className="text-base font-medium text-red-500">Excluir conta</h3>
              <p className="text-sm text-muted-foreground">
                Apague permanentemente sua conta e todos os seus dados
              </p>
            </div>
            <Button variant="destructive" onClick={handleDeleteAccount}>
              Excluir Conta
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSaveSettings} disabled={isLoading}>
          {isLoading ? "Salvando..." : "Salvar Configurações"}
        </Button>
      </div>
    </div>
  );
};

export default Configuracoes;

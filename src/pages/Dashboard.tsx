
import { useState } from "react";
import { PieChart, BarChart, Wallet, ArrowUp, ArrowDown, Plus, PiggyBank } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RecentTransactions from "@/components/dashboard/RecentTransactions";
import FinancialTips from "@/components/dashboard/FinancialTips";
import FinancialGoals from "@/components/dashboard/FinancialGoals";
import FinancialOverview from "@/components/dashboard/FinancialOverview";

const Dashboard = () => {
  const [selectedTab, setSelectedTab] = useState("overview");
  const { toast } = useToast();

  const handleAddTransaction = () => {
    toast({
      title: "Adicionar transação",
      description: "Você será redirecionado para o formulário",
      duration: 3000,
    });
  };

  const currentMonth = new Intl.DateTimeFormat('pt-BR', { month: 'long' }).format(new Date());
  const capitalizedMonth = currentMonth.charAt(0).toUpperCase() + currentMonth.slice(1);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-gray-500">Visão geral das suas finanças em {capitalizedMonth}</p>
        </div>
        <Button onClick={handleAddTransaction}>
          <Plus className="mr-2 h-4 w-4" /> Nova Transação
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="animated-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Saldo Total</CardTitle>
            <Wallet className="h-4 w-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 5.240,80</div>
            <p className="text-xs text-gray-500">Atualizado hoje às 10:45</p>
            <div className="mt-2 flex items-center">
              <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-xs text-green-500">+12% do mês anterior</span>
            </div>
          </CardContent>
        </Card>

        <Card className="animated-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total de Entradas</CardTitle>
            <ArrowUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">R$ 7.350,00</div>
            <p className="text-xs text-gray-500">{capitalizedMonth}, 2023</p>
            <div className="mt-2 flex items-center">
              <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-xs text-green-500">+5% do mês anterior</span>
            </div>
          </CardContent>
        </Card>

        <Card className="animated-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total de Saídas</CardTitle>
            <ArrowDown className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">R$ 2.109,20</div>
            <p className="text-xs text-gray-500">{capitalizedMonth}, 2023</p>
            <div className="mt-2 flex items-center">
              <ArrowDown className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-xs text-green-500">-8% do mês anterior</span>
            </div>
          </CardContent>
        </Card>

        <Card className="animated-card">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Benefícios</CardTitle>
            <PiggyBank className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span>Alimentação</span>
                  <span>R$ 420,30 / R$ 800,00</span>
                </div>
                <Progress value={52} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span>Refeição</span>
                  <span>R$ 284,50 / R$ 600,00</span>
                </div>
                <Progress value={47} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span>Mobilidade</span>
                  <span>R$ 120,00 / R$ 300,00</span>
                </div>
                <Progress value={40} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" value={selectedTab} onValueChange={setSelectedTab} className="w-full">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="overview">
            <PieChart className="h-4 w-4 mr-2" />
            Visão Geral
          </TabsTrigger>
          <TabsTrigger value="transactions">
            <Wallet className="h-4 w-4 mr-2" />
            Transações
          </TabsTrigger>
          <TabsTrigger value="goals">
            <PiggyBank className="h-4 w-4 mr-2" />
            Objetivos
          </TabsTrigger>
          <TabsTrigger value="tips">
            <BarChart className="h-4 w-4 mr-2" />
            Dicas
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <FinancialOverview />
        </TabsContent>
        
        <TabsContent value="transactions" className="space-y-4">
          <RecentTransactions />
        </TabsContent>
        
        <TabsContent value="goals" className="space-y-4">
          <FinancialGoals />
        </TabsContent>
        
        <TabsContent value="tips" className="space-y-4">
          <FinancialTips />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Dashboard;

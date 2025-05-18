import { useState, useEffect, useCallback, useRef } from "react";
import { PieChart, BarChart, Wallet, ArrowUp, ArrowDown, PiggyBank, TrendingUp, Plane, Check, Flag, Database, CreditCard } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import RecentTransactions from "@/components/dashboard/RecentTransactions";
import FinancialTips from "@/components/dashboard/FinancialTips";
import FinancialGoals from "@/components/dashboard/FinancialGoals";
import FinancialOverview from "@/components/dashboard/FinancialOverview";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { DashboardService } from "@/services/dashboardService";
import type { FinancialOverview as DashboardFinancialOverview } from "@/services/dashboardService";
import { ViagensService, Viagem } from '@/services/viagensService';
import { Transacao } from '@/types';
import { toast } from 'sonner';
import { Plus } from "lucide-react";

const Home = () => {
  const [selectedTab, setSelectedTab] = useState("overview");
  const [upcomingTrips, setUpcomingTrips] = useState<Viagem[]>([]);
  const [databaseInitialized, setDatabaseInitialized] = useState<boolean | null>(null);
  const { toast: toastNotification } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  const mounted = useRef(true);
  const initialLoadDone = useRef(false);

  const [totalPatrimonio, setTotalPatrimonio] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [financialOverview, setFinancialOverview] = useState<DashboardFinancialOverview | null>(null);
  const [recentTransactions, setRecentTransactions] = useState<Transacao[]>([]);
  const [monthlyEvolution, setMonthlyEvolution] = useState<any[]>([]);
  const [hasData, setHasData] = useState(false);

  const loadDashboardData = useCallback(async () => {
    if (!user || !mounted.current) return;

    try {
      setIsLoading(true);
      const dashboardService = new DashboardService();
      const [overview, transactions, evolution] = await Promise.all([
        dashboardService.getFinancialOverview(user.id),
        dashboardService.getRecentTransactions(user.id),
        dashboardService.getMonthlyEvolution(user.id)
      ]);

      if (!mounted.current) return;

      setFinancialOverview(overview);
      setRecentTransactions(transactions.map(t => ({
        id: t.id,
        description: t.description,
        date: t.date,
        amount: t.amount,
        type: t.type,
        category: t.category,
        account: t.account || 'Nubank',
        user_id: t.user_id
      })));
      setMonthlyEvolution(evolution);
      
      setHasData(transactions.length > 0 || overview.totalEntradas > 0 || overview.totalSaidas > 0);
      initialLoadDone.current = true;
    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error);
      if (mounted.current) {
        toast.error('Erro ao carregar dados do dashboard');
      }
    } finally {
      if (mounted.current) {
        setIsLoading(false);
      }
    }
  }, [user]);

  useEffect(() => {
    mounted.current = true;
    initialLoadDone.current = false;

    const initializeDashboard = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);

        // Check database initialization
        const { data, error } = await supabase
          .from('investments')
          .select('id')
          .limit(1);
        
        if (mounted.current) {
          setDatabaseInitialized(error ? false : true);
        }

        // Load trips
        const viagensService = new ViagensService();
        const trips = await viagensService.getUpcomingTrips(user.id);
        if (mounted.current) {
          setUpcomingTrips(trips);
        }

        // Load dashboard data
        await loadDashboardData();

        // Set patrimônio
        if (mounted.current) {
          setTotalPatrimonio(22800);
        }
      } catch (error) {
        console.error('Error initializing dashboard:', error);
        if (mounted.current) {
          toast.error('Erro ao inicializar o dashboard');
        }
      } finally {
        if (mounted.current) {
          setIsLoading(false);
        }
      }
    };

    initializeDashboard();

    return () => {
      mounted.current = false;
      initialLoadDone.current = false;
      setIsLoading(false);
      setFinancialOverview(null);
      setRecentTransactions([]);
      setMonthlyEvolution([]);
      setHasData(false);
      setTotalPatrimonio(0);
      setUpcomingTrips([]);
    };
  }, [user, loadDashboardData]);

  // Handle tab changes
  const handleTabChange = (value: string) => {
    setSelectedTab(value);
  };

  const currentMonth = new Intl.DateTimeFormat('pt-BR', { month: 'long' }).format(new Date());
  const capitalizedMonth = currentMonth.charAt(0).toUpperCase() + currentMonth.slice(1);

  // Funções para navegação
  const navigateTo = (path: string) => {
    navigate(path);
  };

  const formatDate = (dateString) => {
    const options = { 
      day: '2-digit' as const, 
      month: '2-digit' as const, 
      year: 'numeric' as const 
    };
    return new Date(dateString).toLocaleDateString('pt-BR', options);
  };
  
  const isTripPassed = (endDate) => {
    const now = new Date();
    const tripEndDate = new Date(endDate);
    return tripEndDate < now;
  };

  if (isLoading && !initialLoadDone.current) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  if (!hasData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold mb-6">Bem-vindo ao seu Controle Financeiro!</h1>
          <p className="text-gray-600 mb-8 text-lg">
            Comece agora mesmo a organizar suas finanças de forma simples e eficiente. 
            Registre suas transações, acompanhe seus gastos e monitore seus objetivos financeiros.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <Card className="p-6 hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wallet className="h-6 w-6 text-primary" />
                  Transações
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Registre suas entradas e saídas para manter o controle do seu fluxo de caixa.
                </p>
                <Button
                  onClick={() => navigate("/transacoes/nova")}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Registrar Primeira Transação
                </Button>
              </CardContent>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-6 w-6 text-primary" />
                  Gastos Recorrentes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Cadastre seus gastos fixos mensais para um melhor planejamento.
                </p>
                <Button
                  onClick={() => navigate("/gastos-recorrentes/novo")}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Cadastrar Gasto Recorrente
                </Button>
              </CardContent>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PiggyBank className="h-6 w-6 text-primary" />
                  Objetivos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Defina seus objetivos financeiros e acompanhe seu progresso.
                </p>
                <Button
                  onClick={() => navigate("/objetivos/novo")}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Primeiro Objetivo
                </Button>
              </CardContent>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-6 w-6 text-primary" />
                  Investimentos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Acompanhe seus investimentos e monitore seu patrimônio.
                </p>
                <Button
                  onClick={() => navigate("/investimentos")}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Registrar Investimento
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="bg-primary/5 rounded-lg p-6">
            <h2 className="text-xl font-semibold mb-4">Dicas para Começar</h2>
            <ul className="text-left space-y-3 text-gray-600">
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-primary mt-0.5" />
                <span>Registre todas as suas transações diárias para ter um controle preciso</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-primary mt-0.5" />
                <span>Cadastre seus gastos recorrentes para um melhor planejamento mensal</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-primary mt-0.5" />
                <span>Defina objetivos financeiros para manter o foco no seu planejamento</span>
              </li>
              <li className="flex items-start gap-2">
                <Check className="h-5 w-5 text-primary mt-0.5" />
                <span>Acompanhe seus investimentos para crescer seu patrimônio</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>

      {databaseInitialized === false && (
        <Card className="border-amber-300 bg-amber-50">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Database className="h-5 w-5 text-amber-600" />
              <p className="text-amber-800">
                O banco de dados ainda não foi inicializado. Por favor, acesse a página de configurações para inicializar.
              </p>
            </div>
            <Button
              variant="outline"
              className="border-amber-300 hover:bg-amber-100"
              onClick={() => navigateTo("/configuracoes")}
            >
              Configurações
            </Button>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="overview" className="mt-6" onValueChange={handleTabChange}>
        <TabsList>
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="transactions">Transações</TabsTrigger>
          <TabsTrigger value="goals">Objetivos</TabsTrigger>
          <TabsTrigger value="tips">Dicas</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Wallet className="h-5 w-5" />
                  Saldo Atual
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-green-600">
                  R$ {financialOverview?.saldoAtual?.toFixed(2) || '0.00'}
                </p>
                <p className={`text-sm mt-2 ${financialOverview?.variacaoEntradas >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {financialOverview?.variacaoEntradas >= 0 ? '+' : ''}{financialOverview?.variacaoEntradas?.toFixed(1) || '0.0'}% vs mês anterior
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ArrowUp className="h-5 w-5 text-green-600" />
                  Entradas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-green-600">
                  R$ {financialOverview?.totalEntradas?.toFixed(2) || '0.00'}
                </p>
                <p className={`text-sm mt-2 ${financialOverview?.variacaoEntradas >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {financialOverview?.variacaoEntradas >= 0 ? '+' : ''}{financialOverview?.variacaoEntradas?.toFixed(1) || '0.0'}% vs mês anterior
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ArrowDown className="h-5 w-5 text-red-600" />
                  Saídas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-red-600">
                  R$ {financialOverview?.totalSaidas?.toFixed(2) || '0.00'}
                </p>
                <p className={`text-sm mt-2 ${financialOverview?.variacaoSaidas <= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {financialOverview?.variacaoSaidas >= 0 ? '+' : ''}{financialOverview?.variacaoSaidas?.toFixed(1) || '0.0'}% vs mês anterior
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plane className="h-5 w-5" />
                  Próximas Viagens
                </CardTitle>
              </CardHeader>
              <CardContent>
                {upcomingTrips.length === 0 ? (
                  <p className="text-gray-500">Nenhuma viagem planejada</p>
                ) : (
                  <div className="space-y-4">
                    {upcomingTrips.map((trip) => (
                      <div key={trip.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <h3 className="font-semibold">{trip.destination}</h3>
                          <p className="text-sm text-gray-600">
                            {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={trip.status === 'completed' ? 'default' : 'secondary'}>
                            {trip.status === 'completed' ? 'Concluída' : 'Planejada'}
                          </Badge>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => navigateTo(`/viagens/${trip.id}`)}
                          >
                            Detalhes
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
              <CardFooter>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => navigateTo("/viagens")}
                >
                  Ver todas as viagens
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PiggyBank className="h-5 w-5" />
                  Patrimônio Total
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">R$ {totalPatrimonio.toFixed(2)}</p>
                <div className="mt-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Investimentos</span>
                    <span>R$ 15.000,00</span>
                  </div>
                  <Progress value={65} className="h-2" />
                </div>
                <div className="mt-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span>Poupança</span>
                    <span>R$ 7.800,00</span>
                  </div>
                  <Progress value={35} className="h-2" />
                </div>
              </CardContent>
              <CardFooter>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => navigateTo("/investimentos")}
                >
                  Ver detalhes
                </Button>
              </CardFooter>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="transactions">
          <RecentTransactions transactions={recentTransactions} />
        </TabsContent>

        <TabsContent value="goals">
          <FinancialGoals />
        </TabsContent>

        <TabsContent value="tips">
          <FinancialTips />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Home;

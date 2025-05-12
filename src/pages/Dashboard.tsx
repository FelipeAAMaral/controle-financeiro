import { useState, useEffect } from "react";
import { PieChart, BarChart, Wallet, ArrowUp, ArrowDown, PiggyBank, TrendingUp, Plane, Check, Flag, Database } from "lucide-react";
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

// Mock travel data
const mockTrips = [
  {
    id: "1",
    destination: "São Paulo",
    startDate: "2024-01-15",
    endDate: "2024-01-20",
    budget: "1500",
    status: "completed", // past trip, already happened
    user_id: "8b55fd41-e80c-4155-8d5a-730603654e17" // ID do usuário amaral.felipeaugusto@gmail.com
  },
  {
    id: "2",
    destination: "Rio de Janeiro",
    startDate: "2024-04-10", 
    endDate: "2024-04-15",
    budget: "2000",
    status: "completed", // past trip, already happened
    user_id: "8b55fd41-e80c-4155-8d5a-730603654e17" // ID do usuário amaral.felipeaugusto@gmail.com
  },
  {
    id: "3",
    destination: "Florianópolis",
    startDate: "2024-06-20",
    endDate: "2024-06-27",
    budget: "2500",
    status: "planned", // future trip, not happened yet
    user_id: "8b55fd41-e80c-4155-8d5a-730603654e17" // ID do usuário amaral.felipeaugusto@gmail.com
  },
  {
    id: "4",
    destination: "Gramado",
    startDate: "2024-08-05",
    endDate: "2024-08-10",
    budget: "3000",
    status: "planned", // future trip, not happened yet
    user_id: "8b55fd41-e80c-4155-8d5a-730603654e17" // ID do usuário amaral.felipeaugusto@gmail.com
  },
  {
    id: "5",
    destination: "Natal",
    startDate: "2024-10-15",
    endDate: "2024-10-22",
    budget: "4000",
    status: "planned", // future trip, not happened yet
    user_id: "8b55fd41-e80c-4155-8d5a-730603654e17" // ID do usuário amaral.felipeaugusto@gmail.com
  }
];

const Dashboard = () => {
  console.log("Rendering Dashboard component"); // Debug log
  
  const [selectedTab, setSelectedTab] = useState("overview");
  const [upcomingTrips, setUpcomingTrips] = useState([]);
  const [databaseInitialized, setDatabaseInitialized] = useState<boolean | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [totalPatrimonio, setTotalPatrimonio] = useState(0);

  useEffect(() => {
    console.log("Dashboard useEffect running"); // Debug log
    
    // Check if database is initialized
    const checkDatabase = async () => {
      try {
        const { data, error } = await supabase
          .from('investments')
          .select('id')
          .limit(1);
        
        setDatabaseInitialized(error ? false : true);
      } catch (e) {
        console.error("Error checking database:", e);
        setDatabaseInitialized(false);
      }
    };
    
    checkDatabase();
    
    // Simular o carregamento de dados de patrimônio
    const timer = setTimeout(() => {
      setTotalPatrimonio(22800);
    }, 500);

    // Get upcoming trips (past month to next 6 months)
    const now = new Date();
    const oneMonthAgo = new Date(now);
    oneMonthAgo.setMonth(now.getMonth() - 1);
    
    const sixMonthsFromNow = new Date(now);
    sixMonthsFromNow.setMonth(now.getMonth() + 6);
    
    // Filter trips by date range and user_id
    const filteredTrips = mockTrips.filter(trip => {
      const tripDate = new Date(trip.startDate);
      return tripDate >= oneMonthAgo && 
             tripDate <= sixMonthsFromNow && 
             trip.user_id === user?.id;
    });

    // Sort trips by start date
    filteredTrips.sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
    
    setUpcomingTrips(filteredTrips);
    
    return () => clearTimeout(timer);
  }, [user]);

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

  return (
    <div className="space-y-6">
      {databaseInitialized === false && (
        <Card className="border-amber-300 bg-amber-50">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Database className="h-5 w-5 text-amber-600" />
              <p className="text-amber-800">
                É necessário configurar o banco de dados para continuar usando o aplicativo.
              </p>
            </div>
            <Button 
              size="sm" 
              variant="default"
              onClick={() => navigate('/database-setup')}
            >
              Configurar Banco
            </Button>
          </CardContent>
        </Card>
      )}
      
      {/* Cards de Saúde Financeira */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigateTo('/transacoes')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Saldo Total</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 4.200,00</div>
            <p className="text-xs text-muted-foreground">
              +20% em relação ao mês passado
            </p>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigateTo('/controle-mensal')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Economia Mensal</CardTitle>
            <PiggyBank className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 1.200,00</div>
            <p className="text-xs text-muted-foreground">
              +12% em relação ao mês passado
            </p>
          </CardContent>
        </Card>
        <Card className="cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigateTo('/indicadores')}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Indicador de Investimentos</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">28%</div>
            <p className="text-xs text-muted-foreground">
              Percentual da renda investida
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Cards principais do Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="animated-card cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigateTo('/transacoes')}>
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

        <Card className="animated-card cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigateTo('/transacoes')}>
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

        <Card className="animated-card cursor-pointer hover:shadow-md transition-shadow" onClick={() => navigateTo('/transacoes')}>
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

        <Card className="animated-card cursor-pointer" onClick={() => navigateTo('/indicadores')}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Investimentos</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ {new Intl.NumberFormat('pt-BR').format(totalPatrimonio)}</div>
            <p className="text-xs text-gray-500">Patrimônio total</p>
            <div className="mt-2 flex items-center">
              <ArrowUp className="h-4 w-4 text-green-500 mr-1" />
              <span className="text-xs text-green-500">+15% acumulado</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming trips section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">Próximas Viagens</h2>
          <Button variant="outline" size="sm" onClick={() => navigateTo('/viagens')}>
            Ver todas
          </Button>
        </div>

        {upcomingTrips.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center p-6">
              <Plane className="h-12 w-12 text-gray-300 mb-2" />
              <p className="text-muted-foreground">Nenhuma viagem planejada para os próximos meses</p>
              <Button variant="outline" size="sm" className="mt-4" onClick={() => navigateTo('/viagens')}>
                Planejar viagem
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {upcomingTrips.map((trip) => (
              <Card key={trip.id} className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigateTo(`/viagens/${trip.id}`)}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-lg">{trip.destination}</CardTitle>
                    {isTripPassed(trip.endDate) ? (
                      <Badge variant="outline" className="flex items-center gap-1 bg-green-100 text-green-800 hover:bg-green-100">
                        <Check className="h-3 w-3" /> Realizada
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="flex items-center gap-1 bg-blue-100 text-blue-800 hover:bg-blue-100">
                        <Flag className="h-3 w-3" /> Planejada
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Data</span>
                      <span className="text-sm">{formatDate(trip.startDate)} - {formatDate(trip.endDate)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Orçamento</span>
                      <span className="text-sm font-medium">
                        R$ {parseFloat(trip.budget).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
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

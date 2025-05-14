import { BarChart, PieChart, AreaChart, Area, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Pie, Cell } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { DashboardService } from "@/services/dashboardService";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

// Dados de exemplo para gastos por categoria
const expenseData = [
  { name: "Moradia", value: 1200, color: "#8884d8" },
  { name: "Alimentação", value: 800, color: "#82ca9d" },
  { name: "Transporte", value: 300, color: "#ffc658" },
  { name: "Lazer", value: 250, color: "#ff8042" },
  { name: "Saúde", value: 200, color: "#0088fe" },
  { name: "Outros", value: 150, color: "#00C49F" },
];

// Dados de exemplo para fluxo de caixa mensal (combinados em entradas e saídas)
const cashFlowData = [
  { month: "Jan", entradaDinheiro: 4500, entradaBeneficio: 400, saidaDinheiro: 3400, saidaBeneficio: 400 },
  { month: "Fev", entradaDinheiro: 4500, entradaBeneficio: 400, saidaDinheiro: 3500, saidaBeneficio: 400 },
  { month: "Mar", entradaDinheiro: 4800, entradaBeneficio: 400, saidaDinheiro: 3700, saidaBeneficio: 400 },
  { month: "Abr", entradaDinheiro: 4700, entradaBeneficio: 400, saidaDinheiro: 3550, saidaBeneficio: 400 },
  { month: "Mai", entradaDinheiro: 4600, entradaBeneficio: 400, saidaDinheiro: 3400, saidaBeneficio: 400 },
  { month: "Jun", entradaDinheiro: 5200, entradaBeneficio: 400, saidaDinheiro: 3600, saidaBeneficio: 400 },
];

// Dados de exemplo para evolução do patrimônio
const netWorthData = [
  { month: "Jan", valor: 10000 },
  { month: "Fev", valor: 12000 },
  { month: "Mar", valor: 14500 },
  { month: "Abr", valor: 16000 },
  { month: "Mai", valor: 18500 },
  { month: "Jun", valor: 21000 },
];

// Dados de exemplo para gastos por benefícios
const benefitsData = [
  { name: "Alimentação", value: 420, color: "#FF8042" },
  { name: "Refeição", value: 284, color: "#0088FE" },
  { name: "Mobilidade", value: 120, color: "#00C49F" },
  { name: "Cultura", value: 85, color: "#FFBB28" },
  { name: "Saúde", value: 65, color: "#FF00FF" },
];

interface FinancialOverviewData {
  saldoAtual: number;
  variacaoSaldo: number;
  totalEntradas: number;
  variacaoEntradas: number;
  totalSaidas: number;
  variacaoSaidas: number;
}

const FinancialOverview = () => {
  const { user } = useAuth();
  const [data, setData] = useState<FinancialOverviewData | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      if (!user) return;

      try {
        setLoading(true);
        const dashboardService = new DashboardService();
        const overview = await dashboardService.getFinancialOverview(user.id);
        setData(overview);
      } catch (error) {
        console.error('Erro ao carregar visão geral financeira:', error);
        toast.error('Erro ao carregar visão geral financeira');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [user]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[...Array(3)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <div className="h-6 w-24 bg-gray-200 rounded animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="h-8 w-32 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-20 bg-gray-200 rounded animate-pulse mt-2" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!data || (data.totalEntradas === 0 && data.totalSaidas === 0)) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center p-6 space-y-4">
          <p className="text-gray-500 text-center">
            Você ainda não tem nenhuma transação registrada. Comece registrando suas entradas e saídas para ter uma visão geral das suas finanças.
          </p>
          <Button onClick={() => navigate('/transacoes/nova')}>
            Registrar Primeira Transação
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Saldo Atual</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-green-600">
            R$ {data.saldoAtual.toFixed(2)}
          </p>
          <p className={`text-sm mt-2 ${data.variacaoSaldo >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {data.variacaoSaldo >= 0 ? '+' : ''}{data.variacaoSaldo.toFixed(1)}% vs mês anterior
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Total de Entradas</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-green-600">
            R$ {data.totalEntradas.toFixed(2)}
          </p>
          <p className={`text-sm mt-2 ${data.variacaoEntradas >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {data.variacaoEntradas >= 0 ? '+' : ''}{data.variacaoEntradas.toFixed(1)}% vs mês anterior
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Total de Saídas</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-bold text-red-600">
            R$ {data.totalSaidas.toFixed(2)}
          </p>
          <p className={`text-sm mt-2 ${data.variacaoSaidas <= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {data.variacaoSaidas >= 0 ? '+' : ''}{data.variacaoSaidas.toFixed(1)}% vs mês anterior
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default FinancialOverview;

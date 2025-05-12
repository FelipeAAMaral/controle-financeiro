
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { TabsContent, Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PieChart, AreaChart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useNavigate } from "react-router-dom";
import { 
  Area, 
  AreaChart as RechartsAreaChart, 
  CartesianGrid, 
  ResponsiveContainer, 
  Tooltip, 
  XAxis, 
  YAxis,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Legend
} from "recharts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/hooks/useAuth";
import { investimentosService } from "@/services/investimentosService";
import { toast } from "sonner";
import { Investimento, MarketData } from "@/types/investimentos";

// Helper function para formatar valores monetários
function formatCurrency(value: number, currency = "BRL") {
  const formatter = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: currency,
  });
  return formatter.format(value);
}

// Cores para o gráfico de pizza
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const InvestimentosDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [filter, setFilter] = useState("all");
  const [investimentos, setInvestimentos] = useState<Investimento[]>([]);
  const [marketData, setMarketData] = useState<MarketData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      setIsLoading(true);
      try {
        // Fetch investments from database
        const invData = await investimentosService.getInvestimentos(user.id);
        setInvestimentos(invData);

        // Fetch market data from database
        const mktData = await investimentosService.getMarketData();
        setMarketData(mktData);
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Erro ao carregar dados de investimentos");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const filteredInvestimentos = investimentos.filter(inv => {
    if (filter === "all") return true;
    return inv.categoria === filter;
  });

  // Calcular valores totais
  const totalInvestido = investimentos.reduce((sum, inv) => sum + inv.valorInicial, 0);
  const totalRendaFixa = investimentos.filter(inv => inv.categoria === "renda_fixa").reduce((sum, inv) => sum + inv.valorInicial, 0);
  const totalRendaVariavel = investimentos.filter(inv => inv.categoria === "renda_variavel").reduce((sum, inv) => sum + inv.valorInicial, 0);
  const totalCripto = investimentos.filter(inv => inv.categoria === "cripto").reduce((sum, inv) => sum + inv.valorInicial, 0);
  const totalInternacional = investimentos.filter(inv => inv.categoria === "internacional").reduce((sum, inv) => sum + inv.valorInicial, 0);

  // Dados para o gráfico de composição da carteira
  const portfolioData = [
    { name: "Renda Fixa", value: totalRendaFixa },
    { name: "Renda Variável", value: totalRendaVariavel },
    { name: "Criptomoedas", value: totalCripto },
    { name: "Internacional", value: totalInternacional },
  ].filter(item => item.value > 0);

  // Dados para o gráfico de evolução (simulado)
  const evolucaoData = [
    { name: "Jan", valor: totalInvestido * 0.96 },
    { name: "Fev", valor: totalInvestido * 0.98 },
    { name: "Mar", valor: totalInvestido * 1.01 },
    { name: "Abr", valor: totalInvestido * 1.03 },
    { name: "Mai", valor: totalInvestido * 1.05 },
    { name: "Jun", valor: totalInvestido * 1.08 },
    { name: "Jul", valor: totalInvestido * 1.09 },
    { name: "Ago", valor: totalInvestido * 1.12 },
  ];

  // Mapeamento de categorias para nomes legíveis
  const categoriaNomes = {
    "renda_fixa": "Renda Fixa",
    "renda_variavel": "Renda Variável",
    "cripto": "Criptomoedas",
    "internacional": "Internacional",
    "all": "Todos"
  };

  // Renderiza os cards de mercado
  const renderMarketCards = () => {
    if (marketData.length === 0) {
      return (
        <Card className="col-span-full">
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">Dados de mercado não disponíveis</p>
          </CardContent>
        </Card>
      );
    }

    return marketData.map((item, index) => (
      <Card key={index}>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">{item.index}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(item.value, "BRL").replace("R$", "")}</div>
          <div className={`flex items-center text-xs ${item.change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {item.change >= 0 ? '+' : ''}{item.change.toFixed(2)}%
          </div>
        </CardContent>
      </Card>
    ));
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Investimentos</h1>
          <p className="text-muted-foreground">
            Acompanhe e gerencie seus investimentos
          </p>
        </div>
        <Button onClick={() => navigate("/novo-investimento")}>
          Novo Investimento
        </Button>
      </div>

      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="pb-2">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-7 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/4"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-4">
          {renderMarketCards()}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Resumo da Carteira</CardTitle>
            <CardDescription>
              Total investido: {formatCurrency(totalInvestido)}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="h-[300px] w-full px-2">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsAreaChart
                  data={evolucaoData}
                  margin={{ top: 20, right: 20, left: 20, bottom: 0 }}
                >
                  <defs>
                    <linearGradient id="colorValor" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0284c7" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#0284c7" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={(value) => `R$ ${(value / 1000).toFixed(0)}k`} />
                  <Tooltip 
                    formatter={(value) => [formatCurrency(Number(value)), "Valor"]}
                    labelFormatter={(label) => `Mês: ${label}`}
                  />
                  <Area
                    type="monotone"
                    dataKey="valor"
                    stroke="#0284c7"
                    fillOpacity={1}
                    fill="url(#colorValor)"
                  />
                </RechartsAreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Composição</CardTitle>
            <CardDescription>
              Distribuição por categoria
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsPieChart>
                  <Pie
                    data={portfolioData}
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {portfolioData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                  <Legend />
                </RechartsPieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="overview" className="flex items-center gap-2">
              <PieChart className="h-4 w-4" />
              Visão Geral
            </TabsTrigger>
            <TabsTrigger value="list" className="flex items-center gap-2">
              <AreaChart className="h-4 w-4" />
              Lista de Ativos
            </TabsTrigger>
          </TabsList>

          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrar por categoria" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="renda_fixa">Renda Fixa</SelectItem>
              <SelectItem value="renda_variavel">Renda Variável</SelectItem>
              <SelectItem value="cripto">Criptomoedas</SelectItem>
              <SelectItem value="internacional">Internacional</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <TabsContent value="overview" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Resumo por Categoria</CardTitle>
              <CardDescription>
                Detalhamento de investimentos por categoria
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="animate-pulse space-y-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-12 bg-gray-200 rounded"></div>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {portfolioData.length === 0 ? (
                    <p className="text-center text-muted-foreground py-4">
                      Nenhum investimento cadastrado
                    </p>
                  ) : (
                    portfolioData.map((item, index) => (
                      <div key={index} className="flex items-center justify-between pb-4 last:pb-0 border-b last:border-0">
                        <div>
                          <h3 className="font-medium">{item.name}</h3>
                          <p className="text-sm text-muted-foreground">
                            {investimentos.filter(inv => {
                              if (item.name === "Renda Fixa") return inv.categoria === "renda_fixa";
                              if (item.name === "Renda Variável") return inv.categoria === "renda_variavel";
                              if (item.name === "Criptomoedas") return inv.categoria === "cripto";
                              if (item.name === "Internacional") return inv.categoria === "internacional";
                              return false;
                            }).length} ativos
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{formatCurrency(item.value)}</p>
                          <p className="text-sm text-muted-foreground">
                            {(item.value / totalInvestido * 100).toFixed(1)}%
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="list" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Lista de Investimentos</CardTitle>
              <CardDescription>
                {filter !== "all"
                  ? `Investimentos em ${categoriaNomes[filter]}`
                  : "Todos os investimentos"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="animate-pulse space-y-4">
                  <div className="h-10 bg-gray-200 rounded w-full"></div>
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-16 bg-gray-200 rounded w-full"></div>
                  ))}
                </div>
              ) : (
                <ScrollArea className="h-[400px]">
                  {filteredInvestimentos.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">Nenhum investimento encontrado</p>
                      <Button variant="outline" className="mt-4" onClick={() => navigate("/novo-investimento")}>
                        Adicionar Investimento
                      </Button>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nome</TableHead>
                          <TableHead>Tipo</TableHead>
                          <TableHead className="text-right">Valor</TableHead>
                          <TableHead></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredInvestimentos.map((investimento) => (
                          <TableRow 
                            key={investimento.id} 
                            className="cursor-pointer hover:bg-muted/50"
                            onClick={() => navigate(`/investimentos/${investimento.id}`)}
                          >
                            <TableCell>
                              <div>
                                <p className="font-medium">{investimento.nome}</p>
                                <p className="text-sm text-muted-foreground">
                                  {investimento.codigo || 'Sem código'}
                                </p>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">
                                {categoriaNomes[investimento.categoria]}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              {formatCurrency(investimento.valorInicial, investimento.moeda)}
                            </TableCell>
                            <TableCell>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigate(`/editar-investimento/${investimento.id}`);
                                }}
                              >
                                Editar
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </ScrollArea>
              )}
            </CardContent>
            <CardFooter className="flex justify-between border-t pt-4">
              <div>
                <p className="text-sm text-muted-foreground">
                  Total: {filteredInvestimentos.length} investimentos
                </p>
              </div>
              <Button variant="outline" onClick={() => navigate("/investimentos")}>
                Ver todos
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default InvestimentosDashboard;

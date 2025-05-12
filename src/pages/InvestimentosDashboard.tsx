
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Plus, Wallet, PiggyBank, LineChart, DollarSign } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Definições de tipo para os investimentos
interface InvestimentoBase {
  id: string;
  nome: string;
  tipo: string;
  categoria: string;
  codigo: string;
  valorInicial: number;
  dataCompra: string;
  corretora: string;
  moeda: string;
  banco?: string;
  observacoes?: string;
}

interface InvestimentoRendaFixa extends InvestimentoBase {
  rentabilidade: number;
  vencimento: string;
}

interface InvestimentoRendaVariavel extends InvestimentoBase {
  quantidade: number;
  precoUnitario: number;
}

interface InvestimentoCripto extends InvestimentoBase {
  quantidade: number;
  precoUnitario: number;
}

type Investimento = InvestimentoRendaFixa | InvestimentoRendaVariavel | InvestimentoCripto;

// Dados simulados de mercado
interface MarketData {
  index: string;
  value: number;
  change: number;
  lastUpdate: string;
}

// Dados simulados para o painel de cotações
const marketData: MarketData[] = [
  { index: "Ibovespa", value: 129850.42, change: 0.72, lastUpdate: "2024-05-12T12:30:00" },
  { index: "S&P 500", value: 5237.34, change: -0.38, lastUpdate: "2024-05-12T12:30:00" },
  { index: "NASDAQ", value: 16745.12, change: -0.57, lastUpdate: "2024-05-12T12:30:00" },
  { index: "EURO STOXX 50", value: 4985.23, change: 0.31, lastUpdate: "2024-05-12T12:30:00" },
  { index: "Dólar", value: 5.18, change: 0.42, lastUpdate: "2024-05-12T12:30:00" },
  { index: "Euro", value: 5.62, change: 0.25, lastUpdate: "2024-05-12T12:30:00" },
  { index: "Bitcoin", value: 61254.87, change: 2.15, lastUpdate: "2024-05-12T12:30:00" },
  { index: "Ethereum", value: 3058.76, change: 1.87, lastUpdate: "2024-05-12T12:30:00" },
];

// Mock data para representar investimentos em diferentes bancos
const mockInvestimentos: Investimento[] = [
  {
    id: "1",
    nome: "Tesouro IPCA+ 2026",
    tipo: "tesouro",
    categoria: "renda_fixa",
    codigo: "IPCA+ 2026",
    valorInicial: 5000,
    dataCompra: "2023-01-15",
    rentabilidade: 5.75,
    vencimento: "2026-12-15",
    corretora: "Banco do Brasil",
    moeda: "BRL",
    banco: "Banco do Brasil",
    observacoes: "Investimento para segurança"
  },
  {
    id: "2",
    nome: "PETR4",
    tipo: "acao",
    categoria: "renda_variavel",
    codigo: "PETR4",
    valorInicial: 2000,
    dataCompra: "2022-05-10",
    quantidade: 200,
    precoUnitario: 28.75,
    corretora: "BTG Pactual",
    moeda: "BRL",
    banco: "BTG",
  },
  {
    id: "3",
    nome: "Bitcoin",
    tipo: "cripto",
    categoria: "cripto",
    codigo: "BTC",
    valorInicial: 10000,
    dataCompra: "2021-09-22",
    quantidade: 0.025,
    precoUnitario: 40000,
    corretora: "Binance",
    moeda: "USD",
    banco: "Nubank",
  },
  {
    id: "4",
    nome: "ETF S&P 500",
    tipo: "internacional",
    categoria: "internacional",
    codigo: "VOO",
    valorInicial: 5000,
    dataCompra: "2022-01-10",
    quantidade: 15,
    precoUnitario: 380.54,
    corretora: "Avenue",
    moeda: "USD",
    banco: "BTG",
  },
  {
    id: "5",
    nome: "CDB Nubank 120% CDI",
    tipo: "cdb",
    categoria: "renda_fixa",
    codigo: "CDB Nubank",
    valorInicial: 10000,
    dataCompra: "2023-03-20",
    rentabilidade: 120,
    vencimento: "2025-03-20",
    corretora: "Nubank",
    moeda: "BRL",
    banco: "Nubank",
    observacoes: "Liquidez diária após 30 dias"
  },
  {
    id: "6",
    nome: "LCI BTG Pactual",
    tipo: "lci",
    categoria: "renda_fixa",
    codigo: "LCI BTG",
    valorInicial: 20000,
    dataCompra: "2023-06-10",
    rentabilidade: 95,
    vencimento: "2026-06-10",
    corretora: "BTG Pactual",
    moeda: "BRL",
    banco: "BTG",
    observacoes: "Isento de IR"
  }
];

const InvestimentosDashboard = () => {
  const navigate = useNavigate();
  const [investimentos, setInvestimentos] = useState<Investimento[]>(mockInvestimentos);
  const [activeTab, setActiveTab] = useState("todos");
  const [totalPatrimonio, setTotalPatrimonio] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [portfolioSummary, setPortfolioSummary] = useState({
    rendaFixa: 0,
    rendaVariavel: 0,
    cripto: 0,
    internacional: 0,
    total: 0
  });
  const { toast } = useToast();
  
  // Simulação da integração com Open Finance para obter dados
  useEffect(() => {
    const fetchOpenFinanceData = async () => {
      setIsLoading(true);
      try {
        // Aqui seria a chamada para a API do Open Finance
        // Simulando um atraso de carregamento
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Usando os dados mockados por enquanto
        let total = 0;
        let rendaFixa = 0;
        let rendaVariavel = 0;
        let cripto = 0;
        let internacional = 0;
        
        // Simulação de cálculo de patrimônio total e por categoria
        investimentos.forEach(investimento => {
          let valorAtual = investimento.valorInicial;
          
          // Simulação simples de valorização
          if (investimento.categoria === 'renda_variavel') {
            valorAtual *= 1.15;
            rendaVariavel += valorAtual;
          } else if (investimento.categoria === 'renda_fixa') {
            valorAtual *= 1.08;
            rendaFixa += valorAtual;
          } else if (investimento.categoria === 'cripto') {
            valorAtual *= 1.3;
            cripto += valorAtual;
          } else if (investimento.categoria === 'internacional') {
            valorAtual *= 1.2;
            internacional += valorAtual;
          }
          
          // Conversão para BRL se investimento em moeda estrangeira
          if (investimento.moeda === 'USD') {
            valorAtual *= 5.18; // Taxa de câmbio simulada USD -> BRL
          } else if (investimento.moeda === 'EUR') {
            valorAtual *= 5.62; // Taxa de câmbio simulada EUR -> BRL
          }
          
          total += valorAtual;
        });
        
        setTotalPatrimonio(total);
        setPortfolioSummary({
          rendaFixa,
          rendaVariavel,
          cripto,
          internacional,
          total
        });
        
        toast({
          title: "Dados carregados com sucesso",
          description: "Informações de investimentos atualizadas via Open Finance.",
        });
      } catch (error) {
        console.error("Erro ao carregar dados do Open Finance:", error);
        toast({
          variant: "destructive",
          title: "Erro ao carregar dados",
          description: "Não foi possível obter as informações de investimentos.",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchOpenFinanceData();
  }, [toast]);

  // Função para classificar os investimentos por categoria
  const investimentosFiltrados = investimentos.filter(investimento => {
    if (activeTab === "todos") return true;
    if (activeTab === "renda_fixa" && investimento.categoria === "renda_fixa") return true;
    if (activeTab === "renda_variavel" && investimento.categoria === "renda_variavel") return true;
    if (activeTab === "cripto" && investimento.categoria === "cripto") return true;
    if (activeTab === "internacional" && investimento.categoria === "internacional") return true;
    return false;
  });
  
  // Filtrar investimentos por banco
  const filterByBank = (bank: string) => {
    if (bank === "todos") {
      setInvestimentos(mockInvestimentos);
    } else {
      const filtered = mockInvestimentos.filter(inv => inv.banco === bank);
      setInvestimentos(filtered);
    }
  };

  // Formatar valores monetários
  const formatMoney = (value: number, currency: string = "BRL") => {
    return new Intl.NumberFormat('pt-BR', { 
      style: 'currency', 
      currency: currency 
    }).format(value);
  };

  // Formatar datas
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };
  
  // Formatar hora da última atualização
  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Investimentos</h2>
          <p className="text-muted-foreground">
            Gerencie seu portfólio e acompanhe seu patrimônio
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => filterByBank("todos")}>Todos os Bancos</Button>
          <Button variant="outline" onClick={() => filterByBank("Nubank")}>Nubank</Button>
          <Button variant="outline" onClick={() => filterByBank("BTG")}>BTG Pactual</Button>
          <Button onClick={() => navigate("/investimentos/novo")}>
            <Plus className="mr-2 h-4 w-4" /> Novo Investimento
          </Button>
        </div>
      </div>

      {/* Market Data Cards */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Mercado Hoje</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {marketData.slice(0, 4).map((item) => (
            <Card key={item.index} className="overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">{item.index}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {item.index.includes('Bitcoin') || item.index.includes('Ethereum') 
                    ? formatMoney(item.value, 'USD')
                    : item.index === 'Dólar' || item.index === 'Euro'
                      ? formatMoney(item.value, 'BRL')
                      : item.index.includes('Ibovespa') || item.index.includes('S&P') || item.index.includes('NASDAQ') || item.index.includes('EURO')
                        ? new Intl.NumberFormat('pt-BR').format(item.value)
                        : formatMoney(item.value)}
                </div>
                <div className={`flex items-center mt-2 ${item.change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {item.change > 0 ? '+' : ''}{item.change}%
                  <span className="text-xs text-muted-foreground ml-2">
                    Atualizado às {formatTime(item.lastUpdate)}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Portfolio Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Patrimônio Total</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatMoney(totalPatrimonio)}</div>
            <p className="text-xs text-muted-foreground">
              Valor atualizado de todos seus investimentos
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Rendimento Total</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatMoney(totalPatrimonio - investimentos.reduce((acc, inv) => acc + inv.valorInicial, 0))}
            </div>
            <div className="mt-2 flex items-center">
              <span className="text-xs text-green-500">
                +{((totalPatrimonio / investimentos.reduce((acc, inv) => acc + inv.valorInicial, 0) - 1) * 100).toFixed(2)}% do investimento inicial
              </span>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Distribuição</CardTitle>
            <PiggyBank className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span>Renda Fixa</span>
                <span>{Math.round(portfolioSummary.rendaFixa / portfolioSummary.total * 100)}%</span>
              </div>
              <div className="flex justify-between text-xs">
                <span>Renda Variável</span>
                <span>{Math.round(portfolioSummary.rendaVariavel / portfolioSummary.total * 100)}%</span>
              </div>
              <div className="flex justify-between text-xs">
                <span>Criptomoedas</span>
                <span>{Math.round(portfolioSummary.cripto / portfolioSummary.total * 100)}%</span>
              </div>
              <div className="flex justify-between text-xs">
                <span>Internacional</span>
                <span>{Math.round(portfolioSummary.internacional / portfolioSummary.total * 100)}%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="todos" value={activeTab} onValueChange={setActiveTab}>
        <div className="border-b">
          <TabsList className="mb-0">
            <TabsTrigger value="todos">Todos</TabsTrigger>
            <TabsTrigger value="renda_fixa">Renda Fixa</TabsTrigger>
            <TabsTrigger value="renda_variavel">Renda Variável</TabsTrigger>
            <TabsTrigger value="cripto">Criptomoedas</TabsTrigger>
            <TabsTrigger value="internacional">Internacional</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="todos" className="pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {isLoading ? (
              // Loading skeleton
              Array(6).fill(0).map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="h-6 w-2/3 bg-gray-200 rounded animate-pulse"></div>
                    <div className="mt-1 h-4 w-1/3 bg-gray-200 rounded animate-pulse"></div>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <div className="h-4 w-1/4 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-4 w-1/3 bg-gray-200 rounded animate-pulse"></div>
                      </div>
                      <div className="flex justify-between">
                        <div className="h-4 w-1/4 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-4 w-1/3 bg-gray-200 rounded animate-pulse"></div>
                      </div>
                      <div className="flex justify-between">
                        <div className="h-4 w-1/4 bg-gray-200 rounded animate-pulse"></div>
                        <div className="h-4 w-1/3 bg-gray-200 rounded animate-pulse"></div>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="border-t bg-muted/30 pt-3 pb-3 flex justify-end gap-2">
                    <div className="h-8 w-24 bg-gray-200 rounded animate-pulse"></div>
                    <div className="h-8 w-16 bg-gray-200 rounded animate-pulse"></div>
                  </CardFooter>
                </Card>
              ))
            ) : investimentosFiltrados.length > 0 ? (
              investimentosFiltrados.map((investimento) => (
                <Card key={investimento.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <CardTitle className="text-lg">{investimento.nome}</CardTitle>
                      <Badge variant={
                        investimento.categoria === "renda_fixa" ? "outline" :
                        investimento.categoria === "renda_variavel" ? "secondary" :
                        investimento.categoria === "cripto" ? "destructive" :
                        "default"
                      }>
                        {investimento.categoria === "renda_fixa" ? "Renda Fixa" :
                         investimento.categoria === "renda_variavel" ? "Renda Variável" :
                         investimento.categoria === "cripto" ? "Cripto" :
                         investimento.categoria === "internacional" ? "Internacional" :
                         investimento.categoria}
                      </Badge>
                    </div>
                    <CardDescription className="flex items-center mt-1">
                      {investimento.codigo && (
                        <span className="font-medium mr-2">{investimento.codigo}</span>
                      )}
                      {investimento.banco && (
                        <Badge variant="outline" className="mr-2">{investimento.banco}</Badge>
                      )}
                      <LineChart className="h-4 w-4 mr-1 text-muted-foreground" />
                      {formatDate(investimento.dataCompra)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm">Valor inicial:</span>
                        <span className="font-medium">{formatMoney(investimento.valorInicial, investimento.moeda)}</span>
                      </div>
                      {"quantidade" in investimento && "precoUnitario" in investimento && (
                        <div className="flex justify-between">
                          <span className="text-sm">Quantidade:</span>
                          <span className="font-medium">{investimento.quantidade} x {formatMoney(investimento.precoUnitario, investimento.moeda)}</span>
                        </div>
                      )}
                      {"rentabilidade" in investimento && (
                        <div className="flex justify-between">
                          <span className="text-sm">Rentabilidade:</span>
                          <span className="font-medium">{investimento.rentabilidade}% a.a.</span>
                        </div>
                      )}
                      {"vencimento" in investimento && (
                        <div className="flex justify-between">
                          <span className="text-sm">Vencimento:</span>
                          <span className="font-medium">{formatDate(investimento.vencimento)}</span>
                        </div>
                      )}
                      {investimento.corretora && (
                        <div className="flex justify-between">
                          <span className="text-sm">Corretora:</span>
                          <span className="font-medium">{investimento.corretora}</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                  <CardFooter className="border-t bg-muted/30 pt-3 pb-3 flex justify-end gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => navigate(`/investimentos/${investimento.id}`)}
                    >
                      Ver detalhes
                    </Button>
                    <Button 
                      size="sm" 
                      onClick={() => navigate(`/investimentos/editar/${investimento.id}`)}
                    >
                      Editar
                    </Button>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center p-8 text-center">
                <TrendingUp className="h-10 w-10 text-muted-foreground mb-3" />
                <h3 className="text-lg font-medium">Nenhum investimento encontrado</h3>
                <p className="text-muted-foreground">
                  Clique em "Novo Investimento" para começar a registrar seu portfólio
                </p>
              </div>
            )}
          </div>
        </TabsContent>
        
        {['renda_fixa', 'renda_variavel', 'cripto', 'internacional'].map((categoria) => (
          <TabsContent value={categoria} key={categoria} className="pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Content will be filtered automatically by the logic above */}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default InvestimentosDashboard;

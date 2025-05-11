
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Plus, Wallet, PiggyBank, LineChart, DollarSign } from "lucide-react";
import { Investimento } from "@/types";

// Mock data
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
    corretora: "XP Investimentos",
    moeda: "BRL"
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
    moeda: "USD"
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
    moeda: "USD"
  }
];

const Investimentos = () => {
  const navigate = useNavigate();
  const [investimentos] = useState<Investimento[]>(mockInvestimentos);
  const [activeTab, setActiveTab] = useState("todos");
  const [totalPatrimonio, setTotalPatrimonio] = useState(0);
  
  // Simular a atualização do valor dos investimentos com base nos preços de mercado
  useEffect(() => {
    let total = 0;
    
    // Simulação de cálculo de patrimônio total
    investimentos.forEach(investimento => {
      let valorAtual = investimento.valorInicial;
      
      // Simulação simples de valorização
      if (investimento.tipo === 'acao' || investimento.tipo === 'internacional') {
        // Valorização de 15% para ações e investimentos internacionais
        valorAtual *= 1.15;
      } else if (investimento.tipo === 'tesouro' || investimento.tipo === 'cdb' || investimento.tipo === 'lci' || investimento.tipo === 'lca') {
        // Valorização de 8% para renda fixa
        valorAtual *= 1.08;
      } else if (investimento.tipo === 'cripto') {
        // Volatilidade maior para criptomoedas
        valorAtual *= 1.3;
      } else {
        // Valorização mínima para outros tipos
        valorAtual *= 1.03;
      }
      
      // Conversão para BRL se investimento em moeda estrangeira
      if (investimento.moeda === 'USD') {
        valorAtual *= 5.5; // Taxa de câmbio simulada USD -> BRL
      } else if (investimento.moeda === 'EUR') {
        valorAtual *= 6.2; // Taxa de câmbio simulada EUR -> BRL
      }
      
      total += valorAtual;
    });
    
    setTotalPatrimonio(total);
  }, [investimentos]);

  // Função para classificar os investimentos por categoria
  const investimentosFiltrados = investimentos.filter(investimento => {
    if (activeTab === "todos") return true;
    if (activeTab === "renda_fixa" && investimento.categoria === "renda_fixa") return true;
    if (activeTab === "renda_variavel" && investimento.categoria === "renda_variavel") return true;
    if (activeTab === "cripto" && investimento.categoria === "cripto") return true;
    if (activeTab === "internacional" && investimento.categoria === "internacional") return true;
    return false;
  });

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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Investimentos</h2>
          <p className="text-muted-foreground">
            Gerencie seu portfólio e acompanhe seu patrimônio
          </p>
        </div>
        <Button onClick={() => navigate("/investimentos/novo")}>
          <Plus className="mr-2 h-4 w-4" /> Novo Investimento
        </Button>
      </div>

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
                <span>{Math.round(investimentos.filter(i => i.categoria === "renda_fixa").length / investimentos.length * 100)}%</span>
              </div>
              <div className="flex justify-between text-xs">
                <span>Renda Variável</span>
                <span>{Math.round(investimentos.filter(i => i.categoria === "renda_variavel").length / investimentos.length * 100)}%</span>
              </div>
              <div className="flex justify-between text-xs">
                <span>Criptomoedas</span>
                <span>{Math.round(investimentos.filter(i => i.categoria === "cripto").length / investimentos.length * 100)}%</span>
              </div>
              <div className="flex justify-between text-xs">
                <span>Internacional</span>
                <span>{Math.round(investimentos.filter(i => i.categoria === "internacional").length / investimentos.length * 100)}%</span>
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
            {investimentosFiltrados.length > 0 ? (
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
                      {investimento.quantidade && investimento.precoUnitario && (
                        <div className="flex justify-between">
                          <span className="text-sm">Quantidade:</span>
                          <span className="font-medium">{investimento.quantidade} x {formatMoney(investimento.precoUnitario, investimento.moeda)}</span>
                        </div>
                      )}
                      {investimento.rentabilidade && (
                        <div className="flex justify-between">
                          <span className="text-sm">Rentabilidade:</span>
                          <span className="font-medium">{investimento.rentabilidade}% a.a.</span>
                        </div>
                      )}
                      {investimento.vencimento && (
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
              {/* Conteúdo será filtrado automaticamente pela lógica acima */}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default Investimentos;

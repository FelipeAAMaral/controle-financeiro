import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Plus, Wallet, PiggyBank, LineChart, DollarSign } from "lucide-react";
import { Investimento } from "@/types";
import { InvestimentosService } from "@/services/investimentosService";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export default function Investimentos() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [investimentos, setInvestimentos] = useState<Investimento[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadInvestimentos = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        const investimentosService = new InvestimentosService();
        const data = await investimentosService.getInvestimentos(user.id);
        setInvestimentos(data);
      } catch (error) {
        console.error('Erro ao carregar investimentos:', error);
        toast.error('Erro ao carregar investimentos');
      } finally {
        setIsLoading(false);
      }
    };

    loadInvestimentos();
  }, [user]);

  const formatCurrency = (value: number, currency: string) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: currency
    }).format(value);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getCategoriaBadge = (categoria: string) => {
    const badges: Record<string, { label: string; variant: "default" | "secondary" | "outline" }> = {
      renda_fixa: { label: "Renda Fixa", variant: "default" },
      renda_variavel: { label: "Renda Variável", variant: "secondary" },
      cripto: { label: "Criptomoedas", variant: "outline" },
      internacional: { label: "Internacional", variant: "secondary" }
    };

    const badge = badges[categoria] || { label: categoria, variant: "outline" };
    return <Badge variant={badge.variant}>{badge.label}</Badge>;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <p>Carregando investimentos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Meus Investimentos</h1>
        <Button onClick={() => navigate("/investimentos/novo")}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Investimento
        </Button>
      </div>

      <Tabs defaultValue="todos" className="space-y-4">
        <TabsList>
          <TabsTrigger value="todos">Todos</TabsTrigger>
          <TabsTrigger value="renda_fixa">Renda Fixa</TabsTrigger>
          <TabsTrigger value="renda_variavel">Renda Variável</TabsTrigger>
          <TabsTrigger value="cripto">Criptomoedas</TabsTrigger>
          <TabsTrigger value="internacional">Internacional</TabsTrigger>
        </TabsList>

        <TabsContent value="todos" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {investimentos.map((investimento) => (
              <Card key={investimento.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{investimento.nome}</CardTitle>
                      <CardDescription>{investimento.codigo}</CardDescription>
                    </div>
                    {getCategoriaBadge(investimento.categoria)}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <Wallet className="mr-2 h-4 w-4" />
                      <span>
                        Valor: {formatCurrency(investimento.valorInicial, investimento.moeda)}
                      </span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Calendar className="mr-2 h-4 w-4" />
                      <span>Data: {formatDate(investimento.dataCompra)}</span>
                    </div>
                    {investimento.rentabilidade && (
                      <div className="flex items-center text-sm">
                        <TrendingUp className="mr-2 h-4 w-4" />
                        <span>Rentabilidade: {investimento.rentabilidade}%</span>
                      </div>
                    )}
                    {investimento.vencimento && (
                      <div className="flex items-center text-sm">
                        <Calendar className="mr-2 h-4 w-4" />
                        <span>Vencimento: {formatDate(investimento.vencimento)}</span>
                      </div>
                    )}
                    <div className="flex items-center text-sm">
                      <PiggyBank className="mr-2 h-4 w-4" />
                      <span>Corretora: {investimento.corretora}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => navigate(`/investimentos/${investimento.id}`)}
                  >
                    Ver Detalhes
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>

        {['renda_fixa', 'renda_variavel', 'cripto', 'internacional'].map((categoria) => (
          <TabsContent key={categoria} value={categoria} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {investimentos
                .filter((investimento) => investimento.categoria === categoria)
                .map((investimento) => (
                  <Card key={investimento.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle>{investimento.nome}</CardTitle>
                          <CardDescription>{investimento.codigo}</CardDescription>
                        </div>
                        {getCategoriaBadge(investimento.categoria)}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex items-center text-sm">
                          <Wallet className="mr-2 h-4 w-4" />
                          <span>
                            Valor: {formatCurrency(investimento.valorInicial, investimento.moeda)}
                          </span>
                        </div>
                        <div className="flex items-center text-sm">
                          <Calendar className="mr-2 h-4 w-4" />
                          <span>Data: {formatDate(investimento.dataCompra)}</span>
                        </div>
                        {investimento.rentabilidade && (
                          <div className="flex items-center text-sm">
                            <TrendingUp className="mr-2 h-4 w-4" />
                            <span>Rentabilidade: {investimento.rentabilidade}%</span>
                          </div>
                        )}
                        {investimento.vencimento && (
                          <div className="flex items-center text-sm">
                            <Calendar className="mr-2 h-4 w-4" />
                            <span>Vencimento: {formatDate(investimento.vencimento)}</span>
                          </div>
                        )}
                        <div className="flex items-center text-sm">
                          <PiggyBank className="mr-2 h-4 w-4" />
                          <span>Corretora: {investimento.corretora}</span>
                        </div>
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => navigate(`/investimentos/${investimento.id}`)}
                      >
                        Ver Detalhes
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

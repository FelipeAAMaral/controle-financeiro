import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, ArrowUpRight, ArrowDownRight, Calendar, DollarSign } from "lucide-react";
import { Transacao } from "@/types";
import { TransacoesService } from "@/services/transacoesService";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export default function Transacoes() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [transacoes, setTransacoes] = useState<Transacao[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadTransacoes = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        const transacoesService = new TransacoesService();
        const data = await transacoesService.getTransacoes(user.id);
        setTransacoes(data);
      } catch (error) {
        console.error('Erro ao carregar transações:', error);
        toast.error('Erro ao carregar transações');
      } finally {
        setIsLoading(false);
      }
    };

    loadTransacoes();
  }, [user]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getTypeBadge = (type: 'entrada' | 'saida') => {
    return type === 'entrada' ? (
      <Badge className="bg-green-500">Entrada</Badge>
    ) : (
      <Badge variant="destructive">Saída</Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <p>Carregando transações...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Minhas Transações</h1>
        <Button onClick={() => navigate("/transacoes/nova")}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Transação
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {transacoes.map((transacao) => (
          <Card key={transacao.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{transacao.description}</CardTitle>
                  <CardDescription>{transacao.category}</CardDescription>
                </div>
                {getTypeBadge(transacao.type)}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center text-sm">
                  <Calendar className="mr-2 h-4 w-4" />
                  <span>Data: {formatDate(transacao.date)}</span>
                </div>
                <div className="flex items-center text-sm">
                  <DollarSign className="mr-2 h-4 w-4" />
                  <span>
                    Valor: {formatCurrency(transacao.amount)}
                  </span>
                </div>
                <div className="flex items-center text-sm">
                  {transacao.type === 'entrada' ? (
                    <ArrowUpRight className="mr-2 h-4 w-4 text-green-500" />
                  ) : (
                    <ArrowDownRight className="mr-2 h-4 w-4 text-red-500" />
                  )}
                  <span>Conta: {transacao.account}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => navigate(`/transacoes/${transacao.id}`)}
              >
                Ver Detalhes
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}

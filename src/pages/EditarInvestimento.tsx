
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import InvestimentoForm from "@/components/forms/InvestimentoForm";
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

export default function EditarInvestimento() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [investimento, setInvestimento] = useState<Investimento | null>(null);
  
  useEffect(() => {
    // In a real app, you would fetch the investment data from an API
    // For now, we'll simulate loading data
    setIsLoading(true);
    setTimeout(() => {
      const foundInvestimento = mockInvestimentos.find(i => i.id === id);
      
      if (foundInvestimento) {
        setInvestimento(foundInvestimento);
      } else {
        toast.error("Investimento não encontrado");
        navigate("/investimentos");
      }
      
      setIsLoading(false);
    }, 300);
  }, [id, navigate]);
  
  const handleSubmit = (data: any) => {
    setIsSubmitting(true);
    
    // Here you would typically send the data to your backend
    // Simulate an API call with setTimeout
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success("Investimento atualizado com sucesso!");
      navigate("/investimentos");
    }, 500);
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <p>Carregando detalhes do investimento...</p>
        </div>
      </div>
    );
  }
  
  if (!investimento) {
    return null;
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate("/investimentos")}
          className="mr-2"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Voltar
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">Editar Investimento</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Detalhes do Investimento</CardTitle>
        </CardHeader>
        <CardContent>
          <InvestimentoForm 
            onClose={() => navigate("/investimentos")} 
            onSubmit={handleSubmit}
            initialData={investimento}
            isSubmitting={isSubmitting}
            isEdit={true}
          />
        </CardContent>
      </Card>
    </div>
  );
}

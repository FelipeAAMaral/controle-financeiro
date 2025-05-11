
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import TransacaoForm from "@/components/forms/TransacaoForm";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Transacao } from "@/types";

// Mock data - In a real app, this would be fetched from an API
const mockTransactions: Transacao[] = [
  {
    id: "1",
    description: "Salário",
    date: "2023-05-05",
    amount: 4500,
    type: "entrada",
    category: "Salário",
    account: "Nubank",
  },
  {
    id: "2",
    description: "Mercado",
    date: "2023-05-08",
    amount: -456.78,
    type: "saida",
    category: "Alimentação",
    account: "Nubank",
  }
];

export default function EditarTransacao() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [transacao, setTransacao] = useState<Transacao | null>(null);
  
  useEffect(() => {
    // In a real app, you would fetch the transaction data from an API
    // For now, we'll simulate loading data
    setIsLoading(true);
    setTimeout(() => {
      const foundTransaction = mockTransactions.find(t => t.id === id);
      
      if (foundTransaction) {
        setTransacao(foundTransaction);
      } else {
        toast.error("Transação não encontrada");
        navigate("/transacoes");
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
      toast.success("Transação atualizada com sucesso!");
      navigate("/transacoes");
    }, 500);
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <p>Carregando detalhes da transação...</p>
        </div>
      </div>
    );
  }
  
  if (!transacao) {
    return null;
  }
  
  const formData = {
    id: transacao.id,
    description: transacao.description,
    amount: Math.abs(transacao.amount).toString(),
    date: transacao.date,
    type: transacao.type,
    category: transacao.category,
    account: transacao.account,
    benefitType: transacao.benefitType || "",
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate("/transacoes")}
          className="mr-2"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Voltar
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">Editar Transação</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Detalhes da Transação</CardTitle>
        </CardHeader>
        <CardContent>
          <TransacaoForm 
            onClose={() => navigate("/transacoes")} 
            onSubmit={handleSubmit}
            initialData={formData}
            isSubmitting={isSubmitting}
            isEdit={true}
          />
        </CardContent>
      </Card>
    </div>
  );
}

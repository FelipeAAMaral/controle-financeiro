
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import ObjetivoForm from "@/components/forms/ObjetivoForm";

// Mock data for demonstration purposes
const mockGoals = [
  {
    id: "1",
    title: "Fundo de emergência",
    currentAmount: "5000",
    targetAmount: "15000",
    deadline: "2023-12-31",
    icon: "🛡️",
    color: "bg-blue-500",
  },
  {
    id: "2",
    title: "Viagem para Europa",
    currentAmount: "3200",
    targetAmount: "12000",
    deadline: "2024-07-31",
    icon: "✈️",
    color: "bg-purple-500",
  }
];

export default function EditarObjetivo() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [objetivo, setObjetivo] = useState<any>(null);
  
  useEffect(() => {
    // In a real app, you would fetch the goal data from an API
    // For now, we'll simulate loading data
    setIsLoading(true);
    setTimeout(() => {
      const foundGoal = mockGoals.find(g => g.id === id);
      
      if (foundGoal) {
        setObjetivo(foundGoal);
      } else {
        toast.error("Objetivo não encontrado");
        navigate("/objetivos");
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
      toast.success("Objetivo atualizado com sucesso!");
      navigate("/objetivos");
    }, 500);
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <p>Carregando detalhes do objetivo...</p>
        </div>
      </div>
    );
  }
  
  if (!objetivo) {
    return null;
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate("/objetivos")}
          className="mr-2"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Voltar
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">Editar Objetivo</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Detalhes do Objetivo</CardTitle>
        </CardHeader>
        <CardContent>
          <ObjetivoForm 
            onClose={() => navigate("/objetivos")} 
            onSubmit={handleSubmit}
            initialData={objetivo}
            isSubmitting={isSubmitting}
            isEdit={true}
          />
        </CardContent>
      </Card>
    </div>
  );
}

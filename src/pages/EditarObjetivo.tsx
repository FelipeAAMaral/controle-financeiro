
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import ObjetivoForm from "@/components/forms/ObjetivoForm";
import { useAuth } from "@/hooks/useAuth";

// Mock data for demonstration purposes with user association and thumbnails
const mockGoals = [
  {
    id: "1",
    title: "Fundo de emergência",
    currentAmount: "5000",
    targetAmount: "15000",
    deadline: "2023-12-31",
    icon: "🛡️",
    color: "bg-blue-500",
    user_id: "8b55fd41-e80c-4155-8d5a-730603654e17",
    thumbnail: "https://images.unsplash.com/photo-1618160702438-9b02ab6515c9"
  },
  {
    id: "2",
    title: "Viagem para Europa",
    currentAmount: "3200",
    targetAmount: "12000",
    deadline: "2024-07-31",
    icon: "✈️",
    color: "bg-purple-500",
    user_id: "8b55fd41-e80c-4155-8d5a-730603654e17",
    thumbnail: "https://images.unsplash.com/photo-1721322800607-8c38375eef04"
  },
  {
    id: "3",
    title: "Novo notebook",
    currentAmount: "2800",
    targetAmount: "4000",
    deadline: "2023-09-30",
    icon: "💻",
    color: "bg-green-500",
    user_id: "8b55fd41-e80c-4155-8d5a-730603654e17",
    thumbnail: "https://images.unsplash.com/photo-1472396961693-142e6e269027"
  },
  {
    id: "4",
    title: "Entrada apartamento",
    currentAmount: "15000",
    targetAmount: "80000",
    deadline: "2026-01-31",
    icon: "🏠",
    color: "bg-orange-500",
    user_id: "8b55fd41-e80c-4155-8d5a-730603654e17",
    thumbnail: "https://images.unsplash.com/photo-1466721591366-2d5fba72006d"
  }
];

export default function EditarObjetivo() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [objetivo, setObjetivo] = useState<any>(null);
  const { user } = useAuth();
  
  useEffect(() => {
    // In a real app, you would fetch the goal data from an API
    // For now, we'll simulate loading data
    setIsLoading(true);
    setTimeout(() => {
      // Filter by both ID and user_id for security
      const foundGoal = mockGoals.find(g => g.id === id && g.user_id === user?.id);
      
      if (foundGoal) {
        console.log("Goal found:", foundGoal);
        setObjetivo(foundGoal);
      } else {
        console.log("Goal not found for ID:", id, "and user:", user?.id);
        toast.error("Objetivo não encontrado");
        navigate("/objetivos");
      }
      
      setIsLoading(false);
    }, 300);
  }, [id, navigate, user?.id]);
  
  const handleSubmit = (data: any) => {
    setIsSubmitting(true);
    console.log("Submitting updated goal data:", data);
    
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

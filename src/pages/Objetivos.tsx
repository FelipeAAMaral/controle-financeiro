
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { PlusCircle, Edit, Trash2, Image } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { AspectRatio } from "@/components/ui/aspect-ratio";

// Updated type definition for objectives
type Objetivo = {
  id: string;
  title: string;
  currentAmount: string; // Changed from number to string to match form expectations
  targetAmount: string;
  deadline: string;
  icon: string;
  color: string;
  user_id: string;
  thumbnail?: string;
}

const mockGoals: Objetivo[] = [
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

export default function Objetivos() {
  const [objetivos, setObjetivos] = useState<Objetivo[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useAuth();
  
  useEffect(() => {
    console.log("Objetivos: Fetching user goals");
    setIsLoading(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      // Filter goals by user_id
      const userGoals = mockGoals.filter(goal => goal.user_id === user?.id);
      console.log("Objetivos: User goals fetched", userGoals);
      setObjetivos(userGoals);
      setIsLoading(false);
    }, 500);
  }, [user]);
  
  const handleAddNewGoal = () => {
    navigate("/objetivos/novo");
  };

  const handleEditGoal = (goalId: string) => {
    console.log(`Editing goal with ID: ${goalId}`);
    navigate(`/objetivos/editar/${goalId}`);
  };

  const handleDeleteGoal = (goalId: string) => {
    console.log(`Deleting goal with ID: ${goalId}`);
    // In a real app, you would make an API call here
    setObjetivos(prevGoals => prevGoals.filter(goal => goal.id !== goalId));
    toast.success("Objetivo removido com sucesso!");
  };
  
  // Calculate percentage of goal completion
  const calculateProgress = (current: string, target: string) => {
    const currentVal = parseFloat(current);
    const targetVal = parseFloat(target);
    
    if (isNaN(currentVal) || isNaN(targetVal) || targetVal === 0) return 0;
    
    const percentage = (currentVal / targetVal) * 100;
    return Math.min(100, Math.max(0, percentage));
  };
  
  const formatCurrency = (value: string) => {
    const numValue = parseFloat(value);
    
    if (isNaN(numValue)) return 'R$ 0,00';
    
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(numValue);
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'Data inválida';
    
    return new Intl.DateTimeFormat('pt-BR').format(date);
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <p>Carregando objetivos...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Meus Objetivos Financeiros</h1>
          <p className="text-muted-foreground">
            Gerencie seus objetivos e acompanhe seu progresso
          </p>
        </div>
        <Button onClick={handleAddNewGoal} className="flex items-center gap-1">
          <PlusCircle className="h-4 w-4" />
          Novo Objetivo
        </Button>
      </div>
      
      {objetivos.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 bg-muted/40 rounded-md">
          <p className="text-muted-foreground mb-4">Você ainda não tem objetivos cadastrados.</p>
          <Button onClick={handleAddNewGoal}>
            <PlusCircle className="h-4 w-4 mr-2" />
            Criar Objetivo
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {objetivos.map((objetivo) => (
            <Card key={objetivo.id} className="overflow-hidden">
              {objetivo.thumbnail ? (
                <div className="relative">
                  <AspectRatio ratio={16/9}>
                    <img 
                      src={objetivo.thumbnail} 
                      alt={objetivo.title} 
                      className="object-cover w-full h-full"
                    />
                  </AspectRatio>
                  <div className={`absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4`}>
                    <div className="flex w-full justify-between items-center">
                      <CardTitle className="flex items-center gap-2 text-white">
                        <span className="text-xl">{objetivo.icon}</span>
                        {objetivo.title}
                      </CardTitle>
                      <div className="flex space-x-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-white hover:bg-white/20"
                          onClick={() => handleEditGoal(objetivo.id)}
                        >
                          <Edit className="h-4 w-4" />
                          <span className="sr-only">Editar</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-white hover:bg-white/20"
                          onClick={() => handleDeleteGoal(objetivo.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                          <span className="sr-only">Excluir</span>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <CardHeader className={`${objetivo.color} text-white flex flex-row items-center`}>
                  <div className="flex-1">
                    <CardTitle className="flex items-center gap-2">
                      <span className="text-xl">{objetivo.icon}</span>
                      {objetivo.title}
                    </CardTitle>
                  </div>
                  <div className="flex space-x-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-white hover:bg-white/20"
                      onClick={() => handleEditGoal(objetivo.id)}
                    >
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Editar</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="text-white hover:bg-white/20"
                      onClick={() => handleDeleteGoal(objetivo.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Excluir</span>
                    </Button>
                  </div>
                </CardHeader>
              )}
              <CardContent className="p-6">
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Progresso</span>
                  <span className="text-sm font-medium">
                    {Math.round(calculateProgress(objetivo.currentAmount, objetivo.targetAmount))}%
                  </span>
                </div>
                <Progress 
                  value={calculateProgress(objetivo.currentAmount, objetivo.targetAmount)}
                  className="h-2 mb-4"
                />
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Economizado</span>
                    <span className="font-medium">{formatCurrency(objetivo.currentAmount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Meta</span>
                    <span className="font-medium">{formatCurrency(objetivo.targetAmount)}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="bg-muted/40 py-3 px-6">
                <div className="flex justify-between w-full text-sm">
                  <span className="text-muted-foreground">Prazo</span>
                  <span className="font-medium">{formatDate(objetivo.deadline)}</span>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

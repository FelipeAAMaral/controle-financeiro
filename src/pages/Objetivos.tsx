
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Edit, Trash2, PiggyBank } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import ObjetivoForm from "@/components/forms/ObjetivoForm";
import { toast } from "sonner";
import { objetivoService } from "@/services/objetivoService";
import { useUserData } from "@/hooks/useUserData";
import { Objetivo } from "@/types";

// Dados de exemplo - agora associados ao usuário
const mockGoals = [
  {
    id: "1",
    title: "Fundo de emergência",
    currentAmount: 5000,
    targetAmount: 15000,
    deadline: "2023-12-31",
    icon: "🛡️",
    color: "bg-blue-500",
    user_id: "8b55fd41-e80c-4155-8d5a-730603654e17" // ID do usuário amaral.felipeaugusto@gmail.com
  },
  {
    id: "2",
    title: "Viagem para Europa",
    currentAmount: 3200,
    targetAmount: 12000,
    deadline: "2024-07-31",
    icon: "✈️",
    color: "bg-purple-500",
    user_id: "8b55fd41-e80c-4155-8d5a-730603654e17" // ID do usuário amaral.felipeaugusto@gmail.com
  },
  {
    id: "3",
    title: "Novo notebook",
    currentAmount: 2800,
    targetAmount: 4000,
    deadline: "2023-09-30",
    icon: "💻",
    color: "bg-green-500",
    user_id: "8b55fd41-e80c-4155-8d5a-730603654e17" // ID do usuário amaral.felipeaugusto@gmail.com
  },
  {
    id: "4",
    title: "Entrada apartamento",
    currentAmount: 15000,
    targetAmount: 80000,
    deadline: "2026-01-31",
    icon: "🏠",
    color: "bg-orange-500",
    user_id: "8b55fd41-e80c-4155-8d5a-730603654e17" // ID do usuário amaral.felipeaugusto@gmail.com
  },
];

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("pt-BR").format(date);
};

// Form para adicionar/editar objetivos
const ObjetivoFormDialog = ({ 
  onClose, 
  initialData,
  isEdit = false 
}: { 
  onClose: () => void,
  initialData?: Objetivo,
  isEdit?: boolean
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const handleSubmit = async (data: any) => {
    if (!user) return;
    
    setIsSubmitting(true);
    try {
      // Aqui você implementaria a lógica real para salvar no banco de dados
      // Por enquanto, simulamos uma chamada de API bem-sucedida
      toast.success(isEdit ? "Objetivo atualizado com sucesso!" : "Objetivo criado com sucesso!");
      
      // Se estiver editando, você pode navegar para a página de detalhes ou atualizar a listagem
      if (isEdit) {
        // Simular uma atualização
        console.log("Atualizando objetivo:", data);
      } else {
        // Simular uma criação
        console.log("Criando novo objetivo:", data);
      }
    } catch (error) {
      console.error("Erro ao salvar objetivo:", error);
      toast.error("Ocorreu um erro ao salvar o objetivo");
    } finally {
      setIsSubmitting(false);
      onClose();
    }
  };

  return (
    <ObjetivoForm 
      onClose={onClose} 
      onSubmit={handleSubmit}
      initialData={initialData}
      isSubmitting={isSubmitting}
      isEdit={isEdit}
    />
  );
};

const Objetivos = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [goals, setGoals] = useState(mockGoals);
  const navigate = useNavigate();
  const { user } = useAuth();

  // Calcular totais
  const totalSaved = goals.reduce((sum, goal) => sum + goal.currentAmount, 0);
  const totalTarget = goals.reduce((sum, goal) => sum + goal.targetAmount, 0);
  const averageProgress = Math.round((totalSaved / totalTarget) * 100);

  const handleEditClick = (goalId: string | number) => {
    // Navegar para a página de edição de objetivo
    navigate(`/objetivos/editar/${goalId}`);
  };

  const handleDeleteClick = (goalId: string | number) => {
    // Implementar lógica de exclusão
    if (confirm("Tem certeza que deseja excluir este objetivo?")) {
      // Removendo o objetivo do array local (simulação)
      const filteredGoals = goals.filter(goal => goal.id !== goalId);
      setGoals(filteredGoals);
      toast.success("Objetivo excluído com sucesso!");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Meus Objetivos</h1>
          <p className="text-gray-500">Acompanhe o progresso dos seus objetivos financeiros</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Novo Objetivo
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Cadastrar Objetivo</DialogTitle>
            </DialogHeader>
            <ObjetivoFormDialog onClose={() => setIsDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <PiggyBank className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Progresso Geral</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Economia Total</span>
              <span className="font-medium">{formatCurrency(totalSaved)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Meta Total</span>
              <span className="font-medium">{formatCurrency(totalTarget)}</span>
            </div>
            <Progress value={averageProgress} className="h-2 my-2" />
            <div className="flex justify-between text-sm">
              <span>{averageProgress}% concluído</span>
              <span>Falta {formatCurrency(totalTarget - totalSaved)}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {goals.map((goal) => {
          const percentage = Math.round((goal.currentAmount / goal.targetAmount) * 100);
          
          return (
            <Card key={goal.id} className="animated-card">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <div className={`w-10 h-10 rounded-full ${goal.color} flex items-center justify-center text-white`}>
                      {goal.icon}
                    </div>
                    <CardTitle className="text-base">{goal.title}</CardTitle>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8"
                      onClick={() => handleEditClick(goal.id)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 text-red-500"
                      onClick={() => handleDeleteClick(goal.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pb-2 space-y-2">
                <Progress value={percentage} className="h-2" />
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground font-medium">{formatCurrency(goal.currentAmount)}</span>
                  <span className="text-muted-foreground">Meta: {formatCurrency(goal.targetAmount)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{percentage}% concluído</span>
                  <span className="text-muted-foreground">Falta {formatCurrency(goal.targetAmount - goal.currentAmount)}</span>
                </div>
              </CardContent>
              <CardFooter className="pt-0">
                <div className="w-full flex justify-between items-center text-xs text-muted-foreground">
                  <span>Prazo: {formatDate(goal.deadline)}</span>
                  <Button variant="outline" size="sm" className="h-8 text-xs">
                    Adicionar Valor
                  </Button>
                </div>
              </CardFooter>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default Objetivos;

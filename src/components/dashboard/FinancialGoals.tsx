import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { DashboardService } from "@/services/dashboardService";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  category: string;
}

const FinancialGoals = () => {
  const { user } = useAuth();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadGoals = async () => {
      if (!user) return;

      try {
        setLoading(true);
        const dashboardService = new DashboardService();
        const goalsData = await dashboardService.getFinancialGoals(user.id);
        setGoals(goalsData);
      } catch (error) {
        console.error('Erro ao carregar objetivos financeiros:', error);
        toast.error('Erro ao carregar objetivos financeiros');
      } finally {
        setLoading(false);
      }
    };

    loadGoals();
  }, [user]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[...Array(2)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="h-4 w-24 bg-gray-200 rounded animate-pulse mb-4" />
              <div className="h-2 w-full bg-gray-200 rounded animate-pulse" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (goals.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center p-6 space-y-4">
          <p className="text-gray-500 text-center">
            Você ainda não tem nenhum objetivo financeiro cadastrado. Defina seus objetivos para acompanhar seu progresso financeiro.
          </p>
          <Button onClick={() => navigate('/objetivos/novo')}>
            Criar Primeiro Objetivo
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {goals.map((goal) => {
        const progress = (goal.currentAmount / goal.targetAmount) * 100;
        const daysLeft = Math.ceil((new Date(goal.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

        return (
          <Card key={goal.id}>
            <CardHeader>
              <CardTitle>{goal.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Progresso</span>
                    <span>{progress.toFixed(1)}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
                <div className="flex justify-between text-sm">
                  <span>Valor Atual</span>
                  <span>R$ {goal.currentAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Meta</span>
                  <span>R$ {goal.targetAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Prazo</span>
                  <span>{daysLeft} dias restantes</span>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default FinancialGoals;

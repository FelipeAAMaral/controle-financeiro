
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useUserData } from "@/hooks/useUserData";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Objetivo } from "@/services/objetivoService";
import { useNavigate } from "react-router-dom";

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

const FinancialGoals = () => {
  const { user } = useAuth();
  const { data: goals, loading, error } = useUserData<Objetivo>('goals');
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold tracking-tight">
            Meus Objetivos
          </h2>
          <Button variant="outline">Adicionar Objetivo</Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32 w-full rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Erro</AlertTitle>
        <AlertDescription>
          Não foi possível carregar os objetivos. Tente novamente mais tarde.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">
            Meus Objetivos
          </h2>
          <p className="text-sm text-gray-500">Acompanhe o progresso dos seus objetivos financeiros</p>
        </div>
        <Button variant="outline" onClick={() => navigate("/objetivos/novo")}>Adicionar Objetivo</Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {goals && goals.length > 0 ? (
          goals.map((goal) => {
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
                    <span className="text-sm font-medium">{percentage}%</span>
                  </div>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="space-y-2">
                    <Progress value={percentage} className="h-2" />
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground font-medium">{formatCurrency(goal.currentAmount)}</span>
                      <span className="text-muted-foreground">Meta: {formatCurrency(goal.targetAmount)}</span>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-0">
                  <div className="w-full flex justify-between items-center text-xs text-muted-foreground">
                    <span>Prazo: {goal.deadline}</span>
                    <Button variant="ghost" size="sm" className="h-8 text-xs">
                      Adicionar Valor
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            );
          })
        ) : (
          <div className="col-span-2 text-center py-8 border rounded-lg bg-gray-50">
            <p className="text-muted-foreground">Você ainda não tem objetivos definidos.</p>
            <Button variant="outline" className="mt-4" onClick={() => navigate("/objetivos/novo")}>
              Criar meu primeiro objetivo
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default FinancialGoals;

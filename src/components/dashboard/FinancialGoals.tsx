
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const goals = [
  {
    id: 1,
    title: "Fundo de emergência",
    currentAmount: 5000,
    targetAmount: 15000,
    deadline: "Dezembro 2023",
    icon: "🛡️",
    color: "bg-blue-500",
  },
  {
    id: 2,
    title: "Viagem para Europa",
    currentAmount: 3200,
    targetAmount: 12000,
    deadline: "Julho 2024",
    icon: "✈️",
    color: "bg-purple-500",
  },
  {
    id: 3,
    title: "Novo notebook",
    currentAmount: 2800,
    targetAmount: 4000,
    deadline: "Setembro 2023",
    icon: "💻",
    color: "bg-green-500",
  },
  {
    id: 4,
    title: "Entrada apartamento",
    currentAmount: 15000,
    targetAmount: 80000,
    deadline: "Janeiro 2026",
    icon: "🏠",
    color: "bg-orange-500",
  },
];

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

const FinancialGoals = () => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">
            Meus Objetivos
          </h2>
          <p className="text-sm text-gray-500">Acompanhe o progresso dos seus objetivos financeiros</p>
        </div>
        <Button variant="outline">Adicionar Objetivo</Button>
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
        })}
      </div>
    </div>
  );
};

export default FinancialGoals;

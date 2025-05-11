
import { useState } from "react";
import { Progress } from "@/components/ui/progress";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Edit, Trash2, PiggyBank } from "lucide-react";

// Dados de exemplo
const goals = [
  {
    id: 1,
    title: "Fundo de emergência",
    currentAmount: 5000,
    targetAmount: 15000,
    deadline: "2023-12-31",
    icon: "🛡️",
    color: "bg-blue-500",
  },
  {
    id: 2,
    title: "Viagem para Europa",
    currentAmount: 3200,
    targetAmount: 12000,
    deadline: "2024-07-31",
    icon: "✈️",
    color: "bg-purple-500",
  },
  {
    id: 3,
    title: "Novo notebook",
    currentAmount: 2800,
    targetAmount: 4000,
    deadline: "2023-09-30",
    icon: "💻",
    color: "bg-green-500",
  },
  {
    id: 4,
    title: "Entrada apartamento",
    currentAmount: 15000,
    targetAmount: 80000,
    deadline: "2026-01-31",
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

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("pt-BR").format(date);
};

const iconOptions = [
  { value: "🛡️", label: "Escudo (Fundo de Emergência)" },
  { value: "✈️", label: "Avião (Viagem)" },
  { value: "💻", label: "Notebook (Tecnologia)" },
  { value: "🏠", label: "Casa (Imóvel)" },
  { value: "🚗", label: "Carro (Veículo)" },
  { value: "📚", label: "Livros (Educação)" },
  { value: "💍", label: "Anel (Casamento)" },
  { value: "👶", label: "Bebê (Família)" },
  { value: "🏥", label: "Hospital (Saúde)" },
];

const colorOptions = [
  { value: "bg-blue-500", label: "Azul" },
  { value: "bg-purple-500", label: "Roxo" },
  { value: "bg-green-500", label: "Verde" },
  { value: "bg-orange-500", label: "Laranja" },
  { value: "bg-red-500", label: "Vermelho" },
  { value: "bg-pink-500", label: "Rosa" },
  { value: "bg-yellow-500", label: "Amarelo" },
  { value: "bg-cyan-500", label: "Ciano" },
];

// Form para adicionar/editar objetivos
const ObjetivoForm = ({ onClose }: { onClose: () => void }) => {
  const [formData, setFormData] = useState({
    title: "",
    currentAmount: "",
    targetAmount: "",
    deadline: "",
    icon: "🛡️",
    color: "bg-blue-500",
  });

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Título</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => handleChange("title", e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="currentAmount">Valor Atual</Label>
        <Input
          id="currentAmount"
          type="number"
          step="0.01"
          min="0"
          value={formData.currentAmount}
          onChange={(e) => handleChange("currentAmount", e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="targetAmount">Valor Alvo</Label>
        <Input
          id="targetAmount"
          type="number"
          step="0.01"
          min="0"
          value={formData.targetAmount}
          onChange={(e) => handleChange("targetAmount", e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="deadline">Prazo</Label>
        <Input
          id="deadline"
          type="date"
          value={formData.deadline}
          onChange={(e) => handleChange("deadline", e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="icon">Ícone</Label>
        <select
          id="icon"
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2"
          value={formData.icon}
          onChange={(e) => handleChange("icon", e.target.value)}
        >
          {iconOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.value} {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="color">Cor</Label>
        <select
          id="color"
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2"
          value={formData.color}
          onChange={(e) => handleChange("color", e.target.value)}
        >
          {colorOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button type="submit">Salvar</Button>
      </div>
    </form>
  );
};

const Objetivos = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Calcular totais
  const totalSaved = goals.reduce((sum, goal) => sum + goal.currentAmount, 0);
  const totalTarget = goals.reduce((sum, goal) => sum + goal.targetAmount, 0);
  const averageProgress = Math.round((totalSaved / totalTarget) * 100);

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
            <ObjetivoForm onClose={() => setIsDialogOpen(false)} />
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
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500">
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

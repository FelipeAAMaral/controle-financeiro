
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Dados de exemplo para gastos recorrentes
const recurringExpenses = [
  { 
    id: 1, 
    description: "Aluguel", 
    amount: 1200, 
    day: 10, 
    category: "Moradia", 
    type: "debito" 
  },
  { 
    id: 2, 
    description: "Condomínio", 
    amount: 350, 
    day: 10, 
    category: "Moradia", 
    type: "debito" 
  },
  { 
    id: 3, 
    description: "Netflix", 
    amount: 39.90, 
    day: 15, 
    category: "Entretenimento", 
    type: "debito" 
  },
  { 
    id: 4, 
    description: "Academia", 
    amount: 99.90, 
    day: 5, 
    category: "Saúde", 
    type: "debito" 
  },
  { 
    id: 5, 
    description: "Spotify", 
    amount: 19.90, 
    day: 15, 
    category: "Entretenimento", 
    type: "debito" 
  },
  { 
    id: 6, 
    description: "Vale Refeição", 
    amount: 600, 
    day: 1, 
    category: "Benefícios", 
    type: "beneficio",
    benefitType: "refeicao" 
  },
  { 
    id: 7, 
    description: "Vale Alimentação", 
    amount: 800, 
    day: 1, 
    category: "Benefícios", 
    type: "beneficio",
    benefitType: "alimentacao"
  },
  { 
    id: 8, 
    description: "Salário", 
    amount: 4500, 
    day: 5, 
    category: "Renda", 
    type: "entrada" 
  },
];

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

// Lista das categorias para o formulário
const categories = [
  "Moradia", "Alimentação", "Transporte", "Saúde", "Educação", 
  "Lazer", "Entretenimento", "Renda", "Benefícios"
];

// Form para adicionar/editar gastos recorrentes
const GastoRecorrenteForm = ({ onClose }: { onClose: () => void }) => {
  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    day: "",
    category: "",
    type: "debito",
    benefitType: "",
  });

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted:", formData);
    onClose();
  };

  const dayOptions = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="description">Descrição</Label>
        <Input
          id="description"
          value={formData.description}
          onChange={(e) => handleChange("description", e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="amount">Valor</Label>
        <Input
          id="amount"
          type="number"
          step="0.01"
          min="0"
          value={formData.amount}
          onChange={(e) => handleChange("amount", e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="day">Dia do mês</Label>
        <Select
          value={formData.day}
          onValueChange={(value) => handleChange("day", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione o dia" />
          </SelectTrigger>
          <SelectContent>
            {dayOptions.map((day) => (
              <SelectItem key={day} value={day.toString()}>
                {day}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Categoria</Label>
        <Select
          value={formData.category}
          onValueChange={(value) => handleChange("category", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione a categoria" />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="type">Tipo</Label>
        <Select
          value={formData.type}
          onValueChange={(value) => handleChange("type", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione o tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="entrada">Entrada</SelectItem>
            <SelectItem value="debito">Débito</SelectItem>
            <SelectItem value="beneficio">Benefício</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {formData.type === "beneficio" && (
        <div className="space-y-2">
          <Label htmlFor="benefitType">Tipo de Benefício</Label>
          <Select
            value={formData.benefitType}
            onValueChange={(value) => handleChange("benefitType", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o tipo de benefício" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="alimentacao">Alimentação</SelectItem>
              <SelectItem value="refeicao">Refeição</SelectItem>
              <SelectItem value="mobilidade">Mobilidade</SelectItem>
              <SelectItem value="saude">Saúde</SelectItem>
              <SelectItem value="cultura">Cultura</SelectItem>
              <SelectItem value="home-office">Home Office</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button type="submit">Salvar</Button>
      </div>
    </form>
  );
};

const GastosRecorrentes = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Separar os gastos por tipo
  const entradas = recurringExpenses.filter(expense => expense.type === "entrada");
  const saidas = recurringExpenses.filter(expense => expense.type === "debito");
  const beneficios = recurringExpenses.filter(expense => expense.type === "beneficio");

  // Calcular totais
  const totalEntradas = entradas.reduce((sum, expense) => sum + expense.amount, 0);
  const totalSaidas = saidas.reduce((sum, expense) => sum + expense.amount, 0);
  const totalBeneficios = beneficios.reduce((sum, expense) => sum + expense.amount, 0);
  const saldoLiquido = totalEntradas - totalSaidas;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Gastos Recorrentes</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Novo Gasto Recorrente
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Cadastrar Gasto Recorrente</DialogTitle>
            </DialogHeader>
            <GastoRecorrenteForm onClose={() => setIsDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Entradas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">{formatCurrency(totalEntradas)}</p>
            <p className="text-xs text-gray-500">Mensal</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Saídas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-red-600">{formatCurrency(totalSaidas)}</p>
            <p className="text-xs text-gray-500">Mensal</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Benefícios</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-blue-600">{formatCurrency(totalBeneficios)}</p>
            <p className="text-xs text-gray-500">Mensal</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Saldo Líquido</CardTitle>
          </CardHeader>
          <CardContent>
            <p className={`text-2xl font-bold ${saldoLiquido >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(saldoLiquido)}
            </p>
            <p className="text-xs text-gray-500">Mensal</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Gastos Recorrentes</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Descrição</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Dia</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead className="w-[100px]">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recurringExpenses.map((expense) => (
                <TableRow key={expense.id}>
                  <TableCell className="font-medium">{expense.description}</TableCell>
                  <TableCell className={`font-medium ${expense.type === 'entrada' ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(expense.amount)}
                  </TableCell>
                  <TableCell>Dia {expense.day}</TableCell>
                  <TableCell>{expense.category}</TableCell>
                  <TableCell>
                    {expense.type === "entrada" && (
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        Entrada
                      </Badge>
                    )}
                    {expense.type === "debito" && (
                      <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
                        Débito
                      </Badge>
                    )}
                    {expense.type === "beneficio" && expense.benefitType && (
                      <span className={`benefit-${expense.benefitType}`}>
                        {expense.benefitType.charAt(0).toUpperCase() + expense.benefitType.slice(1)}
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default GastosRecorrentes;

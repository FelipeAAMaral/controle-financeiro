
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { GastoRecorrente } from "@/types";
import GastoRecorrenteForm from "@/components/forms/GastoRecorrenteForm";
import { toast } from "sonner";

// Dados de exemplo para gastos recorrentes
const initialExpenses: GastoRecorrente[] = [
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

const GastosRecorrentes = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [recurringExpenses, setRecurringExpenses] = useState<GastoRecorrente[]>(initialExpenses);
  const [currentExpense, setCurrentExpense] = useState<GastoRecorrente | undefined>(undefined);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState<number | null>(null);

  // Separar os gastos por tipo
  const entradas = recurringExpenses.filter(expense => expense.type === "entrada");
  const saidas = recurringExpenses.filter(expense => expense.type === "debito");
  const beneficios = recurringExpenses.filter(expense => expense.type === "beneficio");

  // Calcular totais
  const totalEntradas = entradas.reduce((sum, expense) => sum + expense.amount, 0);
  const totalSaidas = saidas.reduce((sum, expense) => sum + expense.amount, 0);
  const totalBeneficios = beneficios.reduce((sum, expense) => sum + expense.amount, 0);
  const saldoLiquido = totalEntradas - totalSaidas;

  const handleCreateExpense = (data: any) => {
    const newExpense: GastoRecorrente = {
      id: recurringExpenses.length + 1,
      description: data.description,
      amount: Number(data.amount),
      day: Number(data.day),
      category: data.category,
      type: data.type,
      ...(data.benefitType && { benefitType: data.benefitType }),
    };
    
    setRecurringExpenses([...recurringExpenses, newExpense]);
  };

  const handleEditExpense = (data: any) => {
    if (!currentExpense) return;
    
    const updatedExpenses = recurringExpenses.map(expense => 
      expense.id === currentExpense.id 
        ? {
            ...expense,
            description: data.description,
            amount: Number(data.amount),
            day: Number(data.day),
            category: data.category,
            type: data.type,
            ...(data.benefitType ? { benefitType: data.benefitType } : { benefitType: undefined }),
          } 
        : expense
    );
    
    setRecurringExpenses(updatedExpenses);
    setCurrentExpense(undefined);
  };

  const openEditDialog = (expense: GastoRecorrente) => {
    setCurrentExpense(expense);
    setIsEditDialogOpen(true);
  };

  const confirmDelete = (id: number) => {
    setExpenseToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDelete = () => {
    if (expenseToDelete === null) return;
    
    const updatedExpenses = recurringExpenses.filter(
      expense => expense.id !== expenseToDelete
    );
    
    setRecurringExpenses(updatedExpenses);
    setDeleteDialogOpen(false);
    setExpenseToDelete(null);
    
    toast.success("Gasto recorrente excluído com sucesso!");
  };

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
            <GastoRecorrenteForm 
              onClose={() => setIsDialogOpen(false)}
              onSubmit={handleCreateExpense}
            />
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
                  <TableCell className={`font-medium ${expense.type === 'entrada' ? 'text-green-600' : expense.type === 'debito' ? 'text-red-600' : 'text-blue-600'}`}>
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
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        {expense.benefitType.charAt(0).toUpperCase() + expense.benefitType.slice(1)}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8"
                        onClick={() => openEditDialog(expense)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-red-500"
                        onClick={() => confirmDelete(expense.id)}
                      >
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

      {/* Diálogo de edição */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Gasto Recorrente</DialogTitle>
          </DialogHeader>
          {currentExpense && (
            <GastoRecorrenteForm
              onClose={() => setIsEditDialogOpen(false)}
              onSubmit={handleEditExpense}
              initialData={{
                id: currentExpense.id,
                description: currentExpense.description,
                amount: currentExpense.amount.toString(),
                day: currentExpense.day.toString(),
                category: currentExpense.category,
                type: currentExpense.type,
                benefitType: currentExpense.benefitType || "",
              }}
              isEdit
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Diálogo de confirmação de exclusão */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirmar exclusão</DialogTitle>
          </DialogHeader>
          <div className="py-3">
            <p>Tem certeza que deseja excluir este gasto recorrente?</p>
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Excluir
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GastosRecorrentes;

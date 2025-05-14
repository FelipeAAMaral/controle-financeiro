import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { GastoRecorrente, GastosRecorrentesService } from "@/services/gastosRecorrentesService";
import GastoRecorrenteForm from "@/components/forms/GastoRecorrenteForm";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

const GastosRecorrentes = () => {
  const { user } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [recurringExpenses, setRecurringExpenses] = useState<GastoRecorrente[]>([]);
  const [currentExpense, setCurrentExpense] = useState<GastoRecorrente | undefined>(undefined);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [expenseToDelete, setExpenseToDelete] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadGastosRecorrentes();
  }, [user]);

  const loadGastosRecorrentes = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const service = new GastosRecorrentesService();
      const expenses = await service.getGastosRecorrentes(user.id);
      setRecurringExpenses(expenses);
    } catch (error) {
      console.error('Erro ao carregar gastos recorrentes:', error);
      toast.error('Erro ao carregar gastos recorrentes');
    } finally {
      setLoading(false);
    }
  };

  // Separar os gastos por tipo
  const entradas = recurringExpenses.filter(expense => expense.type === "entrada");
  const saidas = recurringExpenses.filter(expense => expense.type === "debito");
  const beneficios = recurringExpenses.filter(expense => expense.type === "beneficio");

  // Calcular totais
  const totalEntradas = entradas.reduce((sum, expense) => sum + expense.amount, 0);
  const totalSaidas = saidas.reduce((sum, expense) => sum + expense.amount, 0);
  const totalBeneficios = beneficios.reduce((sum, expense) => sum + expense.amount, 0);
  const saldoLiquido = totalEntradas - totalSaidas;

  const handleCreateExpense = async (data: any) => {
    if (!user) return;

    try {
      const service = new GastosRecorrentesService();
      const newExpense = await service.createGastoRecorrente({
        description: data.description,
        amount: Number(data.amount),
        day: Number(data.day),
        category: data.category,
        type: data.type,
        benefitType: data.benefitType,
        user_id: user.id
      });
      
      setRecurringExpenses([...recurringExpenses, newExpense]);
      toast.success('Gasto recorrente cadastrado com sucesso!');
    } catch (error) {
      console.error('Erro ao criar gasto recorrente:', error);
      toast.error('Erro ao criar gasto recorrente');
    }
  };

  const handleEditExpense = async (data: any) => {
    if (!currentExpense) return;

    try {
      const service = new GastosRecorrentesService();
      const updatedExpense = await service.updateGastoRecorrente(currentExpense.id, {
        description: data.description,
        amount: Number(data.amount),
        day: Number(data.day),
        category: data.category,
        type: data.type,
        benefitType: data.benefitType
      });
      
      const updatedExpenses = recurringExpenses.map(expense => 
        expense.id === currentExpense.id ? updatedExpense : expense
      );
      
      setRecurringExpenses(updatedExpenses);
      setCurrentExpense(undefined);
      toast.success('Gasto recorrente atualizado com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar gasto recorrente:', error);
      toast.error('Erro ao atualizar gasto recorrente');
    }
  };

  const openEditDialog = (expense: GastoRecorrente) => {
    setCurrentExpense(expense);
    setIsEditDialogOpen(true);
  };

  const confirmDelete = (id: string) => {
    setExpenseToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDelete = async () => {
    if (!expenseToDelete) return;

    try {
      const service = new GastosRecorrentesService();
      await service.deleteGastoRecorrente(expenseToDelete);
      
      const updatedExpenses = recurringExpenses.filter(
        expense => expense.id !== expenseToDelete
      );
      
      setRecurringExpenses(updatedExpenses);
      setDeleteDialogOpen(false);
      setExpenseToDelete(null);
      
      toast.success('Gasto recorrente excluído com sucesso!');
    } catch (error) {
      console.error('Erro ao excluir gasto recorrente:', error);
      toast.error('Erro ao excluir gasto recorrente');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (recurringExpenses.length === 0) {
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

        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6 space-y-4">
            <p className="text-gray-500 text-center">
              Você ainda não tem nenhum gasto recorrente cadastrado. Comece registrando seus gastos fixos mensais.
            </p>
            <Button onClick={() => setIsDialogOpen(true)}>
              Cadastrar Primeiro Gasto Recorrente
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

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
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
          </DialogHeader>
          <p>Tem certeza que deseja excluir este gasto recorrente?</p>
          <div className="flex justify-end space-x-2">
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

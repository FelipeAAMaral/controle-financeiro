import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Transacao } from "@/types";
import { DashboardService } from "@/services/dashboardService";
import { GastosRecorrentesService } from "@/services/gastosRecorrentesService";
import { toast } from "sonner";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString("pt-BR");
};

const ControleMensal = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState<Transacao[]>([]);
  const [recurringExpenses, setRecurringExpenses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [user]);

  const loadData = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const dashboardService = new DashboardService();
      const gastosService = new GastosRecorrentesService();

      const [transactionsData, expensesData] = await Promise.all([
        dashboardService.getRecentTransactions(user.id),
        gastosService.getGastosRecorrentes(user.id)
      ]);

      setTransactions(transactionsData);
      setRecurringExpenses(expensesData);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      toast.error('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  // Calcular totais
  const totalEntradas = transactions
    .filter(t => t.type === "entrada")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalSaidas = transactions
    .filter(t => t.type === "saida")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalGastosRecorrentes = recurringExpenses
    .filter(e => e.type === "debito")
    .reduce((sum, e) => sum + e.amount, 0);

  const saldoLiquido = totalEntradas - totalSaidas - totalGastosRecorrentes;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (transactions.length === 0 && recurringExpenses.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tight">Controle Mensal</h1>
          <div className="space-x-2">
            <Button onClick={() => navigate("/transactions/new")}>
              <Plus className="mr-2 h-4 w-4" />
              Nova Transação
            </Button>
            <Button onClick={() => navigate("/recurring-expenses")}>
              <Plus className="mr-2 h-4 w-4" />
              Novo Gasto Recorrente
            </Button>
          </div>
        </div>

        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6 space-y-4">
            <p className="text-gray-500 text-center">
              Você ainda não tem nenhuma transação ou gasto recorrente registrado. Comece registrando suas movimentações financeiras.
            </p>
            <div className="flex space-x-4">
              <Button onClick={() => navigate("/transactions/new")}>
                Registrar Primeira Transação
              </Button>
              <Button onClick={() => navigate("/recurring-expenses")}>
                Registrar Primeiro Gasto Recorrente
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Controle Mensal</h1>
        <div className="space-x-2">
          <Button onClick={() => navigate("/transactions/new")}>
            <Plus className="mr-2 h-4 w-4" />
            Nova Transação
          </Button>
          <Button onClick={() => navigate("/recurring-expenses")}>
            <Plus className="mr-2 h-4 w-4" />
            Novo Gasto Recorrente
          </Button>
        </div>
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
            <CardTitle className="text-lg">Gastos Recorrentes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-orange-600">{formatCurrency(totalGastosRecorrentes)}</p>
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
          <CardTitle>Transações Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Tipo</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>{formatDate(transaction.date)}</TableCell>
                  <TableCell className="font-medium">{transaction.description}</TableCell>
                  <TableCell>{transaction.category}</TableCell>
                  <TableCell className={`font-medium ${transaction.type === 'entrada' ? 'text-green-600' : 'text-red-600'}`}>
                    {formatCurrency(transaction.amount)}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={transaction.type === 'entrada' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200'}>
                      {transaction.type === 'entrada' ? 'Entrada' : 'Saída'}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Gastos Recorrentes</CardTitle>
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
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ControleMensal;

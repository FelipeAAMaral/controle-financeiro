
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Filter, Edit, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Transacao } from "@/types";
import TransacaoForm from "@/components/forms/TransacaoForm";
import { toast } from "sonner";

// Dados de exemplo
const initialTransactions: Transacao[] = [
  {
    id: "1",
    description: "Salário",
    date: "2023-05-05",
    amount: 4500,
    type: "entrada",
    category: "Salário",
    account: "Nubank",
  },
  {
    id: "2",
    description: "Mercado",
    date: "2023-05-08",
    amount: -456.78,
    type: "saida",
    category: "Alimentação",
    account: "Nubank",
  },
  {
    id: "3",
    description: "Uber",
    date: "2023-05-10",
    amount: -32.5,
    type: "saida",
    category: "Transporte",
    account: "Itaú",
  },
  {
    id: "4",
    description: "Netflix",
    date: "2023-05-15",
    amount: -39.9,
    type: "saida",
    category: "Entretenimento",
    account: "Nubank",
  },
  {
    id: "5",
    description: "Freelance",
    date: "2023-05-20",
    amount: 1200,
    type: "entrada",
    category: "Freelance",
    account: "Itaú",
  },
  {
    id: "6",
    description: "Restaurante (VR)",
    date: "2023-05-12",
    amount: -45.90,
    type: "beneficio",
    category: "Alimentação",
    account: "Caju",
    benefitType: "refeicao",
  },
  {
    id: "7",
    description: "Supermercado (VA)",
    date: "2023-05-18",
    amount: -253.45,
    type: "beneficio",
    category: "Alimentação",
    account: "Caju",
    benefitType: "alimentacao",
  },
];

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("pt-BR").format(date);
};

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

const Transacoes = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [transactions, setTransactions] = useState<Transacao[]>(initialTransactions);
  const [currentTransaction, setCurrentTransaction] = useState<Transacao | undefined>(undefined);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [transactionToDelete, setTransactionToDelete] = useState<string | null>(null);

  // Calcular totais
  const totalEntradas = transactions
    .filter(t => t.type === "entrada")
    .reduce((sum, t) => sum + t.amount, 0);
    
  const totalSaidas = transactions
    .filter(t => t.type === "saida")
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);
    
  const totalBeneficios = transactions
    .filter(t => t.type === "beneficio")
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const handleCreateTransaction = (data: any) => {
    // Gerar um ID único (em produção, isso seria feito pelo backend)
    const newId = (Math.max(...transactions.map(t => parseInt(t.id))) + 1).toString();
    
    // Ajustar o valor para negativo se for uma saída ou benefício
    let amount = Number(data.amount);
    if (data.type === 'saida' || data.type === 'beneficio') {
      amount = amount > 0 ? -amount : amount;
    } else {
      amount = Math.abs(amount);
    }
    
    const newTransaction: Transacao = {
      id: newId,
      description: data.description,
      date: data.date,
      amount: amount,
      type: data.type,
      category: data.category,
      account: data.account,
      ...(data.benefitType && { benefitType: data.benefitType }),
    };
    
    setTransactions([newTransaction, ...transactions]);
  };

  const handleEditTransaction = (data: any) => {
    if (!currentTransaction) return;
    
    // Ajustar o valor para negativo se for uma saída ou benefício
    let amount = Number(data.amount);
    if (data.type === 'saida' || data.type === 'beneficio') {
      amount = amount > 0 ? -amount : amount;
    } else {
      amount = Math.abs(amount);
    }
    
    const updatedTransactions = transactions.map(transaction => 
      transaction.id === currentTransaction.id 
        ? {
            ...transaction,
            description: data.description,
            date: data.date,
            amount: amount,
            type: data.type,
            category: data.category,
            account: data.account,
            ...(data.benefitType ? { benefitType: data.benefitType } : { benefitType: undefined }),
          } 
        : transaction
    );
    
    setTransactions(updatedTransactions);
    setCurrentTransaction(undefined);
  };

  const openEditDialog = (transaction: Transacao) => {
    setCurrentTransaction(transaction);
    setIsEditDialogOpen(true);
  };

  const confirmDelete = (id: string) => {
    setTransactionToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDelete = () => {
    if (transactionToDelete === null) return;
    
    const updatedTransactions = transactions.filter(
      transaction => transaction.id !== transactionToDelete
    );
    
    setTransactions(updatedTransactions);
    setDeleteDialogOpen(false);
    setTransactionToDelete(null);
    
    toast.success("Transação excluída com sucesso!");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Transações</h1>
        <div className="flex gap-2">
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filtros
          </Button>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Nova Transação
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Cadastrar Transação</DialogTitle>
              </DialogHeader>
              <TransacaoForm 
                onClose={() => setIsDialogOpen(false)}
                onSubmit={handleCreateTransaction}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Entradas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">{formatCurrency(totalEntradas)}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Saídas</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-red-600">{formatCurrency(totalSaidas)}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Benefícios</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-blue-600">{formatCurrency(totalBeneficios)}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Histórico de Transações</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Data</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Conta</TableHead>
                <TableHead className="text-right">Valor</TableHead>
                <TableHead className="w-[100px]">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {transactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>{formatDate(transaction.date)}</TableCell>
                  <TableCell className="font-medium">{transaction.description}</TableCell>
                  <TableCell>
                    {transaction.benefitType ? (
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        {transaction.category}
                      </Badge>
                    ) : (
                      <Badge variant="outline" className={
                        transaction.type === "entrada"
                          ? "bg-green-50 text-green-700 border-green-200"
                          : "bg-red-50 text-red-700 border-red-200"
                      }>
                        {transaction.category}
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>{transaction.account}</TableCell>
                  <TableCell className="text-right">
                    <span
                      className={
                        transaction.type === "entrada" ? "text-green-600" : "text-red-600"
                      }
                    >
                      {formatCurrency(transaction.amount)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-1">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8"
                        onClick={() => openEditDialog(transaction)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8 text-red-500"
                        onClick={() => confirmDelete(transaction.id)}
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
            <DialogTitle>Editar Transação</DialogTitle>
          </DialogHeader>
          {currentTransaction && (
            <TransacaoForm
              onClose={() => setIsEditDialogOpen(false)}
              onSubmit={handleEditTransaction}
              initialData={{
                id: currentTransaction.id,
                description: currentTransaction.description,
                amount: Math.abs(currentTransaction.amount).toString(),
                date: currentTransaction.date,
                type: currentTransaction.type,
                category: currentTransaction.category,
                account: currentTransaction.account,
                benefitType: currentTransaction.benefitType || "",
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
            <p>Tem certeza que deseja excluir esta transação?</p>
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

export default Transacoes;

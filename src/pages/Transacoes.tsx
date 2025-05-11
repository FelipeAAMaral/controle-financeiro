
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Filter, Edit, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

// Dados de exemplo
const transactions = [
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

// Lista das categorias e contas para o formulário
const categories = [
  "Alimentação", "Transporte", "Moradia", "Saúde", "Educação", 
  "Lazer", "Entretenimento", "Salário", "Freelance", "Investimentos"
];

const accounts = ["Nubank", "Itaú", "Bradesco", "Caixa", "Santander", "Caju"];

// Form para adicionar/editar transações
const TransacaoForm = ({ onClose }: { onClose: () => void }) => {
  const [formData, setFormData] = useState({
    description: "",
    amount: "",
    date: new Date().toISOString().split('T')[0],
    type: "saida",
    category: "",
    account: "",
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
          value={formData.amount}
          onChange={(e) => handleChange("amount", e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="date">Data</Label>
        <Input
          id="date"
          type="date"
          value={formData.date}
          onChange={(e) => handleChange("date", e.target.value)}
          required
        />
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
            <SelectItem value="saida">Saída</SelectItem>
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
        <Label htmlFor="account">Conta</Label>
        <Select
          value={formData.account}
          onValueChange={(value) => handleChange("account", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione a conta" />
          </SelectTrigger>
          <SelectContent>
            {accounts.map((account) => (
              <SelectItem key={account} value={account}>
                {account}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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

const Transacoes = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

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
              <TransacaoForm onClose={() => setIsDialogOpen(false)} />
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
                      <span className={`benefit-${transaction.benefitType}`}>
                        {transaction.category}
                      </span>
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

export default Transacoes;

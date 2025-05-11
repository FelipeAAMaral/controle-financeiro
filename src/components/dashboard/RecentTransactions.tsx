
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Dados de exemplo para as transações recentes
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
];

// Função para formatar a data
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("pt-BR").format(date);
};

// Função para formatar valores monetários
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

const RecentTransactions = () => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold tracking-tight">
          Transações Recentes
        </h2>
      </div>
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Descrição</TableHead>
              <TableHead>Data</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead className="text-right">Valor</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell className="font-medium">{transaction.description}</TableCell>
                <TableCell>{formatDate(transaction.date)}</TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={
                      transaction.type === "entrada"
                        ? "bg-green-50 text-green-700 border-green-200"
                        : "bg-red-50 text-red-700 border-red-200"
                    }
                  >
                    {transaction.category}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <span
                    className={
                      transaction.amount >= 0 ? "text-green-600" : "text-red-600"
                    }
                  >
                    {formatCurrency(transaction.amount)}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default RecentTransactions;

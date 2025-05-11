
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const months = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

const years = [2023, 2024, 2025];

const recurringExpenses = [
  { id: 1, description: "Aluguel", amount: 1200, day: 10, category: "Moradia", type: "debito" },
  { id: 2, description: "Condomínio", amount: 350, day: 10, category: "Moradia", type: "debito" },
  { id: 3, description: "Netflix", amount: 39.90, day: 15, category: "Entretenimento", type: "debito" },
  { id: 4, description: "Academia", amount: 99.90, day: 5, category: "Saúde", type: "debito" },
  { id: 5, description: "Spotify", amount: 19.90, day: 15, category: "Entretenimento", type: "debito" },
];

const monthlyTransactions = [
  { id: 101, description: "Supermercado", amount: 420.50, day: 5, category: "Alimentação", type: "beneficio", benefitType: "alimentacao" },
  { id: 102, description: "Restaurante", amount: 85.30, day: 8, category: "Alimentação", type: "beneficio", benefitType: "refeicao" },
  { id: 103, description: "Uber", amount: 45.75, day: 10, category: "Transporte", type: "debito" },
  { id: 104, description: "Farmácia", amount: 97.20, day: 12, category: "Saúde", type: "beneficio", benefitType: "saude" },
  { id: 105, description: "Extra - Freelance", amount: 1200, day: 15, category: "Renda", type: "entrada" },
];

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

const ControleMensal = () => {
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth());
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());

  // Combinando gastos recorrentes e transações mensais
  const allTransactions = [...recurringExpenses, ...monthlyTransactions].sort((a, b) => a.day - b.day);
  
  // Calculando totais
  const totalEntradas = allTransactions
    .filter(t => t.type === "entrada")
    .reduce((sum, t) => sum + t.amount, 0);
    
  const totalSaidas = allTransactions
    .filter(t => t.type === "debito")
    .reduce((sum, t) => sum + t.amount, 0);
    
  const totalBeneficios = allTransactions
    .filter(t => t.type === "beneficio")
    .reduce((sum, t) => sum + t.amount, 0);
    
  const saldo = totalEntradas - totalSaidas;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Controle Mensal</h1>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Nova Transação
        </Button>
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="w-full md:w-1/4">
          <Select 
            value={selectedMonth.toString()} 
            onValueChange={(value) => setSelectedMonth(Number(value))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o mês" />
            </SelectTrigger>
            <SelectContent>
              {months.map((month, index) => (
                <SelectItem key={index} value={index.toString()}>
                  {month}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="w-full md:w-1/4">
          <Select 
            value={selectedYear.toString()} 
            onValueChange={(value) => setSelectedYear(Number(value))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o ano" />
            </SelectTrigger>
            <SelectContent>
              {years.map((year) => (
                <SelectItem key={year} value={year.toString()}>
                  {year}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Entradas</CardTitle>
            <CardDescription>Total de receitas no mês</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-green-600">{formatCurrency(totalEntradas)}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Saídas</CardTitle>
            <CardDescription>Total de despesas no mês</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-red-600">{formatCurrency(totalSaidas)}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Saldo</CardTitle>
            <CardDescription>Entradas - Saídas</CardDescription>
          </CardHeader>
          <CardContent>
            <p className={`text-2xl font-bold ${saldo >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {formatCurrency(saldo)}
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Transações do Mês</CardTitle>
          <CardDescription>
            {months[selectedMonth]} de {selectedYear}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Dia</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead className="text-right">Valor</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allTransactions.map((transaction) => (
                <TableRow key={transaction.id}>
                  <TableCell>{transaction.day}</TableCell>
                  <TableCell className="font-medium">{transaction.description}</TableCell>
                  <TableCell>{transaction.category}</TableCell>
                  <TableCell>
                    {transaction.type === "entrada" && (
                      <span className="text-green-600 font-medium">Entrada</span>
                    )}
                    {transaction.type === "debito" && (
                      <span className="text-red-600 font-medium">Débito</span>
                    )}
                    {transaction.type === "beneficio" && transaction.benefitType && (
                      <span className={`benefit-${transaction.benefitType}`}>
                        {transaction.benefitType.charAt(0).toUpperCase() + transaction.benefitType.slice(1)}
                      </span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <span className={transaction.type === "entrada" ? "text-green-600" : "text-red-600"}>
                      {formatCurrency(transaction.amount)}
                    </span>
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

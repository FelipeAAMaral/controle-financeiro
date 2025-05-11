
import { BarChart, PieChart, AreaChart, Area, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Pie, Cell } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Dados de exemplo para gastos por categoria
const expenseData = [
  { name: "Moradia", value: 1200, color: "#8884d8" },
  { name: "Alimentação", value: 800, color: "#82ca9d" },
  { name: "Transporte", value: 300, color: "#ffc658" },
  { name: "Lazer", value: 250, color: "#ff8042" },
  { name: "Saúde", value: 200, color: "#0088fe" },
  { name: "Outros", value: 150, color: "#00C49F" },
];

// Dados de exemplo para fluxo de caixa mensal (separados em dinheiro e benefícios)
const cashFlowData = [
  { month: "Jan", entradaDinheiro: 4500, saidaDinheiro: 3400, entradaBeneficio: 0, saidaBeneficio: 400 },
  { month: "Fev", entradaDinheiro: 4500, saidaDinheiro: 3500, entradaBeneficio: 0, saidaBeneficio: 400 },
  { month: "Mar", entradaDinheiro: 4800, saidaDinheiro: 3700, entradaBeneficio: 0, saidaBeneficio: 400 },
  { month: "Abr", entradaDinheiro: 4700, saidaDinheiro: 3550, entradaBeneficio: 0, saidaBeneficio: 400 },
  { month: "Mai", entradaDinheiro: 4600, saidaDinheiro: 3400, entradaBeneficio: 0, saidaBeneficio: 400 },
  { month: "Jun", entradaDinheiro: 5200, saidaDinheiro: 3600, entradaBeneficio: 0, saidaBeneficio: 400 },
];

// Dados de exemplo para evolução do patrimônio
const netWorthData = [
  { month: "Jan", valor: 10000 },
  { month: "Fev", valor: 12000 },
  { month: "Mar", valor: 14500 },
  { month: "Abr", valor: 16000 },
  { month: "Mai", valor: 18500 },
  { month: "Jun", valor: 21000 },
];

// Dados de exemplo para gastos por benefícios
const benefitsData = [
  { name: "Alimentação", value: 420, color: "#FF8042" },
  { name: "Refeição", value: 284, color: "#0088FE" },
  { name: "Mobilidade", value: 120, color: "#00C49F" },
  { name: "Cultura", value: 85, color: "#FFBB28" },
  { name: "Saúde", value: 65, color: "#FF00FF" },
];

const FinancialOverview = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Gastos por Categoria</CardTitle>
            <CardDescription>Como seus gastos estão distribuídos</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={expenseData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {expenseData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => (
                      new Intl.NumberFormat('pt-BR', { 
                        style: 'currency', 
                        currency: 'BRL' 
                      }).format(Number(value))
                    )} 
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Fluxo de Caixa</CardTitle>
            <CardDescription>Entradas vs Saídas nos últimos 6 meses</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={cashFlowData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => (
                      new Intl.NumberFormat('pt-BR', { 
                        style: 'currency', 
                        currency: 'BRL' 
                      }).format(Number(value))
                    )} 
                  />
                  <Legend />
                  <Bar dataKey="entradaDinheiro" name="Entrada (Dinheiro)" fill="#4ade80" />
                  <Bar dataKey="entradaBeneficio" name="Entrada (Benefício)" fill="#a7f3d0" />
                  <Bar dataKey="saidaDinheiro" name="Saída (Dinheiro)" fill="#f87171" />
                  <Bar dataKey="saidaBeneficio" name="Saída (Benefício)" fill="#fecaca" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Evolução do Patrimônio</CardTitle>
            <CardDescription>Crescimento do seu patrimônio total</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={netWorthData}
                  margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip 
                    formatter={(value) => (
                      new Intl.NumberFormat('pt-BR', { 
                        style: 'currency', 
                        currency: 'BRL' 
                      }).format(Number(value))
                    )} 
                  />
                  <Area 
                    type="monotone" 
                    dataKey="valor" 
                    name="Patrimônio" 
                    stroke="#3b82f6" 
                    fill="#93c5fd" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Distribuição de Benefícios</CardTitle>
            <CardDescription>Como você está usando seus benefícios</CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={benefitsData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {benefitsData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => (
                      new Intl.NumberFormat('pt-BR', { 
                        style: 'currency', 
                        currency: 'BRL' 
                      }).format(Number(value))
                    )} 
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FinancialOverview;

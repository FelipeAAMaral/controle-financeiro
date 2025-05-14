import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { DashboardService } from "@/services/dashboardService";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

// Dados de exemplo
const incomeCategories = [
  { id: 1, name: "Salário", description: "Renda principal de trabalho CLT", type: "entrada" },
  { id: 2, name: "Freelance", description: "Trabalhos extras", type: "entrada" },
  { id: 3, name: "Investimentos", description: "Rendimento de aplicações", type: "entrada" },
  { id: 4, name: "Outros", description: "Outras fontes de renda", type: "entrada" },
];

const expenseCategories = [
  { id: 101, name: "Moradia", description: "Aluguel, condomínio, etc", type: "saida" },
  { id: 102, name: "Alimentação", description: "Supermercado, restaurantes", type: "saida" },
  { id: 103, name: "Transporte", description: "Combustível, transporte público", type: "saida" },
  { id: 104, name: "Saúde", description: "Plano de saúde, medicamentos", type: "saida" },
  { id: 105, name: "Lazer", description: "Cinema, viagens, etc", type: "saida" },
  { id: 106, name: "Educação", description: "Cursos, livros, etc", type: "saida" },
];

const benefitCategories = [
  { id: 201, name: "Alimentação", description: "Vale alimentação Caju", type: "beneficio", benefitType: "alimentacao" },
  { id: 202, name: "Refeição", description: "Vale refeição Caju", type: "beneficio", benefitType: "refeicao" },
  { id: 203, name: "Mobilidade", description: "Vale transporte Caju", type: "beneficio", benefitType: "mobilidade" },
  { id: 204, name: "Saúde", description: "Benefícios de saúde Caju", type: "beneficio", benefitType: "saude" },
  { id: 205, name: "Cultura", description: "Vale cultura Caju", type: "beneficio", benefitType: "cultura" },
  { id: 206, name: "Home Office", description: "Ajuda de custo para home office", type: "beneficio", benefitType: "home-office" },
];

const IndicadorForm = ({ onClose }: { onClose: () => void }) => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    type: "entrada",
    benefitType: "",
  });

  const handleChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Aqui você implementaria a lógica para salvar o indicador
    console.log("Form submitted:", formData);
    onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nome</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => handleChange("name", e.target.value)}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descrição</Label>
        <Input
          id="description"
          value={formData.description}
          onChange={(e) => handleChange("description", e.target.value)}
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

      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button type="submit">Salvar</Button>
      </div>
    </form>
  );
};

const IndicadorTable = ({ data }: { data: any[] }) => (
  <Table>
    <TableHeader>
      <TableRow>
        <TableHead>Nome</TableHead>
        <TableHead>Descrição</TableHead>
        <TableHead>Tipo</TableHead>
        <TableHead className="w-[100px]">Ações</TableHead>
      </TableRow>
    </TableHeader>
    <TableBody>
      {data.map((item) => (
        <TableRow key={item.id}>
          <TableCell className="font-medium">{item.name}</TableCell>
          <TableCell>{item.description}</TableCell>
          <TableCell>
            {item.benefitType ? (
              <span className={`benefit-${item.benefitType}`}>
                {item.benefitType.charAt(0).toUpperCase() + item.benefitType.slice(1)}
              </span>
            ) : (
              item.type.charAt(0).toUpperCase() + item.type.slice(1)
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
);

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
};

const formatPercentage = (value: number) => {
  return new Intl.NumberFormat("pt-BR", {
    style: "percent",
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(value / 100);
};

const Indicadores = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [indicators, setIndicators] = useState({
    rendaMensal: 0,
    gastosEssenciais: 0,
    gastosNaoEssenciais: 0,
    investimentos: 0,
    reservaEmergencial: 0,
    metaReservaEmergencial: 0,
    gastosPorCategoria: [] as { category: string; amount: number }[],
  });

  useEffect(() => {
    loadIndicators();
  }, [user]);

  const loadIndicators = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const service = new DashboardService();
      const overview = await service.getFinancialOverview(user.id);
      
      // Calcular indicadores
      const rendaMensal = overview.totalEntradas;
      const gastosEssenciais = overview.totalSaidas * 0.6; // 60% dos gastos são essenciais
      const gastosNaoEssenciais = overview.totalSaidas * 0.4; // 40% dos gastos são não essenciais
      const investimentos = rendaMensal * 0.2; // 20% da renda em investimentos
      const reservaEmergencial = rendaMensal * 3; // 3 meses de renda
      const metaReservaEmergencial = rendaMensal * 6; // 6 meses de renda

      // Calcular gastos por categoria
      const gastosPorCategoria = Object.entries(overview.gastosPorCategoria || {})
        .map(([category, amount]) => ({
          category,
          amount: amount as number,
        }))
        .sort((a, b) => b.amount - a.amount);

      setIndicators({
        rendaMensal,
        gastosEssenciais,
        gastosNaoEssenciais,
        investimentos,
        reservaEmergencial,
        metaReservaEmergencial,
        gastosPorCategoria,
      });
    } catch (error) {
      console.error('Erro ao carregar indicadores:', error);
      toast.error('Erro ao carregar indicadores');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (indicators.rendaMensal === 0) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tight">Indicadores Financeiros</h1>
          <Button onClick={() => navigate("/transactions/new")}>
            Registrar Primeira Transação
          </Button>
        </div>

        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6 space-y-4">
            <p className="text-gray-500 text-center">
              Você ainda não tem nenhuma transação registrada. Registre suas movimentações financeiras para visualizar os indicadores.
            </p>
            <Button onClick={() => navigate("/transactions/new")}>
              Registrar Primeira Transação
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold tracking-tight">Indicadores Financeiros</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Distribuição de Gastos</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Gastos Essenciais</span>
                <span className="text-sm text-gray-500">{formatCurrency(indicators.gastosEssenciais)}</span>
              </div>
              <Progress value={60} className="h-2" />
              <p className="text-xs text-gray-500 mt-1">60% da renda</p>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Gastos Não Essenciais</span>
                <span className="text-sm text-gray-500">{formatCurrency(indicators.gastosNaoEssenciais)}</span>
              </div>
              <Progress value={40} className="h-2" />
              <p className="text-xs text-gray-500 mt-1">40% da renda</p>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Investimentos</span>
                <span className="text-sm text-gray-500">{formatCurrency(indicators.investimentos)}</span>
              </div>
              <Progress value={20} className="h-2" />
              <p className="text-xs text-gray-500 mt-1">20% da renda</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Reserva de Emergência</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Reserva Atual</span>
                <span className="text-sm text-gray-500">{formatCurrency(indicators.reservaEmergencial)}</span>
              </div>
              <Progress 
                value={(indicators.reservaEmergencial / indicators.metaReservaEmergencial) * 100} 
                className="h-2" 
              />
              <p className="text-xs text-gray-500 mt-1">
                {formatPercentage((indicators.reservaEmergencial / indicators.metaReservaEmergencial) * 100)} da meta
              </p>
            </div>

            <div className="pt-4">
              <h3 className="text-sm font-medium mb-2">Meta de Reserva</h3>
              <p className="text-sm text-gray-500">
                Recomendado: {formatCurrency(indicators.metaReservaEmergencial)} (6 meses de renda)
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Gastos por Categoria</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {indicators.gastosPorCategoria.map((item) => (
              <div key={item.category}>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">{item.category}</span>
                  <span className="text-sm text-gray-500">{formatCurrency(item.amount)}</span>
                </div>
                <Progress 
                  value={(item.amount / indicators.rendaMensal) * 100} 
                  className="h-2" 
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formatPercentage((item.amount / indicators.rendaMensal) * 100)} da renda
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Indicadores;

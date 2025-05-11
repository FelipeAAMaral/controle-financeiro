
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Edit, Trash2 } from "lucide-react";

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

const Indicadores = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold tracking-tight">Indicadores</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Novo Indicador
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Cadastrar Novo Indicador</DialogTitle>
            </DialogHeader>
            <IndicadorForm onClose={() => setIsDialogOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="entrada" className="space-y-4">
        <TabsList>
          <TabsTrigger value="entrada">Entradas</TabsTrigger>
          <TabsTrigger value="saida">Saídas</TabsTrigger>
          <TabsTrigger value="beneficio">Benefícios</TabsTrigger>
        </TabsList>

        <Card>
          <CardHeader>
            <CardTitle>Categorias de Indicadores</CardTitle>
          </CardHeader>
          <CardContent>
            <TabsContent value="entrada" className="space-y-4">
              <IndicadorTable data={incomeCategories} />
            </TabsContent>
            <TabsContent value="saida" className="space-y-4">
              <IndicadorTable data={expenseCategories} />
            </TabsContent>
            <TabsContent value="beneficio" className="space-y-4">
              <IndicadorTable data={benefitCategories} />
            </TabsContent>
          </CardContent>
        </Card>
      </Tabs>
    </div>
  );
};

export default Indicadores;

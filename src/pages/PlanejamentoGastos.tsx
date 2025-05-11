
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Viagem } from "@/types";
import PlanejamentoGastosForm from "@/components/forms/PlanejamentoGastosForm";
import { PlanejamentoGastoViagem } from "@/types";

// Mock data
const mockViagens: Viagem[] = [
  {
    id: "1",
    nome: "Férias em Portugal",
    startDate: "2023-12-15",
    endDate: "2024-01-05",
    objetivo: "2", // ID do objetivo relacionado a viagem
    destinos: [
      {
        id: "d1",
        cidade: "Lisboa",
        pais: "Portugal",
        dataChegada: "2023-12-15",
        dataPartida: "2023-12-22",
        hospedagem: "Airbnb no centro de Lisboa",
      },
      {
        id: "d2",
        cidade: "Porto",
        pais: "Portugal",
        dataChegada: "2023-12-22",
        dataPartida: "2023-12-29",
        hospedagem: "Hotel Ribeira",
      },
      {
        id: "d3",
        cidade: "Faro",
        pais: "Portugal",
        dataChegada: "2023-12-29",
        dataPartida: "2024-01-05",
        hospedagem: "Pousada na praia",
      }
    ],
    budget: 15000
  },
  {
    id: "2",
    nome: "Intercâmbio na Espanha",
    startDate: "2024-03-10",
    endDate: "2024-05-20",
    objetivo: "3",
    destinos: [
      {
        id: "d4",
        cidade: "Barcelona",
        pais: "Espanha",
        dataChegada: "2024-03-10",
        dataPartida: "2024-05-20",
        hospedagem: "Apartamento estudantil",
      }
    ],
    budget: 20000
  }
];

// Mock de planejamento de gastos
const mockPlanejamentoGastos: PlanejamentoGastoViagem[] = [
  {
    id: "pg1",
    viagemId: "1",
    categoria: "Hospedagem",
    descricao: "Airbnb em Lisboa",
    valor: 500,
    moedaOrigem: "EUR",
    moedaDestino: "BRL",
    valorConvertido: 2750,
    taxaConversao: 5.5,
    taxaIOF: 6.38,
    taxaBancaria: 4,
    data: "2023-12-15"
  },
  {
    id: "pg2",
    viagemId: "1",
    categoria: "Alimentação",
    descricao: "Restaurantes em Lisboa",
    valor: 300,
    moedaOrigem: "EUR",
    moedaDestino: "BRL",
    valorConvertido: 1650,
    taxaConversao: 5.5,
    taxaIOF: 6.38,
    taxaBancaria: 4,
    data: "2023-12-16"
  }
];

export default function PlanejamentoGastos() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [viagem, setViagem] = useState<Viagem | null>(null);
  const [planejamentoGastos, setPlanejamentoGastos] = useState<PlanejamentoGastoViagem[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    // In a real app, you would fetch the travel data from an API
    setIsLoading(true);
    setTimeout(() => {
      const foundViagem = mockViagens.find(v => v.id === id);
      
      if (foundViagem) {
        setViagem(foundViagem);
        // Carregar planejamento de gastos da viagem
        const gastos = mockPlanejamentoGastos.filter(g => g.viagemId === id);
        setPlanejamentoGastos(gastos);
      } else {
        toast.error("Viagem não encontrada");
        navigate("/viagens");
      }
      
      setIsLoading(false);
    }, 300);
  }, [id, navigate]);

  const handleSubmit = (data: PlanejamentoGastoViagem) => {
    setIsSubmitting(true);
    
    // Aqui você enviaria os dados para o backend
    // Simulando uma chamada de API com setTimeout
    setTimeout(() => {
      const newGasto = {
        ...data,
        id: `pg-${Date.now()}`,
        viagemId: id || '',
      };
      
      setPlanejamentoGastos(prev => [...prev, newGasto]);
      setIsSubmitting(false);
      toast.success("Gasto adicionado ao planejamento!");
    }, 500);
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <p>Carregando detalhes da viagem...</p>
        </div>
      </div>
    );
  }
  
  if (!viagem) {
    return null;
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate(`/viagens/${id}`)}
          className="mr-2"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Voltar
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">Planejamento de Gastos</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Viagem: {viagem.nome}</CardTitle>
        </CardHeader>
        <CardContent>
          <PlanejamentoGastosForm 
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
            destinos={viagem.destinos}
          />
        </CardContent>
      </Card>
      
      {planejamentoGastos.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>Gastos Planejados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {planejamentoGastos.map(gasto => (
                <div key={gasto.id} className="border p-4 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{gasto.descricao}</h3>
                      <p className="text-sm text-muted-foreground">{gasto.categoria}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        {gasto.valor} {gasto.moedaOrigem}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        ≈ {gasto.valorConvertido} {gasto.moedaDestino}
                      </p>
                    </div>
                  </div>
                  <div className="mt-2 text-xs text-muted-foreground">
                    <p>Taxa: {gasto.taxaConversao} | IOF: {gasto.taxaIOF}% | Taxa Bancária: {gasto.taxaBancaria}%</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Nenhum gasto planejado ainda.</p>
        </div>
      )}
    </div>
  );
}

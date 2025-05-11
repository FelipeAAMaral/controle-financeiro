
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import ViagemForm from "@/components/forms/ViagemForm";
import { Viagem } from "@/types";

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

export default function EditarViagem() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [viagem, setViagem] = useState<Viagem | null>(null);
  
  useEffect(() => {
    // In a real app, you would fetch the travel data from an API
    // For now, we'll simulate loading data
    setIsLoading(true);
    setTimeout(() => {
      const foundViagem = mockViagens.find(v => v.id === id);
      
      if (foundViagem) {
        setViagem(foundViagem);
      } else {
        toast.error("Viagem não encontrada");
        navigate("/viagens");
      }
      
      setIsLoading(false);
    }, 300);
  }, [id, navigate]);
  
  const handleSubmit = (data: any) => {
    setIsSubmitting(true);
    
    // Here you would typically send the data to your backend
    // Simulate an API call with setTimeout
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success("Viagem atualizada com sucesso!");
      navigate("/viagens");
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
          onClick={() => navigate("/viagens")}
          className="mr-2"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Voltar
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">Editar Viagem</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Detalhes da Viagem</CardTitle>
        </CardHeader>
        <CardContent>
          <ViagemForm 
            onClose={() => navigate("/viagens")} 
            onSubmit={handleSubmit}
            initialData={viagem}
            isSubmitting={isSubmitting}
            isEdit={true}
          />
        </CardContent>
      </Card>
    </div>
  );
}


import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarDays, MapPin, Plane, Plus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
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

const Viagens = () => {
  const navigate = useNavigate();
  const [viagens] = useState<Viagem[]>(mockViagens);
  const [activeTab, setActiveTab] = useState("todas");

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  // Filtrar viagens baseado na aba selecionada
  const viagensFiltradas = viagens.filter(viagem => {
    const hoje = new Date();
    const dataInicio = new Date(viagem.startDate);
    const dataFim = new Date(viagem.endDate);
    
    if (activeTab === "todas") return true;
    if (activeTab === "futuras") return dataInicio > hoje;
    if (activeTab === "atuais") return dataInicio <= hoje && dataFim >= hoje;
    if (activeTab === "passadas") return dataFim < hoje;
    
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Viagens</h2>
          <p className="text-muted-foreground">
            Planeje e organize todas as suas viagens
          </p>
        </div>
        <Button onClick={() => navigate("/viagens/nova")}>
          <Plus className="mr-2 h-4 w-4" /> Nova Viagem
        </Button>
      </div>
      
      <Tabs defaultValue="todas" value={activeTab} onValueChange={setActiveTab}>
        <div className="border-b">
          <TabsList className="mb-0">
            <TabsTrigger value="todas">Todas</TabsTrigger>
            <TabsTrigger value="futuras">Futuras</TabsTrigger>
            <TabsTrigger value="atuais">Em andamento</TabsTrigger>
            <TabsTrigger value="passadas">Passadas</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="todas" className="pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {viagensFiltradas.length > 0 ? (
              viagensFiltradas.map((viagem) => (
                <Card key={viagem.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between">
                      <CardTitle className="text-lg">{viagem.nome}</CardTitle>
                      <Badge variant={
                        new Date(viagem.startDate) > new Date() ? "outline" :
                        (new Date(viagem.startDate) <= new Date() && new Date(viagem.endDate) >= new Date()) ? "default" :
                        "secondary"
                      }>
                        {new Date(viagem.startDate) > new Date() ? "Futura" :
                         (new Date(viagem.startDate) <= new Date() && new Date(viagem.endDate) >= new Date()) ? "Em andamento" :
                         "Passada"}
                      </Badge>
                    </div>
                    <CardDescription className="flex items-center mt-1">
                      <CalendarDays className="h-4 w-4 mr-1" />
                      {formatDate(viagem.startDate)} - {formatDate(viagem.endDate)}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="space-y-2">
                      <h4 className="text-sm font-medium">Destinos:</h4>
                      <div className="flex flex-wrap gap-2">
                        {viagem.destinos.map((destino) => (
                          <div key={destino.id} className="flex items-center text-sm">
                            <MapPin className="h-3 w-3 mr-1 text-muted-foreground" />
                            {destino.cidade}, {destino.pais}
                            {viagem.destinos.indexOf(destino) < viagem.destinos.length - 1 && (
                              <span className="mx-1">•</span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="mt-2">
                      <p className="text-sm"><span className="font-medium">Orçamento:</span> {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(viagem.budget)}</p>
                    </div>
                  </CardContent>
                  <CardFooter className="border-t bg-muted/30 pt-3 pb-3 flex justify-end gap-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => navigate(`/viagens/${viagem.id}`)}
                    >
                      Ver detalhes
                    </Button>
                    <Button 
                      size="sm" 
                      onClick={() => navigate(`/viagens/editar/${viagem.id}`)}
                    >
                      Editar
                    </Button>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="col-span-full flex flex-col items-center justify-center p-8 text-center">
                <Plane className="h-10 w-10 text-muted-foreground mb-3" />
                <h3 className="text-lg font-medium">Nenhuma viagem encontrada</h3>
                <p className="text-muted-foreground">
                  Clique no botão "Nova Viagem" para começar a planejar
                </p>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="futuras" className="pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* O conteúdo será filtrado automaticamente pela lógica acima */}
            {/* ... mesma estrutura de renderização ... */}
          </div>
        </TabsContent>
        
        <TabsContent value="atuais" className="pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* O conteúdo será filtrado automaticamente pela lógica acima */}
            {/* ... mesma estrutura de renderização ... */}
          </div>
        </TabsContent>
        
        <TabsContent value="passadas" className="pt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* O conteúdo será filtrado automaticamente pela lógica acima */}
            {/* ... mesma estrutura de renderização ... */}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Viagens;

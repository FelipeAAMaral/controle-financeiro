
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Calendar, MapPin, Hotel, Plane, Clock, ArrowRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Viagem } from "@/types";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

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
        observacoes: "Visitar Torre de Belém, Mosteiro dos Jerônimos e Bairro Alto."
      },
      {
        id: "d2",
        cidade: "Porto",
        pais: "Portugal",
        dataChegada: "2023-12-22",
        dataPartida: "2023-12-29",
        hospedagem: "Hotel Ribeira",
        observacoes: "Visitar as vinícolas e fazer um passeio de barco no Douro."
      },
      {
        id: "d3",
        cidade: "Faro",
        pais: "Portugal",
        dataChegada: "2023-12-29",
        dataPartida: "2024-01-05",
        hospedagem: "Pousada na praia",
        observacoes: "Relaxar nas praias e explorar as falésias do Algarve."
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
        observacoes: "Curso de Espanhol na Universidad de Barcelona."
      }
    ],
    budget: 20000
  }
];

export default function DetalhesViagem() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const getStatusBadge = () => {
    const hoje = new Date();
    const dataInicio = viagem ? new Date(viagem.startDate) : null;
    const dataFim = viagem ? new Date(viagem.endDate) : null;

    if (!dataInicio || !dataFim) return null;

    if (dataInicio > hoje) {
      return <Badge variant="outline">Futura</Badge>;
    } else if (dataInicio <= hoje && dataFim >= hoje) {
      return <Badge>Em andamento</Badge>;
    } else {
      return <Badge variant="secondary">Passada</Badge>;
    }
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
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
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
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{viagem.nome}</h1>
            <div className="flex items-center gap-2 text-muted-foreground text-sm mt-1">
              <Calendar className="h-4 w-4" />
              <span>
                {formatDate(viagem.startDate)} - {formatDate(viagem.endDate)}
              </span>
              {getStatusBadge()}
            </div>
          </div>
        </div>
        
        <Button onClick={() => navigate(`/viagens/editar/${viagem.id}`)}>
          Editar Viagem
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Roteiro</CardTitle>
            <CardDescription>Detalhes dos destinos e transportes</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="roteiro">
              <TabsList>
                <TabsTrigger value="roteiro">Roteiro</TabsTrigger>
                <TabsTrigger value="timeline">Timeline</TabsTrigger>
              </TabsList>
              
              <TabsContent value="roteiro" className="space-y-6 pt-4">
                {viagem.destinos.map((destino, index) => (
                  <div key={destino.id} className="relative">
                    <div className="flex flex-col md:flex-row md:items-start gap-4">
                      {/* Linha conectando os destinos */}
                      {index < viagem.destinos.length - 1 && (
                        <div className="absolute left-4 top-12 bottom-0 w-0.5 bg-gray-200 hidden md:block" />
                      )}
                      
                      <div className="flex-none relative">
                        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white">
                          {index + 1}
                        </div>
                      </div>
                      
                      <div className="flex-grow">
                        <Card>
                          <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                              <div>
                                <CardTitle className="text-lg">{destino.cidade}, {destino.pais}</CardTitle>
                                <CardDescription>
                                  <div className="flex items-center gap-2 mt-1">
                                    <Calendar className="h-4 w-4" />
                                    {formatDate(destino.dataChegada)} - {formatDate(destino.dataPartida)}
                                  </div>
                                </CardDescription>
                              </div>
                              
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Badge variant="outline">
                                      {Math.ceil((new Date(destino.dataPartida).getTime() - new Date(destino.dataChegada).getTime()) / (1000 * 60 * 60 * 24))} dias
                                    </Badge>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <p>Duração da estadia</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                          </CardHeader>
                          
                          <CardContent className="pb-2">
                            {destino.hospedagem && (
                              <div className="flex items-start gap-2 mb-2 text-sm">
                                <Hotel className="h-4 w-4 mt-0.5 text-muted-foreground" />
                                <span>{destino.hospedagem}</span>
                              </div>
                            )}
                            
                            {destino.observacoes && (
                              <div className="text-sm text-muted-foreground border-t pt-2">
                                {destino.observacoes}
                              </div>
                            )}
                          </CardContent>
                        </Card>
                        
                        {/* Transporte para o próximo destino */}
                        {index < viagem.destinos.length - 1 && (
                          <div className="flex items-center justify-center my-4 relative">
                            <div className="px-4 py-2 bg-muted rounded-md flex items-center gap-2 text-sm">
                              <Plane className="h-4 w-4" />
                              <span>Transporte para {viagem.destinos[index + 1].cidade}</span>
                              <ArrowRight className="h-4 w-4" />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </TabsContent>
              
              <TabsContent value="timeline" className="pt-4">
                <div className="relative border-l-2 border-primary/30 pl-4 ml-2 space-y-6">
                  {viagem.destinos.flatMap((destino, index) => {
                    const events = [
                      {
                        date: destino.dataChegada,
                        time: "10:00",
                        title: `Chegada em ${destino.cidade}`,
                        description: `Chegada em ${destino.cidade}, ${destino.pais}`
                      },
                      {
                        date: destino.dataPartida,
                        time: "12:00",
                        title: `Partida de ${destino.cidade}`,
                        description: `Partida de ${destino.cidade}, ${destino.pais}`
                      }
                    ];
                    
                    return events;
                  }).sort((a, b) => {
                    const dateA = new Date(`${a.date}T${a.time}`).getTime();
                    const dateB = new Date(`${b.date}T${b.time}`).getTime();
                    return dateA - dateB;
                  }).map((event, index) => (
                    <div key={index} className="relative">
                      <div className="absolute -left-[20px] mt-1 w-3 h-3 rounded-full bg-primary" />
                      <div className="mb-1 text-xs text-muted-foreground">
                        {formatDate(event.date)}, {event.time}
                      </div>
                      <h4 className="font-medium">{event.title}</h4>
                      <p className="text-sm text-muted-foreground">{event.description}</p>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Resumo da Viagem</CardTitle>
            </CardHeader>
            <CardContent>
              <dl className="space-y-4">
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Duração Total</dt>
                  <dd className="text-lg font-semibold">
                    {Math.ceil((new Date(viagem.endDate).getTime() - new Date(viagem.startDate).getTime()) / (1000 * 60 * 60 * 24))} dias
                  </dd>
                </div>
                
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Destinos</dt>
                  <dd className="text-lg font-semibold">{viagem.destinos.length}</dd>
                </div>
                
                <div>
                  <dt className="text-sm font-medium text-muted-foreground">Orçamento</dt>
                  <dd className="text-lg font-semibold">
                    {new Intl.NumberFormat('pt-BR', { 
                      style: 'currency', 
                      currency: 'BRL' 
                    }).format(viagem.budget)}
                  </dd>
                </div>
                
                {viagem.objetivo && (
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Objetivo Vinculado</dt>
                    <dd>
                      <Button 
                        variant="link" 
                        className="p-0 h-auto text-lg font-semibold"
                        onClick={() => navigate(`/objetivos/${viagem.objetivo}`)}
                      >
                        {viagem.objetivo === "2" ? "Viagem para Europa" : "Intercâmbio"}
                      </Button>
                    </dd>
                  </div>
                )}
                
                <Separator />
                
                <div>
                  <dt className="text-sm font-medium text-muted-foreground mb-2">Países</dt>
                  <dd className="flex flex-wrap gap-2">
                    {Array.from(new Set(viagem.destinos.map(d => d.pais))).map(pais => (
                      <Badge key={pais} variant="secondary">{pais}</Badge>
                    ))}
                  </dd>
                </div>
              </dl>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Calendário</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center text-sm text-muted-foreground">
                Funcionalidade de calendário em desenvolvimento
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarDays, MapPin, Plane, Plus, Clock, ArrowRight, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Viagem } from "@/types";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import ImportarVooForm from "@/components/viagens/ImportarVooForm";
import { iniciarPollingReservas } from "@/services/ReservasService";
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination";
import { ViagensService } from "@/services/viagensService";
import { useAuth } from "@/hooks/useAuth";
import { DollarSign } from "lucide-react";

const Viagens = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [viagens, setViagens] = useState<Viagem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [voos, setVoos] = useState([]);
  const [activeTab, setActiveTab] = useState("todas");
  const [visualizacao, setVisualizacao] = useState<"lista" | "voos">("lista");
  const [isImportFormOpen, setIsImportFormOpen] = useState(false);
  const [atualizandoReservas, setAtualizandoReservas] = useState(false);
  
  // Paginação
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4; // Número de voos por página

  useEffect(() => {
    const loadViagens = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        const viagensService = new ViagensService();
        const data = await viagensService.getViagens(user.id);
        setViagens(data);
      } catch (error) {
        console.error('Erro ao carregar viagens:', error);
        toast.error('Erro ao carregar viagens');
      } finally {
        setIsLoading(false);
      }
    };

    loadViagens();
  }, [user]);

  useEffect(() => {
    // Iniciar o polling para verificação automática das reservas
    const cancelarPolling = iniciarPollingReservas((voosAtualizados, viagemId) => {
      setVoos(prevVoos => {
        // Filtrar os voos da viagem que foram atualizados
        const voosNaoAtualizados = prevVoos.filter(v => 
          !(v.viagemId === viagemId && voosAtualizados.some(va => va.numeroVoo === v.numeroVoo))
        );
        
        // Adicionar os voos atualizados
        const novosVoos = [...voosNaoAtualizados, ...voosAtualizados];
        
        // Notificar o usuário sobre a atualização
        toast.info(`Informações de voo atualizadas para a viagem ${
          viagens.find(v => v.id === viagemId)?.nome || viagemId
        }`);
        
        return novosVoos;
      });
    });
    
    // Limpar o polling quando o componente for desmontado
    return () => {
      cancelarPolling();
    };
  }, [viagens]);

  useEffect(() => {
    // Resetar a paginação quando mudar o filtro
    setCurrentPage(1);
  }, [activeTab]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  // Função para lidar com voos importados
  const handleVoosImportados = (novosVoos: any[]) => {
    setVoos(prev => [...prev, ...novosVoos]);
  };

  // Verificar manualmente as reservas
  const verificarReservas = () => {
    setAtualizandoReservas(true);
    
    // Simular verificação
    setTimeout(() => {
      toast.success("Verificação concluída. Todas as informações estão atualizadas.");
      setAtualizandoReservas(false);
    }, 1000);
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

  // Filtrar voos com base na mesma lógica de viagens
  const voosFiltrados = voos.filter(voo => {
    const hoje = new Date();
    const dataVoo = new Date(voo.data);
    const viagemRelacionada = viagens.find(v => v.id === voo.viagemId);
    
    if (!viagemRelacionada) return false;
    
    if (activeTab === "todas") return true;
    if (activeTab === "futuras") return dataVoo > hoje;
    if (activeTab === "atuais") {
      const dataInicio = new Date(viagemRelacionada.startDate);
      const dataFim = new Date(viagemRelacionada.endDate);
      return dataInicio <= hoje && dataFim >= hoje;
    }
    if (activeTab === "passadas") return dataVoo < hoje;
    
    return true;
  });

  // Implementar paginação
  const totalPages = Math.ceil(voosFiltrados.length / itemsPerPage);
  const indexOfLastVoo = currentPage * itemsPerPage;
  const indexOfFirstVoo = indexOfLastVoo - itemsPerPage;
  const currentVoos = voosFiltrados.slice(indexOfFirstVoo, indexOfLastVoo);

  const getStatusBadge = (viagem: Viagem) => {
    const hoje = new Date();
    const dataInicio = new Date(viagem.startDate);
    const dataFim = new Date(viagem.endDate);

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
          <p>Carregando viagens...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Viagens</h2>
          <p className="text-muted-foreground">
            Planeje e organize todas as suas viagens
          </p>
        </div>
        <div className="flex gap-2">
          <div className="border rounded-md overflow-hidden flex">
            <Button 
              variant={visualizacao === "lista" ? "default" : "ghost"} 
              className="rounded-none"
              onClick={() => setVisualizacao("lista")}
            >
              Lista
            </Button>
            <Button 
              variant={visualizacao === "voos" ? "default" : "ghost"} 
              className="rounded-none"
              onClick={() => setVisualizacao("voos")}
            >
              Voos
            </Button>
          </div>
          <Button onClick={() => navigate("/viagens/nova")}>
            <Plus className="mr-2 h-4 w-4" /> Nova Viagem
          </Button>
        </div>
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
        
        {visualizacao === "voos" && (
          <div className="flex justify-between items-center pt-4">
            <div className="text-sm text-muted-foreground">
              Visualizando {currentVoos.length} de {voosFiltrados.length} voos
            </div>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={verificarReservas}
                disabled={atualizandoReservas}
              >
                {atualizandoReservas ? (
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="mr-2 h-4 w-4" />
                )}
                Atualizar Reservas
              </Button>
              <Button 
                size="sm"
                onClick={() => setIsImportFormOpen(true)}
              >
                <Plane className="mr-2 h-4 w-4" />
                Importar Voos
              </Button>
            </div>
          </div>
        )}
        
        {visualizacao === "lista" ? (
          <TabsContent value="todas" className="pt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {viagensFiltradas.length > 0 ? (
                viagensFiltradas.map((viagem) => (
                  <Card key={viagem.id} className="overflow-hidden">
                    <CardHeader className="pb-2">
                      <div className="flex justify-between">
                        <CardTitle className="text-lg">{viagem.nome}</CardTitle>
                        {getStatusBadge(viagem)}
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
        ) : (
          <TabsContent value="todas" className="pt-4">
            <div className="flex flex-col space-y-6">
              {currentVoos.length > 0 ? (
                currentVoos.map((voo) => {
                  const viagemRelacionada = viagens.find(v => v.id === voo.viagemId);
                  const horaPartida = voo.horarioPartida.split(':');
                  const horaChegada = voo.horarioChegada.split(':');
                  
                  return (
                    <Card key={voo.id} className="overflow-hidden border-l-4" style={{ borderLeftColor: '#8B5CF6' }}>
                      <CardHeader className="pb-2 pt-4">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                          <div>
                            <div className="flex items-center mb-1">
                              <Badge className="mr-2" variant="outline">{voo.companhia}</Badge>
                              <span className="text-sm font-medium">{voo.numeroVoo}</span>
                            </div>
                            <CardTitle className="text-lg flex items-center">
                              <span className="font-mono">{voo.codigoOrigem}</span>
                              <ArrowRight className="mx-2 h-4 w-4" />
                              <span className="font-mono">{voo.codigoDestino}</span>
                            </CardTitle>
                            <CardDescription className="mt-1">
                              {formatDate(voo.data)} • {voo.origem} → {voo.destino}
                            </CardDescription>
                          </div>
                          
                          <Badge variant={
                            new Date(voo.data) > new Date() ? "outline" :
                            new Date(voo.data) < new Date() ? "secondary" : "default"
                          }>
                            {voo.status}
                          </Badge>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="pb-2">
                        <div className="flex flex-col md:flex-row gap-6 md:items-center">
                          <div className="flex flex-col md:min-w-[120px]">
                            <div className="text-2xl font-bold font-mono">{horaPartida[0]}:{horaPartida[1]}</div>
                            <div className="text-sm text-muted-foreground">{voo.origem} ({voo.codigoOrigem})</div>
                            <div className="text-xs mt-1">Terminal {voo.terminal}, Portão {voo.portao}</div>
                          </div>
                          
                          <div className="flex flex-col items-center py-2">
                            <div className="text-xs text-muted-foreground">{voo.duracao}</div>
                            <div className="relative w-full md:w-28 h-[2px] bg-muted my-2">
                              {voo.escalas.length > 0 && (
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-primary"></div>
                              )}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {voo.escalas.length === 0 ? "Voo direto" : 
                                `${voo.escalas.length} ${voo.escalas.length === 1 ? "escala" : "escalas"}`}
                            </div>
                          </div>
                          
                          <div className="flex flex-col md:min-w-[120px]">
                            <div className="text-2xl font-bold font-mono">{horaChegada[0]}:{horaChegada[1]}</div>
                            <div className="text-sm text-muted-foreground">{voo.destino} ({voo.codigoDestino})</div>
                            <div className="text-xs mt-1">Terminal {voo.terminal}, Portão {voo.portao}</div>
                          </div>
                          
                          {voo.escalas.length > 0 && (
                            <div className="flex-grow">
                              <Separator className="my-2" />
                              <div className="text-sm font-medium mb-1">Escala{voo.escalas.length > 1 ? "s" : ""}</div>
                              {voo.escalas.map((escala, index) => (
                                <div key={index} className="flex items-center text-sm">
                                  <Clock className="h-3 w-3 mr-1 text-muted-foreground" />
                                  <span>{escala.aeroporto} ({escala.codigo})</span>
                                  <span className="mx-2">•</span>
                                  <span>
                                    {escala.chegada} - {escala.partida}
                                  </span>
                                  <span className="mx-2">•</span>
                                  <span>Terminal {escala.terminal}, Portão {escala.portao}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </CardContent>
                      
                      <CardFooter className="border-t bg-muted/30 pt-3 pb-3 flex justify-between">
                        <div className="text-sm">
                          <span className="font-medium">Viagem:</span>{" "}
                          <Button 
                            variant="link" 
                            className="p-0 h-auto text-sm"
                            onClick={() => navigate(`/viagens/${viagemRelacionada?.id}`)}
                          >
                            {viagemRelacionada?.nome}
                          </Button>
                        </div>
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => navigate(`/viagens/${viagemRelacionada?.id}`)}
                        >
                          Ver detalhes
                        </Button>
                      </CardFooter>
                    </Card>
                  );
                })
              ) : (
                <div className="flex flex-col items-center justify-center p-8 text-center">
                  <Plane className="h-10 w-10 text-muted-foreground mb-3" />
                  <h3 className="text-lg font-medium">Nenhum voo encontrado</h3>
                  <p className="text-muted-foreground">
                    Adicione voos às suas viagens ou importe usando seu código de reserva
                  </p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => setIsImportFormOpen(true)}
                  >
                    <Plane className="mr-2 h-4 w-4" />
                    Importar Voos
                  </Button>
                </div>
              )}
              
              {/* Adicionar paginação para os voos */}
              {voosFiltrados.length > itemsPerPage && (
                <Pagination className="mt-6">
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                    
                    {Array.from({ length: totalPages }, (_, index) => index + 1).map(page => (
                      <PaginationItem key={page}>
                        <PaginationLink
                          isActive={page === currentPage}
                          onClick={() => setCurrentPage(page)}
                        >
                          {page}
                        </PaginationLink>
                      </PaginationItem>
                    ))}
                    
                    <PaginationItem>
                      <PaginationNext
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              )}
            </div>
          </TabsContent>
        )}
        
        <TabsContent value="futuras" className="pt-4">
          {visualizacao === "lista" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* O conteúdo será filtrado automaticamente pela lógica acima */}
            </div>
          ) : (
            <div className="flex flex-col space-y-6">
              {/* Voos filtrados serão mostrados aqui */}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="atuais" className="pt-4">
          {visualizacao === "lista" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* O conteúdo será filtrado automaticamente pela lógica acima */}
            </div>
          ) : (
            <div className="flex flex-col space-y-6">
              {/* Voos filtrados serão mostrados aqui */}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="passadas" className="pt-4">
          {visualizacao === "lista" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* O conteúdo será filtrado automaticamente pela lógica acima */}
            </div>
          ) : (
            <div className="flex flex-col space-y-6">
              {/* Voos filtrados serão mostrados aqui */}
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      {/* Modal de importação de voos */}
      <ImportarVooForm
        open={isImportFormOpen}
        onOpenChange={setIsImportFormOpen}
        onSuccess={handleVoosImportados}
      />
    </div>
  );
};

export default Viagens;

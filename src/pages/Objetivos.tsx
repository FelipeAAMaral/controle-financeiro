import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Plus, Target, Calendar, DollarSign } from "lucide-react";
import { Objetivo } from "@/types";
import { ObjetivosService } from "@/services/objetivosService";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

export default function Objetivos() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [objetivos, setObjetivos] = useState<Objetivo[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadObjetivos = async () => {
      if (!user) return;
      
      try {
        setIsLoading(true);
        const objetivosService = new ObjetivosService();
        const data = await objetivosService.getObjetivos(user.id);
        setObjetivos(data);
      } catch (error) {
        console.error('Erro ao carregar objetivos:', error);
        toast.error('Erro ao carregar objetivos');
      } finally {
        setIsLoading(false);
      }
    };

    loadObjetivos();
  }, [user]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const calculateProgress = (objetivo: Objetivo) => {
    const current = parseFloat(objetivo.currentAmount);
    const target = parseFloat(objetivo.targetAmount);
    return Math.min((current / target) * 100, 100);
  };

  const getStatusBadge = (objetivo: Objetivo) => {
    const hoje = new Date();
    const deadline = new Date(objetivo.deadline);
    const progress = calculateProgress(objetivo);

    if (progress >= 100) {
      return <Badge>Concluído</Badge>;
    } else if (deadline < hoje) {
      return <Badge variant="destructive">Atrasado</Badge>;
    } else {
      return <Badge variant="outline">Em andamento</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <p>Carregando objetivos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Meus Objetivos</h1>
        <Button onClick={() => navigate("/objetivos/novo")}>
          <Plus className="mr-2 h-4 w-4" />
          Novo Objetivo
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {objetivos.map((objetivo) => (
          <Card key={objetivo.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center">
                    <span className="mr-2">{objetivo.icon}</span>
                    {objetivo.title}
                  </CardTitle>
                  <CardDescription>
                    <div className="flex items-center mt-2">
                      <Target className="mr-2 h-4 w-4" />
                      <span>
                        R$ {parseFloat(objetivo.currentAmount).toLocaleString('pt-BR')} / R$ {parseFloat(objetivo.targetAmount).toLocaleString('pt-BR')}
                      </span>
                    </div>
                  </CardDescription>
                </div>
                {getStatusBadge(objetivo)}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Progress value={calculateProgress(objetivo)} className="h-2" />
                <div className="flex items-center text-sm">
                  <Calendar className="mr-2 h-4 w-4" />
                  <span>Prazo: {formatDate(objetivo.deadline)}</span>
                </div>
                <div className="flex items-center text-sm">
                  <DollarSign className="mr-2 h-4 w-4" />
                  <span>
                    Falta: R$ {(parseFloat(objetivo.targetAmount) - parseFloat(objetivo.currentAmount)).toLocaleString('pt-BR')}
                  </span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => navigate(`/objetivos/${objetivo.id}`)}
              >
                Ver Detalhes
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}

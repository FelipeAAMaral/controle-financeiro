import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { useEffect, useState } from "react";
import { DashboardService } from "@/services/dashboardService";
import { toast } from "sonner";
import { AlertCircle, TrendingUp, TrendingDown, PiggyBank } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface FinancialTip {
  id: string;
  title: string;
  description: string;
  type: 'warning' | 'success' | 'info';
  icon: string;
}

const FinancialTips = () => {
  const { user } = useAuth();
  const [tips, setTips] = useState<FinancialTip[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadTips = async () => {
      if (!user) return;

      try {
        setLoading(true);
        const dashboardService = new DashboardService();
        const tipsData = await dashboardService.getFinancialTips(user.id);
        setTips(tipsData);
      } catch (error) {
        console.error('Erro ao carregar dicas financeiras:', error);
        toast.error('Erro ao carregar dicas financeiras');
      } finally {
        setLoading(false);
      }
    };

    loadTips();
  }, [user]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[...Array(2)].map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (tips.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center p-6 space-y-4">
          <p className="text-gray-500 text-center">
            Para receber dicas financeiras personalizadas, comece registrando suas transações e objetivos financeiros.
          </p>
          <div className="flex gap-4">
            <Button onClick={() => navigate('/transacoes/nova')}>
              Registrar Transação
            </Button>
            <Button variant="outline" onClick={() => navigate('/objetivos/novo')}>
              Criar Objetivo
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getIcon = (icon: string) => {
    switch (icon) {
      case 'alert':
        return <AlertCircle className="h-5 w-5" />;
      case 'trending-up':
        return <TrendingUp className="h-5 w-5" />;
      case 'trending-down':
        return <TrendingDown className="h-5 w-5" />;
      case 'piggy-bank':
        return <PiggyBank className="h-5 w-5" />;
      default:
        return <AlertCircle className="h-5 w-5" />;
    }
  };

  const getTypeStyles = (type: string) => {
    switch (type) {
      case 'warning':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'success':
        return 'bg-green-50 text-green-800 border-green-200';
      case 'info':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-50 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {tips.map((tip) => (
        <Card key={tip.id} className={getTypeStyles(tip.type)}>
          <CardHeader className="flex flex-row items-center gap-2">
            {getIcon(tip.icon)}
            <CardTitle className="text-base">{tip.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">{tip.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default FinancialTips;

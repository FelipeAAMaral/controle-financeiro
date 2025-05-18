import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { GastosRecorrentesService } from "@/services/gastosRecorrentesService";
import { toast } from "sonner";
import GastoRecorrenteForm from "@/components/forms/GastoRecorrenteForm";

const NovoGastoRecorrente = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: any) => {
    if (!user) return;

    try {
      setIsSubmitting(true);
      const service = new GastosRecorrentesService();
      await service.createGastoRecorrente({
        description: data.description,
        amount: parseFloat(data.amount),
        day: parseInt(data.day, 10),
        category: data.category,
        type: data.type,
        benefitType: data.type === 'beneficio' ? data.benefitType : undefined,
        user_id: user.id
      });
      
      toast.success('Gasto recorrente cadastrado com sucesso!');
      navigate('/gastos-recorrentes');
    } catch (error) {
      console.error('Erro ao criar gasto recorrente:', error);
      toast.error('Erro ao criar gasto recorrente');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Novo Gasto Recorrente</CardTitle>
          </CardHeader>
          <CardContent>
            <GastoRecorrenteForm
              onSubmit={handleSubmit}
              onClose={() => navigate('/gastos-recorrentes')}
              isSubmitting={isSubmitting}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default NovoGastoRecorrente; 
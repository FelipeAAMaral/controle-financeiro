
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import ObjetivoForm from "@/components/forms/ObjetivoForm";

export default function NovoObjetivo() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = (data: any) => {
    setIsSubmitting(true);
    
    // Here you would typically send the data to your backend
    // Simulate an API call with setTimeout
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success("Objetivo adicionado com sucesso!");
      navigate("/objetivos");
    }, 500);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate("/objetivos")}
          className="mr-2"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Voltar
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">Novo Objetivo</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Detalhes do Objetivo</CardTitle>
        </CardHeader>
        <CardContent>
          <ObjetivoForm 
            onClose={() => navigate("/objetivos")} 
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        </CardContent>
      </Card>
    </div>
  );
}


import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import ViagemForm from "@/components/forms/ViagemForm";

export default function NovaViagem() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = (data: any) => {
    setIsSubmitting(true);
    
    // Here you would typically send the data to your backend
    // Simulate an API call with setTimeout
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success("Viagem adicionada com sucesso!");
      navigate("/viagens");
    }, 500);
  };
  
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
        <h1 className="text-2xl font-bold tracking-tight">Nova Viagem</h1>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Detalhes da Viagem</CardTitle>
        </CardHeader>
        <CardContent>
          <ViagemForm 
            onClose={() => navigate("/viagens")} 
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        </CardContent>
      </Card>
    </div>
  );
}


import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ImportarVooFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (voos: any[]) => void;
  viagemId?: string;
}

export default function ImportarVooForm({ open, onOpenChange, onSuccess, viagemId }: ImportarVooFormProps) {
  const [codigoReserva, setCodigoReserva] = useState("");
  const [sobrenome, setSobrenome] = useState("");
  const [companhiaAerea, setCompanhiaAerea] = useState(""); // New state for airline selection
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!codigoReserva || !sobrenome) {
      setError("Preencha todos os campos");
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Simular uma chamada API para importar voos
      // Em um app real, isso seria uma chamada para um serviço externo
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock dos dados de voo retornados
      const mockVoosImportados = [
        {
          id: `v${Math.random().toString(36).substr(2, 9)}`,
          viagemId: viagemId || "1",
          origem: "São Paulo",
          codigoOrigem: "GRU",
          destino: "Paris",
          codigoDestino: "CDG",
          data: "2023-12-01",
          horarioPartida: "22:30",
          horarioChegada: "14:45",
          companhia: companhiaAerea || "Air France", // Use selected airline or default
          numeroVoo: "AF457",
          terminal: "3",
          portao: "22",
          status: "Confirmado",
          duracao: "11h 15m",
          escalas: [
            {
              aeroporto: "Lisboa",
              codigo: "LIS",
              chegada: "08:20",
              partida: "09:30",
              terminal: "1",
              portao: "18"
            }
          ]
        }
      ];
      
      toast.success("Voos importados com sucesso!");
      onSuccess(mockVoosImportados);
      onOpenChange(false);
      
      // Configurar polling para atualizações de reserva (a cada 30 minutos)
      // Em um cenário real, isso poderia ser feito com websockets ou um serviço de notificações
      localStorage.setItem(`reserva_${codigoReserva}`, JSON.stringify({
        codigoReserva,
        sobrenome,
        lastChecked: new Date().toISOString(),
        viagemId,
        companhiaAerea
      }));
      
    } catch (error) {
      console.error("Erro ao importar voos:", error);
      setError("Não foi possível importar os voos. Verifique os dados e tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Importar Voos</DialogTitle>
          <DialogDescription>
            Insira o código de reserva e sobrenome para importar automaticamente seus voos.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="text-sm font-medium text-destructive">{error}</div>
          )}
          
          <div className="grid gap-2">
            <Label htmlFor="codigoReserva">Código de Reserva</Label>
            <Input
              id="codigoReserva"
              value={codigoReserva}
              onChange={(e) => setCodigoReserva(e.target.value.toUpperCase())}
              placeholder="Ex: ABC123"
              className="uppercase"
              maxLength={6}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="sobrenome">Sobrenome</Label>
            <Input
              id="sobrenome"
              value={sobrenome}
              onChange={(e) => setSobrenome(e.target.value.toUpperCase())}
              placeholder="Ex: SILVA"
              className="uppercase"
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="companhiaAerea">Companhia Aérea</Label>
            <Select value={companhiaAerea} onValueChange={setCompanhiaAerea}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione a companhia aérea" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="LATAM">LATAM Airlines</SelectItem>
                <SelectItem value="GOL">GOL Linhas Aéreas</SelectItem>
                <SelectItem value="Azul">Azul Linhas Aéreas</SelectItem>
                <SelectItem value="Air France">Air France</SelectItem>
                <SelectItem value="TAP">TAP Air Portugal</SelectItem>
                <SelectItem value="American Airlines">American Airlines</SelectItem>
                <SelectItem value="British Airways">British Airways</SelectItem>
                <SelectItem value="Emirates">Emirates</SelectItem>
                <SelectItem value="Lufthansa">Lufthansa</SelectItem>
                <SelectItem value="KLM">KLM</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <DialogFooter className="mt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Importar Voos
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

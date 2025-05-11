
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Calculator } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import { PlanejamentoGastoViagem, CotacaoMoeda } from "@/types";

// Mock de cotações de moedas
const mockCotacoes: CotacaoMoeda[] = [
  { codigo: "USD", nome: "Dólar Americano", valor: 5.50, dataAtualizacao: new Date().toISOString() },
  { codigo: "EUR", nome: "Euro", valor: 6.20, dataAtualizacao: new Date().toISOString() },
  { codigo: "GBP", nome: "Libra Esterlina", valor: 7.30, dataAtualizacao: new Date().toISOString() },
  { codigo: "JPY", nome: "Iene Japonês", valor: 0.049, dataAtualizacao: new Date().toISOString() },
  { codigo: "AUD", nome: "Dólar Australiano", valor: 3.85, dataAtualizacao: new Date().toISOString() },
  { codigo: "CAD", nome: "Dólar Canadense", valor: 4.05, dataAtualizacao: new Date().toISOString() },
  { codigo: "CHF", nome: "Franco Suíço", valor: 6.45, dataAtualizacao: new Date().toISOString() },
  { codigo: "CNY", nome: "Yuan Chinês", valor: 0.84, dataAtualizacao: new Date().toISOString() },
  { codigo: "ARS", nome: "Peso Argentino", valor: 0.063, dataAtualizacao: new Date().toISOString() },
];

const CATEGORIAS_GASTOS = [
  "Hospedagem",
  "Alimentação",
  "Transporte",
  "Passeios",
  "Compras",
  "Ingressos",
  "Seguro Viagem",
  "Outros"
];

const planejamentoSchema = z.object({
  id: z.string().optional(),
  viagemId: z.string(),
  categoria: z.string(),
  descricao: z.string().min(3, { message: "Descrição deve ter pelo menos 3 caracteres" }),
  valor: z.number().positive({ message: "Valor deve ser positivo" }),
  moedaOrigem: z.string(),
  moedaDestino: z.string(),
  data: z.date().optional(),
  observacoes: z.string().optional()
});

type PlanejamentoFormValues = z.infer<typeof planejamentoSchema>;

interface PlanejamentoGastosFormProps {
  viagemId: string;
  initialData?: PlanejamentoGastoViagem;
  onSubmit: (data: any) => void;
  onClose: () => void;
  isSubmitting: boolean;
  isEdit?: boolean;
}

const PlanejamentoGastosForm = ({
  viagemId,
  initialData,
  onSubmit,
  onClose,
  isSubmitting,
  isEdit = false
}: PlanejamentoGastosFormProps) => {
  const [valorConvertido, setValorConvertido] = useState<number>(0);
  const [taxaConversao, setTaxaConversao] = useState<number>(0);
  
  const form = useForm<PlanejamentoFormValues>({
    resolver: zodResolver(planejamentoSchema),
    defaultValues: initialData ? {
      ...initialData,
      data: initialData.data ? new Date(initialData.data) : undefined,
      viagemId: initialData.viagemId
    } : {
      viagemId,
      categoria: CATEGORIAS_GASTOS[0],
      descricao: "",
      valor: 0,
      moedaOrigem: "BRL",
      moedaDestino: "USD",
    }
  });
  
  // Observa mudanças nos valores relevantes para calcular a conversão
  const watchValor = form.watch("valor");
  const watchMoedaOrigem = form.watch("moedaOrigem");
  const watchMoedaDestino = form.watch("moedaDestino");
  
  // Calcula a conversão de moeda
  const calcularConversao = () => {
    let taxaIOF = 6.38; // IOF para operações internacionais
    let taxaBancaria = 4; // Taxa bancária média
    
    // Obter as cotações das moedas
    let cotacaoOrigem = watchMoedaOrigem === "BRL" ? 1 : mockCotacoes.find(c => c.codigo === watchMoedaOrigem)?.valor || 1;
    let cotacaoDestino = watchMoedaDestino === "BRL" ? 1 : mockCotacoes.find(c => c.codigo === watchMoedaDestino)?.valor || 1;
    
    // Calcular taxa de conversão
    let taxa = 0;
    if (watchMoedaOrigem === "BRL" && watchMoedaDestino !== "BRL") {
      taxa = 1 / cotacaoDestino;
    } else if (watchMoedaOrigem !== "BRL" && watchMoedaDestino === "BRL") {
      taxa = cotacaoOrigem;
    } else if (watchMoedaOrigem !== "BRL" && watchMoedaDestino !== "BRL") {
      taxa = cotacaoOrigem / cotacaoDestino;
    }
    
    setTaxaConversao(taxa);
    
    // Calcular valor convertido considerando as taxas
    const taxaTotal = (watchMoedaOrigem !== watchMoedaDestino) ? (1 - ((taxaIOF + taxaBancaria) / 100)) : 1;
    const valorFinal = watchValor * taxa * taxaTotal;
    
    setValorConvertido(valorFinal);
    
    return {
      valorConvertido: valorFinal,
      taxaConversao: taxa,
      taxaIOF,
      taxaBancaria
    };
  };
  
  // Recalcular sempre que os valores mudarem
  React.useEffect(() => {
    if (watchValor > 0) {
      calcularConversao();
    }
  }, [watchValor, watchMoedaOrigem, watchMoedaDestino]);
  
  const handleSubmit = (values: PlanejamentoFormValues) => {
    const conversao = calcularConversao();
    
    // Preparar os dados para enviar
    const data = {
      ...values,
      data: values.data ? format(values.data, 'yyyy-MM-dd') : undefined,
      valorConvertido: conversao.valorConvertido,
      taxaConversao: conversao.taxaConversao,
      taxaIOF: conversao.taxaIOF,
      taxaBancaria: conversao.taxaBancaria,
      id: initialData?.id || `gasto-${Date.now()}`,
    };
    
    onSubmit(data);
  };
  
  // Formatar moeda
  const formatarMoeda = (valor: number, moeda: string) => {
    if (moeda === "BRL") {
      return new Intl.NumberFormat('pt-BR', { 
        style: 'currency', 
        currency: 'BRL' 
      }).format(valor);
    }
    
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: moeda 
    }).format(valor);
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="categoria"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Categoria</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma categoria" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {CATEGORIAS_GASTOS.map((categoria) => (
                      <SelectItem key={categoria} value={categoria}>
                        {categoria}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="descricao"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descrição</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Jantar no restaurante X" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="valor"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Valor</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="100.00" 
                    {...field}
                    onChange={(e) => field.onChange(parseFloat(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="moedaOrigem"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Moeda</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a moeda" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="BRL">Real (BRL)</SelectItem>
                    {mockCotacoes.map((moeda) => (
                      <SelectItem key={moeda.codigo} value={moeda.codigo}>
                        {moeda.nome} ({moeda.codigo})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="moedaDestino"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Converter Para</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a moeda" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="BRL">Real (BRL)</SelectItem>
                    {mockCotacoes.map((moeda) => (
                      <SelectItem key={moeda.codigo} value={moeda.codigo}>
                        {moeda.nome} ({moeda.codigo})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="data"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Data do Gasto (opcional)</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={`w-full pl-3 text-left font-normal ${!field.value ? "text-muted-foreground" : ""}`}
                      >
                        {field.value ? (
                          format(field.value, "PPP", { locale: pt })
                        ) : (
                          <span>Selecione a data</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription>
                  Data prevista para este gasto
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="observacoes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Observações</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Observações adicionais sobre este gasto"
                  className="resize-none"
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {watchValor > 0 && watchMoedaOrigem !== watchMoedaDestino && (
          <Card>
            <CardContent className="p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium flex items-center">
                  <Calculator className="h-4 w-4 mr-2 text-muted-foreground" /> 
                  Resumo da Conversão
                </span>
                <span className="text-sm text-muted-foreground">
                  Atualizado em {format(new Date(), "dd/MM/yyyy 'às' HH:mm")}
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <div className="flex justify-between text-sm">
                    <span>Valor original:</span>
                    <span className="font-medium">{formatarMoeda(watchValor, watchMoedaOrigem)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Taxa de conversão:</span>
                    <span className="font-medium">
                      1 {watchMoedaOrigem} = {taxaConversao.toFixed(4)} {watchMoedaDestino}
                    </span>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm">
                    <span>Taxa IOF (6,38%):</span>
                    <span className="font-medium">{formatarMoeda(watchValor * taxaConversao * 0.0638, watchMoedaDestino)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Taxa bancária (4%):</span>
                    <span className="font-medium">{formatarMoeda(watchValor * taxaConversao * 0.04, watchMoedaDestino)}</span>
                  </div>
                </div>
              </div>
              <div className="flex justify-between pt-2 border-t text-base font-bold">
                <span>Valor convertido:</span>
                <span>{formatarMoeda(valorConvertido, watchMoedaDestino)}</span>
              </div>
            </CardContent>
          </Card>
        )}
        
        <div className="flex justify-end space-x-4 pt-4">
          <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Salvando..." : isEdit ? "Atualizar Gasto" : "Adicionar Gasto"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default PlanejamentoGastosForm;

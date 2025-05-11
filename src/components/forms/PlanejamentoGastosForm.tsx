import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Calculator } from "lucide-react";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import { Card, CardContent } from "@/components/ui/card";
import { Destino, PlanejamentoGastoViagem } from "@/types";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

// Mock de cotações de moedas
const mockCotacoes = [
  { codigo: "USD", nome: "Dólar Americano", valor: 5.05 },
  { codigo: "EUR", nome: "Euro", valor: 5.50 },
  { codigo: "GBP", nome: "Libra Esterlina", valor: 6.45 },
  { codigo: "JPY", nome: "Iene Japonês", valor: 0.035 },
  { codigo: "CAD", nome: "Dólar Canadense", valor: 3.75 },
  { codigo: "AUD", nome: "Dólar Australiano", valor: 3.35 },
];

// Categorias de gastos comuns em viagens
const categorias = [
  "Hospedagem", 
  "Alimentação", 
  "Transporte", 
  "Passeios", 
  "Compras", 
  "Ingressos", 
  "Seguro Viagem", 
  "Outros"
];

// Esquema de validação para o formulário
const planejamentoGastoSchema = z.object({
  categoria: z.string({
    required_error: "Selecione uma categoria",
  }),
  descricao: z.string().min(3, { message: "Descrição deve ter pelo menos 3 caracteres" }),
  valor: z.number({
    required_error: "Valor é obrigatório",
    invalid_type_error: "Valor deve ser um número",
  }).positive({ message: "Valor deve ser positivo" }),
  moedaOrigem: z.string({
    required_error: "Selecione a moeda",
  }),
  moedaDestino: z.string({
    required_error: "Selecione a moeda de conversão",
  }),
  taxaConversao: z.number().optional(),
  taxaIOF: z.number().optional(),
  taxaBancaria: z.number().optional(),
  data: z.date().optional(),
});

type PlanejamentoGastoFormValues = z.infer<typeof planejamentoGastoSchema>;

interface PlanejamentoGastosFormProps {
  onSubmit: (data: PlanejamentoGastoViagem) => void;
  isSubmitting: boolean;
  destinos: Destino[];
}

const PlanejamentoGastosForm = ({
  onSubmit,
  isSubmitting,
  destinos,
}: PlanejamentoGastosFormProps) => {
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [valorConvertido, setValorConvertido] = useState<number | null>(null);
  
  const form = useForm<PlanejamentoGastoFormValues>({
    resolver: zodResolver(planejamentoGastoSchema),
    defaultValues: {
      categoria: "",
      descricao: "",
      valor: 0,
      moedaOrigem: "EUR", // Assumindo que a maioria das viagens usam Euro
      moedaDestino: "BRL", // Convertendo para Real
      taxaIOF: 6.38, // IOF padrão para compras no exterior
      taxaBancaria: 4, // Taxa bancária média
      data: new Date(),
    },
  });
  
  const moedaOrigem = form.watch("moedaOrigem");
  const moedaDestino = form.watch("moedaDestino");
  const valor = form.watch("valor");
  const taxaIOF = form.watch("taxaIOF");
  const taxaBancaria = form.watch("taxaBancaria");
  
  // Atualizar o valor convertido quando os valores mudarem
  useEffect(() => {
    if (valor && moedaOrigem && moedaDestino) {
      const cotacaoOrigem = moedaOrigem === "BRL" 
        ? 1 
        : mockCotacoes.find(c => c.codigo === moedaOrigem)?.valor || 0;
      
      const cotacaoDestino = moedaDestino === "BRL" 
        ? 1 
        : mockCotacoes.find(c => c.codigo === moedaDestino)?.valor || 0;
      
      // Primeira conversão para BRL (se necessário)
      let valorEmReais = moedaOrigem === "BRL" ? valor : valor * cotacaoOrigem;
      
      // Adicionar IOF e taxa bancária se estiver convertendo de outra moeda para BRL
      if (moedaOrigem !== "BRL" && moedaDestino === "BRL" && taxaIOF && taxaBancaria) {
        const valorIOF = (valorEmReais * taxaIOF) / 100;
        const valorTaxaBancaria = (valorEmReais * taxaBancaria) / 100;
        valorEmReais = valorEmReais + valorIOF + valorTaxaBancaria;
      }
      
      // Converter de BRL para a moeda de destino (se necessário)
      const valorFinal = moedaDestino === "BRL" 
        ? valorEmReais 
        : valorEmReais / cotacaoDestino;
      
      setValorConvertido(Number(valorFinal.toFixed(2)));
      
      // Atualizar a taxa de conversão no formulário
      form.setValue("taxaConversao", moedaOrigem === moedaDestino 
        ? 1 
        : Number((cotacaoDestino / cotacaoOrigem).toFixed(4)));
    }
  }, [valor, moedaOrigem, moedaDestino, taxaIOF, taxaBancaria, form]);
  
  const handleSubmit = (values: PlanejamentoGastoFormValues) => {
    if (valorConvertido) {
      // Fix: Ensure all required properties are provided and not optional
      const data: PlanejamentoGastoViagem = {
        id: "", // será preenchido pelo backend
        viagemId: "", // será preenchido pelo componente pai
        categoria: values.categoria, // required field, ensure it's provided
        descricao: values.descricao, // required field
        valor: values.valor, // required field
        moedaOrigem: values.moedaOrigem, // required field
        moedaDestino: values.moedaDestino, // required field
        valorConvertido: valorConvertido, // required field
        taxaConversao: values.taxaConversao || 1, // provide default if undefined
        taxaIOF: values.taxaIOF,
        taxaBancaria: values.taxaBancaria,
        data: values.data ? values.data.toISOString().split('T')[0] : undefined // Convert Date to string format
      };
      
      onSubmit(data);
      form.reset();
    }
  };
  
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="categoria"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Categoria</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a categoria" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {categorias.map((categoria) => (
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
                  <Input placeholder="Ex: Hospedagem em hotel" {...field} />
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
                    // Ensure the field value is treated as a number
                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                    value={field.value || ""}
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
                    {mockCotacoes.map((cotacao) => (
                      <SelectItem key={cotacao.codigo} value={cotacao.codigo}>
                        {cotacao.nome} ({cotacao.codigo})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  Moeda em que o gasto será realizado
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="moedaDestino"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Converter para</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a moeda de conversão" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="BRL">Real (BRL)</SelectItem>
                    {mockCotacoes.map((cotacao) => (
                      <SelectItem key={cotacao.codigo} value={cotacao.codigo}>
                        {cotacao.nome} ({cotacao.codigo})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  Moeda para qual deseja converter o valor
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="data"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Data do Gasto</FormLabel>
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
                  Data em que o gasto será realizado
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="text-xl font-medium">Resultado da Conversão</h3>
                <p className="text-muted-foreground text-sm">
                  Taxa de câmbio atual: 1 {moedaOrigem} = {
                    moedaDestino === "BRL" ? 
                      mockCotacoes.find(c => c.codigo === moedaOrigem)?.valor : 
                      (mockCotacoes.find(c => c.codigo === moedaDestino)?.valor || 0) 
                      / (mockCotacoes.find(c => c.codigo === moedaOrigem)?.valor || 1)
                  } {moedaDestino}
                </p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold">
                  {valorConvertido !== null ? 
                    new Intl.NumberFormat('pt-BR', { 
                      style: 'decimal',
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2
                    }).format(valorConvertido) : 
                    "0,00"} {moedaDestino}
                </p>
                {moedaOrigem !== moedaDestino && (
                  <p className="text-sm text-muted-foreground">
                    {valor} {moedaOrigem}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Accordion type="single" collapsible>
          <AccordionItem value="advanced">
            <AccordionTrigger>
              Opções Avançadas de Conversão
            </AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                <FormField
                  control={form.control}
                  name="taxaIOF"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Taxa de IOF (%)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number"
                          step="0.01"
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormDescription>
                        IOF para compras internacionais (6,38% padrão)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="taxaBancaria"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Taxa Bancária (%)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number"
                          step="0.01"
                          {...field}
                          onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormDescription>
                        Taxas adicionais de cartão/banco (4% média)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        
        <div className="flex justify-end space-x-4 pt-4">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Adicionando..." : "Adicionar ao Planejamento"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default PlanejamentoGastosForm;

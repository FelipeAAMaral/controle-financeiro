
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import { Textarea } from "@/components/ui/textarea";
import { Investimento } from "@/types";

const investimentoSchema = z.object({
  id: z.string().optional(),
  nome: z.string().min(3, { message: "Nome deve ter pelo menos 3 caracteres" }),
  tipo: z.enum(["acao", "fundo", "tesouro", "poupanca", "cdb", "lci", "lca", "cripto", "internacional", "outro"], {
    required_error: "Selecione o tipo de investimento",
  }),
  categoria: z.enum(["renda_fixa", "renda_variavel", "cripto", "internacional"], {
    required_error: "Selecione a categoria de investimento",
  }),
  codigo: z.string().optional(),
  valorInicial: z.number().positive({ message: "O valor deve ser positivo" }),
  dataCompra: z.date({
    required_error: "Selecione a data da compra",
  }),
  quantidade: z.number().positive({ message: "A quantidade deve ser positiva" }).optional(),
  precoUnitario: z.number().positive({ message: "O preço unitário deve ser positivo" }).optional(),
  rentabilidade: z.number().min(0).optional(),
  vencimento: z.date().optional(),
  corretora: z.string().optional(),
  moeda: z.enum(["BRL", "USD", "EUR", "GBP", "JPY", "outro"], {
    required_error: "Selecione a moeda",
  }),
  observacoes: z.string().optional(),
});

interface InvestimentoFormProps {
  initialData?: Investimento;
  onSubmit: (data: any) => void;
  onClose: () => void;
  isSubmitting: boolean;
  isEdit?: boolean;
}

const InvestimentoForm = ({
  initialData,
  onSubmit,
  onClose,
  isSubmitting,
  isEdit = false,
}: InvestimentoFormProps) => {
  const [showAdditionalFields, setShowAdditionalFields] = useState(false);
  
  const form = useForm<z.infer<typeof investimentoSchema>>({
    resolver: zodResolver(investimentoSchema),
    defaultValues: initialData ? {
      ...initialData,
      dataCompra: initialData.dataCompra ? new Date(initialData.dataCompra) : undefined,
      vencimento: initialData.vencimento ? new Date(initialData.vencimento) : undefined,
      valorInicial: initialData.valorInicial,
      quantidade: initialData.quantidade,
      precoUnitario: initialData.precoUnitario,
      rentabilidade: initialData.rentabilidade,
    } : {
      nome: "",
      tipo: "acao" as const,
      categoria: "renda_variavel" as const,
      valorInicial: 0,
      moeda: "BRL" as const,
    }
  });
  
  // Atualizar campos adicionais com base no tipo selecionado
  const watchTipo = form.watch("tipo");
  const watchCategoria = form.watch("categoria");
  
  useEffect(() => {
    if (watchTipo === "acao" || watchTipo === "fundo" || watchTipo === "cripto" || watchTipo === "internacional") {
      setShowAdditionalFields(true);
    } else {
      setShowAdditionalFields(false);
    }
    
    // Atualizar categoria automaticamente com base no tipo
    if (watchTipo === "acao" || watchTipo === "fundo") {
      form.setValue("categoria", "renda_variavel");
    } else if (watchTipo === "tesouro" || watchTipo === "poupanca" || watchTipo === "cdb" || watchTipo === "lci" || watchTipo === "lca") {
      form.setValue("categoria", "renda_fixa");
    } else if (watchTipo === "cripto") {
      form.setValue("categoria", "cripto");
    } else if (watchTipo === "internacional") {
      form.setValue("categoria", "internacional");
    }
  }, [watchTipo, form]);
  
  // Atualizar moeda com base na categoria
  useEffect(() => {
    if (watchCategoria === "internacional") {
      form.setValue("moeda", "USD");
    } else if (watchCategoria === "cripto") {
      form.setValue("moeda", "USD");
    } else {
      form.setValue("moeda", "BRL");
    }
  }, [watchCategoria, form]);
  
  const handleSubmit = (values: z.infer<typeof investimentoSchema>) => {
    onSubmit(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="nome"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome do Investimento</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Tesouro IPCA+ 2026" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="tipo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo de investimento" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="acao">Ação</SelectItem>
                    <SelectItem value="fundo">Fundo de Investimento</SelectItem>
                    <SelectItem value="tesouro">Tesouro Direto</SelectItem>
                    <SelectItem value="poupanca">Poupança</SelectItem>
                    <SelectItem value="cdb">CDB</SelectItem>
                    <SelectItem value="lci">LCI</SelectItem>
                    <SelectItem value="lca">LCA</SelectItem>
                    <SelectItem value="cripto">Criptomoeda</SelectItem>
                    <SelectItem value="internacional">Investimento Internacional</SelectItem>
                    <SelectItem value="outro">Outro</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
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
                    <SelectItem value="renda_fixa">Renda Fixa</SelectItem>
                    <SelectItem value="renda_variavel">Renda Variável</SelectItem>
                    <SelectItem value="cripto">Criptomoedas</SelectItem>
                    <SelectItem value="internacional">Internacional</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          
          {(watchTipo === "acao" || watchTipo === "fundo" || watchTipo === "tesouro" || watchTipo === "cripto" || watchTipo === "internacional") && (
            <FormField
              control={form.control}
              name="codigo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Código/Ticker</FormLabel>
                  <FormControl>
                    <Input placeholder="Ex: PETR4, BTCUSD" {...field} value={field.value || ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          
          <FormField
            control={form.control}
            name="valorInicial"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Valor Inicial</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    placeholder="1000.00" 
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
            name="dataCompra"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Data da Compra</FormLabel>
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
                <FormMessage />
              </FormItem>
            )}
          />
          
          {showAdditionalFields && (
            <>
              <FormField
                control={form.control}
                name="quantidade"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quantidade</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="10" 
                        {...field} 
                        value={field.value || ""}
                        onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="precoUnitario"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Preço Unitário</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="100.00" 
                        {...field} 
                        value={field.value || ""}
                        onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}
          
          {(watchTipo === "tesouro" || watchTipo === "cdb" || watchTipo === "lci" || watchTipo === "lca") && (
            <>
              <FormField
                control={form.control}
                name="rentabilidade"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rentabilidade (% a.a.)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="0.01"
                        placeholder="5.75" 
                        {...field} 
                        value={field.value || ""}
                        onChange={(e) => field.onChange(e.target.value ? parseFloat(e.target.value) : undefined)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="vencimento"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Data de Vencimento</FormLabel>
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
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}
          
          <FormField
            control={form.control}
            name="corretora"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Corretora/Banco</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: XP Investimentos" {...field} value={field.value || ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="moeda"
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
                    <SelectItem value="USD">Dólar (USD)</SelectItem>
                    <SelectItem value="EUR">Euro (EUR)</SelectItem>
                    <SelectItem value="GBP">Libra (GBP)</SelectItem>
                    <SelectItem value="JPY">Iene (JPY)</SelectItem>
                    <SelectItem value="outro">Outra</SelectItem>
                  </SelectContent>
                </Select>
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
                  placeholder="Observações adicionais sobre o investimento"
                  className="resize-none"
                  {...field}
                  value={field.value || ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end space-x-4 pt-4">
          <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Salvando..." : isEdit ? "Atualizar Investimento" : "Adicionar Investimento"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default InvestimentoForm;

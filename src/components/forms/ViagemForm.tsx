import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
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
import { CalendarIcon, MapPin, Plus, Trash2, TrendingUp } from "lucide-react";
import { format } from "date-fns";
import { pt } from "date-fns/locale";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Viagem, Destino, Objetivo } from "@/types";
import CurrencyConverter from "@/components/CurrencyConverter";

// Mock de objetivos para seleção
const mockObjetivos: Objetivo[] = [
  {
    id: "1",
    title: "Comprar um carro",
    currentAmount: 10000,
    targetAmount: 45000,
    deadline: "2024-12-31",
    icon: "car",
    color: "#4CAF50"
  },
  {
    id: "2",
    title: "Férias em Portugal",
    currentAmount: 8000,
    targetAmount: 15000,
    deadline: "2023-12-01",
    icon: "plane",
    color: "#2196F3"
  },
  {
    id: "3",
    title: "Intercâmbio na Espanha",
    currentAmount: 12000,
    targetAmount: 20000,
    deadline: "2024-02-15",
    icon: "book",
    color: "#9C27B0"
  },
  {
    id: "4",
    title: "Abrir um negócio",
    currentAmount: 15000,
    targetAmount: 100000,
    deadline: "2025-06-30",
    icon: "store",
    color: "#FF9800"
  }
];

// Esquema de validação para o formulário
const viagemSchema = z.object({
  id: z.string().optional(),
  nome: z.string().min(3, { message: "Nome deve ter pelo menos 3 caracteres" }),
  startDate: z.date({
    required_error: "Data de início é obrigatória",
  }),
  endDate: z.date({
    required_error: "Data de término é obrigatória",
  }),
  objetivo: z.string().optional(),
  budget: z.number().nonnegative({ message: "Orçamento deve ser um valor positivo" }),
  destinos: z.array(
    z.object({
      id: z.string().optional(),
      cidade: z.string().min(1, { message: "Cidade é obrigatória" }),
      pais: z.string().min(1, { message: "País é obrigatório" }),
      dataChegada: z.date({
        required_error: "Data de chegada é obrigatória",
      }),
      dataPartida: z.date({
        required_error: "Data de partida é obrigatória",
      }),
      hospedagem: z.string().optional(),
      observacoes: z.string().optional(),
    })
  ).min(1, { message: "Adicione pelo menos um destino" }),
  locomocoes: z.array(
    z.object({
      id: z.string().optional(),
      tipo: z.enum(["aviao", "trem", "onibus", "carro", "barco", "outro"], {
        required_error: "Selecione o tipo de locomoção",
      }),
      origem: z.string(),
      destino: z.string(),
      dataPartida: z.date({
        required_error: "Data de partida é obrigatória",
      }),
      horaPartida: z.string(),
      dataChegada: z.date({
        required_error: "Data de chegada é obrigatória",
      }),
      horaChegada: z.string(),
      companhia: z.string().optional(),
      numeroVoo: z.string().optional(),
      preco: z.number().nonnegative({ message: "Preço deve ser um valor positivo" }),
      observacoes: z.string().optional(),
    })
  ).optional()
});

type ViagemFormValues = z.infer<typeof viagemSchema>;

interface ViagemFormProps {
  initialData?: Viagem;
  onSubmit: (data: any) => void;
  onClose: () => void;
  isSubmitting: boolean;
  isEdit?: boolean;
}

const ViagemForm = ({
  initialData,
  onSubmit,
  onClose,
  isSubmitting,
  isEdit = false,
}: ViagemFormProps) => {
  const [showCurrencyConverter, setShowCurrencyConverter] = useState(false);
  
  const form = useForm<ViagemFormValues>({
    resolver: zodResolver(viagemSchema),
    defaultValues: initialData
      ? {
          ...initialData,
          budget: Number(initialData.budget), // Ensure budget is a number
          startDate: new Date(initialData.startDate),
          endDate: new Date(initialData.endDate),
          destinos: initialData.destinos.map(destino => ({
            ...destino,
            dataChegada: new Date(destino.dataChegada),
            dataPartida: new Date(destino.dataPartida),
          })),
          locomocoes: [],
        }
      : {
          nome: "",
          startDate: new Date(),
          endDate: new Date(new Date().setDate(new Date().getDate() + 7)),
          budget: 0,
          destinos: [
            {
              cidade: "",
              pais: "",
              dataChegada: new Date(),
              dataPartida: new Date(new Date().setDate(new Date().getDate() + 7)),
            },
          ],
          locomocoes: [],
        },
  });

  const { fields: destinosFields, append: appendDestino, remove: removeDestino } = useFieldArray({
    control: form.control,
    name: "destinos",
  });

  const handleSubmit = (values: ViagemFormValues) => {
    // Preparar os dados para enviar
    const data = {
      ...values,
      startDate: format(values.startDate, 'yyyy-MM-dd'),
      endDate: format(values.endDate, 'yyyy-MM-dd'),
      destinos: values.destinos.map(destino => ({
        ...destino,
        dataChegada: format(destino.dataChegada, 'yyyy-MM-dd'),
        dataPartida: format(destino.dataPartida, 'yyyy-MM-dd'),
      })),
      id: initialData?.id || `viagem-${Date.now()}`,
    };
    
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="nome"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome da Viagem</FormLabel>
                <FormControl>
                  <Input placeholder="Ex: Férias na Europa" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="objetivo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Objetivo Relacionado</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Vincular a um objetivo (opcional)" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="nenhum">Nenhum</SelectItem>
                    {mockObjetivos.map((objetivo) => (
                      <SelectItem key={objetivo.id} value={objetivo.id}>
                        {objetivo.title} - {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(objetivo.targetAmount)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  Vincular esta viagem a um objetivo financeiro
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="startDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Data de Início</FormLabel>
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
          
          <FormField
            control={form.control}
            name="endDate"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Data de Término</FormLabel>
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
                      disabled={(date) =>
                        date < new Date(form.getValues("startDate"))
                      }
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="budget"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Orçamento</FormLabel>
                <div className="flex">
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="5000.00" 
                      {...field}
                      // Ensure the field value is treated as a number
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      value={field.value}
                    />
                  </FormControl>
                  <Button 
                    type="button"
                    variant="ghost" 
                    size="icon"
                    className="ml-2"
                    onClick={() => setShowCurrencyConverter(prev => !prev)}
                  >
                    <TrendingUp className="h-4 w-4" />
                  </Button>
                </div>
                <FormDescription>
                  Orçamento total para a viagem em Reais (R$)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        {showCurrencyConverter && (
          <div className="my-6">
            <CurrencyConverter simple />
          </div>
        )}
        
        <div>
          <h3 className="text-lg font-medium mb-4">Destinos</h3>
          
          {destinosFields.map((destinoField, index) => (
            <Card key={destinoField.id} className="mb-6">
              <CardHeader className="flex flex-row items-center justify-between py-3">
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-primary" />
                  <CardTitle className="text-base">
                    Destino {index + 1}
                  </CardTitle>
                </div>
                {index > 0 && (
                  <Button 
                    type="button"
                    variant="ghost" 
                    size="sm"
                    onClick={() => removeDestino(index)}
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    Remover
                  </Button>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name={`destinos.${index}.cidade`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cidade</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: Paris" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name={`destinos.${index}.pais`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>País</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: França" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name={`destinos.${index}.dataChegada`}
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Data de Chegada</FormLabel>
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
                              disabled={(date) =>
                                date < new Date(form.getValues("startDate")) ||
                                date > new Date(form.getValues("endDate"))
                              }
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name={`destinos.${index}.dataPartida`}
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Data de Partida</FormLabel>
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
                              disabled={(date) =>
                                date < new Date(form.getValues(`destinos.${index}.dataChegada`)) ||
                                date > new Date(form.getValues("endDate"))
                              }
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name={`destinos.${index}.hospedagem`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Hospedagem</FormLabel>
                        <FormControl>
                          <Input placeholder="Ex: Hotel Miramar" {...field} value={field.value || ""} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name={`destinos.${index}.observacoes`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Observações</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Detalhes adicionais sobre este destino"
                          className="resize-none"
                          {...field}
                          value={field.value || ""}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          ))}
          
          <Button
            type="button"
            variant="outline"
            onClick={() => 
              appendDestino({
                cidade: "",
                pais: "",
                dataChegada: new Date(),
                dataPartida: new Date(new Date().setDate(new Date().getDate() + 1)),
              })
            }
          >
            <Plus className="h-4 w-4 mr-2" />
            Adicionar Destino
          </Button>
        </div>
        
        <Separator />
        
        <div className="flex justify-end space-x-4 pt-4">
          <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Salvando..." : isEdit ? "Atualizar Viagem" : "Adicionar Viagem"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ViagemForm;

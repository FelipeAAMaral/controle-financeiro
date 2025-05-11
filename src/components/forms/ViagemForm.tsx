
import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

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
import { Separator } from "@/components/ui/separator";
import { Trash2, Plus, Plane, Train, Bus, Car } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Viagem, Objetivo, Locomocao } from "@/types";

// Schema de validação com zod
const destinoSchema = z.object({
  id: z.string().optional(),
  cidade: z.string().min(1, { message: "Cidade é obrigatória" }),
  pais: z.string().min(1, { message: "País é obrigatório" }),
  dataChegada: z.string(),
  dataPartida: z.string(),
  hospedagem: z.string().optional(),
  observacoes: z.string().optional(),
});

const locomocaoSchema = z.object({
  id: z.string().optional(),
  tipo: z.enum(['aviao', 'trem', 'onibus', 'carro', 'barco', 'outro']),
  origemIndex: z.number(),
  destinoIndex: z.number(),
  dataPartida: z.string(),
  horaPartida: z.string(),
  dataChegada: z.string(),
  horaChegada: z.string(),
  companhia: z.string().optional(),
  numeroVoo: z.string().optional(),
  preco: z.string().transform((val) => Number(val)),
  observacoes: z.string().optional(),
});

const viagemSchema = z.object({
  id: z.string().optional(),
  nome: z.string().min(3, { message: "Nome deve ter pelo menos 3 caracteres" }),
  startDate: z.string(),
  endDate: z.string(),
  objetivo: z.string().optional(),
  budget: z.string().transform((val) => Number(val)),
  destinos: z.array(destinoSchema).min(1, { message: "Adicione pelo menos um destino" }),
  locomocoes: z.array(locomocaoSchema).optional(),
});

type ViagemFormValues = z.infer<typeof viagemSchema>;

interface ViagemFormProps {
  onClose: () => void;
  onSubmit: (data: ViagemFormValues) => void;
  initialData?: Viagem;
  isEdit?: boolean;
  isSubmitting?: boolean;
}

// Mock objetivos para seleção
const mockObjetivos: Objetivo[] = [
  {
    id: "1",
    title: "Fundo de emergência",
    currentAmount: 5000,
    targetAmount: 15000,
    deadline: "2023-12-31",
    icon: "🛡️",
    color: "bg-blue-500",
  },
  {
    id: "2",
    title: "Viagem para Europa",
    currentAmount: 3200,
    targetAmount: 12000,
    deadline: "2024-07-31",
    icon: "✈️",
    color: "bg-purple-500",
  },
  {
    id: "3",
    title: "Intercâmbio",
    currentAmount: 5000,
    targetAmount: 20000,
    deadline: "2024-06-30",
    icon: "📚",
    color: "bg-green-500",
  },
];

const tiposLocomocao = [
  { value: 'aviao', label: 'Avião', icon: <Plane className="h-4 w-4" /> },
  { value: 'trem', label: 'Trem', icon: <Train className="h-4 w-4" /> },
  { value: 'onibus', label: 'Ônibus', icon: <Bus className="h-4 w-4" /> },
  { value: 'carro', label: 'Carro', icon: <Car className="h-4 w-4" /> },
  { value: 'barco', label: 'Barco', icon: null },
  { value: 'outro', label: 'Outro', icon: null },
];

export default function ViagemForm({
  onClose,
  onSubmit,
  initialData,
  isEdit = false,
  isSubmitting = false,
}: ViagemFormProps) {
  const form = useForm<ViagemFormValues>({
    resolver: zodResolver(viagemSchema),
    defaultValues: initialData ? {
      ...initialData,
      budget: initialData.budget.toString(),
      locomocoes: []
    } : {
      nome: "",
      startDate: "",
      endDate: "",
      objetivo: undefined,
      budget: "0",
      destinos: [{ cidade: "", pais: "", dataChegada: "", dataPartida: "" }],
      locomocoes: [],
    }
  });

  const { fields: destinoFields, append: appendDestino, remove: removeDestino } = useFieldArray({
    control: form.control,
    name: "destinos"
  });

  const { fields: locomocaoFields, append: appendLocomocao, remove: removeLocomocao } = useFieldArray({
    control: form.control,
    name: "locomocoes"
  });

  const handleFormSubmit = (values: ViagemFormValues) => {
    onSubmit(values);
  };

  const addDestino = () => {
    appendDestino({
      cidade: "",
      pais: "",
      dataChegada: "",
      dataPartida: ""
    });
  };

  const addLocomocao = () => {
    // Adicionar um transporte entre o destino anterior e o próximo
    const destinoCount = destinoFields.length;
    if (destinoCount >= 2) {
      appendLocomocao({
        tipo: "aviao",
        origemIndex: destinoCount - 2,
        destinoIndex: destinoCount - 1,
        dataPartida: "",
        horaPartida: "",
        dataChegada: "",
        horaChegada: "",
        preco: "0"
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Informações Básicas */}
          <div className="md:col-span-2 space-y-4">
            <h3 className="text-lg font-medium">Informações Básicas</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="nome"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome da Viagem</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex: Férias de Verão em Portugal" {...field} />
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
                    <FormLabel>Objetivo Financeiro (opcional)</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um objetivo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="">Nenhum objetivo</SelectItem>
                        {mockObjetivos.map((objetivo) => (
                          <SelectItem key={objetivo.id} value={objetivo.id}>
                            {objetivo.icon} {objetivo.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Vincule esta viagem a um objetivo financeiro existente
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data de Início</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Data de Término</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="budget"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Orçamento Total (R$)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        min="0" 
                        step="0.01" 
                        placeholder="0.00" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          
          {/* Destinos */}
          <div className="md:col-span-2">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Destinos</h3>
              <Button type="button" variant="outline" size="sm" onClick={addDestino}>
                <Plus className="mr-1 h-4 w-4" /> Adicionar Destino
              </Button>
            </div>
            
            <div className="space-y-4 mt-4">
              {destinoFields.map((destino, index) => (
                <Card key={destino.id} className="relative">
                  <CardContent className="pt-6">
                    <div className="absolute top-2 right-2">
                      {index > 0 && (
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => removeDestino(index)}
                          className="h-7 w-7 text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <FormField
                        control={form.control}
                        name={`destinos.${index}.cidade`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Cidade</FormLabel>
                            <FormControl>
                              <Input {...field} />
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
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <FormField
                        control={form.control}
                        name={`destinos.${index}.dataChegada`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Data de Chegada</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name={`destinos.${index}.dataPartida`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Data de Partida</FormLabel>
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="grid grid-cols-1 gap-4">
                      <FormField
                        control={form.control}
                        name={`destinos.${index}.hospedagem`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Hospedagem (opcional)</FormLabel>
                            <FormControl>
                              <Input placeholder="Hotel, Airbnb, etc." {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name={`destinos.${index}.observacoes`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Observações (opcional)</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Notas sobre o destino, pontos turísticos, etc."
                                className="resize-none"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    {/* Adicionar botão para adicionar locomoção se não for o último destino */}
                    {index < destinoFields.length - 1 && (
                      <div className="mt-4 border-t pt-4 flex justify-center">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            appendLocomocao({
                              tipo: "aviao",
                              origemIndex: index,
                              destinoIndex: index + 1,
                              dataPartida: form.getValues(`destinos.${index}.dataPartida`),
                              horaPartida: "10:00",
                              dataChegada: form.getValues(`destinos.${index + 1}.dataChegada`),
                              horaChegada: "12:00",
                              preco: "0"
                            });
                          }}
                        >
                          <Plane className="mr-1 h-4 w-4" /> Adicionar Transporte para o Próximo Destino
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          
          {/* Locomoções */}
          {locomocaoFields.length > 0 && (
            <div className="md:col-span-2">
              <h3 className="text-lg font-medium mb-4">Transportes entre Destinos</h3>
              
              <div className="space-y-4">
                {locomocaoFields.map((locomocao, index) => (
                  <Card key={locomocao.id} className="relative">
                    <CardContent className="pt-6">
                      <div className="absolute top-2 right-2">
                        <Button 
                          type="button" 
                          variant="ghost" 
                          size="icon" 
                          onClick={() => removeLocomocao(index)}
                          className="h-7 w-7 text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      <div className="bg-muted/50 p-3 rounded-md mb-4">
                        <p className="text-sm font-medium">
                          De: {form.getValues(`destinos.${locomocao.origemIndex}.cidade`)},{" "}
                          {form.getValues(`destinos.${locomocao.origemIndex}.pais`)}
                        </p>
                        <p className="text-sm font-medium">
                          Para: {form.getValues(`destinos.${locomocao.destinoIndex}.cidade`)},{" "}
                          {form.getValues(`destinos.${locomocao.destinoIndex}.pais`)}
                        </p>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <FormField
                          control={form.control}
                          name={`locomocoes.${index}.tipo`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Tipo de Transporte</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Selecione" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {tiposLocomocao.map((tipo) => (
                                    <SelectItem key={tipo.value} value={tipo.value}>
                                      <div className="flex items-center">
                                        {tipo.icon && <span className="mr-2">{tipo.icon}</span>}
                                        {tipo.label}
                                      </div>
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
                          name={`locomocoes.${index}.companhia`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Companhia (opcional)</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="Nome da empresa" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name={`locomocoes.${index}.numeroVoo`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Número do Voo/Reserva</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="Ex: LA1234" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                        <FormField
                          control={form.control}
                          name={`locomocoes.${index}.dataPartida`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Data de Partida</FormLabel>
                              <FormControl>
                                <Input type="date" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name={`locomocoes.${index}.horaPartida`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Hora de Partida</FormLabel>
                              <FormControl>
                                <Input type="time" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name={`locomocoes.${index}.dataChegada`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Data de Chegada</FormLabel>
                              <FormControl>
                                <Input type="date" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name={`locomocoes.${index}.horaChegada`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Hora de Chegada</FormLabel>
                              <FormControl>
                                <Input type="time" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name={`locomocoes.${index}.preco`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Preço (R$)</FormLabel>
                              <FormControl>
                                <Input 
                                  type="number" 
                                  min="0" 
                                  step="0.01" 
                                  placeholder="0.00" 
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name={`locomocoes.${index}.observacoes`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Observações (opcional)</FormLabel>
                              <FormControl>
                                <Input {...field} placeholder="Notas adicionais" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
        
        <Separator />
        
        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Salvando..." : isEdit ? "Atualizar" : "Salvar"}
          </Button>
        </div>
      </form>
    </Form>
  );
}

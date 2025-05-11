
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Icon options for the form
const iconOptions = [
  { value: "🛡️", label: "Escudo (Fundo de Emergência)" },
  { value: "✈️", label: "Avião (Viagem)" },
  { value: "💻", label: "Notebook (Tecnologia)" },
  { value: "🏠", label: "Casa (Imóvel)" },
  { value: "🚗", label: "Carro (Veículo)" },
  { value: "📚", label: "Livros (Educação)" },
  { value: "💍", label: "Anel (Casamento)" },
  { value: "👶", label: "Bebê (Família)" },
  { value: "🏥", label: "Hospital (Saúde)" },
];

// Color options for the form
const colorOptions = [
  { value: "bg-blue-500", label: "Azul" },
  { value: "bg-purple-500", label: "Roxo" },
  { value: "bg-green-500", label: "Verde" },
  { value: "bg-orange-500", label: "Laranja" },
  { value: "bg-red-500", label: "Vermelho" },
  { value: "bg-pink-500", label: "Rosa" },
  { value: "bg-yellow-500", label: "Amarelo" },
  { value: "bg-cyan-500", label: "Ciano" },
];

// Schema de validação com zod
const objetivoSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(3, { message: "Título deve ter pelo menos 3 caracteres" }),
  currentAmount: z.string().refine((val) => !isNaN(Number(val)) && Number(val) >= 0, {
    message: "Valor atual deve ser um número positivo",
  }),
  targetAmount: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Valor alvo deve ser um número positivo",
  }),
  deadline: z.string().min(1, { message: "Data limite é obrigatória" }),
  icon: z.string().min(1, { message: "Selecione um ícone" }),
  color: z.string().min(1, { message: "Selecione uma cor" }),
});

type ObjetivoFormValues = z.infer<typeof objetivoSchema>;

interface ObjetivoFormProps {
  onClose: () => void;
  onSubmit: (data: ObjetivoFormValues) => void;
  initialData?: ObjetivoFormValues;
  isEdit?: boolean;
  isSubmitting?: boolean;
}

export default function ObjetivoForm({
  onClose,
  onSubmit,
  initialData,
  isEdit = false,
  isSubmitting = false,
}: ObjetivoFormProps) {
  const form = useForm<ObjetivoFormValues>({
    resolver: zodResolver(objetivoSchema),
    defaultValues: initialData || {
      title: "",
      currentAmount: "0",
      targetAmount: "",
      deadline: new Date().toISOString().split("T")[0],
      icon: "🛡️",
      color: "bg-blue-500",
    },
  });

  const handleFormSubmit = (values: ObjetivoFormValues) => {
    onSubmit(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="currentAmount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Valor Atual</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="number"
                  step="0.01"
                  min="0"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="targetAmount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Valor Alvo</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="number"
                  step="0.01"
                  min="0"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="deadline"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Prazo</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="date"
                  min={new Date().toISOString().split("T")[0]}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="icon"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ícone</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um ícone" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {iconOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.value} {option.label}
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
          name="color"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cor</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma cor" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {colorOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center">
                        <div className={`w-4 h-4 rounded-full ${option.value} mr-2`}></div>
                        {option.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2 pt-4">
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

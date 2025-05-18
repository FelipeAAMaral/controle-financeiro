import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Lista das categorias para o formulário
const categories = [
  "Moradia", "Alimentação", "Transporte", "Saúde", "Educação", 
  "Lazer", "Entretenimento", "Renda", "Benefícios"
];

// Schema de validação com zod
const gastoRecorrenteSchema = z.object({
  id: z.string().optional(),
  description: z.string().min(3, { message: "Descrição deve ter pelo menos 3 caracteres" }),
  amount: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Valor deve ser um número positivo",
  }),
  day: z.string().min(1, { message: "Selecione o dia" }),
  category: z.string().min(1, { message: "Selecione uma categoria" }),
  type: z.string().min(1, { message: "Selecione o tipo" }),
  benefitType: z.string().optional(),
});

type GastoRecorrenteFormValues = z.infer<typeof gastoRecorrenteSchema>;

interface GastoRecorrenteFormProps {
  onClose: () => void;
  onSubmit: (data: GastoRecorrenteFormValues) => void;
  initialData?: GastoRecorrenteFormValues;
  isEdit?: boolean;
  isSubmitting?: boolean;
}

export default function GastoRecorrenteForm({
  onClose,
  onSubmit,
  initialData,
  isEdit = false,
  isSubmitting = false,
}: GastoRecorrenteFormProps) {
  const form = useForm<GastoRecorrenteFormValues>({
    resolver: zodResolver(gastoRecorrenteSchema),
    defaultValues: initialData || {
      description: "",
      amount: "",
      day: "",
      category: "",
      type: "debito",
      benefitType: "",
    },
  });

  const watchType = form.watch("type");

  const dayOptions = Array.from({ length: 31 }, (_, i) => i + 1);

  const handleFormSubmit = (values: GastoRecorrenteFormValues) => {
    onSubmit(values);
    toast.success(
      isEdit
        ? "Gasto recorrente atualizado com sucesso!"
        : "Gasto recorrente cadastrado com sucesso!"
    );
    onClose();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descrição</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Valor</FormLabel>
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
          name="day"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Dia do mês</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o dia" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {dayOptions.map((day) => (
                    <SelectItem key={day} value={day.toString()}>
                      {day}
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
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Categoria</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a categoria" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
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
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione o tipo" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="entrada">Entrada</SelectItem>
                  <SelectItem value="debito">Débito</SelectItem>
                  <SelectItem value="beneficio">Benefício</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        {watchType === "beneficio" && (
          <FormField
            control={form.control}
            name="benefitType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo de Benefício</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o tipo de benefício" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="alimentacao">Alimentação</SelectItem>
                    <SelectItem value="refeicao">Refeição</SelectItem>
                    <SelectItem value="mobilidade">Mobilidade</SelectItem>
                    <SelectItem value="saude">Saúde</SelectItem>
                    <SelectItem value="cultura">Cultura</SelectItem>
                    <SelectItem value="home-office">Home Office</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

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

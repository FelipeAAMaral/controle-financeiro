
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

// Lista das categorias e contas para o formulário
const categories = [
  "Alimentação", "Transporte", "Moradia", "Saúde", "Educação", 
  "Lazer", "Entretenimento", "Salário", "Freelance", "Investimentos"
];

const accounts = ["Nubank", "Itaú", "Bradesco", "Caixa", "Santander", "Caju"];

// Schema de validação com zod
const transacaoSchema = z.object({
  id: z.string().optional(),
  description: z.string().min(3, { message: "Descrição deve ter pelo menos 3 caracteres" }),
  amount: z.string().refine((val) => !isNaN(Number(val)), {
    message: "Valor deve ser um número",
  }),
  date: z.string().min(1, { message: "Data é obrigatória" }),
  type: z.string().min(1, { message: "Selecione o tipo" }),
  category: z.string().min(1, { message: "Selecione uma categoria" }),
  account: z.string().min(1, { message: "Selecione uma conta" }),
  benefitType: z.string().optional(),
});

type TransacaoFormValues = z.infer<typeof transacaoSchema>;

interface TransacaoFormProps {
  onClose: () => void;
  onSubmit: (data: TransacaoFormValues) => void;
  initialData?: TransacaoFormValues;
  isEdit?: boolean;
  isSubmitting?: boolean;
}

export default function TransacaoForm({
  onClose,
  onSubmit,
  initialData,
  isEdit = false,
  isSubmitting = false,
}: TransacaoFormProps) {
  const form = useForm<TransacaoFormValues>({
    resolver: zodResolver(transacaoSchema),
    defaultValues: initialData || {
      description: "",
      amount: "",
      date: new Date().toISOString().split("T")[0],
      type: "saida",
      category: "",
      account: "",
      benefitType: "",
    },
  });

  const watchType = form.watch("type");

  const handleFormSubmit = (values: TransacaoFormValues) => {
    onSubmit(values);
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
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Data</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="date"
                />
              </FormControl>
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
                  <SelectItem value="saida">Saída</SelectItem>
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
          name="account"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Conta</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a conta" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {accounts.map((account) => (
                    <SelectItem key={account} value={account}>
                      {account}
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

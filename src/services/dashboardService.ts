import { supabase } from '@/lib/supabase';
import { Transacao } from '@/types';

export interface FinancialOverview {
  totalEntradas: number;
  totalSaidas: number;
  saldoAtual: number;
  variacaoEntradas: number;
  variacaoSaidas: number;
  gastosPorCategoria: Record<string, number>;
}

export interface FinancialGoal {
  id: string;
  description: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface FinancialTip {
  id: string;
  title: string;
  description: string;
  type: "warning" | "success" | "info";
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  id: string;
  user_id: string;
  type: 'entrada' | 'saida' | 'beneficio';
  amount: number;
  category: string;
  date: string;
  description: string;
  account?: string;
  created_at: string;
  updated_at: string;
}

export class DashboardService {
  async getFinancialOverview(userId: string): Promise<FinancialOverview> {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const lastMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const lastYear = currentMonth === 0 ? currentYear - 1 : currentYear;

    // Get current month transactions
    const { data: currentMonthData, error: currentMonthError } = await supabase
      .from("transactions")
      .select("amount, type, category")
      .eq("user_id", userId)
      .gte("date", new Date(currentYear, currentMonth, 1).toISOString())
      .lt("date", new Date(currentYear, currentMonth + 1, 1).toISOString());

    if (currentMonthError) throw currentMonthError;

    // Get last month transactions
    const { data: lastMonthData, error: lastMonthError } = await supabase
      .from("transactions")
      .select("amount, type")
      .eq("user_id", userId)
      .gte("date", new Date(lastYear, lastMonth, 1).toISOString())
      .lt("date", new Date(lastYear, lastMonth + 1, 1).toISOString());

    if (lastMonthError) throw lastMonthError;

    // Calculate current month totals
    const totalEntradas = currentMonthData
      ?.filter(t => t.type === "entrada")
      .reduce((sum, t) => sum + t.amount, 0) || 0;

    const totalSaidas = currentMonthData
      ?.filter(t => t.type === "saida")
      .reduce((sum, t) => sum + t.amount, 0) || 0;

    // Calculate last month totals
    const lastMonthEntradas = lastMonthData
      ?.filter(t => t.type === "entrada")
      .reduce((sum, t) => sum + t.amount, 0) || 0;

    const lastMonthSaidas = lastMonthData
      ?.filter(t => t.type === "saida")
      .reduce((sum, t) => sum + t.amount, 0) || 0;

    // Calculate variations
    const variacaoEntradas = lastMonthEntradas === 0 ? 0 : ((totalEntradas - lastMonthEntradas) / lastMonthEntradas) * 100;
    const variacaoSaidas = lastMonthSaidas === 0 ? 0 : ((totalSaidas - lastMonthSaidas) / lastMonthSaidas) * 100;

    // Get current balance
    const { data: balanceData, error: balanceError } = await supabase
      .from("transactions")
      .select("amount, type")
      .eq("user_id", userId);

    if (balanceError) throw balanceError;

    const saldoAtual = balanceData?.reduce((sum, t) => {
      return sum + (t.type === "entrada" ? t.amount : -t.amount);
    }, 0) || 0;

    // Calculate expenses by category
    const gastosPorCategoria = currentMonthData
      ?.filter(t => t.type === "saida")
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {} as Record<string, number>) || {};

    return {
      totalEntradas,
      totalSaidas,
      saldoAtual,
      variacaoEntradas,
      variacaoSaidas,
      gastosPorCategoria,
    };
  }

  async getRecentTransactions(userId: string): Promise<Transaction[]> {
    const { data, error } = await supabase
      .from("transactions")
      .select("*")
      .eq("user_id", userId)
      .order("date", { ascending: false })
      .limit(10);

    if (error) throw error;
    return data || [];
  }

  async getMonthlyEvolution(userId: string): Promise<{ month: string; entradas: number; saidas: number }[]> {
    const { data: transactions, error } = await supabase
      .from("transactions")
      .select("amount, type, date")
      .eq("user_id", userId)
      .order("date", { ascending: true });

    if (error) throw error;

    const months = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
    const evolution: { month: string; entradas: number; saidas: number }[] = [];

    // Group transactions by month
    const transactionsByMonth = transactions?.reduce((acc, t) => {
      const date = new Date(t.date);
      const monthKey = `${date.getFullYear()}-${date.getMonth()}`;
      
      if (!acc[monthKey]) {
        acc[monthKey] = {
          entradas: 0,
          saidas: 0,
          month: months[date.getMonth()],
        };
      }

      if (t.type === "entrada") {
        acc[monthKey].entradas += t.amount;
      } else {
        acc[monthKey].saidas += t.amount;
      }

      return acc;
    }, {} as Record<string, { month: string; entradas: number; saidas: number }>) || {};

    // Convert to array and sort by month
    Object.values(transactionsByMonth).forEach(monthData => {
      evolution.push(monthData);
    });

    return evolution;
  }

  async getFinancialGoals(userId: string): Promise<FinancialGoal[]> {
    const { data, error } = await supabase
      .from("goals")
      .select("*")
      .eq("user_id", userId)
      .order("deadline", { ascending: true });

    if (error) throw error;
    return data;
  }

  async getFinancialTips(userId: string): Promise<FinancialTip[]> {
    const { data: transactions, error: transactionsError } = await supabase
      .from("transactions")
      .select("*")
      .eq("user_id", userId)
      .order("date", { ascending: false });

    if (transactionsError) throw transactionsError;

    const transactionsArray = transactions as Transaction[];
    const tips: FinancialTip[] = [];

    // Analisar gastos por categoria
    const gastosPorCategoria = transactionsArray
      .filter(t => t.type === "saida")
      .reduce((acc, t) => {
        acc[t.category] = (acc[t.category] || 0) + t.amount;
        return acc;
      }, {} as Record<string, number>);

    // Verificar gastos excessivos
    const totalGastos = Object.values(gastosPorCategoria).reduce((sum, amount) => sum + amount, 0);
    const mediaGastos = totalGastos / Object.keys(gastosPorCategoria).length;

    Object.entries(gastosPorCategoria).forEach(([category, amount]) => {
      if (amount > mediaGastos * 1.5) {
        tips.push({
          id: `tip-${category}`,
          title: "Gasto Elevado",
          description: `Seus gastos na categoria ${category} estão acima da média. Considere revisar seus gastos nesta área.`,
          type: "warning",
          user_id: userId,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        });
      }
    });

    // Verificar saldo atual
    const saldoAtual = transactionsArray.reduce((sum, t) => {
      return sum + (t.type === "entrada" ? t.amount : -t.amount);
    }, 0);

    if (saldoAtual < 0) {
      tips.push({
        id: "tip-saldo-negativo",
        title: "Saldo Negativo",
        description: "Seu saldo está negativo. Considere reduzir gastos ou aumentar suas entradas.",
        type: "warning",
        user_id: userId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
    }

    // Verificar reserva de emergência
    const rendaMensal = transactionsArray
      .filter(t => t.type === "entrada")
      .reduce((sum, t) => sum + t.amount, 0);

    const reservaEmergencial = rendaMensal * 3; // 3 meses de renda
    const metaReservaEmergencial = rendaMensal * 6; // 6 meses de renda

    if (saldoAtual < metaReservaEmergencial) {
      tips.push({
        id: "tip-reserva",
        title: "Reserva de Emergência",
        description: "Sua reserva de emergência está abaixo do recomendado (6 meses de renda).",
        type: "info",
        user_id: userId,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      });
    }

    return tips;
  }
} 
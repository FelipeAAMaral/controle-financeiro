
import { SupabaseService } from './supabaseService';

export interface Transacao {
  id: string | number;
  description: string;
  amount: number;
  date: string;
  type: 'entrada' | 'saida' | 'beneficio';
  category: string;
  account: string;
  benefitType?: string;
  user_id: string;
}

export class TransacaoService extends SupabaseService<Transacao> {
  constructor() {
    super('transactions');
  }

  // Get transactions for a specific month and year
  async getByMonthYear(userId: string, month: number, year: number): Promise<Transacao[]> {
    const startDate = new Date(year, month, 1).toISOString().split('T')[0];
    const endDate = new Date(year, month + 1, 0).toISOString().split('T')[0];

    const { data, error } = await supabase
      .from(this.tableName)
      .select('*')
      .eq('user_id', userId)
      .gte('date', startDate)
      .lte('date', endDate);

    if (error) {
      console.error('Error fetching transactions by month/year:', error);
      throw error;
    }

    return data as Transacao[];
  }

  // Get total amount by type (entrada, saida, beneficio)
  async getTotalByType(userId: string, type: 'entrada' | 'saida' | 'beneficio'): Promise<number> {
    const { data, error } = await supabase
      .from(this.tableName)
      .select('amount')
      .eq('user_id', userId)
      .eq('type', type);

    if (error) {
      console.error('Error fetching total by type:', error);
      throw error;
    }

    return data.reduce((sum, transaction) => sum + transaction.amount, 0);
  }
}

export const transacaoService = new TransacaoService();

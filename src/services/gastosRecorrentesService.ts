import { supabase } from '@/lib/supabase';

export interface GastoRecorrente {
  id: string;
  description: string;
  amount: number;
  day: number;
  category: string;
  type: 'entrada' | 'debito' | 'beneficio';
  benefitType?: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export class GastosRecorrentesService {
  async getGastosRecorrentes(userId: string): Promise<GastoRecorrente[]> {
    try {
      const { data, error } = await supabase
        .from('recurring_expenses')
        .select('*')
        .eq('user_id', userId)
        .order('day', { ascending: true });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao buscar gastos recorrentes:', error);
      throw error;
    }
  }

  async createGastoRecorrente(gasto: Omit<GastoRecorrente, 'id' | 'created_at' | 'updated_at'>): Promise<GastoRecorrente> {
    try {
      const { data, error } = await supabase
        .from('recurring_expenses')
        .insert([gasto])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao criar gasto recorrente:', error);
      throw error;
    }
  }

  async updateGastoRecorrente(id: string, gasto: Partial<Omit<GastoRecorrente, 'id' | 'created_at' | 'updated_at'>>): Promise<GastoRecorrente> {
    try {
      const { data, error } = await supabase
        .from('recurring_expenses')
        .update(gasto)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao atualizar gasto recorrente:', error);
      throw error;
    }
  }

  async deleteGastoRecorrente(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('recurring_expenses')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Erro ao deletar gasto recorrente:', error);
      throw error;
    }
  }
} 
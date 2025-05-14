import { supabase } from '@/lib/supabase';
import { Transacao } from '@/types';

export class TransacoesService {
  async getTransacoes(userId: string): Promise<Transacao[]> {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('user_id', userId);

    if (error) throw error;

    return data.map(transaction => ({
      id: transaction.id,
      description: transaction.description,
      date: transaction.date,
      amount: transaction.amount,
      type: transaction.type,
      category: transaction.category,
      account: transaction.account,
      benefitType: transaction.benefit_type
    }));
  }

  async getTransacaoById(id: string): Promise<Transacao | null> {
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!data) return null;

    return {
      id: data.id,
      description: data.description,
      date: data.date,
      amount: data.amount,
      type: data.type,
      category: data.category,
      account: data.account,
      benefitType: data.benefit_type
    };
  }

  async createTransacao(transacao: Omit<Transacao, 'id'>): Promise<Transacao> {
    const { data, error } = await supabase
      .from('transactions')
      .insert({
        description: transacao.description,
        date: transacao.date,
        amount: transacao.amount,
        type: transacao.type,
        category: transacao.category,
        account: transacao.account,
        benefit_type: transacao.benefitType,
        user_id: transacao.user_id
      })
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      description: data.description,
      date: data.date,
      amount: data.amount,
      type: data.type,
      category: data.category,
      account: data.account,
      benefitType: data.benefit_type
    };
  }

  async updateTransacao(id: string, transacao: Partial<Transacao>): Promise<Transacao> {
    const { data, error } = await supabase
      .from('transactions')
      .update({
        description: transacao.description,
        date: transacao.date,
        amount: transacao.amount,
        type: transacao.type,
        category: transacao.category,
        account: transacao.account,
        benefit_type: transacao.benefitType
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      description: data.description,
      date: data.date,
      amount: data.amount,
      type: data.type,
      category: data.category,
      account: data.account,
      benefitType: data.benefit_type
    };
  }

  async deleteTransacao(id: string): Promise<void> {
    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
} 
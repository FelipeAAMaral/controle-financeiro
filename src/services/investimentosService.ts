import { supabase } from '@/lib/supabase';
import { Investimento, MarketData } from '@/types';
import { SupabaseService } from './supabaseService';

export class InvestimentosService extends SupabaseService<Investimento> {
  constructor() {
    super('investments');
  }

  async getInvestimentos(userId: string): Promise<Investimento[]> {
    try {
      const { data, error } = await supabase
        .from('investments')
        .select('*')
        .eq('user_id', userId)
        .order('dataCompra', { ascending: false });

      if (error) throw error;
      if (!data) return [];

      return data.map(investment => ({
        id: investment.id,
        user_id: investment.user_id,
        nome: investment.nome,
        tipo: investment.tipo,
        categoria: investment.categoria,
        codigo: investment.codigo,
        valorInicial: investment.valorInicial,
        dataCompra: investment.dataCompra,
        rentabilidade: investment.rentabilidade,
        vencimento: investment.vencimento,
        corretora: investment.corretora,
        moeda: investment.moeda,
        quantidade: investment.quantidade,
        precoUnitario: investment.precoUnitario,
        observacoes: investment.observacoes
      }));
    } catch (error) {
      console.error('Erro ao buscar investimentos:', error);
      throw new Error('Não foi possível carregar os investimentos');
    }
  }

  async getInvestimentosByCategoria(userId: string, categoria: string): Promise<Investimento[]> {
    try {
      const { data, error } = await supabase
        .from('investments')
        .select('*')
        .eq('user_id', userId)
        .eq('categoria', categoria)
        .order('dataCompra', { ascending: false });

      if (error) throw error;
      if (!data) return [];

      return data.map(investment => ({
        id: investment.id,
        user_id: investment.user_id,
        nome: investment.nome,
        tipo: investment.tipo,
        categoria: investment.categoria,
        codigo: investment.codigo,
        valorInicial: investment.valorInicial,
        dataCompra: investment.dataCompra,
        rentabilidade: investment.rentabilidade,
        vencimento: investment.vencimento,
        corretora: investment.corretora,
        moeda: investment.moeda,
        quantidade: investment.quantidade,
        precoUnitario: investment.precoUnitario,
        observacoes: investment.observacoes
      }));
    } catch (error) {
      console.error('Erro ao buscar investimentos por categoria:', error);
      throw new Error('Não foi possível carregar os investimentos desta categoria');
    }
  }

  async getInvestimentoById(id: string): Promise<Investimento | null> {
    try {
      const { data, error } = await supabase
        .from('investments')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      if (!data) return null;

      return {
        id: data.id,
        user_id: data.user_id,
        nome: data.nome,
        tipo: data.tipo,
        categoria: data.categoria,
        codigo: data.codigo,
        valorInicial: data.valorInicial,
        dataCompra: data.dataCompra,
        rentabilidade: data.rentabilidade,
        vencimento: data.vencimento,
        corretora: data.corretora,
        moeda: data.moeda,
        quantidade: data.quantidade,
        precoUnitario: data.precoUnitario,
        observacoes: data.observacoes
      };
    } catch (error) {
      console.error('Erro ao buscar investimento:', error);
      throw new Error('Não foi possível carregar o investimento');
    }
  }

  async getResumoInvestimentos(userId: string): Promise<{
    totalInvestido: number;
    porCategoria: Record<string, number>;
  }> {
    try {
      const { data, error } = await supabase
        .from('investments')
        .select('valorInicial, categoria')
        .eq('user_id', userId);

      if (error) throw error;
      if (!data) return { totalInvestido: 0, porCategoria: {} };

      const totalInvestido = data.reduce((sum, inv) => sum + inv.valorInicial, 0);
      const porCategoria = data.reduce((acc, inv) => {
        acc[inv.categoria] = (acc[inv.categoria] || 0) + inv.valorInicial;
        return acc;
      }, {} as Record<string, number>);

      return {
        totalInvestido,
        porCategoria
      };
    } catch (error) {
      console.error('Erro ao buscar resumo dos investimentos:', error);
      throw new Error('Não foi possível carregar o resumo dos investimentos');
    }
  }

  async getMarketData(): Promise<MarketData[]> {
    try {
      const { data, error } = await supabase
        .from('market_data')
        .select('*')
        .order('last_update', { ascending: false })
        .limit(4);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Erro ao buscar dados de mercado:', error);
      return [];
    }
  }

  async createInvestimento(investimento: Omit<Investimento, 'id'>): Promise<Investimento> {
    try {
      const { data, error } = await supabase
        .from('investments')
        .insert({
          nome: investimento.nome,
          tipo: investimento.tipo,
          categoria: investimento.categoria,
          codigo: investimento.codigo,
          valorInicial: investimento.valorInicial,
          dataCompra: investimento.dataCompra,
          rentabilidade: investimento.rentabilidade,
          vencimento: investimento.vencimento,
          corretora: investimento.corretora,
          moeda: investimento.moeda,
          quantidade: investimento.quantidade,
          precoUnitario: investimento.precoUnitario,
          observacoes: investimento.observacoes,
          user_id: investimento.user_id
        })
        .select()
        .single();

      if (error) throw error;
      if (!data) throw new Error('Erro ao criar investimento');

      return {
        id: data.id,
        user_id: data.user_id,
        nome: data.nome,
        tipo: data.tipo,
        categoria: data.categoria,
        codigo: data.codigo,
        valorInicial: data.valorInicial,
        dataCompra: data.dataCompra,
        rentabilidade: data.rentabilidade,
        vencimento: data.vencimento,
        corretora: data.corretora,
        moeda: data.moeda,
        quantidade: data.quantidade,
        precoUnitario: data.precoUnitario,
        observacoes: data.observacoes
      };
    } catch (error) {
      console.error('Erro ao criar investimento:', error);
      throw new Error('Não foi possível criar o investimento');
    }
  }

  async updateInvestimento(id: string, investimento: Partial<Investimento>): Promise<Investimento> {
    try {
      const { data, error } = await supabase
        .from('investments')
        .update({
          nome: investimento.nome,
          tipo: investimento.tipo,
          categoria: investimento.categoria,
          codigo: investimento.codigo,
          valorInicial: investimento.valorInicial,
          dataCompra: investimento.dataCompra,
          rentabilidade: investimento.rentabilidade,
          vencimento: investimento.vencimento,
          corretora: investimento.corretora,
          moeda: investimento.moeda,
          quantidade: investimento.quantidade,
          precoUnitario: investimento.precoUnitario,
          observacoes: investimento.observacoes
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      if (!data) throw new Error('Erro ao atualizar investimento');

      return {
        id: data.id,
        user_id: data.user_id,
        nome: data.nome,
        tipo: data.tipo,
        categoria: data.categoria,
        codigo: data.codigo,
        valorInicial: data.valorInicial,
        dataCompra: data.dataCompra,
        rentabilidade: data.rentabilidade,
        vencimento: data.vencimento,
        corretora: data.corretora,
        moeda: data.moeda,
        quantidade: data.quantidade,
        precoUnitario: data.precoUnitario,
        observacoes: data.observacoes
      };
    } catch (error) {
      console.error('Erro ao atualizar investimento:', error);
      throw new Error('Não foi possível atualizar o investimento');
    }
  }

  async deleteInvestimento(id: string): Promise<void> {
    try {
      const { error } = await supabase
        .from('investments')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Erro ao deletar investimento:', error);
      throw new Error('Não foi possível deletar o investimento');
    }
  }

  async getCurrencyRates(): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('currency_rates')
        .select('*');

      if (error) {
        console.error('Error fetching currency rates:', error);
        throw error;
      }

      return data;
    } catch (error) {
      console.error('Error in getCurrencyRates:', error);
      throw error;
    }
  }
}

export const investimentosService = new InvestimentosService();

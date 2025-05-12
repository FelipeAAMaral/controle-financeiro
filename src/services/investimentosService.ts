
import { supabase } from '@/lib/supabase';
import { Investimento } from '@/types/investimentos';
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
        .eq('user_id', userId);

      if (error) {
        console.error('Error fetching investments:', error);
        throw error;
      }

      // Transform from DB format to app format
      return data.map(item => {
        const baseInvestimento = {
          id: item.id,
          nome: item.nome,
          tipo: item.tipo,
          categoria: item.categoria,
          codigo: item.codigo || '',
          valorInicial: item.valorInicial,
          dataCompra: item.dataCompra,
          corretora: item.corretora,
          moeda: item.moeda,
          banco: item.banco || undefined,
          observacoes: item.observacoes || undefined,
          thumbnail: item.thumbnail || undefined
        };

        // Add specific fields based on category
        if (item.categoria === 'renda_fixa') {
          return {
            ...baseInvestimento,
            rentabilidade: item.rentabilidade || 0,
            vencimento: item.vencimento || new Date().toISOString(),
          };
        } else {
          return {
            ...baseInvestimento,
            quantidade: item.quantidade || 0,
            precoUnitario: item.precoUnitario || 0,
          };
        }
      });
    } catch (error) {
      console.error('Error in getInvestimentos:', error);
      throw error;
    }
  }

  async getMarketData(): Promise<any[]> {
    try {
      const { data, error } = await supabase
        .from('market_data')
        .select('*');

      if (error) {
        console.error('Error fetching market data:', error);
        throw error;
      }

      return data.map(item => ({
        index: item.index,
        value: item.value,
        change: item.change,
        lastUpdate: item.last_update
      }));
    } catch (error) {
      console.error('Error in getMarketData:', error);
      throw error;
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

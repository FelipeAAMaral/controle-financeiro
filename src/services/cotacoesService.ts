import { supabase } from '@/lib/supabase';
import { CotacaoMoeda } from '@/types';

export class CotacoesService {
  async getCotacoes(): Promise<CotacaoMoeda[]> {
    const { data, error } = await supabase
      .from('currency_rates')
      .select('*');

    if (error) throw error;

    return data.map(rate => ({
      codigo: rate.code,
      nome: rate.name,
      valor: rate.value,
      dataAtualizacao: rate.last_update
    }));
  }

  async getCotacaoByCode(code: string): Promise<CotacaoMoeda | null> {
    const { data, error } = await supabase
      .from('currency_rates')
      .select('*')
      .eq('code', code)
      .single();

    if (error) throw error;
    if (!data) return null;

    return {
      codigo: data.code,
      nome: data.name,
      valor: data.value,
      dataAtualizacao: data.last_update
    };
  }

  async updateCotacao(code: string, value: number): Promise<CotacaoMoeda> {
    const { data, error } = await supabase
      .from('currency_rates')
      .update({
        value,
        last_update: new Date().toISOString()
      })
      .eq('code', code)
      .select()
      .single();

    if (error) throw error;

    return {
      codigo: data.code,
      nome: data.name,
      valor: data.value,
      dataAtualizacao: data.last_update
    };
  }
} 
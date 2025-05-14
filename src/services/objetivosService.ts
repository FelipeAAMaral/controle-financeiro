import { supabase } from '@/lib/supabase';
import { Objetivo } from '@/types';

export class ObjetivosService {
  async getObjetivos(userId: string): Promise<Objetivo[]> {
    const { data, error } = await supabase
      .from('goals')
      .select('*')
      .eq('user_id', userId);

    if (error) throw error;

    return data.map(goal => ({
      id: goal.id,
      title: goal.title,
      currentAmount: goal.current_amount.toString(),
      targetAmount: goal.target_amount.toString(),
      deadline: goal.deadline,
      icon: goal.icon,
      color: goal.color,
      user_id: goal.user_id,
      thumbnail: goal.thumbnail
    }));
  }

  async getObjetivoById(id: string): Promise<Objetivo | null> {
    const { data, error } = await supabase
      .from('goals')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!data) return null;

    return {
      id: data.id,
      title: data.title,
      currentAmount: data.current_amount.toString(),
      targetAmount: data.target_amount.toString(),
      deadline: data.deadline,
      icon: data.icon,
      color: data.color,
      user_id: data.user_id,
      thumbnail: data.thumbnail
    };
  }

  async createObjetivo(objetivo: Omit<Objetivo, 'id'>): Promise<Objetivo> {
    const { data, error } = await supabase
      .from('goals')
      .insert({
        title: objetivo.title,
        current_amount: parseFloat(objetivo.currentAmount),
        target_amount: parseFloat(objetivo.targetAmount),
        deadline: objetivo.deadline,
        icon: objetivo.icon,
        color: objetivo.color,
        user_id: objetivo.user_id,
        thumbnail: objetivo.thumbnail
      })
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      title: data.title,
      currentAmount: data.current_amount.toString(),
      targetAmount: data.target_amount.toString(),
      deadline: data.deadline,
      icon: data.icon,
      color: data.color,
      user_id: data.user_id,
      thumbnail: data.thumbnail
    };
  }

  async updateObjetivo(id: string, objetivo: Partial<Objetivo>): Promise<Objetivo> {
    const { data, error } = await supabase
      .from('goals')
      .update({
        title: objetivo.title,
        current_amount: objetivo.currentAmount ? parseFloat(objetivo.currentAmount) : undefined,
        target_amount: objetivo.targetAmount ? parseFloat(objetivo.targetAmount) : undefined,
        deadline: objetivo.deadline,
        icon: objetivo.icon,
        color: objetivo.color,
        thumbnail: objetivo.thumbnail
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      title: data.title,
      currentAmount: data.current_amount.toString(),
      targetAmount: data.target_amount.toString(),
      deadline: data.deadline,
      icon: data.icon,
      color: data.color,
      user_id: data.user_id,
      thumbnail: data.thumbnail
    };
  }

  async deleteObjetivo(id: string): Promise<void> {
    const { error } = await supabase
      .from('goals')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }
} 
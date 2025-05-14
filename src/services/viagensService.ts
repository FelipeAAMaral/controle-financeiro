import { supabase } from '@/lib/supabase';

export interface Viagem {
  id: string;
  destination: string;
  startDate: string;
  endDate: string;
  budget: number;
  status: 'planned' | 'completed' | 'cancelled';
  user_id: string;
  created_at?: string;
  updated_at?: string;
}

export class ViagensService {
  async getUpcomingTrips(userId: string) {
    try {
      const now = new Date();
      const oneMonthAgo = new Date(now);
      oneMonthAgo.setMonth(now.getMonth() - 1);
      
      const sixMonthsFromNow = new Date(now);
      sixMonthsFromNow.setMonth(now.getMonth() + 6);

      const { data, error } = await supabase
        .from('trips')
        .select('*')
        .eq('user_id', userId)
        .gte('start_date', oneMonthAgo.toISOString())
        .lte('start_date', sixMonthsFromNow.toISOString())
        .order('start_date', { ascending: true });

      if (error) throw error;

      return data.map(trip => ({
        id: trip.id,
        destination: trip.destination,
        startDate: trip.start_date,
        endDate: trip.end_date,
        budget: trip.budget,
        status: trip.status,
        user_id: trip.user_id,
        created_at: trip.created_at,
        updated_at: trip.updated_at
      }));
    } catch (error) {
      console.error('Erro ao buscar viagens:', error);
      throw error;
    }
  }

  async createTrip(trip: Omit<Viagem, 'id' | 'created_at' | 'updated_at'>) {
    try {
      const { data, error } = await supabase
        .from('trips')
        .insert({
          destination: trip.destination,
          start_date: trip.startDate,
          end_date: trip.endDate,
          budget: trip.budget,
          status: trip.status,
          user_id: trip.user_id
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao criar viagem:', error);
      throw error;
    }
  }

  async updateTrip(id: string, trip: Partial<Omit<Viagem, 'id' | 'created_at' | 'updated_at'>>) {
    try {
      const { data, error } = await supabase
        .from('trips')
        .update({
          destination: trip.destination,
          start_date: trip.startDate,
          end_date: trip.endDate,
          budget: trip.budget,
          status: trip.status
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Erro ao atualizar viagem:', error);
      throw error;
    }
  }

  async deleteTrip(id: string) {
    try {
      const { error } = await supabase
        .from('trips')
        .delete()
        .eq('id', id);

      if (error) throw error;
    } catch (error) {
      console.error('Erro ao deletar viagem:', error);
      throw error;
    }
  }
} 
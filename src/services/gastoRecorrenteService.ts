
import { SupabaseService } from './supabaseService';

export interface GastoRecorrente {
  id: string | number;
  description: string;
  amount: number;
  day: number;
  category: string;
  type: string;
  user_id: string;
}

export class GastoRecorrenteService extends SupabaseService<GastoRecorrente> {
  constructor() {
    super('recurring_expenses');
  }
}

export const gastoRecorrenteService = new GastoRecorrenteService();

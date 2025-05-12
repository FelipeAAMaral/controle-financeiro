
import { SupabaseService } from './supabaseService';

export interface Objetivo {
  id: string | number;
  title: string;
  currentAmount: number;
  targetAmount: number;
  deadline: string;
  icon: string;
  color: string;
  user_id: string;
}

export class ObjetivoService extends SupabaseService<Objetivo> {
  constructor() {
    super('goals');
  }
}

export const objetivoService = new ObjetivoService();

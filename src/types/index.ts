
// Tipo para gastos recorrentes
export interface GastoRecorrente {
  id: number;
  description: string;
  amount: number;
  day: number;
  category: string;
  type: string;
  benefitType?: string;
}

// Tipo para transações
export interface Transacao {
  id: string;
  description: string;
  date: string;
  amount: number;
  type: string;
  category: string;
  account: string;
  benefitType?: string;
}

// Tipo para objetivos financeiros
export interface Objetivo {
  id: string;
  title: string;
  currentAmount: number;
  targetAmount: number;
  deadline: string;
  icon: string;
  color: string;
}

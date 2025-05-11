
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

// Tipo para viagens
export interface Viagem {
  id: string;
  nome: string;
  startDate: string;
  endDate: string;
  objetivo?: string; // ID do objetivo relacionado
  destinos: Destino[];
  budget: number;
}

// Tipo para destinos em uma viagem
export interface Destino {
  id: string;
  cidade: string;
  pais: string;
  dataChegada: string;
  dataPartida: string;
  hospedagem?: string;
  observacoes?: string;
}

// Tipo para locomoção entre destinos
export interface Locomocao {
  id: string;
  tipo: 'aviao' | 'trem' | 'onibus' | 'carro' | 'barco' | 'outro';
  origem: string; // ID do destino de origem
  destino: string; // ID do destino de destino
  dataPartida: string;
  horaPartida: string;
  dataChegada: string;
  horaChegada: string;
  companhia?: string;
  numeroVoo?: string;
  preco: number;
  observacoes?: string;
}

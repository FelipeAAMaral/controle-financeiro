// Tipo para gastos recorrentes
export interface GastoRecorrente {
  id: string;
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
  type: 'entrada' | 'saida' | 'beneficio';
  category: string;
  account: string;
  benefitType?: string;
  user_id: string;
}

// Tipo para objetivos financeiros
export interface Objetivo {
  id: string;
  title: string;
  currentAmount: string;
  targetAmount: string;
  deadline: string;
  icon: string;
  color: string;
  user_id: string;
  thumbnail?: string;
}

// Tipo para viagens
export interface Viagem {
  id: string;
  nome: string;
  startDate: string;
  endDate: string;
  objetivo: string;
  destinos: Destino[];
  budget: number;
  user_id: string;
}

// Tipo para destinos em uma viagem
export interface Destino {
  id: string;
  cidade: string;
  pais: string;
  dataChegada: string;
  dataPartida: string;
  hospedagem: string;
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

// Tipo para investimentos
export interface Investimento {
  id: string;
  nome: string;
  tipo: string;
  categoria: string;
  codigo: string;
  valorInicial: number;
  dataCompra: string;
  rentabilidade?: number;
  vencimento?: string;
  corretora: string;
  moeda: string;
  quantidade?: number;
  precoUnitario?: number;
  observacoes?: string;
  user_id: string;
}

// Tipo para cotação de moedas
export interface CotacaoMoeda {
  codigo: string;
  nome: string;
  valor: number;
  dataAtualizacao: string;
}

// Tipo para planejamento de gastos em viagens
export interface PlanejamentoGastoViagem {
  id: string;
  viagemId: string;
  categoria: string;
  descricao: string;
  valor: number;
  moedaOrigem: string;
  moedaDestino: string;
  valorConvertido: number;
  taxaConversao: number;
  taxaIOF: number;
  taxaBancaria: number;
  data: string;
  user_id: string;
}

export interface MarketData {
  index: string;
  value: number;
  change: number;
  lastUpdate: string;
}

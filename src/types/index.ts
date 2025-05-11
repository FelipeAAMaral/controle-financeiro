
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

// Tipo para investimentos
export interface Investimento {
  id: string;
  nome: string;
  tipo: 'acao' | 'fundo' | 'tesouro' | 'poupanca' | 'cdb' | 'lci' | 'lca' | 'cripto' | 'internacional' | 'outro';
  categoria: 'renda_fixa' | 'renda_variavel' | 'cripto' | 'internacional';
  codigo?: string; // Código do ativo (ex: PETR4, BTCUSD)
  valorInicial: number;
  dataCompra: string;
  quantidade?: number;
  precoUnitario?: number;
  rentabilidade?: number; // Em percentual (ex: 10.5 para 10.5%)
  vencimento?: string; // Para investimentos com data de vencimento
  corretora?: string;
  moeda: 'BRL' | 'USD' | 'EUR' | 'GBP' | 'JPY' | 'outro';
  observacoes?: string;
}

// Tipo para cotação de moedas
export interface CotacaoMoeda {
  codigo: string; // Ex: USD, EUR, GBP
  nome: string;
  valor: number; // Valor em relação ao Real (BRL)
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
  taxaIOF?: number;
  taxaBancaria?: number;
  data?: string;
}

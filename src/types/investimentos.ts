
export interface InvestimentoBase {
  id: string;
  nome: string;
  tipo: string;
  categoria: string;
  codigo: string;
  valorInicial: number;
  dataCompra: string;
  corretora: string;
  moeda: string;
  banco?: string;
  observacoes?: string;
  thumbnail?: string;
}

export interface InvestimentoRendaFixa extends InvestimentoBase {
  rentabilidade: number;
  vencimento: string;
}

export interface InvestimentoRendaVariavel extends InvestimentoBase {
  quantidade: number;
  precoUnitario: number;
}

export interface InvestimentoCripto extends InvestimentoBase {
  quantidade: number;
  precoUnitario: number;
}

export type Investimento = InvestimentoRendaFixa | InvestimentoRendaVariavel | InvestimentoCripto;

export interface MarketData {
  index: string;
  value: number;
  change: number;
  lastUpdate: string;
}

// Database interfaces that match the Supabase schema
export interface DbInvestment {
  id: string;
  user_id: string;
  nome: string;
  tipo: string;
  categoria: string;
  codigo: string | null;
  valorInicial: number;
  dataCompra: string;
  quantidade: number | null;
  precoUnitario: number | null;
  rentabilidade: number | null;
  vencimento: string | null;
  corretora: string;
  moeda: string;
  banco: string | null;
  observacoes: string | null;
  thumbnail: string | null;
  created_at: string;
  updated_at: string;
}

export interface DbMarketData {
  id: string;
  index: string;
  value: number;
  change: number;
  last_update: string;
  created_at: string;
  updated_at: string;
}

export interface DbCurrencyRate {
  id: string;
  codigo: string;
  nome: string;
  valor: number;
  data_atualizacao: string;
  created_at: string;
  updated_at: string;
}


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

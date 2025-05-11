
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calculator, RefreshCw } from "lucide-react";
import { CotacaoMoeda } from "@/types";

// Mock de cotações de moedas (em um app real, isso viria de uma API)
const mockCotacoes: CotacaoMoeda[] = [
  { codigo: "USD", nome: "Dólar Americano", valor: 5.50, dataAtualizacao: new Date().toISOString() },
  { codigo: "EUR", nome: "Euro", valor: 6.20, dataAtualizacao: new Date().toISOString() },
  { codigo: "GBP", nome: "Libra Esterlina", valor: 7.30, dataAtualizacao: new Date().toISOString() },
  { codigo: "JPY", nome: "Iene Japonês", valor: 0.049, dataAtualizacao: new Date().toISOString() },
  { codigo: "AUD", nome: "Dólar Australiano", valor: 3.85, dataAtualizacao: new Date().toISOString() },
  { codigo: "CAD", nome: "Dólar Canadense", valor: 4.05, dataAtualizacao: new Date().toISOString() },
  { codigo: "CHF", nome: "Franco Suíço", valor: 6.45, dataAtualizacao: new Date().toISOString() },
  { codigo: "CNY", nome: "Yuan Chinês", valor: 0.84, dataAtualizacao: new Date().toISOString() },
  { codigo: "ARS", nome: "Peso Argentino", valor: 0.063, dataAtualizacao: new Date().toISOString() },
];

interface CurrencyConverterProps {
  simple?: boolean;
}

const CurrencyConverter = ({ simple = false }: CurrencyConverterProps) => {
  const [fromCurrency, setFromCurrency] = useState("BRL");
  const [toCurrency, setToCurrency] = useState("USD");
  const [amount, setAmount] = useState(1);
  const [convertedAmount, setConvertedAmount] = useState(0);
  const [tab, setTab] = useState("simples");
  const [taxaIOF, setTaxaIOF] = useState(6.38); // IOF para cartão de crédito
  const [taxaBancaria, setTaxaBancaria] = useState(4); // Taxa bancária média
  const [isLoading, setIsLoading] = useState(false);
  
  // Função para converter moedas
  const convertCurrency = () => {
    setIsLoading(true);
    
    // Simula uma chamada de API
    setTimeout(() => {
      let resultado = amount;
      
      // Se a moeda de origem não for BRL, primeiro converte para BRL
      if (fromCurrency !== "BRL") {
        const cotacaoOrigem = mockCotacoes.find(c => c.codigo === fromCurrency)?.valor || 1;
        resultado = amount * cotacaoOrigem;
      }
      
      // Se a moeda de destino não for BRL, converte de BRL para a moeda destino
      if (toCurrency !== "BRL") {
        const cotacaoDestino = mockCotacoes.find(c => c.codigo === toCurrency)?.valor || 1;
        resultado = resultado / cotacaoDestino;
      }
      
      // Se estiver na aba avançada, aplica taxas
      if (tab === "avancado") {
        const taxaTotal = 1 - ((taxaIOF + taxaBancaria) / 100);
        resultado = resultado * taxaTotal;
      }
      
      setConvertedAmount(resultado);
      setIsLoading(false);
    }, 300);
  };
  
  // Efeito para converter moedas quando os valores mudam
  useEffect(() => {
    convertCurrency();
  }, [fromCurrency, toCurrency, amount, tab, taxaIOF, taxaBancaria]);
  
  // Formatar valores monetários
  const formatCurrency = (value: number, currency: string) => {
    let currencyCode = currency;
    
    // Se for BRL, usa o formato brasileiro
    if (currency === "BRL") {
      return new Intl.NumberFormat('pt-BR', { 
        style: 'currency', 
        currency: 'BRL' 
      }).format(value);
    }
    
    // Para outras moedas, usa o formato internacional
    return new Intl.NumberFormat('en-US', { 
      style: 'currency', 
      currency: currencyCode 
    }).format(value);
  };
  
  // Função para inverter as moedas
  const handleSwap = () => {
    const temp = fromCurrency;
    setFromCurrency(toCurrency);
    setToCurrency(temp);
  };

  // Se for modo simples, retorna uma versão compacta
  if (simple) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Conversor de Moedas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4">
            <div className="flex gap-2">
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="flex-1"
              />
              <Select value={fromCurrency} onValueChange={setFromCurrency}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Moeda" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BRL">BRL</SelectItem>
                  {mockCotacoes.map(moeda => (
                    <SelectItem key={moeda.codigo} value={moeda.codigo}>{moeda.codigo}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex justify-center">
              <Button variant="ghost" size="icon" onClick={handleSwap}>
                <RefreshCw className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="flex gap-2">
              <Input
                type="text"
                value={formatCurrency(convertedAmount, toCurrency)}
                readOnly
                className="flex-1"
              />
              <Select value={toCurrency} onValueChange={setToCurrency}>
                <SelectTrigger className="w-[120px]">
                  <SelectValue placeholder="Moeda" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BRL">BRL</SelectItem>
                  {mockCotacoes.map(moeda => (
                    <SelectItem key={moeda.codigo} value={moeda.codigo}>{moeda.codigo}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Versão completa para a página de calculadora
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Calculator className="h-5 w-5 mr-2" />
          Conversor de Moedas
        </CardTitle>
        <CardDescription>
          Converta valores entre diferentes moedas com cotações atualizadas
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={tab} onValueChange={setTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="simples">Conversão Simples</TabsTrigger>
            <TabsTrigger value="avancado">Conversão com Taxas</TabsTrigger>
          </TabsList>
          <TabsContent value="simples" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
              <div className="space-y-2">
                <div className="font-medium">De:</div>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="flex-1"
                  />
                  <Select value={fromCurrency} onValueChange={setFromCurrency}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Moeda" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BRL">Real (BRL)</SelectItem>
                      {mockCotacoes.map(moeda => (
                        <SelectItem key={moeda.codigo} value={moeda.codigo}>
                          {moeda.nome} ({moeda.codigo})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="font-medium">Para:</div>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    value={formatCurrency(convertedAmount, toCurrency)}
                    readOnly
                    className="flex-1"
                  />
                  <Select value={toCurrency} onValueChange={setToCurrency}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Moeda" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BRL">Real (BRL)</SelectItem>
                      {mockCotacoes.map(moeda => (
                        <SelectItem key={moeda.codigo} value={moeda.codigo}>
                          {moeda.nome} ({moeda.codigo})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            
            <div className="flex justify-center pt-2">
              <Button variant="outline" onClick={handleSwap} disabled={isLoading}>
                <RefreshCw className="h-4 w-4 mr-2" /> Inverter Moedas
              </Button>
            </div>
            
            <div className="p-4 bg-muted/50 rounded-md mt-4">
              <p className="text-sm text-muted-foreground">
                Taxa de câmbio atual: 1 {fromCurrency} = {" "}
                {fromCurrency === "BRL" 
                  ? (1 / (mockCotacoes.find(m => m.codigo === toCurrency)?.valor || 1)).toFixed(4)
                  : toCurrency === "BRL"
                    ? (mockCotacoes.find(m => m.codigo === fromCurrency)?.valor || 1).toFixed(4)
                    : ((mockCotacoes.find(m => m.codigo === fromCurrency)?.valor || 1) / 
                       (mockCotacoes.find(m => m.codigo === toCurrency)?.valor || 1)).toFixed(4)
                } {toCurrency}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Atualizado em: {new Date().toLocaleString('pt-BR')}
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="avancado" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
              <div className="space-y-2">
                <div className="font-medium">De:</div>
                <div className="flex gap-2">
                  <Input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="flex-1"
                  />
                  <Select value={fromCurrency} onValueChange={setFromCurrency}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Moeda" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BRL">Real (BRL)</SelectItem>
                      {mockCotacoes.map(moeda => (
                        <SelectItem key={moeda.codigo} value={moeda.codigo}>
                          {moeda.nome} ({moeda.codigo})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <div className="font-medium">Para:</div>
                <div className="flex gap-2">
                  <Input
                    type="text"
                    value={formatCurrency(convertedAmount, toCurrency)}
                    readOnly
                    className="flex-1"
                  />
                  <Select value={toCurrency} onValueChange={setToCurrency}>
                    <SelectTrigger className="w-[150px]">
                      <SelectValue placeholder="Moeda" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="BRL">Real (BRL)</SelectItem>
                      {mockCotacoes.map(moeda => (
                        <SelectItem key={moeda.codigo} value={moeda.codigo}>
                          {moeda.nome} ({moeda.codigo})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="font-medium">Taxa IOF (%):</div>
                <Input
                  type="number"
                  value={taxaIOF}
                  onChange={(e) => setTaxaIOF(Number(e.target.value))}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  Taxa de IOF para operações internacionais (cartão: 6,38%, câmbio: 1,1%)
                </p>
              </div>
              
              <div className="space-y-2">
                <div className="font-medium">Taxa Bancária (%):</div>
                <Input
                  type="number"
                  value={taxaBancaria}
                  onChange={(e) => setTaxaBancaria(Number(e.target.value))}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  Taxa cobrada por bancos/operadoras (normalmente entre 2% e 4%)
                </p>
              </div>
            </div>
            
            <div className="flex justify-center pt-2">
              <Button variant="outline" onClick={handleSwap} disabled={isLoading}>
                <RefreshCw className="h-4 w-4 mr-2" /> Inverter Moedas
              </Button>
            </div>
            
            <div className="p-4 bg-muted/50 rounded-md mt-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Resumo da Conversão:</p>
                  <ul className="text-sm mt-2 space-y-1">
                    <li>Valor inicial: {formatCurrency(amount, fromCurrency)}</li>
                    <li>Taxa de câmbio: 1 {fromCurrency} = {" "}
                      {fromCurrency === "BRL" 
                        ? (1 / (mockCotacoes.find(m => m.codigo === toCurrency)?.valor || 1)).toFixed(4)
                        : toCurrency === "BRL"
                          ? (mockCotacoes.find(m => m.codigo === fromCurrency)?.valor || 1).toFixed(4)
                          : ((mockCotacoes.find(m => m.codigo === fromCurrency)?.valor || 1) / 
                             (mockCotacoes.find(m => m.codigo === toCurrency)?.valor || 1)).toFixed(4)
                      } {toCurrency}
                    </li>
                  </ul>
                </div>
                <div>
                  <p className="text-sm font-medium">Custos Aplicados:</p>
                  <ul className="text-sm mt-2 space-y-1">
                    <li>IOF: {taxaIOF.toFixed(2)}%</li>
                    <li>Taxa bancária: {taxaBancaria.toFixed(2)}%</li>
                    <li>Total de taxas: {(taxaIOF + taxaBancaria).toFixed(2)}%</li>
                  </ul>
                </div>
              </div>
              <div className="mt-4 pt-4 border-t">
                <div className="flex justify-between">
                  <span className="font-medium">Valor Final:</span>
                  <span className="font-bold">{formatCurrency(convertedAmount, toCurrency)}</span>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Atualizado em: {new Date().toLocaleString('pt-BR')}
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default CurrencyConverter;

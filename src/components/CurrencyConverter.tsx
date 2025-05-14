import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calculator, RefreshCw } from "lucide-react";
import { CotacaoMoeda } from "@/types";
import { CotacoesService } from "@/services/cotacoesService";
import { toast } from "sonner";

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
  const [cotacoes, setCotacoes] = useState<CotacaoMoeda[]>([]);

  useEffect(() => {
    const loadCotacoes = async () => {
      try {
        const cotacoesService = new CotacoesService();
        const data = await cotacoesService.getCotacoes();
        setCotacoes(data);
      } catch (error) {
        console.error('Erro ao carregar cotações:', error);
        toast.error('Erro ao carregar cotações');
      }
    };

    loadCotacoes();
  }, []);

  // Função para converter moedas
  const convertCurrency = () => {
    setIsLoading(true);
    
    try {
      let resultado = amount;
      
      // Se a moeda de origem não for BRL, primeiro converte para BRL
      if (fromCurrency !== "BRL") {
        const cotacaoOrigem = cotacoes.find(c => c.codigo === fromCurrency)?.valor || 1;
        resultado = amount * cotacaoOrigem;
      }
      
      // Se a moeda de destino não for BRL, converte de BRL para a moeda destino
      if (toCurrency !== "BRL") {
        const cotacaoDestino = cotacoes.find(c => c.codigo === toCurrency)?.valor || 1;
        resultado = resultado / cotacaoDestino;
      }
      
      // Se estiver na aba avançada, aplica taxas
      if (tab === "avancado") {
        const taxaTotal = 1 - ((taxaIOF + taxaBancaria) / 100);
        resultado = resultado * taxaTotal;
      }
      
      setConvertedAmount(resultado);
    } catch (error) {
      console.error('Erro ao converter moeda:', error);
      toast.error('Erro ao converter moeda');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Efeito para converter moedas quando os valores mudam
  useEffect(() => {
    convertCurrency();
  }, [fromCurrency, toCurrency, amount, tab, taxaIOF, taxaBancaria]);

  const formatCurrency = (value: number, currency: string) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: currency
    }).format(value);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Conversor de Moedas</CardTitle>
        <CardDescription>
          Converta valores entre diferentes moedas
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Valor</label>
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                min="0"
                step="0.01"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">De</label>
              <Select value={fromCurrency} onValueChange={setFromCurrency}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a moeda de origem" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BRL">Real (BRL)</SelectItem>
                  {cotacoes.map((cotacao) => (
                    <SelectItem key={cotacao.codigo} value={cotacao.codigo}>
                      {cotacao.nome} ({cotacao.codigo})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Para</label>
              <Select value={toCurrency} onValueChange={setToCurrency}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a moeda de destino" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BRL">Real (BRL)</SelectItem>
                  {cotacoes.map((cotacao) => (
                    <SelectItem key={cotacao.codigo} value={cotacao.codigo}>
                      {cotacao.nome} ({cotacao.codigo})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {!simple && (
            <Tabs value={tab} onValueChange={setTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="simples">Simples</TabsTrigger>
                <TabsTrigger value="avancado">Avançado</TabsTrigger>
              </TabsList>
              <TabsContent value="avancado" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Taxa IOF (%)</label>
                    <Input
                      type="number"
                      value={taxaIOF}
                      onChange={(e) => setTaxaIOF(parseFloat(e.target.value) || 0)}
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Taxa Bancária (%)</label>
                    <Input
                      type="number"
                      value={taxaBancaria}
                      onChange={(e) => setTaxaBancaria(parseFloat(e.target.value) || 0)}
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          )}

          <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
            <div>
              <p className="text-sm text-muted-foreground">Resultado</p>
              <p className="text-2xl font-bold">
                {formatCurrency(convertedAmount, toCurrency)}
              </p>
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={convertCurrency}
              disabled={isLoading}
            >
              <RefreshCw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default CurrencyConverter;

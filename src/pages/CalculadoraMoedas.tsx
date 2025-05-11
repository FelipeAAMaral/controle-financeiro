
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import CurrencyConverter from "@/components/CurrencyConverter";
import { Calculator, DollarSign, History, TrendingUp } from "lucide-react";

const CalculadoraMoedas = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Calculadora de Moedas</h2>
          <p className="text-muted-foreground">
            Converta valores entre diferentes moedas e planeje seus gastos internacionais
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dólar Comercial</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 5,50</div>
            <p className="text-xs text-muted-foreground">
              +0,2% nas últimas 24h
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Euro</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 6,20</div>
            <p className="text-xs text-muted-foreground">
              -0,1% nas últimas 24h
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Libra</CardTitle>
            <History className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">R$ 7,30</div>
            <p className="text-xs text-muted-foreground">
              +0,3% nas últimas 24h
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="md:col-span-2">
          <CurrencyConverter />
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Variação do Dólar</CardTitle>
            <CardDescription>Últimos 30 dias</CardDescription>
          </CardHeader>
          <CardContent className="h-80 flex items-center justify-center">
            <div className="text-center text-muted-foreground">
              <Calculator className="h-10 w-10 mb-2 mx-auto" />
              <p>Gráfico de variação cambial</p>
              <p className="text-sm">(Implementação futura)</p>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Dicas para Economizar</CardTitle>
            <CardDescription>Como obter as melhores taxas de câmbio</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              <li className="flex gap-2">
                <span className="text-primary font-bold">1.</span>
                <span>Compare as taxas de câmbio em diferentes bancos e corretoras antes de fazer uma transação.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary font-bold">2.</span>
                <span>Cartões de crédito internacionais frequentemente oferecem taxas mais competitivas que casas de câmbio.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary font-bold">3.</span>
                <span>Evite trocar moeda em aeroportos e pontos turísticos, onde as taxas geralmente são menos favoráveis.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary font-bold">4.</span>
                <span>Procure cartões sem cobrança de spread cambial para economizar em compras internacionais.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary font-bold">5.</span>
                <span>Fique atento à cotação e, se possível, planeje suas compras quando a moeda estrangeira estiver mais barata.</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CalculadoraMoedas;

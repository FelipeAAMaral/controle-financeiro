
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const tips = [
  {
    id: 1,
    title: "Reduza gastos desnecessários",
    description: "Analisamos seus gastos com streaming e vimos que você assina 3 serviços diferentes. Considere manter apenas os que você mais usa para economizar R$50 por mês.",
    icon: "💸",
    category: "Economia",
  },
  {
    id: 2,
    title: "Invista seu dinheiro",
    description: "Você tem R$2.000 parados na conta. Se investir em um CDB com rendimento de 100% do CDI, pode render aproximadamente R$230 em um ano.",
    icon: "📈",
    category: "Investimento",
  },
  {
    id: 3,
    title: "Crie um fundo de emergência",
    description: "Com base na sua renda mensal, recomendamos que tenha R$13.500 guardados para emergências (3x seu salário mensal).",
    icon: "🛡️",
    category: "Planejamento",
  },
  {
    id: 4,
    title: "Use seus benefícios com sabedoria",
    description: "Você ainda tem R$380 de saldo no vale-refeição. Considere usar para comprar refeições prontas ou ingredientes em mercados que aceitam esse benefício.",
    icon: "🍱",
    category: "Benefícios",
  },
];

const FinancialTips = () => {
  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold tracking-tight">
          Sugestões Inteligentes
        </h2>
        <p className="text-sm text-gray-500">
          Recomendações personalizadas para melhorar sua saúde financeira
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {tips.map((tip) => (
          <Card key={tip.id} className="overflow-hidden border-l-4 border-l-primary animated-card">
            <CardHeader className="pb-2">
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{tip.title}</CardTitle>
                  <CardDescription className="text-xs">{tip.category}</CardDescription>
                </div>
                <span className="text-2xl">{tip.icon}</span>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-700">{tip.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default FinancialTips;

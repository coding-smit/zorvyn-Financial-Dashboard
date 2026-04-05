import { useFinance } from "@/context/FinanceContext";
import { DollarSign, TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

function fmt(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);
}

const cards = [
  { key: "balance" as const, label: "Total Balance", icon: DollarSign, colorClass: "text-primary" },
  { key: "income" as const, label: "Total Income", icon: TrendingUp, colorClass: "text-income" },
  { key: "expenses" as const, label: "Total Expenses", icon: TrendingDown, colorClass: "text-expense" },
];

export function SummaryCards() {
  const { totalBalance, totalIncome, totalExpenses } = useFinance();
  const values = { balance: totalBalance, income: totalIncome, expenses: totalExpenses };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {cards.map((c, i) => (
        <Card key={c.key} className="glass-card animate-fade-in" style={{ animationDelay: `${i * 100}ms` }}>
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-muted-foreground font-medium">{c.label}</span>
              <c.icon className={`h-5 w-5 ${c.colorClass}`} />
            </div>
            <p className={`text-2xl font-bold ${c.colorClass}`}>{fmt(values[c.key])}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

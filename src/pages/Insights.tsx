import { useFinance } from "@/context/FinanceContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { useMemo } from "react";
import { TrendingUp, PiggyBank, AlertTriangle } from "lucide-react";

function fmt(n: number) {
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n);
}

export default function Insights() {
  const { transactions, totalIncome, totalExpenses, totalBalance } = useFinance();

  const highestCategory = useMemo(() => {
    const map = new Map<string, number>();
    transactions.filter(t => t.type === "expense").forEach(t => {
      map.set(t.category, (map.get(t.category) || 0) + t.amount);
    });
    let max = { name: "N/A", amount: 0 };
    map.forEach((v, k) => { if (v > max.amount) max = { name: k, amount: v }; });
    return max;
  }, [transactions]);

  const monthlyData = useMemo(() => {
    const map = new Map<string, { income: number; expense: number }>();
    transactions.forEach(t => {
      const month = t.date.slice(0, 7);
      const entry = map.get(month) || { income: 0, expense: 0 };
      if (t.type === "income") entry.income += t.amount;
      else entry.expense += t.amount;
      map.set(month, entry);
    });
    return Array.from(map.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, data]) => ({
        month,
        Income: Math.round(data.income),
        Expenses: Math.round(data.expense),
      }));
  }, [transactions]);

  const insights = [
    { label: "Highest Spending", value: `${highestCategory.name} (${fmt(highestCategory.amount)})`, icon: AlertTriangle, colorClass: "text-expense" },
    { label: "Total Savings", value: fmt(totalBalance), icon: PiggyBank, colorClass: "text-income" },
    { label: "Savings Rate", value: totalIncome > 0 ? `${((totalBalance / totalIncome) * 100).toFixed(1)}%` : "0%", icon: TrendingUp, colorClass: "text-primary" },
  ];

  return (
    <div className="space-y-6 max-w-6xl">
      <h2 className="text-2xl font-bold">Insights</h2>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {insights.map((item, i) => (
          <Card key={item.label} className="glass-card animate-fade-in" style={{ animationDelay: `${i * 100}ms` }}>
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-muted-foreground font-medium">{item.label}</span>
                <item.icon className={`h-5 w-5 ${item.colorClass}`} />
              </div>
              <p className={`text-xl font-bold ${item.colorClass}`}>{item.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="glass-card animate-fade-in" style={{ animationDelay: "300ms" }}>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">Monthly Income vs Expenses</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            {monthlyData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-muted-foreground text-sm">No data available</div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                  <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                      fontSize: 13,
                    }}
                  />
                  <Legend wrapperStyle={{ fontSize: 12 }} />
                  <Bar dataKey="Income" fill="hsl(var(--income))" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="Expenses" fill="hsl(var(--expense))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

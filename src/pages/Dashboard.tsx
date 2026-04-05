import { SummaryCards } from "@/components/dashboard/SummaryCards";
import { BalanceChart } from "@/components/dashboard/BalanceChart";
import { SpendingPieChart } from "@/components/dashboard/SpendingPieChart";

export default function Dashboard() {
  return (
    <div className="space-y-6 max-w-6xl">
      <h2 className="text-2xl font-bold">Dashboard</h2>
      <SummaryCards />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <BalanceChart />
        <SpendingPieChart />
      </div>
    </div>
  );
}

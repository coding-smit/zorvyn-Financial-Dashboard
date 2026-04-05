import { useState, useMemo } from "react";
import { useFinance } from "@/context/FinanceContext";
import { Transaction, CATEGORIES } from "@/data/mockData";
import { TransactionDialog } from "@/components/transactions/TransactionDialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil, Trash2, ArrowUpDown, Download } from "lucide-react";

type SortKey = "date" | "amount";
type SortDir = "asc" | "desc";

function exportCSV(transactions: Transaction[]) {
  const header = "Date,Description,Amount,Category,Type";
  const rows = transactions.map(t => `${t.date},"${t.description}",${t.amount},${t.category},${t.type}`);
  const blob = new Blob([header + "\n" + rows.join("\n")], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "transactions.csv";
  a.click();
  URL.revokeObjectURL(url);
}

export default function Transactions() {
  const { transactions, role, addTransaction, updateTransaction, deleteTransaction } = useFinance();
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [sortKey, setSortKey] = useState<SortKey>("date");
  const [sortDir, setSortDir] = useState<SortDir>("desc");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Transaction | null>(null);

  const isAdmin = role === "admin";

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir(d => d === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDir("desc"); }
  };

  const filtered = useMemo(() => {
    let list = [...transactions];
    if (search) {
      const s = search.toLowerCase();
      list = list.filter(t => t.description.toLowerCase().includes(s) || t.category.toLowerCase().includes(s));
    }
    if (filterCategory !== "all") list = list.filter(t => t.category === filterCategory);
    if (filterType !== "all") list = list.filter(t => t.type === filterType);
    list.sort((a, b) => {
      const v = sortKey === "date" ? a.date.localeCompare(b.date) : a.amount - b.amount;
      return sortDir === "asc" ? v : -v;
    });
    return list;
  }, [transactions, search, filterCategory, filterType, sortKey, sortDir]);

  const handleSave = (t: Omit<Transaction, "id"> | Transaction) => {
    if ("id" in t) updateTransaction(t as Transaction);
    else addTransaction(t);
  };

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h2 className="text-2xl font-bold">Transactions</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => exportCSV(filtered)}>
            <Download className="h-4 w-4 mr-1" /> Export
          </Button>
          {isAdmin && (
            <Button size="sm" onClick={() => { setEditing(null); setDialogOpen(true); }}>
              <Plus className="h-4 w-4 mr-1" /> Add
            </Button>
          )}
        </div>
      </div>

      <Card className="glass-card">
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row gap-3">
            <Input placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} className="md:w-60" />
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="md:w-44"><SelectValue placeholder="Category" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="md:w-36"><SelectValue placeholder="Type" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="income">Income</SelectItem>
                <SelectItem value="expense">Expense</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {filtered.length === 0 ? (
            <div className="py-12 text-center text-muted-foreground">No transactions found.</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="cursor-pointer select-none" onClick={() => toggleSort("date")}>
                      Date <ArrowUpDown className="inline h-3 w-3 ml-1" />
                    </TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="cursor-pointer select-none" onClick={() => toggleSort("amount")}>
                      Amount <ArrowUpDown className="inline h-3 w-3 ml-1" />
                    </TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Type</TableHead>
                    {isAdmin && <TableHead className="w-20">Actions</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map(t => (
                    <TableRow key={t.id} className="hover:bg-muted/50 transition-colors">
                      <TableCell className="text-sm">{t.date}</TableCell>
                      <TableCell className="font-medium">{t.description}</TableCell>
                      <TableCell className={t.type === "income" ? "text-income font-semibold" : "text-expense font-semibold"}>
                        {t.type === "income" ? "+" : "-"}${t.amount.toFixed(2)}
                      </TableCell>
                      <TableCell><Badge variant="secondary" className="text-xs">{t.category}</Badge></TableCell>
                      <TableCell>
                        <Badge variant={t.type === "income" ? "default" : "destructive"} className="text-xs capitalize">
                          {t.type}
                        </Badge>
                      </TableCell>
                      {isAdmin && (
                        <TableCell>
                          <div className="flex gap-1">
                            <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => { setEditing(t); setDialogOpen(true); }}>
                              <Pencil className="h-3.5 w-3.5" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-expense" onClick={() => deleteTransaction(t.id)}>
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      <TransactionDialog open={dialogOpen} onClose={() => setDialogOpen(false)} onSave={handleSave} transaction={editing} />
    </div>
  );
}

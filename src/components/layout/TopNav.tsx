import { SidebarTrigger } from "@/components/ui/sidebar";
import { useFinance } from "@/context/FinanceContext";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Moon, Sun, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export function TopNav() {
  const { role, setRole } = useFinance();
  const [dark, setDark] = useState(() => document.documentElement.classList.contains("dark"));

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("finance-theme", dark ? "dark" : "light");
  }, [dark]);

  return (
    <>
    <header className="h-14 flex items-center justify-between border-b bg-card px-4 gap-4">
      <div className="flex items-center gap-2">
        <SidebarTrigger />
        <span className="text-sm font-medium text-muted-foreground hidden sm:inline">Finance Dashboard</span>
      </div>
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={() => setDark(!dark)} className="h-8 w-8">
          {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
        <Select value={role} onValueChange={(v) => setRole(v as "viewer" | "admin")}>
          <SelectTrigger className="w-[120px] h-8 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="viewer">Viewer</SelectItem>
          </SelectContent>
        </Select>
        <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center">
          <User className="h-4 w-4 text-primary-foreground" />
        </div>
      </div>
    </header>
    </>
  );
}

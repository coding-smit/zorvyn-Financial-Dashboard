import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { Transaction, defaultTransactions } from "@/data/mockData";

type Role = "viewer" | "admin";

interface FinanceContextType {
  transactions: Transaction[];
  role: Role;
  setRole: (role: Role) => void;
  addTransaction: (t: Omit<Transaction, "id">) => void;
  updateTransaction: (t: Transaction) => void;
  deleteTransaction: (id: string) => void;
  totalIncome: number;
  totalExpenses: number;
  totalBalance: number;
}

const FinanceContext = createContext<FinanceContextType | null>(null);

const STORAGE_KEY = "finance-dashboard-transactions";
const ROLE_KEY = "finance-dashboard-role";

function loadTransactions(): Transaction[] {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return defaultTransactions;
}

export function FinanceProvider({ children }: { children: React.ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>(loadTransactions);
  const [role, setRole] = useState<Role>(() => {
    return (localStorage.getItem(ROLE_KEY) as Role) || "admin";
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem(ROLE_KEY, role);
  }, [role]);

  const totalIncome = transactions.filter(t => t.type === "income").reduce((s, t) => s + t.amount, 0);
  const totalExpenses = transactions.filter(t => t.type === "expense").reduce((s, t) => s + t.amount, 0);
  const totalBalance = totalIncome - totalExpenses;

  const addTransaction = useCallback((t: Omit<Transaction, "id">) => {
    setTransactions(prev => [...prev, { ...t, id: crypto.randomUUID() }]);
  }, []);

  const updateTransaction = useCallback((t: Transaction) => {
    setTransactions(prev => prev.map(x => x.id === t.id ? t : x));
  }, []);

  const deleteTransaction = useCallback((id: string) => {
    setTransactions(prev => prev.filter(x => x.id !== id));
  }, []);

  return (
    <FinanceContext.Provider value={{ transactions, role, setRole, addTransaction, updateTransaction, deleteTransaction, totalIncome, totalExpenses, totalBalance }}>
      {children}
    </FinanceContext.Provider>
  );
}

export function useFinance() {
  const ctx = useContext(FinanceContext);
  if (!ctx) throw new Error("useFinance must be used within FinanceProvider");
  return ctx;
}

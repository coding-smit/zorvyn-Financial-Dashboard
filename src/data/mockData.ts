export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  category: string;
  type: "income" | "expense";
}

export const CATEGORIES = [
  "Salary",
  "Freelance",
  "Food & Dining",
  "Transportation",
  "Shopping",
  "Entertainment",
  "Utilities",
  "Healthcare",
  "Rent",
  "Investment",
  "Travel",
  "Education",
] as const;

export const defaultTransactions: Transaction[] = [
  { id: "1", date: "2024-01-05", description: "Monthly Salary", amount: 5200, category: "Salary", type: "income" },
  { id: "2", date: "2024-01-08", description: "Grocery Shopping", amount: 145.50, category: "Food & Dining", type: "expense" },
  { id: "3", date: "2024-01-10", description: "Electric Bill", amount: 89.00, category: "Utilities", type: "expense" },
  { id: "4", date: "2024-01-12", description: "Freelance Project", amount: 1200, category: "Freelance", type: "income" },
  { id: "5", date: "2024-01-15", description: "Uber Rides", amount: 42.30, category: "Transportation", type: "expense" },
  { id: "6", date: "2024-01-18", description: "Netflix Subscription", amount: 15.99, category: "Entertainment", type: "expense" },
  { id: "7", date: "2024-01-20", description: "New Sneakers", amount: 129.99, category: "Shopping", type: "expense" },
  { id: "8", date: "2024-01-22", description: "Doctor Visit", amount: 75.00, category: "Healthcare", type: "expense" },
  { id: "9", date: "2024-01-25", description: "Rent Payment", amount: 1500, category: "Rent", type: "expense" },
  { id: "10", date: "2024-01-28", description: "Stock Dividends", amount: 340, category: "Investment", type: "income" },
  { id: "11", date: "2024-02-05", description: "Monthly Salary", amount: 5200, category: "Salary", type: "income" },
  { id: "12", date: "2024-02-07", description: "Restaurant Dinner", amount: 68.50, category: "Food & Dining", type: "expense" },
  { id: "13", date: "2024-02-10", description: "Internet Bill", amount: 59.99, category: "Utilities", type: "expense" },
  { id: "14", date: "2024-02-14", description: "Valentine's Gift", amount: 89.00, category: "Shopping", type: "expense" },
  { id: "15", date: "2024-02-18", description: "Freelance Work", amount: 800, category: "Freelance", type: "income" },
  { id: "16", date: "2024-02-20", description: "Gas Station", amount: 55.00, category: "Transportation", type: "expense" },
  { id: "17", date: "2024-02-22", description: "Online Course", amount: 199.00, category: "Education", type: "expense" },
  { id: "18", date: "2024-02-25", description: "Rent Payment", amount: 1500, category: "Rent", type: "expense" },
  { id: "19", date: "2024-03-05", description: "Monthly Salary", amount: 5200, category: "Salary", type: "income" },
  { id: "20", date: "2024-03-08", description: "Grocery Shopping", amount: 178.25, category: "Food & Dining", type: "expense" },
  { id: "21", date: "2024-03-12", description: "Flight Tickets", amount: 450, category: "Travel", type: "expense" },
  { id: "22", date: "2024-03-15", description: "Freelance Design", amount: 1500, category: "Freelance", type: "income" },
  { id: "23", date: "2024-03-18", description: "Spotify Premium", amount: 9.99, category: "Entertainment", type: "expense" },
  { id: "24", date: "2024-03-22", description: "Pharmacy", amount: 34.50, category: "Healthcare", type: "expense" },
  { id: "25", date: "2024-03-25", description: "Rent Payment", amount: 1500, category: "Rent", type: "expense" },
  { id: "26", date: "2024-03-28", description: "Investment Returns", amount: 520, category: "Investment", type: "income" },
];

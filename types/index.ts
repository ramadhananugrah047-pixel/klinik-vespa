// User & Auth Types
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'staff' | 'owner';
  created_at: string;
}

// Product/Inventory Types
export interface Product {
  id: string;
  name: string;
  category: string;
  sku: string;
  stock: number;
  unit_price: number;
  cost_price: number;
  margin: number;
  created_at: string;
}

// Customer Types
export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  balance: number; // Piutang/hutang
  created_at: string;
}

// Transaction Types
export interface Transaction {
  id: string;
  customer_id: string;
  total_amount: number;
  payment_method: 'cash' | 'debit' | 'qris' | 'transfer' | 'credit';
  payment_status: 'paid' | 'pending' | 'partial';
  notes?: string;
  created_at: string;
}

// Transaction Item Types
export interface TransactionItem {
  id: string;
  transaction_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

// Daily Summary Types
export interface DailySummary {
  date: string;
  total_income: number;
  total_expense: number;
  net_balance: number;
}

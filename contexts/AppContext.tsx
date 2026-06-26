'use client';
import { createContext, useContext, useState, ReactNode } from 'react';

// ===== TYPES =====
export type Product = {
  id: string; name: string; category: string;
  stock: number; min: number; buy: number; sell: number; img: string;
};
export type CartItem = { id: string; name: string; price: number; qty: number };
export type Transaction = {
  id: string; time: string; date: string;
  customer: string; customerId: string;
  items: CartItem[]; total: number;
  payMethod: string; cashReceived: number; change: number;
  isPiutang: boolean;
};
export type StockEntry = {
  id: string; date: string; supplier: string; supplierId: string;
  productId: string; productName: string; isNewProduct: boolean;
  qty: number; pricePerUnit: number; ongkir: number; total: number;
  payStatus: 'Lunas' | 'Hutang';
};
export type Customer = {
  id: string; name: string; phone: string; address: string;
  totalBeli: number; piutang: number; lastTrx: string;
};
export type Supplier = {
  id: string; name: string; contact: string; phone: string;
  city: string; totalBeli: number; hutang: number; jatuhTempo: string;
};
export type CashEntry = {
  id: string; date: string; desc: string;
  type: 'Masuk' | 'Keluar'; cat: string; amount: number; ref: string;
};

// ===== INITIAL DATA =====
const initProducts: Product[] = [
  { id: 'VS-001', name: 'Kampas Rem Depan', category: 'Rem', stock: 24, min: 10, buy: 85000, sell: 120000, img: '' },
  { id: 'VS-002', name: 'Oli Agip 4T 1 Liter', category: 'Oli', stock: 3, min: 10, buy: 65000, sell: 90000, img: '' },
  { id: 'VS-003', name: 'Ban Dalam 275-17', category: 'Ban', stock: 18, min: 5, buy: 45000, sell: 65000, img: '' },
  { id: 'VS-004', name: 'Kampas Rem Belakang', category: 'Rem', stock: 30, min: 10, buy: 75000, sell: 110000, img: '' },
  { id: 'VS-005', name: 'Busi NGK CR7HSA', category: 'Elektrikal', stock: 2, min: 10, buy: 35000, sell: 55000, img: '' },
  { id: 'VS-006', name: 'Filter Udara', category: 'Filter', stock: 12, min: 5, buy: 40000, sell: 65000, img: '' },
  { id: 'VS-007', name: 'Rantai Motor 428H', category: 'Transmisi', stock: 8, min: 5, buy: 95000, sell: 145000, img: '' },
  { id: 'VS-008', name: 'Minyak Rem DOT4', category: 'Rem', stock: 15, min: 8, buy: 28000, sell: 45000, img: '' },
  { id: 'VS-009', name: 'Bearing Roda Depan', category: 'Bearing', stock: 0, min: 5, buy: 55000, sell: 85000, img: '' },
];

const initCustomers: Customer[] = [
  { id: 'PLG-001', name: 'Rafi Maulana', phone: '0812-3456-7890', address: 'Jl. Sentani Kota No.12', totalBeli: 3250000, piutang: 350000, lastTrx: '27 Jun 2026' },
  { id: 'PLG-002', name: 'Dian Kusuma', phone: '0813-5678-9012', address: 'Jl. Kemiri No.8, Sentani', totalBeli: 1850000, piutang: 275000, lastTrx: '27 Jun 2026' },
  { id: 'PLG-003', name: 'Hendra Pratama', phone: '0811-2345-6789', address: 'Jl. Abepura, Jayapura', totalBeli: 2100000, piutang: 250000, lastTrx: '26 Jun 2026' },
  { id: 'PLG-004', name: 'Budi Santoso', phone: '0822-1111-2222', address: 'Jl. Raya Depapre', totalBeli: 950000, piutang: 0, lastTrx: '25 Jun 2026' },
  { id: 'PLG-005', name: 'Siti Rahma', phone: '0831-4444-5555', address: 'Jl. Ifar Gunung', totalBeli: 1450000, piutang: 0, lastTrx: '22 Jun 2026' },
];

const initSuppliers: Supplier[] = [
  { id: 'PMS-001', name: 'PT Piaggio Distributor', contact: 'Bpk. Andi', phone: '0800-1234-5678', city: 'Jakarta', totalBeli: 12500000, hutang: 3500000, jatuhTempo: '26 Jul 2026' },
  { id: 'PMS-002', name: 'UD Vespa Jaya', contact: 'Ibu Sari', phone: '0811-9876-5432', city: 'Makassar', totalBeli: 5800000, hutang: 850000, jatuhTempo: '15 Jul 2026' },
  { id: 'PMS-003', name: 'CV Motor Parts', contact: 'Bpk. Rudi', phone: '0813-1111-2222', city: 'Surabaya', totalBeli: 3200000, hutang: 0, jatuhTempo: '-' },
  { id: 'PMS-004', name: 'Toko Sparepart Sentani', contact: 'Bpk. Johan', phone: '0812-5555-6666', city: 'Sentani', totalBeli: 1500000, hutang: 0, jatuhTempo: '-' },
];

const initTransactions: Transaction[] = [
  { id: 'TRX-0241', time: '14:22', date: '27 Jun 2026', customer: 'Rafi Maulana', customerId: 'PLG-001', items: [{ id: 'VS-001', name: 'Kampas Rem Depan', price: 120000, qty: 1 }, { id: 'VS-002', name: 'Oli Agip 4T 1 Liter', price: 90000, qty: 1 }], total: 210000, payMethod: 'Tunai', cashReceived: 250000, change: 40000, isPiutang: false },
  { id: 'TRX-0240', time: '13:45', date: '27 Jun 2026', customer: 'Dian Kusuma', customerId: 'PLG-002', items: [{ id: 'VS-004', name: 'Kampas Rem Belakang', price: 110000, qty: 1 }], total: 110000, payMethod: 'QRIS', cashReceived: 0, change: 0, isPiutang: false },
  { id: 'TRX-0239', time: '12:30', date: '26 Jun 2026', customer: '-', customerId: '', items: [{ id: 'VS-005', name: 'Busi NGK CR7HSA', price: 55000, qty: 1 }, { id: 'VS-008', name: 'Minyak Rem DOT4', price: 45000, qty: 1 }], total: 100000, payMethod: 'Tunai', cashReceived: 100000, change: 0, isPiutang: false },
];

const initStockEntries: StockEntry[] = [
  { id: 'SM-001', date: '27 Jun 2026', supplier: 'PT Piaggio Distributor', supplierId: 'PMS-001', productId: 'VS-001', productName: 'Kampas Rem Depan', isNewProduct: false, qty: 50, pricePerUnit: 85000, ongkir: 0, total: 4250000, payStatus: 'Lunas' },
  { id: 'SM-002', date: '25 Jun 2026', supplier: 'UD Vespa Jaya', supplierId: 'PMS-002', productId: 'VS-002', productName: 'Oli Agip 4T 1 Liter', isNewProduct: false, qty: 24, pricePerUnit: 65000, ongkir: 50000, total: 1610000, payStatus: 'Hutang' },
  { id: 'SM-003', date: '22 Jun 2026', supplier: 'CV Motor Parts', supplierId: 'PMS-003', productId: 'VS-005', productName: 'Busi NGK CR7HSA', isNewProduct: false, qty: 30, pricePerUnit: 35000, ongkir: 25000, total: 1075000, payStatus: 'Lunas' },
];

const initCashFlow: CashEntry[] = [
  { id: 'AK-001', date: '27 Jun 2026', desc: 'Penjualan - Rafi Maulana (TRX-0241)', type: 'Masuk', cat: 'Penjualan', amount: 210000, ref: 'TRX-0241' },
  { id: 'AK-002', date: '27 Jun 2026', desc: 'Penjualan - Dian Kusuma (TRX-0240)', type: 'Masuk', cat: 'Penjualan', amount: 110000, ref: 'TRX-0240' },
  { id: 'AK-003', date: '27 Jun 2026', desc: 'Beli stok - Kampas Rem Depan (SM-001)', type: 'Keluar', cat: 'Pembelian', amount: 4250000, ref: 'SM-001' },
  { id: 'AK-004', date: '26 Jun 2026', desc: 'Penjualan umum (TRX-0239)', type: 'Masuk', cat: 'Penjualan', amount: 100000, ref: 'TRX-0239' },
  { id: 'AK-005', date: '22 Jun 2026', desc: 'Beli stok - Busi NGK (SM-003)', type: 'Keluar', cat: 'Pembelian', amount: 1075000, ref: 'SM-003' },
  { id: 'AK-006', date: '20 Jun 2026', desc: 'Bayar listrik toko', type: 'Keluar', cat: 'Operasional', amount: 250000, ref: '' },
  { id: 'AK-007', date: '15 Jun 2026', desc: 'Gaji karyawan Jun 2026', type: 'Keluar', cat: 'Gaji', amount: 3000000, ref: '' },
];

// ===== CONTEXT =====
type AppCtx = {
  products: Product[];
  categories: string[];
  transactions: Transaction[];
  stockEntries: StockEntry[];
  customers: Customer[];
  suppliers: Supplier[];
  cashFlow: CashEntry[];

  // Product actions
  addProduct: (p: Omit<Product, 'img'> & { img: string }) => void;
  updateProduct: (p: Product) => void;
  deleteProduct: (id: string) => void;
  setCategories: (cats: string[]) => void;

  // Kasir actions
  processSale: (args: {
    cart: CartItem[];
    customer: string;
    customerId: string;
    payMethod: string;
    cashReceived: number;
    isPiutang: boolean;
  }) => Transaction;

  // Stok Masuk actions
  receiveStock: (entry: Omit<StockEntry, 'id'>) => void;

  // Piutang / Hutang actions
  payCustomerDebt: (customerId: string, amount: number) => void;
  paySupplierDebt: (supplierId: string, amount: number) => void;

  // Manual cash entry
  addCashEntry: (e: Omit<CashEntry, 'id'>) => void;

  // Customer / Supplier CRUD
  addCustomer: (c: Omit<Customer, 'id' | 'totalBeli' | 'piutang' | 'lastTrx'>) => void;
  addSupplier: (s: Omit<Supplier, 'id' | 'totalBeli' | 'hutang' | 'jatuhTempo'>) => void;
};

const AppContext = createContext<AppCtx | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>(initProducts);
  const [categories, setCategories] = useState<string[]>(['Rem', 'Oli', 'Ban', 'Elektrikal', 'Filter', 'Transmisi', 'Bearing', 'Body', 'Kelistrikan']);
  const [transactions, setTransactions] = useState<Transaction[]>(initTransactions);
  const [stockEntries, setStockEntries] = useState<StockEntry[]>(initStockEntries);
  const [customers, setCustomers] = useState<Customer[]>(initCustomers);
  const [suppliers, setSuppliers] = useState<Supplier[]>(initSuppliers);
  const [cashFlow, setCashFlow] = useState<CashEntry[]>(initCashFlow);

  const nowDate = () => new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  const nowTime = () => new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

  const addProduct = (p: Product) => setProducts(prev => [p, ...prev]);
  const updateProduct = (p: Product) => setProducts(prev => prev.map(x => x.id === p.id ? p : x));
  const deleteProduct = (id: string) => setProducts(prev => prev.filter(x => x.id !== id));

  const processSale = (args: {
    cart: CartItem[]; customer: string; customerId: string;
    payMethod: string; cashReceived: number; isPiutang: boolean;
  }): Transaction => {
    const { cart, customer, customerId, payMethod, cashReceived, isPiutang } = args;
    const total = cart.reduce((s, c) => s + c.price * c.qty, 0);

    // 1. Kurangi stok
    setProducts(prev => prev.map(p => {
      const item = cart.find(c => c.id === p.id);
      return item ? { ...p, stock: Math.max(0, p.stock - item.qty) } : p;
    }));

    // 2. Buat transaksi
    const txId = `TRX-${String(Date.now()).slice(-4)}`;
    const tx: Transaction = {
      id: txId, time: nowTime(), date: nowDate(),
      customer: customer || '-', customerId,
      items: [...cart], total,
      payMethod, cashReceived,
      change: payMethod === 'Tunai' ? cashReceived - total : 0,
      isPiutang,
    };
    setTransactions(prev => [tx, ...prev]);

    // 3. Arus kas atau piutang
    if (isPiutang && customerId) {
      // Tambah piutang pelanggan
      setCustomers(prev => prev.map(c =>
        c.id === customerId ? { ...c, piutang: c.piutang + total, totalBeli: c.totalBeli + total, lastTrx: nowDate() } : c
      ));
    } else {
      // Catat ke arus kas
      const ck: CashEntry = {
        id: `AK-${txId}`, date: nowDate(),
        desc: `Penjualan - ${customer || 'Umum'} (${txId})`,
        type: 'Masuk', cat: 'Penjualan', amount: total, ref: txId,
      };
      setCashFlow(prev => [ck, ...prev]);

      // Update total beli pelanggan
      if (customerId) {
        setCustomers(prev => prev.map(c =>
          c.id === customerId ? { ...c, totalBeli: c.totalBeli + total, lastTrx: nowDate() } : c
        ));
      }
    }

    return tx;
  };

  const receiveStock = (entry: Omit<StockEntry, 'id'>) => {
    const smId = `SM-${String(Date.now()).slice(-4)}`;

    // 1. Tambah atau update stok produk
    setProducts(prev => {
      const exists = prev.find(p => p.id === entry.productId);
      if (exists) {
        return prev.map(p => p.id === entry.productId ? { ...p, stock: p.stock + entry.qty } : p);
      } else if (entry.isNewProduct) {
        // Produk baru: tambah ke inventori
        const newP: Product = {
          id: entry.productId, name: entry.productName, category: 'Lainnya',
          stock: entry.qty, min: 5, buy: entry.pricePerUnit,
          sell: Math.round(entry.pricePerUnit * 1.35), img: '',
        };
        return [newP, ...prev];
      }
      return prev;
    });

    // 2. Simpan record stok masuk
    const fullEntry: StockEntry = { ...entry, id: smId };
    setStockEntries(prev => [fullEntry, ...prev]);

    // 3. Hutang pemasok atau arus kas
    if (entry.payStatus === 'Hutang' && entry.supplierId) {
      setSuppliers(prev => prev.map(s =>
        s.id === entry.supplierId ? { ...s, hutang: s.hutang + entry.total, totalBeli: s.totalBeli + entry.total, jatuhTempo: '30 hari dari sekarang' } : s
      ));
    } else {
      // Lunas → catat keluar
      const ck: CashEntry = {
        id: `AK-${smId}`, date: nowDate(),
        desc: `Beli stok - ${entry.productName} (${smId})`,
        type: 'Keluar', cat: 'Pembelian', amount: entry.total, ref: smId,
      };
      setCashFlow(prev => [ck, ...prev]);

      // Update total beli supplier
      if (entry.supplierId) {
        setSuppliers(prev => prev.map(s =>
          s.id === entry.supplierId ? { ...s, totalBeli: s.totalBeli + entry.total } : s
        ));
      }
    }
  };

  const payCustomerDebt = (customerId: string, amount: number) => {
    setCustomers(prev => prev.map(c =>
      c.id === customerId ? { ...c, piutang: Math.max(0, c.piutang - amount) } : c
    ));
    const ck: CashEntry = {
      id: `AK-${Date.now()}`, date: nowDate(),
      desc: `Piutang diterima - ${customers.find(c => c.id === customerId)?.name || customerId}`,
      type: 'Masuk', cat: 'Piutang Diterima', amount, ref: customerId,
    };
    setCashFlow(prev => [ck, ...prev]);
  };

  const paySupplierDebt = (supplierId: string, amount: number) => {
    setSuppliers(prev => prev.map(s =>
      s.id === supplierId ? { ...s, hutang: Math.max(0, s.hutang - amount), jatuhTempo: Math.max(0, (s.hutang - amount)) === 0 ? '-' : s.jatuhTempo } : s
    ));
    const ck: CashEntry = {
      id: `AK-${Date.now()}`, date: nowDate(),
      desc: `Bayar hutang - ${suppliers.find(s => s.id === supplierId)?.name || supplierId}`,
      type: 'Keluar', cat: 'Hutang Dibayar', amount, ref: supplierId,
    };
    setCashFlow(prev => [ck, ...prev]);
  };

  const addCashEntry = (e: Omit<CashEntry, 'id'>) => {
    setCashFlow(prev => [{ ...e, id: `AK-${Date.now()}` }, ...prev]);
  };

  const addCustomer = (c: Omit<Customer, 'id' | 'totalBeli' | 'piutang' | 'lastTrx'>) => {
    const id = `PLG-${String(customers.length + 1).padStart(3, '0')}`;
    setCustomers(prev => [...prev, { ...c, id, totalBeli: 0, piutang: 0, lastTrx: '-' }]);
  };

  const addSupplier = (s: Omit<Supplier, 'id' | 'totalBeli' | 'hutang' | 'jatuhTempo'>) => {
    const id = `PMS-${String(suppliers.length + 1).padStart(3, '0')}`;
    setSuppliers(prev => [...prev, { ...s, id, totalBeli: 0, hutang: 0, jatuhTempo: '-' }]);
  };

  return (
    <AppContext.Provider value={{
      products, categories, transactions, stockEntries, customers, suppliers, cashFlow,
      addProduct, updateProduct, deleteProduct, setCategories,
      processSale, receiveStock,
      payCustomerDebt, paySupplierDebt,
      addCashEntry, addCustomer, addSupplier,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be inside AppProvider');
  return ctx;
}

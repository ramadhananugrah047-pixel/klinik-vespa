'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '@/lib/supabase';

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

// ===== CONTEXT TYPE =====
type AppCtx = {
  loading: boolean;
  error: string | null;
  products: Product[];
  categories: string[];
  transactions: Transaction[];
  stockEntries: StockEntry[];
  customers: Customer[];
  suppliers: Supplier[];
  cashFlow: CashEntry[];
  addProduct: (p: Product) => void;
  updateProduct: (p: Product) => void;
  deleteProduct: (id: string) => void;
  setCategories: (cats: string[]) => void;
  processSale: (args: {
    cart: CartItem[]; customer: string; customerId: string;
    payMethod: string; cashReceived: number; isPiutang: boolean;
  }) => Transaction;
  receiveStock: (entry: Omit<StockEntry, 'id'>) => void;
  payCustomerDebt: (customerId: string, amount: number) => void;
  paySupplierDebt: (supplierId: string, amount: number) => void;
  addCashEntry: (e: Omit<CashEntry, 'id'>) => void;
  addCustomer: (c: Omit<Customer, 'id' | 'totalBeli' | 'piutang' | 'lastTrx'>) => void;
  addSupplier: (s: Omit<Supplier, 'id' | 'totalBeli' | 'hutang' | 'jatuhTempo'>) => void;
};

const AppContext = createContext<AppCtx | null>(null);

// ===== MAPPER FUNCTIONS =====
const mapProduct = (p: any): Product => ({
  id: p.id, name: p.name, category: p.category || '',
  stock: p.stock, min: p.min_stock, buy: p.buy_price, sell: p.sell_price, img: p.img_url || '',
});
const mapCustomer = (c: any): Customer => ({
  id: c.id, name: c.name, phone: c.phone || '', address: c.address || '',
  totalBeli: c.total_beli, piutang: c.piutang, lastTrx: c.last_trx || '-',
});
const mapSupplier = (s: any): Supplier => ({
  id: s.id, name: s.name, contact: s.contact || '', phone: s.phone || '',
  city: s.city || '', totalBeli: s.total_beli, hutang: s.hutang, jatuhTempo: s.jatuh_tempo || '-',
});
const mapTransaction = (t: any): Transaction => ({
  id: t.id, time: t.time, date: t.date,
  customer: t.customer_name, customerId: t.customer_id,
  items: (t.transaction_items || []).map((i: any) => ({
    id: i.product_id, name: i.product_name, price: i.price, qty: i.qty,
  })),
  total: t.total, payMethod: t.pay_method,
  cashReceived: t.cash_received, change: t.change_amount, isPiutang: t.is_piutang,
});
const mapStockEntry = (s: any): StockEntry => ({
  id: s.id, date: s.date, supplier: s.supplier, supplierId: s.supplier_id,
  productId: s.product_id, productName: s.product_name,
  isNewProduct: s.is_new_product, qty: s.qty, pricePerUnit: s.price_per_unit,
  ongkir: s.ongkir, total: s.total, payStatus: s.pay_status,
});
const mapCashEntry = (c: any): CashEntry => ({
  id: c.id, date: c.date, desc: c.description,
  type: c.type, cat: c.category, amount: c.amount, ref: c.ref || '',
});

// ===== PROVIDER =====
export function AppProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategoriesState] = useState<string[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [stockEntries, setStockEntries] = useState<StockEntry[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [cashFlow, setCashFlow] = useState<CashEntry[]>([]);

  const nowDate = () => new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  const nowTime = () => new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });

  useEffect(() => { loadAll(); }, []);

  const loadAll = async () => {
    setLoading(true);
    setError(null);
    try {
      const [r1, r2, r3, r4, r5, r6, r7] = await Promise.all([
        supabase.from('products').select('*').order('created_at'),
        supabase.from('categories').select('name').order('name'),
        supabase.from('customers').select('*').order('created_at'),
        supabase.from('suppliers').select('*').order('created_at'),
        supabase.from('transactions').select('*, transaction_items(*)').order('created_at', { ascending: false }),
        supabase.from('stock_entries').select('*').order('created_at', { ascending: false }),
        supabase.from('cash_flow').select('*').order('created_at', { ascending: false }),
      ]);

      const firstErr = [r1, r2, r3, r4, r5, r6, r7].find(r => r.error)?.error;
      if (firstErr) throw firstErr;

      setProducts((r1.data || []).map(mapProduct));
      setCategoriesState((r2.data || []).map((c: any) => c.name));
      setCustomers((r3.data || []).map(mapCustomer));
      setSuppliers((r4.data || []).map(mapSupplier));
      setTransactions((r5.data || []).map(mapTransaction));
      setStockEntries((r6.data || []).map(mapStockEntry));
      setCashFlow((r7.data || []).map(mapCashEntry));
    } catch (err: any) {
      setError(err?.message || 'Gagal terhubung ke database. Pastikan SQL sudah dijalankan di Supabase.');
    }
    setLoading(false);
  };

  // ===== PRODUCT ACTIONS =====
  const addProduct = (p: Product) => {
    setProducts(prev => [p, ...prev]);
    supabase.from('products').insert({
      id: p.id, name: p.name, category: p.category,
      stock: p.stock, min_stock: p.min, buy_price: p.buy, sell_price: p.sell, img_url: p.img,
    }).then(({ error: e }) => e && console.error('addProduct:', e));
  };

  const updateProduct = (p: Product) => {
    setProducts(prev => prev.map(x => x.id === p.id ? p : x));
    supabase.from('products').update({
      name: p.name, category: p.category,
      stock: p.stock, min_stock: p.min, buy_price: p.buy, sell_price: p.sell, img_url: p.img,
    }).eq('id', p.id).then(({ error: e }) => e && console.error('updateProduct:', e));
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(x => x.id !== id));
    supabase.from('products').delete().eq('id', id)
      .then(({ error: e }) => e && console.error('deleteProduct:', e));
  };

  const setCategories = (cats: string[]) => {
    setCategoriesState(cats);
    supabase.from('categories').delete().gte('id', 1).then(() => {
      if (cats.length > 0) {
        supabase.from('categories').insert(cats.map(name => ({ name })))
          .then(({ error: e }) => e && console.error('setCategories:', e));
      }
    });
  };

  // ===== KASIR =====
  const processSale = (args: {
    cart: CartItem[]; customer: string; customerId: string;
    payMethod: string; cashReceived: number; isPiutang: boolean;
  }): Transaction => {
    const { cart, customer, customerId, payMethod, cashReceived, isPiutang } = args;
    const total = cart.reduce((s, c) => s + c.price * c.qty, 0);
    const txId = `TRX-${Date.now().toString().slice(-6)}`;
    const date = nowDate();
    const time = nowTime();

    const tx: Transaction = {
      id: txId, time, date,
      customer: customer || '-', customerId,
      items: [...cart], total,
      payMethod, cashReceived,
      change: payMethod === 'Tunai' ? cashReceived - total : 0,
      isPiutang,
    };

    // Capture current state BEFORE optimistic updates (for Supabase writes)
    const snapProducts = products;
    const snapCustomers = customers;

    // Optimistic: update transactions + product stock
    setTransactions(prev => [tx, ...prev]);
    setProducts(prev => prev.map(p => {
      const item = cart.find(c => c.id === p.id);
      return item ? { ...p, stock: Math.max(0, p.stock - item.qty) } : p;
    }));

    if (isPiutang && customerId) {
      setCustomers(prev => prev.map(c =>
        c.id === customerId
          ? { ...c, piutang: c.piutang + total, totalBeli: c.totalBeli + total, lastTrx: date }
          : c
      ));
    } else {
      setCashFlow(prev => [{
        id: `AK-${txId}`, date,
        desc: `Penjualan - ${customer || 'Umum'} (${txId})`,
        type: 'Masuk', cat: 'Penjualan', amount: total, ref: txId,
      }, ...prev]);
      if (customerId) {
        setCustomers(prev => prev.map(c =>
          c.id === customerId ? { ...c, totalBeli: c.totalBeli + total, lastTrx: date } : c
        ));
      }
    }

    // Background: write to Supabase
    (async () => {
      const { error: txErr } = await supabase.from('transactions').insert({
        id: txId, time, date,
        customer_name: customer || '-', customer_id: customerId,
        total, pay_method: payMethod, cash_received: cashReceived,
        change_amount: payMethod === 'Tunai' ? cashReceived - total : 0,
        is_piutang: isPiutang,
      });
      if (txErr) { console.error('processSale tx:', txErr); return; }

      if (cart.length > 0) {
        await supabase.from('transaction_items').insert(
          cart.map(item => ({
            transaction_id: txId, product_id: item.id,
            product_name: item.name, price: item.price, qty: item.qty,
          }))
        );
      }

      for (const item of cart) {
        const prod = snapProducts.find(p => p.id === item.id);
        if (prod) {
          await supabase.from('products')
            .update({ stock: Math.max(0, prod.stock - item.qty) })
            .eq('id', item.id);
        }
      }

      if (isPiutang && customerId) {
        const cust = snapCustomers.find(c => c.id === customerId);
        if (cust) {
          await supabase.from('customers').update({
            piutang: cust.piutang + total,
            total_beli: cust.totalBeli + total,
            last_trx: date,
          }).eq('id', customerId);
        }
      } else {
        await supabase.from('cash_flow').insert({
          id: `AK-${txId}`, date,
          description: `Penjualan - ${customer || 'Umum'} (${txId})`,
          type: 'Masuk', category: 'Penjualan', amount: total, ref: txId,
        });
        if (customerId) {
          const cust = snapCustomers.find(c => c.id === customerId);
          if (cust) {
            await supabase.from('customers').update({
              total_beli: cust.totalBeli + total, last_trx: date,
            }).eq('id', customerId);
          }
        }
      }
    })();

    return tx;
  };

  // ===== STOK MASUK =====
  const receiveStock = (entry: Omit<StockEntry, 'id'>) => {
    const smId = `SM-${Date.now().toString().slice(-6)}`;
    const fullEntry: StockEntry = { ...entry, id: smId };

    const snapProducts = products;
    const snapSuppliers = suppliers;

    setStockEntries(prev => [fullEntry, ...prev]);
    setProducts(prev => {
      const exists = prev.find(p => p.id === entry.productId);
      if (exists) {
        return prev.map(p => p.id === entry.productId ? { ...p, stock: p.stock + entry.qty } : p);
      } else if (entry.isNewProduct) {
        return [{
          id: entry.productId, name: entry.productName, category: 'Lainnya',
          stock: entry.qty, min: 5, buy: entry.pricePerUnit,
          sell: Math.round(entry.pricePerUnit * 1.35), img: '',
        }, ...prev];
      }
      return prev;
    });

    if (entry.payStatus === 'Hutang' && entry.supplierId) {
      setSuppliers(prev => prev.map(s =>
        s.id === entry.supplierId
          ? { ...s, hutang: s.hutang + entry.total, totalBeli: s.totalBeli + entry.total, jatuhTempo: '30 hari dari sekarang' }
          : s
      ));
    } else {
      setCashFlow(prev => [{
        id: `AK-${smId}`, date: entry.date,
        desc: `Beli stok - ${entry.productName} (${smId})`,
        type: 'Keluar', cat: 'Pembelian', amount: entry.total, ref: smId,
      }, ...prev]);
      if (entry.supplierId) {
        setSuppliers(prev => prev.map(s =>
          s.id === entry.supplierId ? { ...s, totalBeli: s.totalBeli + entry.total } : s
        ));
      }
    }

    (async () => {
      await supabase.from('stock_entries').insert({
        id: smId, date: entry.date, supplier: entry.supplier, supplier_id: entry.supplierId,
        product_id: entry.productId, product_name: entry.productName,
        is_new_product: entry.isNewProduct, qty: entry.qty,
        price_per_unit: entry.pricePerUnit, ongkir: entry.ongkir,
        total: entry.total, pay_status: entry.payStatus,
      });

      const existingProd = snapProducts.find(p => p.id === entry.productId);
      if (existingProd) {
        await supabase.from('products')
          .update({ stock: existingProd.stock + entry.qty })
          .eq('id', entry.productId);
      } else if (entry.isNewProduct) {
        await supabase.from('products').insert({
          id: entry.productId, name: entry.productName, category: 'Lainnya',
          stock: entry.qty, min_stock: 5, buy_price: entry.pricePerUnit,
          sell_price: Math.round(entry.pricePerUnit * 1.35), img_url: '',
        });
      }

      if (entry.payStatus === 'Hutang' && entry.supplierId) {
        const supp = snapSuppliers.find(s => s.id === entry.supplierId);
        if (supp) {
          await supabase.from('suppliers').update({
            hutang: supp.hutang + entry.total,
            total_beli: supp.totalBeli + entry.total,
            jatuh_tempo: '30 hari dari sekarang',
          }).eq('id', entry.supplierId);
        }
      } else {
        await supabase.from('cash_flow').insert({
          id: `AK-${smId}`, date: entry.date,
          description: `Beli stok - ${entry.productName} (${smId})`,
          type: 'Keluar', category: 'Pembelian', amount: entry.total, ref: smId,
        });
        if (entry.supplierId) {
          const supp = snapSuppliers.find(s => s.id === entry.supplierId);
          if (supp) {
            await supabase.from('suppliers').update({
              total_beli: supp.totalBeli + entry.total,
            }).eq('id', entry.supplierId);
          }
        }
      }
    })();
  };

  // ===== PIUTANG =====
  const payCustomerDebt = (customerId: string, amount: number) => {
    const cust = customers.find(c => c.id === customerId);
    const date = nowDate();
    const entryId = `AK-${Date.now()}`;
    const custName = cust?.name || customerId;
    const newPiutang = Math.max(0, (cust?.piutang || 0) - amount);

    setCustomers(prev => prev.map(c =>
      c.id === customerId ? { ...c, piutang: newPiutang } : c
    ));
    setCashFlow(prev => [{
      id: entryId, date,
      desc: `Piutang diterima - ${custName}`,
      type: 'Masuk', cat: 'Piutang Diterima', amount, ref: customerId,
    }, ...prev]);

    (async () => {
      await supabase.from('customers').update({ piutang: newPiutang }).eq('id', customerId);
      await supabase.from('cash_flow').insert({
        id: entryId, date, description: `Piutang diterima - ${custName}`,
        type: 'Masuk', category: 'Piutang Diterima', amount, ref: customerId,
      });
    })();
  };

  // ===== HUTANG =====
  const paySupplierDebt = (supplierId: string, amount: number) => {
    const supp = suppliers.find(s => s.id === supplierId);
    const date = nowDate();
    const entryId = `AK-${Date.now()}`;
    const suppName = supp?.name || supplierId;
    const newHutang = Math.max(0, (supp?.hutang || 0) - amount);

    setSuppliers(prev => prev.map(s =>
      s.id === supplierId
        ? { ...s, hutang: newHutang, jatuhTempo: newHutang === 0 ? '-' : s.jatuhTempo }
        : s
    ));
    setCashFlow(prev => [{
      id: entryId, date,
      desc: `Bayar hutang - ${suppName}`,
      type: 'Keluar', cat: 'Hutang Dibayar', amount, ref: supplierId,
    }, ...prev]);

    (async () => {
      await supabase.from('suppliers').update({
        hutang: newHutang,
        jatuh_tempo: newHutang === 0 ? '-' : (supp?.jatuhTempo || '-'),
      }).eq('id', supplierId);
      await supabase.from('cash_flow').insert({
        id: entryId, date, description: `Bayar hutang - ${suppName}`,
        type: 'Keluar', category: 'Hutang Dibayar', amount, ref: supplierId,
      });
    })();
  };

  // ===== ARUS KAS MANUAL =====
  const addCashEntry = (e: Omit<CashEntry, 'id'>) => {
    const id = `AK-${Date.now()}`;
    setCashFlow(prev => [{ ...e, id }, ...prev]);
    supabase.from('cash_flow').insert({
      id, date: e.date, description: e.desc, type: e.type,
      category: e.cat, amount: e.amount, ref: e.ref || '',
    }).then(({ error: err }) => err && console.error('addCashEntry:', err));
  };

  // ===== PELANGGAN =====
  const addCustomer = (c: Omit<Customer, 'id' | 'totalBeli' | 'piutang' | 'lastTrx'>) => {
    const id = `PLG-${Date.now().toString().slice(-6)}`;
    const newCust: Customer = { ...c, id, totalBeli: 0, piutang: 0, lastTrx: '-' };
    setCustomers(prev => [...prev, newCust]);
    supabase.from('customers').insert({
      id, name: c.name, phone: c.phone, address: c.address,
      total_beli: 0, piutang: 0, last_trx: '-',
    }).then(({ error: e }) => e && console.error('addCustomer:', e));
  };

  // ===== PEMASOK =====
  const addSupplier = (s: Omit<Supplier, 'id' | 'totalBeli' | 'hutang' | 'jatuhTempo'>) => {
    const id = `PMS-${Date.now().toString().slice(-6)}`;
    const newSupp: Supplier = { ...s, id, totalBeli: 0, hutang: 0, jatuhTempo: '-' };
    setSuppliers(prev => [...prev, newSupp]);
    supabase.from('suppliers').insert({
      id, name: s.name, contact: s.contact, phone: s.phone, city: s.city,
      total_beli: 0, hutang: 0, jatuh_tempo: '-',
    }).then(({ error: e }) => e && console.error('addSupplier:', e));
  };

  return (
    <AppContext.Provider value={{
      loading, error,
      products, categories, transactions, stockEntries, customers, suppliers, cashFlow,
      addProduct, updateProduct, deleteProduct, setCategories,
      processSale, receiveStock,
      payCustomerDebt, paySupplierDebt,
      addCashEntry, addCustomer, addSupplier,
    }}>
      {/* Loading overlay */}
      {loading && (
        <div style={{
          position: 'fixed', inset: 0, background: '#0f1117', zIndex: 9999,
          display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '20px',
        }}>
          <div style={{
            width: '52px', height: '52px', borderRadius: '50%',
            border: '5px solid #2a2d3e', borderTopColor: '#f97316',
            animation: 'kspin 0.7s linear infinite',
          }} />
          <div>
            <div style={{ color: '#f0f2f5', fontSize: '18px', fontWeight: 700, textAlign: 'center' }}>Klinik Vespa</div>
            <div style={{ color: '#8b92a5', fontSize: '13px', textAlign: 'center', marginTop: '6px' }}>Memuat data dari database...</div>
          </div>
          <style>{`@keyframes kspin { to { transform: rotate(360deg); } }`}</style>
        </div>
      )}

      {/* Error banner */}
      {!loading && error && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, zIndex: 9998,
          background: '#450a0a', borderBottom: '2px solid #ef4444',
          padding: '14px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        }}>
          <div>
            <div style={{ color: '#ef4444', fontWeight: 700, fontSize: '14px' }}>⚠️ Gagal Terhubung ke Database</div>
            <div style={{ color: '#fca5a5', fontSize: '12px', marginTop: '2px' }}>{error}</div>
          </div>
          <button onClick={loadAll} style={{
            padding: '8px 18px', borderRadius: '8px', background: '#ef4444',
            color: '#fff', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 600,
          }}>Coba Lagi</button>
        </div>
      )}

      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be inside AppProvider');
  return ctx;
}

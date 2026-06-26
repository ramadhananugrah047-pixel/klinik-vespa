'use client';
import { useState } from 'react';

const fmt = (n: number) => 'Rp ' + n.toLocaleString('id-ID');

const catalog = [
  { id: 'VS-001', name: 'Kampas Rem Depan', price: 120000, stock: 24, category: 'Rem' },
  { id: 'VS-002', name: 'Oli Agip 4T 1L', price: 90000, stock: 3, category: 'Oli' },
  { id: 'VS-003', name: 'Ban Dalam 275-17', price: 65000, stock: 18, category: 'Ban' },
  { id: 'VS-004', name: 'Kampas Rem Belakang', price: 110000, stock: 30, category: 'Rem' },
  { id: 'VS-005', name: 'Busi NGK CR7HSA', price: 55000, stock: 2, category: 'Elektrikal' },
  { id: 'VS-006', name: 'Filter Udara', price: 65000, stock: 12, category: 'Filter' },
  { id: 'VS-007', name: 'Rantai 428H', price: 145000, stock: 8, category: 'Transmisi' },
  { id: 'VS-008', name: 'Minyak Rem DOT4', price: 45000, stock: 15, category: 'Rem' },
];

const catIcon: Record<string, string> = { Rem: '🛑', Oli: '🛢️', Ban: '⭕', Elektrikal: '⚡', Filter: '🌀', Transmisi: '⚙️' };

type CartItem = { id: string; name: string; price: number; qty: number };
type PayMethod = 'Tunai' | 'Debit' | 'QRIS' | 'Transfer';

export default function KasirPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [search, setSearch] = useState('');
  const [pay, setPay] = useState<PayMethod>('Tunai');
  const [cash, setCash] = useState('');
  const [paid, setPaid] = useState(false);
  const [customer, setCustomer] = useState('');

  const filtered = catalog.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) || p.id.toLowerCase().includes(search.toLowerCase())
  );

  const addToCart = (p: typeof catalog[0]) => {
    setCart(prev => {
      const existing = prev.find(c => c.id === p.id);
      if (existing) return prev.map(c => c.id === p.id ? { ...c, qty: c.qty + 1 } : c);
      return [...prev, { id: p.id, name: p.name, price: p.price, qty: 1 }];
    });
  };

  const changeQty = (id: string, delta: number) => {
    setCart(prev => prev.map(c => c.id === id ? { ...c, qty: c.qty + delta } : c).filter(c => c.qty > 0));
  };

  const total = cart.reduce((s, c) => s + c.price * c.qty, 0);
  const cashNum = parseInt(cash.replace(/\D/g, '')) || 0;
  const change = cashNum - total;

  const handleReset = () => {
    setCart([]);
    setPaid(false);
    setCash('');
    setCustomer('');
  };

  return (
    <div style={{ display: 'flex', gap: '20px', height: 'calc(100vh - 80px)' }}>
      {/* LEFT: Product grid */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ marginBottom: '16px' }}>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#f0f2f5', margin: 0 }}>Kasir (POS)</h1>
          <p style={{ fontSize: '12px', color: '#8b92a5', marginTop: '4px' }}>Pilih produk untuk ditambahkan ke keranjang</p>
        </div>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari produk atau SKU..."
          style={{ width: '100%', padding: '10px 16px', borderRadius: '8px', border: '1px solid #2a2d3e', background: '#1e2130', color: '#f0f2f5', fontSize: '14px', outline: 'none', marginBottom: '16px' }} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', overflowY: 'auto', flex: 1 }}>
          {filtered.map(p => (
            <button key={p.id} onClick={() => p.stock > 0 && addToCart(p)}
              style={{ padding: '16px', borderRadius: '12px', border: '1px solid #2a2d3e', background: '#1e2130', textAlign: 'left', cursor: p.stock === 0 ? 'not-allowed' : 'pointer', opacity: p.stock === 0 ? 0.5 : 1 }}>
              <div style={{ fontSize: '28px', marginBottom: '8px' }}>{catIcon[p.category] || '🔧'}</div>
              <div style={{ fontSize: '11px', color: '#f97316', fontFamily: 'monospace', marginBottom: '4px' }}>{p.id}</div>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#f0f2f5', marginBottom: '4px' }}>{p.name}</div>
              <div style={{ fontSize: '14px', fontWeight: 700, color: '#22c55e' }}>{fmt(p.price)}</div>
              <div style={{ fontSize: '11px', marginTop: '4px', color: p.stock <= 3 ? '#f59e0b' : '#5a6070' }}>
                Stok: {p.stock === 0 ? 'HABIS' : p.stock}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* RIGHT: Cart + Payment */}
      <div style={{ width: '300px', display: 'flex', flexDirection: 'column', background: '#1e2130', borderRadius: '12px', border: '1px solid #2a2d3e', overflow: 'hidden' }}>
        {paid ? (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px', textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div>
            <div style={{ fontSize: '20px', fontWeight: 700, color: '#22c55e', marginBottom: '8px' }}>Pembayaran Berhasil!</div>
            <div style={{ fontSize: '14px', color: '#8b92a5', marginBottom: '4px' }}>Total: <span style={{ color: '#f0f2f5' }}>{fmt(total)}</span></div>
            {pay === 'Tunai' && <div style={{ fontSize: '14px', color: '#8b92a5', marginBottom: '16px' }}>Kembalian: <span style={{ color: '#f97316', fontWeight: 700 }}>{fmt(Math.max(0, change))}</span></div>}
            <button onClick={handleReset} style={{ width: '100%', padding: '12px', borderRadius: '8px', background: '#f97316', color: '#fff', fontWeight: 700, border: 'none', cursor: 'pointer', fontSize: '14px' }}>
              Transaksi Baru
            </button>
          </div>
        ) : (
          <>
            <div style={{ padding: '16px', borderBottom: '1px solid #2a2d3e' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span style={{ fontWeight: 700, color: '#f0f2f5' }}>Keranjang</span>
                <span style={{ padding: '2px 8px', borderRadius: '9999px', background: '#f97316', color: '#fff', fontSize: '12px' }}>{cart.length} item</span>
              </div>
              <input value={customer} onChange={e => setCustomer(e.target.value)} placeholder="Nama pelanggan (opsional)"
                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #2a2d3e', background: '#0f1117', color: '#f0f2f5', fontSize: '12px', outline: 'none' }} />
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '12px' }}>
              {cart.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '32px 0', fontSize: '13px', color: '#5a6070' }}>Belum ada produk dipilih</div>
              ) : cart.map(item => (
                <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingBottom: '8px', marginBottom: '8px', borderBottom: '1px solid #2a2d3e' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '12px', fontWeight: 600, color: '#f0f2f5' }}>{item.name}</div>
                    <div style={{ fontSize: '11px', color: '#22c55e' }}>{fmt(item.price)}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <button onClick={() => changeQty(item.id, -1)} style={{ width: '24px', height: '24px', borderRadius: '4px', background: '#2a2d3e', color: '#8b92a5', border: 'none', cursor: 'pointer', fontWeight: 700 }}>-</button>
                    <span style={{ width: '24px', textAlign: 'center', fontSize: '13px', fontWeight: 700, color: '#f0f2f5' }}>{item.qty}</span>
                    <button onClick={() => changeQty(item.id, 1)} style={{ width: '24px', height: '24px', borderRadius: '4px', background: '#f97316', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 700 }}>+</button>
                  </div>
                  <div style={{ fontSize: '12px', fontWeight: 700, width: '70px', textAlign: 'right', color: '#f0f2f5' }}>{fmt(item.price * item.qty)}</div>
                </div>
              ))}
            </div>

            <div style={{ padding: '16px', borderTop: '1px solid #2a2d3e' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '18px', marginBottom: '12px' }}>
                <span style={{ color: '#f0f2f5' }}>Total</span>
                <span style={{ color: '#f97316' }}>{fmt(total)}</span>
              </div>
              <div style={{ marginBottom: '12px' }}>
                <div style={{ fontSize: '11px', color: '#8b92a5', marginBottom: '6px' }}>Metode Pembayaran</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '4px' }}>
                  {(['Tunai', 'Debit', 'QRIS', 'Transfer'] as const).map(m => (
                    <button key={m} onClick={() => setPay(m)} style={{ padding: '6px', borderRadius: '6px', background: pay === m ? '#f97316' : '#2a2d3e', color: pay === m ? '#fff' : '#8b92a5', border: 'none', cursor: 'pointer', fontSize: '11px', fontWeight: 600 }}>
                      {m}
                    </button>
                  ))}
                </div>
              </div>
              {pay === 'Tunai' && (
                <div style={{ marginBottom: '12px' }}>
                  <div style={{ fontSize: '11px', color: '#8b92a5', marginBottom: '4px' }}>Uang Diterima</div>
                  <input value={cash} onChange={e => setCash(e.target.value)} placeholder="Masukkan jumlah..."
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #2a2d3e', background: '#0f1117', color: '#f0f2f5', fontSize: '13px', outline: 'none' }} />
                  {cashNum > 0 && (
                    <div style={{ fontSize: '11px', marginTop: '4px', textAlign: 'right', fontWeight: 700, color: change >= 0 ? '#22c55e' : '#ef4444' }}>
                      Kembalian: {fmt(Math.max(0, change))}
                    </div>
                  )}
                </div>
              )}
              <button onClick={() => cart.length > 0 && setPaid(true)} style={{ width: '100%', padding: '12px', borderRadius: '8px', background: cart.length > 0 ? '#f97316' : '#2a2d3e', color: cart.length > 0 ? '#fff' : '#5a6070', border: 'none', cursor: cart.length > 0 ? 'pointer' : 'default', fontWeight: 700, fontSize: '14px' }}>
                Bayar Sekarang
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

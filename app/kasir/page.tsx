'use client';
import { useState } from 'react';

const fmt = (n: number) => 'Rp ' + n.toLocaleString('id-ID');
const fmtInput = (v: string) => {
  const num = v.replace(/\D/g, '');
  return num ? parseInt(num).toLocaleString('id-ID') : '';
};

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

type TxLog = {
  id: string;
  time: string;
  customer: string;
  items: CartItem[];
  total: number;
  pay: PayMethod;
  cash: number;
  change: number;
};

export default function KasirPage() {
  const [tab, setTab] = useState<'kasir' | 'riwayat'>('kasir');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [search, setSearch] = useState('');
  const [pay, setPay] = useState<PayMethod>('Tunai');
  const [cashRaw, setCashRaw] = useState('');
  const [paid, setPaid] = useState(false);
  const [customer, setCustomer] = useState('');
  const [logs, setLogs] = useState<TxLog[]>([
    { id: 'TRX-0241', time: '14:22 · 27 Jun 2026', customer: 'Rafi Maulana', items: [{ id: 'VS-001', name: 'Kampas Rem Depan', price: 120000, qty: 2 }, { id: 'VS-002', name: 'Oli Agip 4T 1L', price: 90000, qty: 1 }], total: 330000, pay: 'Tunai', cash: 350000, change: 20000 },
    { id: 'TRX-0240', time: '13:45 · 27 Jun 2026', customer: 'Dian Kusuma', items: [{ id: 'VS-004', name: 'Kampas Rem Belakang', price: 110000, qty: 1 }], total: 110000, pay: 'QRIS', cash: 0, change: 0 },
    { id: 'TRX-0239', time: '12:30 · 27 Jun 2026', customer: '-', items: [{ id: 'VS-005', name: 'Busi NGK CR7HSA', price: 55000, qty: 1 }, { id: 'VS-008', name: 'Minyak Rem DOT4', price: 45000, qty: 1 }], total: 100000, pay: 'Debit', cash: 0, change: 0 },
  ]);
  const [txDetail, setTxDetail] = useState<TxLog | null>(null);

  const filtered = catalog.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) || p.id.toLowerCase().includes(search.toLowerCase())
  );

  const addToCart = (p: typeof catalog[0]) => {
    if (p.stock === 0) return;
    setCart(prev => {
      const ex = prev.find(c => c.id === p.id);
      if (ex) return prev.map(c => c.id === p.id ? { ...c, qty: c.qty + 1 } : c);
      return [...prev, { id: p.id, name: p.name, price: p.price, qty: 1 }];
    });
  };

  const changeQty = (id: string, delta: number) => {
    setCart(prev => prev.map(c => c.id === id ? { ...c, qty: c.qty + delta } : c).filter(c => c.qty > 0));
  };

  const total = cart.reduce((s, c) => s + c.price * c.qty, 0);
  const cashNum = parseInt(cashRaw.replace(/\D/g, '')) || 0;
  const kembalian = cashNum - total;

  const canPay = cart.length > 0 && (pay !== 'Tunai' || cashNum >= total);

  const handlePay = () => {
    if (!canPay) return;
    const newLog: TxLog = {
      id: `TRX-${String(logs.length + 242).padStart(4, '0')}`,
      time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' · ' + new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
      customer: customer || '-',
      items: [...cart],
      total,
      pay,
      cash: cashNum,
      change: pay === 'Tunai' ? kembalian : 0,
    };
    setLogs([newLog, ...logs]);
    setPaid(true);
  };

  const handleReset = () => {
    setCart([]);
    setPaid(false);
    setCashRaw('');
    setCustomer('');
    setPay('Tunai');
  };

  return (
    <div style={{ height: 'calc(100vh - 80px)', display: 'flex', flexDirection: 'column' }}>
      {/* Tabs */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '16px', borderBottom: '1px solid #2a2d3e' }}>
        {[['kasir', '🖥️ Transaksi Baru'], ['riwayat', `📋 Riwayat (${logs.length})`]].map(([key, label]) => (
          <button key={key} onClick={() => setTab(key as 'kasir' | 'riwayat')}
            style={{ padding: '10px 20px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: 600, color: tab === key ? '#f97316' : '#8b92a5', borderBottom: tab === key ? '2px solid #f97316' : '2px solid transparent', marginBottom: '-1px' }}>
            {label}
          </button>
        ))}
      </div>

      {/* ===== KASIR TAB ===== */}
      {tab === 'kasir' && (
        <div style={{ flex: 1, display: 'flex', gap: '16px', overflow: 'hidden' }}>
          {/* Product grid */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 Cari produk atau SKU..."
              style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid #2a2d3e', background: '#1e2130', color: '#f0f2f5', fontSize: '13px', outline: 'none', marginBottom: '12px' }} />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', overflowY: 'auto', flex: 1 }}>
              {filtered.map(p => (
                <button key={p.id} onClick={() => addToCart(p)}
                  style={{ padding: '14px', borderRadius: '10px', border: '1px solid #2a2d3e', background: '#1e2130', textAlign: 'left', cursor: p.stock === 0 ? 'not-allowed' : 'pointer', opacity: p.stock === 0 ? 0.45 : 1 }}>
                  <div style={{ fontSize: '26px', marginBottom: '6px' }}>{catIcon[p.category] || '🔧'}</div>
                  <div style={{ fontSize: '10px', color: '#f97316', fontFamily: 'monospace', marginBottom: '3px' }}>{p.id}</div>
                  <div style={{ fontSize: '12px', fontWeight: 600, color: '#f0f2f5', marginBottom: '4px', lineHeight: 1.3 }}>{p.name}</div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#22c55e' }}>{fmt(p.price)}</div>
                  <div style={{ fontSize: '10px', marginTop: '4px', color: p.stock === 0 ? '#ef4444' : p.stock <= 3 ? '#f59e0b' : '#5a6070' }}>
                    {p.stock === 0 ? '❌ HABIS' : `Stok: ${p.stock}`}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Cart panel */}
          <div style={{ width: '310px', display: 'flex', flexDirection: 'column', background: '#1e2130', borderRadius: '12px', border: '1px solid #2a2d3e', overflow: 'hidden' }}>
            {paid ? (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px', textAlign: 'center' }}>
                <div style={{ fontSize: '52px', marginBottom: '12px' }}>✅</div>
                <div style={{ fontSize: '18px', fontWeight: 700, color: '#22c55e', marginBottom: '12px' }}>Pembayaran Berhasil!</div>
                <div style={{ width: '100%', padding: '12px', borderRadius: '8px', background: '#0f1117', marginBottom: '16px', textAlign: 'left' }}>
                  <div style={{ fontSize: '12px', color: '#8b92a5', marginBottom: '4px' }}>Total Dibayar</div>
                  <div style={{ fontSize: '22px', fontWeight: 700, color: '#f0f2f5' }}>{fmt(total)}</div>
                  {pay === 'Tunai' && (
                    <>
                      <div style={{ fontSize: '12px', color: '#8b92a5', marginTop: '8px' }}>Uang Diterima</div>
                      <div style={{ fontSize: '16px', fontWeight: 600, color: '#f0f2f5' }}>{fmt(cashNum)}</div>
                      <div style={{ fontSize: '12px', color: '#8b92a5', marginTop: '6px' }}>Kembalian</div>
                      <div style={{ fontSize: '22px', fontWeight: 700, color: '#f97316' }}>{fmt(kembalian)}</div>
                    </>
                  )}
                  <div style={{ fontSize: '12px', color: '#8b92a5', marginTop: '6px' }}>Metode: <span style={{ color: '#3b82f6' }}>{pay}</span></div>
                </div>
                <button onClick={handleReset} style={{ width: '100%', padding: '12px', borderRadius: '8px', background: '#f97316', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: '14px' }}>
                  🔄 Transaksi Baru
                </button>
              </div>
            ) : (
              <>
                <div style={{ padding: '14px', borderBottom: '1px solid #2a2d3e' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontWeight: 700, color: '#f0f2f5' }}>Keranjang</span>
                    <span style={{ padding: '2px 8px', borderRadius: '9999px', background: cart.length > 0 ? '#f97316' : '#2a2d3e', color: '#fff', fontSize: '12px', fontWeight: 700 }}>{cart.length} item</span>
                  </div>
                  <input value={customer} onChange={e => setCustomer(e.target.value)} placeholder="👤 Nama pelanggan (opsional)"
                    style={{ width: '100%', padding: '7px 10px', borderRadius: '7px', border: '1px solid #2a2d3e', background: '#0f1117', color: '#f0f2f5', fontSize: '12px', outline: 'none', boxSizing: 'border-box' }} />
                </div>

                <div style={{ flex: 1, overflowY: 'auto', padding: '10px 12px' }}>
                  {cart.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '40px 0', fontSize: '13px', color: '#5a6070' }}>
                      <div style={{ fontSize: '32px', marginBottom: '8px' }}>🛒</div>
                      Pilih produk di sebelah kiri
                    </div>
                  ) : cart.map(item => (
                    <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 0', borderBottom: '1px solid #2a2d3e' }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: '12px', fontWeight: 600, color: '#f0f2f5' }}>{item.name}</div>
                        <div style={{ fontSize: '11px', color: '#22c55e' }}>{fmt(item.price)} × {item.qty}</div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                        <button onClick={() => changeQty(item.id, -1)} style={{ width: '22px', height: '22px', borderRadius: '4px', background: '#2a2d3e', color: '#f0f2f5', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: '13px' }}>-</button>
                        <span style={{ width: '22px', textAlign: 'center', fontSize: '13px', fontWeight: 700, color: '#f0f2f5' }}>{item.qty}</span>
                        <button onClick={() => changeQty(item.id, 1)} style={{ width: '22px', height: '22px', borderRadius: '4px', background: '#f97316', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: '13px' }}>+</button>
                      </div>
                      <div style={{ fontSize: '12px', fontWeight: 700, width: '72px', textAlign: 'right', color: '#f0f2f5' }}>{fmt(item.price * item.qty)}</div>
                    </div>
                  ))}
                </div>

                <div style={{ padding: '12px 14px', borderTop: '1px solid #2a2d3e' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '17px', marginBottom: '12px' }}>
                    <span style={{ color: '#f0f2f5' }}>TOTAL</span>
                    <span style={{ color: '#f97316' }}>{fmt(total)}</span>
                  </div>

                  {/* Payment method */}
                  <div style={{ marginBottom: '10px' }}>
                    <div style={{ fontSize: '11px', color: '#8b92a5', marginBottom: '5px' }}>Metode Bayar</div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '4px' }}>
                      {(['Tunai', 'Debit', 'QRIS', 'Transfer'] as const).map(m => (
                        <button key={m} onClick={() => { setPay(m); setCashRaw(''); }}
                          style={{ padding: '6px 4px', borderRadius: '6px', background: pay === m ? '#f97316' : '#2a2d3e', color: pay === m ? '#fff' : '#8b92a5', border: 'none', cursor: 'pointer', fontSize: '11px', fontWeight: 700 }}>
                          {m === 'Tunai' ? '💵' : m === 'Debit' ? '💳' : m === 'QRIS' ? '📱' : '🏦'} {m}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Cash input */}
                  {pay === 'Tunai' && (
                    <div style={{ marginBottom: '10px', padding: '10px', borderRadius: '8px', background: '#0f1117', border: '1px solid #2a2d3e' }}>
                      <div style={{ fontSize: '11px', color: '#8b92a5', marginBottom: '4px' }}>Uang Diterima (Rp)</div>
                      <input
                        value={cashRaw}
                        onChange={e => setCashRaw(fmtInput(e.target.value))}
                        placeholder="0"
                        style={{ width: '100%', padding: '6px 8px', borderRadius: '6px', border: '1px solid #2a2d3e', background: '#1e2130', color: '#f0f2f5', fontSize: '15px', fontWeight: 700, outline: 'none', boxSizing: 'border-box' }}
                      />
                      {/* Quick amounts */}
                      <div style={{ display: 'flex', gap: '4px', marginTop: '6px', flexWrap: 'wrap' }}>
                        {[50000, 100000, 200000, 500000].map(v => (
                          <button key={v} onClick={() => setCashRaw(v.toLocaleString('id-ID'))}
                            style={{ padding: '3px 7px', borderRadius: '5px', background: '#2a2d3e', color: '#8b92a5', border: 'none', cursor: 'pointer', fontSize: '10px' }}>
                            {fmt(v).replace('Rp ', '')}
                          </button>
                        ))}
                      </div>
                      {cashNum > 0 && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', padding: '6px 8px', borderRadius: '6px', background: kembalian >= 0 ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)' }}>
                          <span style={{ fontSize: '12px', color: '#8b92a5' }}>Kembalian</span>
                          <span style={{ fontSize: '15px', fontWeight: 700, color: kembalian >= 0 ? '#22c55e' : '#ef4444' }}>
                            {kembalian >= 0 ? fmt(kembalian) : `Kurang ${fmt(Math.abs(kembalian))}`}
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {pay !== 'Tunai' && (
                    <div style={{ marginBottom: '10px', padding: '10px', borderRadius: '8px', background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)', textAlign: 'center' }}>
                      <div style={{ fontSize: '20px', marginBottom: '4px' }}>{pay === 'QRIS' ? '📱' : pay === 'Debit' ? '💳' : '🏦'}</div>
                      <div style={{ fontSize: '12px', color: '#3b82f6' }}>Tagihkan {fmt(total)} via {pay}</div>
                    </div>
                  )}

                  <button onClick={handlePay} disabled={!canPay}
                    style={{ width: '100%', padding: '12px', borderRadius: '8px', background: canPay ? '#f97316' : '#2a2d3e', color: canPay ? '#fff' : '#5a6070', border: 'none', cursor: canPay ? 'pointer' : 'not-allowed', fontWeight: 700, fontSize: '14px' }}>
                    {cart.length === 0 ? 'Pilih produk dulu' : pay === 'Tunai' && cashNum < total && cashNum > 0 ? `Kurang ${fmt(total - cashNum)}` : '✓ Proses Pembayaran'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* ===== RIWAYAT TAB ===== */}
      {tab === 'riwayat' && (
        <div style={{ flex: 1, overflowY: 'auto' }}>
          <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
            {[
              { label: 'Total Transaksi Hari Ini', value: `${logs.length} transaksi`, color: '#f0f2f5' },
              { label: 'Total Penjualan', value: fmt(logs.reduce((s, l) => s + l.total, 0)), color: '#22c55e' },
            ].map(k => (
              <div key={k.label} style={{ padding: '16px 20px', borderRadius: '10px', border: '1px solid #2a2d3e', background: '#1e2130', flex: 1 }}>
                <div style={{ fontSize: '12px', color: '#8b92a5', marginBottom: '6px' }}>{k.label}</div>
                <div style={{ fontSize: '20px', fontWeight: 700, color: k.color }}>{k.value}</div>
              </div>
            ))}
          </div>

          <div style={{ borderRadius: '12px', border: '1px solid #2a2d3e', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ background: '#1a1d27' }}>
                <tr>
                  {['No. Transaksi', 'Waktu', 'Pelanggan', 'Item', 'Total', 'Bayar', 'Kembalian', 'Detail'].map(h => (
                    <th key={h} style={{ padding: '11px 14px', textAlign: 'left', fontSize: '11px', fontWeight: 600, color: '#8b92a5' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {logs.map((log, i) => (
                  <tr key={log.id} style={{ background: i % 2 === 0 ? '#1e2130' : '#1a1d27', borderBottom: '1px solid #2a2d3e' }}>
                    <td style={{ padding: '11px 14px', fontSize: '12px', fontFamily: 'monospace', color: '#f97316' }}>{log.id}</td>
                    <td style={{ padding: '11px 14px', fontSize: '12px', color: '#8b92a5' }}>{log.time}</td>
                    <td style={{ padding: '11px 14px', fontSize: '13px', color: '#f0f2f5' }}>{log.customer}</td>
                    <td style={{ padding: '11px 14px', fontSize: '12px', color: '#8b92a5' }}>{log.items.length} produk</td>
                    <td style={{ padding: '11px 14px', fontSize: '14px', fontWeight: 700, color: '#22c55e' }}>{fmt(log.total)}</td>
                    <td style={{ padding: '11px 14px' }}>
                      <span style={{ fontSize: '11px', padding: '2px 7px', borderRadius: '4px', fontWeight: 700, background: 'rgba(59,130,246,0.15)', color: '#3b82f6' }}>{log.pay}</span>
                    </td>
                    <td style={{ padding: '11px 14px', fontSize: '13px', fontWeight: 700, color: log.pay === 'Tunai' ? '#f97316' : '#5a6070' }}>
                      {log.pay === 'Tunai' ? fmt(log.change) : '-'}
                    </td>
                    <td style={{ padding: '11px 14px' }}>
                      <button onClick={() => setTxDetail(log)} style={{ padding: '4px 10px', borderRadius: '6px', background: 'rgba(249,115,22,0.15)', color: '#f97316', border: '1px solid rgba(249,115,22,0.3)', cursor: 'pointer', fontSize: '11px' }}>
                        Lihat
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Transaction Detail Modal */}
      {txDetail && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ background: '#1e2130', borderRadius: '16px', padding: '24px', width: '420px', border: '1px solid #2a2d3e' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
              <div>
                <div style={{ fontFamily: 'monospace', fontSize: '14px', color: '#f97316', fontWeight: 700 }}>{txDetail.id}</div>
                <div style={{ fontSize: '12px', color: '#8b92a5', marginTop: '2px' }}>{txDetail.time}</div>
              </div>
              <button onClick={() => setTxDetail(null)} style={{ background: 'none', border: 'none', color: '#8b92a5', cursor: 'pointer', fontSize: '20px' }}>×</button>
            </div>
            <div style={{ fontSize: '13px', color: '#8b92a5', marginBottom: '4px' }}>Pelanggan: <span style={{ color: '#f0f2f5' }}>{txDetail.customer}</span></div>
            <div style={{ padding: '12px', borderRadius: '8px', background: '#0f1117', margin: '12px 0' }}>
              {txDetail.items.map(item => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', fontSize: '13px' }}>
                  <span style={{ color: '#8b92a5' }}>{item.name} × {item.qty}</span>
                  <span style={{ color: '#f0f2f5', fontWeight: 600 }}>{fmt(item.price * item.qty)}</span>
                </div>
              ))}
              <div style={{ borderTop: '1px solid #2a2d3e', marginTop: '8px', paddingTop: '8px', display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
                <span style={{ color: '#f0f2f5' }}>Total</span>
                <span style={{ color: '#22c55e', fontSize: '16px' }}>{fmt(txDetail.total)}</span>
              </div>
            </div>
            <div style={{ fontSize: '13px', color: '#8b92a5' }}>Bayar: <span style={{ color: '#3b82f6', fontWeight: 600 }}>{txDetail.pay}</span></div>
            {txDetail.pay === 'Tunai' && <div style={{ fontSize: '13px', color: '#8b92a5', marginTop: '4px' }}>Kembalian: <span style={{ color: '#f97316', fontWeight: 700 }}>{fmt(txDetail.change)}</span></div>}
          </div>
        </div>
      )}
    </div>
  );
}

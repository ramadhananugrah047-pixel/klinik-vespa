'use client';
import { useState } from 'react';
import { useApp, CartItem } from '@/contexts/AppContext';

const fmt = (n: number) => 'Rp ' + n.toLocaleString('id-ID');
const fmtInput = (v: string) => {
  const num = v.replace(/\D/g, '');
  return num ? parseInt(num).toLocaleString('id-ID') : '';
};

const catIcon: Record<string, string> = { Rem: '🛑', Oli: '🛢️', Ban: '⭕', Elektrikal: '⚡', Filter: '🌀', Transmisi: '⚙️', Bearing: '🔩', Body: '🏠', Kelistrikan: '🔌' };
type PayMethod = 'Tunai' | 'Debit' | 'QRIS' | 'Transfer' | 'Piutang';

export default function KasirPage() {
  const { products, customers, transactions, processSale } = useApp();
  const [tab, setTab] = useState<'kasir' | 'riwayat'>('kasir');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [search, setSearch] = useState('');
  const [pay, setPay] = useState<PayMethod>('Tunai');
  const [cashRaw, setCashRaw] = useState('');
  const [paidTx, setPaidTx] = useState<ReturnType<typeof processSale> | null>(null);
  const [customerSearch, setCustomerSearch] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<typeof customers[0] | null>(null);
  const [showCustDrop, setShowCustDrop] = useState(false);
  const [txDetail, setTxDetail] = useState<typeof transactions[0] | null>(null);

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) || p.id.toLowerCase().includes(search.toLowerCase())
  );

  const addToCart = (p: typeof products[0]) => {
    if (p.stock === 0) return;
    const inCart = cart.find(c => c.id === p.id);
    if (inCart && inCart.qty >= p.stock) return; // jangan melebihi stok
    setCart(prev => {
      const ex = prev.find(c => c.id === p.id);
      if (ex) return prev.map(c => c.id === p.id ? { ...c, qty: c.qty + 1 } : c);
      return [...prev, { id: p.id, name: p.name, price: p.sell, qty: 1 }];
    });
  };

  const changeQty = (id: string, delta: number) => {
    const product = products.find(p => p.id === id);
    setCart(prev => prev.map(c => {
      if (c.id !== id) return c;
      const newQty = c.qty + delta;
      if (newQty <= 0) return { ...c, qty: 0 };
      if (product && newQty > product.stock) return c; // batas stok
      return { ...c, qty: newQty };
    }).filter(c => c.qty > 0));
  };

  const total = cart.reduce((s, c) => s + c.price * c.qty, 0);
  const cashNum = parseInt(cashRaw.replace(/\D/g, '')) || 0;
  const kembalian = cashNum - total;
  const canPay = cart.length > 0 && (pay !== 'Tunai' || cashNum >= total) && (pay !== 'Piutang' || selectedCustomer !== null);

  const handlePay = () => {
    if (!canPay) return;
    const tx = processSale({
      cart,
      customer: selectedCustomer?.name || '',
      customerId: selectedCustomer?.id || '',
      payMethod: pay,
      cashReceived: pay === 'Tunai' ? cashNum : 0,
      isPiutang: pay === 'Piutang',
    });
    setPaidTx(tx);
  };

  const handleReset = () => {
    setCart([]);
    setPaidTx(null);
    setCashRaw('');
    setSelectedCustomer(null);
    setCustomerSearch('');
    setPay('Tunai');
  };

  const custDropList = customers.filter(c =>
    c.name.toLowerCase().includes(customerSearch.toLowerCase())
  );

  return (
    <div style={{ height: 'calc(100vh - 80px)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', gap: '4px', marginBottom: '16px', borderBottom: '1px solid #2a2d3e' }}>
        {[['kasir', '🖥️ Transaksi Baru'], ['riwayat', `📋 Riwayat (${transactions.length})`]].map(([key, label]) => (
          <button key={key} onClick={() => setTab(key as 'kasir' | 'riwayat')}
            style={{ padding: '10px 20px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: 600, color: tab === key ? '#f97316' : '#8b92a5', borderBottom: tab === key ? '2px solid #f97316' : '2px solid transparent', marginBottom: '-1px' }}>
            {label}
          </button>
        ))}
      </div>

      {/* ===== KASIR ===== */}
      {tab === 'kasir' && (
        <div style={{ flex: 1, display: 'flex', gap: '16px', overflow: 'hidden' }}>
          {/* Produk */}
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 Cari produk atau SKU..."
              style={{ padding: '10px 14px', borderRadius: '8px', border: '1px solid #2a2d3e', background: '#1e2130', color: '#f0f2f5', fontSize: '13px', outline: 'none', marginBottom: '12px' }} />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', overflowY: 'auto', flex: 1 }}>
              {filtered.map(p => {
                const inCart = cart.find(c => c.id === p.id)?.qty || 0;
                const isMax = inCart >= p.stock;
                return (
                  <button key={p.id} onClick={() => addToCart(p)}
                    style={{ padding: '14px', borderRadius: '10px', border: `1px solid ${inCart > 0 ? '#f97316' : '#2a2d3e'}`, background: inCart > 0 ? 'rgba(249,115,22,0.08)' : '#1e2130', textAlign: 'left', cursor: p.stock === 0 ? 'not-allowed' : 'pointer', opacity: p.stock === 0 ? 0.4 : 1, position: 'relative' }}>
                    {inCart > 0 && (
                      <div style={{ position: 'absolute', top: '8px', right: '8px', width: '20px', height: '20px', borderRadius: '50%', background: '#f97316', color: '#fff', fontSize: '11px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{inCart}</div>
                    )}
                    <div style={{ fontSize: '24px', marginBottom: '6px' }}>{catIcon[p.category] || '🔧'}</div>
                    <div style={{ fontSize: '10px', color: '#f97316', fontFamily: 'monospace', marginBottom: '2px' }}>{p.id}</div>
                    <div style={{ fontSize: '12px', fontWeight: 600, color: '#f0f2f5', marginBottom: '4px', lineHeight: 1.3 }}>{p.name}</div>
                    <div style={{ fontSize: '14px', fontWeight: 700, color: '#22c55e' }}>{fmt(p.sell)}</div>
                    <div style={{ fontSize: '10px', marginTop: '4px', color: p.stock === 0 ? '#ef4444' : isMax ? '#f59e0b' : '#5a6070' }}>
                      {p.stock === 0 ? '❌ HABIS' : isMax ? `⚠️ Max (${p.stock})` : `Stok: ${p.stock}`}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Cart */}
          <div style={{ width: '310px', display: 'flex', flexDirection: 'column', background: '#1e2130', borderRadius: '12px', border: '1px solid #2a2d3e', overflow: 'hidden' }}>
            {paidTx ? (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px', textAlign: 'center' }}>
                <div style={{ fontSize: '48px', marginBottom: '10px' }}>✅</div>
                <div style={{ fontSize: '16px', fontWeight: 700, color: '#22c55e', marginBottom: '12px' }}>Pembayaran Berhasil!</div>
                <div style={{ width: '100%', padding: '12px', borderRadius: '8px', background: '#0f1117', marginBottom: '14px', textAlign: 'left' }}>
                  <div style={{ fontSize: '11px', color: '#5a6070', fontFamily: 'monospace', marginBottom: '8px' }}>{paidTx.id}</div>
                  <div style={{ fontSize: '12px', color: '#8b92a5', marginBottom: '2px' }}>Total Dibayar</div>
                  <div style={{ fontSize: '20px', fontWeight: 700, color: '#f0f2f5', marginBottom: '8px' }}>{fmt(paidTx.total)}</div>
                  {paidTx.payMethod === 'Tunai' && (
                    <>
                      <div style={{ fontSize: '12px', color: '#8b92a5' }}>Uang diterima: <span style={{ color: '#f0f2f5' }}>{fmt(paidTx.cashReceived)}</span></div>
                      <div style={{ fontSize: '14px', fontWeight: 700, color: '#f97316', marginTop: '4px' }}>Kembalian: {fmt(paidTx.change)}</div>
                    </>
                  )}
                  {paidTx.isPiutang && <div style={{ fontSize: '12px', color: '#f59e0b', marginTop: '4px' }}>⚠️ Dicatat sebagai piutang</div>}
                  <div style={{ fontSize: '11px', color: '#5a6070', marginTop: '4px' }}>Bayar: {paidTx.payMethod}</div>
                </div>
                <button onClick={handleReset} style={{ width: '100%', padding: '11px', borderRadius: '8px', background: '#f97316', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 700 }}>
                  🔄 Transaksi Baru
                </button>
              </div>
            ) : (
              <>
                <div style={{ padding: '12px 14px', borderBottom: '1px solid #2a2d3e' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontWeight: 700, color: '#f0f2f5' }}>Keranjang</span>
                    <span style={{ padding: '2px 8px', borderRadius: '9999px', background: cart.length > 0 ? '#f97316' : '#2a2d3e', color: '#fff', fontSize: '11px', fontWeight: 700 }}>{cart.length} item</span>
                  </div>
                  {/* Customer selector */}
                  <div style={{ position: 'relative' }}>
                    <input
                      value={selectedCustomer ? selectedCustomer.name : customerSearch}
                      onChange={e => { setCustomerSearch(e.target.value); setSelectedCustomer(null); setShowCustDrop(true); }}
                      onFocus={() => setShowCustDrop(true)}
                      onBlur={() => setTimeout(() => setShowCustDrop(false), 150)}
                      placeholder="👤 Pilih / cari pelanggan..."
                      style={{ width: '100%', padding: '7px 10px', borderRadius: '7px', border: `1px solid ${selectedCustomer ? '#f97316' : '#2a2d3e'}`, background: '#0f1117', color: '#f0f2f5', fontSize: '12px', outline: 'none', boxSizing: 'border-box' }} />
                    {selectedCustomer && (
                      <button onClick={() => { setSelectedCustomer(null); setCustomerSearch(''); }} style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#8b92a5', cursor: 'pointer', fontSize: '14px' }}>×</button>
                    )}
                    {showCustDrop && !selectedCustomer && custDropList.length > 0 && (
                      <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: '#1a1d27', border: '1px solid #2a2d3e', borderRadius: '8px', zIndex: 10, maxHeight: '140px', overflowY: 'auto', marginTop: '2px' }}>
                        {custDropList.map(c => (
                          <button key={c.id} onMouseDown={() => { setSelectedCustomer(c); setShowCustDrop(false); }}
                            style={{ width: '100%', padding: '8px 10px', background: 'none', border: 'none', cursor: 'pointer', textAlign: 'left', borderBottom: '1px solid #2a2d3e' }}>
                            <div style={{ fontSize: '12px', color: '#f0f2f5', fontWeight: 600 }}>{c.name}</div>
                            {c.piutang > 0 && <div style={{ fontSize: '10px', color: '#f59e0b' }}>Piutang: {fmt(c.piutang)}</div>}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div style={{ flex: 1, overflowY: 'auto', padding: '10px 12px' }}>
                  {cart.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '32px 0', color: '#5a6070' }}>
                      <div style={{ fontSize: '28px', marginBottom: '6px' }}>🛒</div>
                      <div style={{ fontSize: '12px' }}>Pilih produk di sebelah kiri</div>
                    </div>
                  ) : cart.map(item => {
                    const p = products.find(x => x.id === item.id);
                    return (
                      <div key={item.id} style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '7px 0', borderBottom: '1px solid #2a2d3e' }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '12px', fontWeight: 600, color: '#f0f2f5' }}>{item.name}</div>
                          <div style={{ fontSize: '11px', color: '#22c55e' }}>{fmt(item.price)}</div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                          <button onClick={() => changeQty(item.id, -1)} style={{ width: '22px', height: '22px', borderRadius: '4px', background: '#2a2d3e', color: '#f0f2f5', border: 'none', cursor: 'pointer', fontWeight: 700 }}>-</button>
                          <span style={{ width: '22px', textAlign: 'center', fontSize: '13px', fontWeight: 700, color: '#f0f2f5' }}>{item.qty}</span>
                          <button onClick={() => changeQty(item.id, 1)} style={{ width: '22px', height: '22px', borderRadius: '4px', background: p && item.qty >= p.stock ? '#2a2d3e' : '#f97316', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 700 }}>+</button>
                        </div>
                        <div style={{ fontSize: '12px', fontWeight: 700, width: '68px', textAlign: 'right', color: '#f0f2f5' }}>{fmt(item.price * item.qty)}</div>
                      </div>
                    );
                  })}
                </div>

                <div style={{ padding: '12px 14px', borderTop: '1px solid #2a2d3e' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '16px', marginBottom: '10px' }}>
                    <span style={{ color: '#f0f2f5' }}>TOTAL</span>
                    <span style={{ color: '#f97316' }}>{fmt(total)}</span>
                  </div>

                  {/* Payment */}
                  <div style={{ marginBottom: '10px' }}>
                    <div style={{ fontSize: '11px', color: '#8b92a5', marginBottom: '5px' }}>Metode Bayar</div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '3px' }}>
                      {(['Tunai', 'Debit', 'QRIS', 'Transfer', 'Piutang'] as const).map(m => (
                        <button key={m} onClick={() => { setPay(m); setCashRaw(''); }}
                          style={{ padding: '5px 2px', borderRadius: '5px', background: pay === m ? (m === 'Piutang' ? '#f59e0b' : '#f97316') : '#2a2d3e', color: pay === m ? '#fff' : '#8b92a5', border: 'none', cursor: 'pointer', fontSize: '10px', fontWeight: 700 }}>
                          {m === 'Tunai' ? '💵' : m === 'Debit' ? '💳' : m === 'QRIS' ? '📱' : m === 'Transfer' ? '🏦' : '⏳'}<br />{m}
                        </button>
                      ))}
                    </div>
                  </div>

                  {pay === 'Piutang' && (
                    <div style={{ padding: '8px 10px', borderRadius: '8px', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)', marginBottom: '8px' }}>
                      <div style={{ fontSize: '11px', color: '#f59e0b' }}>⚠️ {selectedCustomer ? `Piutang dicatat ke: ${selectedCustomer.name}` : 'Pilih pelanggan di atas untuk piutang'}</div>
                    </div>
                  )}

                  {pay === 'Tunai' && (
                    <div style={{ padding: '10px', borderRadius: '8px', background: '#0f1117', border: '1px solid #2a2d3e', marginBottom: '8px' }}>
                      <div style={{ fontSize: '11px', color: '#8b92a5', marginBottom: '4px' }}>Uang Diterima (Rp)</div>
                      <input value={cashRaw} onChange={e => setCashRaw(fmtInput(e.target.value))} placeholder="0"
                        style={{ width: '100%', padding: '6px 8px', borderRadius: '6px', border: '1px solid #2a2d3e', background: '#1e2130', color: '#f0f2f5', fontSize: '16px', fontWeight: 700, outline: 'none', boxSizing: 'border-box' }} />
                      <div style={{ display: 'flex', gap: '4px', marginTop: '6px', flexWrap: 'wrap' }}>
                        {[50000, 100000, 200000, 500000].map(v => (
                          <button key={v} onClick={() => setCashRaw(v.toLocaleString('id-ID'))}
                            style={{ padding: '3px 6px', borderRadius: '4px', background: '#2a2d3e', color: '#8b92a5', border: 'none', cursor: 'pointer', fontSize: '10px' }}>
                            {(v / 1000)}rb
                          </button>
                        ))}
                        <button onClick={() => setCashRaw(total.toLocaleString('id-ID'))}
                          style={{ padding: '3px 6px', borderRadius: '4px', background: 'rgba(249,115,22,0.2)', color: '#f97316', border: 'none', cursor: 'pointer', fontSize: '10px', fontWeight: 700 }}>
                          Pas
                        </button>
                      </div>
                      {cashNum > 0 && (
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px', padding: '6px 8px', borderRadius: '6px', background: kembalian >= 0 ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)' }}>
                          <span style={{ fontSize: '12px', color: '#8b92a5' }}>Kembalian</span>
                          <span style={{ fontSize: '15px', fontWeight: 700, color: kembalian >= 0 ? '#22c55e' : '#ef4444' }}>
                            {kembalian >= 0 ? fmt(kembalian) : `Kurang ${fmt(-kembalian)}`}
                          </span>
                        </div>
                      )}
                    </div>
                  )}

                  {(pay === 'Debit' || pay === 'QRIS' || pay === 'Transfer') && (
                    <div style={{ padding: '8px', borderRadius: '8px', background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)', marginBottom: '8px', textAlign: 'center' }}>
                      <div style={{ fontSize: '11px', color: '#3b82f6' }}>Tagihkan {fmt(total)} via {pay}</div>
                    </div>
                  )}

                  <button onClick={handlePay} disabled={!canPay}
                    style={{ width: '100%', padding: '12px', borderRadius: '8px', background: canPay ? '#f97316' : '#2a2d3e', color: canPay ? '#fff' : '#5a6070', border: 'none', cursor: canPay ? 'pointer' : 'not-allowed', fontWeight: 700, fontSize: '13px' }}>
                    {cart.length === 0 ? 'Pilih produk dulu' :
                      pay === 'Piutang' && !selectedCustomer ? 'Pilih pelanggan dulu' :
                      pay === 'Tunai' && cashNum < total && cashNum > 0 ? `Kurang ${fmt(total - cashNum)}` :
                      pay === 'Tunai' && cashNum === 0 ? 'Masukkan uang diterima' :
                      '✓ Proses Pembayaran'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* ===== RIWAYAT ===== */}
      {tab === 'riwayat' && (
        <div style={{ flex: 1, overflowY: 'auto' }}>
          <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
            {[
              { label: 'Total Transaksi', value: `${transactions.length}`, color: '#f0f2f5' },
              { label: 'Total Penjualan', value: fmt(transactions.filter(t => !t.isPiutang).reduce((s, t) => s + t.total, 0)), color: '#22c55e' },
              { label: 'Total Piutang', value: fmt(transactions.filter(t => t.isPiutang).reduce((s, t) => s + t.total, 0)), color: '#f59e0b' },
            ].map(k => (
              <div key={k.label} style={{ padding: '14px 18px', borderRadius: '10px', border: '1px solid #2a2d3e', background: '#1e2130', flex: 1 }}>
                <div style={{ fontSize: '12px', color: '#8b92a5', marginBottom: '4px' }}>{k.label}</div>
                <div style={{ fontSize: '20px', fontWeight: 700, color: k.color }}>{k.value}</div>
              </div>
            ))}
          </div>
          <div style={{ borderRadius: '12px', border: '1px solid #2a2d3e', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ background: '#1a1d27' }}>
                <tr>{['No. Transaksi', 'Waktu', 'Pelanggan', 'Item', 'Total', 'Bayar', 'Detail'].map(h => (
                  <th key={h} style={{ padding: '11px 14px', textAlign: 'left', fontSize: '11px', fontWeight: 600, color: '#8b92a5' }}>{h}</th>
                ))}</tr>
              </thead>
              <tbody>
                {transactions.map((t, i) => (
                  <tr key={t.id} style={{ background: i % 2 === 0 ? '#1e2130' : '#1a1d27', borderBottom: '1px solid #2a2d3e' }}>
                    <td style={{ padding: '10px 14px', fontSize: '11px', color: '#f97316', fontFamily: 'monospace' }}>{t.id}</td>
                    <td style={{ padding: '10px 14px', fontSize: '12px', color: '#8b92a5' }}>{t.time} · {t.date}</td>
                    <td style={{ padding: '10px 14px', fontSize: '13px', color: '#f0f2f5' }}>{t.customer}</td>
                    <td style={{ padding: '10px 14px', fontSize: '12px', color: '#8b92a5' }}>{t.items.length} produk</td>
                    <td style={{ padding: '10px 14px', fontSize: '14px', fontWeight: 700, color: '#22c55e' }}>{fmt(t.total)}</td>
                    <td style={{ padding: '10px 14px' }}>
                      <span style={{ fontSize: '11px', padding: '2px 7px', borderRadius: '4px', fontWeight: 700, background: t.isPiutang ? 'rgba(245,158,11,0.15)' : 'rgba(59,130,246,0.15)', color: t.isPiutang ? '#f59e0b' : '#3b82f6' }}>
                        {t.isPiutang ? 'Piutang' : t.payMethod}
                      </span>
                    </td>
                    <td style={{ padding: '10px 14px' }}>
                      <button onClick={() => setTxDetail(t)} style={{ padding: '4px 10px', borderRadius: '6px', background: 'rgba(249,115,22,0.15)', color: '#f97316', border: '1px solid rgba(249,115,22,0.3)', cursor: 'pointer', fontSize: '11px' }}>Lihat</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Detail modal */}
      {txDetail && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ background: '#1e2130', borderRadius: '16px', padding: '24px', width: '400px', border: '1px solid #2a2d3e' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '14px' }}>
              <div>
                <div style={{ fontFamily: 'monospace', fontSize: '14px', color: '#f97316', fontWeight: 700 }}>{txDetail.id}</div>
                <div style={{ fontSize: '12px', color: '#8b92a5' }}>{txDetail.time} · {txDetail.date}</div>
              </div>
              <button onClick={() => setTxDetail(null)} style={{ background: 'none', border: 'none', color: '#8b92a5', cursor: 'pointer', fontSize: '20px' }}>×</button>
            </div>
            <div style={{ fontSize: '13px', color: '#8b92a5', marginBottom: '10px' }}>Pelanggan: <span style={{ color: '#f0f2f5' }}>{txDetail.customer}</span></div>
            <div style={{ padding: '12px', borderRadius: '8px', background: '#0f1117', margin: '0 0 12px' }}>
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
            <div style={{ fontSize: '13px', color: '#8b92a5' }}>Bayar: <span style={{ color: '#3b82f6', fontWeight: 600 }}>{txDetail.isPiutang ? 'Piutang' : txDetail.payMethod}</span></div>
            {txDetail.payMethod === 'Tunai' && !txDetail.isPiutang && <div style={{ fontSize: '13px', color: '#8b92a5', marginTop: '4px' }}>Kembalian: <span style={{ color: '#f97316', fontWeight: 700 }}>{fmt(txDetail.change)}</span></div>}
          </div>
        </div>
      )}
    </div>
  );
}

'use client';
import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';

const fmt = (n: number) => 'Rp ' + n.toLocaleString('id-ID');
type Tab = 'penjualan' | 'keuangan' | 'stok';

export default function LaporanPage() {
  const { products, transactions, cashFlow, customers, suppliers } = useApp();
  const [tab, setTab] = useState<Tab>('penjualan');

  const totalPenjualan = transactions.filter(t => !t.isPiutang).reduce((s, t) => s + t.total, 0);
  const totalPiutangTx = transactions.filter(t => t.isPiutang).reduce((s, t) => s + t.total, 0);
  const totalMasuk = cashFlow.filter(c => c.type === 'Masuk').reduce((s, c) => s + c.amount, 0);
  const totalKeluar = cashFlow.filter(c => c.type === 'Keluar').reduce((s, c) => s + c.amount, 0);
  const labaKotor = totalMasuk - totalKeluar;

  // Produk terlaris dari transaksi
  const productSales: Record<string, { name: string; qty: number; rev: number }> = {};
  transactions.forEach(t => t.items.forEach(item => {
    if (!productSales[item.id]) productSales[item.id] = { name: item.name, qty: 0, rev: 0 };
    productSales[item.id].qty += item.qty;
    productSales[item.id].rev += item.price * item.qty;
  }));
  const topProducts = Object.values(productSales).sort((a, b) => b.rev - a.rev).slice(0, 5);
  const maxQty = topProducts[0]?.qty || 1;

  const kritisItems = products.filter(p => p.stock <= p.min);
  const nilaiStok = products.reduce((s, p) => s + p.stock * p.buy, 0);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#f0f2f5', margin: 0 }}>Laporan</h1>
          <p style={{ fontSize: '13px', color: '#8b92a5', marginTop: '4px' }}>Data real-time dari semua transaksi</p>
        </div>
        <button style={{ padding: '8px 16px', borderRadius: '8px', background: '#2a2d3e', color: '#8b92a5', border: 'none', cursor: 'pointer', fontSize: '13px' }}>📥 Export PDF</button>
      </div>

      {/* KPI */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '20px' }}>
        {[
          { label: 'Total Penjualan (Tunai)', value: fmt(totalPenjualan), sub: `${transactions.filter(t => !t.isPiutang).length} transaksi`, color: '#22c55e' },
          { label: 'Piutang Belum Dibayar', value: fmt(totalPiutangTx), sub: `${transactions.filter(t => t.isPiutang).length} transaksi kredit`, color: '#f59e0b' },
          { label: 'Saldo Kas Bersih', value: fmt(labaKotor), sub: 'Total masuk - keluar', color: labaKotor >= 0 ? '#f97316' : '#ef4444' },
          { label: 'Total Transaksi', value: `${transactions.length}`, sub: 'Semua transaksi', color: '#f0f2f5' },
        ].map(k => (
          <div key={k.label} style={{ padding: '18px 20px', borderRadius: '12px', border: '1px solid #2a2d3e', background: '#1e2130' }}>
            <div style={{ fontSize: '12px', color: '#8b92a5', marginBottom: '8px' }}>{k.label}</div>
            <div style={{ fontSize: '20px', fontWeight: 700, color: k.color, marginBottom: '4px' }}>{k.value}</div>
            <div style={{ fontSize: '11px', color: '#5a6070' }}>{k.sub}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '16px', borderBottom: '1px solid #2a2d3e' }}>
        {[['penjualan', '📊 Penjualan'], ['keuangan', '💰 Keuangan'], ['stok', '📦 Stok']].map(([key, label]) => (
          <button key={key} onClick={() => setTab(key as Tab)}
            style={{ padding: '10px 20px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 600, color: tab === key ? '#f97316' : '#8b92a5', borderBottom: tab === key ? '2px solid #f97316' : '2px solid transparent', marginBottom: '-1px' }}>
            {label}
          </button>
        ))}
      </div>

      {tab === 'penjualan' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <div style={{ padding: '20px', borderRadius: '12px', border: '1px solid #2a2d3e', background: '#1e2130' }}>
            <div style={{ fontWeight: 700, color: '#f0f2f5', marginBottom: '16px' }}>Produk Terlaris</div>
            {topProducts.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '24px', color: '#5a6070', fontSize: '13px' }}>Belum ada transaksi</div>
            ) : topProducts.map((p, i) => (
              <div key={p.name} style={{ marginBottom: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: '#f97316', width: '16px' }}>#{i + 1}</span>
                    <span style={{ fontSize: '13px', color: '#f0f2f5' }}>{p.name}</span>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: '#22c55e' }}>{fmt(p.rev)}</div>
                    <div style={{ fontSize: '11px', color: '#5a6070' }}>{p.qty} pcs</div>
                  </div>
                </div>
                <div style={{ height: '4px', background: '#2a2d3e', borderRadius: '2px' }}>
                  <div style={{ height: '100%', width: `${(p.qty / maxQty) * 100}%`, background: '#f97316', borderRadius: '2px' }}></div>
                </div>
              </div>
            ))}
          </div>
          <div style={{ padding: '20px', borderRadius: '12px', border: '1px solid #2a2d3e', background: '#1e2130' }}>
            <div style={{ fontWeight: 700, color: '#f0f2f5', marginBottom: '16px' }}>Metode Bayar</div>
            {(['Tunai', 'Debit', 'QRIS', 'Transfer', 'Piutang'] as const).map(m => {
              const count = transactions.filter(t => t.isPiutang ? m === 'Piutang' : t.payMethod === m).length;
              const amount = transactions.filter(t => t.isPiutang ? m === 'Piutang' : t.payMethod === m).reduce((s, t) => s + t.total, 0);
              if (count === 0) return null;
              return (
                <div key={m} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #2a2d3e' }}>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 600, color: '#f0f2f5' }}>{m}</div>
                    <div style={{ fontSize: '11px', color: '#5a6070' }}>{count} transaksi</div>
                  </div>
                  <div style={{ fontWeight: 700, color: m === 'Piutang' ? '#f59e0b' : '#22c55e', fontSize: '15px' }}>{fmt(amount)}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {tab === 'keuangan' && (
        <div style={{ padding: '20px', borderRadius: '12px', border: '1px solid #2a2d3e', background: '#1e2130' }}>
          <div style={{ fontWeight: 700, color: '#f0f2f5', marginBottom: '16px' }}>Ringkasan Keuangan</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 600, color: '#22c55e', marginBottom: '10px' }}>Pemasukan</div>
              {Object.entries(
                cashFlow.filter(c => c.type === 'Masuk').reduce((acc, c) => {
                  acc[c.cat] = (acc[c.cat] || 0) + c.amount;
                  return acc;
                }, {} as Record<string, number>)
              ).map(([cat, amount]) => (
                <div key={cat} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid #2a2d3e', fontSize: '13px' }}>
                  <span style={{ color: '#8b92a5' }}>{cat}</span>
                  <span style={{ color: '#22c55e', fontWeight: 600 }}>{fmt(amount)}</span>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', fontWeight: 700 }}>
                <span style={{ color: '#f0f2f5' }}>Total Masuk</span>
                <span style={{ color: '#22c55e', fontSize: '16px' }}>{fmt(totalMasuk)}</span>
              </div>
            </div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 600, color: '#ef4444', marginBottom: '10px' }}>Pengeluaran</div>
              {Object.entries(
                cashFlow.filter(c => c.type === 'Keluar').reduce((acc, c) => {
                  acc[c.cat] = (acc[c.cat] || 0) + c.amount;
                  return acc;
                }, {} as Record<string, number>)
              ).map(([cat, amount]) => (
                <div key={cat} style={{ display: 'flex', justifyContent: 'space-between', padding: '7px 0', borderBottom: '1px solid #2a2d3e', fontSize: '13px' }}>
                  <span style={{ color: '#8b92a5' }}>{cat}</span>
                  <span style={{ color: '#ef4444', fontWeight: 600 }}>{fmt(amount)}</span>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', fontWeight: 700 }}>
                <span style={{ color: '#f0f2f5' }}>Total Keluar</span>
                <span style={{ color: '#ef4444', fontSize: '16px' }}>{fmt(totalKeluar)}</span>
              </div>
            </div>
          </div>
          <div style={{ marginTop: '16px', padding: '14px 18px', borderRadius: '8px', background: labaKotor >= 0 ? 'rgba(249,115,22,0.1)' : 'rgba(239,68,68,0.1)', border: `1px solid ${labaKotor >= 0 ? 'rgba(249,115,22,0.2)' : 'rgba(239,68,68,0.2)'}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '16px', fontWeight: 700, color: '#f0f2f5' }}>Saldo Kas Bersih</span>
            <span style={{ fontSize: '24px', fontWeight: 700, color: labaKotor >= 0 ? '#f97316' : '#ef4444' }}>{fmt(labaKotor)}</span>
          </div>
          <div style={{ marginTop: '10px', padding: '10px 14px', borderRadius: '8px', background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ fontSize: '13px', color: '#8b92a5' }}>Piutang Belum Diterima (potensi)</span>
            <span style={{ fontSize: '15px', fontWeight: 700, color: '#f59e0b' }}>{fmt(customers.reduce((s, c) => s + c.piutang, 0))}</span>
          </div>
        </div>
      )}

      {tab === 'stok' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '14px', marginBottom: '16px' }}>
            {[
              { label: 'Nilai Total Stok', value: fmt(nilaiStok), color: '#3b82f6' },
              { label: 'Produk Stok Kritis', value: `${kritisItems.length}`, color: '#f59e0b' },
              { label: 'Total SKU', value: `${products.length}`, color: '#f0f2f5' },
            ].map(k => (
              <div key={k.label} style={{ padding: '16px', borderRadius: '10px', border: '1px solid #2a2d3e', background: '#1e2130' }}>
                <div style={{ fontSize: '12px', color: '#8b92a5', marginBottom: '6px' }}>{k.label}</div>
                <div style={{ fontSize: '20px', fontWeight: 700, color: k.color }}>{k.value}</div>
              </div>
            ))}
          </div>
          <div style={{ borderRadius: '12px', border: '1px solid #2a2d3e', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead style={{ background: '#1a1d27' }}>
                <tr>{['Produk', 'Kategori', 'Stok', 'Min', 'Nilai Stok', 'Status'].map(h => (
                  <th key={h} style={{ padding: '11px 14px', textAlign: 'left', fontSize: '11px', fontWeight: 600, color: '#8b92a5' }}>{h}</th>
                ))}</tr>
              </thead>
              <tbody>
                {products.map((p, i) => {
                  const status = p.stock === 0 ? { label: 'HABIS', color: '#ef4444', bg: 'rgba(239,68,68,0.15)' } : p.stock <= p.min ? { label: 'MENIPIS', color: '#f59e0b', bg: 'rgba(245,158,11,0.15)' } : { label: 'AMAN', color: '#22c55e', bg: 'rgba(34,197,94,0.15)' };
                  return (
                    <tr key={p.id} style={{ background: i % 2 === 0 ? '#1e2130' : '#1a1d27', borderBottom: '1px solid #2a2d3e' }}>
                      <td style={{ padding: '10px 14px', fontSize: '13px', fontWeight: 600, color: '#f0f2f5' }}>{p.name}</td>
                      <td style={{ padding: '10px 14px', fontSize: '12px', color: '#8b92a5' }}>{p.category}</td>
                      <td style={{ padding: '10px 14px', fontSize: '14px', fontWeight: 700, color: status.color }}>{p.stock} pcs</td>
                      <td style={{ padding: '10px 14px', fontSize: '12px', color: '#5a6070' }}>{p.min}</td>
                      <td style={{ padding: '10px 14px', fontSize: '13px', color: '#8b92a5' }}>{fmt(p.stock * p.buy)}</td>
                      <td style={{ padding: '10px 14px' }}><span style={{ fontSize: '11px', padding: '2px 7px', borderRadius: '4px', fontWeight: 700, background: status.bg, color: status.color }}>{status.label}</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

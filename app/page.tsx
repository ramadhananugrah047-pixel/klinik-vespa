'use client';
import { useApp } from '@/contexts/AppContext';

const fmt = (n: number) => 'Rp ' + n.toLocaleString('id-ID');

export default function Dashboard() {
  const { products, transactions, customers, suppliers, cashFlow } = useApp();
  const today = new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  const todayStr = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  const todayTx = transactions.filter(t => t.date === todayStr);
  const todaySales = todayTx.reduce((s, t) => s + t.total, 0);

  const totalMasuk = cashFlow.filter(c => c.type === 'Masuk').reduce((s, c) => s + c.amount, 0);
  const totalKeluar = cashFlow.filter(c => c.type === 'Keluar').reduce((s, c) => s + c.amount, 0);
  const saldo = totalMasuk - totalKeluar;

  const kritisItems = products.filter(p => p.stock <= p.min);
  const totalPiutang = customers.reduce((s, c) => s + c.piutang, 0);
  const totalHutang = suppliers.reduce((s, s2) => s + s2.hutang, 0);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#f0f2f5', margin: 0 }}>Dashboard</h1>
          <p style={{ fontSize: '13px', color: '#8b92a5', marginTop: '4px' }}>{today}</p>
        </div>
      </div>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '20px' }}>
        {[
          { label: 'Total SKU Produk', value: `${products.length} produk`, sub: `${kritisItems.length} stok kritis`, icon: '📦', iconBg: 'rgba(249,115,22,0.15)', vc: '#f0f2f5' },
          { label: 'Penjualan Hari Ini', value: fmt(todaySales), sub: `${todayTx.length} transaksi hari ini`, icon: '💳', iconBg: 'rgba(34,197,94,0.15)', vc: '#22c55e' },
          { label: 'Total Transaksi', value: `${transactions.length}`, sub: 'Semua riwayat', icon: '📈', iconBg: 'rgba(59,130,246,0.15)', vc: '#f0f2f5' },
          { label: 'Stok Kritis', value: `${kritisItems.length} item`, sub: 'Perlu segera restok', icon: '⚠️', iconBg: 'rgba(245,158,11,0.15)', vc: kritisItems.length > 0 ? '#f59e0b' : '#22c55e' },
        ].map(c => (
          <div key={c.label} style={{ padding: '20px', borderRadius: '12px', border: '1px solid #2a2d3e', background: '#1e2130' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <span style={{ fontSize: '13px', color: '#8b92a5' }}>{c.label}</span>
              <div style={{ width: '36px', height: '36px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', background: c.iconBg }}>{c.icon}</div>
            </div>
            <div style={{ fontSize: '22px', fontWeight: 700, color: c.vc, marginBottom: '4px' }}>{c.value}</div>
            <div style={{ fontSize: '12px', color: '#5a6070' }}>{c.sub}</div>
          </div>
        ))}
      </div>

      {/* Row 2 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px', marginBottom: '20px' }}>
        {/* Arus Kas */}
        <div style={{ padding: '20px', borderRadius: '12px', border: '1px solid #2a2d3e', background: '#1e2130' }}>
          <div style={{ fontWeight: 700, color: '#f0f2f5', marginBottom: '14px' }}>Arus Kas</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '12px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', borderRadius: '8px', background: 'rgba(34,197,94,0.1)' }}>
              <span style={{ fontSize: '13px', color: '#f0f2f5', display: 'flex', alignItems: 'center', gap: '6px' }}><span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e', display: 'inline-block' }}></span>Total Masuk</span>
              <span style={{ fontWeight: 700, color: '#22c55e' }}>{fmt(totalMasuk)}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', borderRadius: '8px', background: 'rgba(239,68,68,0.1)' }}>
              <span style={{ fontSize: '13px', color: '#f0f2f5', display: 'flex', alignItems: 'center', gap: '6px' }}><span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444', display: 'inline-block' }}></span>Total Keluar</span>
              <span style={{ fontWeight: 700, color: '#ef4444' }}>{fmt(totalKeluar)}</span>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '10px', borderTop: '1px solid #2a2d3e' }}>
            <span style={{ fontWeight: 600, color: '#f0f2f5' }}>Saldo Bersih</span>
            <span style={{ fontWeight: 700, fontSize: '16px', color: saldo >= 0 ? '#f97316' : '#ef4444' }}>{fmt(saldo)}</span>
          </div>
        </div>

        {/* Piutang */}
        <div style={{ padding: '20px', borderRadius: '12px', border: '1px solid #2a2d3e', background: '#1e2130' }}>
          <div style={{ fontWeight: 700, color: '#f0f2f5', marginBottom: '6px' }}>Piutang Pelanggan</div>
          <div style={{ fontSize: '26px', fontWeight: 700, color: '#f59e0b', marginBottom: '4px' }}>{fmt(totalPiutang)}</div>
          <div style={{ fontSize: '12px', color: '#8b92a5', marginBottom: '12px' }}>Dari {customers.filter(c => c.piutang > 0).length} pelanggan</div>
          {customers.filter(c => c.piutang > 0).slice(0, 3).map(c => (
            <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}>
              <span style={{ color: '#8b92a5' }}>{c.name}</span>
              <span style={{ color: '#f59e0b', fontWeight: 600 }}>{fmt(c.piutang)}</span>
            </div>
          ))}
        </div>

        {/* Hutang */}
        <div style={{ padding: '20px', borderRadius: '12px', border: '1px solid #2a2d3e', background: '#1e2130' }}>
          <div style={{ fontWeight: 700, color: '#f0f2f5', marginBottom: '6px' }}>Hutang ke Pemasok</div>
          <div style={{ fontSize: '26px', fontWeight: 700, color: '#ef4444', marginBottom: '4px' }}>{fmt(totalHutang)}</div>
          <div style={{ fontSize: '12px', color: '#8b92a5', marginBottom: '12px' }}>Dari {suppliers.filter(s => s.hutang > 0).length} pemasok</div>
          {suppliers.filter(s => s.hutang > 0).slice(0, 3).map(s => (
            <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '4px' }}>
              <span style={{ color: '#8b92a5' }}>{s.name}</span>
              <span style={{ color: '#ef4444', fontWeight: 600 }}>{fmt(s.hutang)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Row 3 */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
        {/* Stok Kritis */}
        <div style={{ padding: '20px', borderRadius: '12px', border: '1px solid #2a2d3e', background: '#1e2130' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
            <span style={{ fontWeight: 700, color: '#f0f2f5' }}>⚠️ Stok Menipis / Habis</span>
            <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '9999px', fontWeight: 700, background: 'rgba(239,68,68,0.15)', color: '#ef4444' }}>{kritisItems.length} item</span>
          </div>
          {kritisItems.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '16px', color: '#22c55e', fontSize: '13px' }}>✓ Semua stok aman</div>
          ) : kritisItems.slice(0, 5).map(p => (
            <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '10px', marginBottom: '10px', borderBottom: '1px solid #2a2d3e' }}>
              <div>
                <div style={{ fontSize: '13px', fontWeight: 600, color: '#f0f2f5' }}>{p.name}</div>
                <div style={{ fontSize: '11px', color: '#5a6070' }}>{p.id} · Min: {p.min}</div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <span style={{ fontSize: '11px', padding: '2px 6px', borderRadius: '4px', fontWeight: 700, display: 'block', marginBottom: '2px', background: p.stock === 0 ? 'rgba(239,68,68,0.15)' : 'rgba(245,158,11,0.15)', color: p.stock === 0 ? '#ef4444' : '#f59e0b' }}>
                  {p.stock === 0 ? 'HABIS' : 'MENIPIS'}
                </span>
                <span style={{ fontSize: '13px', fontWeight: 700, color: p.stock === 0 ? '#ef4444' : '#f59e0b' }}>{p.stock} pcs</span>
              </div>
            </div>
          ))}
        </div>

        {/* Transaksi Terkini */}
        <div style={{ padding: '20px', borderRadius: '12px', border: '1px solid #2a2d3e', background: '#1e2130' }}>
          <div style={{ fontWeight: 700, color: '#f0f2f5', marginBottom: '14px' }}>Transaksi Terkini</div>
          {transactions.slice(0, 5).map(t => (
            <div key={t.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '10px', marginBottom: '10px', borderBottom: '1px solid #2a2d3e' }}>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e', flexShrink: 0 }}></div>
                <div>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#f0f2f5' }}>{t.customer}</div>
                  <div style={{ fontSize: '11px', color: '#5a6070' }}>{t.id} · {t.time}</div>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '14px', fontWeight: 700, color: '#f0f2f5' }}>{fmt(t.total)}</div>
                <span style={{ fontSize: '10px', padding: '1px 6px', borderRadius: '4px', fontWeight: 700, background: t.isPiutang ? 'rgba(245,158,11,0.15)' : 'rgba(34,197,94,0.15)', color: t.isPiutang ? '#f59e0b' : '#22c55e' }}>
                  {t.isPiutang ? 'Piutang' : t.payMethod}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

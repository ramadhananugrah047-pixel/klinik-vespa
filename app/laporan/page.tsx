'use client';
import { useState } from 'react';

const fmt = (n: number) => 'Rp ' + n.toLocaleString('id-ID');

const salesData = [
  { month: 'Jan', penjualan: 8500000, pembelian: 5200000 },
  { month: 'Feb', penjualan: 7200000, pembelian: 4100000 },
  { month: 'Mar', penjualan: 9100000, pembelian: 6300000 },
  { month: 'Apr', penjualan: 11200000, pembelian: 7400000 },
  { month: 'Mei', penjualan: 9800000, pembelian: 5900000 },
  { month: 'Jun', penjualan: 12400000, pembelian: 8100000 },
];

const topProducts = [
  { name: 'Kampas Rem Depan', sold: 48, revenue: 5760000 },
  { name: 'Oli Agip 4T 1L', sold: 36, revenue: 3240000 },
  { name: 'Ban Dalam 275-17', sold: 29, revenue: 1885000 },
  { name: 'Busi NGK CR7HSA', sold: 24, revenue: 1320000 },
  { name: 'Filter Udara', sold: 20, revenue: 1300000 },
];

type Tab = 'penjualan' | 'keuangan' | 'stok';

export default function LaporanPage() {
  const [tab, setTab] = useState<Tab>('penjualan');
  const [period, setPeriod] = useState('Jun 2026');

  const maxVal = Math.max(...salesData.map(d => d.penjualan));

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#f0f2f5', margin: 0 }}>Laporan</h1>
          <p style={{ fontSize: '13px', color: '#8b92a5', marginTop: '4px' }}>Ringkasan performa toko Klinik Vespa</p>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <select value={period} onChange={e => setPeriod(e.target.value)}
            style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #2a2d3e', background: '#1e2130', color: '#f0f2f5', fontSize: '13px', outline: 'none' }}>
            {['Jun 2026', 'Mei 2026', 'Apr 2026', 'Mar 2026'].map(p => <option key={p}>{p}</option>)}
          </select>
          <button style={{ padding: '8px 16px', borderRadius: '8px', background: '#f97316', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '13px' }}>
            Export PDF
          </button>
        </div>
      </div>

      {/* KPI */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '24px' }}>
        {[
          { label: 'Total Penjualan', value: fmt(12400000), sub: '↑ 26% vs bulan lalu', color: '#22c55e' },
          { label: 'Total Pembelian', value: fmt(8100000), sub: 'Belanja stok', color: '#3b82f6' },
          { label: 'Keuntungan Bersih', value: fmt(4300000), sub: 'Margin 34.6%', color: '#f97316' },
          { label: 'Total Transaksi', value: '68', sub: 'Jual + beli', color: '#f0f2f5' },
        ].map(k => (
          <div key={k.label} style={{ padding: '20px', borderRadius: '12px', border: '1px solid #2a2d3e', background: '#1e2130' }}>
            <div style={{ fontSize: '12px', color: '#8b92a5', marginBottom: '8px' }}>{k.label}</div>
            <div style={{ fontSize: '22px', fontWeight: 700, color: k.color, marginBottom: '4px' }}>{k.value}</div>
            <div style={{ fontSize: '11px', color: '#5a6070' }}>{k.sub}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '4px', marginBottom: '20px', borderBottom: '1px solid #2a2d3e' }}>
        {[['penjualan', 'Laporan Penjualan'], ['keuangan', 'Arus Keuangan'], ['stok', 'Laporan Stok']].map(([key, label]) => (
          <button key={key} onClick={() => setTab(key as Tab)}
            style={{ padding: '10px 20px', background: 'none', border: 'none', cursor: 'pointer', fontSize: '14px', fontWeight: 600, color: tab === key ? '#f97316' : '#8b92a5', borderBottom: tab === key ? '2px solid #f97316' : '2px solid transparent', marginBottom: '-1px' }}>
            {label}
          </button>
        ))}
      </div>

      {tab === 'penjualan' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          {/* Bar chart */}
          <div style={{ padding: '20px', borderRadius: '12px', border: '1px solid #2a2d3e', background: '#1e2130' }}>
            <div style={{ fontWeight: 700, color: '#f0f2f5', marginBottom: '16px' }}>Penjualan vs Pembelian (6 Bulan)</div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '8px', height: '160px' }}>
              {salesData.map(d => (
                <div key={d.month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                  <div style={{ width: '100%', display: 'flex', gap: '2px', alignItems: 'flex-end', height: '130px' }}>
                    <div style={{ flex: 1, background: '#22c55e', borderRadius: '3px 3px 0 0', height: `${(d.penjualan / maxVal) * 100}%`, minHeight: '4px' }}></div>
                    <div style={{ flex: 1, background: '#3b82f6', borderRadius: '3px 3px 0 0', height: `${(d.pembelian / maxVal) * 100}%`, minHeight: '4px' }}></div>
                  </div>
                  <div style={{ fontSize: '10px', color: '#5a6070' }}>{d.month}</div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '16px', marginTop: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#8b92a5' }}><div style={{ width: '10px', height: '10px', background: '#22c55e', borderRadius: '2px' }}></div>Penjualan</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: '#8b92a5' }}><div style={{ width: '10px', height: '10px', background: '#3b82f6', borderRadius: '2px' }}></div>Pembelian</div>
            </div>
          </div>

          {/* Top products */}
          <div style={{ padding: '20px', borderRadius: '12px', border: '1px solid #2a2d3e', background: '#1e2130' }}>
            <div style={{ fontWeight: 700, color: '#f0f2f5', marginBottom: '16px' }}>Produk Terlaris Bulan Ini</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {topProducts.map((p, i) => {
                const pct = Math.round((p.sold / topProducts[0].sold) * 100);
                return (
                  <div key={p.name}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontSize: '12px', fontWeight: 700, color: '#f97316', width: '16px' }}>#{i + 1}</span>
                        <span style={{ fontSize: '13px', color: '#f0f2f5' }}>{p.name}</span>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ fontSize: '12px', fontWeight: 700, color: '#22c55e' }}>{fmt(p.revenue)}</div>
                        <div style={{ fontSize: '11px', color: '#5a6070' }}>{p.sold} pcs</div>
                      </div>
                    </div>
                    <div style={{ height: '4px', background: '#2a2d3e', borderRadius: '2px' }}>
                      <div style={{ height: '100%', width: `${pct}%`, background: '#f97316', borderRadius: '2px' }}></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {tab === 'keuangan' && (
        <div style={{ padding: '20px', borderRadius: '12px', border: '1px solid #2a2d3e', background: '#1e2130' }}>
          <div style={{ fontWeight: 700, color: '#f0f2f5', marginBottom: '16px' }}>Ringkasan Keuangan - {period}</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 600, color: '#22c55e', marginBottom: '12px' }}>Pemasukan</div>
              {[{ label: 'Penjualan Sparepart', amount: 9800000 }, { label: 'Jasa Servis', amount: 2100000 }, { label: 'Piutang Diterima', amount: 500000 }].map(r => (
                <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #2a2d3e', fontSize: '13px' }}>
                  <span style={{ color: '#8b92a5' }}>{r.label}</span>
                  <span style={{ color: '#22c55e', fontWeight: 600 }}>{fmt(r.amount)}</span>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', fontSize: '14px', fontWeight: 700 }}>
                <span style={{ color: '#f0f2f5' }}>Total Pemasukan</span>
                <span style={{ color: '#22c55e' }}>{fmt(12400000)}</span>
              </div>
            </div>
            <div>
              <div style={{ fontSize: '14px', fontWeight: 600, color: '#ef4444', marginBottom: '12px' }}>Pengeluaran</div>
              {[{ label: 'Pembelian Stok', amount: 6800000 }, { label: 'Gaji Karyawan', amount: 3000000 }, { label: 'Operasional', amount: 800000 }, { label: 'Hutang Dibayar', amount: 1500000 }].map(r => (
                <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #2a2d3e', fontSize: '13px' }}>
                  <span style={{ color: '#8b92a5' }}>{r.label}</span>
                  <span style={{ color: '#ef4444', fontWeight: 600 }}>{fmt(r.amount)}</span>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', fontSize: '14px', fontWeight: 700 }}>
                <span style={{ color: '#f0f2f5' }}>Total Pengeluaran</span>
                <span style={{ color: '#ef4444' }}>{fmt(12100000)}</span>
              </div>
            </div>
          </div>
          <div style={{ marginTop: '16px', padding: '16px', borderRadius: '8px', background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '16px', fontWeight: 700, color: '#f0f2f5' }}>Laba Bersih</span>
            <span style={{ fontSize: '24px', fontWeight: 700, color: '#f97316' }}>{fmt(300000)}</span>
          </div>
        </div>
      )}

      {tab === 'stok' && (
        <div style={{ padding: '20px', borderRadius: '12px', border: '1px solid #2a2d3e', background: '#1e2130' }}>
          <div style={{ fontWeight: 700, color: '#f0f2f5', marginBottom: '16px' }}>Status Stok Saat Ini</div>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid #2a2d3e' }}>
                {['Produk', 'Stok', 'Nilai Stok', 'Status'].map(h => (
                  <th key={h} style={{ padding: '10px 0', textAlign: 'left', fontSize: '12px', color: '#8b92a5', fontWeight: 600 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { name: 'Kampas Rem Depan', stock: 24, val: 2040000, status: 'AMAN' },
                { name: 'Oli Agip 4T 1L', stock: 3, val: 195000, status: 'MENIPIS' },
                { name: 'Ban Dalam 275-17', stock: 18, val: 810000, status: 'AMAN' },
                { name: 'Busi NGK CR7HSA', stock: 2, val: 70000, status: 'MENIPIS' },
                { name: 'Filter Udara', stock: 12, val: 480000, status: 'AMAN' },
                { name: 'Bearing Roda Depan', stock: 0, val: 0, status: 'HABIS' },
              ].map((p, i) => (
                <tr key={p.name} style={{ borderBottom: '1px solid #2a2d3e' }}>
                  <td style={{ padding: '10px 0', fontSize: '13px', color: '#f0f2f5' }}>{p.name}</td>
                  <td style={{ padding: '10px 0', fontSize: '13px', fontWeight: 700, color: p.stock === 0 ? '#ef4444' : p.stock <= 5 ? '#f59e0b' : '#f0f2f5' }}>{p.stock} pcs</td>
                  <td style={{ padding: '10px 0', fontSize: '13px', color: '#8b92a5' }}>{fmt(p.val)}</td>
                  <td style={{ padding: '10px 0' }}>
                    <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '4px', fontWeight: 700, background: p.status === 'AMAN' ? 'rgba(34,197,94,0.15)' : p.status === 'MENIPIS' ? 'rgba(245,158,11,0.15)' : 'rgba(239,68,68,0.15)', color: p.status === 'AMAN' ? '#22c55e' : p.status === 'MENIPIS' ? '#f59e0b' : '#ef4444' }}>
                      {p.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

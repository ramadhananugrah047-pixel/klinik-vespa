'use client';
import { useState } from 'react';

const fmt = (n: number) => 'Rp ' + n.toLocaleString('id-ID');

const initHistory = [
  { id: 'SM-001', date: '27 Jun 2026', supplier: 'PT Piaggio Dist.', product: 'Kampas Rem Depan', qty: 50, price: 85000, total: 4250000, status: 'Lunas' },
  { id: 'SM-002', date: '25 Jun 2026', supplier: 'UD Vespa Jaya', product: 'Oli Agip 4T 1L', qty: 24, price: 65000, total: 1560000, status: 'Hutang' },
  { id: 'SM-003', date: '22 Jun 2026', supplier: 'CV Motor Parts', product: 'Busi NGK CR7HSA', qty: 30, price: 35000, total: 1050000, status: 'Lunas' },
  { id: 'SM-004', date: '20 Jun 2026', supplier: 'PT Piaggio Dist.', product: 'Ban Dalam 275-17', qty: 20, price: 45000, total: 900000, status: 'Hutang' },
  { id: 'SM-005', date: '18 Jun 2026', supplier: 'UD Vespa Jaya', product: 'Filter Udara', qty: 15, price: 40000, total: 600000, status: 'Lunas' },
];

const suppliers = ['PT Piaggio Dist.', 'UD Vespa Jaya', 'CV Motor Parts', 'Toko Sparepart Sentani'];
const products = ['Kampas Rem Depan', 'Kampas Rem Belakang', 'Oli Agip 4T 1L', 'Ban Dalam 275-17', 'Busi NGK CR7HSA', 'Filter Udara', 'Rantai 428H', 'Minyak Rem DOT4'];

export default function StokMasukPage() {
  const [history, setHistory] = useState(initHistory);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ supplier: '', product: '', qty: '', price: '', status: 'Lunas', notes: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const qty = parseInt(form.qty);
    const price = parseInt(form.price);
    const newItem = {
      id: `SM-${String(history.length + 1).padStart(3, '0')}`,
      date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
      supplier: form.supplier,
      product: form.product,
      qty,
      price,
      total: qty * price,
      status: form.status,
    };
    setHistory([newItem, ...history]);
    setForm({ supplier: '', product: '', qty: '', price: '', status: 'Lunas', notes: '' });
    setShowForm(false);
  };

  const totalMasuk = history.reduce((s, h) => s + h.total, 0);
  const totalHutang = history.filter(h => h.status === 'Hutang').reduce((s, h) => s + h.total, 0);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#f0f2f5', margin: 0 }}>Stok Masuk</h1>
          <p style={{ fontSize: '13px', color: '#8b92a5', marginTop: '4px' }}>Pencatatan penerimaan stok dari pemasok</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} style={{ padding: '8px 16px', borderRadius: '8px', background: '#f97316', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '14px' }}>
          + Catat Stok Masuk
        </button>
      </div>

      {/* Summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
        {[
          { label: 'Total Pembelian Bulan Ini', value: fmt(totalMasuk), color: '#f0f2f5', icon: '📥' },
          { label: 'Hutang Belum Lunas', value: fmt(totalHutang), color: '#ef4444', icon: '⚠️' },
          { label: 'Jumlah Transaksi', value: `${history.length} kali`, color: '#3b82f6', icon: '📋' },
        ].map(c => (
          <div key={c.label} style={{ padding: '20px', borderRadius: '12px', border: '1px solid #2a2d3e', background: '#1e2130' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <span style={{ fontSize: '13px', color: '#8b92a5' }}>{c.label}</span>
              <span style={{ fontSize: '20px' }}>{c.icon}</span>
            </div>
            <div style={{ fontSize: '22px', fontWeight: 700, color: c.color }}>{c.value}</div>
          </div>
        ))}
      </div>

      {showForm && (
        <div style={{ padding: '20px', borderRadius: '12px', border: '1px solid #2a2d3e', background: '#1e2130', marginBottom: '20px' }}>
          <h2 style={{ color: '#f0f2f5', fontWeight: 700, marginBottom: '16px', marginTop: 0 }}>Form Stok Masuk</h2>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '12px' }}>
              <div>
                <label style={{ fontSize: '12px', color: '#8b92a5', display: 'block', marginBottom: '4px' }}>Pemasok</label>
                <select required value={form.supplier} onChange={e => setForm({ ...form, supplier: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #2a2d3e', background: '#0f1117', color: '#f0f2f5', fontSize: '13px', outline: 'none' }}>
                  <option value="">Pilih Pemasok</option>
                  {suppliers.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: '12px', color: '#8b92a5', display: 'block', marginBottom: '4px' }}>Produk</label>
                <select required value={form.product} onChange={e => setForm({ ...form, product: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #2a2d3e', background: '#0f1117', color: '#f0f2f5', fontSize: '13px', outline: 'none' }}>
                  <option value="">Pilih Produk</option>
                  {products.map(p => <option key={p}>{p}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: '12px', color: '#8b92a5', display: 'block', marginBottom: '4px' }}>Status Bayar</label>
                <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #2a2d3e', background: '#0f1117', color: '#f0f2f5', fontSize: '13px', outline: 'none' }}>
                  <option>Lunas</option>
                  <option>Hutang</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: '12px', color: '#8b92a5', display: 'block', marginBottom: '4px' }}>Jumlah (pcs)</label>
                <input required type="number" min="1" value={form.qty} onChange={e => setForm({ ...form, qty: e.target.value })} placeholder="0"
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #2a2d3e', background: '#0f1117', color: '#f0f2f5', fontSize: '13px', outline: 'none' }} />
              </div>
              <div>
                <label style={{ fontSize: '12px', color: '#8b92a5', display: 'block', marginBottom: '4px' }}>Harga Beli / pcs</label>
                <input required type="number" min="0" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} placeholder="0"
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #2a2d3e', background: '#0f1117', color: '#f0f2f5', fontSize: '13px', outline: 'none' }} />
              </div>
              <div>
                <label style={{ fontSize: '12px', color: '#8b92a5', display: 'block', marginBottom: '4px' }}>Total</label>
                <div style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #2a2d3e', background: '#0f1117', color: '#22c55e', fontSize: '13px', fontWeight: 700 }}>
                  {form.qty && form.price ? fmt(parseInt(form.qty || '0') * parseInt(form.price || '0')) : 'Rp 0'}
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button type="submit" style={{ padding: '8px 20px', borderRadius: '8px', background: '#f97316', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Simpan</button>
              <button type="button" onClick={() => setShowForm(false)} style={{ padding: '8px 20px', borderRadius: '8px', background: '#2a2d3e', color: '#8b92a5', border: 'none', cursor: 'pointer' }}>Batal</button>
            </div>
          </form>
        </div>
      )}

      <div style={{ borderRadius: '12px', border: '1px solid #2a2d3e', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ background: '#1a1d27' }}>
            <tr>
              {['No', 'Tanggal', 'Pemasok', 'Produk', 'Qty', 'Harga/pcs', 'Total', 'Status'].map(h => (
                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: '#8b92a5' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {history.map((h, i) => (
              <tr key={h.id} style={{ background: i % 2 === 0 ? '#1e2130' : '#1a1d27', borderBottom: '1px solid #2a2d3e' }}>
                <td style={{ padding: '12px 16px', fontSize: '12px', color: '#f97316', fontFamily: 'monospace' }}>{h.id}</td>
                <td style={{ padding: '12px 16px', fontSize: '13px', color: '#8b92a5' }}>{h.date}</td>
                <td style={{ padding: '12px 16px', fontSize: '13px', color: '#f0f2f5' }}>{h.supplier}</td>
                <td style={{ padding: '12px 16px', fontSize: '13px', fontWeight: 600, color: '#f0f2f5' }}>{h.product}</td>
                <td style={{ padding: '12px 16px', fontSize: '13px', color: '#3b82f6', fontWeight: 700 }}>{h.qty} pcs</td>
                <td style={{ padding: '12px 16px', fontSize: '13px', color: '#8b92a5' }}>{fmt(h.price)}</td>
                <td style={{ padding: '12px 16px', fontSize: '13px', fontWeight: 700, color: '#f0f2f5' }}>{fmt(h.total)}</td>
                <td style={{ padding: '12px 16px' }}>
                  <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '4px', fontWeight: 700, background: h.status === 'Lunas' ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)', color: h.status === 'Lunas' ? '#22c55e' : '#ef4444' }}>
                    {h.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

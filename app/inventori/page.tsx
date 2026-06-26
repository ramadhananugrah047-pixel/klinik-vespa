'use client';
import { useState } from 'react';

const fmt = (n: number) => 'Rp ' + n.toLocaleString('id-ID');

const products = [
  { id: 'VS-001', name: 'Kampas Rem Depan', category: 'Rem', stock: 24, min: 10, buy: 85000, sell: 120000 },
  { id: 'VS-002', name: 'Oli Agip 4T 1 Liter', category: 'Oli', stock: 3, min: 10, buy: 65000, sell: 90000 },
  { id: 'VS-003', name: 'Ban Dalam 275-17', category: 'Ban', stock: 18, min: 5, buy: 45000, sell: 65000 },
  { id: 'VS-004', name: 'Kampas Rem Belakang', category: 'Rem', stock: 30, min: 10, buy: 75000, sell: 110000 },
  { id: 'VS-005', name: 'Busi NGK CR7HSA', category: 'Elektrikal', stock: 2, min: 10, buy: 35000, sell: 55000 },
  { id: 'VS-006', name: 'Filter Udara', category: 'Filter', stock: 12, min: 5, buy: 40000, sell: 65000 },
  { id: 'VS-007', name: 'Rantai Motor 428H', category: 'Transmisi', stock: 8, min: 5, buy: 95000, sell: 145000 },
  { id: 'VS-008', name: 'Minyak Rem DOT4', category: 'Rem', stock: 15, min: 8, buy: 28000, sell: 45000 },
  { id: 'VS-009', name: 'Bearing Roda Depan', category: 'Bearing', stock: 0, min: 5, buy: 55000, sell: 85000 },
];

const categories = ['Semua', 'Rem', 'Oli', 'Ban', 'Elektrikal', 'Filter', 'Transmisi', 'Bearing'];

export default function InventoriPage() {
  const [search, setSearch] = useState('');
  const [cat, setCat] = useState('Semua');
  const [showForm, setShowForm] = useState(false);
  const [items, setItems] = useState(products);
  const [form, setForm] = useState({ name: '', category: '', id: '', stock: '', min: '', buy: '', sell: '' });

  const filtered = items.filter(p =>
    (cat === 'Semua' || p.category === cat) &&
    (p.name.toLowerCase().includes(search.toLowerCase()) || p.id.toLowerCase().includes(search.toLowerCase()))
  );

  const stockStatus = (p: typeof products[0]) => {
    if (p.stock === 0) return { label: 'HABIS', color: '#ef4444', bg: 'rgba(239,68,68,0.15)' };
    if (p.stock <= p.min) return { label: 'MENIPIS', color: '#f59e0b', bg: 'rgba(245,158,11,0.15)' };
    return { label: 'AMAN', color: '#22c55e', bg: 'rgba(34,197,94,0.15)' };
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    setItems([...items, { ...form, stock: +form.stock, min: +form.min, buy: +form.buy, sell: +form.sell }]);
    setForm({ name: '', category: '', id: '', stock: '', min: '', buy: '', sell: '' });
    setShowForm(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: '#f0f2f5' }}>Inventori</h1>
          <p className="text-sm mt-0.5" style={{ color: '#8b92a5' }}>{items.length} produk terdaftar</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="px-4 py-2 rounded-lg font-semibold text-sm" style={{ background: '#f97316', color: '#fff' }}>
          + Tambah Produk
        </button>
      </div>

      {showForm && (
        <div className="rounded-xl p-5 border mb-6" style={{ background: '#1e2130', borderColor: '#2a2d3e' }}>
          <h2 className="font-bold mb-4" style={{ color: '#f0f2f5' }}>Form Tambah Produk</h2>
          <form onSubmit={handleAdd} className="grid grid-cols-4 gap-3">
            {[['Nama Produk', 'name'], ['Kategori', 'category'], ['SKU / Kode', 'id'], ['Stok Awal', 'stock'], ['Stok Minimum', 'min'], ['Harga Beli', 'buy'], ['Harga Jual', 'sell']].map(([label, key]) => (
              <div key={key}>
                <label className="text-xs mb-1 block" style={{ color: '#8b92a5' }}>{label}</label>
                <input required value={(form as any)[key]} onChange={e => setForm({ ...form, [key]: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg text-sm border outline-none"
                  style={{ background: '#0f1117', borderColor: '#2a2d3e', color: '#f0f2f5' }} />
              </div>
            ))}
            <div className="flex items-end gap-2">
              <button type="submit" className="flex-1 py-2 rounded-lg text-sm font-semibold" style={{ background: '#f97316', color: '#fff' }}>Simpan</button>
              <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-2 rounded-lg text-sm" style={{ background: '#2a2d3e', color: '#8b92a5' }}>Batal</button>
            </div>
          </form>
        </div>
      )}

      <div className="flex gap-3 mb-4">
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari produk atau SKU..."
          className="flex-1 px-4 py-2 rounded-lg text-sm border outline-none"
          style={{ background: '#1e2130', borderColor: '#2a2d3e', color: '#f0f2f5' }} />
        <div className="flex gap-1 flex-wrap">
          {categories.map(c => (
            <button key={c} onClick={() => setCat(c)} className="px-3 py-2 rounded-lg text-xs font-semibold"
              style={{ background: cat === c ? '#f97316' : '#1e2130', color: cat === c ? '#fff' : '#8b92a5', border: '1px solid #2a2d3e' }}>
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-xl border overflow-hidden" style={{ borderColor: '#2a2d3e' }}>
        <table className="w-full">
          <thead style={{ background: '#1a1d27' }}>
            <tr>
              {['SKU', 'Nama Produk', 'Kategori', 'Stok', 'Min', 'Harga Beli', 'Harga Jual', 'Margin', 'Status'].map(h => (
                <th key={h} className="px-4 py-3 text-left text-xs font-semibold" style={{ color: '#8b92a5' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((p, i) => {
              const s = stockStatus(p);
              const margin = Math.round(((p.sell - p.buy) / p.sell) * 100);
              return (
                <tr key={p.id} style={{ background: i % 2 === 0 ? '#1e2130' : '#1a1d27', borderBottom: '1px solid #2a2d3e' }}>
                  <td className="px-4 py-3 text-xs font-mono" style={{ color: '#f97316' }}>{p.id}</td>
                  <td className="px-4 py-3 text-sm font-semibold" style={{ color: '#f0f2f5' }}>{p.name}</td>
                  <td className="px-4 py-3 text-xs" style={{ color: '#8b92a5' }}>{p.category}</td>
                  <td className="px-4 py-3 text-sm font-bold" style={{ color: s.color }}>{p.stock}</td>
                  <td className="px-4 py-3 text-xs" style={{ color: '#5a6070' }}>{p.min}</td>
                  <td className="px-4 py-3 text-sm" style={{ color: '#8b92a5' }}>{fmt(p.buy)}</td>
                  <td className="px-4 py-3 text-sm font-semibold" style={{ color: '#f0f2f5' }}>{fmt(p.sell)}</td>
                  <td className="px-4 py-3 text-xs font-bold" style={{ color: '#22c55e' }}>{margin}%</td>
                  <td className="px-4 py-3">
                    <span className="text-xs px-2 py-0.5 rounded font-bold" style={{ background: s.bg, color: s.color }}>{s.label}</span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

'use client';
import { useState, useRef } from 'react';

const fmt = (n: number) => 'Rp ' + n.toLocaleString('id-ID');

const defaultCategories = ['Rem', 'Oli', 'Ban', 'Elektrikal', 'Filter', 'Transmisi', 'Bearing', 'Body', 'Kelistrikan'];

const initProducts = [
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

type Product = typeof initProducts[0];
type ModalMode = 'add' | 'edit' | null;

const emptyForm = { id: '', name: '', category: '', stock: '', min: '', buy: '', sell: '', img: '' };

export default function InventoriPage() {
  const [products, setProducts] = useState(initProducts);
  const [categories, setCategories] = useState(defaultCategories);
  const [search, setSearch] = useState('');
  const [catFilter, setCatFilter] = useState('Semua');
  const [modal, setModal] = useState<ModalMode>(null);
  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState('');
  const [showCatMgr, setShowCatMgr] = useState(false);
  const [newCat, setNewCat] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState('');
  const imgRef = useRef<HTMLInputElement>(null);
  const camRef = useRef<HTMLInputElement>(null);

  const filtered = products.filter(p =>
    (catFilter === 'Semua' || p.category === catFilter) &&
    (p.name.toLowerCase().includes(search.toLowerCase()) || p.id.toLowerCase().includes(search.toLowerCase()))
  );

  const stockStatus = (p: Product) => {
    if (p.stock === 0) return { label: 'HABIS', color: '#ef4444', bg: 'rgba(239,68,68,0.15)' };
    if (p.stock <= p.min) return { label: 'MENIPIS', color: '#f59e0b', bg: 'rgba(245,158,11,0.15)' };
    return { label: 'AMAN', color: '#22c55e', bg: 'rgba(34,197,94,0.15)' };
  };

  const openAdd = () => {
    setForm(emptyForm);
    setModal('add');
  };

  const openEdit = (p: Product) => {
    setForm({ id: p.id, name: p.name, category: p.category, stock: String(p.stock), min: String(p.min), buy: String(p.buy), sell: String(p.sell), img: p.img });
    setEditId(p.id);
    setModal('edit');
  };

  const handleImg = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => setForm(f => ({ ...f, img: ev.target?.result as string }));
    reader.readAsDataURL(file);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const product = { id: form.id, name: form.name, category: form.category, stock: +form.stock, min: +form.min, buy: +form.buy, sell: +form.sell, img: form.img };
    if (modal === 'add') {
      setProducts([product, ...products]);
    } else {
      setProducts(products.map(p => p.id === editId ? product : p));
    }
    setModal(null);
  };

  const handleDelete = (id: string) => {
    setProducts(products.filter(p => p.id !== id));
    setDeleteConfirm('');
    setModal(null);
  };

  const handleAddCat = (e: React.FormEvent) => {
    e.preventDefault();
    if (newCat.trim() && !categories.includes(newCat.trim())) {
      setCategories([...categories, newCat.trim()]);
      setNewCat('');
    }
  };

  const inputStyle = { width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #2a2d3e', background: '#0f1117', color: '#f0f2f5', fontSize: '13px', outline: 'none', boxSizing: 'border-box' as const };

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#f0f2f5', margin: 0 }}>Inventori</h1>
          <p style={{ fontSize: '13px', color: '#8b92a5', marginTop: '4px' }}>{products.length} produk terdaftar</p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={() => setShowCatMgr(true)} style={{ padding: '8px 14px', borderRadius: '8px', background: '#2a2d3e', color: '#8b92a5', border: '1px solid #3a3d4e', cursor: 'pointer', fontSize: '13px' }}>
            🏷️ Kelola Kategori
          </button>
          <button onClick={openAdd} style={{ padding: '8px 16px', borderRadius: '8px', background: '#f97316', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '13px' }}>
            + Tambah Produk
          </button>
        </div>
      </div>

      {/* Search + Filter */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '16px', flexWrap: 'wrap' }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari produk atau SKU..."
          style={{ flex: 1, minWidth: '200px', padding: '8px 14px', borderRadius: '8px', border: '1px solid #2a2d3e', background: '#1e2130', color: '#f0f2f5', fontSize: '13px', outline: 'none' }} />
        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
          {['Semua', ...categories].map(c => (
            <button key={c} onClick={() => setCatFilter(c)}
              style={{ padding: '6px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 600, border: '1px solid #2a2d3e', cursor: 'pointer', background: catFilter === c ? '#f97316' : '#1e2130', color: catFilter === c ? '#fff' : '#8b92a5' }}>
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div style={{ borderRadius: '12px', border: '1px solid #2a2d3e', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ background: '#1a1d27' }}>
            <tr>
              {['Foto', 'SKU', 'Nama Produk', 'Kategori', 'Stok', 'Min', 'Harga Beli', 'Harga Jual', 'Margin', 'Status', 'Aksi'].map(h => (
                <th key={h} style={{ padding: '11px 14px', textAlign: 'left', fontSize: '11px', fontWeight: 600, color: '#8b92a5' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((p, i) => {
              const s = stockStatus(p);
              const margin = Math.round(((p.sell - p.buy) / p.sell) * 100);
              return (
                <tr key={p.id} style={{ background: i % 2 === 0 ? '#1e2130' : '#1a1d27', borderBottom: '1px solid #2a2d3e' }}>
                  <td style={{ padding: '10px 14px' }}>
                    {p.img ? <img src={p.img} alt={p.name} style={{ width: '36px', height: '36px', borderRadius: '6px', objectFit: 'cover' }} />
                      : <div style={{ width: '36px', height: '36px', borderRadius: '6px', background: '#2a2d3e', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>📦</div>}
                  </td>
                  <td style={{ padding: '10px 14px', fontSize: '11px', fontFamily: 'monospace', color: '#f97316' }}>{p.id}</td>
                  <td style={{ padding: '10px 14px', fontSize: '13px', fontWeight: 600, color: '#f0f2f5' }}>{p.name}</td>
                  <td style={{ padding: '10px 14px', fontSize: '12px', color: '#8b92a5' }}>{p.category}</td>
                  <td style={{ padding: '10px 14px', fontSize: '14px', fontWeight: 700, color: s.color }}>{p.stock}</td>
                  <td style={{ padding: '10px 14px', fontSize: '12px', color: '#5a6070' }}>{p.min}</td>
                  <td style={{ padding: '10px 14px', fontSize: '12px', color: '#8b92a5' }}>{fmt(p.buy)}</td>
                  <td style={{ padding: '10px 14px', fontSize: '13px', fontWeight: 600, color: '#f0f2f5' }}>{fmt(p.sell)}</td>
                  <td style={{ padding: '10px 14px', fontSize: '12px', fontWeight: 700, color: '#22c55e' }}>{margin}%</td>
                  <td style={{ padding: '10px 14px' }}>
                    <span style={{ fontSize: '11px', padding: '2px 7px', borderRadius: '4px', fontWeight: 700, background: s.bg, color: s.color }}>{s.label}</span>
                  </td>
                  <td style={{ padding: '10px 14px' }}>
                    <button onClick={() => openEdit(p)} style={{ padding: '4px 10px', borderRadius: '6px', background: 'rgba(59,130,246,0.15)', color: '#3b82f6', border: '1px solid rgba(59,130,246,0.3)', cursor: 'pointer', fontSize: '11px', fontWeight: 600 }}>
                      Edit
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Modal */}
      {modal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ background: '#1e2130', borderRadius: '16px', padding: '24px', width: '580px', maxHeight: '90vh', overflowY: 'auto', border: '1px solid #2a2d3e' }}>
            <h2 style={{ color: '#f0f2f5', fontWeight: 700, margin: '0 0 20px', fontSize: '18px' }}>
              {modal === 'add' ? '+ Tambah Produk Baru' : '✏️ Edit Produk'}
            </h2>
            <form onSubmit={handleSave}>
              {/* Image Upload */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '12px', color: '#8b92a5', display: 'block', marginBottom: '8px' }}>Foto Produk</label>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                  <div style={{ width: '80px', height: '80px', borderRadius: '10px', border: '2px dashed #2a2d3e', background: '#0f1117', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
                    {form.img ? <img src={form.img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      : <span style={{ fontSize: '24px' }}>📷</span>}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <button type="button" onClick={() => imgRef.current?.click()} style={{ padding: '6px 14px', borderRadius: '8px', background: '#2a2d3e', color: '#f0f2f5', border: 'none', cursor: 'pointer', fontSize: '12px', textAlign: 'left' }}>
                      🖼️ Pilih dari Galeri
                    </button>
                    <button type="button" onClick={() => camRef.current?.click()} style={{ padding: '6px 14px', borderRadius: '8px', background: '#2a2d3e', color: '#f0f2f5', border: 'none', cursor: 'pointer', fontSize: '12px', textAlign: 'left' }}>
                      📸 Ambil Foto Kamera
                    </button>
                    <input ref={imgRef} type="file" accept="image/*" onChange={handleImg} style={{ display: 'none' }} />
                    <input ref={camRef} type="file" accept="image/*" capture="environment" onChange={handleImg} style={{ display: 'none' }} />
                    {form.img && <button type="button" onClick={() => setForm(f => ({ ...f, img: '' }))} style={{ padding: '4px 10px', borderRadius: '6px', background: 'rgba(239,68,68,0.15)', color: '#ef4444', border: 'none', cursor: 'pointer', fontSize: '11px' }}>Hapus Foto</button>}
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                <div>
                  <label style={{ fontSize: '12px', color: '#8b92a5', display: 'block', marginBottom: '4px' }}>Nama Produk *</label>
                  <input required value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Nama produk" style={inputStyle} />
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: '#8b92a5', display: 'block', marginBottom: '4px' }}>SKU / Kode *</label>
                  <input required value={form.id} onChange={e => setForm(f => ({ ...f, id: e.target.value }))} placeholder="Contoh: VS-010" style={inputStyle} />
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: '#8b92a5', display: 'block', marginBottom: '4px' }}>Kategori *</label>
                  <select required value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} style={{ ...inputStyle }}>
                    <option value="">Pilih Kategori</option>
                    {categories.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: '#8b92a5', display: 'block', marginBottom: '4px' }}>Stok Awal</label>
                  <input type="number" min="0" value={form.stock} onChange={e => setForm(f => ({ ...f, stock: e.target.value }))} placeholder="0" style={inputStyle} />
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: '#8b92a5', display: 'block', marginBottom: '4px' }}>Stok Minimum (alert)</label>
                  <input type="number" min="0" value={form.min} onChange={e => setForm(f => ({ ...f, min: e.target.value }))} placeholder="0" style={inputStyle} />
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: '#8b92a5', display: 'block', marginBottom: '4px' }}>Harga Beli (Rp)</label>
                  <input type="number" min="0" value={form.buy} onChange={e => setForm(f => ({ ...f, buy: e.target.value }))} placeholder="0" style={inputStyle} />
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: '#8b92a5', display: 'block', marginBottom: '4px' }}>Harga Jual (Rp)</label>
                  <input type="number" min="0" value={form.sell} onChange={e => setForm(f => ({ ...f, sell: e.target.value }))} placeholder="0" style={inputStyle} />
                </div>
                <div style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #2a2d3e', background: '#0f1117' }}>
                  <div style={{ fontSize: '11px', color: '#8b92a5', marginBottom: '2px' }}>Margin Keuntungan</div>
                  <div style={{ fontSize: '18px', fontWeight: 700, color: '#22c55e' }}>
                    {form.buy && form.sell && +form.sell > 0 ? Math.round(((+form.sell - +form.buy) / +form.sell) * 100) : 0}%
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px', justifyContent: 'space-between' }}>
                <div>
                  {modal === 'edit' && (
                    deleteConfirm === editId
                      ? <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                          <span style={{ fontSize: '12px', color: '#ef4444' }}>Yakin hapus?</span>
                          <button type="button" onClick={() => handleDelete(editId)} style={{ padding: '6px 12px', borderRadius: '6px', background: '#ef4444', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}>Ya, Hapus</button>
                          <button type="button" onClick={() => setDeleteConfirm('')} style={{ padding: '6px 12px', borderRadius: '6px', background: '#2a2d3e', color: '#8b92a5', border: 'none', cursor: 'pointer', fontSize: '12px' }}>Batal</button>
                        </div>
                      : <button type="button" onClick={() => setDeleteConfirm(editId)} style={{ padding: '8px 14px', borderRadius: '8px', background: 'rgba(239,68,68,0.15)', color: '#ef4444', border: 'none', cursor: 'pointer', fontSize: '13px' }}>
                          🗑️ Hapus Produk
                        </button>
                  )}
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button type="button" onClick={() => setModal(null)} style={{ padding: '8px 20px', borderRadius: '8px', background: '#2a2d3e', color: '#8b92a5', border: 'none', cursor: 'pointer' }}>Batal</button>
                  <button type="submit" style={{ padding: '8px 24px', borderRadius: '8px', background: '#f97316', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 700 }}>
                    {modal === 'add' ? 'Tambahkan' : 'Simpan Perubahan'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Category Manager Modal */}
      {showCatMgr && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ background: '#1e2130', borderRadius: '16px', padding: '24px', width: '400px', border: '1px solid #2a2d3e' }}>
            <h2 style={{ color: '#f0f2f5', fontWeight: 700, margin: '0 0 16px', fontSize: '16px' }}>🏷️ Kelola Kategori</h2>
            <form onSubmit={handleAddCat} style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
              <input value={newCat} onChange={e => setNewCat(e.target.value)} placeholder="Nama kategori baru..."
                style={{ flex: 1, padding: '8px 12px', borderRadius: '8px', border: '1px solid #2a2d3e', background: '#0f1117', color: '#f0f2f5', fontSize: '13px', outline: 'none' }} />
              <button type="submit" style={{ padding: '8px 14px', borderRadius: '8px', background: '#f97316', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '13px' }}>Tambah</button>
            </form>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', maxHeight: '300px', overflowY: 'auto' }}>
              {categories.map(c => (
                <div key={c} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', borderRadius: '8px', background: '#0f1117', border: '1px solid #2a2d3e' }}>
                  <span style={{ fontSize: '14px', color: '#f0f2f5' }}>{c}</span>
                  <button onClick={() => setCategories(categories.filter(x => x !== c))}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', fontSize: '16px', padding: '0 4px' }}>×</button>
                </div>
              ))}
            </div>
            <button onClick={() => setShowCatMgr(false)} style={{ marginTop: '16px', width: '100%', padding: '10px', borderRadius: '8px', background: '#2a2d3e', color: '#8b92a5', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Selesai</button>
          </div>
        </div>
      )}
    </div>
  );
}

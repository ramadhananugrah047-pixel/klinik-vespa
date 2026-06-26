'use client';
import { useState, useRef } from 'react';
import { useApp, Product } from '@/contexts/AppContext';

const fmt = (n: number) => 'Rp ' + n.toLocaleString('id-ID');
type ModalMode = 'add' | 'edit' | null;
const emptyForm = { id: '', name: '', category: '', stock: '', min: '', buy: '', sell: '', img: '' };

export default function InventoriPage() {
  const { products, categories, setCategories, addProduct, updateProduct, deleteProduct } = useApp();
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

  const openAdd = () => { setForm(emptyForm); setModal('add'); };
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
    const p: Product = { id: form.id, name: form.name, category: form.category, stock: +form.stock, min: +form.min, buy: +form.buy, sell: +form.sell, img: form.img };
    if (modal === 'add') addProduct(p); else updateProduct(p);
    setModal(null);
  };

  const handleDelete = (id: string) => { deleteProduct(id); setDeleteConfirm(''); setModal(null); };

  const inputStyle = { width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #2a2d3e', background: '#0f1117', color: '#f0f2f5', fontSize: '13px', outline: 'none', boxSizing: 'border-box' as const };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#f0f2f5', margin: 0 }}>Inventori</h1>
          <p style={{ fontSize: '13px', color: '#8b92a5', marginTop: '4px' }}>{products.length} produk · {products.filter(p => p.stock === 0).length} habis · {products.filter(p => p.stock > 0 && p.stock <= p.min).length} menipis</p>
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button onClick={() => setShowCatMgr(true)} style={{ padding: '8px 14px', borderRadius: '8px', background: '#2a2d3e', color: '#8b92a5', border: '1px solid #3a3d4e', cursor: 'pointer', fontSize: '13px' }}>🏷️ Kategori</button>
          <button onClick={openAdd} style={{ padding: '8px 16px', borderRadius: '8px', background: '#f97316', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '13px' }}>+ Tambah Produk</button>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '10px', marginBottom: '16px', flexWrap: 'wrap' }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari produk atau SKU..."
          style={{ flex: 1, minWidth: '200px', padding: '8px 14px', borderRadius: '8px', border: '1px solid #2a2d3e', background: '#1e2130', color: '#f0f2f5', fontSize: '13px', outline: 'none' }} />
        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
          {['Semua', ...categories].map(c => (
            <button key={c} onClick={() => setCatFilter(c)} style={{ padding: '6px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: 600, border: '1px solid #2a2d3e', cursor: 'pointer', background: catFilter === c ? '#f97316' : '#1e2130', color: catFilter === c ? '#fff' : '#8b92a5' }}>{c}</button>
          ))}
        </div>
      </div>

      <div style={{ borderRadius: '12px', border: '1px solid #2a2d3e', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ background: '#1a1d27' }}>
            <tr>{['Foto', 'SKU', 'Nama Produk', 'Kategori', 'Stok', 'Min', 'Harga Beli', 'Harga Jual', 'Margin', 'Status', 'Aksi'].map(h => (
              <th key={h} style={{ padding: '11px 14px', textAlign: 'left', fontSize: '11px', fontWeight: 600, color: '#8b92a5' }}>{h}</th>
            ))}</tr>
          </thead>
          <tbody>
            {filtered.map((p, i) => {
              const s = stockStatus(p);
              const margin = p.sell > 0 ? Math.round(((p.sell - p.buy) / p.sell) * 100) : 0;
              return (
                <tr key={p.id} style={{ background: i % 2 === 0 ? '#1e2130' : '#1a1d27', borderBottom: '1px solid #2a2d3e' }}>
                  <td style={{ padding: '10px 14px' }}>
                    {p.img ? <img src={p.img} alt={p.name} style={{ width: '36px', height: '36px', borderRadius: '6px', objectFit: 'cover' }} />
                      : <div style={{ width: '36px', height: '36px', borderRadius: '6px', background: '#2a2d3e', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>📦</div>}
                  </td>
                  <td style={{ padding: '10px 14px', fontSize: '11px', fontFamily: 'monospace', color: '#f97316' }}>{p.id}</td>
                  <td style={{ padding: '10px 14px', fontSize: '13px', fontWeight: 600, color: '#f0f2f5' }}>{p.name}</td>
                  <td style={{ padding: '10px 14px', fontSize: '12px', color: '#8b92a5' }}>{p.category}</td>
                  <td style={{ padding: '10px 14px', fontSize: '15px', fontWeight: 700, color: s.color }}>{p.stock}</td>
                  <td style={{ padding: '10px 14px', fontSize: '12px', color: '#5a6070' }}>{p.min}</td>
                  <td style={{ padding: '10px 14px', fontSize: '12px', color: '#8b92a5' }}>{fmt(p.buy)}</td>
                  <td style={{ padding: '10px 14px', fontSize: '13px', fontWeight: 600, color: '#f0f2f5' }}>{fmt(p.sell)}</td>
                  <td style={{ padding: '10px 14px', fontSize: '12px', fontWeight: 700, color: '#22c55e' }}>{margin}%</td>
                  <td style={{ padding: '10px 14px' }}><span style={{ fontSize: '11px', padding: '2px 7px', borderRadius: '4px', fontWeight: 700, background: s.bg, color: s.color }}>{s.label}</span></td>
                  <td style={{ padding: '10px 14px' }}>
                    <button onClick={() => openEdit(p)} style={{ padding: '4px 10px', borderRadius: '6px', background: 'rgba(59,130,246,0.15)', color: '#3b82f6', border: '1px solid rgba(59,130,246,0.3)', cursor: 'pointer', fontSize: '11px', fontWeight: 600 }}>Edit</button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Modal Tambah/Edit */}
      {modal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ background: '#1e2130', borderRadius: '16px', padding: '24px', width: '560px', maxHeight: '90vh', overflowY: 'auto', border: '1px solid #2a2d3e' }}>
            <h2 style={{ color: '#f0f2f5', fontWeight: 700, margin: '0 0 18px', fontSize: '17px' }}>{modal === 'add' ? '+ Tambah Produk' : '✏️ Edit Produk'}</h2>
            <form onSubmit={handleSave}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ fontSize: '12px', color: '#8b92a5', display: 'block', marginBottom: '8px' }}>Foto Produk</label>
                <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                  <div style={{ width: '80px', height: '80px', borderRadius: '10px', border: '2px dashed #2a2d3e', background: '#0f1117', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
                    {form.img ? <img src={form.img} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ fontSize: '28px' }}>📷</span>}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    <button type="button" onClick={() => imgRef.current?.click()} style={{ padding: '6px 14px', borderRadius: '8px', background: '#2a2d3e', color: '#f0f2f5', border: 'none', cursor: 'pointer', fontSize: '12px' }}>🖼️ Galeri</button>
                    <button type="button" onClick={() => camRef.current?.click()} style={{ padding: '6px 14px', borderRadius: '8px', background: '#2a2d3e', color: '#f0f2f5', border: 'none', cursor: 'pointer', fontSize: '12px' }}>📸 Kamera</button>
                    <input ref={imgRef} type="file" accept="image/*" onChange={handleImg} style={{ display: 'none' }} />
                    <input ref={camRef} type="file" accept="image/*" capture="environment" onChange={handleImg} style={{ display: 'none' }} />
                  </div>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                {[['Nama Produk *', 'name', 'text'], ['SKU / Kode *', 'id', 'text']].map(([label, key, type]) => (
                  <div key={key}>
                    <label style={{ fontSize: '12px', color: '#8b92a5', display: 'block', marginBottom: '4px' }}>{label}</label>
                    <input required type={type} value={(form as any)[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} style={inputStyle} />
                  </div>
                ))}
                <div>
                  <label style={{ fontSize: '12px', color: '#8b92a5', display: 'block', marginBottom: '4px' }}>Kategori *</label>
                  <select required value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} style={inputStyle}>
                    <option value="">Pilih Kategori</option>
                    {categories.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                {[['Stok Awal', 'stock'], ['Stok Minimum', 'min'], ['Harga Beli (Rp)', 'buy'], ['Harga Jual (Rp)', 'sell']].map(([label, key]) => (
                  <div key={key}>
                    <label style={{ fontSize: '12px', color: '#8b92a5', display: 'block', marginBottom: '4px' }}>{label}</label>
                    <input type="number" min="0" value={(form as any)[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} placeholder="0" style={inputStyle} />
                  </div>
                ))}
                <div style={{ padding: '10px', borderRadius: '8px', border: '1px solid #2a2d3e', background: '#0f1117' }}>
                  <div style={{ fontSize: '11px', color: '#8b92a5', marginBottom: '2px' }}>Margin</div>
                  <div style={{ fontSize: '20px', fontWeight: 700, color: '#22c55e' }}>
                    {form.sell && form.buy && +form.sell > 0 ? Math.round(((+form.sell - +form.buy) / +form.sell) * 100) : 0}%
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <div>
                  {modal === 'edit' && (deleteConfirm === editId
                    ? <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                        <span style={{ fontSize: '12px', color: '#ef4444' }}>Yakin hapus?</span>
                        <button type="button" onClick={() => handleDelete(editId)} style={{ padding: '6px 12px', borderRadius: '6px', background: '#ef4444', color: '#fff', border: 'none', cursor: 'pointer', fontSize: '12px' }}>Hapus</button>
                        <button type="button" onClick={() => setDeleteConfirm('')} style={{ padding: '6px 12px', borderRadius: '6px', background: '#2a2d3e', color: '#8b92a5', border: 'none', cursor: 'pointer', fontSize: '12px' }}>Batal</button>
                      </div>
                    : <button type="button" onClick={() => setDeleteConfirm(editId)} style={{ padding: '8px 14px', borderRadius: '8px', background: 'rgba(239,68,68,0.15)', color: '#ef4444', border: 'none', cursor: 'pointer', fontSize: '12px' }}>🗑️ Hapus</button>
                  )}
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button type="button" onClick={() => setModal(null)} style={{ padding: '8px 18px', borderRadius: '8px', background: '#2a2d3e', color: '#8b92a5', border: 'none', cursor: 'pointer' }}>Batal</button>
                  <button type="submit" style={{ padding: '8px 22px', borderRadius: '8px', background: '#f97316', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 700 }}>{modal === 'add' ? 'Tambahkan' : 'Simpan'}</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Category Manager */}
      {showCatMgr && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ background: '#1e2130', borderRadius: '16px', padding: '24px', width: '380px', border: '1px solid #2a2d3e' }}>
            <h2 style={{ color: '#f0f2f5', fontWeight: 700, margin: '0 0 14px', fontSize: '15px' }}>🏷️ Kelola Kategori</h2>
            <form onSubmit={e => { e.preventDefault(); if (newCat.trim() && !categories.includes(newCat.trim())) { setCategories([...categories, newCat.trim()]); setNewCat(''); } }} style={{ display: 'flex', gap: '6px', marginBottom: '12px' }}>
              <input value={newCat} onChange={e => setNewCat(e.target.value)} placeholder="Nama kategori baru..." style={{ flex: 1, padding: '8px 12px', borderRadius: '8px', border: '1px solid #2a2d3e', background: '#0f1117', color: '#f0f2f5', fontSize: '13px', outline: 'none' }} />
              <button type="submit" style={{ padding: '8px 14px', borderRadius: '8px', background: '#f97316', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Tambah</button>
            </form>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', maxHeight: '280px', overflowY: 'auto' }}>
              {categories.map(c => (
                <div key={c} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', borderRadius: '8px', background: '#0f1117', border: '1px solid #2a2d3e' }}>
                  <span style={{ fontSize: '13px', color: '#f0f2f5' }}>{c}</span>
                  <button onClick={() => setCategories(categories.filter(x => x !== c))} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', fontSize: '16px' }}>×</button>
                </div>
              ))}
            </div>
            <button onClick={() => setShowCatMgr(false)} style={{ marginTop: '14px', width: '100%', padding: '10px', borderRadius: '8px', background: '#2a2d3e', color: '#8b92a5', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Selesai</button>
          </div>
        </div>
      )}
    </div>
  );
}

'use client';
import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';

const fmt = (n: number) => 'Rp ' + n.toLocaleString('id-ID');
type CalcMode = 'perUnit' | 'totalOnly';

export default function StokMasukPage() {
  const { products, suppliers, stockEntries, receiveStock } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [isNewProduct, setIsNewProduct] = useState(false);
  const [calcMode, setCalcMode] = useState<CalcMode>('perUnit');
  const [form, setForm] = useState({ supplierId: '', product: '', newProductName: '', newProductId: '', qty: '', pricePerUnit: '', totalBarang: '', ongkir: '', status: 'Lunas' });

  const selectedSupplier = suppliers.find(s => s.id === form.supplierId);
  const qty = parseInt(form.qty) || 0;
  const ongkir = parseInt(form.ongkir.replace(/\D/g, '')) || 0;
  const pricePerUnit = calcMode === 'perUnit' ? parseInt(form.pricePerUnit.replace(/\D/g, '')) || 0 : (qty > 0 ? Math.round((parseInt(form.totalBarang.replace(/\D/g, '')) || 0) / qty) : 0);
  const totalBarang = calcMode === 'perUnit' ? pricePerUnit * qty : parseInt(form.totalBarang.replace(/\D/g, '')) || 0;
  const totalBayar = totalBarang + ongkir;

  const selectedProduct = products.find(p => p.id === form.product);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const productId = isNewProduct ? form.newProductId : form.product;
    const productName = isNewProduct ? form.newProductName : (selectedProduct?.name || form.product);
    receiveStock({
      date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
      supplier: selectedSupplier?.name || '',
      supplierId: form.supplierId,
      productId,
      productName,
      isNewProduct,
      qty,
      pricePerUnit,
      ongkir,
      total: totalBayar,
      payStatus: form.status as 'Lunas' | 'Hutang',
    });
    setForm({ supplierId: '', product: '', newProductName: '', newProductId: '', qty: '', pricePerUnit: '', totalBarang: '', ongkir: '', status: 'Lunas' });
    setIsNewProduct(false);
    setCalcMode('perUnit');
    setShowForm(false);
  };

  const totalPembelian = stockEntries.reduce((s, h) => s + h.total, 0);
  const totalHutang = stockEntries.filter(h => h.payStatus === 'Hutang').reduce((s, h) => s + h.total, 0);
  const inputStyle = { width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #2a2d3e', background: '#0f1117', color: '#f0f2f5', fontSize: '13px', outline: 'none', boxSizing: 'border-box' as const };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#f0f2f5', margin: 0 }}>Stok Masuk</h1>
          <p style={{ fontSize: '13px', color: '#8b92a5', marginTop: '4px' }}>Pencatatan penerimaan stok — otomatis update inventori & hutang pemasok</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} style={{ padding: '8px 16px', borderRadius: '8px', background: '#f97316', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '14px' }}>+ Catat Stok Masuk</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '20px' }}>
        {[
          { label: 'Total Pembelian', value: fmt(totalPembelian), color: '#f0f2f5', icon: '📥' },
          { label: 'Hutang Belum Lunas', value: fmt(totalHutang), color: '#ef4444', icon: '⚠️' },
          { label: 'Total Transaksi', value: `${stockEntries.length} kali`, color: '#3b82f6', icon: '📋' },
        ].map(c => (
          <div key={c.label} style={{ padding: '18px 20px', borderRadius: '12px', border: '1px solid #2a2d3e', background: '#1e2130' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
              <span style={{ fontSize: '13px', color: '#8b92a5' }}>{c.label}</span>
              <span style={{ fontSize: '20px' }}>{c.icon}</span>
            </div>
            <div style={{ fontSize: '22px', fontWeight: 700, color: c.color }}>{c.value}</div>
          </div>
        ))}
      </div>

      {showForm && (
        <div style={{ padding: '20px', borderRadius: '12px', border: '1px solid #2a2d3e', background: '#1e2130', marginBottom: '20px' }}>
          <h2 style={{ color: '#f0f2f5', fontWeight: 700, margin: '0 0 16px', fontSize: '15px' }}>Form Stok Masuk</h2>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
              <div>
                <label style={{ fontSize: '12px', color: '#8b92a5', display: 'block', marginBottom: '4px' }}>Pemasok *</label>
                <select required value={form.supplierId} onChange={e => setForm({ ...form, supplierId: e.target.value })} style={inputStyle}>
                  <option value="">Pilih Pemasok</option>
                  {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: '12px', color: '#8b92a5', display: 'block', marginBottom: '4px' }}>Produk *</label>
                <div style={{ display: 'flex', gap: '6px' }}>
                  {!isNewProduct ? (
                    <select required value={form.product} onChange={e => setForm({ ...form, product: e.target.value })} style={{ ...inputStyle, flex: 1 }}>
                      <option value="">Pilih Produk</option>
                      {products.map(p => <option key={p.id} value={p.id}>{p.name} (stok: {p.stock})</option>)}
                    </select>
                  ) : (
                    <div style={{ flex: 1, display: 'flex', gap: '6px' }}>
                      <input required value={form.newProductId} onChange={e => setForm({ ...form, newProductId: e.target.value })} placeholder="Kode baru (VS-010)" style={{ ...inputStyle, width: '100px' }} />
                      <input required value={form.newProductName} onChange={e => setForm({ ...form, newProductName: e.target.value })} placeholder="Nama produk baru" style={{ ...inputStyle, flex: 1 }} />
                    </div>
                  )}
                  <button type="button" onClick={() => { setIsNewProduct(!isNewProduct); setForm(f => ({ ...f, product: '', newProductName: '', newProductId: '' })); }}
                    style={{ padding: '6px 10px', borderRadius: '8px', background: isNewProduct ? '#f97316' : '#2a2d3e', color: isNewProduct ? '#fff' : '#8b92a5', border: 'none', cursor: 'pointer', fontSize: '11px', fontWeight: 700, whiteSpace: 'nowrap' }}>
                    {isNewProduct ? '⭐ Baru' : '+ Baru'}
                  </button>
                </div>
                {isNewProduct && <div style={{ fontSize: '11px', color: '#f97316', marginTop: '4px' }}>⭐ Produk baru akan otomatis masuk ke Inventori</div>}
                {selectedProduct && <div style={{ fontSize: '11px', color: '#22c55e', marginTop: '4px' }}>Stok saat ini: {selectedProduct.stock} pcs</div>}
              </div>
            </div>

            <div style={{ padding: '14px', borderRadius: '10px', background: '#0f1117', border: '1px solid #2a2d3e', marginBottom: '12px' }}>
              <div style={{ fontSize: '12px', color: '#8b92a5', marginBottom: '8px', fontWeight: 600 }}>Perhitungan Harga</div>
              <div style={{ display: 'flex', gap: '6px', marginBottom: '10px' }}>
                {(['perUnit', 'totalOnly'] as const).map(m => (
                  <button key={m} type="button" onClick={() => setCalcMode(m)}
                    style={{ padding: '6px 14px', borderRadius: '6px', background: calcMode === m ? '#f97316' : '#2a2d3e', color: calcMode === m ? '#fff' : '#8b92a5', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}>
                    {m === 'perUnit' ? 'Input Harga/pcs' : 'Input Total Saja'}
                  </button>
                ))}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '11px', color: '#8b92a5', display: 'block', marginBottom: '4px' }}>Jumlah (pcs) *</label>
                  <input required type="number" min="1" value={form.qty} onChange={e => setForm({ ...form, qty: e.target.value })} placeholder="0" style={{ ...inputStyle, background: '#1e2130' }} />
                </div>
                {calcMode === 'perUnit' ? (
                  <div>
                    <label style={{ fontSize: '11px', color: '#8b92a5', display: 'block', marginBottom: '4px' }}>Harga/pcs (Rp) *</label>
                    <input required value={form.pricePerUnit} onChange={e => setForm({ ...form, pricePerUnit: e.target.value })} placeholder="0" style={{ ...inputStyle, background: '#1e2130' }} />
                  </div>
                ) : (
                  <div>
                    <label style={{ fontSize: '11px', color: '#8b92a5', display: 'block', marginBottom: '4px' }}>Total Barang (Rp) *</label>
                    <input required value={form.totalBarang} onChange={e => setForm({ ...form, totalBarang: e.target.value })} placeholder="0" style={{ ...inputStyle, background: '#1e2130' }} />
                  </div>
                )}
                <div>
                  <label style={{ fontSize: '11px', color: '#8b92a5', display: 'block', marginBottom: '4px' }}>Ongkir (Rp)</label>
                  <input value={form.ongkir} onChange={e => setForm({ ...form, ongkir: e.target.value })} placeholder="0" style={{ ...inputStyle, background: '#1e2130' }} />
                </div>
                <div style={{ padding: '8px', borderRadius: '8px', border: '1px solid rgba(249,115,22,0.3)', background: 'rgba(249,115,22,0.07)' }}>
                  <div style={{ fontSize: '10px', color: '#8b92a5' }}>Harga/pcs</div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#f97316' }}>{pricePerUnit > 0 ? fmt(pricePerUnit) : '-'}</div>
                  <div style={{ fontSize: '10px', color: '#8b92a5', marginTop: '4px' }}>Total Bayar</div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#22c55e' }}>{totalBayar > 0 ? fmt(totalBayar) : '-'}</div>
                </div>
              </div>
            </div>

            <div style={{ marginBottom: '14px' }}>
              <label style={{ fontSize: '12px', color: '#8b92a5', display: 'block', marginBottom: '6px' }}>Status Pembayaran</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                {['Lunas', 'Hutang'].map(s => (
                  <button key={s} type="button" onClick={() => setForm({ ...form, status: s })}
                    style={{ padding: '8px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '13px', background: form.status === s ? (s === 'Lunas' ? '#22c55e' : '#ef4444') : '#2a2d3e', color: form.status === s ? '#fff' : '#8b92a5' }}>
                    {s === 'Lunas' ? '✓ Lunas' : '⏳ Hutang / Kredit'}
                  </button>
                ))}
              </div>
              {form.status === 'Hutang' && selectedSupplier && (
                <div style={{ fontSize: '12px', color: '#ef4444', marginTop: '6px' }}>⚠️ Hutang ke {selectedSupplier.name} akan bertambah {fmt(totalBayar)}</div>
              )}
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button type="submit" style={{ padding: '9px 24px', borderRadius: '8px', background: '#f97316', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 700 }}>Simpan & Update Stok</button>
              <button type="button" onClick={() => setShowForm(false)} style={{ padding: '9px 18px', borderRadius: '8px', background: '#2a2d3e', color: '#8b92a5', border: 'none', cursor: 'pointer' }}>Batal</button>
            </div>
          </form>
        </div>
      )}

      <div style={{ borderRadius: '12px', border: '1px solid #2a2d3e', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ background: '#1a1d27' }}>
            <tr>{['No', 'Tanggal', 'Pemasok', 'Produk', 'Qty', 'Harga/pcs', 'Ongkir', 'Total Bayar', 'Status'].map(h => (
              <th key={h} style={{ padding: '11px 14px', textAlign: 'left', fontSize: '11px', fontWeight: 600, color: '#8b92a5' }}>{h}</th>
            ))}</tr>
          </thead>
          <tbody>
            {stockEntries.map((h, i) => (
              <tr key={h.id} style={{ background: i % 2 === 0 ? '#1e2130' : '#1a1d27', borderBottom: '1px solid #2a2d3e' }}>
                <td style={{ padding: '10px 14px', fontSize: '11px', color: '#f97316', fontFamily: 'monospace' }}>{h.id}</td>
                <td style={{ padding: '10px 14px', fontSize: '12px', color: '#8b92a5' }}>{h.date}</td>
                <td style={{ padding: '10px 14px', fontSize: '13px', color: '#f0f2f5' }}>{h.supplier}</td>
                <td style={{ padding: '10px 14px', fontSize: '13px', fontWeight: 600, color: '#f0f2f5' }}>
                  {h.productName}
                  {h.isNewProduct && <span style={{ marginLeft: '6px', fontSize: '10px', background: 'rgba(59,130,246,0.2)', color: '#3b82f6', padding: '1px 5px', borderRadius: '4px' }}>BARU</span>}
                </td>
                <td style={{ padding: '10px 14px', fontSize: '13px', color: '#3b82f6', fontWeight: 700 }}>{h.qty} pcs</td>
                <td style={{ padding: '10px 14px', fontSize: '12px', color: '#8b92a5' }}>{fmt(h.pricePerUnit)}</td>
                <td style={{ padding: '10px 14px', fontSize: '12px', color: h.ongkir > 0 ? '#f59e0b' : '#5a6070' }}>{h.ongkir > 0 ? fmt(h.ongkir) : '-'}</td>
                <td style={{ padding: '10px 14px', fontSize: '14px', fontWeight: 700, color: '#f0f2f5' }}>{fmt(h.total)}</td>
                <td style={{ padding: '10px 14px' }}>
                  <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '4px', fontWeight: 700, background: h.payStatus === 'Lunas' ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)', color: h.payStatus === 'Lunas' ? '#22c55e' : '#ef4444' }}>{h.payStatus}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

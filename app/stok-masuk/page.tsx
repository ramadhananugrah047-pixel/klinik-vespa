'use client';
import { useState } from 'react';

const fmt = (n: number) => 'Rp ' + n.toLocaleString('id-ID');

const initHistory = [
  { id: 'SM-001', date: '27 Jun 2026', supplier: 'PT Piaggio Dist.', product: 'Kampas Rem Depan', qty: 50, pricePerUnit: 85000, ongkir: 0, total: 4250000, status: 'Lunas', isNew: false },
  { id: 'SM-002', date: '25 Jun 2026', supplier: 'UD Vespa Jaya', product: 'Oli Agip 4T 1L', qty: 24, pricePerUnit: 65000, ongkir: 50000, total: 1610000, status: 'Hutang', isNew: false },
  { id: 'SM-003', date: '22 Jun 2026', supplier: 'CV Motor Parts', product: 'Busi NGK CR7HSA', qty: 30, pricePerUnit: 35000, ongkir: 25000, total: 1075000, status: 'Lunas', isNew: false },
];

const suppliers = ['PT Piaggio Dist.', 'UD Vespa Jaya', 'CV Motor Parts', 'Toko Sparepart Sentani'];
const existingProducts = ['Kampas Rem Depan', 'Kampas Rem Belakang', 'Oli Agip 4T 1L', 'Ban Dalam 275-17', 'Busi NGK CR7HSA', 'Filter Udara', 'Rantai 428H', 'Minyak Rem DOT4', 'Bearing Roda Depan'];

type CalcMode = 'perUnit' | 'totalOnly';

export default function StokMasukPage() {
  const [history, setHistory] = useState(initHistory);
  const [showForm, setShowForm] = useState(false);
  const [isNewProduct, setIsNewProduct] = useState(false);
  const [calcMode, setCalcMode] = useState<CalcMode>('perUnit');

  const [form, setForm] = useState({
    supplier: '',
    product: '',
    newProductName: '',
    qty: '',
    pricePerUnit: '',
    totalBarang: '',
    ongkir: '',
    status: 'Lunas',
  });

  // Auto-calculate when user switches mode or changes values
  const qty = parseInt(form.qty) || 0;
  const ongkir = parseInt(form.ongkir.replace(/\D/g, '')) || 0;

  const pricePerUnit = calcMode === 'perUnit'
    ? parseInt(form.pricePerUnit.replace(/\D/g, '')) || 0
    : qty > 0 ? Math.round((parseInt(form.totalBarang.replace(/\D/g, '')) || 0) / qty) : 0;

  const totalBarang = calcMode === 'perUnit'
    ? pricePerUnit * qty
    : parseInt(form.totalBarang.replace(/\D/g, '')) || 0;

  const totalBayar = totalBarang + ongkir;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const productName = isNewProduct ? form.newProductName : form.product;
    const newItem = {
      id: `SM-${String(history.length + 1).padStart(3, '0')}`,
      date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
      supplier: form.supplier,
      product: productName + (isNewProduct ? ' ⭐' : ''),
      qty,
      pricePerUnit,
      ongkir,
      total: totalBayar,
      status: form.status,
      isNew: isNewProduct,
    };
    setHistory([newItem, ...history]);
    setForm({ supplier: '', product: '', newProductName: '', qty: '', pricePerUnit: '', totalBarang: '', ongkir: '', status: 'Lunas' });
    setIsNewProduct(false);
    setCalcMode('perUnit');
    setShowForm(false);
  };

  const totalPembelian = history.reduce((s, h) => s + h.total, 0);
  const totalHutang = history.filter(h => h.status === 'Hutang').reduce((s, h) => s + h.total, 0);

  const inputStyle = { width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #2a2d3e', background: '#0f1117', color: '#f0f2f5', fontSize: '13px', outline: 'none', boxSizing: 'border-box' as const };

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

      {/* Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
        {[
          { label: 'Total Pembelian', value: fmt(totalPembelian), color: '#f0f2f5', icon: '📥' },
          { label: 'Hutang Belum Lunas', value: fmt(totalHutang), color: '#ef4444', icon: '⚠️' },
          { label: 'Jumlah Transaksi', value: `${history.length} kali`, color: '#3b82f6', icon: '📋' },
        ].map(c => (
          <div key={c.label} style={{ padding: '18px 20px', borderRadius: '12px', border: '1px solid #2a2d3e', background: '#1e2130' }}>
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
          <h2 style={{ color: '#f0f2f5', fontWeight: 700, margin: '0 0 16px', fontSize: '16px' }}>Form Stok Masuk</h2>
          <form onSubmit={handleSubmit}>
            {/* Row 1: Supplier + Product */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
              <div>
                <label style={{ fontSize: '12px', color: '#8b92a5', display: 'block', marginBottom: '4px' }}>Pemasok *</label>
                <select required value={form.supplier} onChange={e => setForm({ ...form, supplier: e.target.value })} style={inputStyle}>
                  <option value="">Pilih Pemasok</option>
                  {suppliers.map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: '12px', color: '#8b92a5', display: 'block', marginBottom: '4px' }}>Produk *</label>
                <div style={{ display: 'flex', gap: '6px' }}>
                  {!isNewProduct ? (
                    <select required value={form.product} onChange={e => setForm({ ...form, product: e.target.value })} style={{ ...inputStyle, flex: 1 }}>
                      <option value="">Pilih Produk</option>
                      {existingProducts.map(p => <option key={p}>{p}</option>)}
                    </select>
                  ) : (
                    <input required value={form.newProductName} onChange={e => setForm({ ...form, newProductName: e.target.value })} placeholder="Nama produk baru..." style={{ ...inputStyle, flex: 1 }} />
                  )}
                  <button type="button" onClick={() => { setIsNewProduct(!isNewProduct); setForm(f => ({ ...f, product: '', newProductName: '' })); }}
                    style={{ padding: '6px 10px', borderRadius: '8px', background: isNewProduct ? '#f97316' : '#2a2d3e', color: isNewProduct ? '#fff' : '#8b92a5', border: 'none', cursor: 'pointer', fontSize: '11px', fontWeight: 600, whiteSpace: 'nowrap' }}>
                    {isNewProduct ? '⭐ Baru' : '+ Produk Baru'}
                  </button>
                </div>
                {isNewProduct && <div style={{ fontSize: '11px', color: '#f97316', marginTop: '4px' }}>⭐ Produk baru akan ditandai di riwayat</div>}
              </div>
            </div>

            {/* Row 2: Qty + Calc mode + Prices */}
            <div style={{ padding: '14px', borderRadius: '10px', background: '#0f1117', border: '1px solid #2a2d3e', marginBottom: '12px' }}>
              <div style={{ fontSize: '12px', color: '#8b92a5', marginBottom: '10px', fontWeight: 600 }}>Perhitungan Harga</div>

              {/* Calc mode toggle */}
              <div style={{ display: 'flex', gap: '6px', marginBottom: '12px' }}>
                <button type="button" onClick={() => setCalcMode('perUnit')}
                  style={{ padding: '6px 14px', borderRadius: '6px', background: calcMode === 'perUnit' ? '#f97316' : '#2a2d3e', color: calcMode === 'perUnit' ? '#fff' : '#8b92a5', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}>
                  Input Harga/pcs
                </button>
                <button type="button" onClick={() => setCalcMode('totalOnly')}
                  style={{ padding: '6px 14px', borderRadius: '6px', background: calcMode === 'totalOnly' ? '#f97316' : '#2a2d3e', color: calcMode === 'totalOnly' ? '#fff' : '#8b92a5', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}>
                  Input Total Saja
                </button>
                <span style={{ fontSize: '11px', color: '#5a6070', alignSelf: 'center', marginLeft: '4px' }}>
                  {calcMode === 'totalOnly' ? '(Harga/pcs dihitung otomatis)' : '(Total dihitung otomatis)'}
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '11px', color: '#8b92a5', display: 'block', marginBottom: '4px' }}>Jumlah (pcs) *</label>
                  <input required type="number" min="1" value={form.qty} onChange={e => setForm({ ...form, qty: e.target.value })} placeholder="0" style={{ ...inputStyle, background: '#1e2130' }} />
                </div>

                {calcMode === 'perUnit' ? (
                  <div>
                    <label style={{ fontSize: '11px', color: '#8b92a5', display: 'block', marginBottom: '4px' }}>Harga / pcs (Rp) *</label>
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
                  <input value={form.ongkir} onChange={e => setForm({ ...form, ongkir: e.target.value })} placeholder="0 (opsional)" style={{ ...inputStyle, background: '#1e2130' }} />
                </div>

                <div style={{ padding: '8px', borderRadius: '8px', border: '1px solid rgba(249,115,22,0.3)', background: 'rgba(249,115,22,0.07)' }}>
                  <div style={{ fontSize: '10px', color: '#8b92a5', marginBottom: '2px' }}>Harga/pcs</div>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: '#f97316' }}>{pricePerUnit > 0 ? fmt(pricePerUnit) : '-'}</div>
                  <div style={{ fontSize: '10px', color: '#8b92a5', marginTop: '4px' }}>Total Bayar</div>
                  <div style={{ fontSize: '14px', fontWeight: 700, color: '#22c55e' }}>{totalBayar > 0 ? fmt(totalBayar) : '-'}</div>
                  {ongkir > 0 && <div style={{ fontSize: '10px', color: '#5a6070', marginTop: '2px' }}>+Ongkir {fmt(ongkir)}</div>}
                </div>
              </div>
            </div>

            {/* Row 3: Status */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '12px', color: '#8b92a5', display: 'block', marginBottom: '6px' }}>Status Pembayaran</label>
              <div style={{ display: 'flex', gap: '8px' }}>
                {['Lunas', 'Hutang'].map(s => (
                  <button key={s} type="button" onClick={() => setForm({ ...form, status: s })}
                    style={{ padding: '8px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '13px', background: form.status === s ? (s === 'Lunas' ? '#22c55e' : '#ef4444') : '#2a2d3e', color: form.status === s ? '#fff' : '#8b92a5' }}>
                    {s === 'Lunas' ? '✓ Lunas' : '⏳ Hutang / Kredit'}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <button type="submit" style={{ padding: '9px 24px', borderRadius: '8px', background: '#f97316', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 700 }}>Simpan</button>
              <button type="button" onClick={() => setShowForm(false)} style={{ padding: '9px 20px', borderRadius: '8px', background: '#2a2d3e', color: '#8b92a5', border: 'none', cursor: 'pointer' }}>Batal</button>
            </div>
          </form>
        </div>
      )}

      <div style={{ borderRadius: '12px', border: '1px solid #2a2d3e', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ background: '#1a1d27' }}>
            <tr>
              {['No', 'Tanggal', 'Pemasok', 'Produk', 'Qty', 'Harga/pcs', 'Ongkir', 'Total Bayar', 'Status'].map(h => (
                <th key={h} style={{ padding: '11px 14px', textAlign: 'left', fontSize: '11px', fontWeight: 600, color: '#8b92a5' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {history.map((h, i) => (
              <tr key={h.id} style={{ background: i % 2 === 0 ? '#1e2130' : '#1a1d27', borderBottom: '1px solid #2a2d3e' }}>
                <td style={{ padding: '11px 14px', fontSize: '11px', color: '#f97316', fontFamily: 'monospace' }}>{h.id}</td>
                <td style={{ padding: '11px 14px', fontSize: '12px', color: '#8b92a5' }}>{h.date}</td>
                <td style={{ padding: '11px 14px', fontSize: '13px', color: '#f0f2f5' }}>{h.supplier}</td>
                <td style={{ padding: '11px 14px', fontSize: '13px', fontWeight: 600, color: '#f0f2f5' }}>
                  {h.product}
                  {h.isNew && <span style={{ marginLeft: '6px', fontSize: '10px', background: 'rgba(59,130,246,0.2)', color: '#3b82f6', padding: '1px 5px', borderRadius: '4px' }}>BARU</span>}
                </td>
                <td style={{ padding: '11px 14px', fontSize: '13px', color: '#3b82f6', fontWeight: 700 }}>{h.qty} pcs</td>
                <td style={{ padding: '11px 14px', fontSize: '12px', color: '#8b92a5' }}>{fmt(h.pricePerUnit)}</td>
                <td style={{ padding: '11px 14px', fontSize: '12px', color: h.ongkir > 0 ? '#f59e0b' : '#5a6070' }}>
                  {h.ongkir > 0 ? fmt(h.ongkir) : '-'}
                </td>
                <td style={{ padding: '11px 14px', fontSize: '14px', fontWeight: 700, color: '#f0f2f5' }}>{fmt(h.total)}</td>
                <td style={{ padding: '11px 14px' }}>
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

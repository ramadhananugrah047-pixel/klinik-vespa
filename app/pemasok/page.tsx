'use client';
import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';

const fmt = (n: number) => 'Rp ' + n.toLocaleString('id-ID');

export default function PemasokPage() {
  const { suppliers, addSupplier, paySupplierDebt } = useApp();
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', contact: '', phone: '', city: '' });
  const [selected, setSelected] = useState<typeof suppliers[0] | null>(null);
  const [payAmount, setPayAmount] = useState('');

  const filtered = suppliers.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) || s.city.toLowerCase().includes(search.toLowerCase())
  );

  const totalHutang = suppliers.reduce((s, p) => s + p.hutang, 0);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    addSupplier(form);
    setForm({ name: '', contact: '', phone: '', city: '' });
    setShowForm(false);
  };

  const handlePay = () => {
    if (!selected) return;
    const amount = parseInt(payAmount.replace(/\D/g, '')) || 0;
    if (amount <= 0) return;
    paySupplierDebt(selected.id, Math.min(amount, selected.hutang));
    setSelected(null);
    setPayAmount('');
  };

  const inputStyle = { width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #2a2d3e', background: '#0f1117', color: '#f0f2f5', fontSize: '13px', outline: 'none', boxSizing: 'border-box' as const };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#f0f2f5', margin: 0 }}>Pemasok & Hutang</h1>
          <p style={{ fontSize: '13px', color: '#8b92a5', marginTop: '4px' }}>Bayar hutang otomatis tercatat di Arus Kas</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} style={{ padding: '8px 16px', borderRadius: '8px', background: '#f97316', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '14px' }}>+ Tambah Pemasok</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '20px' }}>
        {[
          { label: 'Total Pemasok', value: `${suppliers.length}`, color: '#f0f2f5' },
          { label: 'Total Hutang Dagang', value: fmt(totalHutang), color: '#ef4444' },
          { label: 'Pemasok Ada Hutang', value: `${suppliers.filter(s => s.hutang > 0).length}`, color: '#f59e0b' },
        ].map(k => (
          <div key={k.label} style={{ padding: '18px 20px', borderRadius: '12px', border: '1px solid #2a2d3e', background: '#1e2130' }}>
            <div style={{ fontSize: '13px', color: '#8b92a5', marginBottom: '8px' }}>{k.label}</div>
            <div style={{ fontSize: '24px', fontWeight: 700, color: k.color }}>{k.value}</div>
          </div>
        ))}
      </div>

      {showForm && (
        <div style={{ padding: '18px 20px', borderRadius: '12px', border: '1px solid #2a2d3e', background: '#1e2130', marginBottom: '16px' }}>
          <h3 style={{ color: '#f0f2f5', fontWeight: 700, margin: '0 0 14px', fontSize: '14px' }}>Tambah Pemasok</h3>
          <form onSubmit={handleAdd}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '12px' }}>
              {[['Nama Pemasok', 'name'], ['Nama Kontak', 'contact'], ['No. Telepon', 'phone'], ['Kota', 'city']].map(([label, key]) => (
                <div key={key}>
                  <label style={{ fontSize: '12px', color: '#8b92a5', display: 'block', marginBottom: '4px' }}>{label}</label>
                  <input required value={(form as any)[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} placeholder={label} style={inputStyle} />
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button type="submit" style={{ padding: '8px 20px', borderRadius: '8px', background: '#f97316', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Simpan</button>
              <button type="button" onClick={() => setShowForm(false)} style={{ padding: '8px 18px', borderRadius: '8px', background: '#2a2d3e', color: '#8b92a5', border: 'none', cursor: 'pointer' }}>Batal</button>
            </div>
          </form>
        </div>
      )}

      {/* Pay modal */}
      {selected && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }}>
          <div style={{ background: '#1e2130', borderRadius: '16px', padding: '24px', width: '360px', border: '1px solid #2a2d3e' }}>
            <h3 style={{ color: '#f0f2f5', margin: '0 0 14px' }}>Bayar Hutang Pemasok</h3>
            <div style={{ padding: '12px', borderRadius: '8px', background: '#0f1117', marginBottom: '14px' }}>
              <div style={{ fontSize: '13px', color: '#8b92a5' }}>Pemasok</div>
              <div style={{ fontSize: '16px', fontWeight: 700, color: '#f0f2f5' }}>{selected.name}</div>
              <div style={{ fontSize: '12px', color: '#5a6070', marginTop: '2px' }}>Jatuh tempo: {selected.jatuhTempo}</div>
              <div style={{ fontSize: '13px', color: '#8b92a5', marginTop: '8px' }}>Sisa Hutang</div>
              <div style={{ fontSize: '22px', fontWeight: 700, color: '#ef4444' }}>{fmt(selected.hutang)}</div>
            </div>
            <div style={{ marginBottom: '14px' }}>
              <label style={{ fontSize: '12px', color: '#8b92a5', display: 'block', marginBottom: '4px' }}>Jumlah Bayar</label>
              <input value={payAmount} onChange={e => setPayAmount(e.target.value)} type="number"
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #2a2d3e', background: '#0f1117', color: '#f0f2f5', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
              <button onClick={() => setPayAmount(String(selected.hutang))} style={{ marginTop: '6px', padding: '4px 10px', borderRadius: '6px', background: 'rgba(239,68,68,0.15)', color: '#ef4444', border: 'none', cursor: 'pointer', fontSize: '11px' }}>Lunas semua ({fmt(selected.hutang)})</button>
            </div>
            <div style={{ fontSize: '11px', color: '#22c55e', marginBottom: '14px' }}>✓ Pembayaran otomatis tercatat di Arus Kas (Keluar)</div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={handlePay} style={{ flex: 1, padding: '10px', borderRadius: '8px', background: '#f97316', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 700 }}>Konfirmasi Bayar</button>
              <button onClick={() => { setSelected(null); setPayAmount(''); }} style={{ flex: 1, padding: '10px', borderRadius: '8px', background: '#2a2d3e', color: '#8b92a5', border: 'none', cursor: 'pointer' }}>Batal</button>
            </div>
          </div>
        </div>
      )}

      <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari nama pemasok atau kota..."
        style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #2a2d3e', background: '#1e2130', color: '#f0f2f5', fontSize: '13px', outline: 'none', marginBottom: '14px' }} />

      <div style={{ borderRadius: '12px', border: '1px solid #2a2d3e', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ background: '#1a1d27' }}>
            <tr>{['ID', 'Nama Pemasok', 'Kontak', 'Telepon', 'Kota', 'Total Beli', 'Hutang', 'Jatuh Tempo', 'Aksi'].map(h => (
              <th key={h} style={{ padding: '11px 14px', textAlign: 'left', fontSize: '11px', fontWeight: 600, color: '#8b92a5' }}>{h}</th>
            ))}</tr>
          </thead>
          <tbody>
            {filtered.map((s, i) => (
              <tr key={s.id} style={{ background: i % 2 === 0 ? '#1e2130' : '#1a1d27', borderBottom: '1px solid #2a2d3e' }}>
                <td style={{ padding: '10px 14px', fontSize: '11px', color: '#f97316', fontFamily: 'monospace' }}>{s.id}</td>
                <td style={{ padding: '10px 14px', fontSize: '14px', fontWeight: 600, color: '#f0f2f5' }}>{s.name}</td>
                <td style={{ padding: '10px 14px', fontSize: '13px', color: '#8b92a5' }}>{s.contact}</td>
                <td style={{ padding: '10px 14px', fontSize: '13px', color: '#8b92a5' }}>{s.phone}</td>
                <td style={{ padding: '10px 14px', fontSize: '12px', color: '#5a6070' }}>{s.city}</td>
                <td style={{ padding: '10px 14px', fontSize: '13px', color: '#22c55e', fontWeight: 600 }}>{fmt(s.totalBeli)}</td>
                <td style={{ padding: '10px 14px', fontSize: '14px', fontWeight: 700, color: s.hutang > 0 ? '#ef4444' : '#5a6070' }}>{s.hutang > 0 ? fmt(s.hutang) : '-'}</td>
                <td style={{ padding: '10px 14px', fontSize: '12px', color: s.hutang > 0 ? '#f59e0b' : '#5a6070' }}>{s.jatuhTempo}</td>
                <td style={{ padding: '10px 14px' }}>
                  {s.hutang > 0 && (
                    <button onClick={() => setSelected(s)} style={{ padding: '4px 10px', borderRadius: '6px', background: 'rgba(239,68,68,0.15)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)', cursor: 'pointer', fontSize: '11px', fontWeight: 600 }}>Bayar</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

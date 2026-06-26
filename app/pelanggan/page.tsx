'use client';
import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';

const fmt = (n: number) => 'Rp ' + n.toLocaleString('id-ID');

export default function PelangganPage() {
  const { customers, addCustomer, payCustomerDebt } = useApp();
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', address: '' });
  const [selected, setSelected] = useState<typeof customers[0] | null>(null);
  const [payAmount, setPayAmount] = useState('');

  const filtered = customers.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) || c.phone.includes(search)
  );

  const totalPiutang = customers.reduce((s, c) => s + c.piutang, 0);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    addCustomer(form);
    setForm({ name: '', phone: '', address: '' });
    setShowForm(false);
  };

  const handlePay = () => {
    if (!selected) return;
    const amount = parseInt(payAmount.replace(/\D/g, '')) || 0;
    if (amount <= 0) return;
    payCustomerDebt(selected.id, Math.min(amount, selected.piutang));
    setSelected(null);
    setPayAmount('');
  };

  const inputStyle = { width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #2a2d3e', background: '#0f1117', color: '#f0f2f5', fontSize: '13px', outline: 'none', boxSizing: 'border-box' as const };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#f0f2f5', margin: 0 }}>Pelanggan & Piutang</h1>
          <p style={{ fontSize: '13px', color: '#8b92a5', marginTop: '4px' }}>Bayar piutang otomatis tercatat di Arus Kas</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} style={{ padding: '8px 16px', borderRadius: '8px', background: '#f97316', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '14px' }}>+ Tambah Pelanggan</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '20px' }}>
        {[
          { label: 'Total Pelanggan', value: `${customers.length}`, color: '#f0f2f5' },
          { label: 'Total Piutang', value: fmt(totalPiutang), color: '#f59e0b' },
          { label: 'Ada Piutang', value: `${customers.filter(c => c.piutang > 0).length} pelanggan`, color: '#ef4444' },
        ].map(k => (
          <div key={k.label} style={{ padding: '18px 20px', borderRadius: '12px', border: '1px solid #2a2d3e', background: '#1e2130' }}>
            <div style={{ fontSize: '13px', color: '#8b92a5', marginBottom: '8px' }}>{k.label}</div>
            <div style={{ fontSize: '24px', fontWeight: 700, color: k.color }}>{k.value}</div>
          </div>
        ))}
      </div>

      {showForm && (
        <div style={{ padding: '18px 20px', borderRadius: '12px', border: '1px solid #2a2d3e', background: '#1e2130', marginBottom: '16px' }}>
          <h3 style={{ color: '#f0f2f5', fontWeight: 700, margin: '0 0 14px', fontSize: '14px' }}>Tambah Pelanggan</h3>
          <form onSubmit={handleAdd}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '12px' }}>
              {[['Nama Lengkap', 'name', 'text'], ['No. Telepon', 'phone', 'tel'], ['Alamat', 'address', 'text']].map(([label, key, type]) => (
                <div key={key}>
                  <label style={{ fontSize: '12px', color: '#8b92a5', display: 'block', marginBottom: '4px' }}>{label}</label>
                  <input required type={type} value={(form as any)[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} placeholder={label} style={inputStyle} />
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
            <h3 style={{ color: '#f0f2f5', margin: '0 0 14px' }}>Terima Bayar Piutang</h3>
            <div style={{ padding: '12px', borderRadius: '8px', background: '#0f1117', marginBottom: '14px' }}>
              <div style={{ fontSize: '13px', color: '#8b92a5' }}>Pelanggan</div>
              <div style={{ fontSize: '16px', fontWeight: 700, color: '#f0f2f5' }}>{selected.name}</div>
              <div style={{ fontSize: '13px', color: '#8b92a5', marginTop: '6px' }}>Sisa Piutang</div>
              <div style={{ fontSize: '22px', fontWeight: 700, color: '#f59e0b' }}>{fmt(selected.piutang)}</div>
            </div>
            <div style={{ marginBottom: '14px' }}>
              <label style={{ fontSize: '12px', color: '#8b92a5', display: 'block', marginBottom: '4px' }}>Jumlah Dibayar</label>
              <input value={payAmount} onChange={e => setPayAmount(e.target.value)} placeholder="Masukkan jumlah..." type="number"
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #2a2d3e', background: '#0f1117', color: '#f0f2f5', fontSize: '14px', outline: 'none', boxSizing: 'border-box' }} />
              <button onClick={() => setPayAmount(String(selected.piutang))} style={{ marginTop: '6px', padding: '4px 10px', borderRadius: '6px', background: 'rgba(249,115,22,0.15)', color: '#f97316', border: 'none', cursor: 'pointer', fontSize: '11px' }}>Lunas semua ({fmt(selected.piutang)})</button>
            </div>
            <div style={{ fontSize: '11px', color: '#22c55e', marginBottom: '14px' }}>✓ Pembayaran akan otomatis tercatat di Arus Kas</div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={handlePay} style={{ flex: 1, padding: '10px', borderRadius: '8px', background: '#f97316', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 700 }}>Konfirmasi Terima</button>
              <button onClick={() => { setSelected(null); setPayAmount(''); }} style={{ flex: 1, padding: '10px', borderRadius: '8px', background: '#2a2d3e', color: '#8b92a5', border: 'none', cursor: 'pointer' }}>Batal</button>
            </div>
          </div>
        </div>
      )}

      <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari nama atau nomor telepon..."
        style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #2a2d3e', background: '#1e2130', color: '#f0f2f5', fontSize: '13px', outline: 'none', marginBottom: '14px' }} />

      <div style={{ borderRadius: '12px', border: '1px solid #2a2d3e', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ background: '#1a1d27' }}>
            <tr>{['ID', 'Nama', 'Telepon', 'Alamat', 'Total Pembelian', 'Piutang', 'Terakhir Transaksi', 'Aksi'].map(h => (
              <th key={h} style={{ padding: '11px 14px', textAlign: 'left', fontSize: '11px', fontWeight: 600, color: '#8b92a5' }}>{h}</th>
            ))}</tr>
          </thead>
          <tbody>
            {filtered.map((c, i) => (
              <tr key={c.id} style={{ background: i % 2 === 0 ? '#1e2130' : '#1a1d27', borderBottom: '1px solid #2a2d3e' }}>
                <td style={{ padding: '10px 14px', fontSize: '11px', color: '#f97316', fontFamily: 'monospace' }}>{c.id}</td>
                <td style={{ padding: '10px 14px', fontSize: '14px', fontWeight: 600, color: '#f0f2f5' }}>{c.name}</td>
                <td style={{ padding: '10px 14px', fontSize: '13px', color: '#8b92a5' }}>{c.phone}</td>
                <td style={{ padding: '10px 14px', fontSize: '12px', color: '#5a6070' }}>{c.address}</td>
                <td style={{ padding: '10px 14px', fontSize: '13px', color: '#22c55e', fontWeight: 600 }}>{fmt(c.totalBeli)}</td>
                <td style={{ padding: '10px 14px', fontSize: '14px', fontWeight: 700, color: c.piutang > 0 ? '#f59e0b' : '#5a6070' }}>{c.piutang > 0 ? fmt(c.piutang) : '-'}</td>
                <td style={{ padding: '10px 14px', fontSize: '12px', color: '#5a6070' }}>{c.lastTrx}</td>
                <td style={{ padding: '10px 14px' }}>
                  {c.piutang > 0 && (
                    <button onClick={() => setSelected(c)} style={{ padding: '4px 10px', borderRadius: '6px', background: 'rgba(245,158,11,0.15)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.3)', cursor: 'pointer', fontSize: '11px', fontWeight: 600 }}>Terima Bayar</button>
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

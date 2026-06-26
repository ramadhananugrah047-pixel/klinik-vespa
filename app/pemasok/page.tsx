'use client';
import { useState } from 'react';

const fmt = (n: number) => 'Rp ' + n.toLocaleString('id-ID');

const initSuppliers = [
  { id: 'PMS-001', name: 'PT Piaggio Distributor', contact: 'Bpk. Andi', phone: '0800-1234-5678', city: 'Jakarta', hutang: 3500000, jatuhTempo: '26 Jul 2026', totalBeli: 12500000 },
  { id: 'PMS-002', name: 'UD Vespa Jaya', contact: 'Ibu Sari', phone: '0811-9876-5432', city: 'Makassar', hutang: 850000, jatuhTempo: '15 Jul 2026', totalBeli: 5800000 },
  { id: 'PMS-003', name: 'CV Motor Parts', contact: 'Bpk. Rudi', phone: '0813-1111-2222', city: 'Surabaya', hutang: 0, jatuhTempo: '-', totalBeli: 3200000 },
  { id: 'PMS-004', name: 'Toko Sparepart Sentani', contact: 'Bpk. Johan', phone: '0812-5555-6666', city: 'Sentani', hutang: 0, jatuhTempo: '-', totalBeli: 1500000 },
];

export default function PemasokPage() {
  const [suppliers, setSuppliers] = useState(initSuppliers);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({ name: '', contact: '', phone: '', city: '' });
  const [selected, setSelected] = useState<typeof initSuppliers[0] | null>(null);
  const [payAmount, setPayAmount] = useState('');

  const filtered = suppliers.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) || s.city.toLowerCase().includes(search.toLowerCase())
  );

  const totalHutang = suppliers.reduce((s, p) => s + p.hutang, 0);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    setSuppliers([...suppliers, { ...form, id: `PMS-${String(suppliers.length + 1).padStart(3, '0')}`, hutang: 0, jatuhTempo: '-', totalBeli: 0 }]);
    setForm({ name: '', contact: '', phone: '', city: '' });
    setShowForm(false);
  };

  const handlePay = () => {
    if (!selected) return;
    const amount = parseInt(payAmount.replace(/\D/g, '')) || 0;
    setSuppliers(suppliers.map(s => s.id === selected.id ? { ...s, hutang: Math.max(0, s.hutang - amount), jatuhTempo: Math.max(0, s.hutang - amount) === 0 ? '-' : s.jatuhTempo } : s));
    setSelected(null);
    setPayAmount('');
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#f0f2f5', margin: 0 }}>Pemasok & Hutang</h1>
          <p style={{ fontSize: '13px', color: '#8b92a5', marginTop: '4px' }}>Data pemasok dan tagihan hutang dagang</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} style={{ padding: '8px 16px', borderRadius: '8px', background: '#f97316', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '14px' }}>
          + Tambah Pemasok
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
        <div style={{ padding: '20px', borderRadius: '12px', border: '1px solid #2a2d3e', background: '#1e2130' }}>
          <div style={{ fontSize: '13px', color: '#8b92a5', marginBottom: '8px' }}>Total Pemasok</div>
          <div style={{ fontSize: '28px', fontWeight: 700, color: '#f0f2f5' }}>{suppliers.length}</div>
        </div>
        <div style={{ padding: '20px', borderRadius: '12px', border: '1px solid #2a2d3e', background: '#1e2130' }}>
          <div style={{ fontSize: '13px', color: '#8b92a5', marginBottom: '8px' }}>Total Hutang Dagang</div>
          <div style={{ fontSize: '28px', fontWeight: 700, color: '#ef4444' }}>{fmt(totalHutang)}</div>
        </div>
        <div style={{ padding: '20px', borderRadius: '12px', border: '1px solid #2a2d3e', background: '#1e2130' }}>
          <div style={{ fontSize: '13px', color: '#8b92a5', marginBottom: '8px' }}>Pemasok Ada Hutang</div>
          <div style={{ fontSize: '28px', fontWeight: 700, color: '#f59e0b' }}>{suppliers.filter(s => s.hutang > 0).length}</div>
        </div>
      </div>

      {showForm && (
        <div style={{ padding: '20px', borderRadius: '12px', border: '1px solid #2a2d3e', background: '#1e2130', marginBottom: '20px' }}>
          <h2 style={{ color: '#f0f2f5', fontWeight: 700, marginBottom: '16px', marginTop: 0 }}>Tambah Pemasok Baru</h2>
          <form onSubmit={handleAdd}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '12px' }}>
              {[['Nama Pemasok', 'name'], ['Nama Kontak', 'contact'], ['No. Telepon', 'phone'], ['Kota', 'city']].map(([label, key]) => (
                <div key={key}>
                  <label style={{ fontSize: '12px', color: '#8b92a5', display: 'block', marginBottom: '4px' }}>{label}</label>
                  <input required value={(form as any)[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} placeholder={label}
                    style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #2a2d3e', background: '#0f1117', color: '#f0f2f5', fontSize: '13px', outline: 'none' }} />
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button type="submit" style={{ padding: '8px 20px', borderRadius: '8px', background: '#f97316', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Simpan</button>
              <button type="button" onClick={() => setShowForm(false)} style={{ padding: '8px 20px', borderRadius: '8px', background: '#2a2d3e', color: '#8b92a5', border: 'none', cursor: 'pointer' }}>Batal</button>
            </div>
          </form>
        </div>
      )}

      {selected && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
          <div style={{ background: '#1e2130', borderRadius: '16px', padding: '24px', width: '360px', border: '1px solid #2a2d3e' }}>
            <h3 style={{ color: '#f0f2f5', margin: '0 0 16px' }}>Bayar Hutang - {selected.name}</h3>
            <div style={{ marginBottom: '12px' }}>
              <div style={{ fontSize: '13px', color: '#8b92a5' }}>Sisa hutang:</div>
              <div style={{ fontSize: '20px', fontWeight: 700, color: '#ef4444' }}>{fmt(selected.hutang)}</div>
              <div style={{ fontSize: '12px', color: '#5a6070', marginTop: '4px' }}>Jatuh tempo: {selected.jatuhTempo}</div>
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ fontSize: '12px', color: '#8b92a5', display: 'block', marginBottom: '4px' }}>Jumlah Bayar</label>
              <input value={payAmount} onChange={e => setPayAmount(e.target.value)} placeholder="Masukkan jumlah..." type="number"
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #2a2d3e', background: '#0f1117', color: '#f0f2f5', fontSize: '14px', outline: 'none' }} />
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={handlePay} style={{ flex: 1, padding: '10px', borderRadius: '8px', background: '#f97316', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 700 }}>Konfirmasi Bayar</button>
              <button onClick={() => { setSelected(null); setPayAmount(''); }} style={{ flex: 1, padding: '10px', borderRadius: '8px', background: '#2a2d3e', color: '#8b92a5', border: 'none', cursor: 'pointer' }}>Batal</button>
            </div>
          </div>
        </div>
      )}

      <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari nama pemasok atau kota..."
        style={{ width: '100%', padding: '10px 16px', borderRadius: '8px', border: '1px solid #2a2d3e', background: '#1e2130', color: '#f0f2f5', fontSize: '14px', outline: 'none', marginBottom: '16px' }} />

      <div style={{ borderRadius: '12px', border: '1px solid #2a2d3e', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ background: '#1a1d27' }}>
            <tr>
              {['ID', 'Nama Pemasok', 'Kontak', 'Telepon', 'Kota', 'Total Pembelian', 'Hutang', 'Jatuh Tempo', 'Aksi'].map(h => (
                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: '#8b92a5' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((s, i) => (
              <tr key={s.id} style={{ background: i % 2 === 0 ? '#1e2130' : '#1a1d27', borderBottom: '1px solid #2a2d3e' }}>
                <td style={{ padding: '12px 16px', fontSize: '12px', color: '#f97316', fontFamily: 'monospace' }}>{s.id}</td>
                <td style={{ padding: '12px 16px', fontSize: '14px', fontWeight: 600, color: '#f0f2f5' }}>{s.name}</td>
                <td style={{ padding: '12px 16px', fontSize: '13px', color: '#8b92a5' }}>{s.contact}</td>
                <td style={{ padding: '12px 16px', fontSize: '13px', color: '#8b92a5' }}>{s.phone}</td>
                <td style={{ padding: '12px 16px', fontSize: '13px', color: '#5a6070' }}>{s.city}</td>
                <td style={{ padding: '12px 16px', fontSize: '13px', color: '#22c55e', fontWeight: 600 }}>{fmt(s.totalBeli)}</td>
                <td style={{ padding: '12px 16px', fontSize: '14px', fontWeight: 700, color: s.hutang > 0 ? '#ef4444' : '#5a6070' }}>
                  {s.hutang > 0 ? fmt(s.hutang) : '-'}
                </td>
                <td style={{ padding: '12px 16px', fontSize: '12px', color: s.hutang > 0 ? '#f59e0b' : '#5a6070' }}>{s.jatuhTempo}</td>
                <td style={{ padding: '12px 16px' }}>
                  {s.hutang > 0 && (
                    <button onClick={() => setSelected(s)} style={{ padding: '4px 10px', borderRadius: '6px', background: 'rgba(239,68,68,0.15)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)', cursor: 'pointer', fontSize: '11px', fontWeight: 600 }}>
                      Bayar
                    </button>
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

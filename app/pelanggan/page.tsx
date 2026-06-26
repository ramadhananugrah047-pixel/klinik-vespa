'use client';
import { useState } from 'react';

const fmt = (n: number) => 'Rp ' + n.toLocaleString('id-ID');

const initCustomers = [
  { id: 'PLG-001', name: 'Rafi Maulana', phone: '0812-3456-7890', address: 'Jl. Sentani Kota No.12', totalBeli: 3250000, piutang: 350000, lastTrx: '27 Jun 2026' },
  { id: 'PLG-002', name: 'Dian Kusuma', phone: '0813-5678-9012', address: 'Jl. Kemiri No.8, Sentani', totalBeli: 1850000, piutang: 275000, lastTrx: '27 Jun 2026' },
  { id: 'PLG-003', name: 'Hendra Pratama', phone: '0811-2345-6789', address: 'Jl. Abepura, Jayapura', totalBeli: 2100000, piutang: 250000, lastTrx: '26 Jun 2026' },
  { id: 'PLG-004', name: 'Budi Santoso', phone: '0822-1111-2222', address: 'Jl. Raya Depapre', totalBeli: 950000, piutang: 0, lastTrx: '25 Jun 2026' },
  { id: 'PLG-005', name: 'Siti Rahma', phone: '0831-4444-5555', address: 'Jl. Ifar Gunung', totalBeli: 1450000, piutang: 0, lastTrx: '22 Jun 2026' },
];

export default function PelangganPage() {
  const [customers, setCustomers] = useState(initCustomers);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState('');
  const [form, setForm] = useState({ name: '', phone: '', address: '' });
  const [selected, setSelected] = useState<typeof initCustomers[0] | null>(null);
  const [payAmount, setPayAmount] = useState('');

  const filtered = customers.filter(c =>
    c.name.toLowerCase().includes(search.toLowerCase()) || c.phone.includes(search)
  );

  const totalPiutang = customers.reduce((s, c) => s + c.piutang, 0);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    setCustomers([...customers, { ...form, id: `PLG-${String(customers.length + 1).padStart(3, '0')}`, totalBeli: 0, piutang: 0, lastTrx: '-' }]);
    setForm({ name: '', phone: '', address: '' });
    setShowForm(false);
  };

  const handlePay = () => {
    if (!selected) return;
    const amount = parseInt(payAmount.replace(/\D/g, '')) || 0;
    setCustomers(customers.map(c => c.id === selected.id ? { ...c, piutang: Math.max(0, c.piutang - amount) } : c));
    setSelected(null);
    setPayAmount('');
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#f0f2f5', margin: 0 }}>Pelanggan & Piutang</h1>
          <p style={{ fontSize: '13px', color: '#8b92a5', marginTop: '4px' }}>Data pelanggan dan tagihan piutang</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} style={{ padding: '8px 16px', borderRadius: '8px', background: '#f97316', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '14px' }}>
          + Tambah Pelanggan
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
        <div style={{ padding: '20px', borderRadius: '12px', border: '1px solid #2a2d3e', background: '#1e2130' }}>
          <div style={{ fontSize: '13px', color: '#8b92a5', marginBottom: '8px' }}>Total Pelanggan</div>
          <div style={{ fontSize: '28px', fontWeight: 700, color: '#f0f2f5' }}>{customers.length}</div>
        </div>
        <div style={{ padding: '20px', borderRadius: '12px', border: '1px solid #2a2d3e', background: '#1e2130' }}>
          <div style={{ fontSize: '13px', color: '#8b92a5', marginBottom: '8px' }}>Total Piutang Belum Lunas</div>
          <div style={{ fontSize: '28px', fontWeight: 700, color: '#f59e0b' }}>{fmt(totalPiutang)}</div>
        </div>
        <div style={{ padding: '20px', borderRadius: '12px', border: '1px solid #2a2d3e', background: '#1e2130' }}>
          <div style={{ fontSize: '13px', color: '#8b92a5', marginBottom: '8px' }}>Pelanggan Ada Hutang</div>
          <div style={{ fontSize: '28px', fontWeight: 700, color: '#ef4444' }}>{customers.filter(c => c.piutang > 0).length}</div>
        </div>
      </div>

      {showForm && (
        <div style={{ padding: '20px', borderRadius: '12px', border: '1px solid #2a2d3e', background: '#1e2130', marginBottom: '20px' }}>
          <h2 style={{ color: '#f0f2f5', fontWeight: 700, marginBottom: '16px', marginTop: 0 }}>Tambah Pelanggan Baru</h2>
          <form onSubmit={handleAdd}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '12px' }}>
              {[['Nama Lengkap', 'name', 'text'], ['No. Telepon', 'phone', 'tel'], ['Alamat', 'address', 'text']].map(([label, key, type]) => (
                <div key={key}>
                  <label style={{ fontSize: '12px', color: '#8b92a5', display: 'block', marginBottom: '4px' }}>{label}</label>
                  <input required type={type} value={(form as any)[key]} onChange={e => setForm({ ...form, [key]: e.target.value })} placeholder={label}
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
            <h3 style={{ color: '#f0f2f5', margin: '0 0 16px' }}>Bayar Piutang - {selected.name}</h3>
            <div style={{ marginBottom: '12px' }}>
              <div style={{ fontSize: '13px', color: '#8b92a5' }}>Sisa piutang:</div>
              <div style={{ fontSize: '20px', fontWeight: 700, color: '#f59e0b' }}>{fmt(selected.piutang)}</div>
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

      <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari nama atau nomor telepon..."
        style={{ width: '100%', padding: '10px 16px', borderRadius: '8px', border: '1px solid #2a2d3e', background: '#1e2130', color: '#f0f2f5', fontSize: '14px', outline: 'none', marginBottom: '16px' }} />

      <div style={{ borderRadius: '12px', border: '1px solid #2a2d3e', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ background: '#1a1d27' }}>
            <tr>
              {['ID', 'Nama', 'Telepon', 'Alamat', 'Total Pembelian', 'Piutang', 'Terakhir Transaksi', 'Aksi'].map(h => (
                <th key={h} style={{ padding: '12px 16px', textAlign: 'left', fontSize: '12px', fontWeight: 600, color: '#8b92a5' }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((c, i) => (
              <tr key={c.id} style={{ background: i % 2 === 0 ? '#1e2130' : '#1a1d27', borderBottom: '1px solid #2a2d3e' }}>
                <td style={{ padding: '12px 16px', fontSize: '12px', color: '#f97316', fontFamily: 'monospace' }}>{c.id}</td>
                <td style={{ padding: '12px 16px', fontSize: '14px', fontWeight: 600, color: '#f0f2f5' }}>{c.name}</td>
                <td style={{ padding: '12px 16px', fontSize: '13px', color: '#8b92a5' }}>{c.phone}</td>
                <td style={{ padding: '12px 16px', fontSize: '12px', color: '#5a6070' }}>{c.address}</td>
                <td style={{ padding: '12px 16px', fontSize: '13px', color: '#22c55e', fontWeight: 600 }}>{fmt(c.totalBeli)}</td>
                <td style={{ padding: '12px 16px', fontSize: '14px', fontWeight: 700, color: c.piutang > 0 ? '#f59e0b' : '#5a6070' }}>
                  {c.piutang > 0 ? fmt(c.piutang) : '-'}
                </td>
                <td style={{ padding: '12px 16px', fontSize: '12px', color: '#5a6070' }}>{c.lastTrx}</td>
                <td style={{ padding: '12px 16px' }}>
                  {c.piutang > 0 && (
                    <button onClick={() => setSelected(c)} style={{ padding: '4px 10px', borderRadius: '6px', background: 'rgba(245,158,11,0.15)', color: '#f59e0b', border: '1px solid rgba(245,158,11,0.3)', cursor: 'pointer', fontSize: '11px', fontWeight: 600 }}>
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

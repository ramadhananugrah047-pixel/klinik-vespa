'use client';
import { useState } from 'react';
import { useApp } from '@/contexts/AppContext';

const fmt = (n: number) => 'Rp ' + n.toLocaleString('id-ID');
const manualCats = { Masuk: ['Jasa Servis', 'Piutang Diterima', 'Lainnya'], Keluar: ['Operasional', 'Gaji', 'Lainnya'] };
type EntryType = 'Masuk' | 'Keluar';

export default function ArusKasPage() {
  const { cashFlow, addCashEntry } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ desc: '', type: 'Masuk' as EntryType, cat: '', amount: '' });

  const totalMasuk = cashFlow.filter(e => e.type === 'Masuk').reduce((s, e) => s + e.amount, 0);
  const totalKeluar = cashFlow.filter(e => e.type === 'Keluar').reduce((s, e) => s + e.amount, 0);
  const saldo = totalMasuk - totalKeluar;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addCashEntry({
      date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
      desc: form.desc, type: form.type, cat: form.cat,
      amount: parseInt(form.amount.replace(/\D/g, '')) || 0, ref: '',
    });
    setForm({ desc: '', type: 'Masuk', cat: '', amount: '' });
    setShowForm(false);
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '24px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#f0f2f5', margin: 0 }}>Arus Kas</h1>
          <p style={{ fontSize: '13px', color: '#8b92a5', marginTop: '4px' }}>Otomatis tercatat dari transaksi kasir & pembelian stok</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} style={{ padding: '8px 16px', borderRadius: '8px', background: '#f97316', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 600 }}>+ Catat Manual</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '20px' }}>
        <div style={{ padding: '18px 20px', borderRadius: '12px', border: '1px solid #2a2d3e', background: '#1e2130' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '13px', color: '#8b92a5' }}>Total Uang Masuk</span><span style={{ fontSize: '20px' }}>📈</span>
          </div>
          <div style={{ fontSize: '22px', fontWeight: 700, color: '#22c55e' }}>{fmt(totalMasuk)}</div>
          <div style={{ fontSize: '11px', color: '#5a6070', marginTop: '4px' }}>{cashFlow.filter(e => e.type === 'Masuk').length} transaksi</div>
        </div>
        <div style={{ padding: '18px 20px', borderRadius: '12px', border: '1px solid #2a2d3e', background: '#1e2130' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '13px', color: '#8b92a5' }}>Total Uang Keluar</span><span style={{ fontSize: '20px' }}>📉</span>
          </div>
          <div style={{ fontSize: '22px', fontWeight: 700, color: '#ef4444' }}>{fmt(totalKeluar)}</div>
          <div style={{ fontSize: '11px', color: '#5a6070', marginTop: '4px' }}>{cashFlow.filter(e => e.type === 'Keluar').length} transaksi</div>
        </div>
        <div style={{ padding: '18px 20px', borderRadius: '12px', border: '1px solid #2a2d3e', background: '#1e2130' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            <span style={{ fontSize: '13px', color: '#8b92a5' }}>Saldo Bersih</span><span style={{ fontSize: '20px' }}>💰</span>
          </div>
          <div style={{ fontSize: '22px', fontWeight: 700, color: saldo >= 0 ? '#f97316' : '#ef4444' }}>{fmt(saldo)}</div>
        </div>
      </div>

      {showForm && (
        <div style={{ padding: '18px 20px', borderRadius: '12px', border: '1px solid #2a2d3e', background: '#1e2130', marginBottom: '16px' }}>
          <h3 style={{ color: '#f0f2f5', fontWeight: 700, margin: '0 0 14px', fontSize: '14px' }}>Catat Arus Kas Manual</h3>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '12px' }}>
              <div>
                <label style={{ fontSize: '12px', color: '#8b92a5', display: 'block', marginBottom: '4px' }}>Jenis</label>
                <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value as EntryType, cat: '' })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #2a2d3e', background: '#0f1117', color: '#f0f2f5', fontSize: '13px', outline: 'none' }}>
                  <option>Masuk</option><option>Keluar</option>
                </select>
              </div>
              <div>
                <label style={{ fontSize: '12px', color: '#8b92a5', display: 'block', marginBottom: '4px' }}>Kategori</label>
                <select required value={form.cat} onChange={e => setForm({ ...form, cat: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #2a2d3e', background: '#0f1117', color: '#f0f2f5', fontSize: '13px', outline: 'none' }}>
                  <option value="">Pilih</option>
                  {manualCats[form.type].map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: '12px', color: '#8b92a5', display: 'block', marginBottom: '4px' }}>Jumlah (Rp)</label>
                <input required type="number" min="0" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} placeholder="0"
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #2a2d3e', background: '#0f1117', color: '#f0f2f5', fontSize: '13px', outline: 'none' }} />
              </div>
              <div>
                <label style={{ fontSize: '12px', color: '#8b92a5', display: 'block', marginBottom: '4px' }}>Keterangan</label>
                <input required value={form.desc} onChange={e => setForm({ ...form, desc: e.target.value })} placeholder="Deskripsi..."
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #2a2d3e', background: '#0f1117', color: '#f0f2f5', fontSize: '13px', outline: 'none' }} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button type="submit" style={{ padding: '8px 20px', borderRadius: '8px', background: '#f97316', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 600 }}>Simpan</button>
              <button type="button" onClick={() => setShowForm(false)} style={{ padding: '8px 18px', borderRadius: '8px', background: '#2a2d3e', color: '#8b92a5', border: 'none', cursor: 'pointer' }}>Batal</button>
            </div>
          </form>
        </div>
      )}

      <div style={{ borderRadius: '12px', border: '1px solid #2a2d3e', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ background: '#1a1d27' }}>
            <tr>{['Tanggal', 'Keterangan', 'Kategori', 'Ref', 'Jenis', 'Jumlah'].map(h => (
              <th key={h} style={{ padding: '11px 14px', textAlign: 'left', fontSize: '11px', fontWeight: 600, color: '#8b92a5' }}>{h}</th>
            ))}</tr>
          </thead>
          <tbody>
            {cashFlow.map((e, i) => (
              <tr key={e.id} style={{ background: i % 2 === 0 ? '#1e2130' : '#1a1d27', borderBottom: '1px solid #2a2d3e' }}>
                <td style={{ padding: '10px 14px', fontSize: '12px', color: '#8b92a5' }}>{e.date}</td>
                <td style={{ padding: '10px 14px', fontSize: '13px', color: '#f0f2f5' }}>{e.desc}</td>
                <td style={{ padding: '10px 14px', fontSize: '12px', color: '#8b92a5' }}>{e.cat}</td>
                <td style={{ padding: '10px 14px', fontSize: '11px', color: '#5a6070', fontFamily: 'monospace' }}>{e.ref || '-'}</td>
                <td style={{ padding: '10px 14px' }}>
                  <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '4px', fontWeight: 700, background: e.type === 'Masuk' ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)', color: e.type === 'Masuk' ? '#22c55e' : '#ef4444' }}>
                    {e.type === 'Masuk' ? '↑ Masuk' : '↓ Keluar'}
                  </span>
                </td>
                <td style={{ padding: '10px 14px', fontSize: '14px', fontWeight: 700, color: e.type === 'Masuk' ? '#22c55e' : '#ef4444' }}>
                  {e.type === 'Masuk' ? '+' : '-'}{fmt(e.amount)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

'use client';
import { useState } from 'react';

export default function PengaturanPage() {
  const [store, setStore] = useState({
    name: 'Klinik Vespa',
    address: 'Jl. Raya Sentani No. 88, Sentani, Jayapura, Papua',
    phone: '0811-4888-7777',
    email: 'klinikvestpa.sentani@gmail.com',
    owner: 'Anugrah Ramadhan',
    taxId: '12.345.678.9-001.000',
  });

  const [printerOn, setPrinterOn] = useState(true);
  const [notifOn, setNotifOn] = useState(true);
  const [autoBackup, setAutoBackup] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const users = [
    { name: 'Anugrah Ramadhan', role: 'Super Admin', email: 'ramadhananugrah047@gmail.com', status: 'Aktif' },
    { name: 'Karyawan 1', role: 'Kasir', email: 'kasir@klinik-vespa.com', status: 'Aktif' },
  ];

  const Toggle = ({ on, onToggle }: { on: boolean; onToggle: () => void }) => (
    <button onClick={onToggle} style={{ width: '44px', height: '24px', borderRadius: '12px', background: on ? '#f97316' : '#2a2d3e', border: 'none', cursor: 'pointer', position: 'relative', transition: 'background 0.2s' }}>
      <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: '#fff', position: 'absolute', top: '3px', left: on ? '23px' : '3px', transition: 'left 0.2s' }}></div>
    </button>
  );

  return (
    <div style={{ maxWidth: '800px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#f0f2f5', margin: 0 }}>Pengaturan</h1>
        <p style={{ fontSize: '13px', color: '#8b92a5', marginTop: '4px' }}>Konfigurasi toko dan sistem Klinik Vespa</p>
      </div>

      {/* Store Info */}
      <div style={{ padding: '20px', borderRadius: '12px', border: '1px solid #2a2d3e', background: '#1e2130', marginBottom: '20px' }}>
        <h2 style={{ color: '#f0f2f5', fontWeight: 700, fontSize: '16px', marginTop: 0, marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          🏪 Informasi Toko
        </h2>
        <form onSubmit={handleSave}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
            {[
              ['Nama Toko', 'name'],
              ['Nama Pemilik', 'owner'],
              ['No. Telepon', 'phone'],
              ['Email', 'email'],
              ['NPWP', 'taxId'],
            ].map(([label, key]) => (
              <div key={key}>
                <label style={{ fontSize: '12px', color: '#8b92a5', display: 'block', marginBottom: '4px' }}>{label}</label>
                <input value={(store as any)[key]} onChange={e => setStore({ ...store, [key]: e.target.value })}
                  style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #2a2d3e', background: '#0f1117', color: '#f0f2f5', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }} />
              </div>
            ))}
            <div>
              <label style={{ fontSize: '12px', color: '#8b92a5', display: 'block', marginBottom: '4px' }}>Alamat Lengkap</label>
              <textarea value={store.address} onChange={e => setStore({ ...store, address: e.target.value })} rows={2}
                style={{ width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #2a2d3e', background: '#0f1117', color: '#f0f2f5', fontSize: '13px', outline: 'none', resize: 'none', boxSizing: 'border-box' }} />
            </div>
          </div>
          <button type="submit" style={{ padding: '8px 24px', borderRadius: '8px', background: saved ? '#22c55e' : '#f97316', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '13px', transition: 'background 0.2s' }}>
            {saved ? '✓ Tersimpan!' : 'Simpan Perubahan'}
          </button>
        </form>
      </div>

      {/* System Settings */}
      <div style={{ padding: '20px', borderRadius: '12px', border: '1px solid #2a2d3e', background: '#1e2130', marginBottom: '20px' }}>
        <h2 style={{ color: '#f0f2f5', fontWeight: 700, fontSize: '16px', marginTop: 0, marginBottom: '16px' }}>⚙️ Pengaturan Sistem</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {[
            { label: 'Printer Struk', desc: 'Cetak struk otomatis saat transaksi selesai', on: printerOn, toggle: () => setPrinterOn(!printerOn) },
            { label: 'Notifikasi Stok', desc: 'Tampilkan peringatan saat stok mencapai batas minimum', on: notifOn, toggle: () => setNotifOn(!notifOn) },
            { label: 'Backup Otomatis', desc: 'Backup data setiap hari jam 00:00 WIT', on: autoBackup, toggle: () => setAutoBackup(!autoBackup) },
          ].map(s => (
            <div key={s.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '16px', borderBottom: '1px solid #2a2d3e' }}>
              <div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: '#f0f2f5' }}>{s.label}</div>
                <div style={{ fontSize: '12px', color: '#8b92a5', marginTop: '2px' }}>{s.desc}</div>
              </div>
              <Toggle on={s.on} onToggle={s.toggle} />
            </div>
          ))}
        </div>
      </div>

      {/* User Management */}
      <div style={{ padding: '20px', borderRadius: '12px', border: '1px solid #2a2d3e', background: '#1e2130', marginBottom: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ color: '#f0f2f5', fontWeight: 700, fontSize: '16px', margin: 0 }}>👤 Manajemen Pengguna</h2>
          <button style={{ padding: '6px 14px', borderRadius: '6px', background: '#f97316', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '12px' }}>
            + Tambah User
          </button>
        </div>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid #2a2d3e' }}>
              {['Nama', 'Role', 'Email', 'Status'].map(h => (
                <th key={h} style={{ padding: '10px 0', textAlign: 'left', fontSize: '12px', color: '#8b92a5', fontWeight: 600 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map(u => (
              <tr key={u.email} style={{ borderBottom: '1px solid #2a2d3e' }}>
                <td style={{ padding: '12px 0', fontSize: '14px', fontWeight: 600, color: '#f0f2f5' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#f97316', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#fff', fontSize: '13px' }}>
                      {u.name[0]}
                    </div>
                    {u.name}
                  </div>
                </td>
                <td style={{ padding: '12px 0', fontSize: '12px', color: '#f97316', fontWeight: 600 }}>{u.role}</td>
                <td style={{ padding: '12px 0', fontSize: '13px', color: '#8b92a5' }}>{u.email}</td>
                <td style={{ padding: '12px 0' }}>
                  <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '4px', fontWeight: 700, background: 'rgba(34,197,94,0.15)', color: '#22c55e' }}>{u.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* App Info */}
      <div style={{ padding: '16px 20px', borderRadius: '12px', border: '1px solid #2a2d3e', background: '#1e2130', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: '13px', fontWeight: 600, color: '#f0f2f5' }}>Klinik Vespa Management System</div>
          <div style={{ fontSize: '12px', color: '#5a6070', marginTop: '2px' }}>Versi 0.1.0 · Dibangun dengan Next.js + Supabase</div>
        </div>
        <div style={{ fontSize: '24px' }}>🏍️</div>
      </div>
    </div>
  );
}

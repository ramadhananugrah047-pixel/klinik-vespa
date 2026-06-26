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

  const [printer, setPrinter] = useState({
    type: 'thermal',
    paperSize: '80mm',
    connected: false,
    printerName: '',
    showLogo: true,
    showAddress: true,
    showFooter: true,
    footerText: 'Terima kasih sudah berbelanja di Klinik Vespa!',
    copies: 1,
  });

  const [notifOn, setNotifOn] = useState(true);
  const [autoBackup, setAutoBackup] = useState(false);
  const [saved, setSaved] = useState(false);
  const [activeSection, setActiveSection] = useState<'toko' | 'printer' | 'user' | 'sistem'>('toko');
  const [showPreview, setShowPreview] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const users = [
    { name: 'Anugrah Ramadhan', role: 'Super Admin', email: 'ramadhananugrah047@gmail.com', status: 'Aktif' },
    { name: 'Kasir 1', role: 'Kasir', email: 'kasir@klinik-vespa.com', status: 'Aktif' },
  ];

  const Toggle = ({ on, onToggle }: { on: boolean; onToggle: () => void }) => (
    <button onClick={onToggle} style={{ width: '44px', height: '24px', borderRadius: '12px', background: on ? '#f97316' : '#2a2d3e', border: 'none', cursor: 'pointer', position: 'relative', transition: 'background 0.2s', flexShrink: 0 }}>
      <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: '#fff', position: 'absolute', top: '3px', left: on ? '23px' : '3px', transition: 'left 0.2s' }}></div>
    </button>
  );

  const inputStyle = { width: '100%', padding: '8px 12px', borderRadius: '8px', border: '1px solid #2a2d3e', background: '#0f1117', color: '#f0f2f5', fontSize: '13px', outline: 'none', boxSizing: 'border-box' as const };

  const sections = [
    { key: 'toko', label: '🏪 Informasi Toko' },
    { key: 'printer', label: '🖨️ Pengaturan Printer' },
    { key: 'user', label: '👤 Pengguna' },
    { key: 'sistem', label: '⚙️ Sistem' },
  ];

  return (
    <div style={{ display: 'flex', gap: '20px' }}>
      {/* Sidebar nav */}
      <div style={{ width: '200px', flexShrink: 0 }}>
        <div style={{ padding: '16px', borderRadius: '12px', border: '1px solid #2a2d3e', background: '#1e2130' }}>
          <div style={{ fontSize: '11px', color: '#5a6070', fontWeight: 600, marginBottom: '8px', letterSpacing: '0.06em' }}>PENGATURAN</div>
          {sections.map(s => (
            <button key={s.key} onClick={() => setActiveSection(s.key as any)}
              style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: 'none', cursor: 'pointer', textAlign: 'left', fontSize: '13px', fontWeight: activeSection === s.key ? 700 : 400, background: activeSection === s.key ? 'rgba(249,115,22,0.15)' : 'transparent', color: activeSection === s.key ? '#f97316' : '#8b92a5', marginBottom: '2px', borderLeft: activeSection === s.key ? '3px solid #f97316' : '3px solid transparent' }}>
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div style={{ flex: 1 }}>

        {/* ===== TOKO ===== */}
        {activeSection === 'toko' && (
          <div style={{ padding: '20px', borderRadius: '12px', border: '1px solid #2a2d3e', background: '#1e2130' }}>
            <h2 style={{ color: '#f0f2f5', fontWeight: 700, margin: '0 0 20px', fontSize: '16px' }}>🏪 Informasi Toko</h2>
            <form onSubmit={handleSave}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                {[['Nama Toko', 'name'], ['Nama Pemilik', 'owner'], ['No. Telepon', 'phone'], ['Email', 'email'], ['NPWP', 'taxId']].map(([label, key]) => (
                  <div key={key}>
                    <label style={{ fontSize: '12px', color: '#8b92a5', display: 'block', marginBottom: '4px' }}>{label}</label>
                    <input value={(store as any)[key]} onChange={e => setStore({ ...store, [key]: e.target.value })} style={inputStyle} />
                  </div>
                ))}
                <div>
                  <label style={{ fontSize: '12px', color: '#8b92a5', display: 'block', marginBottom: '4px' }}>Alamat Lengkap</label>
                  <textarea value={store.address} onChange={e => setStore({ ...store, address: e.target.value })} rows={2}
                    style={{ ...inputStyle, resize: 'none' }} />
                </div>
              </div>
              <button type="submit" style={{ padding: '9px 24px', borderRadius: '8px', background: saved ? '#22c55e' : '#f97316', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 700, transition: 'background 0.2s' }}>
                {saved ? '✓ Tersimpan!' : 'Simpan Perubahan'}
              </button>
            </form>
          </div>
        )}

        {/* ===== PRINTER ===== */}
        {activeSection === 'printer' && (
          <div>
            <div style={{ padding: '20px', borderRadius: '12px', border: '1px solid #2a2d3e', background: '#1e2130', marginBottom: '16px' }}>
              <h2 style={{ color: '#f0f2f5', fontWeight: 700, margin: '0 0 16px', fontSize: '16px' }}>🖨️ Koneksi Printer</h2>

              {/* Status */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '10px', background: '#0f1117', border: '1px solid #2a2d3e', marginBottom: '16px' }}>
                <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: printer.connected ? '#22c55e' : '#ef4444', flexShrink: 0, boxShadow: printer.connected ? '0 0 8px #22c55e' : 'none' }}></div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '13px', fontWeight: 600, color: '#f0f2f5' }}>
                    {printer.connected ? `Terhubung: ${printer.printerName || 'Printer Thermal'}` : 'Tidak Ada Printer Terhubung'}
                  </div>
                  <div style={{ fontSize: '11px', color: '#5a6070', marginTop: '2px' }}>
                    {printer.connected ? `Tipe: ${printer.type === 'thermal' ? 'Thermal' : 'Inkjet/Laser'} · Kertas: ${printer.paperSize}` : 'Klik Deteksi Printer untuk mencari printer'}
                  </div>
                </div>
                <button onClick={() => setPrinter(p => ({ ...p, connected: !p.connected, printerName: !p.connected ? 'POS-80 Thermal' : '' }))}
                  style={{ padding: '6px 14px', borderRadius: '8px', background: printer.connected ? 'rgba(239,68,68,0.15)' : '#f97316', color: printer.connected ? '#ef4444' : '#fff', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}>
                  {printer.connected ? 'Putuskan' : '🔍 Deteksi Printer'}
                </button>
              </div>

              {/* Printer type & paper */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                <div>
                  <label style={{ fontSize: '12px', color: '#8b92a5', display: 'block', marginBottom: '6px' }}>Tipe Printer</label>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    {[['thermal', '🧾 Thermal (Struk)'], ['laser', '🖨️ Inkjet/Laser (A4)']].map(([val, label]) => (
                      <button key={val} type="button" onClick={() => setPrinter(p => ({ ...p, type: val, paperSize: val === 'thermal' ? '80mm' : 'A4' }))}
                        style={{ flex: 1, padding: '8px 6px', borderRadius: '8px', border: '1px solid #2a2d3e', cursor: 'pointer', fontSize: '11px', fontWeight: 600, background: printer.type === val ? 'rgba(249,115,22,0.15)' : '#0f1117', color: printer.type === val ? '#f97316' : '#8b92a5' }}>
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: '12px', color: '#8b92a5', display: 'block', marginBottom: '6px' }}>Ukuran Kertas</label>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    {(printer.type === 'thermal' ? ['58mm', '80mm'] : ['A4', 'A5']).map(size => (
                      <button key={size} type="button" onClick={() => setPrinter(p => ({ ...p, paperSize: size }))}
                        style={{ flex: 1, padding: '8px', borderRadius: '8px', border: '1px solid #2a2d3e', cursor: 'pointer', fontSize: '12px', fontWeight: 700, background: printer.paperSize === size ? 'rgba(249,115,22,0.15)' : '#0f1117', color: printer.paperSize === size ? '#f97316' : '#8b92a5' }}>
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={() => setShowPreview(!showPreview)} style={{ padding: '8px 16px', borderRadius: '8px', background: '#2a2d3e', color: '#f0f2f5', border: 'none', cursor: 'pointer', fontSize: '13px' }}>
                  👁️ Preview Struk
                </button>
                <button disabled={!printer.connected} style={{ padding: '8px 16px', borderRadius: '8px', background: printer.connected ? '#3b82f6' : '#2a2d3e', color: printer.connected ? '#fff' : '#5a6070', border: 'none', cursor: printer.connected ? 'pointer' : 'not-allowed', fontSize: '13px', fontWeight: 600 }}>
                  🖨️ Test Print
                </button>
              </div>
            </div>

            {/* Struk Layout Settings */}
            <div style={{ padding: '20px', borderRadius: '12px', border: '1px solid #2a2d3e', background: '#1e2130', marginBottom: '16px' }}>
              <h3 style={{ color: '#f0f2f5', fontWeight: 700, margin: '0 0 14px', fontSize: '14px' }}>Layout Struk</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                  { label: 'Tampilkan Logo / Nama Toko', key: 'showLogo', val: printer.showLogo },
                  { label: 'Tampilkan Alamat Toko', key: 'showAddress', val: printer.showAddress },
                  { label: 'Tampilkan Pesan di Bawah Struk', key: 'showFooter', val: printer.showFooter },
                ].map(s => (
                  <div key={s.key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '13px', color: '#f0f2f5' }}>{s.label}</span>
                    <Toggle on={s.val} onToggle={() => setPrinter(p => ({ ...p, [s.key]: !s.val }))} />
                  </div>
                ))}
                {printer.showFooter && (
                  <div>
                    <label style={{ fontSize: '12px', color: '#8b92a5', display: 'block', marginBottom: '4px' }}>Teks Pesan Footer</label>
                    <input value={printer.footerText} onChange={e => setPrinter(p => ({ ...p, footerText: e.target.value }))} style={inputStyle} />
                  </div>
                )}
                <div>
                  <label style={{ fontSize: '12px', color: '#8b92a5', display: 'block', marginBottom: '4px' }}>Jumlah Salinan Struk</label>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    {[1, 2, 3].map(n => (
                      <button key={n} onClick={() => setPrinter(p => ({ ...p, copies: n }))}
                        style={{ padding: '6px 16px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: 700, background: printer.copies === n ? '#f97316' : '#2a2d3e', color: printer.copies === n ? '#fff' : '#8b92a5' }}>
                        {n}x
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Struk Preview */}
            {showPreview && (
              <div style={{ padding: '20px', borderRadius: '12px', border: '1px solid #2a2d3e', background: '#1e2130' }}>
                <h3 style={{ color: '#f0f2f5', fontWeight: 700, margin: '0 0 14px', fontSize: '14px' }}>👁️ Preview Struk ({printer.paperSize})</h3>
                <div style={{ maxWidth: printer.paperSize === '58mm' ? '200px' : printer.paperSize === '80mm' ? '280px' : '400px', background: '#fff', color: '#000', padding: '16px', borderRadius: '6px', fontFamily: 'monospace', fontSize: '11px', lineHeight: 1.6 }}>
                  {printer.showLogo && (
                    <div style={{ textAlign: 'center', marginBottom: '8px' }}>
                      <div style={{ fontWeight: 700, fontSize: '14px' }}>{store.name}</div>
                      {printer.showAddress && <div style={{ fontSize: '10px', color: '#555' }}>{store.address}</div>}
                      <div style={{ fontSize: '10px', color: '#555' }}>Telp: {store.phone}</div>
                    </div>
                  )}
                  <div style={{ borderTop: '1px dashed #000', margin: '6px 0' }}></div>
                  <div>No: TRX-0001</div>
                  <div>Tgl: {new Date().toLocaleDateString('id-ID')}</div>
                  <div style={{ borderTop: '1px dashed #000', margin: '6px 0' }}></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Kampas Rem x2</span><span>Rp 240.000</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Oli Agip x1</span><span>Rp 90.000</span></div>
                  <div style={{ borderTop: '1px dashed #000', margin: '6px 0' }}></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}><span>TOTAL</span><span>Rp 330.000</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Tunai</span><span>Rp 350.000</span></div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}><span>Kembalian</span><span>Rp 20.000</span></div>
                  {printer.showFooter && (
                    <>
                      <div style={{ borderTop: '1px dashed #000', margin: '6px 0' }}></div>
                      <div style={{ textAlign: 'center', fontSize: '10px', color: '#555' }}>{printer.footerText}</div>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ===== USER ===== */}
        {activeSection === 'user' && (
          <div style={{ padding: '20px', borderRadius: '12px', border: '1px solid #2a2d3e', background: '#1e2130' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h2 style={{ color: '#f0f2f5', fontWeight: 700, margin: 0, fontSize: '16px' }}>👤 Manajemen Pengguna</h2>
              <button style={{ padding: '7px 14px', borderRadius: '8px', background: '#f97316', color: '#fff', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: '12px' }}>+ Tambah User</button>
            </div>
            <div style={{ marginBottom: '12px', padding: '10px 14px', borderRadius: '8px', background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.2)', fontSize: '12px', color: '#3b82f6' }}>
              ℹ️ Setiap user memiliki akses berbeda. Kasir hanya bisa akses halaman Kasir. Admin bisa akses semua halaman.
            </div>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #2a2d3e' }}>
                  {['Nama', 'Role', 'Email', 'Status', 'Aksi'].map(h => (
                    <th key={h} style={{ padding: '10px 0', textAlign: 'left', fontSize: '11px', color: '#8b92a5', fontWeight: 600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.email} style={{ borderBottom: '1px solid #2a2d3e' }}>
                    <td style={{ padding: '12px 0' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#f97316', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, color: '#fff', fontSize: '13px', flexShrink: 0 }}>
                          {u.name[0]}
                        </div>
                        <span style={{ fontSize: '14px', fontWeight: 600, color: '#f0f2f5' }}>{u.name}</span>
                      </div>
                    </td>
                    <td style={{ padding: '12px 0', fontSize: '12px', color: '#f97316', fontWeight: 600 }}>{u.role}</td>
                    <td style={{ padding: '12px 0', fontSize: '12px', color: '#8b92a5' }}>{u.email}</td>
                    <td style={{ padding: '12px 0' }}>
                      <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '4px', fontWeight: 700, background: 'rgba(34,197,94,0.15)', color: '#22c55e' }}>{u.status}</span>
                    </td>
                    <td style={{ padding: '12px 0' }}>
                      <button style={{ padding: '4px 10px', borderRadius: '6px', background: '#2a2d3e', color: '#8b92a5', border: 'none', cursor: 'pointer', fontSize: '11px' }}>Edit</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ===== SISTEM ===== */}
        {activeSection === 'sistem' && (
          <div style={{ padding: '20px', borderRadius: '12px', border: '1px solid #2a2d3e', background: '#1e2130' }}>
            <h2 style={{ color: '#f0f2f5', fontWeight: 700, margin: '0 0 16px', fontSize: '16px' }}>⚙️ Pengaturan Sistem</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '20px' }}>
              {[
                { label: 'Notifikasi Stok Menipis', desc: 'Tampilkan peringatan saat stok di bawah minimum', on: notifOn, toggle: () => setNotifOn(!notifOn) },
                { label: 'Backup Otomatis Harian', desc: 'Backup data setiap hari jam 00:00 WIT ke cloud', on: autoBackup, toggle: () => setAutoBackup(!autoBackup) },
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
            <div style={{ padding: '14px', borderRadius: '10px', background: '#0f1117', border: '1px solid #2a2d3e' }}>
              <div style={{ fontSize: '13px', fontWeight: 600, color: '#f0f2f5', marginBottom: '4px' }}>Klinik Vespa Management System</div>
              <div style={{ fontSize: '12px', color: '#5a6070' }}>Versi 0.1.0 · Next.js + Supabase · © 2026</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

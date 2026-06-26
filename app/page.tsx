'use client';

const fmt = (n: number) => 'Rp ' + n.toLocaleString('id-ID');

const StatCard = ({ label, value, sub, icon, iconBg, valueColor }: any) => (
  <div className="rounded-xl p-5 border" style={{ background: '#1e2130', borderColor: '#2a2d3e' }}>
    <div className="flex items-start justify-between mb-3">
      <span className="text-sm" style={{ color: '#8b92a5' }}>{label}</span>
      <div className="w-9 h-9 rounded-lg flex items-center justify-center text-lg" style={{ background: iconBg }}>
        {icon}
      </div>
    </div>
    <div className="text-2xl font-bold mb-1" style={{ color: valueColor || '#f0f2f5' }}>{value}</div>
    <div className="text-xs" style={{ color: '#8b92a5' }}>{sub}</div>
  </div>
);

export default function Dashboard() {
  const today = new Date().toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: '#f0f2f5' }}>Dashboard</h1>
          <p className="text-sm mt-0.5" style={{ color: '#8b92a5' }}>{today}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg border" style={{ background: '#1e2130', borderColor: '#2a2d3e' }}>
            <span style={{ color: '#5a6070' }}>🔍</span>
            <input placeholder="Cari produk, pelanggan..." className="bg-transparent text-sm outline-none w-44" style={{ color: '#8b92a5' }} />
          </div>
          <button className="w-9 h-9 rounded-lg flex items-center justify-center relative border" style={{ background: '#1e2130', borderColor: '#2a2d3e' }}>
            <span>🔔</span>
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-xs flex items-center justify-center font-bold" style={{ background: '#ef4444', color: '#fff' }}>3</span>
          </button>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <StatCard label="Total SKU" value="12 produk" sub="Semua kategori" icon="📦" iconBg="rgba(249,115,22,0.15)" valueColor="#f0f2f5" />
        <StatCard label="Penjualan Hari Ini" value={fmt(1285000)} sub="↑ 12% vs kemarin" icon="💳" iconBg="rgba(34,197,94,0.15)" valueColor="#22c55e" />
        <StatCard label="Total Transaksi" value="68 transaksi" sub={`Bulan ${new Date().toLocaleDateString('id-ID',{month:'long',year:'numeric'})}`} icon="📈" iconBg="rgba(59,130,246,0.15)" valueColor="#f0f2f5" />
        <StatCard label="Stok Kritis" value="3 item" sub="Perlu restok" icon="⚠️" iconBg="rgba(245,158,11,0.15)" valueColor="#f59e0b" />
      </div>

      {/* Row 2: Arus Kas + Piutang + Hutang */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {/* Arus Kas */}
        <div className="rounded-xl p-5 border" style={{ background: '#1e2130', borderColor: '#2a2d3e' }}>
          <div className="flex justify-between items-center mb-4">
            <span className="font-semibold" style={{ color: '#f0f2f5' }}>Arus Kas Hari Ini</span>
            <span className="text-xs" style={{ color: '#8b92a5' }}>{new Date().toLocaleDateString('id-ID',{day:'numeric',month:'short',year:'numeric'})}</span>
          </div>
          <div className="space-y-3 mb-4">
            <div className="flex justify-between items-center px-3 py-2 rounded-lg" style={{ background: 'rgba(34,197,94,0.1)' }}>
              <span className="flex items-center gap-2 text-sm"><span className="w-2 h-2 rounded-full" style={{ background: '#22c55e' }}></span><span style={{ color: '#f0f2f5' }}>Uang Masuk</span></span>
              <span className="font-bold" style={{ color: '#22c55e' }}>{fmt(1285000)}</span>
            </div>
            <div className="flex justify-between items-center px-3 py-2 rounded-lg" style={{ background: 'rgba(239,68,68,0.1)' }}>
              <span className="flex items-center gap-2 text-sm"><span className="w-2 h-2 rounded-full" style={{ background: '#ef4444' }}></span><span style={{ color: '#f0f2f5' }}>Uang Keluar</span></span>
              <span className="font-bold" style={{ color: '#ef4444' }}>{fmt(450000)}</span>
            </div>
          </div>
          <div className="flex justify-between items-center pt-3 border-t" style={{ borderColor: '#2a2d3e' }}>
            <span className="font-semibold text-sm" style={{ color: '#f0f2f5' }}>Saldo Bersih</span>
            <span className="font-bold text-lg" style={{ color: '#f97316' }}>{fmt(835000)}</span>
          </div>
        </div>

        {/* Piutang */}
        <div className="rounded-xl p-5 border" style={{ background: '#1e2130', borderColor: '#2a2d3e' }}>
          <div className="font-semibold mb-3" style={{ color: '#f0f2f5' }}>Piutang Pelanggan</div>
          <div className="text-3xl font-bold mb-1" style={{ color: '#f59e0b' }}>{fmt(875000)}</div>
          <div className="text-xs mb-4" style={{ color: '#8b92a5' }}>Dari 3 pelanggan</div>
          <div className="space-y-2">
            {[{ name: 'Rafi Maulana', amount: 350000 }, { name: 'Dian Kusuma', amount: 275000 }, { name: 'Hendra P.', amount: 250000 }].map((p) => (
              <div key={p.name} className="flex justify-between text-sm">
                <span style={{ color: '#8b92a5' }}>{p.name}</span>
                <span className="font-semibold" style={{ color: '#f59e0b' }}>{fmt(p.amount)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Hutang Pemasok */}
        <div className="rounded-xl p-5 border" style={{ background: '#1e2130', borderColor: '#2a2d3e' }}>
          <div className="font-semibold mb-3" style={{ color: '#f0f2f5' }}>Hutang ke Pemasok</div>
          <div className="text-3xl font-bold mb-1" style={{ color: '#ef4444' }}>{fmt(3500000)}</div>
          <div className="text-xs mb-4" style={{ color: '#8b92a5' }}>Jatuh tempo 26 Jul 2026</div>
          <div className="space-y-2">
            {[{ name: 'PT Piaggio Dist.', amount: 3500000 }, { name: 'UD Vespa Jaya', amount: 850000 }].map((p) => (
              <div key={p.name} className="flex justify-between text-sm">
                <span style={{ color: '#8b92a5' }}>{p.name}</span>
                <span className="font-semibold" style={{ color: '#ef4444' }}>{fmt(p.amount)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Row 3: Stok Menipis + Transaksi Terkini */}
      <div className="grid grid-cols-2 gap-4">
        {/* Stok Menipis */}
        <div className="rounded-xl p-5 border" style={{ background: '#1e2130', borderColor: '#2a2d3e' }}>
          <div className="flex justify-between items-center mb-4">
            <span className="font-semibold flex items-center gap-2" style={{ color: '#f0f2f5' }}>⚠️ Stok Menipis / Habis</span>
            <span className="text-xs px-2 py-0.5 rounded-full font-bold" style={{ background: 'rgba(239,68,68,0.15)', color: '#ef4444' }}>3 item</span>
          </div>
          <div className="space-y-3">
            {[
              { name: 'Oli Agip 4T 1 Liter', sku: 'VS-002', min: 10, stock: 3, status: 'MENIPIS' },
              { name: 'Busi NGK CR7HSA', sku: 'VS-005', min: 10, stock: 2, status: 'MENIPIS' },
              { name: 'Bearing Roda Depan', sku: 'VS-009', min: 5, stock: 0, status: 'HABIS' },
            ].map((item) => (
              <div key={item.sku} className="flex justify-between items-center py-2 border-b" style={{ borderColor: '#2a2d3e' }}>
                <div>
                  <div className="text-sm font-semibold" style={{ color: '#f0f2f5' }}>{item.name}</div>
                  <div className="text-xs" style={{ color: '#5a6070' }}>{item.sku} · Min: {item.min}</div>
                </div>
                <div className="text-right">
                  <span className="text-xs px-2 py-0.5 rounded font-bold block mb-1" style={{ background: item.status === 'HABIS' ? 'rgba(239,68,68,0.15)' : 'rgba(245,158,11,0.15)', color: item.status === 'HABIS' ? '#ef4444' : '#f59e0b' }}>
                    {item.status}
                  </span>
                  <span className="text-sm font-bold" style={{ color: item.status === 'HABIS' ? '#ef4444' : '#f59e0b' }}>{item.stock} pcs</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Transaksi Terkini */}
        <div className="rounded-xl p-5 border" style={{ background: '#1e2130', borderColor: '#2a2d3e' }}>
          <div className="flex justify-between items-center mb-4">
            <span className="font-semibold" style={{ color: '#f0f2f5' }}>Transaksi Terkini</span>
            <button className="text-xs" style={{ color: '#f97316' }}>Lihat semua →</button>
          </div>
          <div className="space-y-3">
            {[
              { name: 'Rafi Maulana', code: 'TRX-0241', time: '14:22', amount: 285000, type: 'Jual' },
              { name: 'Dian Kusuma', code: 'TRX-0240', time: '13:45', amount: 175000, type: 'Jual' },
              { name: 'Hendra Pratama', code: 'TRX-0239', time: '12:30', amount: 85000, type: 'Jual' },
              { name: 'PT Piaggio Dist.', code: 'PO-0091', time: '10:15', amount: 3500000, type: 'Beli' },
              { name: 'Budi Santoso', code: 'TRX-0238', time: '09:52', amount: 195000, type: 'Jual' },
            ].map((t) => (
              <div key={t.code} className="flex items-center justify-between py-1.5 border-b" style={{ borderColor: '#2a2d3e' }}>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full" style={{ background: t.type === 'Jual' ? '#22c55e' : '#3b82f6' }}></div>
                  <div>
                    <div className="text-sm font-semibold" style={{ color: '#f0f2f5' }}>{t.name}</div>
                    <div className="text-xs" style={{ color: '#5a6070' }}>{t.code} · {t.time}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold" style={{ color: '#f0f2f5' }}>{fmt(t.amount)}</div>
                  <span className="text-xs px-2 py-0.5 rounded font-bold" style={{ background: t.type === 'Jual' ? 'rgba(34,197,94,0.15)' : 'rgba(59,130,246,0.15)', color: t.type === 'Jual' ? '#22c55e' : '#3b82f6' }}>{t.type}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

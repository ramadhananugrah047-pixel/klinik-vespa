'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const menuItems = [
  { href: '/', label: 'Dashboard', icon: '⊞' },
  { href: '/inventori', label: 'Inventori', icon: '📦', badge: 3 },
  { href: '/kasir', label: 'Kasir (POS)', icon: '🖥️' },
  { href: '/stok-masuk', label: 'Stok Masuk', icon: '📥' },
  { href: '/arus-kas', label: 'Arus Kas', icon: '💰' },
  { href: '/pelanggan', label: 'Pelanggan & Piutang', icon: '👥', badge: 3 },
  { href: '/pemasok', label: 'Pemasok & Hutang', icon: '🏭', badge: 2 },
  { href: '/laporan', label: 'Laporan', icon: '📊' },
  { href: '/pengaturan', label: 'Pengaturan', icon: '⚙️' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <div className="w-56 flex flex-col flex-shrink-0 border-r" style={{ background: '#1a1d27', borderColor: '#2a2d3e' }}>
      {/* Logo */}
      <div className="p-4 border-b" style={{ borderColor: '#2a2d3e' }}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full flex items-center justify-center text-lg" style={{ background: '#f97316' }}>
            🏍️
          </div>
          <div>
            <div className="font-bold text-sm" style={{ color: '#f0f2f5' }}>Klinik Vespa</div>
            <div className="text-xs" style={{ color: '#8b92a5' }}>SENTANI · Papua</div>
          </div>
        </div>
      </div>

      {/* Menu */}
      <nav className="flex-1 p-3 overflow-y-auto">
        <div className="text-xs font-semibold mb-3 px-2" style={{ color: '#5a6070', letterSpacing: '0.08em' }}>
          MENU UTAMA
        </div>
        <ul className="space-y-0.5">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all"
                  style={{
                    background: isActive ? 'rgba(249,115,22,0.15)' : 'transparent',
                    color: isActive ? '#f97316' : '#8b92a5',
                    borderLeft: isActive ? '3px solid #f97316' : '3px solid transparent',
                  }}
                >
                  <span className="text-base w-5 text-center">{item.icon}</span>
                  <span className="flex-1">{item.label}</span>
                  {item.badge && (
                    <span className="text-xs px-1.5 py-0.5 rounded-full font-bold" style={{ background: '#f97316', color: '#fff', fontSize: '10px' }}>
                      {item.badge}
                    </span>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Theme & User */}
      <div className="p-3 border-t" style={{ borderColor: '#2a2d3e' }}>
        <div className="text-xs font-semibold mb-2 px-2" style={{ color: '#5a6070', letterSpacing: '0.08em' }}>TEMA</div>
        <div className="flex gap-1 mb-4">
          {['Nightshift', 'Cobalt', 'Daylight'].map((t) => (
            <button key={t} className="text-xs px-2 py-1 rounded" style={{ background: t === 'Nightshift' ? '#f97316' : '#2a2d3e', color: t === 'Nightshift' ? '#fff' : '#8b92a5' }}>
              {t}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2 px-2">
          <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold" style={{ background: '#f97316', color: '#fff' }}>A</div>
          <div>
            <div className="text-sm font-semibold" style={{ color: '#f0f2f5' }}>Admin Toko</div>
            <div className="text-xs" style={{ color: '#8b92a5' }}>Pemilik · Super Admin</div>
          </div>
        </div>
      </div>
    </div>
  );
}

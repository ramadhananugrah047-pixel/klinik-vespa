-- ============================================================
-- KLINIK VESPA - Setup Database Supabase
-- Jalankan di: Supabase Dashboard > SQL Editor > New query
-- ============================================================

-- Hapus tabel lama kalau ada (urutan penting karena ada foreign key)
drop table if exists transaction_items cascade;
drop table if exists transactions cascade;
drop table if exists stock_entries cascade;
drop table if exists cash_flow cascade;
drop table if exists products cascade;
drop table if exists customers cascade;
drop table if exists suppliers cascade;
drop table if exists categories cascade;

-- ===== TABEL PRODUK =====
create table products (
  id text primary key,
  name text not null,
  category text default '',
  stock integer default 0,
  min_stock integer default 0,
  buy_price integer default 0,
  sell_price integer default 0,
  img_url text default '',
  created_at timestamptz default now()
);
alter table products disable row level security;

-- ===== TABEL KATEGORI =====
create table categories (
  id serial primary key,
  name text unique not null
);
alter table categories disable row level security;

-- ===== TABEL PELANGGAN =====
create table customers (
  id text primary key,
  name text not null,
  phone text default '',
  address text default '',
  total_beli integer default 0,
  piutang integer default 0,
  last_trx text default '-',
  created_at timestamptz default now()
);
alter table customers disable row level security;

-- ===== TABEL PEMASOK =====
create table suppliers (
  id text primary key,
  name text not null,
  contact text default '',
  phone text default '',
  city text default '',
  total_beli integer default 0,
  hutang integer default 0,
  jatuh_tempo text default '-',
  created_at timestamptz default now()
);
alter table suppliers disable row level security;

-- ===== TABEL TRANSAKSI =====
create table transactions (
  id text primary key,
  time text default '',
  date text default '',
  customer_name text default '',
  customer_id text default '',
  total integer default 0,
  pay_method text default '',
  cash_received integer default 0,
  change_amount integer default 0,
  is_piutang boolean default false,
  created_at timestamptz default now()
);
alter table transactions disable row level security;

-- ===== TABEL ITEM TRANSAKSI =====
create table transaction_items (
  id uuid default gen_random_uuid() primary key,
  transaction_id text references transactions(id) on delete cascade,
  product_id text default '',
  product_name text default '',
  price integer default 0,
  qty integer default 0
);
alter table transaction_items disable row level security;

-- ===== TABEL STOK MASUK =====
create table stock_entries (
  id text primary key,
  date text default '',
  supplier text default '',
  supplier_id text default '',
  product_id text default '',
  product_name text default '',
  is_new_product boolean default false,
  qty integer default 0,
  price_per_unit integer default 0,
  ongkir integer default 0,
  total integer default 0,
  pay_status text default 'Lunas',
  created_at timestamptz default now()
);
alter table stock_entries disable row level security;

-- ===== TABEL ARUS KAS =====
create table cash_flow (
  id text primary key,
  date text default '',
  description text default '',
  type text default 'Masuk',
  category text default '',
  amount integer default 0,
  ref text default '',
  created_at timestamptz default now()
);
alter table cash_flow disable row level security;

-- ============================================================
-- DATA AWAL (contoh data untuk demo)
-- ============================================================

insert into products values
('VS-001', 'Kampas Rem Depan', 'Rem', 24, 10, 85000, 120000, '', now()),
('VS-002', 'Oli Agip 4T 1 Liter', 'Oli', 3, 10, 65000, 90000, '', now()),
('VS-003', 'Ban Dalam 275-17', 'Ban', 18, 5, 45000, 65000, '', now()),
('VS-004', 'Kampas Rem Belakang', 'Rem', 30, 10, 75000, 110000, '', now()),
('VS-005', 'Busi NGK CR7HSA', 'Elektrikal', 2, 10, 35000, 55000, '', now()),
('VS-006', 'Filter Udara', 'Filter', 12, 5, 40000, 65000, '', now()),
('VS-007', 'Rantai Motor 428H', 'Transmisi', 8, 5, 95000, 145000, '', now()),
('VS-008', 'Minyak Rem DOT4', 'Rem', 15, 8, 28000, 45000, '', now()),
('VS-009', 'Bearing Roda Depan', 'Bearing', 0, 5, 55000, 85000, '', now());

insert into categories (name) values
('Rem'), ('Oli'), ('Ban'), ('Elektrikal'), ('Filter'), ('Transmisi'), ('Bearing'), ('Body'), ('Kelistrikan');

insert into customers values
('PLG-001', 'Rafi Maulana', '0812-3456-7890', 'Jl. Sentani Kota No.12', 3250000, 350000, '27 Jun 2026', now()),
('PLG-002', 'Dian Kusuma', '0813-5678-9012', 'Jl. Kemiri No.8, Sentani', 1850000, 275000, '27 Jun 2026', now()),
('PLG-003', 'Hendra Pratama', '0811-2345-6789', 'Jl. Abepura, Jayapura', 2100000, 250000, '26 Jun 2026', now()),
('PLG-004', 'Budi Santoso', '0822-1111-2222', 'Jl. Raya Depapre', 950000, 0, '25 Jun 2026', now()),
('PLG-005', 'Siti Rahma', '0831-4444-5555', 'Jl. Ifar Gunung', 1450000, 0, '22 Jun 2026', now());

insert into suppliers values
('PMS-001', 'PT Piaggio Distributor', 'Bpk. Andi', '0800-1234-5678', 'Jakarta', 12500000, 3500000, '26 Jul 2026', now()),
('PMS-002', 'UD Vespa Jaya', 'Ibu Sari', '0811-9876-5432', 'Makassar', 5800000, 850000, '15 Jul 2026', now()),
('PMS-003', 'CV Motor Parts', 'Bpk. Rudi', '0813-1111-2222', 'Surabaya', 3200000, 0, '-', now()),
('PMS-004', 'Toko Sparepart Sentani', 'Bpk. Johan', '0812-5555-6666', 'Sentani', 1500000, 0, '-', now());

insert into transactions values
('TRX-0241', '14:22', '27 Jun 2026', 'Rafi Maulana', 'PLG-001', 210000, 'Tunai', 250000, 40000, false, now()),
('TRX-0240', '13:45', '27 Jun 2026', 'Dian Kusuma', 'PLG-002', 110000, 'QRIS', 0, 0, false, now()),
('TRX-0239', '12:30', '26 Jun 2026', '-', '', 100000, 'Tunai', 100000, 0, false, now());

insert into transaction_items (transaction_id, product_id, product_name, price, qty) values
('TRX-0241', 'VS-001', 'Kampas Rem Depan', 120000, 1),
('TRX-0241', 'VS-002', 'Oli Agip 4T 1 Liter', 90000, 1),
('TRX-0240', 'VS-004', 'Kampas Rem Belakang', 110000, 1),
('TRX-0239', 'VS-005', 'Busi NGK CR7HSA', 55000, 1),
('TRX-0239', 'VS-008', 'Minyak Rem DOT4', 45000, 1);

insert into stock_entries values
('SM-001', '27 Jun 2026', 'PT Piaggio Distributor', 'PMS-001', 'VS-001', 'Kampas Rem Depan', false, 50, 85000, 0, 4250000, 'Lunas', now()),
('SM-002', '25 Jun 2026', 'UD Vespa Jaya', 'PMS-002', 'VS-002', 'Oli Agip 4T 1 Liter', false, 24, 65000, 50000, 1610000, 'Hutang', now()),
('SM-003', '22 Jun 2026', 'CV Motor Parts', 'PMS-003', 'VS-005', 'Busi NGK CR7HSA', false, 30, 35000, 25000, 1075000, 'Lunas', now());

insert into cash_flow values
('AK-001', '27 Jun 2026', 'Penjualan - Rafi Maulana (TRX-0241)', 'Masuk', 'Penjualan', 210000, 'TRX-0241', now()),
('AK-002', '27 Jun 2026', 'Penjualan - Dian Kusuma (TRX-0240)', 'Masuk', 'Penjualan', 110000, 'TRX-0240', now()),
('AK-003', '27 Jun 2026', 'Beli stok - Kampas Rem Depan (SM-001)', 'Keluar', 'Pembelian', 4250000, 'SM-001', now()),
('AK-004', '26 Jun 2026', 'Penjualan umum (TRX-0239)', 'Masuk', 'Penjualan', 100000, 'TRX-0239', now()),
('AK-005', '22 Jun 2026', 'Beli stok - Busi NGK (SM-003)', 'Keluar', 'Pembelian', 1075000, 'SM-003', now()),
('AK-006', '20 Jun 2026', 'Bayar listrik toko', 'Keluar', 'Operasional', 250000, '', now()),
('AK-007', '15 Jun 2026', 'Gaji karyawan Jun 2026', 'Keluar', 'Gaji', 3000000, '', now());

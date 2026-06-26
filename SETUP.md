# Setup Guide - Klinik Vespa

Panduan lengkap setup aplikasi Klinik Vespa dari awal.

## ✅ Phase 1: Project Setup (SELESAI)

- [x] Node.js installed
- [x] Next.js project created
- [x] Folder structure setup
- [x] TypeScript configured

## 🔧 Phase 2: Supabase Setup (CURRENT)

### Step 1: Install Dependencies
```bash
npm install @supabase/supabase-js
```

### Step 2: Create Supabase Project
1. Buka https://supabase.com
2. Sign up dengan email: ramadhananugrah047@gmail.com
3. Create new project dengan nama "klinik-vespa"
4. Pilih region terdekat (Indonesia/Singapore)
5. Setup password untuk database

### Step 3: Get Credentials
1. Buka project yang sudah dibuat
2. Pergi ke "Settings" → "API"
3. Copy:
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public key** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### Step 4: Setup Environment Variables
1. Buka file `.env.local` (buat jika belum ada)
2. Copy isi dari `.env.local.example`
3. Paste credentials dari Supabase

### Step 5: Create Database Tables
Di Supabase SQL Editor, run SQL queries berikut:

```sql
-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR UNIQUE NOT NULL,
  name VARCHAR NOT NULL,
  role VARCHAR DEFAULT 'staff',
  created_at TIMESTAMP DEFAULT now()
);

-- Products table
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR NOT NULL,
  category VARCHAR NOT NULL,
  sku VARCHAR UNIQUE NOT NULL,
  stock INTEGER DEFAULT 0,
  unit_price DECIMAL NOT NULL,
  cost_price DECIMAL NOT NULL,
  margin DECIMAL,
  created_at TIMESTAMP DEFAULT now()
);

-- Customers table
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR NOT NULL,
  phone VARCHAR,
  email VARCHAR,
  address TEXT,
  balance DECIMAL DEFAULT 0,
  created_at TIMESTAMP DEFAULT now()
);

-- Transactions table
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id UUID REFERENCES customers(id),
  total_amount DECIMAL NOT NULL,
  payment_method VARCHAR DEFAULT 'cash',
  payment_status VARCHAR DEFAULT 'paid',
  notes TEXT,
  created_at TIMESTAMP DEFAULT now()
);

-- Transaction items table
CREATE TABLE transaction_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  transaction_id UUID REFERENCES transactions(id),
  product_id UUID REFERENCES products(id),
  quantity INTEGER NOT NULL,
  unit_price DECIMAL NOT NULL,
  total_price DECIMAL NOT NULL
);
```

## 📋 Phase 3: Connect & Deploy (NEXT)

- [ ] Test Supabase connection
- [ ] Create sample components
- [ ] Deploy ke Vercel
- [ ] Build core features

## 🚀 Running the App

```bash
npm run dev
```

Buka http://localhost:3000

---

**Next Step:** Follow Phase 2 instructions di atas!

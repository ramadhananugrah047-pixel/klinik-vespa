'use client';

import { useState } from 'react';

const StatCard = ({ label, value, icon }: { label: string; value: string; icon: string }) => (
  <div className="bg-white rounded-lg shadow p-6 border-l-4 border-blue-500">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-500 text-sm">{label}</p>
        <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
      </div>
      <span className="text-4xl">{icon}</span>
    </div>
  </div>
);

export default function Dashboard() {
  const [stats] = useState({
    income: 'Rp 2.500.000',
    expense: 'Rp 800.000',
    balance: 'Rp 1.700.000',
    products: '45',
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard label="Uang Masuk (Hari ini)" value={stats.income} icon="💰" />
        <StatCard label="Pengeluaran (Hari ini)" value={stats.expense} icon="💸" />
        <StatCard label="Saldo Bersih" value={stats.balance} icon="💵" />
        <StatCard label="Total Produk" value={stats.products} icon="📦" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Transaksi Terbaru</h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center pb-3 border-b">
              <div>
                <p className="font-semibold text-gray-900">Kampas Rem</p>
                <p className="text-sm text-gray-500">2 unit</p>
              </div>
              <p className="font-bold text-gray-900">Rp 400.000</p>
            </div>
            <div className="flex justify-between items-center pb-3 border-b">
              <div>
                <p className="font-semibold text-gray-900">Oli Motor</p>
                <p className="text-sm text-gray-500">5 botol</p>
              </div>
              <p className="font-bold text-gray-900">Rp 450.000</p>
            </div>
            <div className="flex justify-between items-center">
              <div>
                <p className="font-semibold text-gray-900">Busi Spark Plug</p>
                <p className="text-sm text-gray-500">3 pcs</p>
              </div>
              <p className="font-bold text-gray-900">Rp 300.000</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Produk Terlaris</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Kampas Rem</span>
              <div className="flex items-center space-x-2">
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '90%' }}></div>
                </div>
                <span className="text-sm font-semibold text-gray-600">45</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Oli Motor</span>
              <div className="flex items-center space-x-2">
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '75%' }}></div>
                </div>
                <span className="text-sm font-semibold text-gray-600">38</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Busi Spark Plug</span>
              <div className="flex items-center space-x-2">
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div className="bg-orange-500 h-2 rounded-full" style={{ width: '60%' }}></div>
                </div>
                <span className="text-sm font-semibold text-gray-600">28</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

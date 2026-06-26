'use client';

import { useState } from 'react';

interface Customer {
  id: string;
  name: string;
  phone: string;
  email: string;
  balance: number;
}

const mockCustomers: Customer[] = [
  { id: '1', name: 'Budi Santoso', phone: '081234567890', email: 'budi@example.com', balance: 500000 },
  { id: '2', name: 'Siti Nurhaliza', phone: '081298765432', email: 'siti@example.com', balance: -250000 },
  { id: '3', name: 'Ahmad Wijaya', phone: '081324567890', email: 'ahmad@example.com', balance: 0 },
];

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>(mockCustomers);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', phone: '', email: '' });

  const handleAddCustomer = (e: React.FormEvent) => {
    e.preventDefault();
    const newCustomer: Customer = {
      id: Date.now().toString(),
      ...formData,
      balance: 0,
    };
    setCustomers([...customers, newCustomer]);
    setFormData({ name: '', phone: '', email: '' });
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    setCustomers(customers.filter((c) => c.id !== id));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Data Pelanggan</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          + Tambah Pelanggan
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Form Tambah Pelanggan</h2>
          <form onSubmit={handleAddCustomer} className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Nama Pelanggan"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="border rounded px-3 py-2"
            />
            <input
              type="tel"
              placeholder="No. Telepon"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="border rounded px-3 py-2"
            />
            <input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="border rounded px-3 py-2"
            />
            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition flex-1"
              >
                Simpan
              </button>
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500 transition flex-1"
              >
                Batal
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {customers.map((customer) => (
          <div key={customer.id} className="bg-white rounded-lg shadow p-6 border-t-4 border-blue-500">
            <h3 className="text-lg font-bold text-gray-900 mb-2">{customer.name}</h3>
            <div className="space-y-2 text-sm text-gray-600 mb-4">
              <p>
                <span className="font-semibold">📞 Telepon:</span> {customer.phone}
              </p>
              <p>
                <span className="font-semibold">📧 Email:</span> {customer.email}
              </p>
            </div>

            <div className="bg-gray-50 rounded p-3 mb-4">
              <p className="text-xs text-gray-600 mb-1">Saldo Pelanggan</p>
              <p
                className={`text-2xl font-bold ${
                  customer.balance > 0
                    ? 'text-green-600'
                    : customer.balance < 0
                    ? 'text-red-600'
                    : 'text-gray-900'
                }`}
              >
                {customer.balance > 0 ? '+' : ''}
                Rp {Math.abs(customer.balance).toLocaleString()}
              </p>
              {customer.balance !== 0 && (
                <p className="text-xs text-gray-500 mt-1">
                  {customer.balance > 0 ? 'Kredit' : 'Piutang'}
                </p>
              )}
            </div>

            <div className="flex gap-2">
              <button className="flex-1 bg-blue-600 text-white text-sm py-2 rounded hover:bg-blue-700 transition">
                Edit
              </button>
              <button
                onClick={() => handleDelete(customer.id)}
                className="flex-1 bg-red-600 text-white text-sm py-2 rounded hover:bg-red-700 transition"
              >
                Hapus
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

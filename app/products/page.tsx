'use client';

import { useState } from 'react';

interface Product {
  id: string;
  name: string;
  category: string;
  sku: string;
  stock: number;
  price: number;
}

const mockProducts: Product[] = [
  { id: '1', name: 'Kampas Rem', category: 'Rem', sku: 'REM-001', stock: 45, price: 200000 },
  { id: '2', name: 'Oli Motor SAE 40', category: 'Oli', sku: 'OLI-001', stock: 28, price: 90000 },
  { id: '3', name: 'Busi Spark Plug', category: 'Electrical', sku: 'BUSI-001', stock: 15, price: 100000 },
  { id: '4', name: 'Filter Udara', category: 'Filter', sku: 'FILTER-001', stock: 12, price: 75000 },
];

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: '', category: '', sku: '', stock: 0, price: 0 });

  const handleAddProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const newProduct: Product = {
      id: Date.now().toString(),
      ...formData,
    };
    setProducts([...products, newProduct]);
    setFormData({ name: '', category: '', sku: '', stock: 0, price: 0 });
    setShowForm(false);
  };

  const handleDelete = (id: string) => {
    setProducts(products.filter((p) => p.id !== id));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Inventaris Produk</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
        >
          + Tambah Produk
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-bold mb-4">Form Tambah Produk</h2>
          <form onSubmit={handleAddProduct} className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Nama Produk"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="border rounded px-3 py-2"
            />
            <input
              type="text"
              placeholder="Kategori"
              required
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="border rounded px-3 py-2"
            />
            <input
              type="text"
              placeholder="SKU"
              required
              value={formData.sku}
              onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
              className="border rounded px-3 py-2"
            />
            <input
              type="number"
              placeholder="Stok"
              required
              value={formData.stock}
              onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) })}
              className="border rounded px-3 py-2"
            />
            <input
              type="number"
              placeholder="Harga"
              required
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) })}
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

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Produk</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Kategori</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">SKU</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Stok</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Harga</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-3 text-gray-900 font-semibold">{product.name}</td>
                <td className="px-6 py-3 text-gray-600">{product.category}</td>
                <td className="px-6 py-3 text-gray-600">{product.sku}</td>
                <td className="px-6 py-3">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      product.stock > 10
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {product.stock}
                  </span>
                </td>
                <td className="px-6 py-3 text-gray-900 font-semibold">Rp {product.price.toLocaleString()}</td>
                <td className="px-6 py-3">
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="text-red-600 hover:text-red-800 transition text-sm font-semibold"
                  >
                    Hapus
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

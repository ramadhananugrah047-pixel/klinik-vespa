'use client';

import { useState } from 'react';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

const availableProducts = [
  { id: '1', name: 'Kampas Rem', price: 200000 },
  { id: '2', name: 'Oli Motor SAE 40', price: 90000 },
  { id: '3', name: 'Busi Spark Plug', price: 100000 },
  { id: '4', name: 'Filter Udara', price: 75000 },
];

export default function POSPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'debit' | 'qris' | 'transfer'>('cash');

  const addToCart = (productId: string) => {
    const product = availableProducts.find((p) => p.id === productId);
    if (!product) return;

    const existingItem = cart.find((item) => item.id === productId);
    if (existingItem) {
      setCart(cart.map((item) =>
        item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCart([...cart, { ...product, quantity: 1 }]);
    }
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter((item) => item.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
    } else {
      setCart(cart.map((item) =>
        item.id === productId ? { ...item, quantity } : item
      ));
    }
  };

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = () => {
    if (cart.length === 0) {
      alert('Keranjang masih kosong!');
      return;
    }
    alert(`Transaksi berhasil! Total: Rp ${totalPrice.toLocaleString()}\nMetode: ${paymentMethod}`);
    setCart([]);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">📊 Penjualan (POS)</h1>

      <div className="grid grid-cols-3 gap-6">
        {/* Produk Tersedia */}
        <div className="col-span-2">
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Produk Tersedia</h2>
            <div className="grid grid-cols-2 gap-4">
              {availableProducts.map((product) => (
                <button
                  key={product.id}
                  onClick={() => addToCart(product.id)}
                  className="p-4 border-2 border-blue-300 rounded-lg hover:bg-blue-50 transition text-left"
                >
                  <p className="font-semibold text-gray-900">{product.name}</p>
                  <p className="text-lg font-bold text-blue-600 mt-2">Rp {product.price.toLocaleString()}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Keranjang & Checkout */}
        <div className="col-span-1">
          <div className="bg-white rounded-lg shadow p-6 sticky top-8">
            <h2 className="text-xl font-bold mb-4">🛒 Keranjang</h2>

            {cart.length === 0 ? (
              <p className="text-gray-500 text-center py-8">Keranjang kosong</p>
            ) : (
              <>
                <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
                  {cart.map((item) => (
                    <div key={item.id} className="border-b pb-3">
                      <div className="flex justify-between items-start mb-2">
                        <p className="font-semibold text-sm text-gray-900">{item.name}</p>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-red-500 text-sm font-bold"
                        >
                          ✕
                        </button>
                      </div>
                      <div className="flex items-center gap-2 mb-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="bg-gray-200 px-2 py-1 rounded text-sm"
                        >
                          -
                        </button>
                        <span className="flex-1 text-center font-semibold">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="bg-gray-200 px-2 py-1 rounded text-sm"
                        >
                          +
                        </button>
                      </div>
                      <p className="text-right font-semibold text-gray-700">Rp {(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  ))}
                </div>

                <div className="border-t-2 pt-4 mb-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Subtotal:</span>
                    <span className="font-bold">Rp {totalPrice.toLocaleString()}</span>
                  </div>
                  <div className="text-2xl font-bold text-blue-600">
                    Total: Rp {totalPrice.toLocaleString()}
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Metode Pembayaran</label>
                  <select
                    value={paymentMethod}
                    onChange={(e) => setPaymentMethod(e.target.value as any)}
                    className="w-full border rounded px-3 py-2 text-sm"
                  >
                    <option value="cash">💵 Tunai</option>
                    <option value="debit">💳 Debit</option>
                    <option value="qris">📱 QRIS</option>
                    <option value="transfer">🏦 Transfer</option>
                  </select>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition"
                >
                  ✓ Checkout
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

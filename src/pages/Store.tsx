import { useState } from 'react';
import { ShoppingCart, Heart, Eye, Star, Filter } from 'lucide-react';
import { mockProducts } from '../data/mockData';
import Button from '../components/UI/Button';

export default function Store() {
  const [cart, setCart] = useState<string[]>([]);
  const [view, setView] = useState<'catalog' | 'checkout'>('catalog');

  const addToCart = (productId: string) => {
    setCart([...cart, productId]);
  };

  const cartItems = cart.map((id) => mockProducts.find((p) => p.id === id)!);
  const cartTotal = cartItems.reduce((sum, item) => sum + item.price, 0);

  if (view === 'checkout') {
    return (
      <div className="max-w-4xl mx-auto">
        <button
          onClick={() => setView('catalog')}
          className="mb-6 text-blue-600 hover:text-blue-700 font-medium"
        >
          ← Back to Store
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Shopping Cart</h3>
              {cartItems.length === 0 ? (
                <p className="text-slate-500 text-center py-8">Your cart is empty</p>
              ) : (
                <div className="space-y-4">
                  {cartItems.map((item, index) => (
                    <div key={index} className="flex gap-4 pb-4 border-b border-slate-100 last:border-0">
                      <div className="w-20 h-20 bg-slate-100 rounded-lg flex items-center justify-center">
                        <span className="text-2xl">📦</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-slate-900">{item.name}</h4>
                        <p className="text-sm text-slate-600">{item.sku}</p>
                        <p className="text-sm text-slate-600 mt-1">{item.category}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-slate-900">${item.price.toFixed(2)}</p>
                        <button className="text-sm text-red-600 hover:text-red-700 mt-2">
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Shipping Information</h3>
              <form className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">First Name</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Last Name</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
                  <input
                    type="email"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Address</label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">City</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">State</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">ZIP Code</label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </form>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm sticky top-6">
              <h3 className="text-lg font-bold text-slate-900 mb-4">Order Summary</h3>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Subtotal</span>
                  <span className="font-semibold">${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Shipping</span>
                  <span className="font-semibold">$9.99</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Tax</span>
                  <span className="font-semibold">${(cartTotal * 0.1).toFixed(2)}</span>
                </div>
                <div className="border-t border-slate-200 pt-2 mt-2">
                  <div className="flex justify-between">
                    <span className="font-bold text-slate-900">Total</span>
                    <span className="font-bold text-blue-600 text-xl">
                      ${(cartTotal + 9.99 + cartTotal * 0.1).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
              <Button className="w-full" disabled={cartItems.length === 0}>
                Place Order
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filters
          </Button>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setView('checkout')}
            className="relative flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <ShoppingCart className="w-5 h-5" />
            <span className="font-medium">Cart ({cart.length})</span>
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                {cart.length}
              </span>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {mockProducts.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-lg transition-all overflow-hidden group"
          >
            <div className="relative aspect-square bg-slate-100 flex items-center justify-center overflow-hidden">
              <span className="text-6xl">📦</span>
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-slate-100 transition-colors">
                  <Eye className="w-5 h-5 text-slate-700" />
                </button>
                <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center hover:bg-slate-100 transition-colors">
                  <Heart className="w-5 h-5 text-slate-700" />
                </button>
              </div>
              {product.stock < 20 && (
                <span className="absolute top-2 right-2 px-2 py-1 bg-red-500 text-white text-xs font-bold rounded">
                  Low Stock
                </span>
              )}
            </div>

            <div className="p-4">
              <div className="flex items-center gap-1 mb-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                ))}
                <span className="text-xs text-slate-600 ml-1">(24)</span>
              </div>

              <h3 className="font-semibold text-slate-900 mb-1 line-clamp-2">{product.name}</h3>
              <p className="text-xs text-slate-600 mb-3">{product.category}</p>

              <div className="flex items-center justify-between">
                <span className="text-xl font-bold text-blue-600">${product.price.toFixed(2)}</span>
                <Button size="sm" onClick={() => addToCart(product.id)} className="flex items-center gap-1">
                  <ShoppingCart className="w-4 h-4" />
                  Add
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

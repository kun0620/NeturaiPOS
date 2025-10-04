import { useState } from 'react';
import { Plus, Minus, Trash2, CreditCard, Banknote, Receipt } from 'lucide-react';
import { useProducts } from '../hooks/useProducts';
import { useTransactions } from '../hooks/useTransactions';
import Button from '../components/UI/Button';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  stock: number; // Add stock to cart item
}

export default function POS() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [processing, setProcessing] = useState(false);

  const { products, loading: productsLoading, fetchProducts } = useProducts();
  const { createTransaction, loading: transactionsLoading } = useTransactions();

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addToCart = (product: any) => {
    const existingItem = cart.find((item) => item.id === product.id);
    if (existingItem) {
      if (existingItem.quantity < product.stock) { // Check against product's current stock
        setCart(
          cart.map((item) =>
            item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
          )
        );
      } else {
        alert(`Cannot add more of ${product.name}. Maximum stock reached.`);
      }
    } else {
      if (product.stock > 0) {
        setCart([...cart, { id: product.id, name: product.name, price: product.price, quantity: 1, stock: product.stock }]);
      } else {
        alert(`${product.name} is out of stock.`);
      }
    }
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(
      cart
        .map((item) => {
          if (item.id === id) {
            const newQuantity = Math.max(0, item.quantity + delta);
            if (newQuantity > item.stock) { // Prevent adding more than available stock
              alert(`Cannot add more of ${item.name}. Only ${item.stock} available.`);
              return item;
            }
            return { ...item, quantity: newQuantity };
          }
          return item;
        })
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (id: string) => {
    setCart(cart.filter((item) => item.id !== id));
  };

  const processPayment = async (paymentMethod: 'cash' | 'card') => {
    if (cart.length === 0) return;

    setProcessing(true);
    try {
      const transactionItems = cart.map(item => ({
        product_id: item.id,
        quantity: item.quantity,
        unit_price: item.price,
      }));

      const { error } = await createTransaction(transactionItems, paymentMethod);
      
      if (!error) {
        setCart([]);
        await fetchProducts(); // Refresh product stock after transaction
        alert('Transaction completed successfully!');
      } else {
        alert('Transaction failed. Please try again.');
      }
    } catch (error) {
      alert('Transaction failed. Please try again.');
    } finally {
      setProcessing(false);
    }
  };
  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const taxRate = 0.07; // Change tax rate to 7%
  const tax = subtotal * taxRate;
  const total = subtotal + tax;

  if (productsLoading || transactionsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-slate-600">Loading products...</p>
        </div>
      </div>
    );
  }
  return (
    <div className="flex gap-6 h-[calc(100vh-140px)]">
      <div className="flex-1 flex flex-col">
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search products by name or SKU..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredProducts.map((product) => (
              <button
                key={product.id}
                onClick={() => addToCart(product)}
                disabled={product.stock === 0}
                className={`bg-white border-2 rounded-xl p-4 transition-all text-left ${
                  product.stock === 0 
                    ? 'border-slate-200 opacity-50 cursor-not-allowed' 
                    : 'border-slate-200 hover:border-blue-500 hover:shadow-lg'
                }`}
              >
                <div className="aspect-square bg-slate-100 rounded-lg mb-3 flex items-center justify-center">
                  <span className="text-4xl">📦</span>
                </div>
                <h4 className="font-semibold text-slate-900 mb-1 line-clamp-2">{product.name}</h4>
                <p className="text-xs text-slate-500 mb-2">{product.sku}</p>
                <div className="flex items-center justify-between">
                  <p className="text-lg font-bold text-blue-600">฿{product.price.toFixed(2)}</p>
                  <span className={`text-xs ${product.stock === 0 ? 'text-red-600 font-bold' : 'text-slate-600'}`}>
                    {product.stock === 0 ? 'Out of Stock' : `Stock: ${product.stock}`}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="w-96 bg-white rounded-xl border border-slate-200 shadow-lg flex flex-col">
        <div className="p-6 border-b border-slate-200">
          <h3 className="text-xl font-bold text-slate-900">Current Sale</h3>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400">
              <Receipt className="w-16 h-16 mb-4" />
              <p className="text-center">No items in cart<br />Start scanning or selecting products</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="flex items-start gap-3 pb-4 border-b border-slate-100">
                  <div className="flex-1">
                    <h4 className="font-semibold text-slate-900">{item.name}</h4>
                    <p className="text-sm text-slate-600">฿{item.price.toFixed(2)} each</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.id, -1)}
                      className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-300 hover:bg-slate-100 transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-8 text-center font-semibold">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, 1)}
                      className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-300 hover:bg-slate-100 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="w-8 h-8 flex items-center justify-center rounded-lg border border-red-300 text-red-600 hover:bg-red-50 transition-colors ml-2"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-slate-900">฿{(item.price * item.quantity).toFixed(2)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-6 border-t border-slate-200 space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600">Subtotal</span>
              <span className="font-semibold text-slate-900">฿{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600">Tax (7%)</span>
              <span className="font-semibold text-slate-900">฿{tax.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between text-xl pt-2 border-t border-slate-200">
              <span className="font-bold text-slate-900">Total</span>
              <span className="font-bold text-blue-600">฿{total.toFixed(2)}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button 
              variant="outline" 
              disabled={cart.length === 0 || processing} 
              onClick={() => processPayment('cash')}
              className="flex items-center justify-center gap-2"
            >
              <Banknote className="w-5 h-5" />
              {processing ? 'Processing...' : 'Cash'}
            </Button>
            <Button 
              disabled={cart.length === 0 || processing} 
              onClick={() => processPayment('card')}
              className="flex items-center justify-center gap-2"
            >
              <CreditCard className="w-5 h-5" />
              {processing ? 'Processing...' : 'Card'}
            </Button>
          </div>

          <Button
            variant="secondary"
            className="w-full"
            onClick={() => setCart([])}
            disabled={cart.length === 0 || processing}
          >
            Clear Cart
          </Button>
        </div>
      </div>
    </div>
  );
}

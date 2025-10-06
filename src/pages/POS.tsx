import { useState } from 'react';
import { Plus, Minus, Trash2, CreditCard, Banknote, Receipt as ReceiptIcon, Wallet } from 'lucide-react';
import { useProducts } from '../hooks/useProducts';
import { useTransactions } from '../hooks/useTransactions';
import Button from '../components/UI/Button';
import Modal from '../components/UI/Modal'; // Import the Modal component
import Receipt from '../components/Receipt'; // Import the Receipt component

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  stock: number; // Add stock to cart item
}

interface TransactionDetails {
  cart: CartItem[];
  subtotal: number;
  total: number; // This is the grand total (amount after discount, rounded)
  paymentMethod: 'cash' | 'card';
  cashTendered?: number;
  changeDue?: number;
  discountAmount: number; // New field
  amountAfterDiscount: number; // New field
  vatAmount: number; // New field
  priceExcludingVAT: number; // New field
}

export default function POS() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [processing, setProcessing] = useState(false);
  const [isCashModalOpen, setIsCashModalOpen] = useState(false); // State for cash modal
  const [cashTendered, setCashTendered] = useState<number | ''>(''); // State for cash tendered amount
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false); // State for receipt modal
  const [lastTransactionDetails, setLastTransactionDetails] = useState<TransactionDetails | null>(null); // State to store last transaction details

  const { products, loading: productsLoading, fetchProducts } = useProducts();
  const { createTransaction, loading: transactionsLoading } = useTransactions();

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  
  // For now, discount is 0. This can be expanded later.
  const discountAmount = 0; 
  const amountAfterDiscount = subtotal - discountAmount;

  const vatRate = 0.07; // 7% VAT as per receipt example
  const priceExcludingVAT = amountAfterDiscount / (1 + vatRate);
  const vatAmount = amountAfterDiscount - priceExcludingVAT;

  const total = Math.round(amountAfterDiscount); // Round total to nearest whole number for payment
  const changeDue = typeof cashTendered === 'number' ? cashTendered - total : 0;

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
        alert(`ไม่สามารถเพิ่ม ${product.name} ได้อีก. สินค้ามีในสต็อกสูงสุดแล้ว.`);
      }
    } else {
      if (product.stock > 0) {
        setCart([...cart, { id: product.id, name: product.name, price: product.price, quantity: 1, stock: product.stock }]);
      } else {
        alert(`${product.name} สินค้าหมดสต็อก.`);
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
              alert(`ไม่สามารถเพิ่ม ${item.name} ได้อีก. มีสินค้าในสต็อกเพียง ${item.stock} ชิ้น.`);
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

  const processPayment = async (paymentMethod: 'cash' | 'card', tenderedAmountFromCall?: number | '') => {
    if (cart.length === 0) return;

    // Ensure tenderedAmount is a number or undefined for internal logic and storage
    let finalTenderedAmount: number | undefined;
    if (typeof tenderedAmountFromCall === 'number') {
      finalTenderedAmount = tenderedAmountFromCall;
    } else if (tenderedAmountFromCall === '') {
      finalTenderedAmount = undefined; // Treat empty string as undefined for storage
    }

    if (paymentMethod === 'cash' && (finalTenderedAmount === undefined || finalTenderedAmount < total)) {
      alert('เงินที่รับมาน้อยกว่ายอดรวม.');
      return;
    }

    setProcessing(true);
    try {
      const transactionItems = cart.map(item => ({
        product_id: item.id,
        quantity: item.quantity,
        unit_price: item.price,
      }));

      const { error } = await createTransaction(transactionItems, paymentMethod);
      
      if (!error) {
        // Store transaction details for receipt
        setLastTransactionDetails({
          cart: [...cart], // Deep copy of cart
          subtotal,
          total, // Use the rounded total for receipt
          paymentMethod,
          cashTendered: finalTenderedAmount, // Use the cleaned amount
          changeDue: finalTenderedAmount ? finalTenderedAmount - total : 0,
          discountAmount, // Pass discount amount
          amountAfterDiscount, // Pass amount after discount
          vatAmount, // Pass VAT amount
          priceExcludingVAT, // Pass price excluding VAT
        });

        setCart([]);
        setCashTendered(''); // Clear cash tendered after successful transaction
        setIsCashModalOpen(false); // Close cash modal
        await fetchProducts(); // Refresh product stock after transaction
        alert('ทำรายการสำเร็จ!');
        setIsReceiptModalOpen(true); // Open receipt modal
      } else {
        alert('ทำรายการไม่สำเร็จ. กรุณาลองอีกครั้ง.');
      }
    } catch (error) {
      alert('ทำรายการไม่สำเร็จ. กรุณาลองอีกครั้ง.');
    } finally {
      setProcessing(false);
    }
  };

  const handleCashPayment = () => {
    if (cart.length === 0) return;
    setCashTendered(''); // Reset cash tendered when opening modal
    setIsCashModalOpen(true);
  };

  if (productsLoading || transactionsLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-slate-600">กำลังโหลดสินค้า...</p>
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
            placeholder="ค้นหาสินค้าด้วยชื่อหรือ SKU..."
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
                  <p className="text-lg font-bold text-blue-600">฿{product.price.toFixed(0)}</p>
                  <span className={`text-xs ${product.stock === 0 ? 'text-red-600 font-bold' : 'text-slate-600'}`}>
                    {product.stock === 0 ? 'สินค้าหมด' : `สต็อก: ${product.stock}`}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="w-96 bg-white rounded-xl border border-slate-200 shadow-lg flex flex-col">
        <div className="p-6 border-b border-slate-200">
          <h3 className="text-xl font-bold text-slate-900">รายการขายปัจจุบัน</h3>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-slate-400">
              <ReceiptIcon className="w-16 h-16 mb-4" />
              <p className="text-center">ไม่มีสินค้าในตะกร้า<br />เริ่มสแกนหรือเลือกสินค้า</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cart.map((item) => (
                <div key={item.id} className="flex items-start gap-3 pb-4 border-b border-slate-100">
                  <div className="flex-1">
                    <h4 className="font-semibold text-slate-900">{item.name}</h4>
                    <p className="text-sm text-slate-600">฿{item.price.toFixed(0)} ต่อชิ้น</p>
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
                    <p className="font-bold text-slate-900">฿{(item.price * item.quantity).toFixed(0)}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-6 border-t border-slate-200 space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600">รวมเป็นเงิน</span>
              <span className="font-semibold text-slate-900">฿{subtotal.toFixed(0)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600">ส่วนลด</span>
              <span className="font-semibold text-slate-900">฿{discountAmount.toFixed(0)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600">จำนวนเงินหลังหักส่วนลด</span>
              <span className="font-semibold text-slate-900">฿{amountAfterDiscount.toFixed(0)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600">ภาษีมูลค่าเพิ่ม 7%</span>
              <span className="font-semibold text-slate-900">฿{vatAmount.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600">ราคาไม่รวมภาษีมูลค่าเพิ่ม</span>
              <span className="font-semibold text-slate-900">฿{priceExcludingVAT.toFixed(2)}</span>
            </div>
            <div className="flex items-center justify-between text-xl pt-2 border-t border-slate-200">
              <span className="font-bold text-slate-900">รวมทั้งสิ้น</span>
              <span className="font-bold text-blue-600">฿{total.toFixed(0)}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Button 
              variant="outline" 
              disabled={cart.length === 0 || processing} 
              onClick={handleCashPayment} // Open cash modal
              className="flex items-center justify-center gap-2"
            >
              <Banknote className="w-5 h-5" />
              {processing ? 'กำลังดำเนินการ...' : 'เงินสด'}
            </Button>
            <Button 
              disabled={cart.length === 0 || processing} 
              onClick={() => processPayment('card')}
              className="flex items-center justify-center gap-2"
            >
              <CreditCard className="w-5 h-5" />
              {processing ? 'กำลังดำเนินการ...' : 'บัตร'}
            </Button>
          </div>

          <Button
            variant="secondary"
            className="w-full"
            onClick={() => setCart([])}
            disabled={cart.length === 0 || processing}
          >
            ล้างตะกร้า
          </Button>

          {lastTransactionDetails && (
            <Button
              variant="ghost"
              className="w-full flex items-center justify-center gap-2 mt-2"
              onClick={() => setIsReceiptModalOpen(true)}
            >
              <ReceiptIcon className="w-5 h-5" />
              ดูใบเสร็จล่าสุด
            </Button>
          )}
        </div>
      </div>

      {/* Cash Payment Modal */}
      <Modal
        isOpen={isCashModalOpen}
        onClose={() => setIsCashModalOpen(false)}
        title="ชำระด้วยเงินสด"
        footer={
          <Button
            onClick={() => processPayment('cash', cashTendered)} // Pass cashTendered state directly
            disabled={processing || typeof cashTendered !== 'number' || cashTendered < total}
            className="w-full"
          >
            {processing ? 'กำลังดำเนินการ...' : 'ชำระเงินสด'}
          </Button>
        }
      >
        <div className="space-y-6">
          <div>
            <label htmlFor="totalAmount" className="block text-sm font-medium text-slate-700 mb-2">
              ยอดรวมที่ต้องชำระ
            </label>
            <input
              id="totalAmount"
              type="text"
              value={`฿${total.toFixed(0)}`}
              readOnly
              className="w-full px-4 py-3 border border-slate-300 rounded-lg bg-slate-50 text-lg font-bold text-slate-900 focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="cashTendered" className="block text-sm font-medium text-slate-700 mb-2">
              เงินที่รับมา
            </label>
            <input
              id="cashTendered"
              type="number"
              step="1" // Change step to 1 for whole numbers
              value={cashTendered}
              onChange={(e) => setCashTendered(parseFloat(e.target.value) || '')}
              className="w-full px-4 py-3 border border-blue-500 rounded-lg text-lg font-bold text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="ป้อนจำนวนเงินสด"
            />
          </div>

          <div className="flex items-center justify-between text-xl pt-2 border-t border-slate-200">
            <span className="font-bold text-slate-900">เงินทอน</span>
            <span className={`font-bold ${changeDue >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ฿{changeDue.toFixed(0)}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[100, 500, 1000, 2000, 5000].map((amount) => (
              <Button
                key={amount}
                variant="outline"
                onClick={() => setCashTendered((prev) => (typeof prev === 'number' ? prev + amount : amount))}
                className="flex items-center justify-center gap-2"
              >
                <Wallet className="w-4 h-4" />
                ฿{amount}
              </Button>
            ))}
            <Button
              variant="outline"
              onClick={() => setCashTendered(total)}
              className="flex items-center justify-center gap-2"
            >
              พอดี
            </Button>
          </div>
        </div>
      </Modal>

      {/* Receipt Modal */}
      <Modal
        isOpen={isReceiptModalOpen}
        onClose={() => setIsReceiptModalOpen(false)}
        title="ใบเสร็จรับเงิน"
      >
        <Receipt transactionDetails={lastTransactionDetails} />
      </Modal>
    </div>
  );
}

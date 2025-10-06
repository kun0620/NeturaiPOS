import { CartItem } from '../pages/POS'; // Import CartItem type
import { format } from 'date-fns';

interface ReceiptProps {
  transactionDetails: {
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
  } | null;
}

export default function Receipt({ transactionDetails }: ReceiptProps) {
  if (!transactionDetails) {
    return <div className="text-center text-slate-500">ไม่พบข้อมูลรายการ</div>;
  }

  const { 
    cart, 
    subtotal, 
    total, 
    paymentMethod, 
    cashTendered, 
    changeDue,
    discountAmount, // Destructure new fields
    amountAfterDiscount, // Destructure new fields
    vatAmount, // Destructure new fields
    priceExcludingVAT, // Destructure new fields
  } = transactionDetails;

  const totalQuantity = cart.reduce((sum, item) => sum + item.quantity, 0);
  const currentDate = format(new Date(), 'dd/MM/yyyy');

  return (
    <div className="font-sans text-sm text-slate-800 p-4 bg-white rounded-lg shadow-inner">
      <div className="text-center mb-6">
        {/* Placeholder for logo */}
        <div className="w-16 h-16 bg-slate-200 rounded-full mx-auto mb-3 flex items-center justify-center">
          <span className="text-2xl">🧾</span>
        </div>
        <h3 className="font-bold text-lg text-slate-900">บริษัท เนทูไร พีโอเอส จำกัด</h3>
        <p className="text-xs text-slate-600">
          123/456 ถนนสุขุมวิท แขวงคลองเตย เขตคลองเตย<br />
          กรุงเทพมหานคร 10110
        </p>
        <p className="text-xs text-slate-600 mt-1">
          เลขผู้เสียภาษี: 1234567890000<br />
          โทร. 02-123-4567<br />
          เว็บไซต์: www.neturaipos.com
        </p>
      </div>

      <div className="border-t border-b border-dashed border-slate-300 py-4 mb-4">
        <h4 className="text-center font-semibold text-slate-900 mb-3">ใบกำกับภาษีอย่างย่อ/ใบเสร็จรับเงิน</h4>
        <div className="flex justify-between mb-1">
          <span>พนักงานขาย:</span>
          <span>สมชาย ใจดี</span>
        </div>
        <div className="flex justify-between">
          <span>วันที่:</span>
          <span>{currentDate}</span>
        </div>
        <div className="flex justify-between mt-1">
          <span>วิธีการชำระเงิน:</span>
          <span>{paymentMethod === 'cash' ? 'เงินสด' : 'บัตรเครดิต/เดบิต'}</span>
        </div>
      </div>

      <div className="mb-4">
        {cart.map((item, index) => (
          <div key={item.id} className="flex justify-between items-start mb-2">
            <div className="flex-1 pr-2">
              <p className="font-medium text-slate-900">{item.name}</p>
              <p className="text-xs text-slate-600">{item.quantity} x ฿{item.price.toFixed(0)}</p>
            </div>
            <p className="font-semibold text-slate-900">฿{(item.price * item.quantity).toFixed(0)}</p>
          </div>
        ))}
      </div>

      <div className="border-t border-dashed border-slate-300 pt-4 mb-4">
        <div className="flex justify-between mb-1">
          <span>จำนวนรวมสินค้า:</span>
          <span>{totalQuantity} ชิ้น</span>
        </div>
        <div className="flex justify-between mb-1">
          <span>รวมเป็นเงิน:</span>
          <span>฿{subtotal.toFixed(0)}</span>
        </div>
        <div className="flex justify-between mb-1">
          <span>ส่วนลด:</span>
          <span>฿{discountAmount.toFixed(0)}</span>
        </div>
        <div className="flex justify-between mb-1">
          <span>จำนวนเงินหลังหักส่วนลด:</span>
          <span>฿{amountAfterDiscount.toFixed(0)}</span>
        </div>
        <div className="flex justify-between mb-1">
          <span>ภาษีมูลค่าเพิ่ม 7%:</span>
          <span>฿{vatAmount.toFixed(2)}</span>
        </div>
        <div className="flex justify-between mb-1">
          <span>ราคาไม่รวมภาษีมูลค่าเพิ่ม:</span>
          <span>฿{priceExcludingVAT.toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-bold text-lg text-slate-900 mt-2 pt-2 border-t border-slate-200">
          <span>รวมทั้งสิ้น:</span>
          <span>฿{total.toFixed(0)}</span>
        </div>
      </div>

      {paymentMethod === 'cash' && (
        <div className="border-t border-dashed border-slate-300 pt-4 mb-4">
          <div className="flex justify-between mb-1">
            <span>เงินที่รับมา:</span>
            <span>฿{(cashTendered ?? 0).toFixed(0)}</span>
          </div>
          <div className="flex justify-between font-bold text-lg text-green-600">
            <span>เงินทอน:</span>
            <span>฿{(changeDue ?? 0).toFixed(0)}</span>
          </div>
        </div>
      )}

      <div className="border-t border-dashed border-slate-300 pt-4 text-center text-xs text-slate-500">
        <p className="font-semibold mb-1">VAT INCLUDED</p>
        <p>ขอบคุณที่ใช้บริการ!</p>
        <p className="mt-2">ใช้งาน POS ฟรีได้ที่ NeturaiPOS.com</p>
      </div>
    </div>
  );
}

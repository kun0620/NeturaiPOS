import { CartItem } from '../pages/POS';
import { Transaction, TransactionItem } from '../types';
import { format } from 'date-fns';
import { useCompanySettings } from '../hooks/useCompanySettings'; // Import the hook

// Define a type that can be either TransactionDetails (from POS) or Transaction (from DB)
export interface ReceiptProps {
  transaction: (TransactionDetails | Transaction) | null;
  currentSalespersonName?: string; // Add new prop for salesperson name from POS
}

// Helper type guard to differentiate between TransactionDetails and Transaction
const isTransactionDetails = (t: TransactionDetails | Transaction): t is TransactionDetails => {
  return (t as TransactionDetails).cart !== undefined;
};

// Re-export CartItem and TransactionDetails from POS.tsx for use here
export interface TransactionDetails {
  cart: CartItem[];
  subtotal: number;
  total: number;
  paymentMethod: 'cash' | 'card';
  cashTendered?: number;
  changeDue?: number;
  discountAmount: number;
  amountAfterDiscount: number;
  vatAmount: number;
  priceExcludingVAT: number;
  salespersonName?: string; // Add salespersonName here for consistency
}

export default function Receipt({ transaction, currentSalespersonName }: ReceiptProps) {
  const { settings, loading, error } = useCompanySettings(); // Fetch company settings

  if (!transaction) {
    return <div className="text-center text-slate-500 p-4">ไม่พบข้อมูลใบเสร็จ</div>;
  }

  const isDetails = isTransactionDetails(transaction);

  // Extract common properties, handling differences between TransactionDetails and Transaction
  const items = isDetails
    ? transaction.cart
    : transaction.transaction_items.map((item: TransactionItem) => ({
        id: item.product_id,
        name: item.products?.name || 'Unknown Product',
        price: item.unit_price,
        quantity: item.quantity,
        stock: 0, // Not relevant for receipt display
      }));

  const subtotal = isDetails
    ? transaction.subtotal
    : transaction.transaction_items.reduce((sum, item) => sum + item.unit_price * item.quantity, 0);

  const discountAmount = isDetails ? transaction.discountAmount : transaction.discount_amount;
  const amountAfterDiscount = isDetails ? transaction.amountAfterDiscount : subtotal - discountAmount; // Recalculate for consistency
  const vatAmount = isDetails ? transaction.vatAmount : transaction.tax_amount;
  const priceExcludingVAT = isDetails ? transaction.priceExcludingVAT : transaction.price_excluding_vat;
  const total = isDetails ? transaction.total : transaction.total_amount;
  const paymentMethod = isDetails ? transaction.paymentMethod : transaction.payment_method;
  const cashTendered = isDetails ? transaction.cashTendered : undefined; // Only available for immediate cash transactions
  const changeDue = isDetails ? transaction.changeDue : undefined; // Only available for immediate cash transactions
  const transactionDate = isDetails ? new Date() : new Date(transaction.created_at);
  const transactionId = isDetails ? 'N/A' : transaction.id.substring(0, 8); // Use a short ID for display
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);

  // Use company settings or fallback to default placeholders
  const companyName = settings?.company_name || 'บริษัท โฟลว์แอคเคาท์ จำกัด';
  const companyAddressLine1 = settings?.company_address_line1 || '141/12 ชั้น 11 ยูนิต 12B อาคารชุด สกุลไทย สุรวงศ์';
  const companyAddressLine2 = settings?.company_address_line2 || 'ทาวเวอร์ ถนนสุรวงศ์ แขวงสุริยวงศ์ เขตบางรัก';
  const companyAddressLine3 = settings?.company_address_line3 || 'กรุงเทพมหานคร 10500';
  const taxId = settings?.tax_id || '1234567890000';
  const phone = settings?.phone || '022374777';
  const website = settings?.website || 'www.example.com';
  const receiptHeaderText = settings?.receipt_header_text || 'ใบกำกับภาษีอย่างย่อ/ใบเสร็จรับเงิน';
  const receiptFooterText = settings?.receipt_footer_text || 'ใช้งาน POS ฟรีได้ที่ FlowAccount.com';
  const vatRateDisplay = settings?.vat_rate !== undefined ? (settings.vat_rate * 100).toFixed(0) : '7'; // Display as percentage
  
  // Determine salesperson name: 1. from transaction (if historical), 2. from currentSalespersonName (if new transaction)
  // Removed fallback to settings?.salesperson_name as per user's request.
  const displaySalespersonName = isDetails 
    ? currentSalespersonName || transaction.salespersonName || 'สมชาย ใจดี'
    : transaction.salesperson_name || 'สมชาย ใจดี';

  return (
    <div className="bg-white p-6 rounded-lg shadow-inner max-w-md mx-auto font-mono text-sm text-slate-800">
      <div className="text-center mb-6">
        {/* Placeholder for logo */}
        <div className="w-12 h-12 bg-slate-200 rounded-full mx-auto mb-2 flex items-center justify-center">
          <span className="text-xl">📈</span>
        </div>
        <h2 className="text-lg font-bold text-slate-900 mb-1">{companyName}</h2>
        <p className="text-xs text-slate-600">(สำนักงานใหญ่)</p>
        <p className="text-xs text-slate-600">{companyAddressLine1}</p>
        <p className="text-xs text-slate-600">{companyAddressLine2}</p>
        <p className="text-xs text-slate-600">{companyAddressLine3}</p>
        <p className="text-xs text-slate-600 mt-2">เลขผู้เสียภาษี {taxId}</p>
        <p className="text-xs text-slate-600">โทร. {phone}</p>
        <p className="text-xs text-slate-600">เว็บไซต์ {website}</p>
      </div>

      <div className="border-t border-dashed border-slate-300 py-4 mb-4">
        <p className="text-center font-semibold text-slate-900 mb-2">{receiptHeaderText}</p>
        <p className="text-center text-slate-700 mb-4">{transactionId}</p> {/* Use transactionId here */}
        <div className="flex justify-between text-xs mb-1">
          <span>พนักงานขาย</span> {/* Changed back to "พนักงานขาย" */}
          <span>{displaySalespersonName}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span>วันที่</span>
          <span>{format(transactionDate, 'dd/MM/yyyy HH:mm')}</span> {/* Changed format here */}
        </div>
      </div>

      <div className="border-t border-b border-dashed border-slate-300 py-4 mb-4">
        {items.map((item, index) => (
          <div key={item.id + '-' + index} className="flex justify-between mb-2">
            <span className="w-10">{item.quantity}</span>
            <span className="flex-1">{item.name}</span>
            <span className="w-20 text-right">{(item.price * item.quantity).toFixed(2)}</span>
          </div>
        ))}
        <div className="flex justify-between mt-4 pt-2 border-t border-dashed border-slate-300">
          <span>จำนวนรวม</span>
          <span className="font-semibold">{totalQuantity}</span>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex justify-between">
          <span>รวมเป็นเงิน</span>
          <span className="font-semibold">{subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>ส่วนลด</span>
          <span className="font-semibold">{discountAmount.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>จำนวนเงินหลังหักส่วนลด</span>
          <span className="font-semibold">{amountAfterDiscount.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>ภาษีมูลค่าเพิ่ม {vatRateDisplay}%</span>
          <span className="font-semibold">{vatAmount.toFixed(2)}</span>
        </div>
        <div className="flex justify-between">
          <span>ราคาไม่รวมภาษีมูลค่าเพิ่ม</span>
          <span className="font-semibold">{priceExcludingVAT.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-lg font-bold border-t-2 border-b-4 border-slate-800 pt-2 mt-2">
          <span>รวมทั้งสิ้น</span>
          <span>{total.toFixed(2)}</span>
        </div>
      </div>

      <div className="text-center text-xs text-slate-600 mb-6">
        <p className="font-bold text-slate-900 mt-4">VAT INCLUDED</p>
      </div>

      <div className="text-center text-xs text-slate-600 border-t border-dashed border-slate-300 pt-4">
        <p>{receiptFooterText}</p>
      </div>
    </div>
  );
}

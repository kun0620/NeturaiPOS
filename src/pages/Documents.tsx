import { useState } from 'react';
import { FileText, Download, Printer, Search } from 'lucide-react';
import Button from '../components/UI/Button';
import Modal from '../components/UI/Modal';
import Receipt from '../components/Receipt';
import { useTransactions } from '../hooks/useTransactions';
import { Transaction } from '../types';
import { format } from 'date-fns'; // Import format from date-fns

export default function Documents() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);

  const { transactions, loading, error } = useTransactions();

  const filteredTransactions = transactions.filter(transaction =>
    transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    format(new Date(transaction.created_at), 'yyyy-MM-dd').includes(searchTerm) ||
    transaction.payment_method.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openReceiptModal = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsReceiptModalOpen(true);
  };

  const handlePrint = () => {
    if (selectedTransaction) {
      // This will print the content of the modal
      const printContent = document.getElementById('receipt-print-area');
      if (printContent) {
        const originalContents = document.body.innerHTML;
        document.body.innerHTML = printContent.innerHTML;
        window.print();
        document.body.innerHTML = originalContents;
        window.location.reload(); // Reload to restore original page state
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-slate-600">กำลังโหลดเอกสาร...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-600 text-center p-4">เกิดข้อผิดพลาดในการโหลดเอกสาร: {error}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900">เอกสาร</h2>
        <div className="relative">
          <input
            type="text"
            placeholder="ค้นหาเอกสาร..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-64 pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                รหัสรายการ
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                ประเภท
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                วันที่
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                วิธีการชำระ
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                ยอดรวม
              </th>
              <th scope="col" className="relative px-6 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-slate-200">
            {filteredTransactions.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-4 text-center text-slate-500">
                  ไม่พบเอกสารที่ตรงกับการค้นหา
                </td>
              </tr>
            ) : (
              filteredTransactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-slate-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FileText className="w-5 h-5 text-slate-400 mr-3" />
                      <span className="text-slate-900 font-medium">{transaction.id.substring(0, 8)}...</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      ใบเสร็จรับเงิน
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-slate-600">
                    {format(new Date(transaction.created_at), 'yyyy-MM-dd HH:mm')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-slate-600 capitalize">
                    {transaction.payment_method === 'cash' ? 'เงินสด' : 'บัตร'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right font-semibold text-slate-900">
                    ฿{transaction.total_amount.toFixed(0)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end gap-2">
                      <Button variant="ghost" size="sm" onClick={() => openReceiptModal(transaction)}>
                        ดูใบเสร็จ
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Receipt Modal for past transactions */}
      <Modal
        isOpen={isReceiptModalOpen}
        onClose={() => setIsReceiptModalOpen(false)}
        title={selectedTransaction ? `ใบเสร็จรับเงิน #${selectedTransaction.id.substring(0, 8)}...` : 'ใบเสร็จรับเงิน'}
        size="lg"
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={handlePrint} disabled={!selectedTransaction}>
              <Printer className="w-4 h-4 mr-2" /> พิมพ์
            </Button>
            <Button onClick={() => setIsReceiptModalOpen(false)}>
              ปิด
            </Button>
          </div>
        }
      >
        <div id="receipt-print-area"> {/* Add an ID for printing */}
          <Receipt transaction={selectedTransaction} />
        </div>
      </Modal>
    </div>
  );
}

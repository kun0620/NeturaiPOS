import { useState, useEffect } from 'react';
import { useCompanySettings } from '../hooks/useCompanySettings';
import Button from '../components/UI/Button';
import Input from '../components/UI/Input';

type SettingCategory = 'companyInfo' | 'receiptSettings';

export default function AdminSettings() {
  const { settings, loading, error, updateCompanySettings, fetchCompanySettings } = useCompanySettings();
  const [formData, setFormData] = useState({
    company_name: '',
    company_address_line1: '',
    company_address_line2: '',
    company_address_line3: '',
    tax_id: '',
    phone: '',
    website: '',
    receipt_header_text: '',
    receipt_footer_text: '',
    vat_rate: 0,
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState<boolean | null>(null);
  const [activeCategory, setActiveCategory] = useState<SettingCategory>('companyInfo');

  useEffect(() => {
    if (settings) {
      setFormData({
        company_name: settings.company_name || '',
        company_address_line1: settings.company_address_line1 || '',
        company_address_line2: settings.company_address_line2 || '',
        company_address_line3: settings.company_address_line3 || '',
        tax_id: settings.tax_id || '',
        phone: settings.phone || '',
        website: settings.website || '',
        receipt_header_text: settings.receipt_header_text || '',
        receipt_footer_text: settings.receipt_footer_text || '',
        vat_rate: settings.vat_rate || 0,
      });
    }
  }, [settings]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'vat_rate' ? parseFloat(value) : value,
    }));
  };

  const handleVatRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    // Round the percentage value to a whole number before converting to decimal
    const roundedPercentage = Math.round(value);
    setFormData((prev) => ({
      ...prev,
      vat_rate: roundedPercentage / 100, // Store as decimal
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(null);

    const { error } = await updateCompanySettings(formData);

    if (!error) {
      setSaveSuccess(true);
      fetchCompanySettings(); // Re-fetch to ensure latest data is used
    } else {
      setSaveSuccess(false);
      console.error('Failed to save settings:', error);
    }
    setIsSaving(false);
    setTimeout(() => setSaveSuccess(null), 3000); // Clear success/error message after 3 seconds
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-slate-600">กำลังโหลดการตั้งค่า...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center text-red-600 p-4">
        <p>เกิดข้อผิดพลาดในการโหลดการตั้งค่า: {error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-lg">
      <h1 className="text-3xl font-bold text-slate-900 mb-8">ตั้งค่าระบบ</h1>

      <div className="mb-8 border-b border-slate-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          <button
            type="button"
            onClick={() => setActiveCategory('companyInfo')}
            className={`
              ${activeCategory === 'companyInfo'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }
              whitespace-nowrap py-4 px-1 border-b-2 font-medium text-lg transition-colors duration-200
            `}
          >
            ข้อมูลบริษัท
          </button>
          <button
            type="button"
            onClick={() => setActiveCategory('receiptSettings')}
            className={`
              ${activeCategory === 'receiptSettings'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }
              whitespace-nowrap py-4 px-1 border-b-2 font-medium text-lg transition-colors duration-200
            `}
          >
            การตั้งค่าใบเสร็จ
          </button>
        </nav>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        {activeCategory === 'companyInfo' && (
          <section className="space-y-4">
            <h2 className="sr-only">ข้อมูลบริษัท</h2> {/* Hidden heading for accessibility */}
            <Input
              label="ชื่อบริษัท"
              name="company_name"
              value={formData.company_name}
              onChange={handleChange}
              placeholder="ชื่อบริษัทของคุณ"
              required
            />
            <Input
              label="ที่อยู่บรรทัดที่ 1"
              name="company_address_line1"
              value={formData.company_address_line1}
              onChange={handleChange}
              placeholder="เลขที่, หมู่, ซอย"
            />
            <Input
              label="ที่อยู่บรรทัดที่ 2"
              name="company_address_line2"
              value={formData.company_address_line2}
              onChange={handleChange}
              placeholder="ถนน, แขวง/ตำบล"
            />
            <Input
              label="ที่อยู่บรรทัดที่ 3"
              name="company_address_line3"
              value={formData.company_address_line3}
              onChange={handleChange}
              placeholder="เขต/อำเภอ, จังหวัด, รหัสไปรษณีย์"
            />
            <Input
              label="เลขผู้เสียภาษี"
              name="tax_id"
              value={formData.tax_id}
              onChange={handleChange}
              placeholder="1234567890123"
            />
            <Input
              label="เบอร์โทรศัพท์"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="02-XXX-XXXX"
            />
            <Input
              label="เว็บไซต์"
              name="website"
              value={formData.website}
              onChange={handleChange}
              placeholder="www.yourcompany.com"
            />
          </section>
        )}

        {activeCategory === 'receiptSettings' && (
          <section className="space-y-4">
            <h2 className="sr-only">การตั้งค่าใบเสร็จ</h2> {/* Hidden heading for accessibility */}
            <Input
              label="ข้อความหัวใบเสร็จ"
              name="receipt_header_text"
              value={formData.receipt_header_text}
              onChange={handleChange}
              placeholder="ใบกำกับภาษีอย่างย่อ/ใบเสร็จรับเงิน"
            />
            <Input
              label="ข้อความท้ายใบเสร็จ"
              name="receipt_footer_text"
              value={formData.receipt_footer_text}
              onChange={handleChange}
              placeholder="ขอบคุณที่ใช้บริการ"
            />
            <Input
              label="อัตราภาษีมูลค่าเพิ่ม (%)"
              name="vat_rate"
              type="number"
              step="1"
              value={Math.round(formData.vat_rate * 100)}
              onChange={handleVatRateChange}
              placeholder="7"
            />
          </section>
        )}

        <div className="flex items-center justify-end gap-4 pt-6 border-t border-slate-200">
          {saveSuccess === true && (
            <span className="text-green-600 font-medium">บันทึกสำเร็จ!</span>
          )}
          {saveSuccess === false && (
            <span className="text-red-600 font-medium">บันทึกไม่สำเร็จ!</span>
          )}
          <Button type="submit" disabled={isSaving}>
            {isSaving ? 'กำลังบันทึก...' : 'บันทึกการตั้งค่า'}
          </Button>
        </div>
      </form>
    </div>
  );
}

/*
      # Create company_settings table

      1. New Tables
        - `company_settings`
          - `id` (uuid, primary key, default gen_random_uuid())
          - `company_name` (text, default 'บริษัท โฟลว์แอคเคาท์ จำกัด')
          - `company_address_line1` (text, default '141/12 ชั้น 11 ยูนิต 12B อาคารชุด สกุลไทย สุรวงศ์')
          - `company_address_line2` (text, default 'ทาวเวอร์ ถนนสุรวงศ์ แขวงสุริยวงศ์ เขตบางรัก')
          - `company_address_line3` (text, default 'กรุงเทพมหานคร 10500')
          - `tax_id` (text, default '1234567890000')
          - `phone` (text, default '022374777')
          - `website` (text, default 'www.example.com')
          - `receipt_header_text` (text, default 'ใบกำกับภาษีอย่างย่อ/ใบเสร็จรับเงิน')
          - `receipt_footer_text` (text, default 'ใช้งาน POS ฟรีได้ที่ FlowAccount.com')
          - `vat_rate` (numeric, default 0.07)
          - `salesperson_name` (text, default 'สมชาย ใจดี')
          - `created_at` (timestamptz, default now())
          - `updated_at` (timestamptz, default now())
      2. Security
        - Enable RLS on `company_settings` table
        - Add policy for authenticated users to read data
        - Add policy for admin users to insert and update data
      3. Important Notes
        - This table is designed to hold a single row of company-wide settings.
        - A trigger will be added to ensure `updated_at` is automatically set on updates.
    */

    CREATE TABLE IF NOT EXISTS company_settings (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      company_name text DEFAULT 'บริษัท โฟลว์แอคเคาท์ จำกัด' NOT NULL,
      company_address_line1 text DEFAULT '141/12 ชั้น 11 ยูนิต 12B อาคารชุด สกุลไทย สุรวงศ์' NOT NULL,
      company_address_line2 text DEFAULT 'ทาวเวอร์ ถนนสุรวงศ์ แขวงสุริยวงศ์ เขตบางรัก' NOT NULL,
      company_address_line3 text DEFAULT 'กรุงเทพมหานคร 10500' NOT NULL,
      tax_id text DEFAULT '1234567890000' NOT NULL,
      phone text DEFAULT '022374777' NOT NULL,
      website text DEFAULT 'www.example.com' NOT NULL,
      receipt_header_text text DEFAULT 'ใบกำกับภาษีอย่างย่อ/ใบเสร็จรับเงิน' NOT NULL,
      receipt_footer_text text DEFAULT 'ใช้งาน POS ฟรีได้ที่ FlowAccount.com' NOT NULL,
      vat_rate numeric DEFAULT 0.07 NOT NULL,
      salesperson_name text DEFAULT 'สมชาย ใจดี' NOT NULL,
      created_at timestamptz DEFAULT now() NOT NULL,
      updated_at timestamptz DEFAULT now() NOT NULL
    );

    ALTER TABLE company_settings ENABLE ROW LEVEL SECURITY;

    CREATE POLICY "Allow authenticated users to read company settings"
      ON company_settings
      FOR SELECT
      TO authenticated
      USING (true);

    CREATE POLICY "Allow admin users to insert company settings"
      ON company_settings
      FOR INSERT
      TO authenticated
      WITH CHECK (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

    CREATE POLICY "Allow admin users to update company settings"
      ON company_settings
      FOR UPDATE
      TO authenticated
      USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

    -- Function to update updated_at column
    CREATE OR REPLACE FUNCTION update_updated_at_column()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.updated_at = now();
      RETURN NEW;
    END;
    $$ language 'plpgsql';

    -- Trigger to call the function on update
    CREATE TRIGGER update_company_settings_updated_at
    BEFORE UPDATE ON company_settings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

    -- Insert initial default settings if the table is empty
    DO $$
    BEGIN
      IF NOT EXISTS (SELECT 1 FROM company_settings) THEN
        INSERT INTO company_settings (company_name, company_address_line1, company_address_line2, company_address_line3, tax_id, phone, website, receipt_header_text, receipt_footer_text, vat_rate, salesperson_name)
        VALUES (
          'บริษัท โฟลว์แอคเคาท์ จำกัด',
          '141/12 ชั้น 11 ยูนิต 12B อาคารชุด สกุลไทย สุรวงศ์',
          'ทาวเวอร์ ถนนสุรวงศ์ แขวงสุริยวงศ์ เขตบางรัก',
          'กรุงเทพมหานคร 10500',
          '1234567890000',
          '022374777',
          'www.example.com',
          'ใบกำกับภาษีอย่างย่อ/ใบเสร็จรับเงิน',
          'ใช้งาน POS ฟรีได้ที่ FlowAccount.com',
          0.07,
          'สมชาย ใจดี'
        );
      END IF;
    END $$;

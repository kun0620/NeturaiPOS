# RetailHub - Application Sitemap & Structure

## Application Overview
RetailHub is an integrated commerce platform combining Point of Sale, Inventory Management, and Online Store functionality.

## Page Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         RetailHub                            │
│                    (Main Application)                        │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ├─── Dashboard (Home)
                         │    └─── Stats Overview
                         │    └─── Sales Chart
                         │    └─── Category Breakdown
                         │    └─── Recent Transactions
                         │
                         ├─── Point of Sale
                         │    └─── Product Grid
                         │    └─── Shopping Cart
                         │    └─── Payment Options
                         │
                         ├─── Inventory Management
                         │    └─── Product Table
                         │    └─── Add/Edit Product Modal
                         │    └─── Stock Filters
                         │    └─── Import/Export Tools
                         │
                         ├─── Online Store
                         │    ├─── Product Catalog
                         │    │    └─── Product Cards
                         │    │    └─── Search/Filter
                         │    └─── Checkout Page
                         │         └─── Cart Review
                         │         └─── Shipping Form
                         │         └─── Order Summary
                         │
                         ├─── User Management
                         │    └─── User Table
                         │    └─── Add/Edit User Modal
                         │    └─── Role Filters
                         │
                         └─── Reports & Analytics
                              └─── KPI Cards
                              └─── Sales Trend Chart
                              └─── Order Volume Chart
                              └─── Top Products List
                              └─── Performance Metrics
```

## Navigation Structure

### Primary Navigation (Sidebar)
- Dashboard - Business overview and key metrics
- Point of Sale - Transaction processing interface
- Inventory - Product stock management
- Online Store - Customer-facing storefront
- Users - Team member management
- Reports - Analytics and insights

### Global Components
- **Sidebar**: Persistent left navigation with branding
- **Header**: Page titles, search bar, notifications, settings
- **Main Content Area**: Dynamic page content

## Page Details

### 1. Dashboard
**Route**: `/` (default)
**Purpose**: Central hub for business metrics and overview
**Components**:
- 4 stat cards (Revenue, Orders, Products Sold, Low Stock)
- Sales overview bar chart
- Sales by category breakdown
- Recent transactions table

### 2. Point of Sale
**Route**: `/pos`
**Purpose**: Process in-store transactions
**Components**:
- Product search bar
- Product grid (clickable cards)
- Live shopping cart sidebar
- Quantity controls
- Payment method buttons (Cash/Card)
- Transaction summary

### 3. Inventory Management
**Route**: `/inventory`
**Purpose**: Track and manage product stock
**Components**:
- Category filters
- Statistics cards
- Product table with sorting
- Add product modal
- Edit/Delete actions
- Import/Export buttons
- Low stock alerts

### 4. Online Store
**Route**: `/store`
**Purpose**: Customer product browsing and purchasing
**Components**:
- **Catalog View**:
  - Product grid with images
  - Star ratings
  - Quick actions (View, Favorite)
  - Add to cart buttons
  - Cart counter badge
- **Checkout View**:
  - Shopping cart review
  - Shipping information form
  - Order summary sidebar
  - Place order button

### 5. User Management
**Route**: `/users`
**Purpose**: Manage team members and permissions
**Components**:
- Role and status filters
- Statistics cards
- User table with avatars
- Add user modal
- Edit/Delete actions
- Role badges

### 6. Reports & Analytics
**Route**: `/reports`
**Purpose**: Business intelligence and insights
**Components**:
- Date range selector
- 4 gradient KPI cards
- Sales trend chart
- Order volume chart
- Top products list
- Performance metrics with progress bars
- Export report button

## Reusable UI Components

### Layout Components
- `Sidebar` - Main navigation
- `Header` - Page header with search

### UI Components
- `Button` - Primary, secondary, outline, danger variants
- `Modal` - Reusable dialog with header, body, footer
- `Table` - Data table with custom cell rendering
- `StatCard` - Metric display with trend indicators

## Design System

### Colors
- Primary: Blue (600-700)
- Success: Green (500-700)
- Warning: Yellow (500-700)
- Danger: Red (500-700)
- Neutral: Slate (50-900)

### Typography
- Headings: Bold, slate-900
- Body: Regular, slate-600
- Labels: Medium, slate-700

### Spacing
- Consistent 8px grid system
- Generous padding for cards (p-6)
- Proper gap spacing (gap-4, gap-6)

### Interactions
- Hover states on all interactive elements
- Smooth transitions
- Clear focus states
- Loading and disabled states

## Data Structure

### Mock Data Entities
- **Products**: id, name, sku, price, stock, category
- **Transactions**: id, date, total, items, status
- **Users**: id, name, email, role, status
- **Statistics**: label, value, change, trend
- **Charts**: labels, sales data, orders data

## Future Implementation Notes

When adding functionality:
1. Connect to Supabase database for data persistence
2. Add authentication and user sessions
3. Implement real payment processing
4. Add product image uploads
5. Create reporting exports (PDF, Excel)
6. Add email notifications
7. Implement real-time inventory updates
8. Add barcode scanning for POS
9. Integrate shipping providers
10. Add mobile responsive breakpoints

## File Structure

```
src/
├── components/
│   ├── Layout/
│   │   ├── Sidebar.tsx
│   │   └── Header.tsx
│   └── UI/
│       ├── Button.tsx
│       ├── Modal.tsx
│       ├── StatCard.tsx
│       └── Table.tsx
├── pages/
│   ├── Dashboard.tsx
│   ├── POS.tsx
│   ├── Inventory.tsx
│   ├── Store.tsx
│   ├── Users.tsx
│   └── Reports.tsx
├── data/
│   └── mockData.ts
├── types/
│   └── index.ts
└── App.tsx
```

## Key Features Ready for Implementation

1. **POS System**
   - Add transaction processing
   - Receipt generation
   - Payment gateway integration
   - Refund functionality

2. **Inventory**
   - Low stock alerts/notifications
   - Bulk import/export
   - Product categories management
   - Supplier tracking

3. **Online Store**
   - Product reviews and ratings
   - Wishlist functionality
   - Order tracking
   - Customer accounts

4. **User Management**
   - Role-based permissions
   - Activity logs
   - Password management
   - Session management

5. **Reports**
   - Custom date ranges
   - PDF/Excel exports
   - Scheduled reports
   - Advanced analytics

---

**Template Version**: 1.0
**Last Updated**: 2025-10-03
**Status**: Ready for Development

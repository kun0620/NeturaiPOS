import { Product, Transaction, User, StatCard } from '../types';

export const statsData: StatCard[] = [
  { label: 'Total Revenue', value: '$45,231', change: '+12.5%', trend: 'up' },
  { label: 'Total Orders', value: '1,234', change: '+8.2%', trend: 'up' },
  { label: 'Products Sold', value: '3,456', change: '+15.3%', trend: 'up' },
  { label: 'Low Stock Items', value: '23', change: '-5', trend: 'down' },
];

export const mockProducts: Product[] = [
  { id: '1', name: 'Wireless Headphones', sku: 'WH-001', price: 79.99, stock: 45, category: 'Electronics' },
  { id: '2', name: 'Smart Watch', sku: 'SW-002', price: 199.99, stock: 12, category: 'Electronics' },
  { id: '3', name: 'Coffee Maker', sku: 'CM-003', price: 89.99, stock: 8, category: 'Appliances' },
  { id: '4', name: 'Yoga Mat', sku: 'YM-004', price: 29.99, stock: 67, category: 'Sports' },
  { id: '5', name: 'Desk Lamp', sku: 'DL-005', price: 39.99, stock: 34, category: 'Home' },
  { id: '6', name: 'Backpack', sku: 'BP-006', price: 49.99, stock: 23, category: 'Accessories' },
  { id: '7', name: 'Water Bottle', sku: 'WB-007', price: 19.99, stock: 89, category: 'Sports' },
  { id: '8', name: 'Notebook Set', sku: 'NS-008', price: 14.99, stock: 156, category: 'Stationery' },
];

export const mockTransactions: Transaction[] = [
  { id: 'TXN-001', date: '2025-10-03 14:30', total: 159.98, items: 2, status: 'completed' },
  { id: 'TXN-002', date: '2025-10-03 13:45', total: 79.99, items: 1, status: 'completed' },
  { id: 'TXN-003', date: '2025-10-03 12:20', total: 249.97, items: 3, status: 'completed' },
  { id: 'TXN-004', date: '2025-10-03 11:10', total: 89.99, items: 1, status: 'pending' },
  { id: 'TXN-005', date: '2025-10-03 10:00', total: 129.98, items: 2, status: 'completed' },
];

export const mockUsers: User[] = [
  { id: '1', name: 'John Anderson', email: 'john.anderson@example.com', role: 'admin', status: 'active' },
  { id: '2', name: 'Sarah Mitchell', email: 'sarah.mitchell@example.com', role: 'manager', status: 'active' },
  { id: '3', name: 'Michael Chen', email: 'michael.chen@example.com', role: 'staff', status: 'active' },
  { id: '4', name: 'Emily Rodriguez', email: 'emily.rodriguez@example.com', role: 'staff', status: 'active' },
  { id: '5', name: 'David Kim', email: 'david.kim@example.com', role: 'staff', status: 'inactive' },
];

export const chartData = {
  labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
  sales: [4200, 3800, 5100, 4600, 5400, 6200, 5800],
  orders: [45, 38, 52, 47, 55, 63, 59],
};

export const categoryData = [
  { name: 'Electronics', value: 35, color: 'bg-blue-500' },
  { name: 'Appliances', value: 20, color: 'bg-green-500' },
  { name: 'Sports', value: 15, color: 'bg-yellow-500' },
  { name: 'Home', value: 12, color: 'bg-purple-500' },
  { name: 'Accessories', value: 10, color: 'bg-pink-500' },
  { name: 'Stationery', value: 8, color: 'bg-orange-500' },
];

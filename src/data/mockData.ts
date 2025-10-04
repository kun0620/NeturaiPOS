import { Product, StatCard } from '../types';

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

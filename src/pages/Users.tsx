import { useState } from 'react';
import { Plus, CreditCard as Edit, Trash2, Mail, Phone, Shield } from 'lucide-react';
import { useUsers } from '../hooks/useUsers';
import Button from '../components/UI/Button';
import Modal from '../components/UI/Modal';
import Table from '../components/UI/Table';
import { User } from '../types';

export default function Users() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'staff',
    status: 'active',
  });

  const { users, loading, addUser, deleteUser } = useUsers();

  const columns = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'role', label: 'Role', align: 'center' as const },
    { key: 'status', label: 'Status', align: 'center' as const },
    { key: 'actions', label: 'Actions', align: 'center' as const },
  ];

  const handleAddUser = async () => {
    const { error } = await addUser(formData);
    if (!error) {
      setIsModalOpen(false);
      setFormData({
        name: '',
        email: '',
        role: 'staff',
        status: 'active',
      });
    } else {
      alert('Failed to add user: ' + error.message);
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      await deleteUser(id);
    }
  };

  const renderCell = (user: User, column: typeof columns[0]) => {
    switch (column.key) {
      case 'name':
        return (
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-200 rounded-full flex items-center justify-center">
              <span className="text-sm font-semibold text-slate-700">
                {user.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')}
              </span>
            </div>
            <span className="font-semibold text-slate-900">{user.name}</span>
          </div>
        );
      case 'email':
        return (
          <div className="flex items-center gap-2 text-slate-600">
            <Mail className="w-4 h-4" />
            <span>{user.email}</span>
          </div>
        );
      case 'role':
        return (
          <span
            className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${
              user.role === 'admin'
                ? 'bg-red-100 text-red-700'
                : user.role === 'manager'
                ? 'bg-blue-100 text-blue-700'
                : 'bg-slate-100 text-slate-700'
            }`}
          >
            <Shield className="w-3 h-3" />
            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
          </span>
        );
      case 'status':
        return (
          <span
            className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
              user.status === 'active'
                ? 'bg-green-100 text-green-700'
                : 'bg-slate-100 text-slate-600'
            }`}
          >
            {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
          </span>
        );
      case 'actions':
        return (
          <div className="flex items-center justify-center gap-2">
            <button className="p-2 hover:bg-blue-50 text-blue-600 rounded-lg transition-colors">
              <Edit className="w-4 h-4" />
            </button>
            <button 
              onClick={() => handleDeleteUser(user.id)}
              className="p-2 hover:bg-red-50 text-red-600 rounded-lg transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-slate-600">Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <select className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>All Roles</option>
            <option>Admin</option>
            <option>Manager</option>
            <option>Staff</option>
          </select>
          <select className="px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option>All Status</option>
            <option>Active</option>
            <option>Inactive</option>
          </select>
        </div>

        <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add User
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <p className="text-sm font-medium text-slate-600">Total Users</p>
          <p className="text-3xl font-bold text-slate-900 mt-2">{users.length}</p>
        </div>
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <p className="text-sm font-medium text-slate-600">Active Users</p>
          <p className="text-3xl font-bold text-green-600 mt-2">
            {users.filter((u) => u.status === 'active').length}
          </p>
        </div>
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <p className="text-sm font-medium text-slate-600">Administrators</p>
          <p className="text-3xl font-bold text-slate-900 mt-2">
            {users.filter((u) => u.role === 'admin').length}
          </p>
        </div>
        <div className="bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <p className="text-sm font-medium text-slate-600">Staff Members</p>
          <p className="text-3xl font-bold text-slate-900 mt-2">
            {users.filter((u) => u.role === 'staff').length}
          </p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm">
        <div className="p-6 border-b border-slate-200">
          <h3 className="text-lg font-bold text-slate-900">User Management</h3>
        </div>
        <Table columns={columns} data={users} renderCell={renderCell} />
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Add New User"
        footer={
          <>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleAddUser}>Create User</Button>
          </>
        }
      >
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Full Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="John Doe"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="john.doe@example.com"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Role</label>
              <select 
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="staff">Staff</option>
                <option value="manager">Manager</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Status</label>
              <select 
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>
          {/* Password field is not handled here as Supabase auth handles user creation.
              For adding users via an admin panel, you'd typically invite them or set a temporary password
              and require a reset. For simplicity, we're assuming the user will be created via Supabase auth
              and then their profile entry will be managed here. */}
        </form>
      </Modal>
    </div>
  );
}

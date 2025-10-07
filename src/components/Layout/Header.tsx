import { useState, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { Menu, Transition } from '@headlessui/react';
import { Bell, Settings, User as UserIcon, LogOut, Key } from 'lucide-react'; // Import Key icon
import { useAuth } from '../../hooks/useAuth';
import Modal from '../UI/Modal';
import Button from '../UI/Button';
import { usePasswordManagement } from '../../hooks/usePasswordManagement'; // Import password management hook

export default function Header() {
  const { user, signOut } = useAuth();
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const {
    loading: passwordLoading,
    error: passwordError,
    success: passwordSuccess,
    updateUserPassword,
    resetState: resetPasswordState,
  } = usePasswordManagement();

  const handleSignOut = async () => {
    await signOut();
  };

  const handleOpenPasswordModal = () => {
    setIsPasswordModalOpen(true);
    setNewPassword('');
    setConfirmNewPassword('');
    resetPasswordState();
  };

  const handleClosePasswordModal = () => {
    setIsPasswordModalOpen(false);
    setNewPassword('');
    setConfirmNewPassword('');
    resetPasswordState();
  };

  const handleUpdateMyPassword = async () => {
    if (!newPassword || !confirmNewPassword) {
      alert('Please fill in all password fields.');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      alert('New password and confirm password do not match.');
      return;
    }
    if (newPassword.length < 6) { // Supabase default minimum password length
      alert('Password must be at least 6 characters long.');
      return;
    }

    const { error } = await updateUserPassword(newPassword);
    if (!error) {
      alert('Your password has been updated successfully!');
      handleClosePasswordModal();
    } else {
      alert('Failed to update password: ' + error.message);
    }
  };

  return (
    <header className="flex items-center justify-between p-4 bg-white border-b border-slate-200 shadow-sm">
      <div className="flex items-center gap-4">
        <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
      </div>

      <div className="flex items-center gap-4">
        <button className="p-2 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded-full transition-colors">
          <Bell className="w-5 h-5" />
        </button>

        <Link
          to="/admin-settings"
          className="p-2 text-slate-500 hover:text-blue-600 hover:bg-slate-100 rounded-full transition-colors"
          title="Admin Settings"
        >
          <Settings className="w-5 h-5" />
        </Link>

        <Menu as="div" className="relative inline-block text-left">
          <div>
            <Menu.Button className="flex items-center gap-2 p-2 rounded-full hover:bg-slate-100 transition-colors">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                {user?.user_metadata?.name
                  ? user.user_metadata.name
                      .split(' ')
                      .map((n: string) => n[0])
                      .join('')
                  : 'U'}
              </div>
              <span className="font-medium text-slate-700 hidden md:block">
                {user?.user_metadata?.name || user?.email || 'User'}
              </span>
            </Menu.Button>
          </div>

          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
              <div className="py-1">
                <Menu.Item>
                  {({ active }) => (
                    <div
                      className={`${
                        active ? 'bg-slate-100 text-slate-900' : 'text-slate-700'
                      } flex items-center px-4 py-2 text-sm`}
                    >
                      <UserIcon className="mr-3 h-4 w-4 text-slate-400" aria-hidden="true" />
                      <span>{user?.user_metadata?.name || user?.email || 'User'}</span>
                    </div>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={handleOpenPasswordModal}
                      className={`${
                        active ? 'bg-slate-100 text-slate-900' : 'text-slate-700'
                      } group flex w-full items-center px-4 py-2 text-sm`}
                    >
                      <Key className="mr-3 h-4 w-4 text-slate-400" aria-hidden="true" />
                      Change Password
                    </button>
                  )}
                </Menu.Item>
                <Menu.Item>
                  {({ active }) => (
                    <button
                      onClick={handleSignOut}
                      className={`${
                        active ? 'bg-slate-100 text-slate-900' : 'text-slate-700'
                      } group flex w-full items-center px-4 py-2 text-sm`}
                    >
                      <LogOut className="mr-3 h-4 w-4 text-slate-400" aria-hidden="true" />
                      Sign Out
                    </button>
                  )}
                </Menu.Item>
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>

      {/* User Change Password Modal */}
      <Modal
        isOpen={isPasswordModalOpen}
        onClose={handleClosePasswordModal}
        title="Change Your Password"
        footer={
          <>
            <Button variant="outline" onClick={handleClosePasswordModal}>
              Cancel
            </Button>
            <Button onClick={handleUpdateMyPassword} disabled={passwordLoading}>
              {passwordLoading ? 'Updating...' : 'Save Changes'}
            </Button>
          </>
        }
      >
        <form className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Confirm New Password</label>
            <input
              type="password"
              value={confirmNewPassword}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
              placeholder="Confirm new password"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>}
          {passwordSuccess && <p className="text-green-500 text-sm">{passwordSuccess}</p>}
        </form>
      </Modal>
    </header>
  );
}

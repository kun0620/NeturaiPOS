import { Search, Bell, Settings } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';
import Button from '../UI/Button';

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export default function Header({ title, subtitle }: HeaderProps) {
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
      <div className="px-4 py-4 md:px-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
            {subtitle && <p className="text-sm text-slate-600 mt-1">{subtitle}</p>}
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input
                type="text"
                placeholder="Search..."
                className="pl-10 pr-4 py-2 w-40 md:w-80 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <button className="relative p-2 hover:bg-slate-100 rounded-lg transition-colors">
              <Bell className="w-5 h-5 text-slate-600" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>

            <Button variant="outline" size="sm" onClick={handleSignOut}>
              Sign Out
            </Button>
            <button className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
              <Settings className="w-5 h-5 text-slate-600" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

import { useNavigate } from 'react-router-dom';
import { LogOut, User as UserIcon } from 'lucide-react';

export default function Navbar() {
  const navigate = useNavigate();
  const email = localStorage.getItem('email') || 'User';

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <nav className="flex items-center justify-between px-6 py-3 bg-surface border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold tracking-wider">
          DF
        </div>
        <h2 className="text-xl font-bold text-gray-800 tracking-tight">Dayflow</h2>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-gray-600 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
          <UserIcon size={16} />
          <span className="text-sm font-medium">{email}</span>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-danger hover:bg-red-50 rounded-md transition-colors"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </nav>
  );
}
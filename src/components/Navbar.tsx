
import { useStore } from '../store/useStore';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { LogOut, Home, BookOpen, Users as UsersIcon } from 'lucide-react';

export function Navbar() {
  const currentUser = useStore((state) => state.currentUser);
  const logout = useStore((state) => state.logout);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => location.pathname === path;

  if (!currentUser) return null;

  return (
    <>
      <nav className="bg-brand-blue text-white shadow-md relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/" className="flex items-center gap-3">
                <img src="/logo.jpg" alt="Master Piscine Logo" className="w-10 h-10 rounded-md object-cover shadow-sm" />
                <span className="font-bold text-xl tracking-wider hidden sm:block">MASTER PISCINE</span>
              </Link>
            </div>
            
            <div className="flex items-center gap-4">
              {currentUser.role === 'admin' && (
                <div className="hidden sm:flex items-center gap-6 mr-4 text-sm font-medium">
                  <Link to="/admin" className={`transition-colors ${isActive('/admin') ? 'text-white border-b-2 border-white' : 'text-blue-200 hover:text-white'}`}>Dashboard</Link>
                  <Link to="/admin/courses" className={`transition-colors ${isActive('/admin/courses') ? 'text-white border-b-2 border-white' : 'text-blue-200 hover:text-white'}`}>Corsi</Link>
                  <Link to="/admin/users" className={`transition-colors ${isActive('/admin/users') ? 'text-white border-b-2 border-white' : 'text-blue-200 hover:text-white'}`}>Utenti</Link>
                </div>
              )}
              
              <div className="flex items-center gap-3 sm:border-l sm:border-blue-400 sm:pl-4">
                <span className="text-sm font-medium hidden sm:block">{currentUser.name}</span>
                <button 
                  onClick={handleLogout}
                  className="p-2 hover:bg-blue-800 rounded-full transition-colors flex items-center gap-2"
                  title="Logout"
                >
                  <LogOut size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Bottom Navigation for Admin */}
      {currentUser.role === 'admin' && (
        <div className="sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around items-center h-20 z-50 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] pb-safe">
          <Link to="/admin" className={`flex flex-col items-center gap-1.5 w-full h-full justify-center transition-colors ${isActive('/admin') ? 'text-brand-blue' : 'text-gray-400 hover:text-gray-600'}`}>
            <Home size={26} className={isActive('/admin') ? 'fill-blue-50/50' : ''} />
            <span className="text-xs font-bold">Dashboard</span>
          </Link>
          <Link to="/admin/courses" className={`flex flex-col items-center gap-1.5 w-full h-full justify-center transition-colors ${isActive('/admin/courses') ? 'text-brand-blue' : 'text-gray-400 hover:text-gray-600'}`}>
            <BookOpen size={26} className={isActive('/admin/courses') ? 'fill-blue-50/50' : ''} />
            <span className="text-xs font-bold">Corsi</span>
          </Link>
          <Link to="/admin/users" className={`flex flex-col items-center gap-1.5 w-full h-full justify-center transition-colors ${isActive('/admin/users') ? 'text-brand-blue' : 'text-gray-400 hover:text-gray-600'}`}>
            <UsersIcon size={26} className={isActive('/admin/users') ? 'fill-blue-50/50' : ''} />
            <span className="text-xs font-bold">Utenti</span>
          </Link>
        </div>
      )}
    </>
  );
}

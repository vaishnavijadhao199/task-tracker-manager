import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!isAuthenticated) return null;

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/dashboard" className="text-xl font-bold text-indigo-600">Tasker</Link>
            <div className="hidden sm:flex sm:ml-6 space-x-4">
              <Link to="/dashboard" className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-indigo-600">Dashboard</Link>
              {user?.isAdmin && (
                <span className="px-3 py-2 text-sm font-medium text-green-600 bg-green-50 rounded-md">Admin Mode</span>
              )}
            </div>
          </div>
          <div className="flex items-center">
            <span className="text-sm text-gray-600 mr-4 hidden sm:block">{user?.email}</span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
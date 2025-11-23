import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Layers, 
  BookOpen, 
  Video, 
  FileText, 
  Users, 
  BarChart2, 
  Settings, 
  LogOut 
} from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Simple redirect
    navigate('/');
  };

  const navItems = [
    { path: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
    { path: '/admin/batches', icon: Layers, label: 'Manage Batches' },
    { path: '/admin/subjects', icon: BookOpen, label: 'Manage Subjects' },
    { path: '/admin/lectures', icon: Video, label: 'Lectures' },
    { path: '/admin/notes', icon: FileText, label: 'Notes & DPPs' },
    { path: '/admin/students', icon: Users, label: 'Students' },
    { path: '/admin/analytics', icon: BarChart2, label: 'Analytics' },
    { path: '/admin/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <div className="flex min-h-screen bg-gray-100 font-sans">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-white fixed h-full hidden md:flex flex-col shadow-xl z-20">
        <div className="p-6 border-b border-slate-800">
            <h2 className="text-xl font-bold tracking-tight text-white">EduVerse <span className="text-blue-500">Admin</span></h2>
        </div>

        <nav className="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800'
                }`
              }
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors text-sm font-medium"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 flex flex-col min-h-screen">
        {/* Mobile Header */}
        <div className="bg-white border-b border-gray-200 p-4 md:hidden flex justify-between items-center sticky top-0 z-10">
            <span className="font-bold text-slate-900">EduVerse Admin</span>
            <button onClick={handleLogout} className="text-slate-500"><LogOut className="w-5 h-5"/></button>
        </div>

        <div className="p-6 md:p-8 flex-1 overflow-y-auto">
            <Outlet />
        </div>
      </main>
    </div>
  );
};

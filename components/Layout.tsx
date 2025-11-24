import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Bell, Search, User, Key, X, AlertTriangle } from 'lucide-react';
import { fetchSettings } from '../services/data';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [adminCode, setAdminCode] = useState('');
  const [error, setError] = useState('');
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [checkingSettings, setCheckingSettings] = useState(true);

  const isHome = location.pathname === '/';
  const isAdminRoute = location.pathname.startsWith('/admin');

  useEffect(() => {
    const checkMaintenance = async () => {
      try {
        const settings = await fetchSettings();
        setMaintenanceMode(settings.maintenanceMode);
      } catch (e) {
        console.error("Failed to check settings", e);
      } finally {
        setCheckingSettings(false);
      }
    };
    // Check immediately on mount
    checkMaintenance();
    
    // Optional: You could also poll for changes or check on navigation
  }, [location.pathname]);

  if (isAdminRoute) {
    return <>{children}</>;
  }

  const handleAdminAccess = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminCode === '26127') {
      setShowAdminModal(false);
      setAdminCode('');
      navigate('/admin');
    } else {
      setError('Invalid Access Code');
    }
  };

  // Block access if maintenance mode is on
  if (maintenanceMode && !checkingSettings) {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4 text-center">
          <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 relative animate-fade-in">
              <div className="w-16 h-16 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle className="w-8 h-8" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Under Maintenance</h2>
              <p className="text-slate-500 mb-6">
                  EduVerse 2.0 is currently undergoing scheduled maintenance to improve your experience. Please check back later.
              </p>
              
              {/* Admin Access Button for Maintenance Screen */}
              <button 
                  onClick={() => setShowAdminModal(true)}
                  className="text-sm text-slate-400 hover:text-slate-600 flex items-center justify-center gap-2 mx-auto transition-colors"
              >
                  <Key className="w-4 h-4" /> Admin Login
              </button>
          </div>

          {/* Admin Access Modal */}
          {showAdminModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-slate-50">
                    <h3 className="font-bold text-slate-800">Admin Access</h3>
                    <button onClick={() => setShowAdminModal(false)} className="text-slate-400 hover:text-slate-700">
                        <X className="w-5 h-5" />
                    </button>
                </div>
                <div className="p-6">
                    <form onSubmit={handleAdminAccess} className="space-y-4">
                        <div>
                            <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Security Code</label>
                            <input 
                                type="password" 
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-lg tracking-widest"
                                placeholder="•••••"
                                value={adminCode}
                                onChange={(e) => {
                                    setAdminCode(e.target.value);
                                    setError('');
                                }}
                                autoFocus
                            />
                            {error && <p className="text-red-500 text-xs mt-2 text-center">{error}</p>}
                        </div>
                        <button 
                            type="submit"
                            className="w-full py-3 bg-slate-900 text-white font-semibold rounded-xl hover:bg-blue-600 transition-colors"
                        >
                            Verify Access
                        </button>
                    </form>
                </div>
              </div>
            </div>
          )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-slate-800 relative">
      {/* Sticky Header */}
      <header className="sticky top-0 z-40 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {!isHome && (
              <button 
                onClick={() => navigate(-1)}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors text-slate-600"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <div 
              onClick={() => navigate('/')} 
              className="cursor-pointer flex items-center gap-2"
            >
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">E</div>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">EduVerse <span className="text-blue-600">2.0</span></h1>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="hidden md:flex p-2 text-slate-500 hover:text-blue-600 transition-colors">
              <Search className="w-5 h-5" />
            </button>
            <button className="p-2 text-slate-500 hover:text-blue-600 transition-colors relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1.5 right-2 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
            </button>
            
            {/* Admin Key Trigger */}
            <button 
                onClick={() => setShowAdminModal(true)}
                className="p-2 text-slate-400 hover:text-slate-800 transition-colors"
                title="Admin Access"
            >
              <Key className="w-5 h-5" />
            </button>

            <button className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center text-slate-600 border border-slate-300">
              <User className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-6xl mx-auto px-4 py-6 md:py-8">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-6 mt-auto">
        <div className="max-w-6xl mx-auto px-4 text-center text-sm text-slate-500">
          © 2024 EduVerse 2.0. All rights reserved.
        </div>
      </footer>

      {/* Admin Access Modal (Always available in header too) */}
      {showAdminModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-slate-50">
                <h3 className="font-bold text-slate-800">Admin Access</h3>
                <button onClick={() => setShowAdminModal(false)} className="text-slate-400 hover:text-slate-700">
                    <X className="w-5 h-5" />
                </button>
            </div>
            <div className="p-6">
                <form onSubmit={handleAdminAccess} className="space-y-4">
                    <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">Security Code</label>
                        <input 
                            type="password" 
                            className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center text-lg tracking-widest"
                            placeholder="•••••"
                            value={adminCode}
                            onChange={(e) => {
                                setAdminCode(e.target.value);
                                setError('');
                            }}
                            autoFocus
                        />
                        {error && <p className="text-red-500 text-xs mt-2 text-center">{error}</p>}
                    </div>
                    <button 
                        type="submit"
                        className="w-full py-3 bg-slate-900 text-white font-semibold rounded-xl hover:bg-blue-600 transition-colors"
                    >
                        Verify Access
                    </button>
                </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
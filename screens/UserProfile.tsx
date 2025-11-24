
import React, { useState, useEffect } from 'react';
import { User, Mail, Smartphone, Calendar, BookOpen, LogOut, Save, Loader2, Edit2 } from 'lucide-react';
import { fetchUserProfile, saveUserProfile } from '../services/data';
import { Student, ClassLevel } from '../types';

export const UserProfile: React.FC = () => {
  const [profile, setProfile] = useState<Partial<Student>>({
    name: '',
    email: '',
    mobile: '',
    age: undefined,
    classLevel: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    const load = async () => {
        try {
            const data = await fetchUserProfile();
            if (data) {
                setProfile(data);
                // If the user has a name, assume they are not in initial edit mode
                setEditing(!data.name);
            } else {
                setEditing(true);
            }
        } finally {
            setLoading(false);
        }
    };
    load();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
        await saveUserProfile(profile);
        setEditing(false);
    } catch (err) {
        console.error(err);
        alert("Failed to save profile.");
    } finally {
        setSaving(false);
    }
  };

  const handleLogout = () => {
      // For this demo, just clear local user ID and refresh
      if (confirm("Are you sure you want to logout? This will clear your session on this device.")) {
        localStorage.removeItem('eduverse_user_id');
        window.location.reload();
      }
  };

  if (loading) return <div className="flex justify-center p-10"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>;

  return (
    <div className="space-y-6 animate-fade-in max-w-lg mx-auto pb-20">
      <h1 className="text-2xl font-bold text-slate-900">My Profile</h1>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 flex flex-col items-center text-center relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-blue-500 to-cyan-400 opacity-20"></div>
        <div className="relative z-10 w-24 h-24 bg-white rounded-full flex items-center justify-center mb-4 text-blue-500 shadow-md border-4 border-white mt-4">
           <User className="w-12 h-12" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">{profile.name || 'Student'}</h2>
        <p className="text-slate-500 text-sm">{profile.classLevel || 'Class Not Set'} • {profile.mobile || 'No Mobile'}</p>
        
        {!editing && (
            <button 
                onClick={() => setEditing(true)}
                className="absolute top-4 right-4 p-2 text-blue-600 bg-white rounded-full shadow-sm hover:bg-blue-50"
            >
                <Edit2 className="w-4 h-4" />
            </button>
        )}
      </div>

      {editing ? (
        <form onSubmit={handleSave} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-4">
            <h3 className="font-semibold text-slate-800 border-b pb-2 mb-4">Edit Details</h3>
            
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                <input 
                    required 
                    type="text" 
                    className="w-full border rounded-lg px-3 py-2 bg-gray-50 focus:bg-white transition-colors"
                    placeholder="Enter your name"
                    value={profile.name}
                    onChange={e => setProfile({...profile, name: e.target.value})}
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Class</label>
                    <select 
                        className="w-full border rounded-lg px-3 py-2 bg-gray-50 focus:bg-white transition-colors"
                        value={profile.classLevel}
                        onChange={e => setProfile({...profile, classLevel: e.target.value})}
                    >
                        <option value="">Select</option>
                        {Object.values(ClassLevel).filter(c => c !== 'All').map(c => (
                            <option key={c} value={c}>{c}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Age</label>
                    <input 
                        type="number" 
                        className="w-full border rounded-lg px-3 py-2 bg-gray-50 focus:bg-white transition-colors"
                        placeholder="15"
                        value={profile.age || ''}
                        onChange={e => setProfile({...profile, age: Number(e.target.value)})}
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Mobile Number</label>
                <div className="relative">
                    <Smartphone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input 
                        type="tel" 
                        className="w-full border rounded-lg pl-10 pr-3 py-2 bg-gray-50 focus:bg-white transition-colors"
                        placeholder="9876543210"
                        value={profile.mobile}
                        onChange={e => setProfile({...profile, mobile: e.target.value})}
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email (Optional)</label>
                <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input 
                        type="email" 
                        className="w-full border rounded-lg pl-10 pr-3 py-2 bg-gray-50 focus:bg-white transition-colors"
                        placeholder="student@example.com"
                        value={profile.email}
                        onChange={e => setProfile({...profile, email: e.target.value})}
                    />
                </div>
            </div>

            <div className="flex gap-3 pt-4">
                {profile.name && (
                    <button 
                        type="button" 
                        onClick={() => setEditing(false)}
                        className="flex-1 py-2.5 border border-gray-300 rounded-xl font-medium text-slate-600 hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                )}
                <button 
                    type="submit" 
                    disabled={saving}
                    className="flex-1 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 disabled:opacity-70 flex items-center justify-center gap-2"
                >
                    {saving ? <Loader2 className="w-4 h-4 animate-spin"/> : <Save className="w-4 h-4"/>}
                    Save Profile
                </button>
            </div>
        </form>
      ) : (
        <div className="space-y-3 w-full">
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
                <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                    <Mail className="w-5 h-5" />
                </div>
                <div>
                    <p className="text-xs text-slate-500">Email Address</p>
                    <p className="font-medium text-slate-900">{profile.email || 'Not Provided'}</p>
                </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
                <div className="p-3 bg-green-50 text-green-600 rounded-lg">
                    <Smartphone className="w-5 h-5" />
                </div>
                <div>
                    <p className="text-xs text-slate-500">Mobile Number</p>
                    <p className="font-medium text-slate-900">{profile.mobile || 'Not Provided'}</p>
                </div>
            </div>

             <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
                <div className="p-3 bg-purple-50 text-purple-600 rounded-lg">
                    <Calendar className="w-5 h-5" />
                </div>
                <div>
                    <p className="text-xs text-slate-500">Age</p>
                    <p className="font-medium text-slate-900">{profile.age ? `${profile.age} Years` : 'Not Provided'}</p>
                </div>
            </div>
        </div>
      )}

      <button onClick={handleLogout} className="w-full py-3 text-red-600 font-semibold bg-red-50 hover:bg-red-100 rounded-xl transition-colors flex items-center justify-center gap-2 mt-4">
        <LogOut className="w-5 h-5" /> Logout / Reset Session
      </button>
    </div>
  );
};

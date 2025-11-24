
import React, { useState, useEffect } from 'react';
import { fetchSettings, updateSettings } from '../services/data';
import { AppSettings } from '../types';
import { Loader2, Save, Youtube, Send, Instagram, Mail } from 'lucide-react';

export const AdminSettings: React.FC = () => {
  const [settings, setSettings] = useState<AppSettings>({ maintenanceMode: false, allowEnrollments: true });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const s = await fetchSettings();
        setSettings(s);
      } catch (e) {
        console.error("Failed to load settings", e);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateSettings(settings);
      alert("Settings updated successfully!");
    } catch (e) {
      console.error("Failed to save settings", e);
      alert("Error saving settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex justify-center p-10"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>;

  return (
    <div className="space-y-6 animate-fade-in max-w-2xl">
      <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
      
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-6">
          <h3 className="font-semibold text-lg border-b pb-2">Platform Controls</h3>
          
          <div className="flex items-center justify-between">
              <div>
                  <p className="font-medium text-slate-900">Maintenance Mode</p>
                  <p className="text-sm text-slate-500">Disable access for students temporarily</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={settings.maintenanceMode}
                    onChange={(e) => setSettings({...settings, maintenanceMode: e.target.checked})}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
          </div>

          <div className="flex items-center justify-between">
              <div>
                  <p className="font-medium text-slate-900">New Enrollments</p>
                  <p className="text-sm text-slate-500">Allow new students to register</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="sr-only peer" 
                    checked={settings.allowEnrollments}
                    onChange={(e) => setSettings({...settings, allowEnrollments: e.target.checked})}
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
          </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-6">
          <h3 className="font-semibold text-lg border-b pb-2">Social Media Links</h3>
          <p className="text-sm text-slate-500">Links added here will appear in the User Settings page.</p>
          
          <div className="space-y-4">
              <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-2"><Youtube className="w-4 h-4 text-red-600"/> YouTube Channel URL</label>
                  <input 
                    type="url" 
                    placeholder="https://youtube.com/@channel" 
                    className="w-full border rounded-lg px-3 py-2" 
                    value={settings.youtubeUrl || ''}
                    onChange={(e) => setSettings({...settings, youtubeUrl: e.target.value})}
                  />
              </div>

              <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-2"><Send className="w-4 h-4 text-blue-500"/> Telegram Channel/Group URL</label>
                  <input 
                    type="url" 
                    placeholder="https://t.me/channel" 
                    className="w-full border rounded-lg px-3 py-2" 
                    value={settings.telegramUrl || ''}
                    onChange={(e) => setSettings({...settings, telegramUrl: e.target.value})}
                  />
              </div>

              <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-2"><Instagram className="w-4 h-4 text-pink-600"/> Instagram Profile URL</label>
                  <input 
                    type="url" 
                    placeholder="https://instagram.com/profile" 
                    className="w-full border rounded-lg px-3 py-2" 
                    value={settings.instagramUrl || ''}
                    onChange={(e) => setSettings({...settings, instagramUrl: e.target.value})}
                  />
              </div>

              <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1 flex items-center gap-2"><Mail className="w-4 h-4 text-green-600"/> Support Email</label>
                  <input 
                    type="email" 
                    placeholder="support@eduverse.com" 
                    className="w-full border rounded-lg px-3 py-2" 
                    value={settings.supportEmail || ''}
                    onChange={(e) => setSettings({...settings, supportEmail: e.target.value})}
                  />
              </div>
          </div>
      </div>

      <button 
        onClick={handleSave}
        disabled={saving}
        className="bg-slate-900 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-slate-800 flex items-center gap-2 disabled:opacity-70 w-full justify-center md:w-auto"
      >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saving ? 'Saving...' : 'Save Changes'}
      </button>
    </div>
  );
};

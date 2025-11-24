
import React, { useEffect, useState } from 'react';
import { fetchSettings } from '../services/data';
import { AppSettings } from '../types';
import { Youtube, Send, Instagram, Mail, Info, ChevronRight, Loader2, Moon } from 'lucide-react';

export const UserSettings: React.FC = () => {
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
        try {
            const s = await fetchSettings();
            setSettings(s);
        } finally {
            setLoading(false);
        }
    };
    load();
  }, []);

  const openLink = (url?: string) => {
      if (url) window.open(url, '_blank');
      else alert("Link not configured by admin yet.");
  };

  if (loading) return <div className="flex justify-center p-10"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>;

  return (
    <div className="space-y-6 animate-fade-in max-w-lg mx-auto">
      <h1 className="text-2xl font-bold text-slate-900">Settings</h1>

      <div className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
         <div className="p-4 bg-gray-50 border-b border-gray-100 font-semibold text-slate-700">
             Join Our Community
         </div>
         <div className="divide-y divide-gray-100">
             <button onClick={() => openLink(settings?.youtubeUrl)} className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                 <div className="flex items-center gap-4">
                     <div className="w-10 h-10 bg-red-100 text-red-600 rounded-full flex items-center justify-center">
                         <Youtube className="w-5 h-5" />
                     </div>
                     <span className="font-medium text-slate-900">YouTube Channel</span>
                 </div>
                 <ChevronRight className="w-5 h-5 text-slate-400" />
             </button>

             <button onClick={() => openLink(settings?.telegramUrl)} className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                 <div className="flex items-center gap-4">
                     <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                         <Send className="w-5 h-5" />
                     </div>
                     <span className="font-medium text-slate-900">Telegram Group</span>
                 </div>
                 <ChevronRight className="w-5 h-5 text-slate-400" />
             </button>

             <button onClick={() => openLink(settings?.instagramUrl)} className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                 <div className="flex items-center gap-4">
                     <div className="w-10 h-10 bg-pink-100 text-pink-600 rounded-full flex items-center justify-center">
                         <Instagram className="w-5 h-5" />
                     </div>
                     <span className="font-medium text-slate-900">Instagram Page</span>
                 </div>
                 <ChevronRight className="w-5 h-5 text-slate-400" />
             </button>
         </div>
      </div>

      <div className="bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm">
         <div className="p-4 bg-gray-50 border-b border-gray-100 font-semibold text-slate-700">
             App Preferences
         </div>
         <div className="divide-y divide-gray-100">
             <div className="w-full p-4 flex items-center justify-between">
                 <div className="flex items-center gap-4">
                     <div className="w-10 h-10 bg-slate-100 text-slate-600 rounded-full flex items-center justify-center">
                         <Moon className="w-5 h-5" />
                     </div>
                     <span className="font-medium text-slate-900">Dark Mode</span>
                 </div>
                 <span className="text-xs font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded">COMING SOON</span>
             </div>

             <button onClick={() => openLink(settings?.supportEmail ? `mailto:${settings.supportEmail}` : undefined)} className="w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors">
                 <div className="flex items-center gap-4">
                     <div className="w-10 h-10 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
                         <Mail className="w-5 h-5" />
                     </div>
                     <span className="font-medium text-slate-900">Contact Support</span>
                 </div>
                 <ChevronRight className="w-5 h-5 text-slate-400" />
             </button>
         </div>
      </div>

      <div className="text-center pt-4">
          <p className="text-xs text-slate-400 flex items-center justify-center gap-1">
              <Info className="w-3 h-3" /> EduVerse 2.0 v1.2.0
          </p>
      </div>
    </div>
  );
};

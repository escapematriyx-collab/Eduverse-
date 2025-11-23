import React from 'react';

export const AdminSettings: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in max-w-2xl">
      <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
      
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-6">
          <h3 className="font-semibold text-lg border-b pb-2">Profile Settings</h3>
          <div className="grid grid-cols-2 gap-4">
              <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Admin Name</label>
                  <input type="text" className="w-full border rounded-lg px-3 py-2 bg-gray-50" value="Administrator" readOnly />
              </div>
              <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                  <input type="email" className="w-full border rounded-lg px-3 py-2 bg-gray-50" value="admin@eduverse.com" readOnly />
              </div>
          </div>
      </div>

      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-6">
          <h3 className="font-semibold text-lg border-b pb-2">Platform Controls</h3>
          <div className="flex items-center justify-between">
              <div>
                  <p className="font-medium text-slate-900">Maintenance Mode</p>
                  <p className="text-sm text-slate-500">Disable access for students temporarily</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
          </div>
          <div className="flex items-center justify-between">
              <div>
                  <p className="font-medium text-slate-900">New Enrollments</p>
                  <p className="text-sm text-slate-500">Allow new students to register</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
          </div>
      </div>

      <button className="bg-slate-900 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-slate-800">
          Save Changes
      </button>
    </div>
  );
};

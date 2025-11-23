import React from 'react';
import { getBatches, getStudents, getContent, getSubjects } from '../services/data';
import { Users, Layers, Video, FileText, ArrowUpRight } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const stats = {
    students: getStudents().length,
    batches: getBatches().length,
    lectures: getContent().lectures.length,
    subjects: getSubjects().length,
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-slate-900">Dashboard Overview</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Students" value={stats.students} icon={Users} color="bg-blue-500" />
        <StatCard title="Active Batches" value={stats.batches} icon={Layers} color="bg-purple-500" />
        <StatCard title="Lectures Uploaded" value={stats.lectures} icon={Video} color="bg-orange-500" />
        <StatCard title="Subjects Created" value={stats.subjects} icon={FileText} color="bg-green-500" />
      </div>

      {/* Graphs Area */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Enrollment Chart Mock */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <div className="flex justify-between items-center mb-6">
                <h3 className="font-semibold text-slate-800">Student Enrollments</h3>
                <span className="text-xs text-slate-500">Last 6 Months</span>
            </div>
            <div className="h-64 flex items-end justify-between px-2 gap-4">
                {[40, 65, 45, 80, 55, 90].map((h, i) => (
                    <div key={i} className="w-full bg-blue-50 rounded-t-lg relative group">
                        <div 
                            className="absolute bottom-0 w-full bg-blue-500 rounded-t-lg transition-all duration-500 hover:bg-blue-600"
                            style={{ height: `${h}%` }}
                        ></div>
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                            {h * 10} Students
                        </div>
                    </div>
                ))}
            </div>
            <div className="flex justify-between mt-2 text-xs text-slate-400 px-2">
                <span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span><span>Jan</span><span>Feb</span>
            </div>
        </div>

        {/* Engagement Pie Chart Mock */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="font-semibold text-slate-800 mb-6">Content Distribution</h3>
            <div className="flex items-center justify-center h-64">
                {/* CSS Pie Chart */}
                <div className="w-48 h-48 rounded-full border-[16px] border-blue-500 relative flex items-center justify-center shadow-inner" style={{ borderRightColor: '#a855f7', borderBottomColor: '#f97316', transform: 'rotate(45deg)' }}>
                    <div className="text-center" style={{ transform: 'rotate(-45deg)' }}>
                        <span className="block text-3xl font-bold text-slate-800">85%</span>
                        <span className="text-xs text-slate-500">Engagement</span>
                    </div>
                </div>
            </div>
            <div className="flex justify-center gap-6 mt-4">
                <div className="flex items-center gap-2 text-sm text-slate-600"><div className="w-3 h-3 bg-blue-500 rounded-full"></div> Lectures</div>
                <div className="flex items-center gap-2 text-sm text-slate-600"><div className="w-3 h-3 bg-purple-500 rounded-full"></div> Notes</div>
                <div className="flex items-center gap-2 text-sm text-slate-600"><div className="w-3 h-3 bg-orange-500 rounded-full"></div> DPPs</div>
            </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="font-semibold text-slate-800 mb-4">Recent Activities</h3>
          <div className="space-y-4">
              {[1, 2, 3].map((_, i) => (
                  <div key={i} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors border-b border-gray-50 last:border-0">
                      <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                             <ArrowUpRight className="w-5 h-5" />
                          </div>
                          <div>
                              <p className="text-sm font-medium text-slate-900">New Student Enrolled in Class 10</p>
                              <p className="text-xs text-slate-500">2 hours ago</p>
                          </div>
                      </div>
                      <span className="text-xs font-semibold bg-green-100 text-green-700 px-2 py-1 rounded">Completed</span>
                  </div>
              ))}
          </div>
      </div>
    </div>
  );
};

const StatCard: React.FC<{ title: string; value: number; icon: any; color: string }> = ({ title, value, icon: Icon, color }) => (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-white shadow-md ${color}`}>
            <Icon className="w-6 h-6" />
        </div>
        <div>
            <p className="text-sm text-slate-500 font-medium">{title}</p>
            <h4 className="text-2xl font-bold text-slate-900">{value}</h4>
        </div>
    </div>
);

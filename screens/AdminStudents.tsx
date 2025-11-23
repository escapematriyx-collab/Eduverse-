import React, { useState, useEffect } from 'react';
import { getStudents, updateStudentStatus } from '../services/data';
import { Student } from '../types';
import { Search, MoreVertical } from 'lucide-react';

export const AdminStudents: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [filter, setFilter] = useState('');

  const refresh = () => setStudents(getStudents());
  useEffect(() => refresh(), []);

  const toggleStatus = (id: string, current: string) => {
      const newStatus = current === 'Active' ? 'Suspended' : 'Active';
      updateStudentStatus(id, newStatus as any);
      refresh();
  };

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(filter.toLowerCase()) || 
    s.email.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <h1 className="text-2xl font-bold text-slate-900">Student Management</h1>

      <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
          <Search className="w-5 h-5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search by name or email..." 
            className="flex-1 outline-none text-slate-700"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-left">
            <thead className="bg-gray-50 text-slate-500 uppercase text-xs">
                <tr>
                    <th className="px-6 py-4">Student Name</th>
                    <th className="px-6 py-4">Batch ID</th>
                    <th className="px-6 py-4">Join Date</th>
                    <th className="px-6 py-4">Progress</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
                {filteredStudents.map(student => (
                    <tr key={student.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                            <div className="font-semibold text-slate-900">{student.name}</div>
                            <div className="text-xs text-slate-500">{student.email}</div>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">{student.batchId}</td>
                        <td className="px-6 py-4 text-sm text-slate-600">{student.joinDate}</td>
                        <td className="px-6 py-4">
                            <div className="w-24 bg-gray-200 rounded-full h-2">
                                <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${student.progress}%` }}></div>
                            </div>
                            <span className="text-xs text-slate-500 mt-1 block">{student.progress}%</span>
                        </td>
                        <td className="px-6 py-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${student.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                {student.status}
                            </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                             <button onClick={() => toggleStatus(student.id, student.status)} className="text-sm font-medium text-blue-600 hover:text-blue-800">
                                 {student.status === 'Active' ? 'Suspend' : 'Activate'}
                             </button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
      </div>
    </div>
  );
};

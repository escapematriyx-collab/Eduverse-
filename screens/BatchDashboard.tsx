import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getBatchById, getSubjects } from '../services/data';
import * as LucideIcons from 'lucide-react';
import { Subject } from '../types';

export const BatchDashboard: React.FC = () => {
  const { batchId } = useParams();
  const navigate = useNavigate();
  const batch = getBatchById(batchId || '');
  const [subjects, setSubjects] = useState<Subject[]>([]);

  useEffect(() => {
    if (batchId) {
        setSubjects(getSubjects(batchId));
    }
  }, [batchId]);

  if (!batch) {
    return <div className="text-center py-20 text-slate-500">Batch not found. Please return home.</div>;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
           <div className="text-sm font-medium text-slate-500 mb-1 uppercase tracking-wider">Dashboard</div>
           <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
             {batch.name}
           </h1>
           <p className="text-slate-500 text-sm mt-1">{batch.classLevel}</p>
        </div>
        <div className="px-4 py-2 bg-blue-50 text-blue-700 font-semibold rounded-lg text-sm border border-blue-100">
            Valid till March 2025
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {subjects.map((subject) => (
          <SubjectCard 
            key={subject.id} 
            subject={subject} 
            onClick={() => navigate(`/batch/${batchId}/subject/${subject.id}`)} 
          />
        ))}
        {subjects.length === 0 && (
            <div className="col-span-full text-center py-12 bg-white rounded-xl border border-dashed border-gray-300">
                <p className="text-slate-500">No subjects added to this batch yet.</p>
            </div>
        )}
      </div>
    </div>
  );
};

const SubjectCard: React.FC<{ subject: Subject; onClick: () => void }> = ({ subject, onClick }) => {
  // Dynamic icon rendering
  const IconComponent = (LucideIcons as any)[subject.iconName] || LucideIcons.Book;

  return (
    <button 
      onClick={onClick}
      className={`group relative overflow-hidden p-6 rounded-2xl transition-all duration-300 hover:shadow-lg border border-transparent hover:border-gray-200 text-left flex flex-col justify-between h-40 ${subject.color}`}
    >
      <div className="flex justify-between items-start z-10">
        <div className={`p-3 rounded-xl bg-white/60 backdrop-blur-sm ${subject.textColor}`}>
          <IconComponent className="w-6 h-6" />
        </div>
        <span className="text-xs font-semibold bg-white/50 px-2 py-1 rounded-full text-slate-700">
            {subject.topicCount} Topics
        </span>
      </div>

      <div className="z-10">
        <h3 className={`text-lg font-bold ${subject.textColor} mb-1`}>{subject.name}</h3>
        <p className={`text-xs ${subject.textColor} opacity-80`}>View Content &rarr;</p>
      </div>
      
      {/* Decorative Circle */}
      <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/20 rounded-full group-hover:scale-150 transition-transform duration-500"></div>
    </button>
  );
};
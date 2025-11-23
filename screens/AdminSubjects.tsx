import React, { useState, useEffect } from 'react';
import { getSubjects, addSubject, deleteSubject, getBatches, updateSubject } from '../services/data';
import { Subject, Batch } from '../types';
import { Plus, Trash2, Edit2, X, Book, Filter } from 'lucide-react';

export const AdminSubjects: React.FC = () => {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [selectedBatchFilter, setSelectedBatchFilter] = useState<string>('all');
  
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  const initialFormState: Partial<Subject> = {
    id: '',
    name: '',
    batchId: '',
    topicCount: 0,
    color: 'bg-blue-100',
    textColor: 'text-blue-700'
  };
  const [formData, setFormData] = useState<Partial<Subject>>(initialFormState);

  const refresh = () => {
    setSubjects(getSubjects());
    setBatches(getBatches());
  };
  useEffect(() => refresh(), []);

  const handleDelete = (id: string) => {
    if (confirm('Delete this subject? Associated lectures and notes will also be removed.')) {
        deleteSubject(id);
        refresh();
    }
  };

  const handleEdit = (subject: Subject) => {
      setFormData(subject);
      setIsEditing(true);
      setShowModal(true);
  };

  const handleCreateNew = () => {
      // Auto-select batch if filter is active
      const defaultBatch = selectedBatchFilter !== 'all' ? selectedBatchFilter : (batches[0]?.id || '');
      setFormData({ ...initialFormState, batchId: defaultBatch });
      setIsEditing(false);
      setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.batchId) {
        alert("Please select a batch");
        return;
    }

    if (isEditing && formData.id) {
        updateSubject(formData.id, formData);
    } else {
        addSubject({
            id: `s-${Date.now()}`,
            name: formData.name!,
            batchId: formData.batchId,
            iconName: 'Book',
            color: formData.color!,
            textColor: formData.textColor!,
            topicCount: Number(formData.topicCount),
        });
    }
    setShowModal(false);
    refresh();
  };

  const filteredSubjects = selectedBatchFilter === 'all' 
    ? subjects 
    : subjects.filter(s => s.batchId === selectedBatchFilter);

  return (
    <div className="space-y-6 animate-fade-in">
       <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <h1 className="text-2xl font-bold text-slate-900">Manage Subjects</h1>
        <div className="flex gap-2">
            <div className="relative">
                <select 
                    value={selectedBatchFilter} 
                    onChange={(e) => setSelectedBatchFilter(e.target.value)}
                    className="appearance-none bg-white border border-gray-200 text-slate-700 py-2 pl-4 pr-10 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="all">All Batches</option>
                    {batches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
                <Filter className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
            <button 
                onClick={handleCreateNew}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
                <Plus className="w-5 h-5" /> Add Subject
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSubjects.map(subject => {
              const batchName = batches.find(b => b.id === subject.batchId)?.name || 'Unknown Batch';
              return (
                <div key={subject.id} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-start justify-between">
                    <div className="flex gap-4">
                        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${subject.color} ${subject.textColor}`}>
                            <Book className="w-6 h-6" />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-900">{subject.name}</h3>
                            <p className="text-xs text-slate-500 mb-1">{batchName}</p>
                            <p className="text-xs font-semibold bg-gray-100 px-2 py-0.5 rounded w-fit text-slate-600">{subject.topicCount} Topics</p>
                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        <button onClick={() => handleEdit(subject)} className="text-slate-400 hover:text-blue-600"><Edit2 className="w-4 h-4"/></button>
                        <button onClick={() => handleDelete(subject.id)} className="text-slate-400 hover:text-red-600"><Trash2 className="w-4 h-4"/></button>
                    </div>
                </div>
              );
          })}
          {filteredSubjects.length === 0 && (
              <div className="col-span-full text-center py-10 text-slate-400 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                  No subjects found.
              </div>
          )}
      </div>

       {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
              <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
                  <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                      <h3 className="font-bold text-lg">{isEditing ? 'Edit Subject' : 'Add New Subject'}</h3>
                      <button onClick={() => setShowModal(false)}><X className="w-5 h-5 text-slate-400" /></button>
                  </div>
                  <form onSubmit={handleSubmit} className="p-6 space-y-4">
                      <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">Select Batch</label>
                          <select 
                            required 
                            className="w-full border rounded-lg px-3 py-2 bg-white"
                            value={formData.batchId}
                            onChange={e => setFormData({...formData, batchId: e.target.value})}
                          >
                              <option value="">-- Select Batch --</option>
                              {batches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                          </select>
                      </div>
                      <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">Subject Name</label>
                          <input required className="w-full border rounded-lg px-3 py-2" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="e.g. Mathematics" />
                      </div>
                      <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">Initial Topic Count</label>
                          <input type="number" className="w-full border rounded-lg px-3 py-2" value={formData.topicCount} onChange={e => setFormData({...formData, topicCount: Number(e.target.value)})} />
                      </div>
                       <div className="grid grid-cols-2 gap-4">
                          <div>
                              <label className="block text-sm font-medium text-slate-700 mb-1">Color Theme</label>
                              <select className="w-full border rounded-lg px-3 py-2" value={formData.color} onChange={e => setFormData({...formData, color: e.target.value})}>
                                  <option value="bg-blue-100">Blue</option>
                                  <option value="bg-green-100">Green</option>
                                  <option value="bg-red-100">Red</option>
                                  <option value="bg-yellow-100">Yellow</option>
                                  <option value="bg-purple-100">Purple</option>
                                  <option value="bg-orange-100">Orange</option>
                              </select>
                          </div>
                      </div>
                      <button type="submit" className="w-full bg-blue-600 text-white font-semibold py-2.5 rounded-lg hover:bg-blue-700">
                          {isEditing ? 'Save Changes' : 'Add Subject'}
                      </button>
                  </form>
              </div>
          </div>
      )}
    </div>
  );
};
import React, { useState, useEffect } from 'react';
import { fetchContent, addContent, deleteContent, updateContent, fetchSubjects, fetchBatches } from '../services/data';
import { ContentType, ContentItem, Batch, Subject } from '../types';
import { Plus, Trash2, PlayCircle, FileText, PenTool, Edit2, X, Link as LinkIcon, UploadCloud, Loader2 } from 'lucide-react';

export const AdminContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'lectures' | 'notes' | 'dpps'>('lectures');
  const [items, setItems] = useState<ContentItem[]>([]);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState<string>(''); 
  const [filteredSubjects, setFilteredSubjects] = useState<Subject[]>([]); 
  const [sourceMode, setSourceMode] = useState<'link' | 'file'>('link');

  const [formData, setFormData] = useState<Partial<ContentItem>>({
    title: '',
    subjectId: '',
    duration: '',
    tag: '',
    url: ''
  });

  const refresh = async () => {
    setLoading(true);
    const content = await fetchContent();
    setItems(content[activeTab]);
    const b = await fetchBatches();
    setBatches(b);
    const s = await fetchSubjects();
    setSubjects(s);
    setLoading(false);
  };

  useEffect(() => {
    refresh();
  }, [activeTab]);

  useEffect(() => {
    if (selectedBatch) {
        setFilteredSubjects(subjects.filter(s => s.batchId === selectedBatch));
    } else {
        setFilteredSubjects([]);
    }
  }, [selectedBatch, subjects]); 

  const handleEdit = (e: React.MouseEvent, item: ContentItem) => {
    e.stopPropagation();
    setFormData(item);
    
    const isDataUrl = item.url?.startsWith('data:');
    setSourceMode(isDataUrl ? 'file' : 'link');
    
    const subject = subjects.find(s => s.id === item.subjectId);
    if (subject && subject.batchId) {
        setSelectedBatch(subject.batchId);
    }
    
    setIsEditing(true);
    setShowModal(true);
  };

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (window.confirm('Delete this item permanently?')) {
        await deleteContent(activeTab, id);
        const content = await fetchContent(); // partial refresh
        setItems(content[activeTab]);
    }
  };

  const handleCreateNew = () => {
      setFormData({ title: '', subjectId: '', duration: '', tag: '', url: '' });
      setSelectedBatch('');
      setSourceMode('link');
      setIsEditing(false);
      setShowModal(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, url: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setSubmitting(true);

      const typeMap = { 'lectures': ContentType.Lecture, 'notes': ContentType.Note, 'dpps': ContentType.DPP };
      
      try {
        if (isEditing && formData.id) {
            await updateContent(activeTab, formData.id, {
                ...formData,
                type: typeMap[activeTab]
            });
        } else {
            await addContent(activeTab, {
                id: `${activeTab[0]}-${Date.now()}`,
                type: typeMap[activeTab],
                title: formData.title!,
                subjectId: formData.subjectId,
                duration: formData.duration,
                tag: formData.tag || 'NEW',
                date: new Date().toLocaleDateString(),
                url: formData.url
            });
        }
        setShowModal(false);
        const content = await fetchContent(); // partial refresh
        setItems(content[activeTab]);
      } catch (err) {
          console.error(err);
          alert("Failed to save content");
      } finally {
          setSubmitting(false);
      }
  };

  const getSubjectName = (id: string) => subjects.find(s => s.id === id)?.name || 'Unknown Subject';
  const getBatchNameBySubjectId = (subId: string) => {
      const sub = subjects.find(s => s.id === subId);
      if (!sub) return '';
      const batch = batches.find(b => b.id === sub.batchId);
      return batch ? batch.name : '';
  };

  if (loading) return <div className="flex justify-center p-10"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900 capitalize">Manage {activeTab}</h1>
        <button 
            type="button"
            onClick={handleCreateNew} 
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 transition-colors"
        >
            <Plus className="w-5 h-5" /> Upload {activeTab.slice(0, -1)}
        </button>
      </div>

      <div className="flex space-x-1 bg-gray-100 p-1 rounded-xl w-fit">
          {['lectures', 'notes', 'dpps'].map((tab: any) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${activeTab === tab ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
              >
                  {tab}
              </button>
          ))}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-left">
            <thead className="bg-gray-50 text-slate-500 uppercase text-xs">
                <tr>
                    <th className="px-6 py-4">Title</th>
                    <th className="px-6 py-4">Details</th>
                    <th className="px-6 py-4">Source</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
                {items.map(item => (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4">
                             <div className="flex items-center gap-3">
                                {activeTab === 'lectures' ? <PlayCircle className="w-5 h-5 text-red-500"/> : activeTab === 'notes' ? <FileText className="w-5 h-5 text-blue-500"/> : <PenTool className="w-5 h-5 text-purple-500"/>}
                                <div className="font-medium text-slate-900">{item.title}</div>
                             </div>
                             {item.duration && <div className="text-xs text-slate-400 mt-1 ml-8">{item.duration}</div>}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">
                            <div className="font-medium">{getSubjectName(item.subjectId || '')}</div>
                            <div className="text-xs text-slate-400">{getBatchNameBySubjectId(item.subjectId || '')}</div>
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-500 max-w-[200px] truncate">
                            {item.url ? (
                                item.url.startsWith('data:') ? (
                                    <span className="inline-flex items-center gap-1 text-green-600 font-medium text-xs bg-green-50 px-2 py-1 rounded">
                                        <FileText className="w-3 h-3"/> File Uploaded
                                    </span>
                                ) : (
                                    <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline flex items-center gap-1">
                                        <LinkIcon className="w-3 h-3" /> External Link
                                    </a>
                                )
                            ) : (
                                <span className="text-slate-300">-</span>
                            )}
                        </td>
                        <td className="px-6 py-4 text-right">
                             <div className="flex items-center justify-end gap-2">
                                <button type="button" onClick={(e) => handleEdit(e, item)} className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"><Edit2 className="w-4 h-4"/></button>
                                <button type="button" onClick={(e) => handleDelete(e, item.id)} className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"><Trash2 className="w-4 h-4"/></button>
                             </div>
                        </td>
                    </tr>
                ))}
                 {items.length === 0 && (
                    <tr><td colSpan={4} className="px-6 py-8 text-center text-slate-500">No content uploaded yet.</td></tr>
                 )}
            </tbody>
        </table>
      </div>

       {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 animate-in fade-in duration-200">
              <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl max-h-[90vh] overflow-y-auto">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-lg capitalize">{isEditing ? 'Edit' : 'Upload'} {activeTab.slice(0, -1)}</h3>
                    <button onClick={() => setShowModal(false)}><X className="w-5 h-5 text-slate-400" /></button>
                  </div>
                  
                  <form onSubmit={handleSubmit} className="space-y-4">
                      <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">Select Batch</label>
                          <select 
                            className="w-full border rounded-lg px-3 py-2 bg-white" 
                            value={selectedBatch} 
                            onChange={e => setSelectedBatch(e.target.value)}
                            required
                          >
                              <option value="">-- Choose Batch --</option>
                              {batches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                          </select>
                      </div>

                      <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">Select Subject</label>
                          <select 
                            className="w-full border rounded-lg px-3 py-2 bg-white disabled:bg-gray-100" 
                            value={formData.subjectId} 
                            onChange={e => setFormData({...formData, subjectId: e.target.value})}
                            disabled={!selectedBatch}
                            required
                          >
                              <option value="">-- Choose Subject --</option>
                              {filteredSubjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                          </select>
                      </div>

                      <hr className="border-gray-100" />

                      <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                        <input required placeholder="e.g. Introduction to Algebra" className="w-full border rounded-lg px-3 py-2" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                      </div>

                      <div>
                          <label className="block text-sm font-medium text-slate-700 mb-2">Content Source</label>
                          <div className="flex bg-gray-100 p-1 rounded-lg w-fit mb-3">
                              <button 
                                  type="button"
                                  onClick={() => setSourceMode('link')}
                                  className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${sourceMode === 'link' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500'}`}
                              >
                                  <div className="flex items-center gap-2"><LinkIcon className="w-3 h-3"/> External Link</div>
                              </button>
                              {(activeTab === 'notes' || activeTab === 'dpps') && (
                                  <button 
                                      type="button"
                                      onClick={() => setSourceMode('file')}
                                      className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${sourceMode === 'file' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500'}`}
                                  >
                                      <div className="flex items-center gap-2"><UploadCloud className="w-3 h-3"/> Upload PDF</div>
                                  </button>
                              )}
                          </div>

                          {sourceMode === 'link' ? (
                               <input 
                                   required={sourceMode === 'link'}
                                   type="url" 
                                   placeholder="https://youtube.com/..." 
                                   className="w-full border rounded-lg px-3 py-2" 
                                   value={!formData.url?.startsWith('data:') ? formData.url : ''} 
                                   onChange={e => setFormData({...formData, url: e.target.value})} 
                               />
                          ) : (
                               <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:bg-gray-50 transition-colors">
                                    <input 
                                        type="file" 
                                        accept=".pdf"
                                        onChange={handleFileChange}
                                        className="hidden" 
                                        id="pdf-upload"
                                    />
                                    <label htmlFor="pdf-upload" className="cursor-pointer flex flex-col items-center gap-2">
                                        <UploadCloud className="w-8 h-8 text-slate-400" />
                                        <span className="text-sm text-slate-600">Click to upload PDF from device</span>
                                    </label>
                                    {formData.url?.startsWith('data:') && (
                                        <p className="text-xs text-green-600 mt-2 font-medium">✓ File selected</p>
                                    )}
                               </div>
                          )}
                      </div>
                      
                      {activeTab === 'lectures' && (
                          <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Duration</label>
                            <input placeholder="e.g. 45 min" className="w-full border rounded-lg px-3 py-2" value={formData.duration} onChange={e => setFormData({...formData, duration: e.target.value})} />
                          </div>
                      )}
                      
                      <div className="flex gap-2 pt-2">
                          <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-2 border rounded-lg hover:bg-gray-50 transition-colors">Cancel</button>
                          <button disabled={submitting} type="submit" className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-300">
                            {submitting ? 'Saving...' : (isEditing ? 'Save Changes' : 'Upload')}
                          </button>
                      </div>
                  </form>
              </div>
          </div>
       )}
    </div>
  );
};
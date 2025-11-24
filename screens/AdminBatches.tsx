import React, { useState, useEffect } from 'react';
import { fetchBatches, addBatch, updateBatch, deleteBatch } from '../services/data';
import { Batch, ClassLevel } from '../types';
import { Plus, Trash2, Edit2, X, Image as ImageIcon, Palette, Loader2 } from 'lucide-react';

export const AdminBatches: React.FC = () => {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  const [bannerMode, setBannerMode] = useState<'gradient' | 'image'>('gradient');
  
  const initialFormState: Partial<Batch> = {
    id: '',
    name: '',
    classLevel: ClassLevel.Class9,
    originalPrice: 0,
    discountPrice: 0,
    description: '',
    gradient: 'from-blue-500 to-cyan-400',
    bannerImage: '',
    teachers: ['https://picsum.photos/100']
  };

  const [formData, setFormData] = useState<Partial<Batch>>(initialFormState);

  const refresh = async () => {
      const data = await fetchBatches();
      setBatches(data);
      setLoading(false);
  };
  useEffect(() => { refresh(); }, []);

  const handleDelete = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this batch? All subjects and content within it will be hidden.')) {
        await deleteBatch(id);
        refresh();
    }
  };

  const handleEdit = (e: React.MouseEvent, batch: Batch) => {
      e.stopPropagation();
      setFormData(batch);
      setBannerMode(batch.bannerImage ? 'image' : 'gradient');
      setIsEditing(true);
      setShowModal(true);
  };

  const handleCreateNew = () => {
      setFormData(initialFormState);
      setBannerMode('gradient');
      setIsEditing(false);
      setShowModal(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, bannerImage: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    const finalData = {
        ...formData,
        bannerImage: bannerMode === 'image' ? formData.bannerImage : undefined,
    };

    try {
        if (isEditing && formData.id) {
            await updateBatch(formData.id, finalData);
        } else {
            await addBatch({
                id: `b-${Date.now()}`,
                name: formData.name!,
                classLevel: formData.classLevel as ClassLevel,
                originalPrice: Number(formData.originalPrice),
                discountPrice: Number(formData.discountPrice),
                description: formData.description!,
                teachers: formData.teachers!,
                gradient: formData.gradient!,
                bannerImage: bannerMode === 'image' ? formData.bannerImage : undefined,
                status: 'Active',
                studentCount: 0
            });
        }
        setShowModal(false);
        refresh();
    } catch (err) {
        console.error("Error saving batch", err);
        alert("Failed to save batch.");
    } finally {
        setSubmitting(false);
    }
  };

  const gradients = [
      { name: 'Blue Ocean', value: 'from-blue-500 to-cyan-400' },
      { name: 'Royal Purple', value: 'from-purple-500 to-pink-500' },
      { name: 'Sunset Orange', value: 'from-orange-500 to-red-500' },
      { name: 'Emerald Green', value: 'from-emerald-500 to-teal-400' },
      { name: 'Midnight', value: 'from-slate-700 to-slate-900' },
  ];

  if (loading) return <div className="flex justify-center p-10"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900">Manage Batches</h1>
        <button 
            type="button"
            onClick={handleCreateNew}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
            <Plus className="w-5 h-5" /> Create New Batch
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
          <table className="w-full text-left">
              <thead className="bg-gray-50 border-b border-gray-200 text-slate-500 uppercase text-xs">
                  <tr>
                      <th className="px-6 py-4 font-semibold">Batch Info</th>
                      <th className="px-6 py-4 font-semibold">Class</th>
                      <th className="px-6 py-4 font-semibold">Price</th>
                      <th className="px-6 py-4 font-semibold">Banner</th>
                      <th className="px-6 py-4 font-semibold text-right">Actions</th>
                  </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                  {batches.map((batch) => (
                      <tr key={batch.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4">
                              <div className="font-semibold text-slate-900">{batch.name}</div>
                              <div className="text-xs text-slate-500 truncate max-w-xs">{batch.description}</div>
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-600">{batch.classLevel}</td>
                          <td className="px-6 py-4 text-sm text-slate-600">
                             {batch.discountPrice === 0 ? <span className="text-green-600 font-bold">Free</span> : `₹${batch.discountPrice}`}
                          </td>
                          <td className="px-6 py-4">
                              {batch.bannerImage ? (
                                  <img src={batch.bannerImage} alt="Banner" className="w-16 h-8 rounded object-cover border border-gray-200" />
                              ) : (
                                  <div className={`w-16 h-8 rounded bg-gradient-to-r ${batch.gradient}`}></div>
                              )}
                          </td>
                          <td className="px-6 py-4 text-right">
                              <div className="flex items-center justify-end gap-2">
                                  <button type="button" onClick={(e) => handleEdit(e, batch)} className="p-2 text-blue-600 hover:bg-blue-50 rounded"><Edit2 className="w-4 h-4"/></button>
                                  <button type="button" onClick={(e) => handleDelete(e, batch.id)} className="p-2 text-red-600 hover:bg-red-50 rounded"><Trash2 className="w-4 h-4"/></button>
                              </div>
                          </td>
                      </tr>
                  ))}
                  {batches.length === 0 && (
                      <tr><td colSpan={5} className="px-6 py-8 text-center text-slate-500">No batches found. Create one to get started.</td></tr>
                  )}
              </tbody>
          </table>
      </div>

      {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
              <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-y-auto max-h-[90vh]">
                  <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                      <h3 className="font-bold text-lg">{isEditing ? 'Edit Batch' : 'Create New Batch'}</h3>
                      <button onClick={() => setShowModal(false)}><X className="w-5 h-5 text-slate-400" /></button>
                  </div>
                  <form onSubmit={handleSubmit} className="p-6 space-y-4">
                      {/* Form fields same as before... */}
                      <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">Batch Name</label>
                          <input required className="w-full border rounded-lg px-3 py-2" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                          <div>
                              <label className="block text-sm font-medium text-slate-700 mb-1">Class Level</label>
                              <select className="w-full border rounded-lg px-3 py-2" value={formData.classLevel} onChange={e => setFormData({...formData, classLevel: e.target.value as ClassLevel})}>
                                  {Object.values(ClassLevel).map(c => <option key={c} value={c}>{c}</option>)}
                              </select>
                          </div>
                          <div>
                              <label className="block text-sm font-medium text-slate-700 mb-1">Price (0 for Free)</label>
                              <input type="number" className="w-full border rounded-lg px-3 py-2" value={formData.discountPrice} onChange={e => setFormData({...formData, discountPrice: Number(e.target.value)})} />
                          </div>
                      </div>
                      
                      <div className="space-y-3">
                        <label className="block text-sm font-medium text-slate-700">Banner Style</label>
                        <div className="flex bg-gray-100 p-1 rounded-lg w-fit">
                            <button 
                                type="button"
                                onClick={() => setBannerMode('gradient')}
                                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${bannerMode === 'gradient' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500'}`}
                            >
                                <div className="flex items-center gap-2"><Palette className="w-4 h-4"/> Gradient</div>
                            </button>
                            <button 
                                type="button"
                                onClick={() => setBannerMode('image')}
                                className={`px-4 py-1.5 rounded-md text-sm font-medium transition-all ${bannerMode === 'image' ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500'}`}
                            >
                                <div className="flex items-center gap-2"><ImageIcon className="w-4 h-4"/> Custom Image</div>
                            </button>
                        </div>

                        {bannerMode === 'gradient' ? (
                            <div className="grid grid-cols-3 gap-2">
                                {gradients.map((g) => (
                                    <div 
                                        key={g.name}
                                        onClick={() => setFormData({...formData, gradient: g.value})}
                                        className={`cursor-pointer rounded-lg p-1 border-2 ${formData.gradient === g.value ? 'border-blue-600' : 'border-transparent'}`}
                                    >
                                        <div className={`h-10 w-full rounded bg-gradient-to-r ${g.value}`}></div>
                                        <p className="text-[10px] text-center mt-1 text-slate-500">{g.name}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="space-y-2">
                                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:bg-gray-50 transition-colors">
                                    <input 
                                        type="file" 
                                        accept="image/*" 
                                        onChange={handleFileChange}
                                        className="hidden" 
                                        id="banner-upload"
                                    />
                                    <label htmlFor="banner-upload" className="cursor-pointer flex flex-col items-center gap-2">
                                        <ImageIcon className="w-8 h-8 text-slate-400" />
                                        <span className="text-sm text-slate-600">Click to upload banner from Gallery</span>
                                    </label>
                                </div>
                                {formData.bannerImage && (
                                    <div className="relative rounded-lg overflow-hidden h-32 border border-gray-200">
                                        <img src={formData.bannerImage} alt="Preview" className="w-full h-full object-cover" />
                                        <button 
                                            type="button"
                                            onClick={() => setFormData({...formData, bannerImage: ''})} 
                                            className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full shadow-md hover:bg-red-700"
                                        >
                                            <X className="w-4 h-4" />
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                      </div>

                      <div>
                          <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                          <textarea className="w-full border rounded-lg px-3 py-2" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                      </div>
                      <button disabled={submitting} type="submit" className="w-full bg-blue-600 text-white font-semibold py-2.5 rounded-lg hover:bg-blue-700 disabled:bg-blue-300">
                          {submitting ? 'Saving...' : (isEditing ? 'Update Batch' : 'Create Batch')}
                      </button>
                  </form>
              </div>
          </div>
      )}
    </div>
  );
};
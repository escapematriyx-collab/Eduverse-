import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchBatches, fetchSettings } from '../services/data';
import { ClassLevel, Batch } from '../types';
import { ArrowRight, Loader2, Lock } from 'lucide-react';

export const Home: React.FC = () => {
  const [selectedLevel, setSelectedLevel] = useState<ClassLevel>(ClassLevel.All);
  const [batches, setBatches] = useState<Batch[]>([]);
  const [loading, setLoading] = useState(true);
  const [canEnroll, setCanEnroll] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
        try {
            const data = await fetchBatches();
            setBatches(data);
            const settings = await fetchSettings();
            setCanEnroll(settings.allowEnrollments);
        } catch (error) {
            console.error("Failed to load data", error);
        } finally {
            setLoading(false);
        }
    };
    load();
  }, []);

  const filteredBatches = selectedLevel === ClassLevel.All
    ? batches
    : batches.filter(b => b.classLevel === selectedLevel);

  if (loading) {
      return <div className="flex justify-center items-center min-h-[50vh]"><Loader2 className="w-8 h-8 animate-spin text-blue-600" /></div>;
  }

  return (
    <div className="space-y-8 animate-fade-in pt-4">
      
      {/* Tabs */}
      <div className="flex justify-center">
        <div className="bg-white p-1 rounded-xl border border-gray-200 shadow-sm inline-flex">
          {Object.values(ClassLevel).map((level) => (
            <button
              key={level}
              onClick={() => setSelectedLevel(level)}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                selectedLevel === level
                  ? 'bg-slate-900 text-white shadow-md'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-gray-50'
              }`}
            >
              {level === ClassLevel.All ? 'All Classes' : level}
            </button>
          ))}
        </div>
      </div>

      {/* Batches Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBatches.map((batch) => (
          <BatchCard 
            key={batch.id} 
            batch={batch} 
            onSelect={() => navigate(`/batch/${batch.id}`)} 
            enabled={canEnroll}
          />
        ))}
        {filteredBatches.length === 0 && (
            <div className="col-span-full text-center py-10 text-slate-400">
                No batches available for this class yet.
            </div>
        )}
      </div>
      
      {!canEnroll && (
          <div className="text-center bg-amber-50 p-4 rounded-lg border border-amber-200 text-amber-800 text-sm max-w-2xl mx-auto">
              <Lock className="w-4 h-4 inline mr-2"/> New enrollments are currently closed by the administrator.
          </div>
      )}
    </div>
  );
};

const BatchCard: React.FC<{ batch: Batch; onSelect: () => void; enabled: boolean }> = ({ batch, onSelect, enabled }) => {
  const bannerStyle = batch.bannerImage 
    ? { backgroundImage: `url(${batch.bannerImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }
    : {};
  
  const gradientClass = batch.bannerImage ? 'bg-slate-900' : `bg-gradient-to-r ${batch.gradient}`;

  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full">
      {/* Increased height here: h-56 on mobile, h-64 on medium screens. Removed dark overlay and teacher circles. */}
      <div className={`h-56 md:h-64 ${gradientClass} p-4 relative transition-all duration-300`} style={bannerStyle}>
        {/* Dark overlay removed to make image light */}
        <div className="relative z-10 h-full flex flex-col justify-between">
            <span className="bg-white text-slate-900 shadow-sm text-xs font-bold px-2 py-1 rounded inline-block w-fit">
                {batch.classLevel}
            </span>
            {/* Added stronger drop-shadow since background might be light */}
            <h3 className="text-white font-bold text-xl drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] mb-2">{batch.name}</h3>
        </div>
      </div>

      <div className="p-5 pt-4 flex-1 flex flex-col">
        <div className="flex-1">
          <p className="text-slate-500 text-sm mb-4 line-clamp-2">{batch.description}</p>
          <div className="flex items-baseline gap-2 mb-6">
            <span className="text-2xl font-bold text-slate-900">
                {batch.discountPrice === 0 ? 'FREE' : `₹${batch.discountPrice}`}
            </span>
            {batch.discountPrice > 0 && (
                <>
                <span className="text-sm text-slate-400 line-through">₹{batch.originalPrice}</span>
                <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded">
                    {Math.round(((batch.originalPrice - batch.discountPrice) / batch.originalPrice) * 100)}% OFF
                </span>
                </>
            )}
             {batch.discountPrice === 0 && (
                 <span className="text-sm text-slate-400 line-through">₹{batch.originalPrice} Value</span>
             )}
          </div>
        </div>

        <button 
          onClick={onSelect}
          disabled={!enabled}
          className={`w-full py-3 font-semibold rounded-xl transition-all duration-200 flex items-center justify-center gap-2 ${
             enabled 
             ? 'bg-slate-900 text-white hover:bg-blue-600 active:scale-[0.98] group-hover:shadow-lg group-hover:shadow-blue-500/20'
             : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          {enabled ? 'Enroll Now' : 'Enrollment Closed'}
          {enabled && <ArrowRight className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
};
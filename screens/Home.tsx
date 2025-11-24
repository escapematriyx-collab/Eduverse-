import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchBatches, fetchSettings } from '../services/data';
import { ClassLevel, Batch } from '../types';
import { CheckCircle2, ArrowRight, Loader2, Lock } from 'lucide-react';

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
    <div className="space-y-8 animate-fade-in">
      
      {/* Welcome Section */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-50 text-green-700 rounded-full text-xs font-medium border border-green-200">
          <CheckCircle2 className="w-3.5 h-3.5" />
          Verified Account
        </div>
        <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Choose Your Learning Path</h2>
        <p className="text-slate-500 max-w-xl mx-auto">
          You have successfully verified your access. Please select your batch to continue learning with India's best educators.
        </p>
      </div>

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
      <div className={`h-40 ${gradientClass} p-4 relative`} style={bannerStyle}>
        <div className="absolute inset-0 bg-black/30 transition-opacity group-hover:bg-black/40"></div>
        <div className="relative z-10 h-full flex flex-col justify-between">
            <span className="bg-white/20 backdrop-blur-md text-white text-xs font-bold px-2 py-1 rounded inline-block w-fit border border-white/10">
                {batch.classLevel}
            </span>
            <h3 className="text-white font-bold text-xl drop-shadow-md">{batch.name}</h3>
        </div>
        <div className="absolute -bottom-6 right-4 flex -space-x-3">
          {batch.teachers.map((img, idx) => (
            <img 
              key={idx} 
              src={img} 
              alt="Teacher" 
              className="w-12 h-12 rounded-full border-4 border-white object-cover shadow-sm bg-gray-100"
            />
          ))}
        </div>
      </div>

      <div className="p-5 pt-8 flex-1 flex flex-col">
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
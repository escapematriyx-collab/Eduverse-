import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getBatches } from '../services/data';
import { ClassLevel, Batch } from '../types';
import { CheckCircle2, ArrowRight } from 'lucide-react';

export const Home: React.FC = () => {
  const [selectedLevel, setSelectedLevel] = useState<ClassLevel>(ClassLevel.All);
  const [batches, setBatches] = useState<Batch[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    // Refresh data on mount
    setBatches(getBatches());
  }, []);

  const filteredBatches = selectedLevel === ClassLevel.All
    ? batches
    : batches.filter(b => b.classLevel === selectedLevel);

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
          <BatchCard key={batch.id} batch={batch} onSelect={() => navigate(`/batch/${batch.id}`)} />
        ))}
        {filteredBatches.length === 0 && (
            <div className="col-span-full text-center py-10 text-slate-400">
                No batches available for this class yet.
            </div>
        )}
      </div>
    </div>
  );
};

// Internal component for batch card to keep file clean
const BatchCard: React.FC<{ batch: Batch; onSelect: () => void }> = ({ batch, onSelect }) => {
  // Determine banner style
  const bannerStyle = batch.bannerImage 
    ? { backgroundImage: `url(${batch.bannerImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }
    : {};
  
  const gradientClass = batch.bannerImage ? 'bg-slate-900' : `bg-gradient-to-r ${batch.gradient}`;

  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-gray-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full">
      {/* Banner */}
      <div className={`h-40 ${gradientClass} p-4 relative`} style={bannerStyle}>
        <div className="absolute inset-0 bg-black/30 transition-opacity group-hover:bg-black/40"></div>
        
        <div className="relative z-10 h-full flex flex-col justify-between">
            <span className="bg-white/20 backdrop-blur-md text-white text-xs font-bold px-2 py-1 rounded inline-block w-fit border border-white/10">
                {batch.classLevel}
            </span>
            <h3 className="text-white font-bold text-xl drop-shadow-md">{batch.name}</h3>
        </div>

        {/* Floating Teachers */}
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

      {/* Content */}
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
          className="w-full py-3 bg-slate-900 text-white font-semibold rounded-xl hover:bg-blue-600 active:scale-[0.98] transition-all duration-200 flex items-center justify-center gap-2 group-hover:shadow-lg group-hover:shadow-blue-500/20"
        >
          Enroll Now
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
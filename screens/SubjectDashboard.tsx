import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getBatchById, getSubjectById, getContent } from '../services/data';
import { ContentType, ContentItem } from '../types';
import { PlayCircle, FileText, PenTool, Clock, ChevronRight, Download, ExternalLink } from 'lucide-react';

export const SubjectDashboard: React.FC = () => {
  const { batchId, subjectId } = useParams();
  const [activeTab, setActiveTab] = useState<ContentType>(ContentType.Lecture);
  const [data, setData] = useState(getContent());

  const batch = getBatchById(batchId || '');
  const subject = getSubjectById(subjectId || '');

  useEffect(() => {
     setData(getContent());
  }, []);

  if (!batch || !subject) return <div>Subject not found</div>;

  // Filter content based on active tab AND subjectId
  const allContentList = activeTab === ContentType.Lecture ? data.lectures :
                      activeTab === ContentType.Note ? data.notes :
                      data.dpps;

  // Filter by subject if the item has subjectId
  const contentList = allContentList.filter(item => !item.subjectId || item.subjectId === subject.id);

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Breadcrumb & Header */}
      <div className="flex flex-col gap-2">
        <nav className="text-sm text-slate-500 flex items-center gap-2">
          <Link to={`/batch/${batchId}`} className="hover:text-blue-600 transition-colors">
            {batch.name}
          </Link>
          <ChevronRight className="w-4 h-4" />
          <span className="text-slate-900 font-medium">{subject.name}</span>
        </nav>
        <div className="flex items-center gap-3">
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900">{subject.name}</h1>
            <span className={`px-3 py-1 text-xs font-bold rounded-full ${subject.color} ${subject.textColor}`}>
                Live
            </span>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <div className="flex gap-6 overflow-x-auto no-scrollbar">
          {[ContentType.Lecture, ContentType.Note, ContentType.DPP].map((type) => (
            <button
              key={type}
              onClick={() => setActiveTab(type)}
              className={`pb-3 px-1 text-sm md:text-base font-medium whitespace-nowrap border-b-2 transition-colors duration-200 flex items-center gap-2 ${
                activeTab === type
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              {type === ContentType.Lecture && <PlayCircle className="w-4 h-4" />}
              {type === ContentType.Note && <FileText className="w-4 h-4" />}
              {type === ContentType.DPP && <PenTool className="w-4 h-4" />}
              {type === ContentType.Lecture ? 'Lectures' : type === ContentType.Note ? 'Notes' : 'DPPs'}
            </button>
          ))}
        </div>
      </div>

      {/* Content List */}
      <div className="space-y-4">
        {contentList.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
                No content available in this section yet.
            </div>
        ) : (
            contentList.map((item) => (
            <ContentListItem key={item.id} item={item} color={subject.textColor} />
            ))
        )}
      </div>
    </div>
  );
};

const ContentListItem: React.FC<{ item: ContentItem; color: string }> = ({ item, color }) => {
  const isFile = item.url?.startsWith('data:');

  const handleClick = () => {
    if (item.url) {
      // If it's a data URI (file), we create a temporary link to download it or open in new tab
      if (isFile) {
          const win = window.open();
          if (win) {
              win.document.write(
                  '<iframe src="' + item.url + '" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>'
              );
          }
      } else {
          window.open(item.url, '_blank');
      }
    } else {
      alert("No link attached to this content.");
    }
  };

  return (
    <div 
      onClick={handleClick}
      className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 flex items-center gap-4 group cursor-pointer"
    >
      {/* Icon Box */}
      <div className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 ${
        item.type === ContentType.Lecture ? 'bg-red-50 text-red-600' :
        item.type === ContentType.Note ? 'bg-blue-50 text-blue-600' :
        'bg-purple-50 text-purple-600'
      }`}>
        {item.type === ContentType.Lecture && <PlayCircle className="w-6 h-6 fill-current" />}
        {item.type === ContentType.Note && <FileText className="w-6 h-6" />}
        {item.type === ContentType.DPP && <PenTool className="w-6 h-6" />}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold tracking-wider text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded uppercase">
                {item.tag || item.type}
            </span>
            {item.duration && (
                <span className="text-[10px] text-slate-400 flex items-center gap-1">
                    <Clock className="w-3 h-3" /> {item.duration}
                </span>
            )}
            {item.date && (
                 <span className="text-[10px] text-slate-400 hidden sm:inline-block">
                    • {item.date}
                 </span>
            )}
        </div>
        <h4 className="text-slate-900 font-semibold truncate group-hover:text-blue-600 transition-colors">
            {item.title}
        </h4>
      </div>

      {/* Action */}
      <div className="shrink-0">
         <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors bg-gray-50 rounded-full group-hover:bg-blue-50">
             {item.type === ContentType.Lecture ? <PlayCircle className="w-5 h-5" /> : isFile ? <Download className="w-5 h-5" /> : <ExternalLink className="w-5 h-5" />}
         </button>
      </div>
    </div>
  );
};
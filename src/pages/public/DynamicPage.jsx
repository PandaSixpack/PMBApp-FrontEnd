import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../../api/axios';
import { Loader2, FileText, Calendar, HelpCircle, Info, BookOpen } from 'lucide-react';

const DynamicPage = () => {
  const location = useLocation();
  const [pageData, setPageData] = useState(null);
  const [loading, setLoading] = useState(true);

  const slug = location.pathname.substring(1); // gets 'about', 'majors', etc.

  const icons = {
    about: Info,
    majors: BookOpen,
    flow: Calendar,
    faq: HelpCircle
  };

  const Icon = icons[slug] || FileText;

  useEffect(() => {
    fetchPage();
  }, [slug]);

  const fetchPage = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/pages/${slug}`);
      setPageData(res.data.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
      <Loader2 className="animate-spin text-primary-600" size={48} />
      <p className="text-slate-500 font-medium">Memuat halaman...</p>
    </div>
  );

  if (!pageData) return (
    <div className="max-w-4xl mx-auto px-4 py-20 text-center">
      <h1 className="text-2xl font-bold text-slate-800">Halaman tidak ditemukan</h1>
    </div>
  );

  return (
    <div className="pb-24">
      {/* Page Header */}
      <div className="bg-slate-50 pt-20 pb-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-[2rem] shadow-xl shadow-primary-100 text-primary-600 mb-4 animate-in fade-in zoom-in duration-700">
            <Icon size={40} />
          </div>
          <h1 className="text-4xl lg:text-6xl font-black text-slate-900 tracking-tight">
            {pageData.title}
          </h1>
          <div className="w-24 h-1.5 bg-primary-600 mx-auto rounded-full"></div>
        </div>
      </div>

      {/* Page Content */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16">
        <div className="bg-white rounded-[3rem] shadow-2xl shadow-slate-200/50 border border-slate-100 p-8 md:p-16 lg:p-20">
          <div 
            className="prose prose-lg max-w-none prose-slate 
              prose-headings:text-slate-900 prose-headings:font-black 
              prose-p:text-slate-600 prose-p:leading-relaxed 
              prose-strong:text-slate-900 
              prose-a:text-primary-600 prose-a:no-underline hover:prose-a:underline
              prose-img:rounded-[2.5rem] prose-img:shadow-xl
              prose-ul:list-disc prose-ol:list-decimal"
            dangerouslySetInnerHTML={{ __html: pageData.content }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default DynamicPage;

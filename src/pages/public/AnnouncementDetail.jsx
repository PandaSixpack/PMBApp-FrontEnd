import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api, { BASE_URL } from '../../api/axios';
import { Calendar, User, ArrowLeft, Loader2, Share2 } from 'lucide-react';

const AnnouncementDetail = () => {
  const { id } = useParams();
  const [announcement, setAnnouncement] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnnouncement();
  }, [id]);

  const fetchAnnouncement = async () => {
    try {
      const res = await api.get(`/announcements/${id}`);
      setAnnouncement(res.data.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
      <Loader2 className="animate-spin text-primary-600" size={48} />
      <p className="text-slate-500 font-medium">Memuat detail...</p>
    </div>
  );

  if (!announcement) return (
    <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">Pengumuman tidak ditemukan</h1>
      <Link to="/news" className="inline-flex items-center gap-2 text-primary-600 font-bold">
        <ArrowLeft size={20} /> Kembali ke Daftar
      </Link>
    </div>
  );

  return (
    <article className="pb-24">
      {/* Article Header */}
      <div className="bg-slate-50 pt-12 pb-20">
        <div className="max-w-4xl mx-auto px-4">
          <Link to="/news" className="inline-flex items-center gap-2 text-slate-500 hover:text-primary-600 font-bold text-sm mb-8 transition-colors group">
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" /> Kembali ke Pengumuman
          </Link>
          
          <div className="space-y-6">
            <div className="inline-block px-4 py-1.5 bg-primary-100 text-primary-700 rounded-full text-[10px] font-bold uppercase tracking-widest">
              Informasi Resmi
            </div>
            <h1 className="text-3xl lg:text-5xl font-black text-slate-900 leading-tight">
              {announcement.title}
            </h1>
            
            <div className="flex flex-wrap items-center gap-6 pt-4 text-slate-500 text-sm font-medium">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-white text-xs font-bold">
                  {announcement.author?.name?.charAt(0)}
                </div>
                <span>{announcement.author?.name}</span>
              </div>
              <div className="flex items-center gap-2">
                <Calendar size={18} className="text-slate-300" />
                <span>{new Date(announcement.publishedAt || announcement.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Article Content */}
      <div className="max-w-4xl mx-auto px-4 -mt-12">
        <div className="bg-white rounded-[2.5rem] shadow-xl border border-slate-100 overflow-hidden">
          {announcement.thumbnail && (
            <div className="w-full h-[400px] overflow-hidden">
              <img 
                src={`${BASE_URL}/${announcement.thumbnail}`} 
                alt={announcement.title} 
                className="w-full h-full object-cover"
              />
            </div>
          )}
          
          <div className="p-8 lg:p-16">
            <div 
              className="prose prose-lg max-w-none prose-slate prose-headings:font-black prose-a:text-primary-600 prose-img:rounded-3xl"
              dangerouslySetInnerHTML={{ __html: announcement.content }}
            ></div>
            
            <div className="mt-16 pt-8 border-t border-slate-100 flex justify-between items-center">
              <div className="flex items-center gap-4">
                <span className="text-sm font-bold text-slate-400">BAGIKAN:</span>
                <button className="p-2 text-slate-400 hover:text-primary-600 transition-colors"><Share2 size={20} /></button>
              </div>
              <Link to="/register" className="bg-primary-600 text-white px-8 py-3 rounded-2xl font-bold hover:bg-primary-700 transition-all">
                Daftar Sekarang
              </Link>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

export default AnnouncementDetail;

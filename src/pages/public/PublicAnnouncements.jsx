import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api, { BASE_URL } from '../../api/axios';
import { Calendar, User, ArrowRight, Loader2, BookOpen } from 'lucide-react';

const PublicAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const res = await api.get('/announcements');
      setAnnouncements(res.data.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
      <Loader2 className="animate-spin text-primary-600" size={48} />
      <p className="text-slate-500 font-medium">Memuat pengumuman...</p>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="text-center space-y-4 mb-16">
        <h1 className="text-4xl lg:text-6xl font-black text-slate-900 tracking-tight">Pengumuman & Berita</h1>
        <p className="text-slate-500 max-w-2xl mx-auto">Dapatkan informasi terbaru mengenai proses pendaftaran dan kegiatan kampus di sini.</p>
      </div>

      {announcements.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 rounded-[3rem] border border-dashed border-slate-200">
          <BookOpen className="mx-auto mb-4 text-slate-300" size={48} />
          <p className="text-slate-500 font-medium">Belum ada pengumuman untuk saat ini.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {announcements.map((item) => (
            <Link 
              key={item._id} 
              to={`/news/${item._id}`}
              className="group flex flex-col bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 hover:shadow-2xl transition-all"
            >
              <div className="h-64 overflow-hidden relative">
                <img 
                  src={item.thumbnail ? `${BASE_URL}/${item.thumbnail}` : "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"} 
                  alt={item.title} 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute top-6 left-6 px-4 py-1.5 bg-white/90 backdrop-blur rounded-full text-[10px] font-bold uppercase tracking-widest text-primary-600">
                  Pengumuman
                </div>
              </div>
              <div className="p-8 flex-1 flex flex-col">
                <div className="flex items-center gap-4 text-xs text-slate-400 font-bold uppercase tracking-wider mb-4">
                  <span className="flex items-center gap-1.5"><Calendar size={14} /> {new Date(item.publishedAt || item.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 leading-snug mb-4 group-hover:text-primary-600 transition-colors line-clamp-2">
                  {item.title}
                </h3>
                <div 
                  className="text-slate-500 text-sm leading-relaxed line-clamp-3 mb-8"
                  dangerouslySetInnerHTML={{ __html: item.content.substring(0, 150) + '...' }}
                ></div>
                <div className="mt-auto pt-6 border-t border-slate-50 flex items-center justify-between text-primary-600 font-bold text-sm">
                  <span>Baca Selengkapnya</span>
                  <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default PublicAnnouncements;

import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { 
  FileText, 
  Save, 
  Loader2, 
  Info, 
  BookOpen, 
  Calendar, 
  HelpCircle 
} from 'lucide-react';

const AdminPages = () => {
  const [activeTab, setActiveTab] = useState('about');
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [pageData, setPageData] = useState({
    title: '',
    content: ''
  });

  const tabs = [
    { id: 'about', name: 'Tentang Kami', icon: Info },
    { id: 'majors', name: 'Program Studi', icon: BookOpen },
    { id: 'flow', name: 'Alur & Jadwal', icon: Calendar },
    { id: 'faq', name: 'FAQ', icon: HelpCircle },
  ];

  useEffect(() => {
    fetchPage();
  }, [activeTab]);

  const fetchPage = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/pages/${activeTab}`);
      setPageData({
        title: res.data.data.title,
        content: res.data.data.content
      });
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put(`/pages/${activeTab}`, pageData);
      alert('Konten halaman berhasil diperbarui!');
      setSaving(false);
    } catch (err) {
      alert('Gagal memperbarui konten');
      setSaving(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Manajemen Konten Halaman</h1>
          <p className="text-slate-500">Kelola informasi publik untuk website PMB</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Tabs Sidebar */}
        <div className="bg-white rounded-3xl p-4 shadow-sm border border-slate-100 h-fit space-y-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all font-bold text-sm ${
                activeTab === tab.id 
                  ? 'bg-primary-600 text-white shadow-lg shadow-primary-200' 
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <tab.icon size={20} />
              {tab.name}
            </button>
          ))}
        </div>

        {/* Editor Area */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-white rounded-xl shadow-sm">
                  <FileText className="text-primary-600" size={24} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-800">Edit: {tabs.find(t => t.id === activeTab)?.name}</h2>
                  <p className="text-xs text-slate-400 font-medium">Gunakan HTML untuk mengatur tampilan konten</p>
                </div>
              </div>
              <button
                onClick={handleSave}
                disabled={saving || loading}
                className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-primary-200 transition-all disabled:opacity-50"
              >
                {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                Simpan Perubahan
              </button>
            </div>

            <div className="p-8 space-y-6">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4">
                  <Loader2 className="animate-spin text-primary-600" size={48} />
                  <p className="text-slate-500 font-medium">Memuat data halaman...</p>
                </div>
              ) : (
                <>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Judul Halaman</label>
                    <input
                      type="text"
                      value={pageData.title}
                      onChange={(e) => setPageData({...pageData, title: e.target.value})}
                      className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary-500 outline-none font-bold text-slate-800"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700 uppercase tracking-wider">Konten (HTML)</label>
                    <textarea
                      rows="20"
                      value={pageData.content}
                      onChange={(e) => setPageData({...pageData, content: e.target.value})}
                      className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary-500 outline-none font-mono text-sm leading-relaxed"
                      placeholder="Masukkan konten dalam format HTML..."
                    />
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPages;

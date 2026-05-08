import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { 
  Plus, 
  Trash2, 
  Edit, 
  Loader2, 
  X, 
  Search, 
  Eye, 
  FileText,
  CheckCircle2,
  Clock,
  Image as ImageIcon
} from 'lucide-react';

const AdminAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    thumbnail: '',
    content: '',
    status: 'draft'
  });

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await api.put(`/announcements/${editingItem._id}`, formData);
        alert('Pengumuman diperbarui!');
      } else {
        await api.post('/announcements', formData);
        alert('Pengumuman dibuat!');
      }
      setShowModal(false);
      setEditingItem(null);
      setFormData({ title: '', thumbnail: '', content: '', status: 'draft' });
      fetchAnnouncements();
    } catch (err) {
      alert('Gagal menyimpan pengumuman');
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Hapus pengumuman ini?')) return;
    try {
      await api.delete(`/announcements/${id}`);
      fetchAnnouncements();
    } catch (err) {
      alert('Gagal menghapus');
    }
  };

  if (loading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin text-primary-600" size={40} /></div>;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Manajemen Pengumuman</h1>
          <p className="text-slate-500">Kelola berita dan informasi PMB untuk publik</p>
        </div>
        <button 
          onClick={() => {
            setEditingItem(null);
            setFormData({ title: '', thumbnail: '', content: '', status: 'draft' });
            setShowModal(true);
          }}
          className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-primary-200 transition-all"
        >
          <Plus size={20} /> Tambah Baru
        </button>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider">
                <th className="px-6 py-4">Judul Pengumuman</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Tanggal Publish</th>
                <th className="px-6 py-4">Penulis</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {announcements.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-slate-400">Belum ada pengumuman</td>
                </tr>
              ) : (
                announcements.map((item) => (
                  <tr key={item._id} className="hover:bg-slate-50/50 transition-colors text-sm">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-100 rounded-lg flex items-center justify-center shrink-0">
                          {item.thumbnail ? (
                            <img src={item.thumbnail} className="w-full h-full object-cover rounded-lg" alt="" />
                          ) : (
                            <FileText className="text-slate-400" size={20} />
                          )}
                        </div>
                        <span className="font-bold text-slate-800 line-clamp-1">{item.title}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase flex items-center gap-1.5 w-fit ${
                        item.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {item.status === 'published' ? <CheckCircle2 size={12} /> : <Clock size={12} />}
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {item.publishedAt ? new Date(item.publishedAt).toLocaleDateString('id-ID') : '-'}
                    </td>
                    <td className="px-6 py-4 text-slate-700 font-medium">
                      {item.author?.name || 'Admin'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => {
                            setEditingItem(item);
                            setFormData({
                              title: item.title,
                              thumbnail: item.thumbnail || '',
                              content: item.content,
                              status: item.status
                            });
                            setShowModal(true);
                          }}
                          className="p-2 text-slate-400 hover:bg-slate-100 rounded-lg transition-all"
                        >
                          <Edit size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(item._id)}
                          className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal CRUD */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-800">{editingItem ? 'Edit Pengumuman' : 'Buat Pengumuman Baru'}</h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600"><X size={24} /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-6 overflow-y-auto flex-1">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Judul Pengumuman</label>
                    <input
                      type="text"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                      placeholder="Contoh: Hasil Seleksi Gelombang 1"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Isi Pengumuman (HTML Supported)</label>
                    <textarea
                      required
                      rows="12"
                      value={formData.content}
                      onChange={(e) => setFormData({...formData, content: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none font-mono text-sm"
                      placeholder="Gunakan HTML tag untuk formatting (e.g. <p>, <b>, <ul>)..."
                    />
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Thumbnail URL</label>
                    <div className="relative">
                      <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                      <input
                        type="url"
                        value={formData.thumbnail}
                        onChange={(e) => setFormData({...formData, thumbnail: e.target.value})}
                        className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                        placeholder="https://image-url.com/..."
                      />
                    </div>
                    {formData.thumbnail && (
                      <div className="mt-4 aspect-video rounded-2xl overflow-hidden border-2 border-slate-100">
                        <img src={formData.thumbnail} className="w-full h-full object-cover" alt="Preview" />
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-bold text-slate-700">Status</label>
                    <select
                      value={formData.status}
                      onChange={(e) => setFormData({...formData, status: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                    </select>
                  </div>
                </div>
              </div>
            </form>

            <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end">
              <button
                type="submit"
                className="bg-primary-600 hover:bg-primary-700 text-white font-bold px-10 py-3 rounded-xl shadow-lg shadow-primary-200 transition-all"
              >
                {editingItem ? 'Perbarui Pengumuman' : 'Simpan Pengumuman'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAnnouncements;

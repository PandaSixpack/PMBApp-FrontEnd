import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { 
  ClipboardList, 
  Plus, 
  Trash2, 
  Edit, 
  BookOpen, 
  Clock, 
  Target,
  Loader2,
  X,
  CheckCircle2,
  Eye
} from 'lucide-react';

const AdminExams = () => {
  const [loading, setLoading] = useState(true);
  const [exams, setExams] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingExam, setEditingExam] = useState(null);
  const [newExam, setNewExam] = useState({
    title: '',
    category: 'Bahasa Indonesia',
    duration: 60,
    passingGrade: 70
  });

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    try {
      const res = await api.get('/exams');
      setExams(res.data.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleCreateOrUpdateExam = async (e) => {
    e.preventDefault();
    try {
      if (editingExam) {
        await api.put(`/exams/${editingExam._id}`, newExam);
        alert('Ujian berhasil diperbarui!');
      } else {
        await api.post('/exams', newExam);
        alert('Ujian berhasil dibuat!');
      }
      setShowModal(false);
      setEditingExam(null);
      setNewExam({ title: '', category: 'Bahasa Indonesia', duration: 60, passingGrade: 70 });
      fetchExams();
    } catch (err) {
      alert('Gagal menyimpan ujian');
    }
  };

  const handleDeleteExam = async (id) => {
    if (!confirm('Yakin ingin menghapus ujian ini? Seluruh soal di dalamnya juga akan terhapus.')) return;
    try {
      await api.delete(`/exams/${id}`);
      fetchExams();
    } catch (err) {
      alert('Gagal menghapus ujian');
    }
  };

  if (loading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin text-primary-600" size={40} /></div>;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Manajemen Ujian</h1>
          <p className="text-slate-500">Atur modul ujian dan kriteria kelulusan</p>
        </div>
        <button 
          onClick={() => {
            setEditingExam(null);
            setNewExam({ title: '', category: 'Bahasa Indonesia', duration: 60, passingGrade: 70 });
            setShowModal(true);
          }}
          className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-primary-200 transition-all"
        >
          <Plus size={20} /> Buat Ujian Baru
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {exams.map((exam) => (
          <div key={exam._id} className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-all">
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div className="w-14 h-14 bg-primary-50 text-primary-600 rounded-2xl flex items-center justify-center">
                  <BookOpen size={28} />
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => {
                      setEditingExam(exam);
                      setNewExam({
                        title: exam.title,
                        category: exam.category,
                        duration: exam.duration,
                        passingGrade: exam.passingGrade
                      });
                      setShowModal(true);
                    }}
                    className="p-2 text-slate-400 hover:bg-slate-50 rounded-lg transition-all"
                  >
                    <Edit size={18} />
                  </button>
                  <button 
                    onClick={() => handleDeleteExam(exam._id)}
                    className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-all"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              <h3 className="text-xl font-bold text-slate-800 mb-1">{exam.title}</h3>
              <p className="text-sm text-slate-500 mb-6">{exam.category}</p>

              <div className="space-y-4 pt-6 border-t border-slate-50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                    <Clock size={16} className="text-slate-400" /> Durasi
                  </div>
                  <span className="text-sm font-bold text-slate-800">{exam.duration} Menit</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                    <Target size={16} className="text-slate-400" /> Passing Grade
                  </div>
                  <span className="text-sm font-bold text-slate-800">{exam.passingGrade}</span>
                </div>
              </div>

              <Link 
                to="/admin/questions"
                className="flex items-center justify-center gap-2 w-full mt-8 py-3 bg-slate-50 hover:bg-primary-50 text-slate-600 hover:text-primary-600 text-sm font-bold rounded-xl transition-all border border-transparent hover:border-primary-100"
              >
                <Eye size={18} /> Kelola Soal
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Modal Buat/Edit Ujian */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-800">{editingExam ? 'Edit Ujian' : 'Tambah Ujian Baru'}</h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600"><X size={24} /></button>
            </div>
            <form onSubmit={handleCreateOrUpdateExam} className="p-6 space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Judul Ujian</label>
                <input
                  type="text"
                  required
                  value={newExam.title}
                  onChange={(e) => setNewExam({...newExam, title: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                  placeholder="Contoh: Seleksi Akademik Gel. 1"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Kategori</label>
                <select
                  value={newExam.category}
                  onChange={(e) => setNewExam({...newExam, category: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                >
                  <option>Bahasa Indonesia</option>
                  <option>Bahasa Inggris</option>
                  <option>Matematika Dasar</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Durasi (Menit)</label>
                  <input
                    type="number"
                    required
                    value={newExam.duration}
                    onChange={(e) => setNewExam({...newExam, duration: parseInt(e.target.value)})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Passing Grade</label>
                  <input
                    type="number"
                    required
                    value={newExam.passingGrade}
                    onChange={(e) => setNewExam({...newExam, passingGrade: parseInt(e.target.value)})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-primary-200 transition-all flex items-center justify-center gap-2"
              >
                <CheckCircle2 size={20} /> {editingExam ? 'Simpan Perubahan' : 'Simpan Ujian'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminExams;

import { useState, useEffect } from 'react';
import api from '../api/axios';
import { 
  Users, 
  Search, 
  Filter, 
  MoreVertical, 
  CheckCircle2, 
  XCircle, 
  Eye,
  Trash2,
  Loader2,
  Mail,
  Phone,
  ChevronLeft,
  ChevronRight,
  X,
  MapPin,
  School
} from 'lucide-react';

const AdminApplicants = () => {
  const [loading, setLoading] = useState(true);
  const [applicants, setApplicants] = useState([]);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({});
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  useEffect(() => {
    fetchApplicants();
  }, [page]);

  const fetchApplicants = async () => {
    try {
      const res = await api.get(`/applicants?page=${page}&limit=10`);
      setApplicants(res.data.data);
      setPagination(res.data.pagination);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      await api.put(`/applicants/${id}`, { admissionStatus: status });
      alert(`Status seleksi berhasil diubah menjadi ${status}`);
      fetchApplicants();
    } catch (err) {
      alert('Gagal mengubah status');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus data pendaftar ini?')) {
      try {
        await api.delete(`/applicants/${id}`);
        alert('Data berhasil dihapus');
        fetchApplicants();
      } catch (err) {
        alert('Gagal menghapus data (Backend mungkin belum mendukung delete)');
      }
    }
  };

  const filteredApplicants = applicants.filter(app => {
    const matchesSearch = app.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
                         app.user?.email?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = filterStatus === 'all' || app.admissionStatus === filterStatus;
    return matchesSearch && matchesStatus;
  });

  if (loading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin text-primary-600" size={40} /></div>;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Manajemen Mahasiswa</h1>
          <p className="text-slate-500">Kelola pendaftar dan verifikasi kelulusan</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input
              type="text"
              placeholder="Cari nama atau email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-slate-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 text-sm font-medium text-slate-600 focus:ring-2 focus:ring-primary-500 outline-none"
            >
              <option value="all">Semua Status</option>
              <option value="pending">Pending</option>
              <option value="lulus">Lulus</option>
              <option value="tidak_lulus">Tidak Lulus</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider">
                <th className="px-6 py-4">Mahasiswa</th>
                <th className="px-6 py-4">Program Studi</th>
                <th className="px-6 py-4">Status Pembayaran</th>
                <th className="px-6 py-4">Status Seleksi</th>
                <th className="px-6 py-4">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredApplicants.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-slate-400">
                    Tidak ada pendaftar ditemukan
                  </td>
                </tr>
              ) : (
                filteredApplicants.map((app) => (
                  <tr key={app._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center font-bold">
                          {app.user?.name?.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-800">{app.user?.name}</p>
                          <div className="flex items-center gap-3 text-xs text-slate-400 mt-0.5">
                            <span className="flex items-center gap-1"><Mail size={12} /> {app.user?.email}</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm text-slate-700 font-medium">{app.selectedMajor || '-'}</p>
                      <p className="text-xs text-slate-400 mt-0.5">Gelombang {app.gelombang}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        app.paymentStatus === 'verified' ? 'bg-green-100 text-green-700' :
                        app.paymentStatus === 'paid' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {app.paymentStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        app.admissionStatus === 'lulus' ? 'bg-green-100 text-green-700' :
                        app.admissionStatus === 'tidak_lulus' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {app.admissionStatus?.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => {
                            setSelectedApplicant(app);
                            setShowDetailModal(true);
                          }}
                          className="p-2 text-primary-600 hover:bg-primary-50 rounded-lg transition-all"
                          title="Lihat Detail"
                        >
                          <Eye size={18} />
                        </button>
                        <button 
                          onClick={() => handleStatusChange(app._id, 'lulus')}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-all" 
                          title="Luluskan"
                        >
                          <CheckCircle2 size={18} />
                        </button>
                        <button 
                          onClick={() => handleStatusChange(app._id, 'tidak_lulus')}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all" 
                          title="Gugurkan"
                        >
                          <XCircle size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(app._id)}
                          className="p-2 text-slate-400 hover:bg-red-50 hover:text-red-600 rounded-lg transition-all"
                          title="Hapus"
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

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="p-6 border-t border-slate-50 flex items-center justify-between">
            <p className="text-sm text-slate-500">
              Showing page <span className="font-bold text-slate-800">{page}</span> of <span className="font-bold text-slate-800">{pagination.pages}</span>
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(prev => Math.max(1, prev - 1))}
                disabled={page === 1}
                className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={() => setPage(prev => Math.min(pagination.pages, prev + 1))}
                disabled={page === pagination.pages}
                className="p-2 border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      {showDetailModal && selectedApplicant && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-800">Detail Calon Mahasiswa</h2>
              <button 
                onClick={() => setShowDetailModal(false)} 
                className="text-slate-400 hover:text-slate-600 p-2 hover:bg-slate-50 rounded-full transition-all"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="p-8 overflow-y-auto max-h-[80vh] space-y-8">
              {/* Header Info */}
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 bg-primary-100 text-primary-600 rounded-3xl flex items-center justify-center text-3xl font-bold">
                  {selectedApplicant.user?.name?.charAt(0)}
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-800">{selectedApplicant.user?.name}</h3>
                  <p className="text-slate-500 font-medium">{selectedApplicant.user?.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Biodata */}
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                    <Users size={16} /> Biodata Pribadi
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-slate-400 font-medium">NIK</p>
                      <p className="text-sm font-bold text-slate-800">{selectedApplicant.biodata?.nik || '-'}</p>
                    </div>
                    <div className="flex gap-4">
                      <div className="flex-1">
                        <p className="text-xs text-slate-400 font-medium">Tempat Lahir</p>
                        <p className="text-sm font-bold text-slate-800">{selectedApplicant.biodata?.birthPlace || '-'}</p>
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-slate-400 font-medium">Tanggal Lahir</p>
                        <p className="text-sm font-bold text-slate-800">
                          {selectedApplicant.biodata?.birthDate ? new Date(selectedApplicant.biodata.birthDate).toLocaleDateString('id-ID') : '-'}
                        </p>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 font-medium flex items-center gap-1">
                        <MapPin size={12} /> Alamat
                      </p>
                      <p className="text-sm font-bold text-slate-800">{selectedApplicant.biodata?.address || '-'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 font-medium flex items-center gap-1">
                        <Phone size={12} /> No. HP
                      </p>
                      <p className="text-sm font-bold text-slate-800">{selectedApplicant.biodata?.phone || '-'}</p>
                    </div>
                  </div>
                </div>

                {/* Academic & Status */}
                <div className="space-y-4">
                  <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                    <School size={16} /> Data Akademik
                  </h4>
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-slate-400 font-medium">Asal Sekolah</p>
                      <p className="text-sm font-bold text-slate-800">{selectedApplicant.biodata?.schoolName || '-'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 font-medium">Jurusan Sekolah</p>
                      <p className="text-sm font-bold text-slate-800">{selectedApplicant.biodata?.schoolMajor || '-'}</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 font-medium">Prodi Pilihan</p>
                      <p className="text-sm font-bold text-primary-600">{selectedApplicant.selectedMajor || '-'}</p>
                    </div>
                    <div className="pt-2">
                      <p className="text-xs text-slate-400 font-medium mb-2">Status Seleksi</p>
                      <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${
                        selectedApplicant.admissionStatus === 'lulus' ? 'bg-green-100 text-green-700' :
                        selectedApplicant.admissionStatus === 'tidak_lulus' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                      }`}>
                        {selectedApplicant.admissionStatus?.replace('_', ' ')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
              <button 
                onClick={() => handleStatusChange(selectedApplicant._id, 'tidak_lulus')}
                className="px-6 py-2.5 bg-white border border-red-200 text-red-600 rounded-xl text-sm font-bold hover:bg-red-50 transition-all"
              >
                Gugurkan
              </button>
              <button 
                onClick={() => handleStatusChange(selectedApplicant._id, 'lulus')}
                className="px-6 py-2.5 bg-primary-600 text-white rounded-xl text-sm font-bold hover:bg-primary-700 shadow-lg shadow-primary-200 transition-all"
              >
                Luluskan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminApplicants;

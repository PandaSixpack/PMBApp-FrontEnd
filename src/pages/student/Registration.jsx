import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { BookOpen, Calendar, CheckCircle2, Loader2, AlertCircle } from 'lucide-react';

const Registration = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState({
    selectedMajor: '',
    gelombang: '1',
    admissionStatus: 'pending'
  });

  const majors = [
    'D4 Teknologi Rekayasa Perangkat Lunak',
    'D4 Bisnis Digital',
    'D4 Logistik'
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await api.get('/applicants/me');
      if (res.data.data) {
        setData(res.data.data);
      }
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleSelectMajor = async (major) => {
    setSaving(true);
    try {
      const res = await api.post('/applicants', { ...data, selectedMajor: major });
      setData(res.data.data);
    } catch (err) {
      alert('Gagal memilih program studi');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin text-primary-600" size={40} /></div>;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8 text-center md:text-left">
        <h1 className="text-2xl font-bold text-slate-800">Pendaftaran</h1>
        <p className="text-slate-500">Pilih program studi dan pantau status pendaftaran Anda</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <h2 className="text-lg font-semibold text-slate-800 mb-6 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <BookOpen className="text-primary-600" size={20} />
                Pilih Program Studi
              </div>
              {data.paymentStatus === 'verified' && (
                <span className="text-xs font-medium text-amber-600 bg-amber-50 px-3 py-1 rounded-full border border-amber-100 flex items-center gap-1">
                  <AlertCircle size={14} /> Prodi dikunci (Sudah bayar)
                </span>
              )}
            </h2>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {majors.map((major) => (
                <button
                  key={major}
                  onClick={() => handleSelectMajor(major)}
                  disabled={saving || data.paymentStatus === 'verified'}
                  className={`
                    p-4 rounded-xl border-2 text-left transition-all relative
                    ${data.selectedMajor === major 
                      ? 'border-primary-600 bg-primary-50' 
                      : 'border-slate-100 hover:border-primary-200 hover:bg-slate-50'}
                    ${data.paymentStatus === 'verified' ? 'cursor-not-allowed opacity-80' : ''}
                  `}
                >
                  {data.selectedMajor === major && (
                    <CheckCircle2 className="absolute top-2 right-2 text-primary-600" size={18} />
                  )}
                  <p className={`font-semibold ${data.selectedMajor === major ? 'text-primary-700' : 'text-slate-700'}`}>
                    {major}
                  </p>
                  <p className="text-xs text-slate-500 mt-1">Program Sarjana Terapan (D4)</p>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
              <Calendar className="text-primary-600" size={20} />
              Informasi Gelombang
            </h2>
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
              <div>
                <p className="font-semibold text-slate-800">Gelombang {data.gelombang || '1'}</p>
                <p className="text-sm text-slate-500">Periode: 1 April - 30 Juni 2026</p>
              </div>
              <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full uppercase">
                Dibuka
              </span>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 sticky top-8">
            <h2 className="text-lg font-semibold text-slate-800 mb-6">Status Pendaftaran</h2>
            
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${data.selectedMajor ? 'bg-green-500 text-white' : 'bg-slate-200 text-slate-500'}`}>
                  {data.selectedMajor ? <CheckCircle2 size={18} /> : 1}
                </div>
                <div>
                  <p className="font-semibold text-slate-800 text-sm">Pilih Prodi</p>
                  <p className="text-xs text-slate-500">{data.selectedMajor || 'Belum dipilih'}</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${data.paymentStatus === 'verified' ? 'bg-green-500 text-white' : 'bg-slate-200 text-slate-500'}`}>
                  {data.paymentStatus === 'verified' ? <CheckCircle2 size={18} /> : 2}
                </div>
                <div>
                  <p className="font-semibold text-slate-800 text-sm">Pembayaran</p>
                  <p className="text-xs text-slate-500 capitalize">{data.paymentStatus || 'Belum bayar'}</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${data.examStatus === 'completed' ? 'bg-green-500 text-white' : 'bg-slate-200 text-slate-500'}`}>
                  {data.examStatus === 'completed' ? <CheckCircle2 size={18} /> : 3}
                </div>
                <div>
                  <p className="font-semibold text-slate-800 text-sm">Ujian Seleksi</p>
                  <p className="text-xs text-slate-500 capitalize">{data.examStatus || 'Belum mulai'}</p>
                </div>
              </div>
            </div>

            <div className={`mt-8 p-4 rounded-xl border flex items-center gap-3 ${
              data.admissionStatus === 'lulus' ? 'bg-green-50 border-green-100 text-green-700' :
              data.admissionStatus === 'tidak_lulus' ? 'bg-red-50 border-red-100 text-red-700' :
              'bg-blue-50 border-blue-100 text-blue-700'
            }`}>
              <AlertCircle size={20} />
              <div>
                <p className="text-xs font-bold uppercase tracking-wider">Hasil Akhir</p>
                <p className="font-bold capitalize">{(data.admissionStatus || 'pending').replace('_', ' ')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Registration;

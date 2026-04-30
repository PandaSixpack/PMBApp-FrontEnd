import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import { 
  UserCircle, 
  FileText, 
  CreditCard, 
  GraduationCap, 
  ChevronRight, 
  Clock,
  CheckCircle2,
  AlertCircle,
  Loader2
} from 'lucide-react';

const StudentDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const res = await api.get('/applicants/me');
      setData(res.data.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  if (loading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin text-primary-600" size={40} /></div>;

  const steps = [
    { 
      title: 'Lengkapi Profil', 
      desc: 'Isi biodata dan data asal sekolah', 
      icon: UserCircle, 
      path: '/dashboard/profile',
      status: data?.biodata?.nik ? 'completed' : 'pending'
    },
    { 
      title: 'Pilih Program Studi', 
      desc: 'Tentukan masa depan karirmu', 
      icon: FileText, 
      path: '/dashboard/registration',
      status: data?.selectedMajor ? 'completed' : 'pending'
    },
    { 
      title: 'Pembayaran', 
      desc: 'Biaya pendaftaran & seleksi', 
      icon: CreditCard, 
      path: '/dashboard/payment',
      status: data?.paymentStatus === 'verified' ? 'completed' : data?.paymentStatus === 'paid' ? 'processing' : 'pending'
    },
    { 
      title: 'Ujian Seleksi', 
      desc: 'Uji kemampuan akademik online', 
      icon: GraduationCap, 
      path: '/dashboard/exam',
      status: data?.examStatus === 'completed' ? 'completed' : 'pending'
    },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-10">
        <h1 className="text-3xl font-bold text-slate-900">Selamat Datang!</h1>
        <p className="text-slate-500 mt-2 text-lg">Pantau progres pendaftaranmu di sini</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Progress */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {steps.map((step, idx) => (
              <Link 
                key={idx} 
                to={step.path}
                className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md hover:border-primary-200 transition-all group"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-3 rounded-2xl ${
                    step.status === 'completed' ? 'bg-green-50 text-green-600' : 
                    step.status === 'processing' ? 'bg-amber-50 text-amber-600' : 'bg-primary-50 text-primary-600'
                  }`}>
                    <step.icon size={24} />
                  </div>
                  {step.status === 'completed' ? (
                    <CheckCircle2 size={20} className="text-green-500" />
                  ) : step.status === 'processing' ? (
                    <Clock size={20} className="text-amber-500 animate-pulse" />
                  ) : (
                    <ChevronRight size={20} className="text-slate-300 group-hover:text-primary-400 group-hover:translate-x-1 transition-all" />
                  )}
                </div>
                <h3 className="text-lg font-bold text-slate-800">{step.title}</h3>
                <p className="text-sm text-slate-500 mt-1 leading-relaxed">{step.desc}</p>
              </Link>
            ))}
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
            <h3 className="text-xl font-bold text-slate-800 mb-6">Status Pendaftaran</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-primary-500"></div>
                  <span className="text-sm font-medium text-slate-600">Pilihan Prodi</span>
                </div>
                <span className="text-sm font-bold text-slate-800">{data?.selectedMajor || '-'}</span>
              </div>
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${data?.paymentStatus === 'verified' ? 'bg-green-500' : 'bg-amber-500'}`}></div>
                  <span className="text-sm font-medium text-slate-600">Status Pembayaran</span>
                </div>
                <span className={`text-sm font-bold capitalize ${data?.paymentStatus === 'verified' ? 'text-green-600' : 'text-amber-600'}`}>
                  {data?.paymentStatus || 'Pending'}
                </span>
              </div>
              <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${data?.admissionStatus === 'lulus' ? 'bg-green-500' : 'bg-blue-500'}`}></div>
                  <span className="text-sm font-medium text-slate-600">Hasil Seleksi</span>
                </div>
                <span className={`text-sm font-bold capitalize ${data?.admissionStatus === 'lulus' ? 'text-green-600' : 'text-blue-600'}`}>
                  {data?.admissionStatus?.replace('_', ' ') || 'Dalam Proses'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-primary-600 to-primary-700 p-8 rounded-3xl text-white shadow-xl shadow-primary-200">
            <h3 className="text-xl font-bold mb-4">Pengumuman</h3>
            <div className="space-y-4">
              <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-sm">
                <p className="text-xs text-primary-100 font-medium">30 April 2026</p>
                <p className="text-sm font-bold mt-1 leading-tight">Ujian seleksi online gelombang 1 sudah dibuka.</p>
              </div>
              <div className="bg-white/10 p-4 rounded-2xl backdrop-blur-sm">
                <p className="text-xs text-primary-100 font-medium">25 April 2026</p>
                <p className="text-sm font-bold mt-1 leading-tight">Batas waktu pembayaran gelombang 1: 30 Mei 2026.</p>
              </div>
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm">
            <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
              <AlertCircle size={20} className="text-primary-600" />
              Bantuan
            </h3>
            <p className="text-sm text-slate-500 mb-6">Punya pertanyaan seputar PMB? Hubungi kami.</p>
            <div className="space-y-3">
              <a href="#" className="flex items-center gap-3 text-sm font-bold text-slate-700 hover:text-primary-600 transition-colors">
                <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center">📞</div>
                021-1234-5678
              </a>
              <a href="#" className="flex items-center gap-3 text-sm font-bold text-slate-700 hover:text-primary-600 transition-colors">
                <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center">💬</div>
                WhatsApp Center
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentDashboard;

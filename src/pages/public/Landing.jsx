import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  Users, 
  BookOpen, 
  GraduationCap,
  ChevronRight,
  TrendingUp,
  ShieldCheck,
  Zap,
  Phone
} from 'lucide-react';

const Landing = () => {
  return (
    <div className="space-y-24 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 lg:pt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8 relative z-10 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 border border-primary-100 text-primary-600 text-xs font-bold uppercase tracking-widest animate-in fade-in slide-in-from-bottom duration-700">
                <Zap size={14} /> Pendaftaran Mahasiswa Baru 2026/2027
              </div>
              <h1 className="text-5xl lg:text-7xl font-black text-slate-900 leading-[1.1] tracking-tight">
                Mulai Masa Depan <span className="text-primary-600">Digitalmu</span> di Sini.
              </h1>
              <p className="text-lg text-slate-500 leading-relaxed max-w-xl mx-auto lg:mx-0">
                Bergabunglah dengan Politeknik Bisnis Digital Indonesia. Program Sarjana Terapan (D4) yang dirancang khusus untuk membangun generasi profesional di bidang bisnis digital, logistik, dan teknologi perangkat lunak untuk masa depan Indonesia.
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                <Link 
                  to="/register"
                  className="w-full sm:w-auto bg-primary-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-primary-700 transition-all shadow-xl shadow-primary-200 flex items-center justify-center gap-2 group"
                >
                  Daftar Sekarang <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link 
                  to="/majors"
                  className="w-full sm:w-auto bg-white text-slate-700 border border-slate-200 px-8 py-4 rounded-2xl font-bold hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
                >
                  Lihat Program Studi
                </Link>
              </div>
              <div className="flex items-center gap-6 pt-4 justify-center lg:justify-start">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center overflow-hidden">
                      <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="student" />
                    </div>
                  ))}
                </div>
                <div className="text-sm">
                  <p className="font-bold text-slate-900">100+ Mahasiswa</p>
                  <p className="text-slate-500">Sudah bergabung tahun ini</p>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="absolute -top-20 -right-20 w-96 h-96 bg-primary-100 rounded-full blur-3xl opacity-50 animate-pulse"></div>
              <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-blue-100 rounded-full blur-3xl opacity-50"></div>
              <div className="relative rounded-[2.5rem] overflow-hidden shadow-2xl border-8 border-white group">
                <img 
                  src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                  alt="Students" 
                  className="w-full aspect-[4/5] object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary-900/60 to-transparent"></div>
                <div className="absolute bottom-8 left-8 right-8 bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/20 text-white">
                  <p className="text-sm font-medium opacity-90 italic">"Kurikulum yang diajarkan sangat relevan dengan kebutuhan industri saat ini."</p>
                  <p className="mt-4 font-bold">Andi Pratama</p>
                  <p className="text-xs opacity-70">Mahasiswa TRPL 2024</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 rounded-[3rem] p-12 text-white grid grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center space-y-2">
            <h3 className="text-4xl font-black text-primary-400">A+</h3>
            <p className="text-sm font-medium text-slate-400">Akreditasi Institusi</p>
          </div>
          <div className="text-center space-y-2 border-l border-slate-800">
            <h3 className="text-4xl font-black text-primary-400">80%</h3>
            <p className="text-sm font-medium text-slate-400">Dosen Praktisi</p>
          </div>
          <div className="text-center space-y-2 border-l border-slate-800">
            <h3 className="text-4xl font-black text-primary-400">10+</h3>
            <p className="text-sm font-medium text-slate-400">Mitra Industri</p>
          </div>
          <div className="text-center space-y-2 border-l border-slate-800">
            <h3 className="text-4xl font-black text-primary-400">Hybrid</h3>
            <p className="text-sm font-medium text-slate-400">Kuliah Online + Offline</p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl lg:text-5xl font-black text-slate-900 tracking-tight">Mengapa Memilih Kami?</h2>
          <p className="text-slate-500 max-w-2xl mx-auto">Kami memberikan pengalaman belajar terbaik dengan fasilitas modern dan kurikulum berbasis industri.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { 
              title: 'Kurikulum Berbasis Industri', 
              desc: 'Dirancang untuk memenuhi kebutuhan pasar kerja saat ini.', 
              icon: TrendingUp,
              color: 'bg-blue-50 text-blue-600'
            },
            { 
              title: 'Bekal Sertifikasi', 
              desc: 'Persiapan ujian sertifikasi nasional & internasional.', 
              icon: ShieldCheck,
              color: 'bg-green-50 text-green-600'
            },
            { 
              title: 'Lingkungan Belajar Modern', 
              desc: 'Ruang kelas nyaman ber-AC & akses internet cepat.', 
              icon: GraduationCap,
              color: 'bg-purple-50 text-purple-600'
            }
          ].map((feature, idx) => (
            <div key={idx} className="bg-white p-10 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:border-primary-100 transition-all group">
              <div className={`w-16 h-16 ${feature.color} rounded-2xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform`}>
                <feature.icon size={32} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">{feature.title}</h3>
              <p className="text-slate-500 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Majors Section */}
      <section className="bg-slate-50 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end gap-8 mb-16">
            <div className="space-y-4 max-w-xl">
              <h2 className="text-3xl lg:text-5xl font-black text-slate-900 tracking-tight">Program Sarjana Terapan (D4)</h2>
              <p className="text-slate-500">Pilih program studi yang sesuai dengan passion dan impian karirmu.</p>
            </div>
            <Link to="/majors" className="text-primary-600 font-bold flex items-center gap-2 hover:gap-3 transition-all">
              Lihat Detail Kurikulum <ArrowRight size={20} />
            </Link>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {[
              { 
                name: 'D4 Teknologi Rekayasa Perangkat Lunak', 
                desc: 'Fokus pada pengembangan aplikasi modern, cloud computing, dan AI.',
                icon: BookOpen 
              },
              { 
                name: 'D4 Bisnis Digital', 
                desc: 'Menggabungkan strategi bisnis dengan analisis data dan digital marketing.',
                icon: TrendingUp 
              },
              { 
                name: 'D4 Logistik', 
                desc: 'Optimasi rantai pasok menggunakan teknologi IoT dan otomasi.',
                icon: Zap 
              }
            ].map((major, idx) => (
              <div key={idx} className="bg-white rounded-[2.5rem] overflow-hidden border border-slate-100 hover:shadow-2xl transition-all group">
                <div className="h-48 bg-slate-200 relative">
                  <img 
                    src={`https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80&sig=${idx}`} 
                    alt={major.name} 
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                  />
                  <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest text-primary-600">
                    Akreditasi Baik Sekali
                  </div>
                </div>
                <div className="p-10 space-y-6">
                  <h3 className="text-xl font-bold text-slate-900 leading-snug">{major.name}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{major.desc}</p>
                  <Link 
                    to="/register" 
                    className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl group-hover:bg-primary-600 group-hover:text-white transition-all"
                  >
                    <span className="font-bold text-sm">Daftar Sekarang</span>
                    <ChevronRight size={18} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-primary-600 rounded-[3.5rem] p-12 lg:p-20 text-center space-y-10 relative overflow-hidden shadow-2xl shadow-primary-300">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary-400/20 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl"></div>
          
          <div className="relative z-10 space-y-4">
            <h2 className="text-4xl lg:text-6xl font-black text-white leading-tight">Siap Menjadi Bagian dari Kami?</h2>
            <p className="text-primary-100 text-lg max-w-2xl mx-auto">Gelombang 1 pendaftaran ditutup dalam 15 hari lagi. Jangan lewatkan kesempatanmu!</p>
          </div>
          
          <div className="relative z-10 flex flex-col sm:flex-row items-center gap-6 justify-center">
            <Link 
              to="/register"
              className="bg-white text-primary-600 px-12 py-5 rounded-2xl font-black text-lg hover:scale-105 transition-all shadow-xl shadow-primary-900/20"
            >
              Mulai Pendaftaran
            </Link>
            <div className="flex items-center gap-4 text-white">
              <div className="w-12 h-12 rounded-full border border-white/30 flex items-center justify-center">
                <Phone size={20} />
              </div>
              <div className="text-left">
                <p className="text-xs opacity-70">Konsultasi Gratis</p>
                <p className="font-bold">0812-9876-5432</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Landing;

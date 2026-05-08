import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  MessageSquare,
  Send,
  Globe,
  Facebook,
  Instagram,
  Twitter,
  Youtube
} from 'lucide-react';

const Contact = () => {
  return (
    <div className="pb-24">
      {/* Contact Header */}
      <div className="bg-slate-900 pt-24 pb-40 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary-600/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-6">
          <h1 className="text-4xl lg:text-7xl font-black text-white tracking-tight">Hubungi Kami</h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
            Punya pertanyaan seputar PMB atau kampus? Kami siap membantu Anda mendapatkan informasi yang dibutuhkan.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Contact Info Cards */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100 flex items-start gap-6 group hover:border-primary-100 transition-all">
              <div className="w-14 h-14 bg-primary-50 text-primary-600 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-primary-600 group-hover:text-white transition-all">
                <Phone size={28} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">Telepon & WhatsApp</h3>
                <p className="text-slate-500 text-sm mb-2">Layanan Senin - Jumat (08:00 - 16:00)</p>
                <p className="text-primary-600 font-black text-lg">+62 21 8047 3871</p>
              </div>
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100 flex items-start gap-6 group hover:border-primary-100 transition-all">
              <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-all">
                <Mail size={28} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">Email Resmi</h3>
                <p className="text-slate-500 text-sm mb-2">Respon cepat dalam 24 jam kerja.</p>
                <p className="text-blue-600 font-black text-lg">pmb@polbis.ac.id</p>
                <p className="text-slate-600 font-bold text-sm">info@polbis.ac.id</p>
              </div>
            </div>

            <div className="bg-white p-8 rounded-[2.5rem] shadow-xl border border-slate-100 flex items-start gap-6 group hover:border-primary-100 transition-all">
              <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-purple-600 group-hover:text-white transition-all">
                <MapPin size={28} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900 mb-1">Lokasi Kampus</h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  Jl. Raya Cileungsi - Jonggol No.KM 3, Cileungsi Kidul, Kec. Cileungsi, Kabupaten Bogor, Jawa Barat 16820
                </p>
                <button className="mt-4 text-purple-600 font-bold text-sm flex items-center gap-2 hover:underline">
                  Lihat di Google Maps <Globe size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-white p-8 md:p-12 rounded-[3rem] shadow-2xl border border-slate-100 h-full">
              <div className="space-y-4 mb-10">
                <h2 className="text-3xl font-black text-slate-900 tracking-tight">Kirim Pesan Langsung</h2>
                <p className="text-slate-500">Isi formulir di bawah ini, tim kami akan segera menghubungi Anda.</p>
              </div>

              <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Nama Lengkap</label>
                  <input 
                    type="text" 
                    placeholder="Contoh: Andi Pratama"
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Alamat Email</label>
                  <input 
                    type="email" 
                    placeholder="andi@gmail.com"
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Subjek Pertanyaan</label>
                  <select className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary-500 outline-none transition-all">
                    <option>Informasi Pendaftaran</option>
                    <option>Masalah Teknis Website</option>
                    <option>Beasiswa & Biaya Kuliah</option>
                    <option>Lainnya</option>
                  </select>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Pesan Anda</label>
                  <textarea 
                    rows="5"
                    placeholder="Tuliskan detail pertanyaan Anda di sini..."
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                  ></textarea>
                </div>
                <div className="md:col-span-2 pt-4">
                  <button className="w-full md:w-auto bg-primary-600 text-white px-12 py-5 rounded-2xl font-black shadow-xl shadow-primary-200 hover:bg-primary-700 hover:scale-[1.02] transition-all flex items-center justify-center gap-3">
                    Kirim Pesan Sekarang <Send size={20} />
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Social Media Section */}
        <div className="mt-20 bg-slate-50 rounded-[3rem] p-12 text-center space-y-8 border border-slate-100">
          <h2 className="text-2xl font-black text-slate-900">Ikuti Kami di Media Sosial</h2>
          <div className="flex flex-wrap justify-center gap-6">
            {[
              { icon: Facebook, color: 'bg-blue-600', label: 'Facebook' },
              { icon: Instagram, color: 'bg-pink-600', label: 'Instagram' },
              { icon: Twitter, color: 'bg-sky-500', label: 'Twitter' },
              { icon: Youtube, color: 'bg-red-600', label: 'Youtube' }
            ].map((social, idx) => (
              <button key={idx} className="flex items-center gap-3 px-6 py-3 bg-white rounded-2xl shadow-sm border border-slate-100 hover:shadow-lg transition-all group">
                <div className={`w-8 h-8 ${social.color} text-white rounded-lg flex items-center justify-center`}>
                  <social.icon size={18} />
                </div>
                <span className="font-bold text-slate-700 group-hover:text-primary-600">{social.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;

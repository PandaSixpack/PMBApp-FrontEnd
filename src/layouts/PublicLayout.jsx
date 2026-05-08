import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Menu,
  X,
  GraduationCap,
  Phone,
  Mail,
  MapPin,
  Facebook,
  Instagram,
  Twitter,
  ArrowRight
} from 'lucide-react';

const PublicLayout = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'Beranda', path: '/' },
    { name: 'Tentang', path: '/about' },
    { name: 'Program Studi', path: '/majors' },
    { name: 'Alur & Jadwal', path: '/flow' },
    { name: 'Pengumuman', path: '/news' },
    { name: 'FAQ', path: '/faq' },
    { name: 'Kontak', path: '/contact' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Top Bar */}
      <div className="bg-primary-900 text-white py-2 px-4 hidden md:block">
        <div className="max-w-7xl mx-auto flex justify-between items-center text-xs font-medium">
          <div className="flex gap-6">
            <span className="flex items-center gap-1.5"><Phone size={14} /> +62 21 8047 3871</span>
            <span className="flex items-center gap-1.5"><Mail size={14} /> pmb@polbis.ac.id</span>
          </div>
          <div className="flex gap-4">
            <Facebook size={14} className="cursor-pointer hover:text-primary-300" />
            <Instagram size={14} className="cursor-pointer hover:text-primary-300" />
            <Twitter size={14} className="cursor-pointer hover:text-primary-300" />
          </div>
        </div>
      </div>

      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
                <GraduationCap className="text-white" size={24} />
              </div>
              <div>
                <h1 className="text-lg font-bold text-slate-900 leading-tight">PMB Politeknik</h1>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Bisnis Digital Indonesia</p>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden lg:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`text-sm font-bold transition-colors ${location.pathname === link.path ? 'text-primary-600' : 'text-slate-600 hover:text-primary-600'
                    }`}
                >
                  {link.name}
                </Link>
              ))}
              <Link
                to="/login"
                className="bg-primary-600 text-white px-6 py-2.5 rounded-full text-sm font-bold hover:bg-primary-700 transition-all shadow-lg shadow-primary-200 flex items-center gap-2"
              >
                Masuk / Daftar <ArrowRight size={16} />
              </Link>
            </nav>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 text-slate-600"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
            </button>
          </div>
        </div>

        {/* Mobile Nav */}
        {isMenuOpen && (
          <div className="lg:hidden bg-white border-t border-slate-100 animate-in slide-in-from-top duration-300">
            <div className="px-4 py-6 space-y-4">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="block text-base font-bold text-slate-700"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <Link
                to="/login"
                className="block w-full text-center bg-primary-600 text-white py-4 rounded-2xl font-bold"
                onClick={() => setIsMenuOpen(false)}
              >
                Masuk / Daftar
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-white pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
                  <GraduationCap className="text-white" size={24} />
                </div>
                <h2 className="text-xl font-bold">Politeknik BDI</h2>
              </div>
              <p className="text-slate-400 text-sm leading-relaxed">
                Mencetak generasi profesional di bidang bisnis digital dan teknologi informasi yang siap bersaing di era industri 4.0.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-6">Tautan Cepat</h3>
              <ul className="space-y-4 text-sm text-slate-400 font-medium">
                <li><Link to="/about" className="hover:text-white transition-colors">Tentang Kami</Link></li>
                <li><Link to="/majors" className="hover:text-white transition-colors">Program Studi</Link></li>
                <li><Link to="/flow" className="hover:text-white transition-colors">Alur Pendaftaran</Link></li>
                <li><Link to="/news" className="hover:text-white transition-colors">Pengumuman</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-6">Hubungi Kami</h3>
              <ul className="space-y-4 text-sm text-slate-400 font-medium">
                <li className="flex items-start gap-3">
                  <MapPin size={18} className="text-primary-500 shrink-0" />
                  <span>Jl. Raya Cileungsi - Jonggol No.KM 3, Cileungsi Kidul, Kec. Cileungsi, Kabupaten Bogor, Jawa Barat 16820
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone size={18} className="text-primary-500 shrink-0" />
                  <span>+62 21 8047 3871</span>
                </li>
                <li className="flex items-center gap-3">
                  <Mail size={18} className="text-primary-500 shrink-0" />
                  <span>pmb@polbis.ac.id</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className="text-lg font-bold mb-6">Newsletter</h3>
              <p className="text-sm text-slate-400 mb-4">Dapatkan informasi terbaru seputar PMB.</p>
              <div className="flex gap-2">
                <input
                  type="email"
                  placeholder="Email Anda"
                  className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-sm w-full outline-none focus:ring-2 focus:ring-primary-500"
                />
                <button className="bg-primary-600 p-2 rounded-lg hover:bg-primary-700 transition-all">
                  <ArrowRight size={20} />
                </button>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-800 text-center text-slate-500 text-xs">
            <p>&copy; {new Date().getFullYear()} Politeknik Bisnis Digital Indonesia. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;

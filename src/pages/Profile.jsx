import { useState, useEffect } from 'react';
import api from '../api/axios';
import { User, MapPin, Phone, School, Save, Loader2, Camera, FileUp } from 'lucide-react';

const Profile = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({
    biodata: {
      nik: '',
      birthPlace: '',
      birthDate: '',
      address: '',
      phone: '',
      schoolName: '',
      schoolMajor: '',
    }
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get('/applicants/me');
      if (res.data.data) {
        // Format date for input
        const data = res.data.data;
        if (data.biodata?.birthDate) {
          data.biodata.birthDate = data.biodata.birthDate.split('T')[0];
        }
        setProfile(data);
      }
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({
      ...prev,
      biodata: {
        ...prev.biodata,
        [name]: value
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.post('/applicants', profile);
      alert('Profil berhasil diperbarui!');
    } catch (err) {
      alert('Gagal memperbarui profil');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin text-primary-600" size={40} /></div>;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Profil Saya</h1>
        <p className="text-slate-500">Lengkapi data diri Anda untuk proses pendaftaran</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-50 bg-slate-50/50">
            <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
              <User size={20} className="text-primary-600" />
              Biodata Pribadi
            </h2>
          </div>
          
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">NIK (Sesuai KTP)</label>
              <input
                type="text"
                name="nik"
                value={profile.biodata?.nik || ''}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                placeholder="Masukkan 16 digit NIK"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">No. HP / WhatsApp</label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="text"
                  name="phone"
                  value={profile.biodata?.phone || ''}
                  onChange={handleChange}
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                  placeholder="0812..."
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Tempat Lahir</label>
              <input
                type="text"
                name="birthPlace"
                value={profile.biodata?.birthPlace || ''}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                placeholder="Contoh: Jakarta"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Tanggal Lahir</label>
              <input
                type="date"
                name="birthDate"
                value={profile.biodata?.birthDate || ''}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all"
              />
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="text-sm font-medium text-slate-700">Alamat Lengkap</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 text-slate-400" size={18} />
                <textarea
                  name="address"
                  value={profile.biodata?.address || ''}
                  onChange={handleChange}
                  rows="3"
                  className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                  placeholder="Jl. Raya No. 123..."
                ></textarea>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-50 bg-slate-50/50">
            <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
              <School size={20} className="text-primary-600" />
              Asal Sekolah
            </h2>
          </div>
          
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Nama Sekolah</label>
              <input
                type="text"
                name="schoolName"
                value={profile.biodata?.schoolName || ''}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                placeholder="SMA/SMK Negeri 1..."
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Jurusan</label>
              <input
                type="text"
                name="schoolMajor"
                value={profile.biodata?.schoolMajor || ''}
                onChange={handleChange}
                className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                placeholder="IPA / IPS / Teknik..."
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-8 py-3 rounded-xl font-semibold shadow-lg shadow-primary-200 transition-all disabled:opacity-70"
          >
            {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
            Simpan Perubahan
          </button>
        </div>
      </form>
    </div>
  );
};

export default Profile;

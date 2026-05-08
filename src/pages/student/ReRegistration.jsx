import { useState, useEffect } from 'react';
import api, { BASE_URL } from '../../api/axios';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import logo from '../../assets/img/logo.jpg';
import { 
  ClipboardCheck, 
  User, 
  School, 
  Users, 
  FileText, 
  Upload, 
  Loader2, 
  CheckCircle2, 
  AlertCircle,
  FileCheck,
  Eye,
  Info,
  Download
} from 'lucide-react';

const ReRegistration = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [applicant, setApplicant] = useState(null);
  const [reReg, setReReg] = useState(null);
  const [showProof, setShowProof] = useState(null);

  const [formData, setFormData] = useState({
    biodata: {
      nik: '',
      fullName: '',
      birthPlace: '',
      birthDate: '',
      gender: 'Laki-laki',
      religion: '',
      address: '',
      phone: ''
    },
    schoolInfo: {
      schoolName: '',
      schoolMajor: '',
      graduationYear: ''
    },
    parentInfo: {
      fatherName: '',
      fatherPhone: '',
      fatherOccupation: '',
      motherName: '',
      motherPhone: '',
      motherOccupation: ''
    }
  });

  const [files, setFiles] = useState({
    ijazah: null,
    kartuKeluarga: null,
    ktp: null,
    akteKelahiran: null,
    suratPernyataan: null,
    photoFormal: null
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [appRes, reRegRes] = await Promise.all([
        api.get('/applicants/me'),
        api.get('/re-registration/me')
      ]);

      setApplicant(appRes.data.data);
      
      // Ensure fullName is always present
      if (reRegRes.data.data) {
        const data = reRegRes.data.data;
        // Format date for input type="date"
        if (data.biodata && data.biodata.birthDate) {
          data.biodata.birthDate = new Date(data.biodata.birthDate).toISOString().split('T')[0];
        }
        
        // Ensure fullName is always present from user profile if missing in re-registration
        if (data.biodata && !data.biodata.fullName) {
          data.biodata.fullName = appRes.data.data.user?.name || '';
        }
        
        setReReg(data);
        setFormData(data);
      } else if (appRes.data.data) {
        // Pre-fill from applicant biodata
        const bio = appRes.data.data.biodata || {};
        setFormData(prev => ({
          ...prev,
          biodata: {
            ...prev.biodata,
            nik: bio.nik || '',
            fullName: appRes.data.data.user?.name || '',
            phone: bio.phone || '',
            address: bio.address || '',
            birthPlace: bio.birthPlace || '',
            birthDate: bio.birthDate ? new Date(bio.birthDate).toISOString().split('T')[0] : ''
          },
          schoolInfo: {
            ...prev.schoolInfo,
            schoolName: bio.schoolName || '',
            schoolMajor: bio.schoolMajor || ''
          }
        }));
      }
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleInputChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleFileChange = (field, file) => {
    setFiles(prev => ({ ...prev, [field]: file }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    const data = new FormData();
    data.append('biodata', JSON.stringify(formData.biodata));
    data.append('schoolInfo', JSON.stringify(formData.schoolInfo));
    data.append('parentInfo', JSON.stringify(formData.parentInfo));

    Object.keys(files).forEach(key => {
      if (files[key]) {
        data.append(key, files[key]);
      }
    });

    try {
      await api.post('/re-registration', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert('Data registrasi ulang berhasil dikirim!');
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Gagal mengirim data');
    } finally {
      setSaving(false);
    }
  };

  const generatePDF = async () => {
    try {
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      
      // Header
      doc.setFillColor(30, 58, 138); // Primary 900
      doc.rect(0, 0, pageWidth, 40, 'F');
      
      // Add Logo from local assets
      try {
        const img = new Image();
        img.src = logo;
        await new Promise((resolve) => {
          img.onload = resolve;
          img.onerror = resolve;
          setTimeout(resolve, 2000);
        });
        if (img.complete && img.naturalWidth > 0) {
          // Menyesuaikan ukuran dan posisi logo agar tidak terlalu mepet
          doc.addImage(img, 'JPEG', 15, 8, 22, 22);
        }
      } catch (e) {
        console.error('Failed to add logo to PDF');
      }

      doc.setTextColor(255, 255, 255);
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      // Menempatkan teks tetap di tengah halaman (pageWidth / 2)
      doc.text('BUKTI PENDAFTARAN MAHASISWA BARU', pageWidth / 2 + 10, 20, { align: 'center' });
      doc.setFontSize(10);
      doc.text('POLITEKNIK BISNIS DIGITAL INDONESIA', pageWidth / 2 + 10, 30, { align: 'center' });

      // Status Banner
      const isVerified = reReg?.status === 'verified';
      doc.setFillColor(isVerified ? 240 : 239, isVerified ? 253 : 246, isVerified ? 244 : 255); // green-50 or blue-50
      doc.rect(10, 45, pageWidth - 20, 15, 'F');
      doc.setTextColor(isVerified ? 22 : 30, isVerified ? 101 : 58, isVerified ? 52 : 138); // green-800 or blue-800
      doc.setFontSize(12);
      doc.text(`STATUS: ${isVerified ? 'REGISTRASI TERVERIFIKASI' : 'REGISTRASI TERKIRIM (DRAF)'}`, pageWidth / 2, 55, { align: 'center' });

      // Student Photo
      const photoPath = reReg?.documents?.photoFormal;
      if (photoPath) {
        try {
          const photoUrl = `${BASE_URL}/${photoPath}`;
          const img = new Image();
          img.crossOrigin = 'Anonymous';
          img.src = photoUrl;
          await new Promise((resolve) => {
            img.onload = resolve;
            img.onerror = resolve;
          });
          doc.addImage(img, 'JPEG', pageWidth - 50, 70, 40, 50);
          doc.setDrawColor(200, 200, 200);
          doc.rect(pageWidth - 50, 70, 40, 50);
        } catch (e) {
          console.error('Failed to add photo to PDF');
        }
      }

      // Biodata Table
      doc.setTextColor(0, 0, 0);
      doc.setFontSize(14);
      doc.text('DATA MAHASISWA', 10, 75);
      
      const birthDateStr = formData.biodata.birthDate 
        ? new Date(formData.biodata.birthDate).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
        : '-';

      const tableData = [
        ['Nama Lengkap', formData.biodata.fullName || '-'],
        ['NIK', formData.biodata.nik || '-'],
        ['Tempat, Tgl Lahir', `${formData.biodata.birthPlace || '-'}${formData.biodata.birthDate ? ', ' + birthDateStr : ''}`],
        ['Jenis Kelamin', formData.biodata.gender || '-'],
        ['Agama', formData.biodata.religion || '-'],
        ['No. HP', formData.biodata.phone || '-'],
        ['Alamat', formData.biodata.address || '-'],
        ['Asal Sekolah', formData.schoolInfo.schoolName || '-'],
        ['Jurusan Sekolah', formData.schoolInfo.schoolMajor || '-'],
        ['Program Studi', applicant?.selectedMajor || '-'],
      ];

      autoTable(doc, {
        startY: 85,
        body: tableData,
        theme: 'plain',
        columnStyles: {
          0: { fontStyle: 'bold', cellWidth: 50 },
          1: { cellWidth: 100 }
        },
        styles: { fontSize: 10, cellPadding: 3 }
      });

      // Footer Info
      const finalY = doc.lastAutoTable ? doc.lastAutoTable.finalY + 20 : 200;
      doc.setFontSize(10);
      doc.text('Keterangan:', 10, finalY);
      doc.setFont('helvetica', 'normal');
      doc.text('1. Dokumen ini adalah bukti resmi registrasi ulang.', 10, finalY + 7);
      doc.text('2. Silakan simpan dokumen ini untuk keperluan administrasi perkuliahan.', 10, finalY + 14);
      doc.text('3. Informasi jadwal orientasi akan dikirimkan melalui WhatsApp/Email.', 10, finalY + 21);

      // Date & Signature Space
      const today = new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' });
      doc.text(`Dicetak pada: ${today}`, pageWidth - 70, finalY + 35);
      doc.text('Panitia PMB Polbis', pageWidth - 60, finalY + 45);

      doc.save(`Bukti_Registrasi_${(formData.biodata.fullName || 'Mahasiswa').replace(/\s+/g, '_')}.pdf`);
    } catch (err) {
      console.error('PDF Generation Error:', err);
      alert('Gagal membuat PDF. Silakan coba lagi.');
    }
  };

  if (loading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin text-primary-600" size={40} /></div>;

  if (applicant?.admissionStatus !== 'lulus') {
    return (
      <div className="max-w-2xl mx-auto mt-12 p-12 bg-white rounded-3xl shadow-sm border border-slate-100 text-center">
        <div className="w-20 h-20 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-6 text-amber-500">
          <AlertCircle size={40} />
        </div>
        <h1 className="text-2xl font-bold text-slate-800 mb-2">Akses Terbatas</h1>
        <p className="text-slate-500">
          Menu Registrasi Ulang hanya tersedia bagi calon mahasiswa yang telah dinyatakan <strong>LULUS</strong> seleksi.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto pb-20">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Registrasi Ulang</h1>
        <p className="text-slate-500">Lengkapi data dan unggah berkas untuk finalisasi pendaftaran</p>
      </div>

      {(reReg?.status === 'verified' || reReg?.status === 'pending') && (
        <div className={`mb-8 p-6 border rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6 ${
          reReg?.status === 'verified' ? 'bg-green-50 border-green-100 text-green-800' : 'bg-blue-50 border-blue-100 text-blue-800'
        }`}>
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shrink-0 ${
              reReg?.status === 'verified' ? 'bg-green-500' : 'bg-blue-500'
            }`}>
              {reReg?.status === 'verified' ? <CheckCircle2 size={24} /> : <Info size={24} />}
            </div>
            <div>
              <p className="font-bold text-lg">
                {reReg?.status === 'verified' ? 'Registrasi Ulang Terverifikasi' : 'Registrasi Ulang Terkirim'}
              </p>
              <p className="opacity-90">
                {reReg?.status === 'verified' 
                  ? 'Selamat! Data Anda telah diverifikasi. Silakan download bukti pendaftaran.' 
                  : 'Data Anda sedang dalam proses verifikasi oleh admin. Anda sudah dapat mendownload draf bukti pendaftaran.'}
              </p>
            </div>
          </div>
          <button
            onClick={generatePDF}
            className={`${
              reReg?.status === 'verified' ? 'bg-green-600 hover:bg-green-700 shadow-green-200' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-200'
            } text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 shadow-lg transition-all shrink-0`}
          >
            <Download size={20} /> Download Bukti (PDF)
          </button>
        </div>
      )}

      {reReg?.status === 'rejected' && (
        <div className="mb-8 p-6 bg-red-50 border border-red-100 rounded-3xl flex items-center gap-4 text-red-800">
          <div className="w-12 h-12 bg-red-500 rounded-2xl flex items-center justify-center text-white shrink-0">
            <AlertCircle size={24} />
          </div>
          <div>
            <p className="font-bold text-lg">Registrasi Ulang Perlu Perbaikan</p>
            <p className="opacity-90">{reReg.adminNotes || 'Silakan cek kembali data dan berkas yang Anda unggah.'}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Step 1: Data Diri */}
        <section className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-50 bg-slate-50/50 flex items-center gap-3">
            <User className="text-primary-600" size={20} />
            <h2 className="font-bold text-slate-800">Data Diri Lengkap</h2>
          </div>
          <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">NIK (Sesuai KTP/KK)</label>
              <input 
                type="text" 
                value={formData.biodata.nik} 
                onChange={(e) => handleInputChange('biodata', 'nik', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                placeholder="320..."
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Nama Lengkap</label>
              <input 
                type="text" 
                value={formData.biodata.fullName || applicant?.user?.name || ''} 
                readOnly
                className="w-full px-4 py-3 rounded-xl border border-slate-100 bg-slate-50 text-slate-500 outline-none cursor-not-allowed"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Tempat Lahir</label>
              <input 
                type="text" 
                value={formData.biodata.birthPlace} 
                onChange={(e) => handleInputChange('biodata', 'birthPlace', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Tanggal Lahir</label>
              <input 
                type="date" 
                value={formData.biodata.birthDate} 
                onChange={(e) => handleInputChange('biodata', 'birthDate', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Jenis Kelamin</label>
              <select 
                value={formData.biodata.gender} 
                onChange={(e) => handleInputChange('biodata', 'gender', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                required
              >
                <option value="Laki-laki">Laki-laki</option>
                <option value="Perempuan">Perempuan</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Agama</label>
              <input 
                type="text" 
                value={formData.biodata.religion} 
                onChange={(e) => handleInputChange('biodata', 'religion', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                required
              />
            </div>
            <div className="md:col-span-2 space-y-2">
              <label className="text-sm font-semibold text-slate-700">Alamat Lengkap</label>
              <textarea 
                value={formData.biodata.address} 
                onChange={(e) => handleInputChange('biodata', 'address', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                rows="3"
                required
              />
            </div>
          </div>
        </section>

        {/* Step 2: Asal Sekolah */}
        <section className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-50 bg-slate-50/50 flex items-center gap-3">
            <School className="text-primary-600" size={20} />
            <h2 className="font-bold text-slate-800">Asal Sekolah</h2>
          </div>
          <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Nama Sekolah</label>
              <input 
                type="text" 
                value={formData.schoolInfo.schoolName} 
                onChange={(e) => handleInputChange('schoolInfo', 'schoolName', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Jurusan</label>
              <input 
                type="text" 
                value={formData.schoolInfo.schoolMajor} 
                onChange={(e) => handleInputChange('schoolInfo', 'schoolMajor', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Tahun Lulus</label>
              <input 
                type="text" 
                value={formData.schoolInfo.graduationYear} 
                onChange={(e) => handleInputChange('schoolInfo', 'graduationYear', e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                placeholder="2024"
                required
              />
            </div>
          </div>
        </section>

        {/* Step 3: Data Orang Tua */}
        <section className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-50 bg-slate-50/50 flex items-center gap-3">
            <Users className="text-primary-600" size={20} />
            <h2 className="font-bold text-slate-800">Data Orang Tua</h2>
          </div>
          <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
            {/* Father */}
            <div className="space-y-6">
              <h3 className="font-semibold text-primary-700 border-b pb-2">Data Ayah</h3>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Nama Ayah</label>
                <input 
                  type="text" 
                  value={formData.parentInfo.fatherName} 
                  onChange={(e) => handleInputChange('parentInfo', 'fatherName', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">No. HP Ayah</label>
                <input 
                  type="text" 
                  value={formData.parentInfo.fatherPhone} 
                  onChange={(e) => handleInputChange('parentInfo', 'fatherPhone', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Pekerjaan Ayah</label>
                <input 
                  type="text" 
                  value={formData.parentInfo.fatherOccupation} 
                  onChange={(e) => handleInputChange('parentInfo', 'fatherOccupation', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                  required
                />
              </div>
            </div>

            {/* Mother */}
            <div className="space-y-6">
              <h3 className="font-semibold text-primary-700 border-b pb-2">Data Ibu</h3>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Nama Ibu</label>
                <input 
                  type="text" 
                  value={formData.parentInfo.motherName} 
                  onChange={(e) => handleInputChange('parentInfo', 'motherName', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">No. HP Ibu</label>
                <input 
                  type="text" 
                  value={formData.parentInfo.motherPhone} 
                  onChange={(e) => handleInputChange('parentInfo', 'motherPhone', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                  required
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Pekerjaan Ibu</label>
                <input 
                  type="text" 
                  value={formData.parentInfo.motherOccupation} 
                  onChange={(e) => handleInputChange('parentInfo', 'motherOccupation', e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary-500 outline-none transition-all"
                  required
                />
              </div>
            </div>
          </div>
        </section>

        {/* Step 4: Berkas Dokumen */}
        <section className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-6 border-b border-slate-50 bg-slate-50/50 flex items-center gap-3">
            <FileText className="text-primary-600" size={20} />
            <h2 className="font-bold text-slate-800">Unggah Berkas (PDF/JPG/PNG, Max 2MB)</h2>
          </div>
          <div className="p-8 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                { id: 'photoFormal', label: 'Pas Photo Formal (Latar Merah/Biru)' },
                { id: 'ijazah', label: 'Ijazah / SKL' },
                { id: 'kartuKeluarga', label: 'Kartu Keluarga' },
                { id: 'ktp', label: 'KTP / KIA' },
                { id: 'akteKelahiran', label: 'Akte Kelahiran' },
                { id: 'suratPernyataan', label: 'Surat Pernyataan Maba' }
              ].map((doc) => (
                <div key={doc.id} className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-bold text-slate-700">{doc.label}</label>
                    {reReg?.documents?.[doc.id] && (
                      <button 
                        type="button"
                        onClick={() => setShowProof(reReg.documents[doc.id])}
                        className="text-xs text-primary-600 font-medium flex items-center gap-1 hover:underline"
                      >
                        <Eye size={12} /> Lihat Berkas
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <input 
                      type="file" 
                      id={doc.id}
                      onChange={(e) => handleFileChange(doc.id, e.target.files[0])}
                      className="hidden"
                      accept=".pdf,.jpg,.jpeg,.png"
                      disabled={reReg?.status === 'verified'}
                    />
                    <label 
                      htmlFor={doc.id}
                      className={`
                        flex items-center justify-between px-4 py-3 border-2 border-dashed rounded-xl cursor-pointer transition-all
                        ${files[doc.id] ? 'border-primary-500 bg-primary-50' : 'border-slate-200 hover:border-primary-300'}
                        ${reReg?.status === 'verified' ? 'opacity-50 cursor-not-allowed' : ''}
                      `}
                    >
                      <span className="text-sm text-slate-500 truncate mr-2">
                        {files[doc.id] ? files[doc.id].name : 'Pilih berkas...'}
                      </span>
                      <Upload size={18} className="text-slate-400 shrink-0" />
                    </label>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-blue-50 p-4 rounded-2xl flex items-start gap-3 text-blue-800 text-sm">
              <Info className="shrink-0" size={18} />
              <p>Format file yang diperbolehkan adalah PDF, JPG, atau PNG dengan ukuran maksimal 2MB per file.</p>
            </div>
          </div>
        </section>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={saving || reReg?.status === 'verified'}
            className="bg-primary-600 hover:bg-primary-700 text-white font-bold py-4 px-12 rounded-2xl shadow-xl shadow-primary-200 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? <Loader2 className="animate-spin" size={24} /> : <FileCheck size={24} />}
            {reReg ? 'Update Registrasi Ulang' : 'Kirim Registrasi Ulang'}
          </button>
        </div>
      </form>

      {/* View Modal */}
      {showProof && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-4xl w-full h-[80vh] overflow-hidden shadow-2xl flex flex-col">
            <div className="p-6 border-b flex justify-between items-center">
              <h3 className="font-bold text-slate-800">Pratinjau Berkas</h3>
              <button onClick={() => setShowProof(null)} className="text-slate-400 hover:text-slate-600">
                <AlertCircle size={24} className="rotate-45" />
              </button>
            </div>
            <div className="flex-1 bg-slate-100 overflow-auto flex justify-center p-4">
              {showProof.toLowerCase().endsWith('.pdf') ? (
                <iframe src={`${BASE_URL}/${showProof}`} className="w-full h-full rounded-lg" />
              ) : (
                <img src={`${BASE_URL}/${showProof}`} alt="Preview" className="max-w-full object-contain rounded-lg" />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReRegistration;

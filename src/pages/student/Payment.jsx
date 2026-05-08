import { useState, useEffect } from 'react';
import api, { BASE_URL } from '../../api/axios';
import { CreditCard, Upload, CheckCircle2, XCircle, Clock, Loader2, Info, Eye, AlertCircle, Trash2 } from 'lucide-react';

const Payment = () => {
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [payments, setPayments] = useState([]);
  const [applicant, setApplicant] = useState(null);
  const [file, setFile] = useState(null);
  const [showProof, setShowProof] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [paymentRes, applicantRes] = await Promise.all([
        api.get('/payments/me'),
        api.get('/applicants/me')
      ]);
      setPayments(paymentRes.data.data);
      setApplicant(applicantRes.data.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return alert('Silakan pilih file bukti pembayaran');

    setUploading(true);
    const formData = new FormData();
    formData.append('proof', file);

    try {
      await api.post('/payments/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert('Bukti pembayaran berhasil diunggah!');
      setFile(null);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Gagal mengunggah bukti pembayaran');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Apakah Anda yakin ingin menghapus bukti pembayaran ini?')) return;

    try {
      await api.delete('/payments/me');
      alert('Bukti pembayaran berhasil dihapus');
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Gagal menghapus bukti pembayaran');
    }
  };

  const isBiodataComplete = applicant?.biodata?.nik && applicant?.biodata?.phone;

  const getStatusIcon = (status) => {
    switch (status) {
      case 'verified': return <CheckCircle2 className="text-green-500" size={20} />;
      case 'rejected': return <XCircle className="text-red-500" size={20} />;
      default: return <Clock className="text-amber-500" size={20} />;
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'verified': return 'bg-green-50 text-green-700 border-green-100';
      case 'rejected': return 'bg-red-50 text-red-700 border-red-100';
      default: return 'bg-amber-50 text-amber-700 border-amber-100';
    }
  };

  if (loading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin text-primary-600" size={40} /></div>;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Pembayaran</h1>
        <p className="text-slate-500">Unggah bukti pembayaran untuk memulai ujian seleksi</p>
      </div>

      {!isBiodataComplete && (
        <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3 text-red-800">
          <AlertCircle className="shrink-0 mt-0.5" size={20} />
          <div>
            <p className="font-bold">Biodata Belum Lengkap</p>
            <p className="text-sm opacity-90">Silakan lengkapi biodata Anda terlebih dahulu di menu Profil sebelum melakukan pembayaran.</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <h2 className="text-lg font-semibold text-slate-800 mb-6 flex items-center gap-2">
              <Upload className="text-primary-600" size={20} />
              {payments.length > 0 ? 'Re-upload Bukti Pembayaran' : 'Unggah Bukti Pembayaran'}
            </h2>
            
            <div className={`p-6 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 text-center ${(!isBiodataComplete || (payments.length > 0 && payments[0].status === 'verified')) ? 'opacity-50 cursor-not-allowed' : ''}`}>
              <form onSubmit={handleUpload} className="space-y-4">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm text-slate-400">
                    <CreditCard size={32} />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800">
                      {file ? file.name : (payments.length > 0 ? 'Klik untuk ganti bukti' : 'Klik untuk pilih file')}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">Format JPG, PNG, atau PDF (Max 5MB)</p>
                  </div>
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="hidden"
                    id="proof-upload"
                    accept=".jpg,.jpeg,.png,.pdf"
                    disabled={!isBiodataComplete || (payments.length > 0 && payments[0].status === 'verified')}
                  />
                  <label
                    htmlFor="proof-upload"
                    className={`cursor-pointer bg-white border border-slate-200 px-6 py-2 rounded-xl text-sm font-medium hover:bg-slate-50 transition-all ${(!isBiodataComplete || (payments.length > 0 && payments[0].status === 'verified')) ? 'pointer-events-none' : ''}`}
                  >
                    Pilih File
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={uploading || !file || !isBiodataComplete || (payments.length > 0 && payments[0].status === 'verified')}
                  className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg shadow-primary-200 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {uploading ? <Loader2 className="animate-spin" size={20} /> : <Upload size={20} />}
                  {payments.length > 0 ? 'Re-upload Sekarang' : 'Unggah Sekarang'}
                </button>
              </form>
            </div>
            {payments.length > 0 && payments[0].status === 'verified' && (
              <p className="mt-4 text-sm text-green-600 bg-green-50 p-3 rounded-xl border border-green-100 flex items-center gap-2">
                <CheckCircle2 size={16} />
                Pembayaran Anda sudah diverifikasi. Tidak dapat mengubah bukti.
              </p>
            )}
            {payments.length > 0 && payments[0].status !== 'verified' && (
              <p className="mt-4 text-sm text-amber-600 bg-amber-50 p-3 rounded-xl border border-amber-100 flex items-center gap-2">
                <Info size={16} />
                Anda dapat melakukan re-upload bukti jika terdapat kesalahan sebelum diverifikasi.
              </p>
            )}
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-50">
              <h2 className="text-lg font-semibold text-slate-800">Riwayat Pembayaran</h2>
            </div>
            <div className="divide-y divide-slate-50">
              {payments.length === 0 ? (
                <div className="p-12 text-center text-slate-400">
                  <p>Belum ada riwayat pembayaran</p>
                </div>
              ) : (
                payments.map((payment) => (
                  <div key={payment._id} className="p-6 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center text-slate-500">
                        <CreditCard size={24} />
                      </div>
                      <div>
                        <p className="font-semibold text-slate-800">Biaya Pendaftaran</p>
                        <p className="text-sm text-slate-500">
                          {new Date(payment.createdAt).toLocaleDateString('id-ID', {
                            day: 'numeric', month: 'long', year: 'numeric'
                          })}
                        </p>
                        <button 
                          onClick={() => setShowProof(payment.proof)}
                          className="text-xs text-primary-600 font-medium flex items-center gap-1 mt-1 hover:underline"
                        >
                          <Eye size={12} /> Lihat Bukti
                        </button>
                        {payment.status !== 'verified' && (
                          <button 
                            onClick={handleDelete}
                            className="text-xs text-red-600 font-medium flex items-center gap-1 mt-1 hover:underline"
                          >
                            <Trash2 size={12} /> Hapus Bukti
                          </button>
                        )}
                      </div>
                    </div>
                    <div className={`px-4 py-2 rounded-xl border flex items-center gap-2 text-sm font-semibold ${getStatusClass(payment.status)}`}>
                      {getStatusIcon(payment.status)}
                      <span className="capitalize">{payment.status}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-primary-600 rounded-2xl shadow-lg shadow-primary-200 p-6 text-white">
            <h2 className="text-lg font-semibold mb-4">Detail Pembayaran</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center text-primary-100">
                <span>Biaya Pendaftaran</span>
                <span className="font-bold text-white">Rp 250.000</span>
              </div>
              <div className="pt-4 border-t border-primary-500">
                <p className="text-sm font-medium text-primary-100">Transfer ke Rekening:</p>
                <p className="text-xl font-bold mt-1">Bank Mandiri</p>
                <p className="text-lg font-mono tracking-wider mt-1">123-00-1234567-8</p>
                <p className="text-sm mt-1">a.n. Politeknik Bisnis Digital</p>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 rounded-2xl p-6 border border-blue-100 text-blue-800">
            <div className="flex items-start gap-3">
              <Info className="shrink-0 mt-1" size={20} />
              <div>
                <p className="font-bold">Informasi Penting</p>
                <ul className="text-sm mt-2 space-y-2 list-disc ml-4 opacity-80">
                  <li>Pastikan nominal transfer sesuai</li>
                  <li>Simpan bukti transfer</li>
                  <li>Verifikasi memerlukan waktu 1-24 jam</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Proof Modal */}
      {showProof && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-2xl w-full overflow-hidden shadow-2xl">
            <div className="p-6 border-b flex justify-between items-center">
              <h3 className="font-bold text-slate-800">Bukti Pembayaran</h3>
              <button onClick={() => setShowProof(null)} className="text-slate-400 hover:text-slate-600">
                <XCircle size={24} />
              </button>
            </div>
            <div className="p-6 flex justify-center bg-slate-50">
              {showProof.toLowerCase().endsWith('.pdf') ? (
                <iframe src={`${BASE_URL}/${showProof}`} className="w-full h-[500px]" />
              ) : (
                <img src={`${BASE_URL}/${showProof}`} alt="Proof" className="max-w-full max-h-[500px] rounded-lg shadow-md" />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Payment;

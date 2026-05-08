import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { CreditCard, Upload, CheckCircle2, XCircle, Clock, Loader2, Info } from 'lucide-react';

const Payment = () => {
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [payments, setPayments] = useState([]);
  const [file, setFile] = useState(null);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const res = await api.get('/payments/me');
      setPayments(res.data.data);
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
      fetchPayments();
    } catch (err) {
      alert(err.response?.data?.message || 'Gagal mengunggah bukti pembayaran');
    } finally {
      setUploading(false);
    }
  };

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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
            <h2 className="text-lg font-semibold text-slate-800 mb-6 flex items-center gap-2">
              <Upload className="text-primary-600" size={20} />
              Unggah Bukti Pembayaran
            </h2>
            
            <div className="p-6 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 text-center">
              <form onSubmit={handleUpload} className="space-y-4">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm text-slate-400">
                    <CreditCard size={32} />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800">Klik untuk pilih file</p>
                    <p className="text-xs text-slate-500 mt-1">Format JPG, PNG, atau PDF (Max 5MB)</p>
                  </div>
                  <input
                    type="file"
                    onChange={handleFileChange}
                    className="hidden"
                    id="proof-upload"
                    accept=".jpg,.jpeg,.png,.pdf"
                  />
                  <label
                    htmlFor="proof-upload"
                    className="cursor-pointer bg-white border border-slate-200 px-6 py-2 rounded-xl text-sm font-medium hover:bg-slate-50 transition-all"
                  >
                    Pilih File
                  </label>
                  {file && (
                    <p className="text-sm font-medium text-primary-600">{file.name}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={uploading || !file}
                  className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg shadow-primary-200 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {uploading ? <Loader2 className="animate-spin" size={20} /> : <Upload size={20} />}
                  Unggah Sekarang
                </button>
              </form>
            </div>
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
    </div>
  );
};

export default Payment;

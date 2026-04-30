import { useState, useEffect } from 'react';
import api from '../api/axios';
import { 
  CreditCard, 
  CheckCircle2, 
  XCircle, 
  ExternalLink,
  Loader2,
  Calendar,
  User,
  AlertCircle
} from 'lucide-react';

const AdminPayments = () => {
  const [loading, setLoading] = useState(true);
  const [payments, setPayments] = useState([]);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const res = await api.get('/payments');
      setPayments(res.data.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleVerify = async (id, status) => {
    try {
      await api.put(`/payments/${id}/verify`, { status });
      alert(`Pembayaran berhasil di ${status}`);
      fetchPayments();
    } catch (err) {
      alert('Gagal memverifikasi pembayaran');
    }
  };

  if (loading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin text-primary-600" size={40} /></div>;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Verifikasi Pembayaran</h1>
        <p className="text-slate-500">Periksa bukti transfer dan konfirmasi status pembayaran</p>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider">
                <th className="px-6 py-4">Mahasiswa</th>
                <th className="px-6 py-4">Tanggal Unggah</th>
                <th className="px-6 py-4">Bukti</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {payments.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-slate-400">
                    Belum ada data pembayaran
                  </td>
                </tr>
              ) : (
                payments.map((payment) => (
                  <tr key={payment._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-400">
                          <User size={20} />
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-800">{payment.user?.name}</p>
                          <p className="text-xs text-slate-500">{payment.user?.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Calendar size={14} className="text-slate-400" />
                        {new Date(payment.createdAt).toLocaleDateString('id-ID')}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <a 
                        href={`http://localhost:5000/${payment.proof}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-sm font-bold text-primary-600 hover:text-primary-700 hover:underline"
                      >
                        <ExternalLink size={14} /> Lihat Bukti
                      </a>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        payment.status === 'verified' ? 'bg-green-100 text-green-700' :
                        payment.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {payment.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {payment.status === 'pending' ? (
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => handleVerify(payment._id, 'verified')}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-green-600 text-white rounded-lg text-xs font-bold hover:bg-green-700 transition-all shadow-sm shadow-green-100"
                          >
                            <CheckCircle2 size={14} /> Terima
                          </button>
                          <button 
                            onClick={() => handleVerify(payment._id, 'rejected')}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-xs font-bold hover:bg-red-100 transition-all border border-red-100"
                          >
                            <XCircle size={14} /> Tolak
                          </button>
                        </div>
                      ) : (
                        <div className="text-xs text-slate-400 font-medium italic">
                          Telah diproses
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-100 rounded-2xl p-6 flex items-start gap-4 text-blue-800">
        <AlertCircle className="shrink-0 mt-0.5" size={20} />
        <div className="text-sm">
          <p className="font-bold">Panduan Verifikasi</p>
          <ul className="mt-2 space-y-1 list-disc ml-4 opacity-80">
            <li>Pastikan nama pengirim di bukti transfer sesuai dengan nama pendaftar</li>
            <li>Periksa nominal transfer (Rp 250.000)</li>
            <li>Periksa keaslian dokumen bukti pembayaran</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AdminPayments;

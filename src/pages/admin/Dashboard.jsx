import { useState, useEffect } from 'react';
import api from '../../api/axios';
import { 
  Users, 
  CheckCircle2, 
  Clock, 
  CreditCard, 
  TrendingUp, 
  Loader2,
  Calendar
} from 'lucide-react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const AdminStats = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await api.get('/stats');
      setStats(res.data.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  if (loading || !stats) return <div className="flex justify-center p-12"><Loader2 className="animate-spin text-primary-600" size={40} /></div>;

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  
  const chartData = {
    labels: (stats.monthlyStats || []).map(s => monthNames[s._id - 1]),
    datasets: [
      {
        label: 'Pendaftar Baru',
        data: (stats.monthlyStats || []).map(s => s.count),
        fill: true,
        backgroundColor: 'rgba(14, 165, 233, 0.1)',
        borderColor: 'rgb(14, 165, 233)',
        tension: 0.4,
      },
    ],
  };

  const statCards = [
    { title: 'Total Pendaftar', value: stats.totalApplicants || 0, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { title: 'Jumlah Lulus', value: stats.totalLulus || 0, icon: CheckCircle2, color: 'text-green-600', bg: 'bg-green-50' },
    { title: 'Menunggu Review', value: stats.totalPending || 0, icon: Clock, color: 'text-amber-600', bg: 'bg-amber-50' },
    { title: 'Pembayaran Valid', value: stats.totalVerifiedPayments || 0, icon: CreditCard, color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Dashboard Statistik</h1>
          <p className="text-slate-500 mt-1">Ringkasan performa pendaftaran mahasiswa baru</p>
        </div>
        <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-100 text-slate-600 text-sm font-medium">
          <Calendar size={18} />
          <span>{new Date().toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((card, idx) => (
          <div key={idx} className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-5">
            <div className={`w-14 h-14 ${card.bg} ${card.color} rounded-2xl flex items-center justify-center`}>
              <card.icon size={28} />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">{card.title}</p>
              <p className="text-2xl font-bold text-slate-900 mt-0.5">{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-bold text-slate-800">Tren Pendaftaran</h3>
          </div>
          <div className="h-80">
            <Line data={chartData} options={{ maintainAspectRatio: false }} />
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
          <h3 className="text-xl font-bold text-slate-800 mb-8">Sebaran Program Studi</h3>
          <div className="h-80">
            <Bar 
              data={{
                labels: (stats.majorStats || []).map(m => m._id || 'Belum Pilih'),
                datasets: [{
                  label: 'Pendaftar',
                  data: (stats.majorStats || []).map(m => m.count),
                  backgroundColor: '#0ea5e9',
                  borderRadius: 8
                }]
              }} 
              options={{ maintainAspectRatio: false }} 
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-8 border-b border-slate-50">
          <h3 className="text-xl font-bold text-slate-800">Aktivitas Terbaru</h3>
        </div>
        <div className="p-8">
          <div className="space-y-6">
            {!stats.recentApplicants || stats.recentApplicants.length === 0 ? (
              <p className="text-center text-slate-400 py-4">Belum ada aktivitas pendaftaran</p>
            ) : (
              stats.recentApplicants.map((applicant) => (
                <div key={applicant._id} className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center text-slate-500">
                    <Users size={20} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-slate-800 font-semibold">{applicant.user?.name || 'User'}</p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {applicant.selectedMajor ? `Mendaftar di ${applicant.selectedMajor}` : 'Baru saja melengkapi profil'}
                    </p>
                  </div>
                  <span className="text-xs text-slate-400 font-medium">
                    {new Date(applicant.createdAt).toLocaleDateString('id-ID')}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminStats;

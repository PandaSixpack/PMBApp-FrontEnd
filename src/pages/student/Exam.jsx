import { useState, useEffect, useCallback } from 'react';
import api from '../../api/axios';
import { Clock, GraduationCap, AlertTriangle, CheckCircle2, Loader2, ArrowRight, ChevronRight, ChevronLeft, FileText } from 'lucide-react';

const Exam = () => {
  const [loading, setLoading] = useState(true);
  const [applicant, setApplicant] = useState(null);
  const [exams, setExams] = useState([]);
  const [currentExam, setCurrentExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [isExamStarted, setIsExamStarted] = useState(false);
  const [examResults, setExamResults] = useState([]);

  useEffect(() => {
    fetchInitialData();
  }, []);

  const fetchInitialData = async () => {
    try {
      const [appRes, examsRes, resultsRes] = await Promise.all([
        api.get('/applicants/me'),
        api.get('/exams'),
        api.get('/exams/results')
      ]);
      setApplicant(appRes.data.data);
      setExams(examsRes.data.data);
      setExamResults(resultsRes.data.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const startExam = async (examId) => {
    try {
      setLoading(true);
      const res = await api.post('/exams/start', { examId });
      
      // Reset state for new exam
      setQuestions(res.data.data);
      setCurrentQuestionIndex(0);
      setUserAnswers({});
      
      const exam = exams.find(e => e._id === examId);
      setCurrentExam(exam);
      setTimeLeft(exam.duration * 60);
      setIsExamStarted(true);
      setLoading(false);
    } catch (err) {
      alert(err.response?.data?.message || 'Gagal memulai ujian');
      setLoading(false);
    }
  };

  const submitExam = useCallback(async () => {
    setLoading(true);
    const answers = Object.entries(userAnswers).map(([questionId, answer]) => ({
      questionId,
      answer
    }));

    try {
      const res = await api.post('/exams/submit', {
        examId: currentExam._id,
        answers
      });
      
      // Update results and applicant data
      const [resultsRes, appRes] = await Promise.all([
        api.get('/exams/results'),
        api.get('/applicants/me')
      ]);
      
      setExamResults(resultsRes.data.data);
      setApplicant(appRes.data.data);
      setIsExamStarted(false);
      setLoading(false);
      alert('Ujian berhasil dikirim!');
    } catch (err) {
      alert('Gagal mengirim jawaban');
      setLoading(false);
    }
  }, [currentExam, userAnswers]);

  useEffect(() => {
    let timer;
    if (isExamStarted && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            submitExam();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isExamStarted, timeLeft, submitExam]);

  const handleAnswerSelect = (questionId, optionIndex) => {
    setUserAnswers(prev => ({ ...prev, [questionId]: optionIndex }));
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading && !isExamStarted) return <div className="flex justify-center p-12"><Loader2 className="animate-spin text-primary-600" size={40} /></div>;

  // Active Exam State
  if (isExamStarted) {
    const q = questions[currentQuestionIndex];
    
    if (!q) return <div className="flex justify-center p-12"><Loader2 className="animate-spin text-primary-600" size={40} /></div>;

    return (
      <div className="max-w-4xl mx-auto pb-20">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 sticky top-0 bg-slate-50/80 backdrop-blur-md py-4 z-10">
          <div>
            <h1 className="text-xl font-bold text-slate-800">{currentExam.title}</h1>
            <p className="text-slate-500 text-sm">Soal {currentQuestionIndex + 1} dari {questions.length}</p>
          </div>
          <div className="flex items-center gap-3 bg-white px-6 py-3 rounded-2xl shadow-sm border border-slate-100">
            <Clock className={timeLeft < 300 ? 'text-red-500 animate-pulse' : 'text-primary-600'} size={24} />
            <span className={`text-2xl font-mono font-bold ${timeLeft < 300 ? 'text-red-600' : 'text-slate-800'}`}>
              {formatTime(timeLeft)}
            </span>
          </div>
        </div>

        <div className="space-y-8">
          <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
            <h2 className="text-xl font-medium text-slate-800 leading-relaxed">
              {q.question}
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {q.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleAnswerSelect(q._id, idx)}
                className={`
                  p-6 rounded-2xl border-2 text-left transition-all flex items-center gap-4 group
                  ${userAnswers[q._id] === idx 
                    ? 'border-primary-600 bg-primary-50 text-primary-700' 
                    : 'border-white bg-white hover:border-slate-200 text-slate-700'}
                `}
              >
                <div className={`
                  w-10 h-10 rounded-xl flex items-center justify-center font-bold shrink-0 transition-colors
                  ${userAnswers[q._id] === idx ? 'bg-primary-600 text-white' : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200'}
                `}>
                  {String.fromCharCode(65 + idx)}
                </div>
                <span className="font-medium text-lg">{option}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="fixed bottom-0 left-0 right-0 lg:left-64 bg-white border-t border-slate-100 p-4">
          <div className="max-w-4xl mx-auto flex items-center justify-between gap-4">
            <button
              onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
              disabled={currentQuestionIndex === 0}
              className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-30"
            >
              <ChevronLeft size={20} /> Kembali
            </button>

            <div className="flex-1 flex justify-center gap-2 overflow-x-auto px-4 no-scrollbar hidden md:flex">
              {questions.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentQuestionIndex(idx)}
                  className={`
                    w-10 h-10 rounded-lg text-xs font-bold transition-all shrink-0
                    ${currentQuestionIndex === idx ? 'bg-primary-600 text-white shadow-lg shadow-primary-200' : 
                      userAnswers[questions[idx]._id] !== undefined ? 'bg-primary-100 text-primary-700' : 'bg-slate-100 text-slate-400'}
                  `}
                >
                  {idx + 1}
                </button>
              ))}
            </div>

            {currentQuestionIndex === questions.length - 1 ? (
              <button
                onClick={submitExam}
                className="flex items-center gap-2 px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-bold shadow-lg shadow-green-200 transition-all"
              >
                Selesai <CheckCircle2 size={20} />
              </button>
            ) : (
              <button
                onClick={() => setCurrentQuestionIndex(prev => Math.min(questions.length - 1, prev + 1))}
                className="flex items-center gap-2 px-8 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold shadow-lg shadow-primary-200 transition-all"
              >
                Lanjut <ChevronRight size={20} />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Pre-Exam State
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Ujian Seleksi Online</h1>
        <p className="text-slate-500">Selesaikan ketiga modul ujian untuk mendapatkan penilaian akhir</p>
      </div>

      {applicant?.paymentStatus !== 'verified' ? (
        <div className="bg-amber-50 border border-amber-100 rounded-3xl p-12 text-center">
          <div className="w-20 h-20 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertTriangle size={48} />
          </div>
          <h2 className="text-2xl font-bold text-slate-800">Akses Terkunci</h2>
          <p className="text-slate-600 mt-4 max-w-md mx-auto">
            Anda belum dapat mengikuti ujian seleksi. Silakan selesaikan pembayaran dan tunggu verifikasi admin terlebih dahulu.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {exams.map((exam) => {
              const result = examResults.find(r => 
                (typeof r.examId === 'object' ? r.examId._id : r.examId) === exam._id
              );
              return (
                <div key={exam._id} className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-xl transition-all group flex flex-col h-full">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-6">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${
                        result ? 'bg-green-100 text-green-600' : 'bg-primary-50 text-primary-600'
                      }`}>
                        <GraduationCap size={28} />
                      </div>
                      {result && (
                        <span className="px-3 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full flex items-center gap-1">
                          <CheckCircle2 size={12} /> SELESAI
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-1">{exam.title}</h3>
                    <p className="text-slate-500 text-sm mb-6">{exam.category}</p>
                    
                    <div className="space-y-3">
                      <div className="flex items-center gap-3 text-sm text-slate-600">
                        <Clock size={18} className="text-slate-400" />
                        <span>Durasi: <strong>{exam.duration} Menit</strong></span>
                      </div>
                      <div className="flex items-center gap-3 text-sm text-slate-600">
                        <FileText size={18} className="text-slate-400" />
                        <span>Tipe: <strong>Pilihan Ganda</strong></span>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 pt-0 mt-auto">
                     {result ? (
                       <button
                         disabled
                         className="w-full py-3 px-6 bg-slate-100 text-slate-400 rounded-xl font-bold flex items-center justify-center gap-2 border border-slate-200 cursor-not-allowed"
                       >
                         <CheckCircle2 size={20} /> Ujian Sudah Dilakukan
                       </button>
                     ) : (
                       <button
                         onClick={() => startExam(exam._id)}
                         disabled={applicant?.paymentStatus !== 'verified'}
                         className="w-full py-3 px-6 bg-primary-600 hover:bg-primary-700 disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-xl font-bold shadow-lg shadow-primary-200 transition-all flex items-center justify-center gap-2 group"
                       >
                         Mulai Ujian <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                       </button>
                     )}
                   </div>
                </div>
              );
            })}
          </div>

          {examResults.length === exams.length && exams.length > 0 && (
            <div className="p-8 rounded-3xl border text-center bg-blue-600 text-white shadow-lg shadow-blue-200">
              <h2 className="text-2xl font-bold">Ujian Selesai</h2>
              <p className="mt-2 text-lg opacity-90">
                Terima kasih telah menyelesaikan seluruh rangkaian ujian seleksi.
              </p>
              <p className="mt-4 text-sm opacity-80 max-w-xl mx-auto">
                Data jawaban Anda telah kami simpan. Tim seleksi akan melakukan peninjauan terhadap hasil ujian Anda. 
                Silakan cek dashboard secara berkala untuk melihat pengumuman hasil seleksi akhir yang akan diputuskan oleh admin.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Exam;

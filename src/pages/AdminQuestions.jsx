import { useState, useEffect } from 'react';
import api from '../api/axios';
import { 
  Plus, 
  Trash2, 
  Edit, 
  Loader2,
  X,
  Search,
  BookOpen,
  HelpCircle,
  ChevronRight,
  ArrowLeft
} from 'lucide-react';

const AdminQuestions = () => {
  const [loading, setLoading] = useState(true);
  const [exams, setExams] = useState([]);
  const [selectedExam, setSelectedExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [newQuestion, setNewQuestion] = useState({
    question: '',
    options: ['', '', '', ''],
    correctAnswer: 0
  });

  useEffect(() => {
    fetchExams();
  }, []);

  const fetchExams = async () => {
    try {
      const res = await api.get('/exams');
      setExams(res.data.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const fetchQuestions = async (examId) => {
    setLoading(true);
    try {
      const res = await api.get(`/questions/${examId}`);
      setQuestions(res.data.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleSelectExam = (exam) => {
    setSelectedExam(exam);
    fetchQuestions(exam._id);
  };

  const handleSaveQuestion = async (e) => {
    e.preventDefault();
    try {
      if (editingQuestion) {
        await api.put(`/questions/${editingQuestion._id}`, newQuestion);
        alert('Soal berhasil diperbarui!');
      } else {
        await api.post('/questions', { ...newQuestion, examId: selectedExam._id });
        alert('Soal berhasil ditambahkan!');
      }
      setShowQuestionModal(false);
      fetchQuestions(selectedExam._id);
    } catch (err) {
      alert('Gagal menyimpan soal');
    }
  };

  const handleDeleteQuestion = async (id) => {
    if (!confirm('Yakin ingin menghapus soal ini?')) return;
    try {
      await api.delete(`/questions/${id}`);
      fetchQuestions(selectedExam._id);
    } catch (err) {
      alert('Gagal menghapus soal');
    }
  };

  if (loading && !selectedExam) return <div className="flex justify-center p-12"><Loader2 className="animate-spin text-primary-600" size={40} /></div>;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {!selectedExam ? (
        <>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">Kelola Soal</h1>
            <p className="text-slate-500">Pilih mata ujian untuk mengelola soal-soalnya</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {exams.map((exam) => (
              <button
                key={exam._id}
                onClick={() => handleSelectExam(exam)}
                className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-xl hover:border-primary-200 transition-all text-left group"
              >
                <div className="w-12 h-12 bg-primary-50 text-primary-600 rounded-2xl flex items-center justify-center mb-4 group-hover:bg-primary-600 group-hover:text-white transition-all">
                  <BookOpen size={24} />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-1">{exam.title}</h3>
                <p className="text-sm text-slate-500 mb-4">{exam.category}</p>
                <div className="flex items-center justify-between text-primary-600 font-bold text-sm">
                  <span>Kelola Soal</span>
                  <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </button>
            ))}
          </div>
        </>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setSelectedExam(null)}
                className="p-2 hover:bg-slate-100 rounded-xl text-slate-600 transition-all"
              >
                <ArrowLeft size={24} />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-slate-900">Kelola Soal: {selectedExam.title}</h1>
                <p className="text-slate-500">{selectedExam.category}</p>
              </div>
            </div>
            <button 
              onClick={() => {
                setEditingQuestion(null);
                setNewQuestion({ question: '', options: ['', '', '', ''], correctAnswer: 0 });
                setShowQuestionModal(true);
              }}
              className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-primary-200 transition-all"
            >
              <Plus size={20} /> Tambah Soal
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center p-12"><Loader2 className="animate-spin text-primary-600" size={40} /></div>
          ) : (
            <div className="space-y-4">
              {questions.length === 0 ? (
                <div className="bg-white p-12 text-center rounded-3xl border border-dashed border-slate-200 text-slate-400">
                  <HelpCircle className="mx-auto mb-4 opacity-20" size={48} />
                  <p>Belum ada soal untuk ujian ini</p>
                </div>
              ) : (
                questions.map((q, idx) => (
                  <div key={q._id} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all">
                    <div className="flex justify-between items-start gap-4">
                      <div className="flex-1 space-y-4">
                        <div className="flex items-start gap-3">
                          <span className="w-8 h-8 bg-slate-100 rounded-lg flex items-center justify-center font-bold text-slate-500 shrink-0">
                            {idx + 1}
                          </span>
                          <p className="text-lg font-medium text-slate-800 pt-1 leading-relaxed">{q.question}</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pl-11">
                          {q.options.map((opt, i) => (
                            <div key={i} className={`p-3 rounded-xl border text-sm ${i === q.correctAnswer ? 'bg-green-50 border-green-200 text-green-700 font-bold' : 'bg-slate-50 border-slate-100 text-slate-600'}`}>
                              {String.fromCharCode(65 + i)}. {opt}
                            </div>
                          ))}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => {
                            setEditingQuestion(q);
                            setNewQuestion({ question: q.question, options: [...q.options], correctAnswer: q.correctAnswer });
                            setShowQuestionModal(true);
                          }}
                          className="p-2 text-slate-400 hover:bg-slate-100 rounded-lg transition-all"
                        >
                          <Edit size={18} />
                        </button>
                        <button 
                          onClick={() => handleDeleteQuestion(q._id)}
                          className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </>
      )}

      {/* Question Modal */}
      {showQuestionModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-800">{editingQuestion ? 'Edit Soal' : 'Tambah Soal Baru'}</h2>
              <button onClick={() => setShowQuestionModal(false)} className="text-slate-400 hover:text-slate-600 p-2 hover:bg-slate-50 rounded-full transition-all">
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSaveQuestion} className="p-8 space-y-6 max-h-[80vh] overflow-y-auto">
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Pertanyaan</label>
                <textarea
                  required
                  rows="3"
                  value={newQuestion.question}
                  onChange={(e) => setNewQuestion({...newQuestion, question: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                  placeholder="Tuliskan pertanyaan di sini..."
                />
              </div>

              <div className="space-y-4">
                <label className="text-sm font-bold text-slate-700">Pilihan Jawaban (Beri centang pada jawaban yang benar)</label>
                <div className="space-y-3">
                  {newQuestion.options.map((opt, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <input 
                        type="radio" 
                        name="correctAnswer"
                        checked={newQuestion.correctAnswer === i}
                        onChange={() => setNewQuestion({...newQuestion, correctAnswer: i})}
                        className="w-5 h-5 text-primary-600 focus:ring-primary-500"
                      />
                      <span className="w-8 font-bold text-slate-400">{String.fromCharCode(65 + i)}</span>
                      <input
                        type="text"
                        required
                        value={opt}
                        onChange={(e) => {
                          const newOpts = [...newQuestion.options];
                          newOpts[i] = e.target.value;
                          setNewQuestion({...newQuestion, options: newOpts});
                        }}
                        className="flex-1 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none"
                        placeholder={`Pilihan ${String.fromCharCode(65 + i)}`}
                      />
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4">
                <button
                  type="submit"
                  className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-primary-200 transition-all"
                >
                  {editingQuestion ? 'Simpan Perubahan' : 'Tambah Soal'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminQuestions;

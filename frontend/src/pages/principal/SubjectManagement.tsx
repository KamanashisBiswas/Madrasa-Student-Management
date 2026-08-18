import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { Subject, SubjectAssignment, ClassItem, Teacher } from '../../types';
import { Plus, BookOpen, X, Trash2 } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const SubjectManagement: React.FC = () => {
  const { t, language } = useLanguage();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [assignments, setAssignments] = useState<SubjectAssignment[]>([]);
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);

  const [showSubjectModal, setShowSubjectModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);

  const [name, setName] = useState('');
  const [code, setCode] = useState('');

  const [selectedClassId, setSelectedClassId] = useState('');
  const [selectedSubjectId, setSelectedSubjectId] = useState('');
  const [selectedTeacherId, setSelectedTeacherId] = useState('');

  const loadData = () => {
    setLoading(true);
    Promise.all([
      api.get('/subjects'),
      api.get('/subjects/assignments'),
      api.get('/classes'),
      api.get('/teachers'),
    ])
      .then(([sRes, aRes, cRes, tRes]: any) => {
        setSubjects(sRes.data);
        setAssignments(aRes.data);
        setClasses(cRes.data);
        setTeachers(tRes.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/subjects', { name, code });
      setShowSubjectModal(false);
      setName('');
      setCode('');
      loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to create subject');
    }
  };

  const handleAssignSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/subjects/assignments', {
        classId: selectedClassId,
        subjectId: selectedSubjectId,
        teacherId: selectedTeacherId,
      });
      setShowAssignModal(false);
      loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to assign Subject Teacher');
    }
  };

  const handleDeleteSubject = async (subjectId: string, subName: string) => {
    if (window.confirm(language === 'bn' ? `আপনি কি নিশ্চিত যে "${subName}" বিষয় ডিলিট করতে চান?` : `Are you sure you want to delete "${subName}"?`)) {
      try {
        await api.delete(`/subjects/${subjectId}`);
        loadData();
      } catch (err: any) {
        alert(err.message || 'Failed to delete subject');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{t('subjectManagement')}</h1>
          <p className="text-xs text-slate-500 font-medium">
            {language === 'bn' ? 'মাদ্রাসার বিষয় ও বিষয় শিক্ষক নির্ধারণ করুন' : 'Manage Academic Subjects and Assign Subject Teachers'}
          </p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setShowSubjectModal(true)}
            className="inline-flex items-center space-x-2 bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold px-3.5 py-2.5 rounded-lg shadow transition"
          >
            <Plus className="w-4 h-4" />
            <span>{t('createSubject')}</span>
          </button>
          <button
            onClick={() => setShowAssignModal(true)}
            className="inline-flex items-center space-x-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-3.5 py-2.5 rounded-lg shadow transition"
          >
            <Plus className="w-4 h-4" />
            <span>{t('assignSubjectTeacher')}</span>
          </button>
        </div>
      </div>

      {/* Subjects & Assignments Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* All Subjects List */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-800 text-sm">
            {language === 'bn' ? 'সকল বিষয়ের তালিকা' : 'Master Subjects Directory'}
          </h3>
          <div className="divide-y divide-slate-100">
            {subjects.map((sub) => (
              <div key={sub._id} className="py-2.5 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <BookOpen className="w-4 h-4 text-emerald-600" />
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs">{sub.name}</h4>
                    <span className="text-[10px] text-slate-400 font-mono">Code: {sub.code}</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {sub.status}
                  </span>
                  <button
                    onClick={() => handleDeleteSubject(sub._id, sub.name)}
                    className="p-1 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded"
                    title="Delete Subject"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Current Subject Teacher Assignments */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-800 text-sm">
            {language === 'bn' ? 'বিষয় শিক্ষক ম্যাট্রিক্স' : 'Subject Teacher Assignment Matrix'}
          </h3>
          <div className="divide-y divide-slate-100">
            {assignments.length === 0 ? (
              <p className="text-xs text-slate-400 py-4 text-center">No subject assignments created yet.</p>
            ) : (
              assignments.map((ass) => (
                <div key={ass._id} className="py-2.5 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-slate-900">{ass.subjectId?.name}</span>
                    <p className="text-[11px] text-slate-500">{ass.classId?.name}</p>
                  </div>
                  <div className="text-right">
                    <span className="font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 text-[11px]">
                      {ass.teacherId?.fullName}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Create Subject Modal */}
      {showSubjectModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-900">{t('createSubject')}</h3>
              <button onClick={() => setShowSubjectModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateSubject} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Subject Name</label>
                <input required value={name} onChange={(e) => setName(e.target.value)} className="w-full text-sm p-2 border rounded-lg" placeholder="Mathematics" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Subject Code</label>
                <input required value={code} onChange={(e) => setCode(e.target.value)} className="w-full text-sm p-2 border rounded-lg" placeholder="MATH-101" />
              </div>
              <div className="pt-2 flex justify-end space-x-2">
                <button type="button" onClick={() => setShowSubjectModal(false)} className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 rounded-lg">{t('cancel')}</button>
                <button type="submit" className="px-4 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg">{t('save')}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Assign Subject Teacher Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-900">{t('assignSubjectTeacher')}</h3>
              <button onClick={() => setShowAssignModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAssignSubject} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Class</label>
                <select
                  required
                  value={selectedClassId}
                  onChange={(e) => setSelectedClassId(e.target.value)}
                  className="w-full text-sm p-2 border rounded-lg bg-white"
                >
                  <option value="">-- Select Class --</option>
                  {classes.map((c) => (
                    <option key={c._id} value={c._id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Subject</label>
                <select
                  required
                  value={selectedSubjectId}
                  onChange={(e) => setSelectedSubjectId(e.target.value)}
                  className="w-full text-sm p-2 border rounded-lg bg-white"
                >
                  <option value="">-- Select Subject --</option>
                  {subjects.map((sub) => (
                    <option key={sub._id} value={sub._id}>{sub.name} ({sub.code})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Assigned Teacher</label>
                <select
                  required
                  value={selectedTeacherId}
                  onChange={(e) => setSelectedTeacherId(e.target.value)}
                  className="w-full text-sm p-2 border rounded-lg bg-white"
                >
                  <option value="">-- Select Teacher --</option>
                  {teachers.map((t) => (
                    <option key={t._id} value={t._id}>{t.fullName} ({t.teacherId})</option>
                  ))}
                </select>
              </div>

              <div className="pt-2 flex justify-end space-x-2">
                <button type="button" onClick={() => setShowAssignModal(false)} className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 rounded-lg">{t('cancel')}</button>
                <button type="submit" className="px-4 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg">{t('save')}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

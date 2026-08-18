import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { Teacher } from '../../types';
import { Plus, CheckCircle, XCircle, X } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const TeacherManagement: React.FC = () => {
  const { t, language } = useLanguage();
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('teacher123');
  const [designation, setDesignation] = useState('Assistant Teacher');
  const [qualification, setQualification] = useState('');

  const loadTeachers = () => {
    setLoading(true);
    api.get('/teachers')
      .then((res: any) => setTeachers(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadTeachers();
  }, []);

  const handleCreateTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/teachers', {
        fullName,
        email,
        mobile,
        password,
        designation,
        qualification,
      });
      setShowModal(false);
      setFullName('');
      setEmail('');
      setMobile('');
      loadTeachers();
    } catch (err: any) {
      alert(err.message || 'Failed to create teacher');
    }
  };

  const toggleStatus = async (teacherId: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
    try {
      await api.patch(`/teachers/${teacherId}/status`, { status: nextStatus });
      loadTeachers();
    } catch (err: any) {
      alert(err.message || 'Failed to update status');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{t('teacherManagement')}</h1>
          <p className="text-xs text-slate-500 font-medium">
            {language === 'bn' ? 'মাদ্রাসার সকল শিক্ষক একাউন্ট ও দায়িত্বসমূহ পরিচালনা করুন' : 'Manage Faculty Accounts, Roles & Statuses'}
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center space-x-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-4 py-2.5 rounded-lg shadow transition"
        >
          <Plus className="w-4 h-4" />
          <span>{t('addTeacher')}</span>
        </button>
      </div>

      {/* Teachers Directory Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-400">Loading teacher directory...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-semibold">
                  <th className="py-3 px-4">{t('teacherId')}</th>
                  <th className="py-3 px-4">{t('fullName')}</th>
                  <th className="py-3 px-4">{t('designation')}</th>
                  <th className="py-3 px-4">{t('classTeacher')}</th>
                  <th className="py-3 px-4">{t('mobile')}</th>
                  <th className="py-3 px-4">{t('status')}</th>
                  <th className="py-3 px-4">{t('actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {teachers.map((tItem) => (
                  <tr key={tItem._id} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-mono font-bold text-emerald-800">{tItem.teacherId}</td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900">{tItem.fullName}</div>
                      <div className="text-[10px] text-slate-400 font-mono">{tItem.email}</div>
                    </td>
                    <td className="py-3 px-4 text-slate-700 font-medium">{tItem.designation || 'Teacher'}</td>
                    <td className="py-3 px-4">
                      {tItem.classTeacherClasses && tItem.classTeacherClasses.length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {tItem.classTeacherClasses.map((c: any) => (
                            <span key={c._id} className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-1.5 py-0.5 rounded">
                              {c.name}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-slate-400 text-[10px]">None</span>
                      )}
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-600">{tItem.mobile}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        tItem.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {tItem.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <button
                        onClick={() => toggleStatus(tItem._id, tItem.status)}
                        className={`text-xs font-semibold px-2 py-1 rounded border transition ${
                          tItem.status === 'ACTIVE'
                            ? 'bg-rose-50 text-rose-700 border-rose-200 hover:bg-rose-100'
                            : 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100'
                        }`}
                      >
                        {tItem.status === 'ACTIVE' ? t('deactivate') : t('activate')}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Teacher Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-900">{t('addTeacher')}</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateTeacher} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name</label>
                <input required value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full text-sm p-2 border rounded-lg" placeholder="Abdullah Sir" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Email (Login ID)</label>
                <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full text-sm p-2 border rounded-lg" placeholder="teacher@madrasah.edu" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Mobile Number</label>
                <input required value={mobile} onChange={(e) => setMobile(e.target.value)} className="w-full text-sm p-2 border rounded-lg" placeholder="01711111111" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Password</label>
                <input required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full text-sm p-2 border rounded-lg" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Designation</label>
                <input value={designation} onChange={(e) => setDesignation(e.target.value)} className="w-full text-sm p-2 border rounded-lg" placeholder="Senior Hadith Teacher" />
              </div>
              <div className="pt-2 flex justify-end space-x-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 rounded-lg">{t('cancel')}</button>
                <button type="submit" className="px-4 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg">{t('save')}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { ClassItem } from '../../types';
import { Plus, Search, Eye, Trash2 } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const StudentManagement: React.FC = () => {
  const { t, language } = useLanguage();
  const [students, setStudents] = useState<any[]>([]);
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [selectedClassId, setSelectedClassId] = useState('');

  const [showModal, setShowModal] = useState(false);

  // New Student Registration Form State
  const [fullName, setFullName] = useState('');
  const [bengaliName, setBengaliName] = useState('');
  const [gender, setGender] = useState('MALE');
  const [classId, setClassId] = useState('');
  const [rollNumber, setRollNumber] = useState(1);
  const [guardianName, setGuardianName] = useState('');
  const [guardianRelationship, setGuardianRelationship] = useState('FATHER');
  const [guardianMobile, setGuardianMobile] = useState('');

  const loadData = () => {
    setLoading(true);
    const params: any = {};
    if (search) params.search = search;
    if (selectedClassId) params.classId = selectedClassId;

    Promise.all([api.get('/students', { params }), api.get('/classes')])
      .then(([sRes, cRes]: any) => {
        setStudents(sRes.data);
        setClasses(cRes.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, [search, selectedClassId]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/students', {
        fullName,
        bengaliName,
        gender,
        classId,
        rollNumber: Number(rollNumber),
        guardianName,
        guardianRelationship,
        guardianMobile,
      });
      setShowModal(false);
      setFullName('');
      setBengaliName('');
      setGuardianName('');
      setGuardianMobile('');
      loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to register student');
    }
  };

  const handleDeleteStudent = async (studentId: string, name: string) => {
    if (window.confirm(language === 'bn' ? `আপনি কি নিশ্চিত যে ছাত্র "${name}" এর রেকর্ড ডিলিট করতে চান?` : `Are you sure you want to delete student "${name}"?`)) {
      try {
        await api.delete(`/students/${studentId}`);
        loadData();
      } catch (err: any) {
        alert(err.message || 'Failed to delete student');
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{t('studentDirectory')}</h1>
          <p className="text-xs text-slate-500 font-medium">
            {language === 'bn' ? 'ছাত্র ভর্তি, প্রোফাইল দেখুন বা রেকর্ড ডিলিট করুন' : 'Register, Search, View Profiles & Manage Student Records'}
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center space-x-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-4 py-2.5 rounded-lg shadow transition"
        >
          <Plus className="w-4 h-4" />
          <span>{t('registerStudent')}</span>
        </button>
      </div>

      {/* Filter & Search Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center gap-4 justify-between">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={language === 'bn' ? 'নাম, আইডি বা রোল খুঁজুন...' : 'Search name, student ID, roll...'}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <select
            value={selectedClassId}
            onChange={(e) => setSelectedClassId(e.target.value)}
            className="text-xs p-2 border border-slate-300 rounded-lg bg-white"
          >
            <option value="">-- All Classes --</option>
            {classes.map((c) => (
              <option key={c._id} value={c._id}>{c.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Student List Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-400">Loading student directory...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-semibold">
                  <th className="py-3 px-4">{t('roll')}</th>
                  <th className="py-3 px-4">{t('studentId')}</th>
                  <th className="py-3 px-4">{t('fullName')}</th>
                  <th className="py-3 px-4">{t('classes')}</th>
                  <th className="py-3 px-4">{t('primaryGuardian')}</th>
                  <th className="py-3 px-4">{t('guardianMobile')}</th>
                  <th className="py-3 px-4">{t('status')}</th>
                  <th className="py-3 px-4">{t('actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {students.map((item: any) => {
                  const std = item.student;
                  return (
                    <tr key={item.enrollmentId} className="hover:bg-slate-50">
                      <td className="py-3 px-4 font-bold text-slate-900">{item.rollNumber}</td>
                      <td className="py-3 px-4 font-mono font-bold text-emerald-800">{std?.studentId}</td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-900">{std?.fullName}</div>
                        {std?.bengaliName && <div className="text-[10px] text-slate-500">{std.bengaliName}</div>}
                      </td>
                      <td className="py-3 px-4 font-medium text-slate-700">
                        {item.class?.name}
                      </td>
                      <td className="py-3 px-4 text-slate-600">{item.primaryGuardian?.fullName || 'N/A'}</td>
                      <td className="py-3 px-4 text-slate-600 font-mono">{item.primaryGuardian?.mobile || 'N/A'}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          {std?.status}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-3">
                          <Link
                            to={`/principal/students/${std?._id}`}
                            className="inline-flex items-center space-x-1 font-semibold text-emerald-700 hover:text-emerald-900 hover:underline"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>{t('viewProfile')}</span>
                          </Link>
                          <button
                            onClick={() => handleDeleteStudent(std?._id, std?.fullName)}
                            className="p-1 text-rose-500 hover:text-rose-700 hover:bg-rose-50 rounded"
                            title="Delete Student Record"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Registration Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <h3 className="font-bold text-base text-slate-900 border-b border-slate-100 pb-2">{t('registerStudent')}</h3>
            <form onSubmit={handleRegister} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Full Name (English)</label>
                  <input required value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full text-sm p-2 border rounded-lg" placeholder="Hasan Al-Mahmud" />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Bengali Name</label>
                  <input value={bengaliName} onChange={(e) => setBengaliName(e.target.value)} className="w-full text-sm p-2 border rounded-lg" placeholder="হাসান আল-মাহমুদ" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Class</label>
                  <select
                    required
                    value={classId}
                    onChange={(e) => setClassId(e.target.value)}
                    className="w-full text-sm p-2 border rounded-lg bg-white"
                  >
                    <option value="">Select Class</option>
                    {classes.map((c) => (
                      <option key={c._id} value={c._id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Roll No</label>
                  <input required type="number" value={rollNumber} onChange={(e) => setRollNumber(Number(e.target.value))} className="w-full text-sm p-2 border rounded-lg" />
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <h4 className="font-bold text-xs text-slate-800 mb-2">Guardian Details (Target for Absent SMS)</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 mb-1">Guardian Name</label>
                    <input required value={guardianName} onChange={(e) => setGuardianName(e.target.value)} className="w-full text-sm p-2 border rounded-lg" placeholder="Md. Rafiqul Islam" />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Relationship</label>
                      <select value={guardianRelationship} onChange={(e) => setGuardianRelationship(e.target.value)} className="w-full text-sm p-2 border rounded-lg bg-white">
                        <option value="FATHER">Father</option>
                        <option value="MOTHER">Mother</option>
                        <option value="GUARDIAN">Guardian</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700 mb-1">Guardian Mobile</label>
                      <input required value={guardianMobile} onChange={(e) => setGuardianMobile(e.target.value)} className="w-full text-sm p-2 border rounded-lg" placeholder="01811111111" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-3 flex justify-end space-x-2">
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

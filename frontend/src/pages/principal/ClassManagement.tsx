import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { ClassItem, Teacher } from '../../types';
import { Plus, GraduationCap, UserCheck, X } from 'lucide-react';

export const ClassManagement: React.FC = () => {
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);

  const [showClassModal, setShowClassModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);

  const [className, setClassName] = useState('');
  const [classCode, setClassCode] = useState('');

  const [selectedSectionId, setSelectedSectionId] = useState('');
  const [selectedTeacherId, setSelectedTeacherId] = useState('');

  const loadData = () => {
    setLoading(true);
    Promise.all([api.get('/classes'), api.get('/teachers')])
      .then(([cRes, tRes]: any) => {
        setClasses(cRes.data);
        setTeachers(tRes.data);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateClass = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const created: any = await api.post('/classes', { name: className, code: classCode });
      // Create Section A by default
      await api.post('/classes/sections', {
        classId: created.data._id,
        name: 'Section A',
      });
      setShowClassModal(false);
      setClassName('');
      setClassCode('');
      loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to create class');
    }
  };

  const handleAssignClassTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.put(`/classes/sections/${selectedSectionId}/class-teacher`, {
        classTeacherId: selectedTeacherId,
      });
      setShowAssignModal(false);
      loadData();
    } catch (err: any) {
      alert(err.message || 'Failed to assign Class Teacher');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Class & Section Management</h1>
          <p className="text-xs text-slate-500 font-medium">Define Classes and Assign Class Teachers</p>
        </div>
        <button
          onClick={() => setShowClassModal(true)}
          className="inline-flex items-center space-x-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-4 py-2.5 rounded-lg shadow transition"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Class</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {classes.map((cls) => (
          <div key={cls._id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">{cls.name}</h3>
                  <span className="text-xs text-slate-500 font-mono">Code: {cls.code}</span>
                </div>
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                Active
              </span>
            </div>

            <div className="space-y-2 border-t border-b border-slate-100 py-3 text-xs">
              <h4 className="font-bold text-slate-700 uppercase tracking-wider text-[10px]">Sections & Class Teachers</h4>
              {cls.sections?.map((sec: any) => (
                <div key={sec._id} className="flex items-center justify-between bg-slate-50 p-2 rounded border border-slate-200">
                  <div>
                    <span className="font-bold text-slate-900">{sec.name}</span>
                    <p className="text-[11px] text-emerald-700 font-medium mt-0.5">
                      Teacher: {sec.classTeacherId ? sec.classTeacherId.fullName : 'Not Assigned'}
                    </p>
                  </div>
                  <button
                    onClick={() => {
                      setSelectedSectionId(sec._id);
                      setSelectedTeacherId(sec.classTeacherId?._id || '');
                      setShowAssignModal(true);
                    }}
                    className="text-[10px] font-semibold text-emerald-800 hover:underline"
                  >
                    Change Teacher
                  </button>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
              <span>Enrolled Students:</span>
              <span className="font-bold text-slate-900">{cls.studentCount || 0}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Create Class Modal */}
      {showClassModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-900">Create New Class</h3>
              <button onClick={() => setShowClassModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateClass} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Class Name</label>
                <input required value={className} onChange={(e) => setClassName(e.target.value)} className="w-full text-sm p-2 border rounded-lg" placeholder="Class 6" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Class Code</label>
                <input required value={classCode} onChange={(e) => setClassCode(e.target.value)} className="w-full text-sm p-2 border rounded-lg" placeholder="C6" />
              </div>
              <div className="pt-2 flex justify-end space-x-2">
                <button type="button" onClick={() => setShowClassModal(false)} className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 rounded-lg">Cancel</button>
                <button type="submit" className="px-4 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg">Create Class</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Assign Class Teacher Modal */}
      {showAssignModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-900">Assign Class Teacher</h3>
              <button onClick={() => setShowAssignModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAssignClassTeacher} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Select Teacher</label>
                <select
                  value={selectedTeacherId}
                  onChange={(e) => setSelectedTeacherId(e.target.value)}
                  className="w-full text-sm p-2 border rounded-lg bg-white"
                >
                  <option value="">-- No Teacher / Unassign --</option>
                  {teachers.map((t) => (
                    <option key={t._id} value={t._id}>
                      {t.fullName} ({t.teacherId})
                    </option>
                  ))}
                </select>
              </div>
              <div className="pt-2 flex justify-end space-x-2">
                <button type="button" onClick={() => setShowAssignModal(false)} className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 rounded-lg">Cancel</button>
                <button type="submit" className="px-4 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg">Save Assignment</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

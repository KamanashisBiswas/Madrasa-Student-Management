import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { api } from '../../services/api';
import { ClassItem, StudentRosterItem } from '../../types';
import { Calendar, CheckCircle2, XCircle, RefreshCw, Send, AlertTriangle, Check, X } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const TakeAttendancePage: React.FC = () => {
  const { t } = useLanguage();
  const [searchParams] = useSearchParams();

  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [selectedClassId, setSelectedClassId] = useState(searchParams.get('classId') || '');
  const [selectedSectionId, setSelectedSectionId] = useState(searchParams.get('sectionId') || '');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const [roster, setRoster] = useState<StudentRosterItem[]>([]);
  const [attendanceState, setAttendanceState] = useState<Record<string, 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED'>>({});
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [showConfirmModal, setShowConfirmModal] = useState(false);

  useEffect(() => {
    api.get('/classes').then((res: any) => {
      setClasses(res.data);
      if (!selectedClassId && res.data.length > 0) {
        setSelectedClassId(res.data[0]._id);
        if (res.data[0].sections?.length > 0) {
          setSelectedSectionId(res.data[0].sections[0]._id);
        }
      }
    });
  }, []);

  const selectedClassObj = classes.find((c) => c._id === selectedClassId);

  useEffect(() => {
    if (selectedClassId && selectedClassObj?.sections?.length && !selectedSectionId) {
      setSelectedSectionId(selectedClassObj.sections[0]._id);
    }
  }, [selectedClassId, selectedClassObj]);

  const fetchRoster = () => {
    if (!selectedClassId || !selectedSectionId) return;
    setLoading(true);
    api.get('/attendance/roster', {
      params: { classId: selectedClassId, sectionId: selectedSectionId, date },
    })
      .then((res: any) => {
        const students: StudentRosterItem[] = res.data.students || [];
        setRoster(students);

        const initial: Record<string, 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED'> = {};
        students.forEach((s) => {
          initial[s.studentId] = s.currentStatus || 'PRESENT';
        });
        setAttendanceState(initial);
      })
      .catch((err: any) => {
        alert(err.message || 'Failed to fetch class roster');
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchRoster();
  }, [selectedClassId, selectedSectionId, date]);

  const handleStatusToggle = (studentId: string, status: 'PRESENT' | 'ABSENT') => {
    setAttendanceState((prev) => ({ ...prev, [studentId]: status }));
  };

  const markAllPresent = () => {
    const updated: Record<string, 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED'> = {};
    roster.forEach((s) => {
      updated[s.studentId] = 'PRESENT';
    });
    setAttendanceState(updated);
  };

  const markAllAbsent = () => {
    const updated: Record<string, 'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED'> = {};
    roster.forEach((s) => {
      updated[s.studentId] = 'ABSENT';
    });
    setAttendanceState(updated);
  };

  const handleSubmitAttendance = async () => {
    setSubmitting(true);
    try {
      const payload = {
        classId: selectedClassId,
        sectionId: selectedSectionId,
        date,
        attendance: roster.map((s) => ({
          studentId: s.studentId,
          status: attendanceState[s.studentId] || 'PRESENT',
        })),
      };

      await api.post('/attendance/submit', payload);
      setShowConfirmModal(false);
      alert('Attendance submitted successfully! Absent SMS queued to guardians.');
      fetchRoster();
    } catch (err: any) {
      alert(err.message || 'Attendance submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  const presentCount = roster.filter((s) => (attendanceState[s.studentId] || 'PRESENT') === 'PRESENT').length;
  const absentCount = roster.filter((s) => attendanceState[s.studentId] === 'ABSENT').length;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Rapid Class Attendance Entry</h1>
          <p className="text-xs text-slate-500 font-medium">Select Class, Section & Mark Attendance for Students</p>
        </div>
      </div>

      {/* Selector Toolbar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Select Class</label>
          <select
            value={selectedClassId}
            onChange={(e) => {
              setSelectedClassId(e.target.value);
              setSelectedSectionId('');
            }}
            className="w-full text-xs p-2 border rounded-lg bg-white font-semibold text-slate-800"
          >
            {classes.map((c) => (
              <option key={c._id} value={c._id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Select Section</label>
          <select
            value={selectedSectionId}
            onChange={(e) => setSelectedSectionId(e.target.value)}
            className="w-full text-xs p-2 border rounded-lg bg-white font-semibold text-slate-800"
          >
            {selectedClassObj?.sections?.map((sec: any) => (
              <option key={sec._id} value={sec._id}>{sec.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Date</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full text-xs p-2 border rounded-lg bg-white font-semibold text-slate-800"
          />
        </div>
      </div>

      {/* Batch Control Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-200/60 p-3 rounded-xl border border-slate-300">
        <div className="flex items-center space-x-2">
          <button
            type="button"
            onClick={markAllPresent}
            className="bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs px-3 py-1.5 rounded-lg shadow transition flex items-center space-x-1"
          >
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Mark All Present</span>
          </button>
          <button
            type="button"
            onClick={markAllAbsent}
            className="bg-rose-700 hover:bg-rose-800 text-white font-semibold text-xs px-3 py-1.5 rounded-lg shadow transition flex items-center space-x-1"
          >
            <XCircle className="w-3.5 h-3.5" />
            <span>Mark All Absent</span>
          </button>
        </div>

        <div className="flex items-center space-x-3 text-xs font-bold text-slate-700">
          <span>Present: <span className="text-emerald-700">{presentCount}</span></span>
          <span>Absent: <span className="text-rose-700">{absentCount}</span></span>
          <span>Total: <span className="text-slate-900">{roster.length}</span></span>
        </div>
      </div>

      {/* Roster Cards / Table Mobile Optimized */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-400">Loading student roster...</div>
        ) : roster.length === 0 ? (
          <div className="p-8 text-center text-slate-400">No active students found in this class section.</div>
        ) : (
          <div className="divide-y divide-slate-100">
            {roster.map((student) => {
              const current = attendanceState[student.studentId] || 'PRESENT';
              return (
                <div
                  key={student.studentId}
                  className={`p-3 sm:p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 transition ${
                    current === 'ABSENT' ? 'bg-rose-50/50' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-800 flex items-center justify-center font-bold text-xs">
                      {String(student.rollNumber).padStart(2, '0')}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-sm">{student.studentName}</h4>
                      {student.bengaliName && (
                        <p className="text-xs text-slate-500">{student.bengaliName}</p>
                      )}
                      <span className="text-[10px] text-slate-400 font-mono">ID: {student.studentIdCode}</span>
                    </div>
                  </div>

                  {/* Toggle Controls */}
                  <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
                    <button
                      type="button"
                      onClick={() => handleStatusToggle(student.studentId, 'PRESENT')}
                      className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-bold transition flex items-center justify-center space-x-1 border ${
                        current === 'PRESENT'
                          ? 'bg-emerald-600 text-white border-emerald-700 shadow'
                          : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-emerald-50'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Present</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleStatusToggle(student.studentId, 'ABSENT')}
                      className={`flex-1 sm:flex-none px-4 py-2 rounded-lg text-xs font-bold transition flex items-center justify-center space-x-1 border ${
                        current === 'ABSENT'
                          ? 'bg-rose-600 text-white border-rose-700 shadow'
                          : 'bg-slate-100 text-slate-600 border-slate-200 hover:bg-rose-50'
                      }`}
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Absent</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Sticky Bottom Action Submit Bar */}
      {roster.length > 0 && (
        <div className="sticky bottom-4 bg-slate-900 text-white p-4 rounded-xl shadow-2xl flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-300">Ready to save daily attendance record?</p>
            <p className="text-xs font-bold text-amber-400">
              Present: {presentCount} | Absent: {absentCount}
            </p>
          </div>
          <button
            type="button"
            onClick={() => setShowConfirmModal(true)}
            className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-bold text-xs px-6 py-2.5 rounded-lg transition shadow-lg flex items-center space-x-2"
          >
            <Send className="w-4 h-4" />
            <span>Submit Attendance</span>
          </button>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-900">Attendance Submission Summary</h3>
              <button onClick={() => setShowConfirmModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-500">Date:</span>
                <span className="font-bold text-slate-900 font-mono">{date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Total Students:</span>
                <span className="font-bold text-slate-900">{roster.length}</span>
              </div>
              <div className="flex justify-between text-emerald-700">
                <span className="font-medium">Total Present:</span>
                <span className="font-bold">{presentCount}</span>
              </div>
              <div className="flex justify-between text-rose-700">
                <span className="font-medium">Total Absent:</span>
                <span className="font-bold">{absentCount}</span>
              </div>
            </div>

            {absentCount > 0 && (
              <div className="bg-amber-50 border border-amber-200 p-3 rounded-lg text-xs text-amber-800 flex items-start space-x-2">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  System will automatically queue Bengali Absent SMS to {absentCount} primary guardian(s).
                </span>
              </div>
            )}

            <div className="flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setShowConfirmModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={submitting}
                onClick={handleSubmitAttendance}
                className="px-5 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow"
              >
                {submitting ? 'Submitting...' : 'Confirm & Submit'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

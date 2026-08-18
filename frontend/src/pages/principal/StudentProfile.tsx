import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { api } from '../../services/api';
import { UserCheck, Phone, CalendarCheck, Edit, ShieldAlert, Check, X } from 'lucide-react';

export const StudentProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const [overrideModal, setOverrideModal] = useState<any>(null);
  const [newStatus, setNewStatus] = useState<'PRESENT' | 'ABSENT' | 'LATE' | 'EXCUSED'>('PRESENT');
  const [reason, setReason] = useState('');

  const fetchProfile = () => {
    setLoading(true);
    api.get(`/students/${id}`)
      .then((res: any) => setData(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchProfile();
  }, [id]);

  const handleOverride = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.put('/attendance/override', {
        attendanceId: overrideModal._id,
        newStatus,
        reason,
      });
      setOverrideModal(null);
      setReason('');
      fetchProfile();
    } catch (err: any) {
      alert(err.message || 'Override failed');
    }
  };

  if (loading) return <div className="text-center text-slate-400 py-12">Loading student profile...</div>;
  if (!data) return <div className="text-center text-slate-400 py-12">Student profile not found.</div>;

  const { student, enrollments, guardians, attendanceSummary, recentAttendance } = data;
  const currentEnrollment = enrollments[0];

  return (
    <div className="space-y-6">
      {/* Header Profile Card */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center space-x-5">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-2xl border-2 border-emerald-500 shadow">
            {student.fullName.charAt(0)}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{student.fullName}</h1>
            {student.bengaliName && <p className="text-sm text-slate-500 font-medium">{student.bengaliName}</p>}
            <div className="flex flex-wrap gap-2 mt-2 text-xs">
              <span className="bg-emerald-50 text-emerald-800 font-mono font-bold px-2 py-0.5 rounded border border-emerald-200">
                ID: {student.studentId}
              </span>
              <span className="bg-slate-100 text-slate-700 font-mono px-2 py-0.5 rounded">
                Adm No: {student.admissionNumber}
              </span>
              <span className="bg-blue-50 text-blue-700 font-bold px-2 py-0.5 rounded">
                {currentEnrollment?.classId?.name} - {currentEnrollment?.sectionId?.name} (Roll: {currentEnrollment?.rollNumber})
              </span>
            </div>
          </div>
        </div>

        {/* Attendance KPI Summary */}
        <div className="flex space-x-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
          <div className="text-center px-3 border-r border-slate-200">
            <span className="text-[10px] uppercase font-bold text-slate-400">Total Days</span>
            <h4 className="text-lg font-bold text-slate-900">{attendanceSummary?.totalDays || 0}</h4>
          </div>
          <div className="text-center px-3 border-r border-slate-200">
            <span className="text-[10px] uppercase font-bold text-slate-400">Present</span>
            <h4 className="text-lg font-bold text-emerald-600">{attendanceSummary?.presentDays || 0}</h4>
          </div>
          <div className="text-center px-3 border-r border-slate-200">
            <span className="text-[10px] uppercase font-bold text-slate-400">Absent</span>
            <h4 className="text-lg font-bold text-rose-600">{attendanceSummary?.absentDays || 0}</h4>
          </div>
          <div className="text-center px-3">
            <span className="text-[10px] uppercase font-bold text-slate-400">Rate</span>
            <h4 className="text-lg font-bold text-blue-600">{attendanceSummary?.attendancePercentage || 100}%</h4>
          </div>
        </div>
      </div>

      {/* Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Guardians Card */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
          <h3 className="font-bold text-slate-800 text-sm flex items-center space-x-2">
            <Phone className="w-4 h-4 text-emerald-600" />
            <span>Guardian Information</span>
          </h3>
          <div className="space-y-3">
            {guardians?.map((g: any) => (
              <div key={g._id} className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-1">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-slate-900">{g.fullName} ({g.relationship})</h4>
                  {g.isPrimaryGuardian && (
                    <span className="text-[9px] font-bold uppercase bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded border border-amber-300">
                      Primary Guardian (SMS Receiver)
                    </span>
                  )}
                </div>
                <p className="text-slate-600 font-mono">Mobile: {g.mobile}</p>
                {g.email && <p className="text-slate-500">Email: {g.email}</p>}
              </div>
            ))}
          </div>
        </div>

        {/* Academic Enrollment History */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
          <h3 className="font-bold text-slate-800 text-sm flex items-center space-x-2">
            <UserCheck className="w-4 h-4 text-emerald-600" />
            <span>Academic Enrollment History</span>
          </h3>
          <div className="space-y-2 text-xs">
            {enrollments?.map((e: any) => (
              <div key={e._id} className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 flex justify-between items-center">
                <div>
                  <span className="font-bold text-emerald-800">{e.academicYearId?.name}</span>
                  <p className="text-slate-600">{e.classId?.name} - {e.sectionId?.name} (Roll: {e.rollNumber})</p>
                </div>
                <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                  {e.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Attendance History Log Table */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="font-bold text-slate-800 text-sm flex items-center space-x-2">
          <CalendarCheck className="w-4 h-4 text-emerald-600" />
          <span>Attendance History & Override Log</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-semibold">
                <th className="py-2.5 px-3">Date</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Marked By</th>
                <th className="py-2.5 px-3">SMS Status</th>
                <th className="py-2.5 px-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {recentAttendance?.map((att: any) => (
                <tr key={att._id} className="hover:bg-slate-50">
                  <td className="py-2.5 px-3 font-mono text-slate-600">{att.date}</td>
                  <td className="py-2.5 px-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      att.status === 'PRESENT' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                    }`}>
                      {att.status}
                    </span>
                    {att.modificationReason && (
                      <p className="text-[10px] text-amber-700 italic mt-0.5">Override: "{att.modificationReason}"</p>
                    )}
                  </td>
                  <td className="py-2.5 px-3 text-slate-600">{att.markedBy?.email}</td>
                  <td className="py-2.5 px-3 text-slate-500 font-mono">{att.smsStatus}</td>
                  <td className="py-2.5 px-3">
                    <button
                      onClick={() => {
                        setOverrideModal(att);
                        setNewStatus(att.status);
                      }}
                      className="text-xs font-semibold text-amber-700 hover:text-amber-900 bg-amber-50 hover:bg-amber-100 px-2 py-1 rounded border border-amber-200"
                    >
                      Override Status
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Override Modal */}
      {overrideModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-base text-slate-900">Principal Attendance Override</h3>
              <button onClick={() => setOverrideModal(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleOverride} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">New Status</label>
                <select
                  value={newStatus}
                  onChange={(e: any) => setNewStatus(e.target.value)}
                  className="w-full text-sm p-2 border rounded-lg bg-white font-bold"
                >
                  <option value="PRESENT">PRESENT</option>
                  <option value="ABSENT">ABSENT</option>
                  <option value="LATE">LATE</option>
                  <option value="EXCUSED">EXCUSED</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Modification Reason (Required)</label>
                <textarea
                  required
                  rows={3}
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Teacher marked absent incorrectly..."
                  className="w-full text-xs p-2 border rounded-lg"
                />
              </div>
              <div className="pt-2 flex justify-end space-x-2">
                <button type="button" onClick={() => setOverrideModal(null)} className="px-4 py-2 text-xs font-semibold text-slate-600 bg-slate-100 rounded-lg">Cancel</button>
                <button type="submit" className="px-4 py-2 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-lg">Confirm Override</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

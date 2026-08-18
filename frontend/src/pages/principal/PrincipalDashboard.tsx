import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { useLanguage } from '../../context/LanguageContext';
import { Users, GraduationCap, CalendarCheck, MessageSquare, AlertCircle, ArrowUpRight } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from 'recharts';

export const PrincipalDashboard: React.FC = () => {
  const { t } = useLanguage();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/reports/dashboard')
      .then((res: any) => setStats(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="text-center text-slate-400 py-12">Loading Principal Dashboard...</div>;
  }

  const attendancePieData = [
    { name: 'Present Today', value: stats?.todayPresent || 0, color: '#16a34a' },
    { name: 'Absent Today', value: stats?.todayAbsent || 0, color: '#dc2626' },
  ];

  const classBarData = [
    { name: 'Class 6', present: 32, absent: 3 },
    { name: 'Class 7', present: 28, absent: 2 },
    { name: 'Class 8', present: 30, absent: 4 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Principal Administrative Dashboard</h1>
          <p className="text-xs text-slate-500 font-medium">Real-Time Madrasah Overview & Operational Metrics</p>
        </div>
        <div className="inline-flex items-center space-x-2 bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1.5 rounded-lg text-xs font-semibold">
          <span>Active Academic Year: {stats?.activeYear?.name || '2026-2027'}</span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase">{t('totalStudents')}</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">{stats?.totalStudents || 0}</h3>
          </div>
          <div className="w-12 h-12 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase">{t('totalTeachers')}</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">{stats?.totalTeachers || 0}</h3>
          </div>
          <div className="w-12 h-12 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
            <GraduationCap className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase">{t('attendanceRate')}</p>
            <h3 className="text-2xl font-bold text-emerald-600 mt-1">{stats?.attendancePercentage || 100}%</h3>
          </div>
          <div className="w-12 h-12 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
            <CalendarCheck className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase">{t('smsSent')}</p>
            <h3 className="text-2xl font-bold text-slate-900 mt-1">{stats?.smsSent || 0}</h3>
            <p className="text-[10px] text-slate-400 font-medium">Failed: {stats?.smsFailed || 0}</p>
          </div>
          <div className="w-12 h-12 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
            <MessageSquare className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Visual Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-800">Today's Class Attendance Breakdown</h3>
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={attendancePieData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4}>
                  {attendancePieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center space-x-6 text-xs font-medium text-slate-600">
            <span className="flex items-center space-x-1.5">
              <span className="w-3 h-3 rounded-full bg-emerald-600"></span>
              <span>Present ({stats?.todayPresent || 0})</span>
            </span>
            <span className="flex items-center space-x-1.5">
              <span className="w-3 h-3 rounded-full bg-rose-600"></span>
              <span>Absent ({stats?.todayAbsent || 0})</span>
            </span>
          </div>
        </div>

        <div className="lg:col-span-2 bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-800">Class-Wise Attendance Overview</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={classBarData}>
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip />
                <Bar dataKey="present" fill="#16a34a" name="Present" radius={[4, 4, 0, 0]} />
                <Bar dataKey="absent" fill="#dc2626" name="Absent" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Attendance Activity Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
        <h3 className="text-sm font-bold text-slate-800">Recent Class Attendance Logs</h3>
        {stats?.recentActivity?.length === 0 ? (
          <p className="text-xs text-slate-400 py-4 text-center">No attendance recorded today yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-semibold">
                  <th className="py-2.5 px-3">Date</th>
                  <th className="py-2.5 px-3">Student Name</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Marked By</th>
                  <th className="py-2.5 px-3">SMS Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {stats?.recentActivity?.map((log: any) => (
                  <tr key={log._id} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-mono text-slate-500">{log.date}</td>
                    <td className="py-2.5 px-3 font-semibold text-slate-900">{log.studentId?.fullName}</td>
                    <td className="py-2.5 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        log.status === 'PRESENT' ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {log.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-600">{log.markedBy?.email}</td>
                    <td className="py-2.5 px-3">
                      <span className="text-[10px] font-medium text-slate-500">{log.smsStatus}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

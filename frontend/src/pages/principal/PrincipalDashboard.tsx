import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { useLanguage } from '../../context/LanguageContext';
import { Users, GraduationCap, CalendarCheck, MessageSquare, AlertCircle, ArrowUpRight } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, PieChart, Pie, Cell } from 'recharts';

export const PrincipalDashboard: React.FC = () => {
  const { t, language } = useLanguage();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/reports/dashboard')
      .then((res: any) => setStats(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="text-center text-slate-400 py-12">{language === 'bn' ? 'ড্যাশবোর্ড লোড হচ্ছে...' : 'Loading Principal Dashboard...'}</div>;
  }

  const attendancePieData = [
    { name: t('present'), value: stats?.todayPresent || 0, color: '#16a34a' },
    { name: t('absent'), value: stats?.todayAbsent || 0, color: '#dc2626' },
  ];

  const classBarData = [
    { name: language === 'bn' ? '৬ষ্ঠ শ্রেণি' : 'Class 6', present: 32, absent: 3 },
    { name: language === 'bn' ? '৭ম শ্রেণি' : 'Class 7', present: 28, absent: 2 },
    { name: language === 'bn' ? '৮ম শ্রেণি' : 'Class 8', present: 30, absent: 4 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{t('principalDashboard')}</h1>
          <p className="text-xs text-slate-500 font-medium">
            {language === 'bn' ? 'মাদ্রাসার সার্বিক পরিসংখ্যান ও রিয়েল-টাইম তথ্য' : 'Real-Time Madrasah Overview & Operational Metrics'}
          </p>
        </div>
        <div className="inline-flex items-center space-x-2 bg-emerald-50 text-emerald-800 border border-emerald-200 px-3 py-1.5 rounded-lg text-xs font-semibold">
          <span>{t('activeYear')}: {stats?.activeYear?.name || '2026-2027'}</span>
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
            <p className="text-[10px] text-slate-400 font-medium">{t('smsFailed')}: {stats?.smsFailed || 0}</p>
          </div>
          <div className="w-12 h-12 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
            <MessageSquare className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Visual Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-800">
            {language === 'bn' ? 'আজকের সার্বিক উপস্থিতি চিত্র' : "Today's Class Attendance Breakdown"}
          </h3>
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
              <span>{t('present')} ({stats?.todayPresent || 0})</span>
            </span>
            <span className="flex items-center space-x-1.5">
              <span className="w-3 h-3 rounded-full bg-rose-600"></span>
              <span>{t('absent')} ({stats?.todayAbsent || 0})</span>
            </span>
          </div>
        </div>

        <div className="lg:col-span-2 bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-800">
            {language === 'bn' ? 'শ্রেণিভিত্তিক উপস্থিতির তুলনা' : 'Class-Wise Attendance Overview'}
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={classBarData}>
                <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
                <YAxis stroke="#64748b" fontSize={12} />
                <Tooltip />
                <Bar dataKey="present" fill="#16a34a" name={t('present')} radius={[4, 4, 0, 0]} />
                <Bar dataKey="absent" fill="#dc2626" name={t('absent')} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Attendance Activity Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 space-y-4">
        <h3 className="text-sm font-bold text-slate-800">{t('recentActivity')}</h3>
        {stats?.recentActivity?.length === 0 ? (
          <p className="text-xs text-slate-400 py-4 text-center">
            {language === 'bn' ? 'আজকের কোনো হাজিরা লগ পাওয়া যায়নি।' : 'No attendance recorded today yet.'}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-semibold">
                  <th className="py-2.5 px-3">{t('date')}</th>
                  <th className="py-2.5 px-3">{t('fullName')}</th>
                  <th className="py-2.5 px-3">{t('status')}</th>
                  <th className="py-2.5 px-3">{t('user')}</th>
                  <th className="py-2.5 px-3">SMS {t('status')}</th>
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
                        {log.status === 'PRESENT' ? t('present') : t('absent')}
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

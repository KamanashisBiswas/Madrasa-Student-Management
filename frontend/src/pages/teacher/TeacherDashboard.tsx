import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { CalendarCheck, Users, GraduationCap, ArrowRight } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const TeacherDashboard: React.FC = () => {
  const { t } = useLanguage();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/teachers/my-classes')
      .then((res: any) => setData(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="text-center text-slate-400 py-12">Loading Teacher Dashboard...</div>;

  const { classTeacherSections, subjectAssignments } = data || {};

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Teacher Portal Dashboard</h1>
          <p className="text-xs text-slate-500 font-medium">Access Assigned Classes & Take Daily Attendance</p>
        </div>
        <Link
          to="/teacher/take-attendance"
          className="inline-flex items-center space-x-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs px-4 py-2.5 rounded-lg shadow transition"
        >
          <CalendarCheck className="w-4 h-4 text-amber-300" />
          <span>Open Daily Attendance Sheet</span>
        </Link>
      </div>

      {/* Class Teacher Assigned Sections Card Matrix */}
      <div className="space-y-3">
        <h3 className="font-bold text-slate-800 text-sm flex items-center space-x-2">
          <GraduationCap className="w-4 h-4 text-emerald-600" />
          <span>Classes Where You Are Designated Class Teacher</span>
        </h3>

        {classTeacherSections?.length === 0 ? (
          <div className="bg-white p-6 rounded-xl border border-slate-200 text-xs text-slate-400 text-center">
            You are not assigned as Class Teacher for any section currently.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {classTeacherSections?.map((sec: any) => (
              <div key={sec._id} className="bg-white p-5 rounded-xl border border-emerald-200 shadow-sm space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-slate-900 text-base">{sec.classId?.name}</h4>
                    <span className="text-xs font-semibold text-emerald-700">{sec.name}</span>
                  </div>
                  <span className="text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded border border-emerald-300">
                    Class Teacher
                  </span>
                </div>
                <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-xs">
                  <span className="text-slate-500">Academic Year: {sec.academicYearId?.name || '2026-2027'}</span>
                  <Link
                    to={`/teacher/take-attendance?classId=${sec.classId?._id}&sectionId=${sec._id}`}
                    className="inline-flex items-center space-x-1 font-bold text-emerald-700 hover:underline"
                  >
                    <span>Mark Attendance</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Subject Teacher Assigned Sections Card Matrix */}
      <div className="space-y-3">
        <h3 className="font-bold text-slate-800 text-sm flex items-center space-x-2">
          <Users className="w-4 h-4 text-emerald-600" />
          <span>Classes Where You Teach Subjects (Subject Teacher)</span>
        </h3>

        {subjectAssignments?.length === 0 ? (
          <div className="bg-white p-6 rounded-xl border border-slate-200 text-xs text-slate-400 text-center">
            No subject assignments linked currently.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {subjectAssignments?.map((ass: any) => (
              <div key={ass._id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-bold text-slate-900 text-base">{ass.subjectId?.name}</h4>
                    <span className="text-xs font-semibold text-slate-600">
                      {ass.classId?.name} - {ass.sectionId?.name}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold uppercase bg-slate-100 text-slate-700 px-2 py-0.5 rounded border border-slate-200">
                    Subject Teacher
                  </span>
                </div>
                <div className="pt-2 border-t border-slate-100 flex justify-between items-center text-xs">
                  <span className="text-slate-500 font-mono">Code: {ass.subjectId?.code}</span>
                  <Link
                    to={`/teacher/take-attendance?classId=${ass.classId?._id}&sectionId=${ass.sectionId?._id}`}
                    className="inline-flex items-center space-x-1 font-bold text-emerald-700 hover:underline"
                  >
                    <span>Open Class</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

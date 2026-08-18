import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { ClassItem } from '../../types';
import { GraduationCap, Users } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const ClassesPublic: React.FC = () => {
  const { t, language } = useLanguage();
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/classes')
      .then((res: any) => setClasses(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <h1 className="text-3xl font-bold text-slate-900">{t('classes')}</h1>
        <p className="text-sm text-slate-600">
          {language === 'bn' ? 'মাদ্রাসার নিয়মিত শিক্ষাক্রম ও শ্রেণির বিবরণ' : 'Our Structured Academic Curriculum & Class Directory'}
        </p>
      </div>

      {loading ? (
        <div className="text-center text-slate-400 py-12">Loading academic classes...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {classes.map((cls) => (
            <div key={cls._id} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-lg">{cls.name}</h3>
                  <span className="text-xs text-slate-500 font-mono">Code: {cls.code}</span>
                </div>
              </div>

              <div className="border-t border-b border-slate-100 py-3 space-y-2 text-xs">
                <div className="flex justify-between items-center text-slate-700">
                  <span className="font-bold">{t('classTeacher')}:</span>
                  <span className="text-emerald-800 font-bold">
                    {cls.classTeacherId ? cls.classTeacherId.fullName : 'Assigned Faculty'}
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center text-xs font-semibold text-slate-600 pt-1">
                <span>{t('totalStudents')}:</span>
                <span className="text-slate-900 font-bold text-sm">{cls.studentCount || 0}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

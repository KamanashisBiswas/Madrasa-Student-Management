import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { ClassItem } from '../../types';
import { GraduationCap, Users } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const ClassesPublic: React.FC = () => {
  const { t } = useLanguage();
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/classes')
      .then((res: any) => setClasses(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-slate-900">{t('classes')}</h1>
        <p className="text-sm text-slate-500">Academic structure and offerings</p>
      </div>

      {loading ? (
        <div className="text-center text-slate-400 py-12">Loading academic classes...</div>
      ) : (
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
                <span className="text-xs font-semibold px-2 py-1 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Active
                </span>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                <span className="flex items-center space-x-1">
                  <Users className="w-4 h-4 text-emerald-600" />
                  <span>Enrolled: {cls.studentCount || 0} Students</span>
                </span>
                <span>Sections: {cls.sections?.length || 1}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

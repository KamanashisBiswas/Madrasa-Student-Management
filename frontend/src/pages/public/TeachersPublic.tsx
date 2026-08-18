import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { Teacher } from '../../types';
import { UserCheck, Mail, Phone } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const TeachersPublic: React.FC = () => {
  const { t } = useLanguage();
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/teachers')
      .then((res: any) => setTeachers(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-slate-900">{t('teachers')}</h1>
        <p className="text-sm text-slate-500">Meet our qualified and dedicated educators</p>
      </div>

      {loading ? (
        <div className="text-center text-slate-400 py-12">Loading teachers directory...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {teachers.map((teacher) => (
            <div key={teacher._id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-start space-x-4">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-base shrink-0 border border-emerald-300">
                {teacher.fullName.charAt(0)}
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-slate-900 text-base">{teacher.fullName}</h3>
                <p className="text-xs text-emerald-700 font-medium">{teacher.designation || 'Assistant Teacher'}</p>
                <div className="pt-2 text-xs text-slate-500 space-y-1">
                  <p className="flex items-center space-x-1.5">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span>{teacher.email}</span>
                  </p>
                  <p className="flex items-center space-x-1.5">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>{teacher.mobile}</span>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

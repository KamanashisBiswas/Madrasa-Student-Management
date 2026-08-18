import React from 'react';
import { BookOpen, ShieldCheck, HeartHandshake } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const About: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 space-y-12">
      <div className="text-center space-y-4 max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-900">{t('about')}</h1>
        <p className="text-sm text-slate-600 leading-relaxed">
          Al-Hikmah International Madrasah was founded to impart high-quality Quranic, Arabic, and general curriculum education to young learners.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-3">
          <BookOpen className="w-8 h-8 text-emerald-600" />
          <h3 className="text-lg font-bold text-slate-900">Comprehensive Curriculum</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Integrating Hifz, Tajweed, Arabic Literature, Bangla, English, and Mathematics.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-3">
          <ShieldCheck className="w-8 h-8 text-emerald-600" />
          <h3 className="text-lg font-bold text-slate-900">Moral & Ethics First</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Instilling Islamic values, respect for guardians, and personal responsibility.
          </p>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-3">
          <HeartHandshake className="w-8 h-8 text-emerald-600" />
          <h3 className="text-lg font-bold text-slate-900">Guardian Transparency</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Real-time absent SMS notifications and guardian portal access.
          </p>
        </div>
      </div>
    </div>
  );
};

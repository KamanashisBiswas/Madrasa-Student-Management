import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Users, Award, ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const Home: React.FC = () => {
  const { t } = useLanguage();

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Banner */}
      <section className="relative bg-emerald-950 text-white py-20 px-4 overflow-hidden border-b border-emerald-900">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px]"></div>
        <div className="max-w-7xl mx-auto relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <span className="inline-flex items-center space-x-2 bg-emerald-900/80 text-amber-300 text-xs font-semibold px-3 py-1.5 rounded-full border border-emerald-700">
              <Award className="w-4 h-4 text-amber-400" />
              <span>SaaS-Grade Modern Madrasah ERP</span>
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight tracking-tight text-white">
              {t('appName')}
            </h1>
            <p className="text-emerald-200 text-base leading-relaxed">
              Combining authentic Islamic education, modern academic excellence, and real-time guardian attendance notification.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <Link
                to="/login"
                className="inline-flex items-center space-x-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-6 py-3 rounded-lg shadow-lg transition"
              >
                <span>{t('login')}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center space-x-2 bg-emerald-900/60 hover:bg-emerald-800 text-emerald-100 font-semibold px-6 py-3 rounded-lg border border-emerald-700 transition"
              >
                <span>{t('about')}</span>
              </Link>
            </div>
          </div>

          <div className="bg-emerald-900/50 p-6 rounded-2xl border border-emerald-800 shadow-2xl backdrop-blur">
            <h3 className="text-lg font-bold text-amber-300 mb-4 flex items-center space-x-2">
              <BookOpen className="w-5 h-5" />
              <span>Key Features & Capabilities</span>
            </h3>
            <ul className="space-y-3 text-sm text-emerald-100">
              <li className="flex items-start space-x-3">
                <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <span>Real-Time Rapid Attendance Entry for Teachers</span>
              </li>
              <li className="flex items-start space-x-3">
                <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <span>Instant Decoupled SMS Notification to Primary Guardians</span>
              </li>
              <li className="flex items-start space-x-3">
                <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <span>Separated Class Teacher & Subject Teacher Assignments</span>
              </li>
              <li className="flex items-start space-x-3">
                <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <span>Multi-Year Academic History & Enrollment Tracking</span>
              </li>
              <li className="flex items-start space-x-3">
                <CheckCircle2 className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <span>Principal Attendance Overrides & Immutable Audit Logs</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Stats Counter Section */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm text-center">
            <Users className="w-8 h-8 mx-auto text-emerald-600 mb-2" />
            <h3 className="text-2xl font-bold text-slate-900">500+</h3>
            <p className="text-xs text-slate-500 font-medium">Active Students</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm text-center">
            <BookOpen className="w-8 h-8 mx-auto text-emerald-600 mb-2" />
            <h3 className="text-2xl font-bold text-slate-900">25+</h3>
            <p className="text-xs text-slate-500 font-medium">Qualified Teachers</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm text-center">
            <ShieldCheck className="w-8 h-8 mx-auto text-emerald-600 mb-2" />
            <h3 className="text-2xl font-bold text-slate-900">10</h3>
            <p className="text-xs text-slate-500 font-medium">Academic Classes</p>
          </div>
          <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm text-center">
            <Award className="w-8 h-8 mx-auto text-emerald-600 mb-2" />
            <h3 className="text-2xl font-bold text-slate-900">99.8%</h3>
            <p className="text-xs text-slate-500 font-medium">SMS Delivery Success</p>
          </div>
        </div>
      </section>
    </div>
  );
};

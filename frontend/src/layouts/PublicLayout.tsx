import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import { BookOpen, LogIn, Globe, Phone, Mail, MapPin } from 'lucide-react';

export const PublicLayout: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-800">
      {/* Top Header Contact Bar */}
      <div className="bg-emerald-900 text-emerald-100 text-xs py-2 px-4 border-b border-emerald-800">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <span className="flex items-center space-x-1">
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              <span>+8801700000000</span>
            </span>
            <span className="hidden sm:flex items-center space-x-1">
              <Mail className="w-3.5 h-3.5 text-emerald-400" />
              <span>info@alhikmah.edu.bd</span>
            </span>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setLanguage(language === 'bn' ? 'en' : 'bn')}
              className="flex items-center space-x-1 bg-emerald-800 hover:bg-emerald-700 text-white px-2 py-0.5 rounded transition text-xs"
            >
              <Globe className="w-3 h-3 text-amber-400" />
              <span>{language === 'bn' ? 'English' : 'বাংলা'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-emerald-700 text-amber-300 flex items-center justify-center font-bold text-xl shadow-md border-2 border-emerald-600">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-emerald-950 leading-tight">
                {t('appName')}
              </h1>
              <p className="text-xs text-slate-500 font-medium">{t('systemTitle')}</p>
            </div>
          </Link>

          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            <Link to="/" className="text-slate-700 hover:text-emerald-700 transition">
              {t('home')}
            </Link>
            <Link to="/about" className="text-slate-700 hover:text-emerald-700 transition">
              {t('about')}
            </Link>
            <Link to="/teachers" className="text-slate-700 hover:text-emerald-700 transition">
              {t('teachers')}
            </Link>
            <Link to="/classes" className="text-slate-700 hover:text-emerald-700 transition">
              {t('classes')}
            </Link>
            <Link to="/notices" className="text-slate-700 hover:text-emerald-700 transition">
              {t('notices')}
            </Link>
            <Link to="/gallery" className="text-slate-700 hover:text-emerald-700 transition">
              {t('gallery')}
            </Link>
            <Link to="/contact" className="text-slate-700 hover:text-emerald-700 transition">
              {t('contact')}
            </Link>
          </nav>

          <div>
            <Link
              to="/login"
              className="inline-flex items-center space-x-2 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs px-4 py-2 rounded-lg transition shadow hover:shadow-md"
            >
              <LogIn className="w-4 h-4" />
              <span>{t('login')}</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-300 text-sm py-8 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-3">
              <BookOpen className="w-5 h-5 text-emerald-400" />
              <h3 className="text-lg font-bold text-white">{t('appName')}</h3>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed">
              Excellence in Islamic Education, Moral Development & Academic Mastery.
            </p>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">Quick Links</h4>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li><Link to="/about" className="hover:text-emerald-400">{t('about')}</Link></li>
              <li><Link to="/admission" className="hover:text-emerald-400">{t('admission')}</Link></li>
              <li><Link to="/notices" className="hover:text-emerald-400">{t('notices')}</Link></li>
              <li><Link to="/login" className="hover:text-emerald-400">{t('login')}</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-semibold mb-3">Contact Info</h4>
            <p className="text-xs text-slate-400 flex items-center space-x-2 mb-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" />
              <span>Mirpur-10, Dhaka-1216, Bangladesh</span>
            </p>
            <p className="text-xs text-slate-400 flex items-center space-x-2">
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              <span>+8801700000000</span>
            </p>
          </div>
        </div>
        <div className="max-w-7xl mx-auto px-4 mt-8 pt-4 border-t border-slate-800 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} {t('appName')}. All rights reserved.
        </div>
      </footer>
    </div>
  );
};

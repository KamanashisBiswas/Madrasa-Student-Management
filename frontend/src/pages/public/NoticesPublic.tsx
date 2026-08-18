import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { Notice } from '../../types';
import { Bell, Calendar } from 'lucide-react';
import { useLanguage } from '../../context/LanguageContext';

export const NoticesPublic: React.FC = () => {
  const { t } = useLanguage();
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/notices')
      .then((res: any) => setNotices(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-slate-900">{t('notices')}</h1>
        <p className="text-sm text-slate-500">Official announcements and notices</p>
      </div>

      {loading ? (
        <div className="text-center text-slate-400 py-12">Loading notices...</div>
      ) : notices.length === 0 ? (
        <div className="text-center text-slate-400 py-12">No notices published yet.</div>
      ) : (
        <div className="space-y-4">
          {notices.map((notice) => (
            <div key={notice._id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Bell className="w-4 h-4 text-emerald-600" />
                  <h3 className="font-bold text-slate-900 text-base">{notice.title}</h3>
                </div>
                {notice.isImportant && (
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-300">
                    Important
                  </span>
                )}
              </div>
              <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">{notice.content}</p>
              <div className="pt-2 border-t border-slate-100 flex items-center space-x-1 text-xs text-slate-400">
                <Calendar className="w-3.5 h-3.5" />
                <span>{new Date(notice.publishedAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

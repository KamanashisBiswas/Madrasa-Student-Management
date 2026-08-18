import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { SMSSettings } from '../../types';
import { Settings, Save, Send } from 'lucide-react';

export const SMSSettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<SMSSettings | null>(null);
  const [loading, setLoading] = useState(true);

  const [testMobile, setTestMobile] = useState('');
  const [testMessage, setTestMessage] = useState('প্রিয় অভিভাবক, এটি মাদ্রাসা সিস্টেমের একটি টেস্ট বার্তা।');

  const fetchSettings = () => {
    setLoading(true);
    api.get('/sms/settings')
      .then((res: any) => setSettings(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    try {
      await api.put('/sms/settings', settings);
      alert('SMS Settings updated successfully');
      fetchSettings();
    } catch (err: any) {
      alert(err.message || 'Failed to update settings');
    }
  };

  const handleSendTest = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res: any = await api.post('/sms/test', {
        mobile: testMobile,
        message: testMessage,
      });
      alert(res.message || 'Test SMS dispatched');
    } catch (err: any) {
      alert(err.message || 'Failed to send test SMS');
    }
  };

  if (loading || !settings) return <div className="text-center text-slate-400 py-12">Loading SMS settings...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">SMS Notification & Provider Settings</h1>
        <p className="text-xs text-slate-500 font-medium">Configure Toggles, Sender IDs, Bengali Templates & Editing Windows</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Settings Form */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-800 text-sm flex items-center space-x-2">
            <Settings className="w-4 h-4 text-emerald-600" />
            <span>Notification Toggles & Templates</span>
          </h3>

          <form onSubmit={handleSave} className="space-y-4 text-xs">
            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
              <div>
                <h4 className="font-bold text-slate-800">Absent SMS Notifications</h4>
                <p className="text-[11px] text-slate-500">Automatically send Bengali SMS to primary guardian upon absent submission</p>
              </div>
              <input
                type="checkbox"
                checked={settings.absentSmsEnabled}
                onChange={(e) => setSettings({ ...settings, absentSmsEnabled: e.target.checked })}
                className="w-5 h-5 accent-emerald-600 cursor-pointer"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Sender ID</label>
              <input
                type="text"
                value={settings.smsSenderId}
                onChange={(e) => setSettings({ ...settings, smsSenderId: e.target.value })}
                className="w-full p-2 border rounded-lg text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Bengali Absent SMS Template</label>
              <textarea
                rows={3}
                value={settings.absentSmsTemplate}
                onChange={(e) => setSettings({ ...settings, absentSmsTemplate: e.target.value })}
                className="w-full p-2 border rounded-lg text-xs leading-relaxed"
              />
              <p className="text-[10px] text-slate-400 mt-1 font-mono">
                Placeholders: {'{studentName}'}, {'{date}'}, {'{madrasahName}'}
              </p>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Teacher Attendance Edit Window (Minutes)</label>
              <input
                type="number"
                value={settings.attendanceEditWindowMinutes}
                onChange={(e) => setSettings({ ...settings, attendanceEditWindowMinutes: Number(e.target.value) })}
                className="w-full p-2 border rounded-lg text-xs"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2.5 rounded-lg shadow transition flex items-center justify-center space-x-2"
            >
              <Save className="w-4 h-4" />
              <span>Save System Settings</span>
            </button>
          </form>
        </div>

        {/* Test SMS Sender Box */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <h3 className="font-bold text-slate-800 text-sm flex items-center space-x-2">
            <Send className="w-4 h-4 text-emerald-600" />
            <span>Send Test SMS</span>
          </h3>

          <form onSubmit={handleSendTest} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Recipient Mobile</label>
              <input
                required
                type="tel"
                value={testMobile}
                onChange={(e) => setTestMobile(e.target.value)}
                placeholder="01700000000"
                className="w-full p-2 border rounded-lg text-xs"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Test Message Body</label>
              <textarea
                required
                rows={3}
                value={testMessage}
                onChange={(e) => setTestMessage(e.target.value)}
                className="w-full p-2 border rounded-lg text-xs leading-relaxed"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-slate-800 hover:bg-slate-900 text-white font-bold py-2.5 rounded-lg shadow transition flex items-center justify-center space-x-2"
            >
              <Send className="w-4 h-4" />
              <span>Dispatch Test Message</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

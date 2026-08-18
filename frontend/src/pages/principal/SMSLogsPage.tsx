import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { SMSLog } from '../../types';
import { MessageSquare, RefreshCw, Filter } from 'lucide-react';

export const SMSLogsPage: React.FC = () => {
  const [logs, setLogs] = useState<SMSLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');

  const fetchLogs = () => {
    setLoading(true);
    const params: any = {};
    if (statusFilter) params.status = statusFilter;

    api.get('/sms/logs', { params })
      .then((res: any) => setLogs(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchLogs();
  }, [statusFilter]);

  const handleRetryAll = async () => {
    try {
      const res: any = await api.post('/sms/retry-failed');
      alert(res.message || 'Failed SMS retried');
      fetchLogs();
    } catch (err: any) {
      alert(err.message || 'Retry failed');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Guardian SMS Logs</h1>
          <p className="text-xs text-slate-500 font-medium">Delivery Outcomes & Attempt History</p>
        </div>
        <button
          onClick={handleRetryAll}
          className="inline-flex items-center space-x-2 bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold px-4 py-2.5 rounded-lg shadow transition"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Retry Failed SMS Queue</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center space-x-4">
        <Filter className="w-4 h-4 text-slate-400" />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="text-xs p-2 border rounded-lg bg-white"
        >
          <option value="">All Statuses</option>
          <option value="SENT">SENT</option>
          <option value="PENDING">PENDING</option>
          <option value="FAILED">FAILED</option>
        </select>
      </div>

      {/* SMS Logs Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-400">Loading SMS logs...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-semibold">
                  <th className="py-3 px-4">Time</th>
                  <th className="py-3 px-4">Student</th>
                  <th className="py-3 px-4">Guardian Mobile</th>
                  <th className="py-3 px-4">Message</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Attempts</th>
                  <th className="py-3 px-4">Provider</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {logs.map((log) => (
                  <tr key={log._id} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-mono text-slate-500">{new Date(log.createdAt).toLocaleString()}</td>
                    <td className="py-3 px-4 font-semibold text-slate-900">{log.studentId?.fullName || 'System Test'}</td>
                    <td className="py-3 px-4 font-mono text-slate-600">{log.mobile}</td>
                    <td className="py-3 px-4 text-slate-700 max-w-xs truncate">{log.message}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        log.status === 'SENT' ? 'bg-emerald-100 text-emerald-800' :
                        log.status === 'PENDING' ? 'bg-amber-100 text-amber-800' : 'bg-rose-100 text-rose-800'
                      }`}>
                        {log.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono">{log.attemptCount} / 3</td>
                    <td className="py-3 px-4 font-mono text-slate-500">{log.provider}</td>
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

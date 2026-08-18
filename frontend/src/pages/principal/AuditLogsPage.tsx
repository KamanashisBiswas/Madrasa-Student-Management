import React, { useEffect, useState } from 'react';
import { api } from '../../services/api';
import { AuditLog } from '../../types';
import { ShieldCheck } from 'lucide-react';

export const AuditLogsPage: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/audit')
      .then((res: any) => setLogs(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Immutable Audit Trail</h1>
        <p className="text-xs text-slate-500 font-medium">Traceability for Administrative Overrides & Security Events</p>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-400">Loading audit logs...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 font-semibold">
                  <th className="py-3 px-4">Timestamp</th>
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Action</th>
                  <th className="py-3 px-4">Entity</th>
                  <th className="py-3 px-4">Details / Reason</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {logs.map((log) => (
                  <tr key={log._id} className="hover:bg-slate-50">
                    <td className="py-3 px-4 font-mono text-slate-500">{new Date(log.timestamp).toLocaleString()}</td>
                    <td className="py-3 px-4 font-semibold text-slate-900">{log.userId?.email || 'System'}</td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 text-slate-800">
                        {log.userRole}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-bold text-amber-800">{log.action}</td>
                    <td className="py-3 px-4 font-mono text-slate-600">{log.entity}</td>
                    <td className="py-3 px-4 text-slate-700 font-mono text-[11px]">
                      {JSON.stringify(log.newData)}
                    </td>
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

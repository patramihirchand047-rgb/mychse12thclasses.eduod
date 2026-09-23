import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  Download,
  Search,
  Filter,
  KeyRound,
  UserCheck,
  Clock,
  Terminal,
  Server,
  Lock,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { useAdminData } from '../context/AdminDataContext';
import { AuditLog } from '../types';

export const AuditLogsSecurity: React.FC = () => {
  const { admin, auditLogs } = useAdminData();
  const [searchQuery, setSearchQuery] = useState('');
  const [actionFilter, setActionFilter] = useState<string>('All');

  const filteredLogs = auditLogs.filter((log) => {
    const matchesAction = actionFilter === 'All' || log.action.includes(actionFilter);
    const matchesSearch =
      !searchQuery ||
      log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (log.targetRegNo && log.targetRegNo.toLowerCase().includes(searchQuery.toLowerCase())) ||
      log.adminName.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesAction && matchesSearch;
  });

  const exportAuditCSV = () => {
    const headers = ['Timestamp', 'Action', 'Target Reg No', 'Admin Name', 'Role', 'IP Address', 'Details'];
    const rows = filteredLogs.map((l) => [
      `"${l.timestamp}"`,
      `"${l.action}"`,
      `"${l.targetRegNo || 'N/A'}"`,
      `"${l.adminName}"`,
      `"${l.role}"`,
      `"${l.ipAddress}"`,
      `"${l.details.replace(/"/g, '""')}"`,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `CHSE_Security_Audit_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-black text-white">Security & Role-Based Access</h1>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-950 text-emerald-400 border border-emerald-800">
              Audit Compliance 2026
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Tracking administrative modifications, password resets without SMS/OTP, course approvals, and session authentication.
          </p>
        </div>

        <button
          onClick={exportAuditCSV}
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 flex items-center gap-1.5 transition-all shadow-xs self-start sm:self-auto"
        >
          <Download className="w-4 h-4 text-slate-400" />
          Export Audit Trail CSV
        </button>
      </div>

      {/* Security Architecture Compliance Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
          <ShieldCheck className="w-5 h-5 text-emerald-400" />
          <span>CHSE Odisha Zero-OTP & Registration Auth Policy Enforcement</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          
          <div className="bg-slate-850 border border-slate-800 rounded-xl p-3.5">
            <div className="font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              1. No Mobile OTP Dependency
            </div>
            <p className="text-slate-400 text-[11px] mt-1.5 leading-relaxed">
              All SMS gateway calls and cellular carrier OTP triggers have been permanently eradicated to prevent student login failures in weak network zones.
            </p>
          </div>

          <div className="bg-slate-850 border border-slate-800 rounded-xl p-3.5">
            <div className="font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              2. Strict CHSE Reg No Auth
            </div>
            <p className="text-slate-400 text-[11px] mt-1.5 leading-relaxed">
              Student login requires only the verified registration identifier (<code className="text-amber-300 font-mono">MYCHSE-2026-XXXXX</code>) and secure hashed password.
            </p>
          </div>

          <div className="bg-slate-850 border border-slate-800 rounded-xl p-3.5">
            <div className="font-bold text-white flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              3. Direct Password Reset
            </div>
            <p className="text-slate-400 text-[11px] mt-1.5 leading-relaxed">
              Students and administrators execute immediate password resets using verified CHSE Registration Numbers directly, logging all updates into this audit trail.
            </p>
          </div>

        </div>
      </div>

      {/* Admin Session Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-base border border-amber-500/30">
            {admin.avatarInitials}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-white text-sm">{admin.name}</span>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-950 text-amber-300 border border-amber-800">
                {admin.role}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">{admin.email}</p>
            <p className="text-[11px] text-slate-400">
              Active session established from Odisha State Wide Area Network (SWAN) Gateway.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right text-xs">
            <span className="text-slate-400 block text-[10px]">Session Status</span>
            <span className="text-emerald-400 font-bold flex items-center gap-1 justify-end">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Active & Verified
            </span>
          </div>
        </div>
      </div>

      {/* Audit Log Table Section */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm space-y-3 p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search audit trail by Reg No, Admin, Action..."
              className="w-full pl-9 pr-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto">
            {['All', 'PASSWORD_RESET', 'REGISTRATION', 'PAYMENT', 'COURSE_ACCESS'].map((action) => (
              <button
                key={action}
                onClick={() => setActionFilter(action)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 ${
                  actionFilter === action
                    ? 'bg-amber-500 text-slate-950 shadow-xs'
                    : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {action}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-850 text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-800">
              <tr>
                <th scope="col" className="px-4 py-3">Timestamp</th>
                <th scope="col" className="px-4 py-3">Action Event</th>
                <th scope="col" className="px-4 py-3">Target Student</th>
                <th scope="col" className="px-4 py-3">Admin Authority</th>
                <th scope="col" className="px-4 py-3">Audit Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredLogs.length > 0 ? (
                filteredLogs.map((log, index) => (
                  <tr key={`${log.id}-${index}`} className="hover:bg-slate-850/70 transition-colors">
                    <td className="px-4 py-3 text-slate-400 font-mono text-[11px] whitespace-nowrap">
                      {log.timestamp}
                    </td>

                    <td className="px-4 py-3">
                      <span className="font-mono text-amber-400 font-bold text-[11px] bg-amber-950/60 px-2 py-0.5 rounded border border-amber-800/60">
                        {log.action}
                      </span>
                    </td>

                    <td className="px-4 py-3 font-mono font-semibold text-slate-200 text-xs">
                      {log.targetRegNo || 'N/A'}
                    </td>

                    <td className="px-4 py-3">
                      <div className="text-white font-semibold text-xs">{log.adminName}</div>
                      <div className="text-[10px] text-slate-400">{log.role}</div>
                    </td>

                    <td className="px-4 py-3 text-slate-300 text-xs max-w-md">
                      {log.details}
                      <div className="text-[10px] text-slate-500 mt-0.5 font-mono">
                        Origin IP: {log.ipAddress}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-400">
                    No audit records match the query.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};

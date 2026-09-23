import React, { useState, useEffect } from 'react';
import {
  Settings,
  CreditCard,
  QrCode,
  Key,
  ShieldCheck,
  Server,
  Activity,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Save,
  Tag,
  DollarSign,
  Play,
  Terminal,
} from 'lucide-react';
import { useAdminData } from '../context/AdminDataContext';
import { SystemGatewayConfig } from '../types';

export const GatewaySystemConfig: React.FC = () => {
  const { gatewayConfig, updateGatewayConfig, checkSystemHealth, addAuditLog } = useAdminData();

  const [upiVpa, setUpiVpa] = useState(gatewayConfig.upiVpa);
  const [payeeDisplayName, setPayeeDisplayName] = useState(gatewayConfig.payeeDisplayName);
  const [razorpayMode, setRazorpayMode] = useState(gatewayConfig.razorpayMode);
  const [razorpayKeyId, setRazorpayKeyId] = useState(gatewayConfig.razorpayKeyId);
  const [razorpayKeySecret, setRazorpayKeySecret] = useState(gatewayConfig.razorpayKeySecret);

  // Pricing
  const [artsPrice, setArtsPrice] = useState(gatewayConfig.pricing.arts);
  const [sciencePrice, setSciencePrice] = useState(gatewayConfig.pricing.science);
  const [commercePrice, setCommercePrice] = useState(gatewayConfig.pricing.commerce);
  const [artsOriginal, setArtsOriginal] = useState(gatewayConfig.pricing.artsOriginal);
  const [scienceOriginal, setScienceOriginal] = useState(gatewayConfig.pricing.scienceOriginal);
  const [commerceOriginal, setCommerceOriginal] = useState(gatewayConfig.pricing.commerceOriginal);

  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);
  const [healthStatus, setHealthStatus] = useState<any>(null);
  const [isTestingApi, setIsTestingApi] = useState(false);
  const [apiTestResult, setApiTestResult] = useState<any>(null);

  useEffect(() => {
    runDiagnostics();
  }, []);

  const runDiagnostics = async () => {
    const health = await checkSystemHealth();
    setHealthStatus(health);
  };

  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateGatewayConfig({
      upiVpa,
      payeeDisplayName,
      razorpayMode,
      razorpayKeyId,
      razorpayKeySecret,
      pricing: {
        arts: Number(artsPrice),
        science: Number(sciencePrice),
        commerce: Number(commercePrice),
        artsOriginal: Number(artsOriginal),
        scienceOriginal: Number(scienceOriginal),
        commerceOriginal: Number(commerceOriginal),
      },
    });

    setSaveSuccess('Live Payment Gateway & Batch Pricing updated successfully.');
    setTimeout(() => setSaveSuccess(null), 5000);
  };

  const handleTestEndpoint = async (endpoint: string) => {
    setIsTestingApi(true);
    setApiTestResult(null);
    try {
      const res = await fetch(endpoint, {
        headers: {
          'Content-Type': 'application/json',
          'x-admin-api-key': 'CHSE_ODISHA_ADMIN_SECRET_2026',
        },
      });
      const data = await res.json();
      setApiTestResult({ endpoint, status: res.status, ok: res.ok, data });
    } catch (err: any) {
      setApiTestResult({ endpoint, status: 'Error', ok: false, error: err.message });
    } finally {
      setIsTestingApi(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-slate-700/70 rounded-2xl p-5 shadow-lg">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 mb-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              Real-time Payment Switch & State Pricing
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <Settings className="w-6 h-6 text-emerald-400" />
              Gateway & Application Configuration
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
              Control the live UPI VPA receiver address, Razorpay merchant credentials, CHSE 2nd year batch pricing tiers, and server API diagnostics.
            </p>
          </div>

          <button
            onClick={runDiagnostics}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors cursor-pointer self-start sm:self-center"
          >
            <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
            <span>Refresh Diagnostics</span>
          </button>
        </div>
      </div>

      {saveSuccess && (
        <div className="p-4 bg-emerald-950/80 border border-emerald-600/50 rounded-xl text-emerald-200 text-sm flex items-center gap-2.5 shadow-lg">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{saveSuccess}</span>
        </div>
      )}

      {/* Main Settings Form */}
      <form onSubmit={handleSaveConfig} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* SECTION 1: LIVE UPI PAYMENT CONFIG */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center gap-2.5 pb-2 border-b border-slate-800">
              <QrCode className="w-5 h-5 text-emerald-400" />
              <div>
                <h3 className="text-sm sm:text-base font-bold text-white">
                  Live UPI & QR Code Settings
                </h3>
                <p className="text-xs text-slate-400">
                  Target VPA account where students transfer admission fees.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Active UPI VPA Address
                </label>
                <input
                  type="text"
                  required
                  value={upiVpa}
                  onChange={(e) => setUpiVpa(e.target.value)}
                  placeholder="mychseclasses@naviaxis"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs sm:text-sm font-mono text-emerald-400 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Generated dynamic QR codes embed this VPA for PhonePe, GPay, Paytm, Navi, and BHIM UPI scans.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Payee Display Name
                </label>
                <input
                  type="text"
                  required
                  value={payeeDisplayName}
                  onChange={(e) => setPayeeDisplayName(e.target.value)}
                  placeholder="MIHIRCHAND PATRA"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs sm:text-sm text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>

              {/* Live QR Preview Box */}
              <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center gap-3">
                <div className="w-16 h-16 bg-white rounded-lg p-1.5 flex items-center justify-center shrink-0">
                  <QrCode className="w-12 h-12 text-slate-900" />
                </div>
                <div className="text-xs text-slate-300">
                  <p className="font-bold text-white">Live Student QR Format:</p>
                  <p className="font-mono text-emerald-400 text-[11px] truncate">
                    upi://pay?pa={upiVpa}&pn={encodeURIComponent(payeeDisplayName)}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Includes 12-Digit Bank UTR verification requirement in prompt.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* SECTION 2: RAZORPAY CREDENTIALS */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex items-center gap-2.5 pb-2 border-b border-slate-800">
              <CreditCard className="w-5 h-5 text-sky-400" />
              <div>
                <h3 className="text-sm sm:text-base font-bold text-white">
                  Razorpay Live API Integration
                </h3>
                <p className="text-xs text-slate-400">
                  Automated instant checkout & webhook reconciliation.
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Environment Mode
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRazorpayMode('live')}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                      razorpayMode === 'live'
                        ? 'bg-emerald-600 border-emerald-500 text-white'
                        : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                    }`}
                  >
                    ● LIVE PRODUCTION
                  </button>
                  <button
                    type="button"
                    onClick={() => setRazorpayMode('test')}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                      razorpayMode === 'test'
                        ? 'bg-amber-600 border-amber-500 text-white'
                        : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
                    }`}
                  >
                    ◌ SANDBOX TEST
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Razorpay Key ID
                </label>
                <input
                  type="text"
                  value={razorpayKeyId}
                  onChange={(e) => setRazorpayKeyId(e.target.value)}
                  placeholder="rzp_live_..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs sm:text-sm font-mono text-white focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1">
                  Razorpay Key Secret
                </label>
                <input
                  type="password"
                  value={razorpayKeySecret}
                  onChange={(e) => setRazorpayKeySecret(e.target.value)}
                  placeholder="••••••••••••••••••••"
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl p-2.5 text-xs sm:text-sm font-mono text-white focus:ring-2 focus:ring-sky-500 focus:outline-none"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Server-side secret used for verifying webhook signatures upon successful UPI checkout.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* SECTION 3: BATCH PRICING CONTROLLER */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
          <div className="flex items-center gap-2.5 pb-2 border-b border-slate-800">
            <Tag className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="text-sm sm:text-base font-bold text-white">
                Batch Pricing Controller (Odisha CHSE +2 2nd Year 2026-27)
              </h3>
              <p className="text-xs text-slate-400">
                Session 2026-27 Official Pricing: Arts - ₹99 | Science - ₹149 | Commerce - ₹149.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Arts Stream Pricing */}
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                  Arts Stream (+2 2nd Year)
                </span>
                <span className="text-[10px] bg-emerald-500/15 text-emerald-300 px-2 py-0.5 rounded font-semibold">
                  Session 2026-27
                </span>
              </div>
              <div className="space-y-2">
                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">
                    Discounted Offer Fee (₹)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">₹</span>
                    <input
                      type="number"
                      required
                      value={artsPrice}
                      onChange={(e) => setArtsPrice(Number(e.target.value))}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-7 pr-3 py-1.5 text-sm font-bold text-white focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">
                    Original Strike-through Fee (₹)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">₹</span>
                    <input
                      type="number"
                      value={artsOriginal}
                      onChange={(e) => setArtsOriginal(Number(e.target.value))}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-7 pr-3 py-1.5 text-xs text-slate-400 focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Science Stream Pricing */}
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-sky-400 uppercase tracking-wider">
                  Science Stream (+2 2nd Year)
                </span>
                <span className="text-[10px] bg-sky-500/15 text-sky-300 px-2 py-0.5 rounded font-semibold">
                  PCM / PCB 2026
                </span>
              </div>
              <div className="space-y-2">
                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">
                    Discounted Offer Fee (₹)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">₹</span>
                    <input
                      type="number"
                      required
                      value={sciencePrice}
                      onChange={(e) => setSciencePrice(Number(e.target.value))}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-7 pr-3 py-1.5 text-sm font-bold text-white focus:ring-2 focus:ring-sky-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">
                    Original Strike-through Fee (₹)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">₹</span>
                    <input
                      type="number"
                      value={scienceOriginal}
                      onChange={(e) => setScienceOriginal(Number(e.target.value))}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-7 pr-3 py-1.5 text-xs text-slate-400 focus:ring-2 focus:ring-sky-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Commerce Stream Pricing */}
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-xl space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                  Commerce Stream (+2 2nd Year)
                </span>
                <span className="text-[10px] bg-amber-500/15 text-amber-300 px-2 py-0.5 rounded font-semibold">
                  CHSE Commerce 2026
                </span>
              </div>
              <div className="space-y-2">
                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">
                    Discounted Offer Fee (₹)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">₹</span>
                    <input
                      type="number"
                      required
                      value={commercePrice}
                      onChange={(e) => setCommercePrice(Number(e.target.value))}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-7 pr-3 py-1.5 text-sm font-bold text-white focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[11px] font-medium text-slate-400 mb-1">
                    Original Strike-through Fee (₹)
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">₹</span>
                    <input
                      type="number"
                      value={commerceOriginal}
                      onChange={(e) => setCommerceOriginal(Number(e.target.value))}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-7 pr-3 py-1.5 text-xs text-slate-400 focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs sm:text-sm font-semibold flex items-center gap-2 shadow-lg shadow-emerald-950 transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Save & Apply Gateway Configuration</span>
            </button>
          </div>
        </div>
      </form>

      {/* SECTION 4: SYSTEM DIAGNOSTICS & REST API ENDPOINTS TEST TOOL */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="flex items-center gap-2.5 pb-2 border-b border-slate-800">
          <Server className="w-5 h-5 text-purple-400" />
          <div>
            <h3 className="text-sm sm:text-base font-bold text-white">
              System Diagnostics & REST Endpoints Live Test Tool
            </h3>
            <p className="text-xs text-slate-400">
              Verify server health, database connectivity, and administrative API contracts.
            </p>
          </div>
        </div>

        {/* Diagnostics status grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Activity className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[11px] text-slate-400">Server Health</p>
              <p className="text-xs font-bold text-emerald-400">
                {healthStatus ? healthStatus.status?.toUpperCase() : 'CHECKING...'}
              </p>
            </div>
          </div>

          <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center">
              <Server className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[11px] text-slate-400">SAMIS Sync Status</p>
              <p className="text-xs font-bold text-white">Connected (Live)</p>
            </div>
          </div>

          <div className="p-3 bg-slate-950 border border-slate-800 rounded-xl flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center">
              <Key className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[11px] text-slate-400">Admin API Key</p>
              <p className="text-xs font-bold text-purple-300">Active (CHSE_2026)</p>
            </div>
          </div>
        </div>

        {/* Interactive Endpoint Test Buttons */}
        <div>
          <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
            Test Contract Endpoints
          </h4>
          <div className="flex flex-wrap gap-2">
            {[
              { label: 'GET /api/health', url: '/api/health' },
              { label: 'GET /api/admin/config', url: '/api/admin/config' },
              { label: 'GET /api/admin/subjects', url: '/api/admin/subjects' },
              { label: 'GET /api/admin/revenue-stats', url: '/api/admin/revenue-stats' },
            ].map((ep) => (
              <button
                key={ep.url}
                type="button"
                onClick={() => handleTestEndpoint(ep.url)}
                disabled={isTestingApi}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-xs font-mono text-slate-200 flex items-center gap-1.5 transition-colors cursor-pointer disabled:opacity-50"
              >
                <Play className="w-3 h-3 text-emerald-400" />
                <span>{ep.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Test Output terminal */}
        {apiTestResult && (
          <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl font-mono text-xs space-y-1 text-slate-300">
            <div className="flex items-center justify-between text-slate-400 pb-1 border-b border-slate-800">
              <span className="flex items-center gap-1.5 text-emerald-400">
                <Terminal className="w-3.5 h-3.5" />
                <span>Result for: {apiTestResult.endpoint}</span>
              </span>
              <span className={apiTestResult.ok ? 'text-emerald-400' : 'text-rose-400'}>
                Status: {apiTestResult.status}
              </span>
            </div>
            <pre className="overflow-x-auto text-[11px] text-sky-300 pt-1">
              {JSON.stringify(apiTestResult.data || apiTestResult.error, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

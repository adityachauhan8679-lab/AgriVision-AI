import React, { useState } from 'react';
import { Alert } from '../types';
import { alertsApi } from '../services/api';
import {
  Bell,
  AlertTriangle,
  AlertCircle,
  Info,
  CheckCircle2,
  Trash2,
  Check,
  Filter
} from 'lucide-react';

interface Props {
  alerts: Alert[];
  onRefreshAlerts: () => void;
}

export const AlertsPage: React.FC<Props> = ({ alerts, onRefreshAlerts }) => {
  const [filterSeverity, setFilterSeverity] = useState<string>('ALL');

  const filteredAlerts = alerts.filter((alert) => {
    if (filterSeverity === 'ALL') return true;
    return alert.severity === filterSeverity;
  });

  const handleMarkRead = async (id: string) => {
    try {
      await alertsApi.markRead(id);
      onRefreshAlerts();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await alertsApi.delete(id);
      onRefreshAlerts();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-gray-900">Smart Alert Intelligence Hub</h2>
            <span className="bg-red-100 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
              {alerts.filter(a => !a.isRead).length} Unread
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-0.5">
            Real-time threshold triggers across in-situ telemetry and satellite stress anomalies
          </p>
        </div>

        {/* Severity Filter Pills */}
        <div className="flex items-center gap-1 overflow-x-auto rounded-lg bg-gray-100 p-1">
          {['ALL', 'CRITICAL', 'WARNING', 'ADVISORY'].map((sev) => (
            <button
              key={sev}
              type="button"
              onClick={() => setFilterSeverity(sev)}
              className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                filterSeverity === sev
                  ? 'bg-emerald-600 text-white shadow-2xs'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              {sev}
            </button>
          ))}
        </div>
      </div>

      {/* Alerts List */}
      <div className="space-y-3">
        {filteredAlerts.length === 0 ? (
          <div className="grid-card border-dashed border-gray-300 p-10 text-center text-gray-500">
            <CheckCircle2 className="h-7 w-7 text-emerald-500 mx-auto mb-2" />
            <p className="font-bold text-sm text-gray-900">All Parameters Within Tolerance</p>
            <p className="text-xs text-gray-400 mt-0.5">No active alerts match the selected filter category.</p>
          </div>
        ) : (
          filteredAlerts.map((alert) => {
            const isCritical = alert.severity === 'CRITICAL';
            const isWarning = alert.severity === 'WARNING';
            return (
              <div
                key={alert.id}
                className={`p-4 bg-gray-50 rounded-lg border-l-4 transition-colors ${
                  isCritical ? 'border-red-500' : isWarning ? 'border-amber-400' : 'border-blue-500'
                } ${alert.isRead ? 'opacity-70 bg-white border border-gray-200' : 'shadow-xs'}`}
              >
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <span className={`p-1.5 rounded-lg shrink-0 ${
                      isCritical ? 'bg-red-50 text-red-600 border border-red-200' :
                      isWarning ? 'bg-amber-50 text-amber-600 border border-amber-200' :
                      'bg-blue-50 text-blue-600 border border-blue-200'
                    }`}>
                      {isCritical ? <AlertCircle className="h-4 w-4" /> :
                       isWarning ? <AlertTriangle className="h-4 w-4" /> :
                       <Info className="h-4 w-4" />}
                    </span>

                    <div>
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h4 className="font-bold text-gray-900 text-xs">{alert.title}</h4>
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          isCritical ? 'bg-red-100 text-red-800' :
                          isWarning ? 'bg-amber-100 text-amber-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {alert.severity}
                        </span>
                        {alert.zoneId && (
                          <span className="text-[10px] font-medium text-gray-500 bg-gray-200 px-1.5 py-0.5 rounded">
                            {alert.zoneId}
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-gray-700 leading-relaxed">{alert.message}</p>

                      <div className="mt-2 flex items-center gap-2 text-xs bg-white p-2 rounded border border-gray-200 text-gray-800">
                        <strong className="text-gray-900 shrink-0 text-[11px]">Prescribed Action:</strong>
                        <span className="text-[11px] truncate text-gray-600">{alert.action}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Actions */}
                  <div className="flex sm:flex-col items-center sm:items-end justify-between gap-2 shrink-0">
                    <span className="text-[10px] text-gray-400">
                      {new Date(alert.createdAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' })}
                    </span>

                    <div className="flex items-center gap-1">
                      {!alert.isRead && (
                        <button
                          type="button"
                          onClick={() => handleMarkRead(alert.id)}
                          className="flex items-center gap-1 rounded-md border border-gray-300 bg-white px-2 py-1 text-[11px] font-medium text-gray-700 hover:bg-gray-100 shadow-2xs transition-colors"
                          title="Mark as Read"
                        >
                          <Check className="h-3 w-3 text-emerald-600" />
                          <span>Acknowledge</span>
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => handleDelete(alert.id)}
                        className="rounded-md p-1 text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                        title="Delete Alert"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

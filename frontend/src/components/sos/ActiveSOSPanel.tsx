import { motion } from 'framer-motion';
import type { SOSAlert } from '../../types/sos';

interface ActiveSOSPanelProps {
  alerts: SOSAlert[];
  onSelectAlert: (alert: SOSAlert) => void;
  selectedAlertId: string | null;
}

export function ActiveSOSPanel({ alerts, onSelectAlert, selectedAlertId }: ActiveSOSPanelProps) {
  const activeCount = alerts.filter(a => a.status !== 'resolved').length;

  return (
    <div className="glass-card p-6 border-white/[0.04] bg-white/[0.01] flex flex-col gap-4.5 w-full">
      <div className="border-b border-white/[0.06] pb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h3 className="text-[11px] font-black uppercase tracking-widest text-white">
            🚨 Active Distress Surveillance
          </h3>
          {activeCount > 0 && (
            <motion.span
              animate={{ scale: [1, 1.15, 1], opacity: [0.8, 1, 0.8] }}
              transition={{ repeat: Infinity, duration: 1.2 }}
              className="px-2 py-0.5 rounded-full text-[8.5px] font-black bg-red-500 text-white font-mono"
            >
              {activeCount} ACTIVE
            </motion.span>
          )}
        </div>
        
        <span className="text-[8px] font-mono font-bold text-red-500 tracking-widest uppercase">
          [ REAL-TIME RECEIVER ]
        </span>
      </div>

      {alerts.length === 0 ? (
        <div className="py-7 text-center flex flex-col items-center justify-center gap-2 border border-dashed border-white/[0.05] rounded-2xl bg-white/[0.005]">
          <span className="text-xl opacity-75">🟢</span>
          <p className="text-[10px] font-mono tracking-widest text-[var(--color-exoa-text-dim)] uppercase">
            No active distress signals. Building secure.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-2.5 max-h-[220px] overflow-y-auto pr-1">
          {alerts.map((alert) => {
            const isSelected = selectedAlertId === alert.id;
            const isAck = alert.status === 'acknowledged';
            
            return (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                whileHover={{ x: 3 }}
                onClick={() => onSelectAlert(alert)}
                className={`p-3.5 border rounded-xl flex items-center justify-between cursor-pointer transition-all duration-200 ${
                  isSelected
                    ? isAck
                      ? 'bg-amber-500/10 border-amber-500/50 shadow-md shadow-amber-500/5'
                      : 'bg-red-500/10 border-red-500/50 shadow-md shadow-red-500/5'
                    : isAck
                    ? 'bg-amber-500/[0.02] border-amber-500/20 hover:border-amber-500/40 text-amber-100'
                    : 'bg-red-500/[0.01] border-red-500/10 hover:border-red-500/30 text-red-100'
                }`}
              >
                <div className="flex flex-col gap-1 text-[10px]">
                  <div className="flex items-center gap-2">
                    <span className={`font-mono font-bold tracking-wide ${isAck ? 'text-amber-400' : 'text-red-400'}`}>
                      {alert.user_id}
                    </span>
                    <span className="text-[8px] text-[var(--color-exoa-text-dim)] uppercase font-bold font-mono">
                      ID: {alert.id}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-3 text-[9px] text-[var(--color-exoa-text-muted)] font-semibold uppercase tracking-wider">
                    <span>Floor: {alert.current_floor}</span>
                    <span>•</span>
                    <span>Room: {alert.current_node}</span>
                    {alert.emergency_type !== 'general' && (
                      <>
                        <span>•</span>
                        <span className={isAck ? 'text-amber-400/80' : 'text-red-400/80'}>
                          {alert.emergency_type.toUpperCase()}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  <span className="text-[8px] font-mono text-[var(--color-exoa-text-dim)] font-bold">
                    {alert.timestamp}
                  </span>
                  
                  <span className={`px-2 py-0.5 rounded-md text-[7.5px] font-mono font-black uppercase tracking-wider ${
                    isAck
                      ? 'bg-amber-500/10 border border-amber-500/30 text-amber-400'
                      : 'bg-red-500/10 border border-red-500/30 text-red-400 animate-pulse'
                  }`}>
                    {alert.status}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
export default ActiveSOSPanel;

import { motion, AnimatePresence } from 'framer-motion';
import type { SOSAlert } from '../../types/sos';

interface EmergencyAlertFeedProps {
  alerts: SOSAlert[];
  onAcknowledge: (id: string) => void;
  onResolve: (id: string) => void;
  onSelectAlert: (alert: SOSAlert) => void;
}

export function EmergencyAlertFeed({
  alerts,
  onAcknowledge,
  onResolve,
  onSelectAlert,
}: EmergencyAlertFeedProps) {
  const activeAlerts = alerts.filter((a) => a.status !== 'resolved');

  return (
    <div className="glass-card p-6 border-white/[0.04] bg-white/[0.01] flex flex-col gap-4.5 w-full">
      <div className="border-b border-white/[0.06] pb-3 flex items-center justify-between">
        <h3 className="text-[11px] font-black uppercase tracking-widest text-[var(--color-exoa-text-muted)]">
          🔔 Real-Time Distress Alarm Feed
        </h3>
        <span className="text-[8px] font-mono font-bold text-red-500 tracking-widest uppercase">
          [ TELEMETRY FEED ]
        </span>
      </div>

      <div className="flex flex-col gap-3.5 max-h-[360px] overflow-y-auto pr-1">
        <AnimatePresence mode="popLayout">
          {activeAlerts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="py-10 text-center flex flex-col items-center justify-center gap-2 border border-dashed border-white/[0.05] rounded-2xl bg-white/[0.005]"
            >
              <span className="text-2xl select-none">📡</span>
              <p className="text-[10px] font-mono tracking-widest text-[var(--color-exoa-text-dim)] uppercase">
                Monitoring channels silent. All units stand down.
              </p>
            </motion.div>
          ) : (
            activeAlerts.map((alert) => {
              const isAck = alert.status === 'acknowledged';
              
              return (
                <motion.div
                  key={alert.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -15 }}
                  transition={{ duration: 0.35, ease: 'easeOut' }}
                  onClick={() => onSelectAlert(alert)}
                  className={`p-4 border rounded-2xl flex flex-col gap-3.5 relative overflow-hidden transition-all duration-300 ${
                    isAck
                      ? 'border-amber-500/20 bg-amber-500/[0.005] hover:border-amber-500/45'
                      : 'border-red-500/20 bg-red-500/[0.005] hover:border-red-500/45'
                  }`}
                >
                  {/* Glowing vertical status line */}
                  <div className={`absolute top-0 left-0 bottom-0 w-1.5 ${isAck ? 'bg-amber-500' : 'bg-red-500 animate-pulse'}`} />

                  {/* Header Row */}
                  <div className="flex items-start justify-between pl-2">
                    <div className="flex flex-col gap-0.5">
                      <div className="flex items-center gap-2">
                        <span className={`text-[11px] font-mono font-black uppercase tracking-wide ${isAck ? 'text-amber-400' : 'text-red-400 animate-pulse'}`}>
                          🚨 DISTRESS SIGNAL DETECTED
                        </span>
                      </div>
                      <span className="text-[9px] text-[var(--color-exoa-text-dim)] font-mono font-extrabold uppercase">
                        USER REFERENCE: {alert.user_id} • ID: {alert.id}
                      </span>
                    </div>

                    <span className="text-[8.5px] font-mono font-bold text-[var(--color-exoa-text-dim)] bg-white/5 px-2.5 py-0.5 rounded-full select-none">
                      {alert.timestamp}
                    </span>
                  </div>

                  {/* Details Section */}
                  <div className="grid grid-cols-3 gap-2 pl-2 text-[10px] uppercase font-bold text-[var(--color-exoa-text-muted)] font-mono">
                    <div className="bg-[#0a0d1a]/60 px-3 py-2 rounded-xl border border-white/[0.03] flex flex-col gap-0.5">
                      <span className="text-[7.5px] text-[var(--color-exoa-text-dim)]">FLOOR LEVEL</span>
                      <span className="text-white text-xs">{alert.current_floor}F</span>
                    </div>
                    <div className="bg-[#0a0d1a]/60 px-3 py-2 rounded-xl border border-white/[0.03] flex flex-col gap-0.5">
                      <span className="text-[7.5px] text-[var(--color-exoa-text-dim)]">CHECKPOINT</span>
                      <span className="text-white text-xs">{alert.current_node}</span>
                    </div>
                    <div className="bg-[#0a0d1a]/60 px-3 py-2 rounded-xl border border-white/[0.03] flex flex-col gap-0.5">
                      <span className="text-[7.5px] text-[var(--color-exoa-text-dim)]">CATEGORY</span>
                      <span className={`text-xs ${isAck ? 'text-amber-400' : 'text-red-400'}`}>
                        {alert.emergency_type}
                      </span>
                    </div>
                  </div>

                  {/* Actions Section */}
                  <div className="flex items-center gap-2.5 pl-2 pt-1 border-t border-white/[0.03] z-10">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectAlert(alert);
                      }}
                      className="px-4.5 py-2 text-[8px] font-mono font-black tracking-widest uppercase text-white/70 hover:text-white bg-white/5 hover:bg-white/10 rounded-full cursor-pointer transition-all border border-white/5"
                    >
                      LOCATE
                    </button>
                    
                    {!isAck && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onAcknowledge(alert.id);
                        }}
                        className="px-4.5 py-2 text-[8px] font-mono font-black tracking-widest uppercase text-[#070913] bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600 rounded-full cursor-pointer transition-all border border-amber-300/10"
                      >
                        ACKNOWLEDGE
                      </button>
                    )}

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onResolve(alert.id);
                      }}
                      className="px-4.5 py-2 text-[8px] font-mono font-black tracking-widest uppercase text-white bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 rounded-full cursor-pointer transition-all border border-emerald-400/20"
                    >
                      RESOLVE
                    </button>
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
export default EmergencyAlertFeed;

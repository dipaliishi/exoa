import { motion } from 'framer-motion';
import type { SOSAlert } from '../../types/sos';

interface SOSStatusIndicatorProps {
  alert: SOSAlert | null;
  localStatus: string;
  onCancel: () => void;
}

export function SOSStatusIndicator({ alert, localStatus, onCancel }: SOSStatusIndicatorProps) {
  if (localStatus === 'idle') return null;

  const isAcknowledged = alert?.status === 'acknowledged';
  const isResolved = localStatus === 'resolved';

  const getIndicatorStyle = () => {
    if (isResolved) {
      return 'border-emerald-500/20 bg-emerald-500/[0.02] text-emerald-400';
    }
    if (isAcknowledged) {
      return 'border-amber-500/25 bg-amber-500/[0.02] text-amber-400';
    }
    return 'border-red-500/25 bg-red-500/[0.02] text-red-400';
  };

  const getHeadingText = () => {
    if (isResolved) return '🟢 EMERGENCY DISTRESS RESOLVED';
    if (isAcknowledged) return '⚠️ ADMINISTRATOR ACKNOWLEDGED';
    return '🚨 EMERGENCY DISTRESS TRANSMITTING';
  };

  const getDescriptionText = () => {
    if (isResolved) {
      return 'Operations control has marked your situation as resolved. State resetting...';
    }
    if (isAcknowledged) {
      return 'First responder dispatch initiated. Hold your position, help is on the way!';
    }
    return `SOS Broadcast active from node ${alert?.current_node} (Floor ${alert?.current_floor}). Operations team notified.`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98, y: -10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.98, y: -10 }}
      className={`p-4.5 border rounded-2xl flex flex-col gap-2.5 shadow-lg select-none relative overflow-hidden ${getIndicatorStyle()}`}
    >
      {/* Absolute pulsing background glow */}
      {!isResolved && (
        <div
          className={`absolute inset-0 opacity-5 pointer-events-none ${
            isAcknowledged ? 'bg-amber-500 animate-pulse' : 'bg-red-500 animate-pulse'
          }`}
        />
      )}

      <div className="flex items-center justify-between z-10">
        <span className="text-[9px] font-mono font-black tracking-widest uppercase">
          {getHeadingText()}
        </span>
        
        {/* Connection health indicator */}
        {!isResolved && (
          <div className="flex items-center gap-1.5">
            <span className={`w-1.5 h-1.5 rounded-full animate-pulse ${isAcknowledged ? 'bg-amber-400' : 'bg-red-500'}`} />
            <span className="text-[8px] font-mono tracking-widest font-extrabold uppercase opacity-85">LIVE LINK</span>
          </div>
        )}
      </div>

      <div className="flex items-end justify-between gap-4 z-10">
        <p className="text-[10.5px] uppercase tracking-wide leading-relaxed font-semibold opacity-90 max-w-sm">
          {getDescriptionText()}
        </p>

        {/* Local Cancel button (in case of accidental triggers) */}
        {!isResolved && (
          <button
            onClick={onCancel}
            className="px-3.5 py-1.5 text-[8.5px] font-mono tracking-widest font-black uppercase text-white/60 hover:text-white bg-white/5 hover:bg-white/10 border border-white/5 rounded-full cursor-pointer transition-all shrink-0"
          >
            CANCEL ALERT
          </button>
        )}
      </div>
    </motion.div>
  );
}
export default SOSStatusIndicator;

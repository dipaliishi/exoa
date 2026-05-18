import { motion } from 'framer-motion';
import type { ConnectionStatus } from '../../services/websocket';

interface StatusPillProps {
  status: ConnectionStatus;
}

export function StatusPill({ status }: StatusPillProps) {
  const configs = {
    connecting: {
      color: 'bg-amber-400',
      text: 'SYSTEM SCANNING',
    },
    connected: {
      color: 'bg-green-400',
      text: 'LIVE CONNECTION',
    },
    disconnected: {
      color: 'bg-red-400',
      text: 'STANDBY MODE',
    },
  };

  const current = configs[status];

  return (
    <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-full border border-white/[0.04] bg-white/[0.02] backdrop-blur-md select-none">
      <motion.div
        className={`w-1.5 h-1.5 rounded-full ${current.color} shadow-[0_0_8px_rgba(255,255,255,0.2)]`}
        animate={
          status !== 'connected'
            ? { opacity: [1, 0.3, 1] }
            : { scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }
        }
        transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
      />
      <span className="text-[9px] font-mono font-semibold tracking-widest text-[var(--color-exoa-text-dim)] uppercase">
        {current.text}
      </span>
    </div>
  );
}

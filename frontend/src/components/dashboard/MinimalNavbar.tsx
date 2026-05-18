import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { StatusPill } from './StatusPill';
import type { ConnectionStatus } from '../../services/websocket';

interface MinimalNavbarProps {
  wsStatus: ConnectionStatus;
  currentNodeId: string | null;
}

export function MinimalNavbar({ wsStatus, currentNodeId }: MinimalNavbarProps) {
  const navigate = useNavigate();

  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="z-50 w-full px-8 py-4 flex items-center justify-between gap-4 border-b border-white/[0.03] bg-[var(--color-exoa-bg)]/30 backdrop-blur-xl relative"
    >
      {/* Brand logo & caption */}
      <div className="flex items-center gap-3 cursor-pointer select-none" onClick={() => navigate('/')}>
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 to-amber-600 flex items-center justify-center shadow-lg shadow-red-500/10">
          <span className="text-white font-extrabold text-base tracking-tighter">EX</span>
        </div>
        <div>
          <span className="text-[11px] font-black tracking-widest uppercase text-white block">
            EXOA
          </span>
          <span className="text-[8px] text-[var(--color-exoa-text-dim)] uppercase tracking-widest font-bold">
            Emergency Command
          </span>
        </div>
      </div>

      {/* Center status and controls */}
      <div className="flex items-center gap-4">
        <StatusPill status={wsStatus} />
        
        <button
          onClick={() => navigate('/nav' + (currentNodeId ? `?node=${currentNodeId}` : ''))}
          className="btn-primary py-1.5 px-4 text-[9px] tracking-widest uppercase font-bold flex items-center gap-1.5 bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-white/20 transition-all rounded-full shadow-none"
        >
          <span>LARGE MAP</span>
        </button>
      </div>
    </motion.header>
  );
}

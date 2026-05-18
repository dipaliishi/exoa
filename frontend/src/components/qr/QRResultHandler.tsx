import { motion } from 'framer-motion';
import type { GraphNode } from '../../types';

interface QRResultHandlerProps {
  successNode: GraphNode | null;
  scanError: string | null;
  onReset: () => void;
}

export function QRResultHandler({ successNode, scanError, onReset }: QRResultHandlerProps) {
  if (!successNode && !scanError) return null;

  const floorNames = ['Ground Floor', 'First Floor', 'Second Floor', 'Third Floor'];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      className="w-full sm:max-w-md mx-auto"
    >
      {successNode && (
        <div className="glass-card p-5 border border-green-500/20 bg-green-500/[0.01] rounded-2xl flex flex-col gap-4 text-center items-center">
          {/* Animated success radar icon */}
          <div className="w-12 h-12 rounded-full bg-green-500/10 border border-green-500/30 flex items-center justify-center relative">
            <span className="text-green-400 text-lg select-none">✓</span>
            <div className="absolute inset-0 rounded-full border border-green-500/40 animate-ping opacity-25" />
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-[9px] font-mono tracking-widest text-green-500 font-bold uppercase">
              CHECKPOINT ALIGNMENT LOCKED
            </span>
            <h4 className="text-sm font-bold text-white mt-1">
              {successNode.label || successNode.id}
            </h4>
            <span className="text-[9px] text-[var(--color-exoa-text-dim)] uppercase tracking-wider font-semibold opacity-90">
              Level {successNode.floor} — {floorNames[successNode.floor] || 'Corridor Area'}
            </span>
          </div>

          <p className="text-[10px] text-green-400/80 leading-relaxed font-semibold uppercase tracking-wider">
            ⚡ Evacuation routing activated. Finding safe exits...
          </p>

          <button
            onClick={onReset}
            className="w-full py-2 bg-green-500/10 hover:bg-green-500/20 text-green-400 border border-green-500/20 font-bold font-mono text-[9px] tracking-widest uppercase rounded-full cursor-pointer transition-all mt-2"
          >
            [ RE-SCAN NEW LOCATION ]
          </button>
        </div>
      )}

      {scanError && (
        <div className="glass-card p-5 border border-red-500/20 bg-red-500/[0.01] rounded-2xl flex flex-col gap-4 text-center items-center">
          {/* Danger warning icon */}
          <div className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/30 flex items-center justify-center">
            <span className="text-red-400 text-lg select-none">⚠</span>
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-[9px] font-mono tracking-widest text-red-500 font-bold uppercase">
              PHYSICAL QR SIGNAL ERROR
            </span>
            <p className="text-[10px] text-[var(--color-exoa-text-dim)] leading-relaxed mt-1.5 opacity-90 max-w-[260px]">
              {scanError}
            </p>
          </div>

          <button
            onClick={onReset}
            className="w-full py-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 font-bold font-mono text-[9px] tracking-widest uppercase rounded-full cursor-pointer transition-all mt-2"
          >
            [ RETRY CHECKPOINT SCAN ]
          </button>
        </div>
      )}
    </motion.div>
  );
}
export default QRResultHandler;

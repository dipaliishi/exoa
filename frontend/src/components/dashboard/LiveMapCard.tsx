import { motion } from 'framer-motion';
import { FloorMap } from '../FloorMap';
import type { NavigationState } from '../../types';

interface LiveMapCardProps {
  navState: NavigationState;
  routeSVGPath: string;
  isCalculating: boolean;
  floorLevel: number;
}

export function LiveMapCard({
  navState,
  routeSVGPath,
  isCalculating,
  floorLevel,
}: LiveMapCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="glass-card overflow-hidden border border-white/[0.04] bg-white/[0.01] flex flex-col h-[520px] xl:h-[640px] shadow-2xl relative"
    >
      {/* Map telemetry overlay */}
      <div className="absolute top-6 left-6 z-20 flex items-center gap-2.5 pointer-events-none select-none">
        <div className="glass-card px-3 py-1.5 border-white/[0.04] bg-[var(--color-exoa-bg)]/60 text-[9px] font-mono font-bold text-red-400 tracking-widest uppercase">
          LIVE MAP PREVIEW
        </div>
        <div className="glass-card px-3 py-1.5 border-white/[0.04] bg-[var(--color-exoa-bg)]/60 text-[9px] font-mono font-bold text-white tracking-widest uppercase">
          LEVEL {floorLevel}
        </div>
      </div>

      <div className="absolute top-6 right-6 z-20 pointer-events-none select-none">
        <div className="glass-card px-3 py-1.5 border-white/[0.04] bg-[var(--color-exoa-bg)]/60 text-[9px] font-mono font-bold text-[var(--color-exoa-text-dim)] tracking-widest uppercase">
          DRAG TO PAN • PINCH TO ZOOM
        </div>
      </div>

      {/* Embedded interactive map */}
      <div className="flex-grow relative bg-[var(--color-exoa-bg)]">
        <FloorMap
          navState={navState}
          routeSVGPath={routeSVGPath}
          isCalculating={isCalculating}
        />
      </div>
    </motion.div>
  );
}

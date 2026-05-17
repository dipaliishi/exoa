import { motion } from 'framer-motion';

interface ZoomControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onReset: () => void;
  scale: number;
}

/**
 * Map zoom controls overlay with zoom in, zoom out, and reset buttons.
 */
export function ZoomControls({ onZoomIn, onZoomOut, onReset, scale }: ZoomControlsProps) {
  return (
    <motion.div
      className="absolute bottom-6 right-6 flex flex-col gap-2 z-20"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.5 }}
    >
      {/* Zoom In */}
      <button
        onClick={onZoomIn}
        className="w-11 h-11 glass-card flex items-center justify-center text-[var(--color-exoa-text)] hover:text-[var(--color-exoa-accent)] hover:border-[var(--color-exoa-accent)] transition-all duration-200 text-lg font-bold cursor-pointer"
        title="Zoom In"
        id="zoom-in-btn"
      >
        +
      </button>

      {/* Zoom Level */}
      <div className="w-11 h-8 glass-card flex items-center justify-center text-[var(--color-exoa-text-muted)] text-[10px] font-mono">
        {Math.round(scale * 100)}%
      </div>

      {/* Zoom Out */}
      <button
        onClick={onZoomOut}
        className="w-11 h-11 glass-card flex items-center justify-center text-[var(--color-exoa-text)] hover:text-[var(--color-exoa-accent)] hover:border-[var(--color-exoa-accent)] transition-all duration-200 text-lg font-bold cursor-pointer"
        title="Zoom Out"
        id="zoom-out-btn"
      >
        −
      </button>

      {/* Reset */}
      <button
        onClick={onReset}
        className="w-11 h-11 glass-card flex items-center justify-center text-[var(--color-exoa-text)] hover:text-[var(--color-exoa-warning)] hover:border-[var(--color-exoa-warning)] transition-all duration-200 text-sm cursor-pointer"
        title="Reset View"
        id="reset-view-btn"
      >
        ⟲
      </button>
    </motion.div>
  );
}

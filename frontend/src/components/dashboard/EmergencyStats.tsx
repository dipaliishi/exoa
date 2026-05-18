import { motion } from 'framer-motion';
import type { GraphNode } from '../../types';

interface EmergencyStatsProps {
  currentNode: GraphNode | null;
  targetExit: GraphNode | null;
  distance: number;
  formattedTime: string;
  isCalculating: boolean;
}

export function EmergencyStats({
  currentNode,
  targetExit,
  distance,
  formattedTime,
  isCalculating,
}: EmergencyStatsProps) {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 100 } },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="grid grid-cols-2 gap-x-8 gap-y-10"
    >
      {/* Current Node */}
      <motion.div variants={itemVariants} className="flex flex-col gap-1.5">
        <span className="text-[9px] font-mono tracking-widest text-[var(--color-exoa-text-dim)] uppercase">
          [ 01 / CURRENT LOCATION ]
        </span>
        <span className="text-2xl font-semibold tracking-tight text-white truncate">
          {currentNode?.label || 'Not Detected'}
        </span>
        <span className="text-[9px] font-mono text-[var(--color-exoa-text-dim)] uppercase tracking-wider mt-0.5">
          ID: {currentNode?.id || '—'}
        </span>
      </motion.div>

      {/* Current Floor */}
      <motion.div variants={itemVariants} className="flex flex-col gap-1.5">
        <span className="text-[9px] font-mono tracking-widest text-[var(--color-exoa-text-dim)] uppercase">
          [ 02 / ACTIVE LEVEL ]
        </span>
        <span className="text-2xl font-semibold tracking-tight text-white">
          {currentNode !== null
            ? currentNode.floor === 0
              ? 'Ground Floor'
              : `Level ${currentNode.floor}`
            : 'Level 1'}
        </span>
        <span className="text-[9px] font-mono text-[var(--color-exoa-text-dim)] uppercase tracking-wider mt-0.5">
          Surveillance Active
        </span>
      </motion.div>

      {/* Exit Distance */}
      <motion.div variants={itemVariants} className="flex flex-col gap-1.5">
        <span className="text-[9px] font-mono tracking-widest text-[var(--color-exoa-text-dim)] uppercase">
          [ 03 / ROUTE GAP ]
        </span>
        {isCalculating ? (
          <div className="h-8 w-24 bg-white/5 animate-pulse rounded-md mt-1" />
        ) : (
          <span className="text-2xl font-semibold tracking-tight text-red-400 font-mono">
            {distance > 0 ? `${distance} units` : 'No route'}
          </span>
        )}
        <span className="text-[9px] font-mono text-[var(--color-exoa-text-dim)] uppercase tracking-wider mt-0.5 truncate">
          Target: {targetExit?.label || '—'}
        </span>
      </motion.div>

      {/* Est. Evacuation Time */}
      <motion.div variants={itemVariants} className="flex flex-col gap-1.5">
        <span className="text-[9px] font-mono tracking-widest text-[var(--color-exoa-text-dim)] uppercase">
          [ 04 / EST. EVAC TIME ]
        </span>
        {isCalculating ? (
          <div className="h-8 w-24 bg-white/5 animate-pulse rounded-md mt-1" />
        ) : (
          <span className="text-2xl font-semibold tracking-tight text-amber-500 font-mono">
            {formattedTime !== 'N/A' ? formattedTime : '—'}
          </span>
        )}
        <span className="text-[9px] font-mono text-[var(--color-exoa-text-dim)] uppercase tracking-wider mt-0.5">
          Speed Constant: 1.4m/s
        </span>
      </motion.div>
    </motion.div>
  );
}

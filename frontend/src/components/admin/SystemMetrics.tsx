import { motion } from 'framer-motion';

interface SystemMetricsProps {
  wsStatus: string;
  blockedCount: number;
  simulatedUsers: number;
  systemStatus: string;
}

export function SystemMetrics({
  wsStatus,
  blockedCount,
  simulatedUsers,
  systemStatus,
}: SystemMetricsProps) {
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
    show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 120 } },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full"
    >
      {/* Network link state */}
      <motion.div variants={itemVariants} className="glass-card p-5 border-white/[0.04] bg-white/[0.01]">
        <span className="text-[8px] font-mono tracking-widest text-[var(--color-exoa-text-dim)] uppercase block">
          [ 01 / LINK LINK STATUS ]
        </span>
        <span className={`text-xl font-bold font-mono tracking-tight block mt-2 ${
          wsStatus === 'connected' ? 'text-green-400' : wsStatus === 'connecting' ? 'text-amber-400' : 'text-red-400'
        }`}>
          {wsStatus.toUpperCase()}
        </span>
        <span className="text-[8px] font-mono text-[var(--color-exoa-text-dim)] uppercase tracking-wider block mt-1">
          Socket Stream Active
        </span>
      </motion.div>

      {/* Corridor hazards block */}
      <motion.div variants={itemVariants} className="glass-card p-5 border-white/[0.04] bg-white/[0.01]">
        <span className="text-[8px] font-mono tracking-widest text-[var(--color-exoa-text-dim)] uppercase block">
          [ 02 / ACTIVE HAZARDS ]
        </span>
        <span className={`text-xl font-bold font-mono tracking-tight block mt-2 ${
          blockedCount > 0 ? 'text-red-400' : 'text-green-400'
        }`}>
          {blockedCount} BLOCKAGES
        </span>
        <span className="text-[8px] font-mono text-[var(--color-exoa-text-dim)] uppercase tracking-wider block mt-1">
          Obstructed Vertices
        </span>
      </motion.div>

      {/* Simulated User routes active */}
      <motion.div variants={itemVariants} className="glass-card p-5 border-white/[0.04] bg-white/[0.01]">
        <span className="text-[8px] font-mono tracking-widest text-[var(--color-exoa-text-dim)] uppercase block">
          [ 03 / SIMULATED USERS ]
        </span>
        <span className="text-xl font-bold font-mono tracking-tight text-white block mt-2">
          {simulatedUsers} PATHWAYS
        </span>
        <span className="text-[8px] font-mono text-[var(--color-exoa-text-dim)] uppercase tracking-wider block mt-1">
          Estimated Active Pings
        </span>
      </motion.div>

      {/* System security threat state */}
      <motion.div variants={itemVariants} className="glass-card p-5 border-white/[0.04] bg-white/[0.01]">
        <span className="text-[8px] font-mono tracking-widest text-[var(--color-exoa-text-dim)] uppercase block">
          [ 04 / EXOA SYSTEM STATE ]
        </span>
        <span className={`text-xl font-bold font-mono tracking-tight block mt-2 ${
          systemStatus === 'evacuation' ? 'text-red-400 animate-pulse' : systemStatus === 'alert' ? 'text-amber-400' : 'text-blue-400'
        }`}>
          {systemStatus.toUpperCase()}
        </span>
        <span className="text-[8px] font-mono text-[var(--color-exoa-text-dim)] uppercase tracking-wider block mt-1">
          Safety Security Index
        </span>
      </motion.div>
    </motion.div>
  );
}

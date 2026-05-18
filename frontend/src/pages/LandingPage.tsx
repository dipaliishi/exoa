import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export function LandingPage() {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring' as const, stiffness: 100 } },
  };

  return (
    <div className="min-h-screen bg-[#070913] text-white flex flex-col justify-between relative overflow-hidden font-sans">
      {/* Background Grid & Breathing Crimson Glow */}
      <div className="animated-grid" />
      <div className="ambient-red-glow ambient-breathing-glow animate-pulse" />

      {/* Top minimalistic header */}
      <header className="z-10 px-8 py-6 max-w-[1400px] w-full mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3 select-none">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 to-amber-600 flex items-center justify-center shadow-lg shadow-red-500/10">
            <span className="text-white font-extrabold text-base tracking-tighter">EX</span>
          </div>
          <div>
            <span className="text-[11px] font-black tracking-widest uppercase text-white block">
              EXOA
            </span>
            <span className="text-[8px] text-[var(--color-exoa-text-dim)] uppercase tracking-widest font-bold">
              Safety Console
            </span>
          </div>
        </div>
        <span className="text-[9px] font-mono text-[var(--color-exoa-text-dim)] uppercase tracking-widest font-bold border border-white/[0.04] bg-white/[0.01] px-3 py-1 rounded-full">
          SURVEILLANCE ACTIVE
        </span>
      </header>

      {/* Main hero options panel */}
      <main className="z-10 flex-grow flex items-center justify-center px-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="max-w-4xl w-full flex flex-col items-center gap-12"
        >
          {/* Main Hero Copy */}
          <motion.div variants={itemVariants} className="text-center flex flex-col gap-4">
            <span className="text-[9px] font-mono font-bold tracking-widest text-red-500 uppercase">
              🚀 INDOOR EMERGENCY NAVIGATION NETWORK
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.05] max-w-2xl mx-auto">
              When seconds matter,<br />
              find the safest exit instantly.
            </h1>
            <p className="text-xs md:text-sm text-[var(--color-exoa-text-dim)] max-w-lg mx-auto leading-relaxed mt-2 opacity-95">
              Enterprise spatial navigation calculation providing real-time multi-floor corridor mapping, sensor logs, and active hazard broadcasts.
            </p>
          </motion.div>

          {/* Core Panel Cards */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-3xl">
            {/* User Evacuation Portal */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/dashboard')}
              className="glass-card border border-white/[0.04] bg-white/[0.01] hover:border-blue-500/20 hover:bg-blue-500/[0.01] p-8 flex flex-col justify-between gap-6 cursor-pointer group transition-all rounded-3xl"
            >
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-mono tracking-widest text-blue-400 font-bold uppercase">
                    [ PORTAL A / USER ]
                  </span>
                  <span className="text-lg opacity-80 group-hover:scale-110 transition-transform select-none">🗺️</span>
                </div>
                <h3 className="text-xl font-semibold text-white tracking-tight">
                  Evacuation Portal
                </h3>
                <p className="text-[11px] text-[var(--color-exoa-text-dim)] leading-relaxed opacity-90">
                  Access real-time navigation paths, floor plan maps, staircase transitions, and immediate safety routing indicators.
                </p>
              </div>
              <button className="w-full py-3 bg-white/5 group-hover:bg-blue-500/10 text-white group-hover:text-blue-400 font-bold text-[10px] tracking-widest uppercase rounded-full border border-white/10 group-hover:border-blue-500/20 transition-all">
                ENTER USER PORTAL
              </button>
            </motion.div>

            {/* Admin Control Center */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/admin')}
              className="glass-card border border-white/[0.04] bg-white/[0.01] hover:border-red-500/20 hover:bg-red-500/[0.01] p-8 flex flex-col justify-between gap-6 cursor-pointer group transition-all rounded-3xl"
            >
              <div className="flex flex-col gap-3">
                <div className="flex items-center justify-between">
                  <span className="text-[9px] font-mono tracking-widest text-red-400 font-bold uppercase">
                    [ PORTAL B / COMMAND ]
                  </span>
                  <span className="text-lg opacity-80 group-hover:scale-110 transition-transform select-none">🚨</span>
                </div>
                <h3 className="text-xl font-semibold text-white tracking-tight">
                  Operations Control
                </h3>
                <p className="text-[11px] text-[var(--color-exoa-text-dim)] leading-relaxed opacity-90">
                  Manage active building threats, block/unblock spatial corridors, track live metrics, and log websocket emergency signals.
                </p>
              </div>
              <button className="w-full py-3 bg-white/5 group-hover:bg-red-500/10 text-white group-hover:text-red-400 font-bold text-[10px] tracking-widest uppercase rounded-full border border-white/10 group-hover:border-red-500/20 transition-all">
                ENTER CONTROL CENTER
              </button>
            </motion.div>
          </motion.div>

          {/* Original Home/Scan Link */}
          <motion.div
            variants={itemVariants}
            onClick={() => navigate('/scan')}
            className="flex items-center gap-1.5 text-[10px] text-[var(--color-exoa-text-dim)] hover:text-white cursor-pointer select-none transition-all uppercase tracking-widest font-bold border border-white/[0.03] bg-white/[0.01] px-4.5 py-2 rounded-full"
          >
            <span>📷 DOOR SCANNING INSTRUCTIONS</span>
          </motion.div>
        </motion.div>
      </main>

      {/* Cinematic Operations Footer */}
      <footer className="z-10 border-t border-white/[0.03] bg-[#070913]/90 backdrop-blur-md py-4 px-8 text-center text-[8px] text-[var(--color-exoa-text-dim)] font-mono tracking-widest select-none">
        <div className="max-w-[1400px] w-full mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>EXOA ENGINE v2.0 • PATENTS REGISTERED</span>
          <span>© 2026 EXOA SAFETY PLATFORM</span>
        </div>
      </footer>
    </div>
  );
}

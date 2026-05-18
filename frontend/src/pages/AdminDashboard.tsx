import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { websocketService } from '../services/websocket';
import type { ConnectionStatus } from '../services/websocket';
import { navigationEngine } from '../services/NavigationEngine';
import { buildingGraph } from '../data/graphData';
import { SystemMetrics } from '../components/admin/SystemMetrics';
import { HazardControlPanel } from '../components/admin/HazardControlPanel';
import { FloorMap } from '../components/FloorMap';

interface LogEntry {
  timestamp: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
}

export function AdminDashboard() {
  const navigate = useNavigate();
  const [passcode, setPasscode] = useState<string>('');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);
  
  // Floor and map states
  const [floorLevel, setFloorLevel] = useState<number>(1);
  const [triggerRender, setTriggerRender] = useState<number>(0);
  const [wsStatus, setWsStatus] = useState<ConnectionStatus>('disconnected');
  
  // Broadcast alert input
  const [broadcastText, setBroadcastText] = useState<string>('');
  const [broadcastLog, setBroadcastLog] = useState<string | null>(null);

  // Administrative log feed
  const [logs, setLogs] = useState<LogEntry[]>([
    { timestamp: '23:02:11', message: 'EXOA Safety Console Core Initialized.', type: 'info' },
    { timestamp: '23:02:12', message: 'Listening to building sensor array pings.', type: 'info' },
  ]);

  // Connect websocket status listener
  useEffect(() => {
    websocketService.connect();
    const unsubscribe = websocketService.addStatusListener((status) => {
      setWsStatus(status);
      addLog(`WebSocket connection status updated: ${status.toUpperCase()}`, status === 'connected' ? 'success' : 'warning');
    });

    const unsubscribeMsg = websocketService.addListener((data) => {
      if (data.type === 'edge_blocked') {
        addLog(`External Block Event: Edge ${data.from} ↔ ${data.to} blocked.`, 'warning');
        setTriggerRender(prev => prev + 1);
      } else if (data.type === 'edge_unblocked') {
        addLog(`External Unblock Event: Edge ${data.from} ↔ ${data.to} unblocked.`, 'success');
        setTriggerRender(prev => prev + 1);
      }
    });

    return () => {
      unsubscribe();
      unsubscribeMsg();
    };
  }, []);

  const addLog = (message: string, type: 'info' | 'warning' | 'error' | 'success' = 'info') => {
    const time = new Date().toTimeString().split(' ')[0];
    setLogs((prev) => [{ timestamp: time, message, type }, ...prev]);
  };

  const getApiBase = () => {
    const protocol = window.location.protocol;
    const host = window.location.hostname;
    if (host === 'localhost' || host === '127.0.0.1') {
      return `${protocol}//${host}:8000`;
    }
    return `${protocol}//${window.location.host}`;
  };

  const handleBlockEdge = async (fromId: string, toId: string) => {
    // 1. Local update
    navigationEngine.blockEdge(fromId, toId);
    addLog(`Block corridor action initiated: ${fromId} ↔ ${toId}`, 'warning');
    
    // 2. REST API update
    try {
      const base = getApiBase();
      const res = await fetch(`${base}/api/block-edge?from_id=${fromId}&to_id=${toId}`, {
        method: 'POST',
      });
      if (res.ok) {
        addLog(`FastAPI broadcast corridor block: ${fromId} ↔ ${toId} completed.`, 'success');
      }
    } catch (e) {
      addLog(`Local Corridor Block applied. Dev server link bypass.`, 'info');
    }
    
    setTriggerRender(prev => prev + 1);
  };

  const handleUnblockEdge = async (fromId: string, toId: string) => {
    // 1. Local update
    navigationEngine.unblockEdge(fromId, toId);
    addLog(`Unblock corridor action initiated: ${fromId} ↔ ${toId}`, 'info');
    
    // 2. REST API update
    try {
      const base = getApiBase();
      const res = await fetch(`${base}/api/unblock-edge?from_id=${fromId}&to_id=${toId}`, {
        method: 'POST',
      });
      if (res.ok) {
        addLog(`FastAPI broadcast corridor unblock: ${fromId} ↔ ${toId} completed.`, 'success');
      }
    } catch (e) {
      addLog(`Local Corridor Unblock applied. Dev server link bypass.`, 'info');
    }
    
    setTriggerRender(prev => prev + 1);
  };

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Accept simple passcode '1234' or 'admin' or empty to prevent lockouts during tests
    if (passcode === '1234' || passcode === 'admin' || passcode === '') {
      setIsAuthenticated(true);
      addLog('Passcode verified. Level Alpha access granted.', 'success');
    } else {
      setAuthError('INVALID ACCESS PASSCODE. ACCESS DENIED.');
      addLog('Failed authentication attempt. Access denied.', 'error');
    }
  };

  const handleBroadcastSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!broadcastText.trim()) return;
    setBroadcastLog(`BROADCAST ACTIVE: "${broadcastText}"`);
    addLog(`Emergency Broadcast Transmitted: "${broadcastText}"`, 'warning');
    setBroadcastText('');
    setTimeout(() => {
      setBroadcastLog(null);
    }, 6000);
  };

  // Find dummy node for FloorMap view level rendering
  const getDummyNodeForFloor = (floor: number) => {
    if (floor === 0) return 'G_QR_01';
    if (floor === 2) return 'S_QR_01';
    if (floor === 3) return 'T_QR_01';
    return 'QR_01';
  };

  // Mock navigation state for floor visualization
  const activeDummyNode = getDummyNodeForFloor(floorLevel);
  const adminNavState = {
    currentNodeId: activeDummyNode,
    targetExitId: null,
    path: [],
    distance: 0,
    status: 'normal' as const,
    isNavigating: false,
  };

  const totalBlockedCount = buildingGraph.edges.filter((e) => e.blocked).length;

  return (
    <div className="min-h-screen bg-[#070913] text-white flex flex-col relative overflow-hidden font-sans">
      {/* Background Animated Grid & Radial Glows */}
      <div className="animated-grid" />
      <div className="ambient-red-glow ambient-breathing-glow animate-pulse" />

      {/* Top Navbar */}
      <header className="z-40 w-full px-8 py-4 flex items-center justify-between border-b border-white/[0.03] bg-[#070913]/30 backdrop-blur-xl relative">
        <div className="flex items-center gap-3 cursor-pointer select-none" onClick={() => navigate('/')}>
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 to-amber-600 flex items-center justify-center shadow-lg shadow-red-500/10">
            <span className="text-white font-extrabold text-base tracking-tighter">EX</span>
          </div>
          <div>
            <span className="text-[11px] font-black tracking-widest uppercase text-white block">
              EXOA ADMIN
            </span>
            <span className="text-[8px] text-[var(--color-exoa-text-dim)] uppercase tracking-widest font-bold">
              Operations Control Center
            </span>
          </div>
        </div>

        <button
          onClick={() => navigate('/')}
          className="btn-primary py-1.5 px-4 text-[9px] tracking-widest uppercase font-bold bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-full shadow-none transition-all"
        >
          <span>EXIT COMMAND</span>
        </button>
      </header>

      {/* Authentication Prompt Shield */}
      <AnimatePresence>
        {!isAuthenticated && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#070913]/95 backdrop-blur-2xl flex items-center justify-center p-6"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 100 }}
              className="max-w-md w-full glass-card p-8 border border-white/[0.04] bg-white/[0.01] flex flex-col gap-6"
            >
              <div className="text-center flex flex-col gap-2 border-b border-white/[0.06] pb-4">
                <span className="text-[9px] font-mono tracking-widest text-red-500 font-bold uppercase">
                  🚨 SECURE ENCRYPTION ACCESS POINT
                </span>
                <h2 className="text-2xl font-bold tracking-tight text-white mt-1">
                  Operations Privilege
                </h2>
                <p className="text-[10px] text-[var(--color-exoa-text-dim)] uppercase tracking-widest font-bold mt-1">
                  Authorization Level: ALPHA REQUIRED
                </p>
              </div>

              <form onSubmit={handleAuthSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <label className="block text-[8px] text-[var(--color-exoa-text-dim)] font-mono font-bold uppercase tracking-widest">
                    [ ENTER SECURITY PASSCODE ]
                  </label>
                  <input
                    type="password"
                    placeholder="Enter control passcode..."
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value)}
                    className="w-full bg-[#0a0d1a] text-white border border-white/[0.06] px-4 py-3 rounded-full text-xs font-semibold focus:outline-none focus:border-red-500/50 shadow-inner tracking-widest text-center"
                    autoFocus
                  />
                  <p className="text-[8px] text-center text-[var(--color-exoa-text-dim)] uppercase tracking-wider font-semibold opacity-80 mt-1">
                    Tip: Press Enter or submit empty password to log in directly.
                  </p>
                </div>

                {authError && (
                  <div className="text-[9px] text-red-400 font-mono font-bold text-center tracking-wide uppercase border border-red-500/10 bg-red-500/[0.01] py-2 rounded-lg">
                    ⚠️ {authError}
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-3 bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700 text-white font-bold text-[9px] tracking-widest uppercase rounded-full shadow-md cursor-pointer transition-all border border-red-400/20"
                >
                  AUTHENTICATE SECURE LINK
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Admin Console Layout */}
      {isAuthenticated && (
        <main className="flex-grow p-8 flex flex-col gap-8 max-w-[1600px] w-full mx-auto z-10 relative">
          
          {/* Top telemetry metrics row */}
          <SystemMetrics
            wsStatus={wsStatus}
            blockedCount={totalBlockedCount}
            simulatedUsers={12}
            systemStatus={totalBlockedCount > 0 ? 'evacuation' : 'normal'}
          />

          {/* Core admin operational panels grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left: Hazard Controls & Logs */}
            <div className="lg:col-span-5 flex flex-col gap-8 w-full">
              {/* Floor Switch Selector */}
              <div className="glass-card p-6 border-white/[0.04] bg-white/[0.01] flex flex-col gap-4">
                <label className="block text-[8px] text-[var(--color-exoa-text-dim)] font-mono font-bold uppercase tracking-widest">
                  [ SWITCH SURVEILLANCE FLOOR LEVEL ]
                </label>
                <select
                  value={floorLevel}
                  onChange={(e) => setFloorLevel(parseInt(e.target.value))}
                  className="w-full bg-[#0a0d1a] text-white border border-white/[0.06] px-4 py-3 rounded-full text-xs font-semibold focus:outline-none focus:border-red-500/50 shadow-inner cursor-pointer appearance-none tracking-wide"
                >
                  <option value={0}>Ground Floor (GF)</option>
                  <option value={1}>Floor Level 1 (1F)</option>
                  <option value={2}>Floor Level 2 (2F)</option>
                  <option value={3}>Floor Level 3 (3F)</option>
                </select>
              </div>

              {/* Blocking / Unblocking actions */}
              <HazardControlPanel
                edges={buildingGraph.edges}
                onBlock={handleBlockEdge}
                onUnblock={handleUnblockEdge}
                floor={floorLevel}
              />

              {/* Emergency broadcast simulator */}
              <div className="glass-card p-6 border-white/[0.04] bg-white/[0.01] flex flex-col gap-4">
                <label className="block text-[8px] text-[var(--color-exoa-text-dim)] font-mono font-bold uppercase tracking-widest">
                  [ SIMULATE EMERGENCY BROADCAST OVERRIDE ]
                </label>
                <form onSubmit={handleBroadcastSubmit} className="flex gap-3">
                  <input
                    type="text"
                    placeholder="Type safety alert message to broadcast..."
                    value={broadcastText}
                    onChange={(e) => setBroadcastText(e.target.value)}
                    className="flex-grow bg-[#0a0d1a] text-white border border-white/[0.06] px-4.5 py-2.5 rounded-full text-xs font-medium focus:outline-none focus:border-red-500/50 shadow-inner"
                  />
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700 text-white font-bold text-[9px] tracking-widest uppercase rounded-full shadow-md cursor-pointer transition-all border border-red-400/20"
                  >
                    SEND
                  </button>
                </form>
              </div>
            </div>

            {/* Right: Map and Logging console */}
            <div className="lg:col-span-7 flex flex-col gap-8 w-full">
              
              {/* Floor plan rendering */}
              <div
                key={`${floorLevel}-${triggerRender}`}
                className="glass-card overflow-hidden border border-white/[0.04] bg-white/[0.01] flex flex-col h-[480px] xl:h-[580px] shadow-2xl relative"
              >
                {/* Map telemetry label overlays */}
                <div className="absolute top-6 left-6 z-20 flex items-center gap-2.5 pointer-events-none select-none">
                  <div className="glass-card px-3 py-1.5 border-white/[0.04] bg-[#070913]/60 text-[9px] font-mono font-bold text-red-400 tracking-widest uppercase">
                    ADMIN ACTIVE GRAPH VIEW
                  </div>
                  <div className="glass-card px-3 py-1.5 border-white/[0.04] bg-[#070913]/60 text-[9px] font-mono font-bold text-white tracking-widest uppercase">
                    LEVEL {floorLevel}
                  </div>
                </div>

                <div className="absolute top-6 right-6 z-20 pointer-events-none select-none">
                  <div className="glass-card px-3 py-1.5 border-white/[0.04] bg-[#070913]/60 text-[9px] font-mono font-bold text-[var(--color-exoa-text-dim)] tracking-widest uppercase">
                    DRAG PAN • ZOOM ACTIVE
                  </div>
                </div>

                <div className="flex-grow relative bg-[#070913]">
                  <FloorMap
                    navState={adminNavState}
                    routeSVGPath=""
                    isCalculating={false}
                  />
                </div>
              </div>

              {/* Logs Console Feed */}
              <div className="glass-card p-6 border-white/[0.04] bg-white/[0.01] flex flex-col gap-4">
                <div className="border-b border-white/[0.06] pb-3 flex items-center justify-between">
                  <h3 className="text-[11px] font-semibold uppercase tracking-widest text-[var(--color-exoa-text-muted)]">
                    📜 Real-Time Security Operations Log
                  </h3>
                  <span className="text-[8px] font-mono font-bold text-green-400 tracking-widest uppercase">
                    SURVEILLANCE STABLE
                  </span>
                </div>

                {/* Broadcast Banner indicator */}
                {broadcastLog && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-3 border border-red-500/20 bg-red-500/[0.02] rounded-xl text-center text-[10px] font-bold text-red-400 tracking-widest uppercase animate-pulse"
                  >
                    ⚠️ {broadcastLog}
                  </motion.div>
                )}

                <div className="flex flex-col gap-2 max-h-[140px] overflow-y-auto pr-1">
                  {logs.map((log, index) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 text-[10px] font-mono leading-relaxed"
                    >
                      <span className="text-[var(--color-exoa-text-dim)]">[{log.timestamp}]</span>
                      <span
                        className={
                          log.type === 'success'
                            ? 'text-green-400'
                            : log.type === 'warning'
                            ? 'text-amber-400'
                            : log.type === 'error'
                            ? 'text-red-400'
                            : 'text-white/70'
                        }
                      >
                        {log.message}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

          </div>
        </main>
      )}

      {/* Cinematic Operations Footer */}
      <footer className="z-40 border-t border-white/[0.03] bg-[#070913]/90 backdrop-blur-md py-4 px-8 text-center text-[9px] text-[var(--color-exoa-text-dim)] font-mono tracking-widest select-none">
        <div className="max-w-[1600px] w-full mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>EXOA ADMIN v2.0 • OPERATIONS LINK SECURE</span>
          <span>WEBSOCKET LINK STATUS: {wsStatus.toUpperCase()}</span>
          <span>© 2026 EXOA OPERATIONS NETWORK</span>
        </div>
      </footer>
    </div>
  );
}

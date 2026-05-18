import { useState } from 'react';
import { motion } from 'framer-motion';
import { useDashboard } from '../hooks/useDashboard';
import { MinimalNavbar } from '../components/dashboard/MinimalNavbar';
import { EmergencyStats } from '../components/dashboard/EmergencyStats';
import { LiveMapCard } from '../components/dashboard/LiveMapCard';
import { useSOS } from '../hooks/useSOS';
import { SOSButton, SOSModal, SOSStatusIndicator } from '../components/sos';
import { useVoiceGuidance } from '../hooks/useVoiceGuidance';
import { VoiceControlPanel } from '../components/voice/VoiceControlPanel';
import { VoiceStatusIndicator } from '../components/voice/VoiceStatusIndicator';
import { QRScanner } from '../components/qr/QRScanner';
import { QRUploadScanner } from '../components/qr/QRUploadScanner';
import { QRResultHandler } from '../components/qr/QRResultHandler';
import type { GraphNode } from '../types';

export function UserDashboard() {
  const {
    navState,
    currentNode,
    targetExit,
    wsStatus,
    activeHazards,
    formattedEvacTime,
    isStaircaseTransition,
    isCalculating,
    routeSVGPath,
    setNode,
  } = useDashboard();

  const {
    status: sosStatus,
    activeAlert: sosAlert,
    cooldown: sosCooldown,
    modalOpen: sosModalOpen,
    setModalOpen: setSosModalOpen,
    triggerSOS,
    cancelLocalSOS,
  } = useSOS();

  // Instantiate Real-Time Voice Guidance System
  useVoiceGuidance(navState, currentNode, targetExit, activeHazards.length);

  // QR Scanner Interactive State Machine
  const [isScanningActive, setIsScanningActive] = useState(false);
  const [scanSuccessNode, setScanSuccessNode] = useState<GraphNode | null>(null);
  const [scanError, setScanError] = useState<string | null>(null);
  const [scannerMode, setScannerMode] = useState<'camera' | 'upload'>('camera');

  return (
    <div className="min-h-screen bg-[#070913] text-white flex flex-col relative overflow-hidden font-sans">
      {/* Cinematic animated background grid & glows */}
      <div className="animated-grid" />
      <div className="ambient-red-glow ambient-breathing-glow" />

      {/* Top minimalistic command navbar */}
      <MinimalNavbar wsStatus={wsStatus} currentNodeId={navState.currentNodeId} />

      {/* Main Spacious Command Center */}
      <main className="flex-grow flex items-center justify-center py-10 px-8 xl:px-16 z-10 relative">
        <div className="max-w-[1600px] w-full grid grid-cols-1 lg:grid-cols-12 gap-12 xl:gap-16 items-center">
          
          {/* Left Column: Hero Typography & Key Stats */}
          <div className="lg:col-span-5 flex flex-col gap-10">
            {/* Hero Copy */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex flex-col gap-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-mono tracking-widest text-red-500 uppercase font-bold">
                  ⚡ EXOA INERTIAL NAVIGATION SYSTEM
                </span>
                <VoiceStatusIndicator />
              </div>
              <h2 className="text-4xl xl:text-5xl font-bold tracking-tight leading-[1.1] text-white">
                When seconds matter,<br />
                find the exit instantly.
              </h2>
              <p className="text-[11px] text-[var(--color-exoa-text-dim)] uppercase tracking-wider font-semibold opacity-85 leading-relaxed max-w-md mt-2">
                Real-time active corridor mapping powered by physical QR checkpoints and automated sensor feedback.
              </p>
            </motion.div>

            {/* SOS Active Indicator Banner */}
            <SOSStatusIndicator
              alert={sosAlert}
              localStatus={sosStatus}
              onCancel={cancelLocalSOS}
            />

            {/* Room selector & Control panel */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="glass-card p-6 border-white/[0.03] bg-white/[0.01] flex flex-col gap-4"
            >
              <div className="flex items-center justify-between border-b border-white/[0.06] pb-3 mb-1">
                <span className="text-[9px] font-mono font-bold tracking-widest text-[var(--color-exoa-text-muted)] uppercase">
                  {isScanningActive ? '📷 CHECKPOINT SCANNER ACTIVE' : '⚙️ LOCATION CONFIGURATION'}
                </span>
                <button
                  onClick={() => {
                    setIsScanningActive(!isScanningActive);
                    setScanSuccessNode(null);
                    setScanError(null);
                  }}
                  className="px-3 py-1 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 rounded-full font-mono text-[8px] tracking-widest uppercase cursor-pointer transition-all"
                >
                  {isScanningActive ? '[ Simulator Dropdown ]' : '[ 📷 Scan QR Code ]'}
                </button>
              </div>

              {isScanningActive ? (
                <div className="flex flex-col gap-4">
                  {/* Holographic Tabs */}
                  <div className="flex border-b border-white/[0.06] pb-2 gap-4">
                    <button
                      onClick={() => {
                        setScannerMode('camera');
                        setScanSuccessNode(null);
                        setScanError(null);
                      }}
                      className={`pb-1 text-[9px] font-mono tracking-widest uppercase cursor-pointer transition-all ${
                        scannerMode === 'camera'
                          ? 'text-red-500 border-b-2 border-red-500 font-bold'
                          : 'text-white/40 hover:text-white/80'
                      }`}
                    >
                      [ LENS DETECTOR ]
                    </button>
                    <button
                      onClick={() => {
                        setScannerMode('upload');
                        setScanSuccessNode(null);
                        setScanError(null);
                      }}
                      className={`pb-1 text-[9px] font-mono tracking-widest uppercase cursor-pointer transition-all ${
                        scannerMode === 'upload'
                          ? 'text-red-500 border-b-2 border-red-500 font-bold'
                          : 'text-white/40 hover:text-white/80'
                      }`}
                    >
                      [ FILE DIGITIZER ]
                    </button>
                  </div>

                  {/* Scanner components rendering */}
                  {!scanSuccessNode && !scanError && (
                    <div className="w-full">
                      {scannerMode === 'camera' ? (
                        <QRScanner
                          onScanSuccess={(node) => {
                            setScanSuccessNode(node);
                            setNode(node.id);
                          }}
                          onScanError={(err) => setScanError(err)}
                        />
                      ) : (
                        <QRUploadScanner
                          onScanSuccess={(node) => {
                            setScanSuccessNode(node);
                            setNode(node.id);
                          }}
                          onScanError={(err) => setScanError(err)}
                        />
                      )}
                    </div>
                  )}

                  {/* Interactive Scan Response HUD */}
                  <QRResultHandler
                    successNode={scanSuccessNode}
                    scanError={scanError}
                    onReset={() => {
                      setScanSuccessNode(null);
                      setScanError(null);
                    }}
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-[8px] text-[var(--color-exoa-text-dim)] font-mono font-bold uppercase tracking-widest mb-2">
                    [ SIMULATE CHECKPOINT LOCATION ]
                  </label>
                  <select
                    onChange={(e) => setNode(e.target.value)}
                    value={navState.currentNodeId || ''}
                    className="w-full bg-[#0a0d1a]/80 text-white border border-white/[0.06] px-4 py-3 rounded-full text-xs font-medium focus:outline-none focus:border-red-500/50 shadow-inner cursor-pointer appearance-none tracking-wide"
                  >
                    <option value="" disabled>Select active room location...</option>
                    
                    <optgroup label="Ground Floor" className="bg-[#0c0f1d] text-left">
                      <option value="G_QR_01">Admin Office (GF)</option>
                      <option value="G_QR_02">Workshop West (GF)</option>
                      <option value="G_QR_03">Workshop East (GF)</option>
                      <option value="G_QR_04">East Toilet (GF)</option>
                    </optgroup>
                    
                    <optgroup label="First Floor" className="bg-[#0c0f1d] text-left">
                      <option value="QR_01">Class Room 1 (1F)</option>
                      <option value="QR_02">Class Room 2 (1F)</option>
                      <option value="QR_03">Class Room 4 (1F)</option>
                      <option value="QR_04">Class Room 5 (1F)</option>
                      <option value="QR_05">Class Room 6 (1F)</option>
                      <option value="QR_06">Class Room 7 (1F)</option>
                      <option value="QR_07">Head Office (1F)</option>
                      <option value="QR_08">Kitchen (1F)</option>
                      <option value="QR_09">Canteen A (1F)</option>
                      <option value="QR_10">Canteen A Side (1F)</option>
                      <option value="QR_11">Girls Room (1F)</option>
                      <option value="QR_12">Unassigned (1F)</option>
                      <option value="QR_13">Physics Lab-1 (1F)</option>
                    </optgroup>
                    
                    <optgroup label="Second Floor" className="bg-[#0c0f1d] text-left">
                      <option value="S_QR_01">Computer W (2F)</option>
                      <option value="S_QR_02">Computer E (2F)</option>
                      <option value="S_QR_03">Drawing W (2F)</option>
                      <option value="S_QR_04">Drawing E (2F)</option>
                      <option value="S_QR_05">Class Room 1 (2F)</option>
                      <option value="S_QR_06">Class Room 2 (2F)</option>
                      <option value="S_QR_07">Class Room 3 (2F)</option>
                      <option value="S_QR_08">Class Room 4 (2F)</option>
                      <option value="S_QR_09">Class Room 5 (2F)</option>
                      <option value="S_QR_10">HOD Office (2F)</option>
                      <option value="S_QR_11">Upper East (2F)</option>
                    </optgroup>
                    
                    <optgroup label="Third Floor" className="bg-[#0c0f1d] text-left">
                      <option value="T_QR_01">Seminar Room 1 (3F)</option>
                      <option value="T_QR_02">Staff Pantry (3F)</option>
                      <option value="T_QR_03">Staff Toilet (3F)</option>
                      <option value="T_QR_04">Language Lab (3F)</option>
                      <option value="T_QR_05">Tutorial Room 1 (3F)</option>
                      <option value="T_QR_06">Library West (3F)</option>
                      <option value="T_QR_07">Library East (3F)</option>
                      <option value="T_QR_08">Class Room 6 (3F)</option>
                    </optgroup>
                  </select>
                </div>
              )}

              {/* Staircase transition overlay */}
              {isStaircaseTransition && targetExit && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-4.5 border border-amber-500/20 bg-amber-500/[0.02] rounded-2xl flex flex-col gap-2 mt-2"
                >
                  <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-amber-500">
                    🪜 STAIRCASE RECONNAISSANCE
                  </span>
                  <p className="text-[10px] text-[var(--color-exoa-text-dim)] uppercase tracking-wide leading-relaxed opacity-90">
                    Staircase hub reached. Switch map to proceed evacuation downwards.
                  </p>
                  <button
                    onClick={() => {
                      let targetStair = '';
                      if (currentNode?.floor === 3) {
                        targetStair = targetExit.id === 'T_STAIR_01' ? 'S_STAIR_01' : 'S_STAIR_02';
                      } else if (currentNode?.floor === 2) {
                        targetStair = targetExit.id === 'S_STAIR_01' ? 'STAIR_01' : 'STAIR_02';
                      } else if (currentNode?.floor === 1) {
                        targetStair = currentNode.id === 'STAIR_01' ? 'G_STAIR_01' : 'G_STAIR_02';
                      }
                      if (targetStair) setNode(targetStair);
                    }}
                    className="w-full py-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white font-bold text-[9px] tracking-widest uppercase rounded-full shadow-md cursor-pointer transition-all border border-amber-400/20 mt-1"
                  >
                    Transition Floor Plan
                  </button>
                </motion.div>
              )}
            </motion.div>

            {/* Core Telemetry metrics */}
            <EmergencyStats
              currentNode={currentNode}
              targetExit={targetExit}
              distance={navState.distance}
              formattedTime={formattedEvacTime}
              isCalculating={isCalculating}
            />

            {/* Active Hazard Indicators */}
            {activeHazards.length > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center gap-3 px-4.5 py-3.5 rounded-2xl border border-red-500/10 bg-red-500/[0.01]"
              >
                <span className="text-sm select-none">🚨</span>
                <span className="text-[10px] font-mono font-bold tracking-widest text-red-400 uppercase">
                  {activeHazards.length} PHYSICAL HALLWAY BLOCKS DETECTED • REROUTED
                </span>
              </motion.div>
            )}
          </div>

          {/* Right Column: Immersive Live Evacuation Map Preview */}
          <div className="lg:col-span-7 w-full">
            <LiveMapCard
              navState={navState}
              routeSVGPath={routeSVGPath}
              isCalculating={isCalculating}
              floorLevel={currentNode?.floor ?? 1}
            />
          </div>

        </div>
      </main>

      {/* Cinematic Operations Footer */}
      <footer className="z-40 border-t border-white/[0.03] bg-[#070913]/90 backdrop-blur-md py-4 px-8 text-center text-[9px] text-[var(--color-exoa-text-dim)] font-mono tracking-widest select-none">
        <div className="max-w-[1600px] w-full mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>EXOA PORTAL v2.0 • COMMAND SURVEILLANCE ONLINE</span>
          <span>WEBSOCKET LINK STATUS: {wsStatus.toUpperCase()}</span>
          <span>© 2026 EXOA SAFETY PLATFORM</span>
        </div>
      </footer>

      {/* Floating emergency SOS system button and confirmation modal */}
      <SOSButton
        status={sosStatus}
        cooldown={sosCooldown}
        onClick={() => setSosModalOpen(true)}
      />

      <SOSModal
        isOpen={sosModalOpen}
        onClose={() => setSosModalOpen(false)}
        onConfirm={(type) =>
          triggerSOS(
            navState.currentNodeId || 'QR_01',
            currentNode?.floor || 1,
            navState.status,
            type
          )
        }
      />

      {/* Floating Compact Voice Guidance Control Widget */}
      <VoiceControlPanel />
    </div>
  );
}

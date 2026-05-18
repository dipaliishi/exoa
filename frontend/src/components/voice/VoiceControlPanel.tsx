import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { voiceGuidanceService, type VoiceSettings } from '../../services/voiceGuidance';

export function VoiceControlPanel() {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState<VoiceSettings>({
    enabled: true,
    volume: 0.8,
    rate: 1.0,
    voiceName: '',
  });
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    // Subscribe to voice settings updates
    const unsubscribe = voiceGuidanceService.addListener((updatedSettings) => {
      setSettings(updatedSettings);
    });

    // Load available voices
    const timer = setTimeout(() => {
      setVoices(voiceGuidanceService.getVoices());
    }, 500);

    return () => {
      unsubscribe();
      clearTimeout(timer);
    };
  }, []);

  const handleToggle = () => {
    voiceGuidanceService.updateSettings({ enabled: !settings.enabled });
    if (settings.enabled) {
      voiceGuidanceService.cancel();
    } else {
      voiceGuidanceService.speak("Voice guidance enabled.");
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const volume = parseFloat(e.target.value);
    setSettings((prev) => ({ ...prev, volume }));
    voiceGuidanceService.updateSettings({ volume });
  };

  const handleRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rate = parseFloat(e.target.value);
    setSettings((prev) => ({ ...prev, rate }));
    voiceGuidanceService.updateSettings({ rate });
  };

  const handleVoiceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const voiceName = e.target.value;
    setSettings((prev) => ({ ...prev, voiceName }));
    voiceGuidanceService.updateSettings({ voiceName });
    // Speak test using the new voice
    setTimeout(() => {
      voiceGuidanceService.speak("Voice guidance active.", true);
    }, 100);
  };

  const isBrowserSupported = typeof window !== 'undefined' && !!window.speechSynthesis;

  if (!isBrowserSupported) {
    return (
      <div className="fixed bottom-40 right-6 z-50">
        <button
          disabled
          className="w-12 h-12 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center cursor-not-allowed opacity-50 shadow-lg"
          title="Browser Speech API not supported"
        >
          🔇
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-40 right-6 z-50 flex flex-col items-end gap-3 font-sans">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="w-72 glass-card p-5 border border-white/[0.06] bg-[#070913]/95 backdrop-blur-2xl shadow-2xl rounded-2xl flex flex-col gap-4 text-white"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-2.5">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-red-500">🔊 SYSTEM VOICE</span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-[10px] text-white/40 hover:text-white/80 cursor-pointer uppercase tracking-wider font-semibold font-mono"
              >
                [ Close ]
              </button>
            </div>

            {/* Toggle Switch */}
            <div className="flex items-center justify-between">
              <span className="text-[10px] uppercase font-bold tracking-widest text-[var(--color-exoa-text-dim)]">
                Voice Alerts
              </span>
              <button
                onClick={handleToggle}
                className={`w-12 h-6 rounded-full p-1 cursor-pointer transition-colors ${
                  settings.enabled ? 'bg-red-500' : 'bg-white/10'
                }`}
              >
                <div
                  className={`bg-white w-4 h-4 rounded-full shadow-md transition-transform ${
                    settings.enabled ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            {settings.enabled && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="flex flex-col gap-3.5 overflow-hidden"
              >
                {/* Voice Selector */}
                <div className="flex flex-col gap-1.5">
                  <label className="text-[8px] font-mono font-bold uppercase tracking-widest text-[var(--color-exoa-text-dim)]">
                    [ VOICE TYPE ]
                  </label>
                  <select
                    value={settings.voiceName}
                    onChange={handleVoiceChange}
                    className="w-full bg-[#0a0d1a] border border-white/[0.06] rounded-lg px-3 py-2 text-[10px] font-medium text-white/90 focus:outline-none focus:border-red-500/50 cursor-pointer"
                  >
                    <option value="">Default System Voice</option>
                    {voices.map((v) => (
                      <option key={v.name} value={v.name}>
                        {v.name} ({v.lang})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Volume Slider */}
                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between text-[8px] font-mono font-bold uppercase tracking-widest text-[var(--color-exoa-text-dim)]">
                    <span>[ VOLUME ]</span>
                    <span className="text-white/80">{Math.round(settings.volume * 100)}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={settings.volume}
                    onChange={handleVolumeChange}
                    className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-red-500"
                  />
                </div>

                {/* Speed Slider */}
                <div className="flex flex-col gap-1">
                  <div className="flex items-center justify-between text-[8px] font-mono font-bold uppercase tracking-widest text-[var(--color-exoa-text-dim)]">
                    <span>[ SPEECH SPEED ]</span>
                    <span className="text-white/80">{settings.rate.toFixed(1)}x</span>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="2"
                    step="0.1"
                    value={settings.rate}
                    onChange={handleRateChange}
                    className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-red-500"
                  />
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-12 h-12 rounded-full flex items-center justify-center shadow-lg border cursor-pointer transition-all ${
          isOpen
            ? 'bg-red-500 border-red-400 text-white'
            : settings.enabled
            ? 'bg-[#0a0d1a]/90 border-red-500/30 text-red-500 hover:bg-[#0c0f1d] hover:border-red-500/50'
            : 'bg-[#0a0d1a]/90 border-white/10 text-white/50 hover:bg-[#0c0f1d] hover:text-white'
        }`}
        title="Voice Guidance Settings"
      >
        <span className="text-lg select-none">{settings.enabled ? '🔊' : '🔇'}</span>
      </button>
    </div>
  );
}

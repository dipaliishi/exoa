import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { voiceGuidanceService, type VoiceSettings } from '../../services/voiceGuidance';

export function VoiceStatusIndicator() {
  const [settings, setSettings] = useState<VoiceSettings>({
    enabled: true,
    volume: 0.8,
    rate: 1.0,
    voiceName: '',
  });

  useEffect(() => {
    const unsubscribe = voiceGuidanceService.addListener((updatedSettings) => {
      setSettings(updatedSettings);
    });
    return () => unsubscribe();
  }, []);

  if (!settings.enabled) return null;

  return (
    <div className="flex items-center gap-2 px-3 py-1 bg-red-500/10 border border-red-500/20 rounded-full select-none">
      {/* Mini pulsing audio waves */}
      <div className="flex items-end gap-0.5 h-2.5 w-3.5">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="w-[2px] bg-red-500 rounded-full"
            animate={{
              height: ['20%', '100%', '20%'],
            }}
            transition={{
              duration: 0.6,
              repeat: Infinity,
              delay: i * 0.15,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>
      <span className="text-[8px] font-mono font-bold tracking-widest text-red-500 uppercase">
        Voice Active
      </span>
    </div>
  );
}
export default VoiceStatusIndicator;

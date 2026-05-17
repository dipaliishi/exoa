import { motion } from 'framer-motion';

interface UserMarkerProps {
  x: number;
  y: number;
  label?: string;
}

/**
 * Animated user position marker displayed on the SVG map.
 * Shows a pulsing beacon effect at the current QR location.
 */
export function UserMarker({ x, y, label }: UserMarkerProps) {
  return (
    <g>
      {/* Outer pulsing beacon rings */}
      <motion.circle
        cx={x}
        cy={y}
        r={8}
        fill="none"
        stroke="#3b82f6"
        strokeWidth={2}
        initial={{ r: 8, opacity: 0.8 }}
        animate={{ r: 35, opacity: 0 }}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
      />
      <motion.circle
        cx={x}
        cy={y}
        r={8}
        fill="none"
        stroke="#3b82f6"
        strokeWidth={1.5}
        initial={{ r: 8, opacity: 0.6 }}
        animate={{ r: 28, opacity: 0 }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeOut',
          delay: 0.5,
        }}
      />

      {/* Glow effect */}
      <circle
        cx={x}
        cy={y}
        r={16}
        fill="#3b82f6"
        opacity={0.15}
        filter="url(#userGlow)"
      />

      {/* Main dot */}
      <motion.circle
        cx={x}
        cy={y}
        r={8}
        fill="#3b82f6"
        stroke="#ffffff"
        strokeWidth={2.5}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 20 }}
        style={{ filter: 'drop-shadow(0 0 6px rgba(59, 130, 246, 0.6))' }}
      />

      {/* Inner white dot */}
      <circle cx={x} cy={y} r={3} fill="#ffffff" opacity={0.9} />

      {/* Label */}
      {label && (
        <motion.g
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <rect
            x={x - 50}
            y={y - 35}
            width={100}
            height={20}
            rx={6}
            fill="#1e293b"
            stroke="#3b82f6"
            strokeWidth={1}
            opacity={0.9}
          />
          <text
            x={x}
            y={y - 21}
            textAnchor="middle"
            fill="#e2e8f0"
            fontSize={9}
            fontWeight={600}
            fontFamily="Inter, sans-serif"
          >
            📍 YOU ARE HERE
          </text>
        </motion.g>
      )}

      {/* SVG filter for glow */}
      <defs>
        <filter id="userGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
    </g>
  );
}

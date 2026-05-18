import { motion } from 'framer-motion';
import type { GraphNode } from '../types';
import { getNodeById } from '../data/graphData';

interface RouteOverlayProps {
  path: string[];
  svgPath: string;
  exitNode: GraphNode | null;
}

/**
 * Route overlay component that renders the navigation path on top of the SVG map.
 * Features animated dashed lines with glow effects.
 */
export function RouteOverlay({ path, svgPath, exitNode }: RouteOverlayProps) {
  if (!svgPath || path.length < 2) return null;

  const pathNodes = path
    .map((id) => getNodeById(id))
    .filter((n): n is NonNullable<typeof n> => n !== null);

  return (
    <g id="route-overlay">
      {/* Route glow background */}
      <motion.path
        d={svgPath}
        className="route-path-bg"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.5, ease: 'easeInOut' }}
      />

      {/* Main animated route path */}
      <motion.path
        d={svgPath}
        className="route-path"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.5, ease: 'easeInOut' }}
      />

      {/* Route waypoint indicators (small dots at corridor junctions) */}
      {pathNodes.slice(1, -1).map((node, i) => {
        if (node.type === 'corridor') {
          return (
            <motion.circle
              key={`waypoint-${node.id}`}
              cx={node.x}
              cy={node.y}
              r={3}
              fill="#f97316"
              opacity={0.6}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.1 * i + 0.5 }}
            />
          );
        }
        return null;
      })}

      {/* Exit destination marker */}
      {exitNode && (
        <g>
          {/* Exit pulsing ring */}
          <motion.circle
            cx={exitNode.x}
            cy={exitNode.y}
            r={10}
            fill="none"
            stroke="#22c55e"
            strokeWidth={2}
            initial={{ r: 10, opacity: 0.8 }}
            animate={{ r: 30, opacity: 0 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeOut' }}
          />

          {/* Exit glow */}
          <circle
            cx={exitNode.x}
            cy={exitNode.y}
            r={14}
            fill="#22c55e"
            opacity={0.2}
            filter="url(#exitGlow)"
          />

          {/* Exit marker */}
          <motion.circle
            cx={exitNode.x}
            cy={exitNode.y}
            r={10}
            fill="#22c55e"
            stroke="#ffffff"
            strokeWidth={2}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{
              type: 'spring',
              stiffness: 260,
              damping: 20,
              delay: 1.2,
            }}
            style={{ filter: 'drop-shadow(0 0 8px rgba(34, 197, 94, 0.6))' }}
          />

          {/* Exit icon (arrow) */}
          <motion.text
            x={exitNode.x}
            y={exitNode.y + 4}
            textAnchor="middle"
            fill="#ffffff"
            fontSize={11}
            fontWeight={700}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4 }}
          >
            ✓
          </motion.text>

          {/* Exit label */}
          <motion.g
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.5 }}
          >
            <rect
              x={exitNode.x - 40}
              y={exitNode.y + 16}
              width={80}
              height={18}
              rx={5}
              fill="#065f46"
              stroke="#22c55e"
              strokeWidth={0.8}
              opacity={0.9}
            />
            <text
              x={exitNode.x}
              y={exitNode.y + 29}
              textAnchor="middle"
              fill="#86efac"
              fontSize={8}
              fontWeight={600}
              fontFamily="Inter, sans-serif"
            >
              🚪 NEAREST EXIT
            </text>
          </motion.g>
        </g>
      )}

      {/* Direction arrows along the path */}
      {pathNodes.length > 2 &&
        pathNodes.slice(0, -1).map((node, i) => {
          const next = pathNodes[i + 1];
          if (!next || node.type === 'corridor') return null;
          const midX = (node.x + next.x) / 2;
          const midY = (node.y + next.y) / 2;
          const angle = Math.atan2(next.y - node.y, next.x - node.x) * (180 / Math.PI);

          return (
            <motion.g
              key={`arrow-${i}`}
              transform={`translate(${midX}, ${midY}) rotate(${angle})`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.7 }}
              transition={{ delay: 0.8 + i * 0.1 }}
            >
              <polygon
                points="0,-4 8,0 0,4"
                fill="#f97316"
                opacity={0.8}
              />
            </motion.g>
          );
        })}

      {/* SVG filters */}
      <defs>
        <filter id="exitGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="8" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="routeGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="4" />
        </filter>
      </defs>
    </g>
  );
}

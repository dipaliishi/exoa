import { useState } from 'react';
import type { GraphEdge } from '../../types';
import { getNodeById } from '../../data/graphData';

interface HazardControlPanelProps {
  edges: GraphEdge[];
  onBlock: (from: string, to: string) => void;
  onUnblock: (from: string, to: string) => void;
  floor: number;
}

export function HazardControlPanel({
  edges,
  onBlock,
  onUnblock,
  floor,
}: HazardControlPanelProps) {
  const [selectedEdgeIndex, setSelectedEdgeIndex] = useState<string>('');

  // Filter edges for the active floor
  const floorEdges = edges.filter((e) => e.floor === floor);
  const blockedEdges = floorEdges.filter((e) => e.blocked);

  const getEdgeLabel = (edge: GraphEdge) => {
    const fromNode = getNodeById(edge.from);
    const toNode = getNodeById(edge.to);
    const fromLabel = fromNode?.label || edge.from;
    const toLabel = toNode?.label || edge.to;
    return `${fromLabel} ↔ ${toLabel}`;
  };

  const handleBlockClick = () => {
    if (!selectedEdgeIndex) return;
    const edge = floorEdges[parseInt(selectedEdgeIndex)];
    if (edge) {
      onBlock(edge.from, edge.to);
    }
  };

  return (
    <div className="glass-card p-6 border-white/[0.04] bg-white/[0.01] flex flex-col gap-6 h-full">
      {/* Header */}
      <div className="border-b border-white/[0.06] pb-3">
        <h3 className="text-[11px] font-semibold uppercase tracking-widest text-[var(--color-exoa-text-muted)] flex items-center gap-2">
          🔥 Spatial Corridor Control
        </h3>
        <p className="text-[9px] text-[var(--color-exoa-text-dim)] uppercase tracking-wider mt-0.5 font-semibold">
          Select and obstruct paths to trigger websocket recalculation
        </p>
      </div>

      {/* Select active edge to block */}
      <div className="flex flex-col gap-3">
        <label className="block text-[8px] text-[var(--color-exoa-text-dim)] font-mono font-bold uppercase tracking-widest">
          [ SELECT WALKABLE CORRIDOR EDGE ]
        </label>
        
        <div className="flex gap-3">
          <select
            value={selectedEdgeIndex}
            onChange={(e) => setSelectedEdgeIndex(e.target.value)}
            className="flex-grow bg-[#0a0d1a] text-white border border-white/[0.06] px-4 py-2.5 rounded-full text-xs font-medium focus:outline-none focus:border-red-500/50 shadow-inner cursor-pointer appearance-none tracking-wide"
          >
            <option value="" disabled>Choose a corridor link...</option>
            {floorEdges.map((edge, idx) => {
              // Only list walkable links in the drop-down to prevent double-blocking
              if (edge.blocked) return null;
              return (
                <option key={idx} value={idx}>
                  {getEdgeLabel(edge)}
                </option>
              );
            })}
          </select>

          <button
            onClick={handleBlockClick}
            disabled={!selectedEdgeIndex}
            className="px-6 py-2.5 bg-gradient-to-r from-red-500 to-orange-600 hover:from-red-600 hover:to-orange-700 disabled:from-white/5 disabled:to-white/5 disabled:text-white/30 text-white font-bold text-[9px] tracking-widest uppercase rounded-full shadow-md cursor-pointer transition-all border border-red-400/20 disabled:border-transparent"
          >
            BLOCK
          </button>
        </div>
      </div>

      {/* Blocked corridor log */}
      <div className="flex-grow flex flex-col gap-3">
        <span className="block text-[8px] text-[var(--color-exoa-text-dim)] font-mono font-bold uppercase tracking-widest border-t border-white/[0.04] pt-4">
          [ ACTIVE BLOCKED CORRIDORS : {blockedEdges.length} ]
        </span>

        <div className="flex-grow overflow-y-auto max-h-[220px] pr-1.5 flex flex-col gap-2.5">
          {blockedEdges.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-6 text-center">
              <span className="text-base select-none opacity-80">✓</span>
              <p className="text-[10px] font-semibold text-white mt-1 uppercase tracking-wide">
                All Paths Walkable
              </p>
              <p className="text-[9px] text-[var(--color-exoa-text-dim)] mt-0.5 uppercase tracking-wider font-semibold">
                No custom obstructions reported on this floor
              </p>
            </div>
          ) : (
            blockedEdges.map((edge, index) => (
              <div
                key={index}
                className="glass-card border border-red-500/15 p-3.5 bg-red-500/[0.01] relative overflow-hidden flex items-center justify-between gap-3"
              >
                <div className="absolute top-0 bottom-0 left-0 w-[2px] bg-red-500/40" />
                <div className="min-w-0">
                  <div className="text-[9px] font-bold text-red-400 tracking-widest uppercase">
                    Blocked Corridor Segment
                  </div>
                  <div className="text-xs text-white font-medium mt-1 truncate max-w-[200px]">
                    {getEdgeLabel(edge)}
                  </div>
                </div>
                <button
                  onClick={() => onUnblock(edge.from, edge.to)}
                  className="px-4 py-1.5 bg-white/5 hover:bg-green-500/10 text-white hover:text-green-400 font-bold text-[8px] tracking-widest uppercase rounded-full border border-white/10 hover:border-green-500/20 transition-all cursor-pointer"
                >
                  CLEAR
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

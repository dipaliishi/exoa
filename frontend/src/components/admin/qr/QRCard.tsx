import { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import { QRDownloadButton } from './QRDownloadButton';
import type { GraphNode } from '../../../types';

interface QRCardProps {
  node: GraphNode;
}

export function QRCard({ node }: QRCardProps) {
  const [qrUrl, setQrUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Generate QR code dynamically in browser from node.id exactly
    QRCode.toDataURL(
      node.id,
      {
        width: 320,
        margin: 2,
        color: {
          dark: '#070913', // Clean dark color for contrast
          light: '#ffffff', // Standard white background for flawless scanning
        },
      },
      (err, url) => {
        if (err) {
          console.error('Failed to generate QR:', err);
          return;
        }
        setQrUrl(url);
      }
    );
  }, [node]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(node.id);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error('Failed to copy QR value:', e);
    }
  };

  const getFloorLabel = (floor: number) => {
    const floorNames = ['Ground Floor', 'First Floor', 'Second Floor', 'Third Floor'];
    return floorNames[floor] || `Level ${floor}`;
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'qr':
        return 'Checkpoint';
      case 'exit':
        return 'Exit Point';
      case 'stair':
        return 'Staircase';
      case 'lift':
        return 'Elevator';
      default:
        return type.toUpperCase();
    }
  };

  return (
    <div className="glass-card p-5 border border-white/[0.04] bg-white/[0.01] hover:border-red-500/20 hover:bg-white/[0.02] flex flex-col gap-4 group transition-all duration-300 rounded-2xl relative overflow-hidden">
      {/* Dynamic Glow Accent based on type */}
      <div className={`absolute top-0 left-0 right-0 h-[2px] transition-colors ${
        node.type === 'exit' ? 'bg-red-500' : 'bg-amber-500'
      }`} />

      {/* Card Info Header */}
      <div className="flex items-start justify-between">
        <div className="flex flex-col gap-0.5">
          <span className="text-[7px] font-mono font-bold tracking-widest text-[var(--color-exoa-text-dim)] uppercase">
            [ NODE ID ]
          </span>
          <span className="text-sm font-black text-white font-mono">{node.id}</span>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className={`px-2 py-0.5 rounded text-[8px] font-mono font-bold uppercase tracking-wider ${
            node.type === 'exit'
              ? 'bg-red-500/10 text-red-400 border border-red-500/20'
              : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
          }`}>
            {getTypeLabel(node.type)}
          </span>
          <span className="text-[8px] font-mono text-[var(--color-exoa-text-dim)] uppercase font-semibold">
            {getFloorLabel(node.floor)}
          </span>
        </div>
      </div>

      {/* QR Code Container */}
      <div className="relative w-full aspect-square bg-white rounded-xl p-3 flex items-center justify-center border border-white/10 shadow-inner group-hover:scale-[1.01] transition-transform duration-300">
        {qrUrl ? (
          <img
            src={qrUrl}
            alt={`EXOA room QR node ${node.id}`}
            className="w-full h-full object-contain select-none"
            draggable="false"
          />
        ) : (
          <div className="w-8 h-8 border-2 border-red-500/20 border-t-red-500 rounded-full animate-spin" />
        )}
      </div>

      {/* Label Descriptions */}
      <div className="flex flex-col gap-1">
        <span className="text-[7px] font-mono font-bold tracking-widest text-[var(--color-exoa-text-dim)] uppercase">
          [ LOGICAL LOCATION ]
        </span>
        <span className="text-[11px] font-semibold text-white/90 truncate">
          {node.label || 'Unspecified corridor segment'}
        </span>
      </div>

      {/* Interactive Command Center Buttons */}
      <div className="grid grid-cols-2 gap-2 mt-1">
        <button
          onClick={handleCopy}
          className={`py-1.5 px-3 rounded-lg border font-mono text-[9px] font-bold tracking-widest uppercase cursor-pointer transition-all flex items-center justify-center gap-1 ${
            copied
              ? 'bg-green-500/10 border-green-500/30 text-green-400'
              : 'bg-white/5 border-white/10 hover:bg-white/10 text-white/80 hover:text-white'
          }`}
          title="Copy node ID to clipboard"
        >
          {copied ? '✓ COPIED' : '📋 COPY VALUE'}
        </button>

        <QRDownloadButton nodeId={node.id} dataUrl={qrUrl} />
      </div>
    </div>
  );
}

export default QRCard;

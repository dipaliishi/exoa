import React from 'react';

interface QRDownloadButtonProps {
  nodeId: string;
  dataUrl: string;
  className?: string;
}

export function QRDownloadButton({ nodeId, dataUrl, className = '' }: QRDownloadButtonProps) {
  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card triggers
    if (!dataUrl) return;

    const link = document.createElement('a');
    link.download = `exoa_qr_${nodeId}.png`;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <button
      onClick={handleDownload}
      disabled={!dataUrl}
      className={`px-3 py-1.5 rounded-lg border border-red-500/20 bg-red-500/10 hover:bg-red-500/20 text-red-400 font-mono text-[9px] font-bold tracking-widest uppercase cursor-pointer transition-all flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
      title={`Download QR image for node ${nodeId}`}
    >
      📥 DOWNLOAD PNG
    </button>
  );
}

export default QRDownloadButton;

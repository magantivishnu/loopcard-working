"use client";

import { useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { Download } from "lucide-react";

interface QRCodeDisplayProps {
  value: string;
  size?: number;
  level?: "L" | "M" | "Q" | "H";
  includeMargin?: boolean;
  downloadFileName?: string;
  showDownloadButton?: boolean;
  className?: string;
}

export default function QRCodeDisplay({
  value,
  size = 256,
  level = "H",
  includeMargin = true,
  downloadFileName = "qr-code",
  showDownloadButton = true,
  className = "",
}: QRCodeDisplayProps) {
  const qrRef = useRef<HTMLDivElement>(null);

  const handleDownload = () => {
    const canvas = qrRef.current?.querySelector("canvas");
    if (!canvas) return;

    canvas.toBlob((blob) => {
      if (!blob) return;
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${downloadFileName}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    });
  };

  return (
    <div className={`flex flex-col items-center gap-4 ${className}`}>
      {/* QR Code */}
      <div
        ref={qrRef}
        className="bg-white p-4 rounded-lg shadow-md border border-gray-200"
      >
        <QRCodeCanvas
          value={value}
          size={size}
          level={level}
          includeMargin={includeMargin}
        />
      </div>

      {/* Download Button */}
      {showDownloadButton && (
        <button
          onClick={handleDownload}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          <Download className="w-4 h-4" />
          Download QR Code
        </button>
      )}
    </div>
  );
}

'use client'

import { useEffect, useState } from 'react'
import { Download, Loader2 } from 'lucide-react'

interface QRCodeDisplayProps {
  url: string
}

export function QRCodeDisplay({ url }: QRCodeDisplayProps) {
  const [qrCode, setQrCode] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    generateQR()
  }, [url])

  const generateQR = async () => {
    try {
      const response = await fetch('/api/qr/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, size: 400 }),
      })

      const data = await response.json()
      setQrCode(data.qrCode)
    } catch (error) {
      console.error('Failed to generate QR code:', error)
    } finally {
      setLoading(false)
    }
  }

  const downloadQR = () => {
    if (!qrCode) return

    const link = document.createElement('a')
    link.href = qrCode
    link.download = 'loopcard-qr.png'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {qrCode && (
        <>
          <div className="bg-gray-50 rounded-xl p-8 flex items-center justify-center">
            <img src={qrCode} alt="QR Code" className="w-64 h-64" />
          </div>
          
          <button
            onClick={downloadQR}
            className="w-full flex items-center justify-center space-x-2 bg-primary-500 hover:bg-primary-600 text-white px-4 py-3 rounded-xl font-medium transition"
          >
            <Download className="w-5 h-5" />
            <span>Download QR Code</span>
          </button>
        </>
      )}
    </div>
  )
}

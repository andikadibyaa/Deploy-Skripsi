"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, Clock, AlertTriangle, CheckCircle } from "lucide-react"

interface DetectionStatsProps {
  sessionDuration: number
  totalDetections: number
  drowsinessEvents: number
  accuracy: number
}

export default function DetectionStats({
  sessionDuration,
  totalDetections,
  drowsinessEvents,
  accuracy,
}: DetectionStatsProps) {
  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          Statistik Sesi
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Clock className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-lg font-semibold text-blue-600">{formatDuration(sessionDuration)}</div>
            <div className="text-xs text-gray-500">Durasi Sesi</div>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <CheckCircle className="w-4 h-4 text-green-600" />
            </div>
            <div className="text-lg font-semibold text-green-600">{totalDetections}</div>
            <div className="text-xs text-gray-500">Total Deteksi</div>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <AlertTriangle className="w-4 h-4 text-red-600" />
            </div>
            <div className="text-lg font-semibold text-red-600">{drowsinessEvents}</div>
            <div className="text-xs text-gray-500">Peringatan</div>
          </div>

          <div className="text-center">
            <div className="text-lg font-semibold text-purple-600">{accuracy}%</div>
            <div className="text-xs text-gray-500">Akurasi</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

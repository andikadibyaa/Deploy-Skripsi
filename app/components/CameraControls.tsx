"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Settings, Volume2, VolumeX, RotateCcw } from "lucide-react"
import { Switch } from "@/components/ui/switch"

interface CameraControlsProps {
  isDetecting: boolean
  onToggleSound: (enabled: boolean) => void
  onResetScore: () => void
  soundEnabled: boolean
}

export default function CameraControls({
  isDetecting,
  onToggleSound,
  onResetScore,
  soundEnabled,
}: CameraControlsProps) {
  const [showSettings, setShowSettings] = useState(false)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Pengaturan
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Sound Toggle */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {soundEnabled ? (
              <Volume2 className="w-4 h-4 text-blue-600" />
            ) : (
              <VolumeX className="w-4 h-4 text-gray-400" />
            )}
            <span className="text-sm font-medium">Suara Alarm</span>
          </div>
          <Switch checked={soundEnabled} onCheckedChange={onToggleSound} />
        </div>

        {/* Reset Score */}
        <Button
          onClick={onResetScore}
          variant="outline"
          size="sm"
          className="w-full flex items-center gap-2"
          disabled={!isDetecting}
        >
          <RotateCcw className="w-4 h-4" />
          Reset Skor
        </Button>

        {/* Camera Info */}
        <div className="text-xs text-gray-500 space-y-1">
          <p>• Pastikan pencahayaan cukup</p>
          <p>• Posisikan wajah di tengah frame</p>
          <p>• Jaga jarak 50-80cm dari kamera</p>
        </div>
      </CardContent>
    </Card>
  )
}

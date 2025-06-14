import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Settings, Volume2, Bell, AlertTriangle } from "lucide-react"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"

interface SettingsPanelProps {
  onRedAlertChange?: (enabled: boolean) => void
  redAlertEnabled?: boolean
}

export default function SettingsPanel({ onRedAlertChange, redAlertEnabled = true }: SettingsPanelProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Pengaturan
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium">Suara Alarm</span>
            </div>
            <Switch defaultChecked />
          </div>

          <div className="pl-6">
            <span className="text-xs text-gray-500 mb-2 block">Volume</span>
            <Slider defaultValue={[70]} max={100} step={1} />
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              <span className="text-sm font-medium">Alert Warna Merah</span>
            </div>
            <Switch checked={redAlertEnabled} onCheckedChange={onRedAlertChange} />
          </div>
          <p className="text-xs text-gray-500 pl-6">Tampilkan border merah di sekitar kamera saat terdeteksi kantuk</p>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium">Notifikasi Desktop</span>
            </div>
            <Switch defaultChecked />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

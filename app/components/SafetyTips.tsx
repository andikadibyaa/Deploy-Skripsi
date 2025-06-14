import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertTriangle, Coffee, Car, Moon, Sun } from "lucide-react"

export default function SafetyTips() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-amber-500" />
          Tips Mencegah Kantuk
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-start gap-3">
          <div className="bg-blue-100 p-2 rounded-full">
            <Coffee className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-medium text-sm">Konsumsi Kafein dengan Bijak</h3>
            <p className="text-xs text-gray-600 mt-1">
              Minum kopi atau teh dapat membantu tetap terjaga, tetapi hindari konsumsi berlebihan.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="bg-green-100 p-2 rounded-full">
            <Car className="w-5 h-5 text-green-600" />
          </div>
          <div>
            <h3 className="font-medium text-sm">Istirahat Saat Berkendara</h3>
            <p className="text-xs text-gray-600 mt-1">
              Berhenti setiap 2 jam untuk istirahat singkat dan meregangkan tubuh.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="bg-purple-100 p-2 rounded-full">
            <Moon className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h3 className="font-medium text-sm">Tidur yang Cukup</h3>
            <p className="text-xs text-gray-600 mt-1">
              Pastikan tidur 7-8 jam sebelum melakukan perjalanan jauh atau aktivitas yang membutuhkan konsentrasi.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3">
          <div className="bg-amber-100 p-2 rounded-full">
            <Sun className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <h3 className="font-medium text-sm">Jaga Suhu Ruangan</h3>
            <p className="text-xs text-gray-600 mt-1">
              Suhu yang sejuk dapat membantu tetap waspada. Hindari ruangan yang terlalu hangat.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

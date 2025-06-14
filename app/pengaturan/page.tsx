import Navbar from "../components/Navbar"
import SettingsPanel from "../components/SettingsPanel"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function PengaturanPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navbar />

      <div className="max-w-6xl mx-auto p-4">
        <div className="text-center mb-8 pt-4">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Pengaturan Sistem</h1>
          <p className="text-gray-600">Konfigurasi dan preferensi sistem deteksi kantuk</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SettingsPanel />

          <Card>
            <CardHeader>
              <CardTitle>Profil Pengguna</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-xl font-bold text-blue-600">JD</span>
                </div>
                <div>
                  <h3 className="font-medium">John Doe</h3>
                  <p className="text-sm text-gray-500">Pengemudi</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium block mb-1">Email</label>
                  <input
                    type="email"
                    value="john.doe@example.com"
                    readOnly
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium block mb-1">Tipe Kendaraan</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm">
                    <option>Mobil Pribadi</option>
                    <option>Truk</option>
                    <option>Bus</option>
                    <option>Taksi</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium block mb-1">Jam Kerja</label>
                  <select className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm">
                    <option>Pagi (6:00 - 14:00)</option>
                    <option>Siang (14:00 - 22:00)</option>
                    <option>Malam (22:00 - 6:00)</option>
                    <option>Tidak Tetap</option>
                  </select>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

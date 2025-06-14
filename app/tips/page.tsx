import Navbar from "../components/Navbar"
import SafetyTips from "../components/SafetyTips"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function TipsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navbar />

      <div className="max-w-6xl mx-auto p-4">
        <div className="text-center mb-8 pt-4">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Tips Keselamatan</h1>
          <p className="text-gray-600">Panduan dan informasi untuk mencegah kantuk saat berkendara</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <SafetyTips />

          <Card>
            <CardHeader>
              <CardTitle>FAQ</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium text-sm mb-1">Bagaimana cara kerja deteksi kantuk?</h3>
                <p className="text-xs text-gray-600">
                  Sistem menggunakan AI untuk menganalisis gerakan mata dan mendeteksi tanda-tanda kantuk seperti mata
                  tertutup dalam waktu lama.
                </p>
              </div>

              <div>
                <h3 className="font-medium text-sm mb-1">Apakah data video saya disimpan?</h3>
                <p className="text-xs text-gray-600">
                  Tidak. Semua pemrosesan dilakukan secara lokal di perangkat Anda. Video tidak dikirim atau disimpan di
                  server.
                </p>
              </div>

              <div>
                <h3 className="font-medium text-sm mb-1">Apakah sistem berfungsi dalam kondisi cahaya rendah?</h3>
                <p className="text-xs text-gray-600">
                  Sistem bekerja paling baik dalam kondisi pencahayaan yang cukup. Pencahayaan yang terlalu rendah dapat
                  mengurangi akurasi deteksi.
                </p>
              </div>

              <div>
                <h3 className="font-medium text-sm mb-1">Apakah saya perlu koneksi internet?</h3>
                <p className="text-xs text-gray-600">
                  Tidak. Sistem dapat bekerja secara offline setelah halaman dimuat.
                </p>
              </div>

              <div>
                <h3 className="font-medium text-sm mb-1">Berapa akurasi sistem deteksi?</h3>
                <p className="text-xs text-gray-600">
                  Sistem memiliki tingkat akurasi tinggi dalam kondisi pencahayaan yang baik dan posisi wajah yang
                  tepat.
                </p>
              </div>

              <div>
                <h3 className="font-medium text-sm mb-1">Apakah bisa digunakan dengan kacamata?</h3>
                <p className="text-xs text-gray-600">
                  Ya, sistem dapat mendeteksi mata meskipun menggunakan kacamata, namun hindari kacamata dengan lensa
                  yang terlalu gelap.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

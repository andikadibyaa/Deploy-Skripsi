import Navbar from "../components/Navbar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Github, Linkedin, ExternalLink } from "lucide-react"

export default function TentangPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navbar />

      <div className="max-w-4xl mx-auto p-4">
        <div className="text-center mb-8 pt-4">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Tentang Jagamudi</h1>
          <p className="text-gray-600">Sistem deteksi kantuk berbasis AI untuk keselamatan berkendara</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Github className="w-5 h-5" />
                GitHub Repository
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  Akses source code lengkap, dokumentasi, dan kontribusi untuk pengembangan sistem deteksi kantuk ini.
                </p>

                <a
                  href="https://github.com/yourusername/drowsiness-detection"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-lg transition-colors duration-200 font-medium text-sm"
                >
                  <Github className="w-4 h-4" />
                  View on GitHub
                  <ExternalLink className="w-3 h-3" />
                </a>

                <div className="text-xs text-gray-500 space-y-1">
                  <p>• Open source project</p>
                  <p>• MIT License</p>
                  <p>• Contributions welcome</p>
                  <p>• Issues and bug reports</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Linkedin className="w-5 h-5" />
                LinkedIn Profile
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-sm text-gray-600">
                  Terhubung dengan pengembang untuk diskusi, kolaborasi, dan update terbaru tentang proyek ini.
                </p>

                <a
                  href="https://linkedin.com/in/yourprofile"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200 font-medium text-sm"
                >
                  <Linkedin className="w-4 h-4" />
                  Connect on LinkedIn
                  <ExternalLink className="w-3 h-3" />
                </a>

                <div className="text-xs text-gray-500 space-y-1">
                  <p>• Professional networking</p>
                  <p>• Project updates</p>
                  <p>• Technical discussions</p>
                  <p>• Career opportunities</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Tentang Proyek</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm text-gray-600">
              <p>
                Jagamudi adalah sistem deteksi kantuk real-time yang menggunakan teknologi computer vision dan
                machine learning untuk memantau kondisi mata pengemudi. Sistem ini dirancang untuk meningkatkan
                keselamatan berkendara dengan memberikan peringatan dini ketika terdeteksi tanda-tanda kantuk.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <div>
                  <h4 className="font-medium text-gray-800 mb-2">Teknologi yang Digunakan:</h4>
                  <ul className="space-y-1 text-xs">
                    <li>• Next.js & React</li>
                    <li>• TensorFlow & Keras</li>
                    <li>• OpenCV</li>
                    <li>• Tailwind CSS</li>
                    <li>• Python</li>
                  </ul>
                </div>

                <div>
                  <h4 className="font-medium text-gray-800 mb-2">Fitur Utama:</h4>
                  <ul className="space-y-1 text-xs">
                    <li>• Real-time detection</li>
                    <li>• Video upload analysis</li>
                    <li>• Audio alarm system</li>
                    <li>• Statistics tracking</li>
                    <li>• Responsive design</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

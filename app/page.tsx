"use client"

import type React from "react"

import { useEffect, useState, useRef } from "react"
import {
  Camera,
  Play,
  Square,
  AlertTriangle,
  Upload,
  FileVideo,
  CheckCircle,
  XCircle,
  Loader2,
  BarChart2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Navbar from "./components/Navbar"
import SafetyTips from "./components/SafetyTips"
import SettingsPanel from "./components/SettingsPanel"

export default function DrowsinessDetection() {
  const [currentPage, setCurrentPage] = useState("beranda")
  const [isDetecting, setIsDetecting] = useState(false)
  const [drowsinessScore, setDrowsinessScore] = useState(0)
  const [eyeStatus, setEyeStatus] = useState({ left: "open", right: "open" })
  const [isDrowsy, setIsDrowsy] = useState(false)
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [redAlertEnabled, setRedAlertEnabled] = useState(true)
  const [detectionCount, setDetectionCount] = useState(0)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const [uploadedVideo, setUploadedVideo] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingProgress, setProcessingProgress] = useState(0)
  const [videoResult, setVideoResult] = useState<{
    classification: "mengantuk" | "tidak_mengantuk" | null
    drowsyEpisodes: number
    totalFrames: number
    closedFrames: number
    openFrames: number
    fps: number
    duration: number
  } | null>(null)

  const [history, setHistory] = useState<any[]>([])

  useEffect(() => {
    if (isDetecting) {
      console.log("useEffect triggered: `isDetecting` is true. Starting processing.");
      startProcessing();
    }

    // This is a cleanup function. It runs when `isDetecting` changes to false
    // or when the component is unmounted. It's crucial for preventing memory leaks.
    return () => {
      if (intervalRef.current) {
        console.log("useEffect cleanup: Clearing interval.");
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isDetecting]); // The dependency array: This effect runs ONLY when `isDetecting` changes.

  const startDetection = async () => {
  try {
    console.log("Starting camera detection...");
    const mediaStream = await navigator.mediaDevices.getUserMedia({
      video: {
        width: { ideal: 640 },
        height: { ideal: 480 },
        facingMode: "user",
      },
    });

    setStream(mediaStream);
    if (videoRef.current) {
      videoRef.current.srcObject = mediaStream;
      videoRef.current.onloadedmetadata = () => {
        console.log("Video metadata loaded. Activating detection state.");
          
          // Reset all relevant states for a new session
        setDetectionCount(0);
        setDrowsinessScore(0);
        setEyeStatus({ left: "open", right: "open" });
        setIsDrowsy(false);
          
          // Set isDetecting to true LAST. This will trigger the useEffect hook to run.
        setIsDetecting(true);
      };
    }
  } catch (error) {
    console.error("Error accessing camera:", error);
    alert("Tidak dapat mengakses kamera. Pastikan izin kamera telah diberikan dan browser mendukung WebRTC.");
  }
}

const stopDetection = () => {
    console.log("Stopping detection...")
    if (stream) {
      stream.getTracks().forEach((track) => {
        track.stop()
        console.log("Track stopped:", track.kind)
      })
      setStream(null)
    }

    // --- MODIFIED ---
    // The useEffect will handle clearing the interval. 
    // Setting isDetecting to false is the key action here.
    setIsDetecting(false)
 
    // We can still clear intervalRef here as a failsafe, but useEffect is the primary mechanism.
    if (intervalRef.current) {
       clearInterval(intervalRef.current)
       intervalRef.current = null
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null
    }
    
    // Reset scores on stop
    setDrowsinessScore(0)
    setEyeStatus({ left: "open", right: "open" })
    setIsDrowsy(false)
    setDetectionCount(0)
  }

const startProcessing = () => {
    console.log("Starting frame processing interval...")
    // Clear any existing interval before starting a new one
    if (intervalRef.current) clearInterval(intervalRef.current);
    
    // This guard clause is still useful, but with the useEffect,
    // isDetecting will be true when this is called.
    if (!isDetecting) {
      console.log("Detection is not active, skipping frame processing.");
      return;
    }
    intervalRef.current = setInterval(() => {
        // The inner check is still a good safety measure
      if (isDetecting) {
        console.log("Sending frame to backend for detection...");
        sendFrameToBackend();
      }
    }, 1000); // 1 detik
  }

  // const simulateDetection = () => {
  //   setDetectionCount((prev) => prev + 1)

  //   // More realistic simulation with varying probabilities
  //   const timeOfDay = new Date().getHours()
  //   let drowsinessChance = 0.15 // Base 15% chance

  //   // Higher chance during typical drowsy hours
  //   if (timeOfDay >= 22 || timeOfDay <= 6) {
  //     drowsinessChance = 0.35 // 35% chance at night
  //   } else if (timeOfDay >= 13 && timeOfDay <= 15) {
  //     drowsinessChance = 0.25 // 25% chance during afternoon
  //   }

  //   const random = Math.random()
  //   const bothEyesClosed = random < drowsinessChance * 0.3
  //   const oneEyeClosed = random < drowsinessChance && !bothEyesClosed

  //   let leftEyeStatus: "open" | "closed" = "open"
  //   let rightEyeStatus: "open" | "closed" = "open"

  //   if (bothEyesClosed) {
  //     leftEyeStatus = "closed"
  //     rightEyeStatus = "closed"
  //   } else if (oneEyeClosed) {
  //     if (Math.random() > 0.5) {
  //       leftEyeStatus = "closed"
  //     } else {
  //       rightEyeStatus = "closed"
  //     }
  //   }

  //   console.log("Detection cycle:", {
  //     count: detectionCount + 1,
  //     leftEyeStatus,
  //     rightEyeStatus,
  //     drowsinessChance,
  //     currentScore: drowsinessScore,
  //   })

  //   setEyeStatus({
  //     left: leftEyeStatus,
  //     right: rightEyeStatus,
  //   })

  //   // Update drowsiness score based on eye status
  //   setDrowsinessScore((prevScore) => {
  //     let newScore = prevScore

  //     if (leftEyeStatus === "closed" && rightEyeStatus === "closed") {
  //       newScore = Math.min(prevScore + 3, 15) // Increase faster when both eyes closed
  //     } else if (leftEyeStatus === "closed" || rightEyeStatus === "closed") {
  //       newScore = Math.min(prevScore + 1, 15) // Slower increase for one eye
  //     } else {
  //       newScore = Math.max(prevScore - 2, 0) // Decrease when eyes are open
  //     }

  //     console.log("Score updated:", prevScore, "->", newScore)

  //     // Check for drowsiness threshold
  //     const newIsDrowsy = newScore > 8
  //     if (newIsDrowsy && !isDrowsy) {
  //       console.log("DROWSINESS DETECTED! Score:", newScore)
  //       playAlarm()
  //       setIsDrowsy(true)
  //     } else if (!newIsDrowsy && isDrowsy) {
  //       console.log("Drowsiness cleared. Score:", newScore)
  //       setIsDrowsy(false)
  //     }

  //     return newScore
  //   })
  // }

  const playAlarm = () => {
    try {
      // Create audio context
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()

      // Create oscillator for alarm sound
      const oscillator = audioContext.createOscillator()
      const gainNode = audioContext.createGain()

      oscillator.connect(gainNode)
      gainNode.connect(audioContext.destination)

      // Configure alarm sound
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime)
      oscillator.frequency.setValueAtTime(1000, audioContext.currentTime + 0.1)
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime + 0.2)

      oscillator.type = "sine"
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1)

      oscillator.start(audioContext.currentTime)
      oscillator.stop(audioContext.currentTime + 1)

      console.log("Alarm played successfully")
    } catch (error) {
      console.error("Error playing alarm:", error)
    }
  }

  const handleVideoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type.startsWith("video/")) {
      console.log("Video uploaded:", file.name, file.size)
      setUploadedVideo(file)
      setVideoResult(null)
    } else {
      alert("Silakan pilih file video yang valid")
    }
  }

  const processVideo = async () => {
    if (!uploadedVideo) return

    setIsProcessing(true)
    setProcessingProgress(0)
    setVideoResult(null)

    const formData = new FormData()
    formData.append("video", uploadedVideo)

    try {
      const res = await fetch("http://localhost:5000/analyze_video", {
        method: "POST",
        body: formData,
      })
      const data = await res.json()
      setVideoResult({
        classification: data.is_drowsy ? "mengantuk" : "tidak_mengantuk",
        drowsyEpisodes: data.drowsy_episodes,
        totalFrames: data.total_frames,      // <-- ini sudah benar
        closedFrames: data.closed_frames,
        openFrames: data.open_frames,
        fps: data.fps,
        duration: data.duration,
      })
      setProcessingProgress(100)
    } catch (error) {
      alert("Gagal memproses video.")
    } finally {
      setIsProcessing(false)
      setTimeout(() => setProcessingProgress(0), 2000)
    }
  }

  // Kirim frame webcam ke backend Flask API
  const sendFrameToBackend = async () => {
    if (!canvasRef.current || !videoRef.current) return
    const ctx = canvasRef.current.getContext("2d")
    ctx?.drawImage(videoRef.current, 0, 0, 224, 224) // Ukuran sesuai model
    canvasRef.current.toBlob(
      async (blob) => {
        if (!blob) return
        const formData = new FormData()
        formData.append("image", blob, "frame.jpg")
        try {
          const res = await fetch("http://localhost:5000/detect", {
            method: "POST",
            body: formData,
          })
          const data = await res.json();
          console.log("Response dari backend:", data);
          // Misal response: { left_eye: "open"/"closed", right_eye: "open"/"closed", score: 0-15 }
          setEyeStatus({ left: data.left_eye, right: data.right_eye })
          setDrowsinessScore((prevScore) => {
            let newScore = prevScore;
            if (data.left_eye === "closed" && data.right_eye === "closed") {
              newScore = Math.min(prevScore + 3, 15);
            } else if (data.left_eye === "closed" || data.right_eye === "closed") {
              newScore = Math.min(prevScore + 1, 15);
            } else {
              newScore = Math.max(prevScore - 2, 0);
            }
            return newScore;
          });
          setDetectionCount((prev) => prev + 1)
          setIsDrowsy(data.score > 8)
          if (data.score > 8 && redAlertEnabled) playAlarm()
        } catch (err) {
          console.error("Gagal deteksi AI:", err)
        }
      },
      "image/jpeg",
    )
  }

  useEffect(() => {
    return () => {
      // Cleanup on component unmount
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
      if (stream) {
        stream.getTracks().forEach((track) => track.stop())
      }
    }
  }, [])

  // Update isDrowsy state when score changes
  useEffect(() => {
    const newIsDrowsy = drowsinessScore > 8
    if (newIsDrowsy !== isDrowsy) {
      setIsDrowsy(newIsDrowsy)
      if (newIsDrowsy) {
        playAlarm()
      }
    }
  }, [drowsinessScore, isDrowsy])

  useEffect(() => {
    fetch("http://localhost:5000/history")
      .then((res) => res.json())
      .then((data) => setHistory(data))
      .catch(() => setHistory([]))
  }, [])

  const renderMainContent = () => (
    <div>
      <div className="text-center mb-8 pt-4">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Sistem Deteksi Kantuk Real-time</h1>
        <p className="text-gray-600">Monitoring kantuk menggunakan deteksi mata dengan AI</p>
      </div>

      <Tabs defaultValue="realtime" className="mb-6">
        <TabsList className="grid grid-cols-2 mb-6">
          <TabsTrigger value="realtime">Real-time Detection</TabsTrigger>
          <TabsTrigger value="upload">Upload Video</TabsTrigger>
        </TabsList>

        <TabsContent value="realtime">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Video Feed */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Camera className="w-5 h-5" />
                    Live Camera Feed
                    {isDetecting && (
                      <span className="ml-2 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">AKTIF</span>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative bg-black rounded-lg overflow-hidden">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-auto max-h-96"
                      style={{ display: isDetecting ? "block" : "none" }}
                    />
                    <canvas ref={canvasRef} className="hidden" />

                    {!isDetecting && (
                      <div className="aspect-video flex items-center justify-center text-gray-400">
                        <div className="text-center">
                          <Camera className="w-16 h-16 mx-auto mb-4 opacity-50" />
                          <p>Kamera belum aktif</p>
                          <p className="text-sm mt-2">Klik "Mulai Deteksi" untuk memulai</p>
                        </div>
                      </div>
                    )}

                    {/* Drowsiness Alert Overlay */}
                    {isDrowsy && redAlertEnabled && (
                      <div className="absolute inset-0 border-4 border-red-500 animate-pulse">
                        <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold animate-pulse">
                          ⚠️ PERINGATAN KANTUK!
                        </div>
                      </div>
                    )}

                    {/* Detection Status Overlay */}
                    {isDetecting && (
                      <div className="absolute bottom-4 left-4 bg-black bg-opacity-70 text-white px-3 py-2 rounded-lg text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                          <span>Deteksi #{detectionCount}</span>
                        </div>
                        <div className="mt-1">Skor: {drowsinessScore}/15</div>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-4 mt-4">
                      {!isDetecting ? (
                        <Button
                          onClick={startDetection}
                          className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                        >
                          <Play className="w-4 h-4" />
                          Mulai Deteksi
                        </Button>
                      ) : (
                        <Button onClick={stopDetection} variant="destructive" className="flex items-center gap-2">
                          <Square className="w-4 h-4" />
                          Stop Deteksi
                        </Button>
                      )}
                    </div>
                </CardContent>
              </Card>
            </div>

            {/* Status Panel */}
            <div className="space-y-6">
              {isDrowsy && (
                <Alert className="border-red-200 bg-red-50">
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                  <AlertDescription className="text-red-800">
                    <strong>Peringatan!</strong> Terdeteksi tanda-tanda kantuk. Segera istirahat!
                  </AlertDescription>
                </Alert>
              )}

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Petunjuk Penggunaan</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-gray-600 space-y-2">
                  <p>1. Klik "Mulai Deteksi" untuk mengaktifkan kamera</p>
                  <p>2. Posisikan wajah di depan kamera dengan pencahayaan cukup</p>
                  <p>3. Sistem akan memantau mata Anda secara real-time</p>
                  <p>4. Alarm akan berbunyi jika terdeteksi kantuk</p>
                  <p>5. Border merah akan muncul saat peringatan aktif</p>
                </CardContent>
              </Card>

              {isDetecting && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-sm">Status Saat Ini</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Status:</span>
                      <span
                        className={`text-sm font-medium px-2 py-1 rounded ${
                          isDrowsy ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"
                        }`}
                      >
                        {isDrowsy ? "🚨 MENGANTUK" : "✅ NORMAL"}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full transition-all duration-300 ${
                          drowsinessScore > 10 ? "bg-red-500" : drowsinessScore > 5 ? "bg-yellow-500" : "bg-green-500"
                        }`}
                        style={{ width: `${(drowsinessScore / 15) * 100}%` }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-500 text-center">Skor Kantuk: {drowsinessScore}/15</div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="upload">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Video Upload Section */}
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileVideo className="w-5 h-5" />
                    Upload Video untuk Analisis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Upload Area */}
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
                      <input
                        type="file"
                        accept="video/*"
                        onChange={handleVideoUpload}
                        className="hidden"
                        id="video-upload"
                      />
                      <label htmlFor="video-upload" className="cursor-pointer">
                        <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                        <p className="text-lg font-medium text-gray-700 mb-2">Klik untuk upload video</p>
                        <p className="text-sm text-gray-500">Mendukung format MP4, AVI, MOV (Max: 100MB)</p>
                        <p className="text-xs text-gray-400 mt-2">
                          Pilih video yang ingin dianalisis. Sistem akan mendeteksi pola mata dan memberikan hasil analisis.
                        </p>
                      </label>
                    </div>

                    {/* Selected Video Info */}
                    {uploadedVideo && (
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <div className="flex items-center gap-3">
                          <FileVideo className="w-5 h-5 text-blue-600" />
                          <div>
                            <p className="font-medium text-blue-900">{uploadedVideo.name}</p>
                            <p className="text-sm text-blue-600">
                              Ukuran: {(uploadedVideo.size / (1024 * 1024)).toFixed(2)} MB
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Processing Progress */}
                    {isProcessing && (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin" />
                          <span className="text-sm">Memproses video... {processingProgress.toFixed(0)}%</span>
                        </div>
                        <Progress value={processingProgress} className="w-full" />
                        <p className="text-xs text-gray-500">Menganalisis frame dan mendeteksi pola mata...</p>
                      </div>
                    )}

                    {/* Process Button */}
                    <Button onClick={processVideo} disabled={!uploadedVideo || isProcessing} className="w-full">
                      {isProcessing ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Memproses...
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 mr-2" />
                          Analisis Video
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Results Section */}
            <div className="space-y-6">
              {videoResult && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      {videoResult.classification === "mengantuk" ? (
                        <XCircle className="w-5 h-5 text-red-500" />
                      ) : (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      )}
                      Hasil Analisis Video
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="text-center">
                        <div
                          className={`text-2xl font-bold mb-2 ${
                            videoResult.classification === "mengantuk" ? "text-red-600" : "text-green-600"
                          }`}
                        >
                          {videoResult.classification === "mengantuk" ? "🚨 MENGANTUK" : "✅ TIDAK MENGANTUK"}
                        </div>
                        <div
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            videoResult.classification === "mengantuk"
                              ? "bg-red-100 text-red-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {videoResult.classification === "mengantuk" ? "Terdeteksi Kantuk" : "Normal"}
                        </div>
                      </div>

                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Episode Mengantuk:</span>
                          <span className="font-medium text-red-600">{videoResult.drowsyEpisodes}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Total Frame:</span>
                          <span className="font-medium">
                            {typeof videoResult.totalFrames === "number" ? videoResult.totalFrames.toLocaleString() : "-"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Frame Mata Tertutup:</span>
                          <span className="font-medium text-red-600">
                            {typeof videoResult.closedFrames === "number" ? videoResult.closedFrames.toLocaleString() : "-"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Frame Mata Terbuka:</span>
                          <span className="font-medium text-green-600">
                            {typeof videoResult.openFrames === "number" ? videoResult.openFrames.toLocaleString() : "-"}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Persentase Mata Tertutup:</span>
                          <span className="font-medium">
                            {((videoResult.closedFrames / videoResult.totalFrames) * 100).toFixed(1)}%
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Frame Rate:</span>
                          <span className="font-medium">{videoResult.fps} fps</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Durasi Video:</span>
                          <span className="font-medium">{videoResult.duration}s</span>
                        </div>
                      </div>

                      {videoResult.drowsyEpisodes > 0 && (
                        <div className="mt-4 p-3 bg-red-50 rounded-lg">
                          <p className="text-xs text-red-700">
                            <strong>Catatan:</strong> Terdeteksi {videoResult.drowsyEpisodes} episode mata tertutup
                            lebih dari 300ms, yang mengindikasikan kantuk atau microsleep.
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Petunjuk Upload Video</CardTitle>
                </CardHeader>
                <CardContent className="text-sm text-gray-600 space-y-2">
                  <p>1. Pilih video yang ingin dianalisis</p>
                  <p>2. Pastikan wajah terlihat jelas dalam video</p>
                  <p>3. Video dengan pencahayaan baik memberikan hasil lebih akurat</p>
                  <p>4. Klik "Analisis Video" untuk memulai</p>
                  <p>5. Tunggu hingga proses selesai</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )

  const renderContent = () => {
    switch (currentPage) {
      case "beranda":
      case "deteksi":
        return renderMainContent()

      case "pengaturan":
        return (
          <div>
            <div className="text-center mb-8 pt-4">
              <h1 className="text-4xl font-bold text-gray-800 mb-2">Pengaturan Sistem</h1>
              <p className="text-gray-600">Konfigurasi dan preferensi sistem deteksi kantuk</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SettingsPanel onRedAlertChange={setRedAlertEnabled} redAlertEnabled={redAlertEnabled} />

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
        )

      case "tips":
        return (
          <div>
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
                      Sistem menggunakan AI untuk menganalisis gerakan mata dan mendeteksi tanda-tanda kantuk seperti
                      mata tertutup dalam waktu lama.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-medium text-sm mb-1">Apakah data video saya disimpan?</h3>
                    <p className="text-xs text-gray-600">
                      Tidak. Semua pemrosesan dilakukan secara lokal di perangkat Anda. Video tidak dikirim atau
                      disimpan di server.
                    </p>
                  </div>

                  <div>
                    <h3 className="font-medium text-sm mb-1">Apakah sistem berfungsi dalam kondisi cahaya rendah?</h3>
                    <p className="text-xs text-gray-600">
                      Sistem bekerja paling baik dalam kondisi pencahayaan yang cukup. Pencahayaan yang terlalu rendah
                      dapat mengurangi akurasi deteksi.
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
                      Ya, sistem dapat mendeteksi mata meskipun menggunakan kacamata, namun hindari kacamata dengan
                      lensa yang terlalu gelap.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )

      case "tentang":
        return (
          <div>
            <div className="text-center mb-8 pt-4">
              <h1 className="text-4xl font-bold text-gray-800 mb-2">Tentang Jagamudi</h1>
              <p className="text-gray-600">Sistem deteksi kantuk berbasis AI untuk keselamatan berkendara</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                    </svg>
                    GitHub Repository
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-sm text-gray-600">
                      Akses source code lengkap, dokumentasi, dan kontribusi untuk pengembangan sistem deteksi kantuk
                      ini.
                    </p>

                    <a
                      href="https://github.com/yourusername/drowsiness-detection"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white rounded-lg transition-colors duration-200 font-medium text-sm"
                    >
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                      </svg>
                      View on GitHub
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
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
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
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                      Connect on LinkedIn
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
                        <li>• Responsive design</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      default:
        return renderMainContent()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Navbar - Always visible */}
      <Navbar currentPage={currentPage} onPageChange={setCurrentPage} />

      {/* Main Content */}
      <div className="max-w-6xl mx-auto p-4">{renderContent()}</div>
    </div>
  )
}

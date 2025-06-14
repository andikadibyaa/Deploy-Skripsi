"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Upload, FileVideo, Play, Loader2, CheckCircle, XCircle } from "lucide-react"

interface VideoResult {
  classification: "mengantuk" | "tidak_mengantuk"
  drowsyEpisodes: number
  maxClosedStreak: number
  totalFrames: number
  fps: number
  duration: number
}

export default function VideoUploadCard() {
  const [uploadedVideo, setUploadedVideo] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [processingProgress, setProcessingProgress] = useState(0)
  const [videoResult, setVideoResult] = useState<VideoResult | null>(null)

  const handleVideoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type.startsWith("video/")) {
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

    // Simulate progress updates
    const progressInterval = setInterval(() => {
      setProcessingProgress((prev) => {
        if (prev >= 90) {
          clearInterval(progressInterval)
          return 90
        }
        return prev + Math.random() * 10
      })
    }, 500)

    const formData = new FormData()
    formData.append("video", uploadedVideo)

    try {
      const response = await fetch("/api/process-video", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error("Gagal memproses video")
      }

      const result = await response.json()
      setVideoResult(result)
      setProcessingProgress(100)
    } catch (error) {
      console.error("Error processing video:", error)
      alert("Gagal memproses video. Silakan coba lagi.")
    } finally {
      clearInterval(progressInterval)
      setIsProcessing(false)
      setTimeout(() => setProcessingProgress(0), 1000)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Upload Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileVideo className="w-5 h-5" />
            Upload Video
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Upload Area */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
            <input type="file" accept="video/*" onChange={handleVideoUpload} className="hidden" id="video-upload" />
            <label htmlFor="video-upload" className="cursor-pointer">
              <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p className="text-lg font-medium text-gray-700 mb-2">Klik untuk upload video</p>
              <p className="text-sm text-gray-500">Mendukung format MP4, AVI, MOV (Max: 100MB)</p>
            </label>
          </div>

          {/* Selected Video Info */}
          {uploadedVideo && (
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center gap-3">
                <FileVideo className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="font-medium text-blue-900">{uploadedVideo.name}</p>
                  <p className="text-sm text-blue-600">Ukuran: {(uploadedVideo.size / (1024 * 1024)).toFixed(2)} MB</p>
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
        </CardContent>
      </Card>

      {/* Results Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {videoResult ? (
              videoResult.classification === "mengantuk" ? (
                <XCircle className="w-5 h-5 text-red-500" />
              ) : (
                <CheckCircle className="w-5 h-5 text-green-500" />
              )
            ) : (
              <FileVideo className="w-5 h-5 text-gray-400" />
            )}
            Hasil Analisis
          </CardTitle>
        </CardHeader>
        <CardContent>
          {videoResult ? (
            <div className="space-y-4">
              <div className="text-center">
                <div
                  className={`text-2xl font-bold mb-2 ${
                    videoResult.classification === "mengantuk" ? "text-red-600" : "text-green-600"
                  }`}
                >
                  {videoResult.classification === "mengantuk" ? "MENGANTUK" : "TIDAK MENGANTUK"}
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
                  <span className="font-medium">{videoResult.drowsyEpisodes}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Durasi Terlama Mata Tertutup:</span>
                  <span className="font-medium">
                    {((videoResult.maxClosedStreak / videoResult.fps) * 1000).toFixed(0)}ms
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Frame:</span>
                  <span className="font-medium">{videoResult.totalFrames}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Frame Rate:</span>
                  <span className="font-medium">{videoResult.fps.toFixed(1)} fps</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Durasi Video:</span>
                  <span className="font-medium">{videoResult.duration.toFixed(1)}s</span>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">
              <FileVideo className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Upload dan proses video untuk melihat hasil analisis</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

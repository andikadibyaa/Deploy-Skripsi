import { type NextRequest, NextResponse } from "next/server"

// Interface untuk response deteksi
interface DetectionResult {
  leftEye: "open" | "closed"
  rightEye: "open" | "closed"
  drowsinessScore: number
  isDrowsy: boolean
  timestamp: number
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const imageFile = formData.get("image") as File

    if (!imageFile) {
      return NextResponse.json({ error: "No image provided" }, { status: 400 })
    }

    // Convert image to buffer for processing
    const bytes = await imageFile.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Simulasi processing - dalam implementasi nyata,
    // di sini Anda akan memanggil model Python atau TensorFlow.js
    const result = await simulateDetection(buffer)

    return NextResponse.json(result)
  } catch (error) {
    console.error("Detection error:", error)
    return NextResponse.json({ error: "Detection failed" }, { status: 500 })
  }
}

async function simulateDetection(imageBuffer: Buffer): Promise<DetectionResult> {
  // Simulasi delay processing
  await new Promise((resolve) => setTimeout(resolve, 100))

  // Simulasi hasil deteksi
  const random = Math.random()
  const leftEye = random > 0.3 ? "open" : "closed"
  const rightEye = random > 0.2 ? "open" : "closed"

  // Hitung skor kantuk berdasarkan status mata
  let drowsinessScore = 0
  if (leftEye === "closed" && rightEye === "closed") {
    drowsinessScore = Math.floor(Math.random() * 5) + 8 // 8-12
  } else if (leftEye === "closed" || rightEye === "closed") {
    drowsinessScore = Math.floor(Math.random() * 3) + 3 // 3-5
  } else {
    drowsinessScore = Math.floor(Math.random() * 3) // 0-2
  }

  return {
    leftEye: leftEye as "open" | "closed",
    rightEye: rightEye as "open" | "closed",
    drowsinessScore,
    isDrowsy: drowsinessScore > 10,
    timestamp: Date.now(),
  }
}

// Endpoint untuk mendapatkan status sistem
export async function GET() {
  return NextResponse.json({
    status: "active",
    version: "1.0.0",
    features: ["eye_detection", "drowsiness_scoring", "real_time_monitoring"],
  })
}

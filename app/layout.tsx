import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Sistem Deteksi Kantuk Real-time",
  description: "Aplikasi web untuk mendeteksi kantuk secara real-time menggunakan AI dan computer vision",
  keywords: "deteksi kantuk, drowsiness detection, AI, computer vision, keselamatan berkendara",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id">
      <body className={inter.className}>{children}</body>
    </html>
  )
}

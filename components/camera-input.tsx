"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Camera, X, Check, RotateCcw } from "lucide-react"
import { useLanguage } from "@/components/language-provider"

interface CameraInputProps {
  onCapture: (imageData: string) => void
  onCancel: () => void
}

export default function CameraInput({ onCapture, onCancel }: CameraInputProps) {
  const { t } = useLanguage()
  const [stream, setStream] = useState<MediaStream | null>(null)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const startCamera = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
        })
        setStream(mediaStream)
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream
        }
      } catch (error) {
        console.error("Error accessing camera:", error)
      }
    }

    startCamera()

    return () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop())
      }
    }
  }, [])

  const captureImage = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current
      const canvas = canvasRef.current
      const context = canvas.getContext("2d")

      if (context) {
        canvas.width = video.videoWidth
        canvas.height = video.videoHeight
        context.drawImage(video, 0, 0, canvas.width, canvas.height)
        const imageData = canvas.toDataURL("image/jpeg")
        setCapturedImage(imageData)
      }
    }
  }

  const retakeImage = () => {
    setCapturedImage(null)
  }

  const confirmImage = () => {
    if (capturedImage) {
      onCapture(capturedImage)
    }
  }

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col">
      <div className="relative flex-1">
        {!capturedImage ? (
          <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
        ) : (
          <img src={capturedImage || "/placeholder.svg"} alt="Captured" className="w-full h-full object-contain" />
        )}
        <canvas ref={canvasRef} className="hidden" />
      </div>

      <div className="bg-black p-4 flex justify-center items-center space-x-4">
        <Button
          variant="outline"
          size="icon"
          className="rounded-full bg-red-500 hover:bg-red-600 text-white"
          onClick={onCancel}
        >
          <X className="h-6 w-6" />
        </Button>

        {!capturedImage ? (
          <Button
            variant="outline"
            size="icon"
            className="rounded-full w-16 h-16 bg-white hover:bg-gray-200"
            onClick={captureImage}
          >
            <Camera className="h-8 w-8 text-black" />
          </Button>
        ) : (
          <>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full w-16 h-16 bg-white hover:bg-gray-200"
              onClick={retakeImage}
            >
              <RotateCcw className="h-8 w-8 text-black" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full bg-green-500 hover:bg-green-600 text-white"
              onClick={confirmImage}
            >
              <Check className="h-6 w-6" />
            </Button>
          </>
        )}
      </div>
    </div>
  )
}


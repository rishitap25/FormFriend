"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Camera, FileText } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useRouter } from "next/navigation"

export function UploadForm() {
  const [isUploading, setIsUploading] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const router = useRouter()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) return

    setIsUploading(true)

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // In a real app, you would upload the file to a server here
    // and process it with OCR

    setIsUploading(false)
    router.push("/form/123")
  }

  const handleCameraCapture = async () => {
    // This would be implemented with a camera API in a real app
    setIsUploading(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setIsUploading(false)
    router.push("/form/123")
  }

  return (
    <Tabs defaultValue="upload" className="w-full">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="upload">Upload File</TabsTrigger>
        <TabsTrigger value="camera">Take Photo</TabsTrigger>
      </TabsList>

      <TabsContent value="upload">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid w-full gap-1.5">
            <Label htmlFor="form-file">Upload Form</Label>
            <div className="flex items-center gap-2">
              <Input
                id="form-file"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileChange}
                className="flex-1"
              />
            </div>
            <p className="text-sm text-muted-foreground">Accepted formats: PDF, JPG, PNG</p>
          </div>

          {file && (
            <div className="flex items-center gap-2 p-2 border rounded bg-muted/50">
              <FileText className="h-5 w-5 text-muted-foreground" />
              <span className="text-sm truncate">{file.name}</span>
            </div>
          )}

          <Button type="submit" className="w-full" disabled={!file || isUploading}>
            {isUploading ? "Processing..." : "Upload and Process Form"}
          </Button>
        </form>
      </TabsContent>

      <TabsContent value="camera">
        <div className="space-y-4">
          <div className="border-2 border-dashed rounded-lg p-4 aspect-video flex flex-col items-center justify-center bg-muted/50">
            <Camera className="h-12 w-12 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground text-center">Camera preview will appear here</p>
          </div>

          <Button onClick={handleCameraCapture} className="w-full" disabled={isUploading}>
            {isUploading ? "Processing..." : "Take Photo"}
          </Button>
        </div>
      </TabsContent>
    </Tabs>
  )
}


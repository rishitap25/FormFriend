"use client"

import type React from "react"
import { useContext } from "react"
import { LanguageContext } from "@/components/language-provider"
import { useTranslation } from "@/hooks/use-translation"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Camera, Upload, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { recognizeText } from "@/lib/ocr"
import { translateText } from "@/lib/translation"
import { saveForm } from "@/lib/storage"

export default function TranslateSourcesPage() {
  const { t, language } = useTranslation() // ✅ FIXED
  const { toast } = useToast()
  const [file, setFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [extractedText, setExtractedText] = useState<string>("")
  const [translatedText, setTranslatedText] = useState<string>("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [activeTab, setActiveTab] = useState<string>("upload")


  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      setFile(selectedFile)

      // Create preview
      const reader = new FileReader()
      reader.onload = (event) => {
        setImagePreview(event.target?.result as string)
      }
      reader.readAsDataURL(selectedFile)

      // Reset text states
      setExtractedText("")
      setTranslatedText("")
    }
  }

  const handleProcess = async () => {
    if (!file || !imagePreview) {
      toast({
        title: "Error",
        description: "Please upload or scan a document first",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)

    try {
      // Extract text using OCR
      const text = await recognizeText(imagePreview)
      setExtractedText(text)

      // Translate the extracted text
      if (text && language !== "en") {
        const translated = await translateText(text, "en", language)
        setTranslatedText(translated)
      } else {
        setTranslatedText(text) // If language is English, no translation needed
      }

      // Save to local storage
      if (text) {
        saveForm({
          id: Date.now().toString(),
          name: file.name,
          originalText: text,
          translatedText: translatedText || text,
          imageUrl: imagePreview,
          language,
          date: new Date().toISOString(),
        })

        toast({
          title: "Success",
          description: "Document processed and saved successfully",
        })
      }
    } catch (error) {
      console.error("Error processing document:", error)
      toast({
        title: "Error",
        description: "Failed to process document. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleCameraCapture = () => {
    // This would be implemented with a camera API
    // For now, we'll just show a message
    toast({
      title: "Camera Capture",
      description: "Camera functionality will be implemented in a future update",
    })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-primary">{t("translateSources")}</h1>

      <Tabs defaultValue="upload" onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger value="upload">{t("uploadDocument")}</TabsTrigger>
          <TabsTrigger value="scan">{t("scanDocument")}</TabsTrigger>
        </TabsList>

        <TabsContent value="upload" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-12">
                <Upload className="h-12 w-12 text-gray-400 mb-4" />
                <p className="text-sm text-gray-500 mb-4">Upload a PDF or image of your document</p>
                <input
                  type="file"
                  id="file-upload"
                  className="hidden"
                  accept="image/*,.pdf"
                  onChange={handleFileChange}
                />
<label htmlFor="file-upload">
  <Button type="button">Choose File</Button>
</label>

              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scan" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-12">
                <Camera className="h-12 w-12 text-gray-400 mb-4" />
                <p className="text-sm text-gray-500 mb-4">Use your camera to scan a document</p>
                <Button onClick={handleCameraCapture}>Open Camera</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {imagePreview && (
        <div className="mt-8 space-y-4">
          <h2 className="text-xl font-semibold">Document Preview</h2>
          <div className="border rounded-lg overflow-hidden">
            <img
              src={imagePreview || "/placeholder.svg"}
              alt="Document preview"
              className="max-w-full h-auto mx-auto"
            />
          </div>

          <div className="flex justify-center mt-4">
            <Button onClick={handleProcess} disabled={isProcessing} className="bg-[#ff6361] hover:bg-[#e55350]">
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {t("processing")}
                </>
              ) : (
                t("translate")
              )}
            </Button>
          </div>
        </div>
      )}

      {translatedText && (
        <div className="mt-8 space-y-4">
          <h2 className="text-xl font-semibold">Translated Document</h2>
          <Card>
            <CardContent className="pt-6">
              <div className="whitespace-pre-wrap">{translatedText}</div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}


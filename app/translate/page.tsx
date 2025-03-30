"use client"

import { useState } from "react"
import { useLanguage } from "@/components/language-provider"
import Navbar from "@/components/navbar"
import CameraInput from "@/components/camera-input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Scan, Save, X } from "lucide-react"
import { performOCR, translateText } from "@/lib/ocr-service"
import { saveForm } from "@/lib/form-storage"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

export default function TranslatePage() {
  const { t, language } = useLanguage()
  const router = useRouter()
  const { toast } = useToast()
  const [showCamera, setShowCamera] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [originalText, setOriginalText] = useState("")
  const [translatedText, setTranslatedText] = useState("")
  const [targetLanguage, setTargetLanguage] = useState(language)
  const [formTitle, setFormTitle] = useState("Untitled Form")

  const handleCapture = async (imageData: string) => {
    setShowCamera(false)
    setIsProcessing(true)

    try {
      // Perform OCR on the captured image
      const extractedText = await performOCR(imageData)
      setOriginalText(extractedText)

      // Translate the extracted text
      const translated = await translateText(extractedText, targetLanguage)
      setTranslatedText(translated)
    } catch (error) {
      console.error("Error processing document:", error)
      toast({
        title: "Error",
        description: "Failed to process the document",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleSave = () => {
    if (!originalText) return

    const newForm = saveForm({
      title: formTitle,
      type: "translated",
      content: originalText,
      translatedContent: translatedText,
      language: targetLanguage,
      thumbnail: "", // In a real app, we would save a thumbnail of the document
    })

    toast({
      title: "Form Saved",
      description: "The form has been saved to your collection",
    })

    router.push("/saved-forms")
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto pt-24 pb-10 px-4">
        <h1 className="text-3xl font-bold text-primary mb-6">{t("formTranslation")}</h1>

        {showCamera ? (
          <CameraInput onCapture={handleCapture} onCancel={() => setShowCamera(false)} />
        ) : (
          <div>
            {!originalText ? (
              <Card className="mb-6">
                <CardContent className="pt-6 flex flex-col items-center">
                  <p className="text-center text-muted-foreground mb-6">Scan a document to translate it</p>
                  <Button
                    size="lg"
                    className="bg-[#58508d] hover:bg-[#58508d]/90 text-white"
                    onClick={() => setShowCamera(true)}
                  >
                    <Scan className="mr-2 h-5 w-5" />
                    {t("scan")}
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <>
                <div className="flex justify-between items-center mb-4">
                  <input
                    type="text"
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    className="bg-transparent border-b border-primary/30 focus:border-primary outline-none px-2 py-1 text-lg font-medium"
                    placeholder="Form Title"
                  />
                  <div className="flex items-center space-x-2">
                    <Select value={targetLanguage} onValueChange={setTargetLanguage}>
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select Language" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="en">English</SelectItem>
                        <SelectItem value="es">Español</SelectItem>
                        <SelectItem value="zh">中文</SelectItem>
                        <SelectItem value="fr">Français</SelectItem>
                        <SelectItem value="ar">العربية</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        setOriginalText("")
                        setTranslatedText("")
                      }}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                  <Card>
                    <CardContent className="pt-6">
                      <h3 className="font-medium mb-2">Original Document</h3>
                      <div className="bg-secondary/20 p-4 rounded-md h-[400px] overflow-y-auto">
                        <pre className="whitespace-pre-wrap">{originalText}</pre>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardContent className="pt-6">
                      <h3 className="font-medium mb-2">Translated Document ({targetLanguage})</h3>
                      <div className="bg-secondary/20 p-4 rounded-md h-[400px] overflow-y-auto">
                        <pre className="whitespace-pre-wrap">{translatedText}</pre>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div className="flex justify-center">
                  <Button size="lg" className="bg-[#ffa600] hover:bg-[#ffa600]/90 text-white" onClick={handleSave}>
                    <Save className="mr-2 h-5 w-5" />
                    Save Translation
                  </Button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}


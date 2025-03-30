"use client"

import { useState } from "react"
import { useLanguage } from "@/components/language-provider"
import Navbar from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Scan, FileText, Check } from "lucide-react"
import CameraInput from "@/components/camera-input"
import { performOCR } from "@/lib/ocr-service"
import { generateDocumentChecklist } from "@/lib/ai-service"
import { useToast } from "@/hooks/use-toast"
import { Checkbox } from "@/components/ui/checkbox"
import { getSavedForms, type SavedForm } from "@/lib/form-storage"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

export default function ChecklistPage() {
  const { t, language } = useLanguage()
  const { toast } = useToast()
  const [showCamera, setShowCamera] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [formType, setFormType] = useState("")
  const [checklist, setChecklist] = useState<string[]>([])
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({})
  const [showFormsDialog, setShowFormsDialog] = useState(false)
  const [savedForms, setSavedForms] = useState<SavedForm[]>([])

  const handleCapture = async (imageData: string) => {
    setShowCamera(false)
    setIsProcessing(true)

    try {
      // Perform OCR on the captured image to determine form type
      const extractedText = await performOCR(imageData)

      // In a real app, we would analyze the text to determine the form type
      // For demo purposes, we'll use a generic form type
      const detectedFormType = "Immigration Form"
      setFormType(detectedFormType)

      // Generate a checklist for this form type
      const items = await generateDocumentChecklist(detectedFormType, language)
      setChecklist(items)

      // Initialize all items as unchecked
      const initialCheckedState: Record<string, boolean> = {}
      items.forEach((item) => {
        initialCheckedState[item] = false
      })
      setCheckedItems(initialCheckedState)
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

  const toggleCheckedItem = (item: string) => {
    setCheckedItems({
      ...checkedItems,
      [item]: !checkedItems[item],
    })
  }

  const handleShowSavedForms = () => {
    setSavedForms(getSavedForms())
    setShowFormsDialog(true)
  }

  const handleSelectForm = async (form: SavedForm) => {
    setShowFormsDialog(false)
    setIsProcessing(true)

    try {
      // In a real app, we would analyze the form content to determine the form type
      setFormType(form.title)

      // Generate a checklist for this form
      const items = await generateDocumentChecklist(form.title, language)
      setChecklist(items)

      // Initialize all items as unchecked
      const initialCheckedState: Record<string, boolean> = {}
      items.forEach((item) => {
        initialCheckedState[item] = false
      })
      setCheckedItems(initialCheckedState)
    } catch (error) {
      console.error("Error generating checklist:", error)
      toast({
        title: "Error",
        description: "Failed to generate checklist",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto pt-24 pb-10 px-4">
        <h1 className="text-3xl font-bold text-primary mb-6">{t("documentChecklist")}</h1>

        {showCamera ? (
          <CameraInput onCapture={handleCapture} onCancel={() => setShowCamera(false)} />
        ) : (
          <div>
            {!formType ? (
              <Card className="mb-6">
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button
                      size="lg"
                      className="bg-[#58508d] hover:bg-[#58508d]/90 text-white h-24"
                      onClick={() => setShowCamera(true)}
                    >
                      <Scan className="mr-2 h-5 w-5" />
                      {t("scanDocuments")}
                    </Button>
                    <Button
                      size="lg"
                      className="bg-[#bc5090] hover:bg-[#bc5090]/90 text-white h-24"
                      onClick={handleShowSavedForms}
                    >
                      <FileText className="mr-2 h-5 w-5" />
                      {t("savedForms")}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <>
                <Card className="mb-6">
                  <CardContent className="pt-6">
                    <h2 className="text-xl font-semibold mb-4">{formType}</h2>

                    {isProcessing ? (
                      <div className="text-center py-10">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary mx-auto mb-4"></div>
                        <p>Generating checklist...</p>
                      </div>
                    ) : (
                      <>
                        <div className="space-y-3 mb-6">
                          {checklist.map((item, index) => (
                            <div key={index} className="flex items-start space-x-2">
                              <Checkbox
                                id={`item-${index}`}
                                checked={checkedItems[item] || false}
                                onCheckedChange={() => toggleCheckedItem(item)}
                              />
                              <label
                                htmlFor={`item-${index}`}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                              >
                                {item}
                              </label>
                            </div>
                          ))}
                        </div>

                        <div className="flex justify-center">
                          <Button className="bg-[#ffa600] hover:bg-[#ffa600]/90 text-white">
                            <Check className="mr-2 h-5 w-5" />
                            {t("autoFill")}
                          </Button>
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>

                <div className="flex justify-center">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setFormType("")
                      setChecklist([])
                      setCheckedItems({})
                    }}
                  >
                    Start Over
                  </Button>
                </div>
              </>
            )}
          </div>
        )}

        <Dialog open={showFormsDialog} onOpenChange={setShowFormsDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t("savedForms")}</DialogTitle>
            </DialogHeader>
            <div className="max-h-[60vh] overflow-y-auto">
              {savedForms.length === 0 ? (
                <p className="text-center py-4 text-muted-foreground">No saved forms found</p>
              ) : (
                <div className="space-y-2">
                  {savedForms.map((form) => (
                    <Card
                      key={form.id}
                      className="cursor-pointer hover:bg-secondary/10"
                      onClick={() => handleSelectForm(form)}
                    >
                      <CardContent className="p-4">
                        <h3 className="font-medium">{form.title}</h3>
                        <p className="text-sm text-muted-foreground">{new Date(form.dateAdded).toLocaleDateString()}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}


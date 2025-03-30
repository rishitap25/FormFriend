"use client"

import { useState, useEffect } from "react"
import { useLanguage } from "@/components/language-provider"
import Navbar from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Eye, Trash2, Languages, HelpCircle, CheckSquare } from "lucide-react"
import { getSavedForms, deleteForm, type SavedForm } from "@/lib/form-storage"
import Link from "next/link"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"

export default function SavedFormsPage() {
  const { t } = useLanguage()
  const { toast } = useToast()
  const [forms, setForms] = useState<SavedForm[]>([])
  const [selectedForm, setSelectedForm] = useState<SavedForm | null>(null)
  const [showViewDialog, setShowViewDialog] = useState(false)

  useEffect(() => {
    setForms(getSavedForms())
  }, [])

  const handleDelete = (id: string) => {
    deleteForm(id)
    setForms(getSavedForms())
    toast({
      title: "Form Deleted",
      description: "The form has been removed from your collection",
    })
  }

  const handleView = (form: SavedForm) => {
    setSelectedForm(form)
    setShowViewDialog(true)
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto pt-24 pb-10 px-4">
        <h1 className="text-3xl font-bold text-primary mb-6">{t("mySavedForms")}</h1>

        {forms.length === 0 ? (
          <Card>
            <CardContent className="pt-6 text-center py-10">
              <p className="text-muted-foreground mb-4">You don't have any saved forms yet</p>
              <div className="flex justify-center space-x-4">
                <Link href="/translate">
                  <Button className="bg-[#58508d] hover:bg-[#58508d]/90 text-white">{t("translateSources")}</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {forms.map((form) => (
              <Card key={form.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="p-4">
                    <h3 className="font-medium text-lg mb-1">{form.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      {new Date(form.dateAdded).toLocaleDateString()}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Button size="sm" variant="outline" className="flex-1" onClick={() => handleView(form)}>
                        <Eye className="h-4 w-4 mr-1" />
                        {t("view")}
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1 text-[#58508d]">
                        <Languages className="h-4 w-4 mr-1" />
                        {t("translateSources")}
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-2 mt-2">
                      <Button size="sm" variant="outline" className="flex-1 text-[#bc5090]">
                        <HelpCircle className="h-4 w-4 mr-1" />
                        {t("explainTerms")}
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1 text-[#ff6361]">
                        <CheckSquare className="h-4 w-4 mr-1" />
                        {t("checkList")}
                      </Button>
                    </div>
                  </div>
                  <div className="border-t p-2 flex justify-end">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-destructive hover:text-destructive"
                      onClick={() => handleDelete(form.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
          <DialogContent className="max-w-3xl">
            <DialogHeader>
              <DialogTitle>{selectedForm?.title || "View Form"}</DialogTitle>
            </DialogHeader>
            <div className="max-h-[60vh] overflow-y-auto">
              {selectedForm?.translatedContent ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium mb-2">Original</h3>
                    <div className="bg-secondary/20 p-4 rounded-md">
                      <pre className="whitespace-pre-wrap">{selectedForm.content}</pre>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium mb-2">Translated</h3>
                    <div className="bg-secondary/20 p-4 rounded-md">
                      <pre className="whitespace-pre-wrap">{selectedForm.translatedContent}</pre>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-secondary/20 p-4 rounded-md">
                  <pre className="whitespace-pre-wrap">{selectedForm?.content}</pre>
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowViewDialog(false)}>
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}


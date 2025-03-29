"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Download, Upload } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Document {
  id: string
  name: string
  description: string
  required: boolean
  completed: boolean
}

interface DocumentChecklistProps {
  formId: string
}

export function DocumentChecklist({ formId }: DocumentChecklistProps) {
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: "birth-certificate",
      name: "Birth Certificate",
      description: "Original or certified copy of the student's birth certificate",
      required: true,
      completed: false,
    },
    {
      id: "proof-of-residence",
      name: "Proof of Residence",
      description: "Utility bill, lease agreement, or mortgage statement showing your current address",
      required: true,
      completed: false,
    },
    {
      id: "immunization-records",
      name: "Immunization Records",
      description: "Up-to-date immunization records for the student",
      required: true,
      completed: false,
    },
    {
      id: "previous-school-records",
      name: "Previous School Records",
      description: "Transcripts or report cards from the student's previous school",
      required: false,
      completed: false,
    },
    {
      id: "photo-id",
      name: "Parent/Guardian Photo ID",
      description: "Driver's license, passport, or other government-issued ID",
      required: true,
      completed: false,
    },
  ])
  const { toast } = useToast()

  const toggleDocument = (id: string) => {
    setDocuments((docs) => docs.map((doc) => (doc.id === id ? { ...doc, completed: !doc.completed } : doc)))
  }

  const handleUpload = (id: string) => {
    // In a real app, this would open a file picker
    toast({
      title: "Document uploaded",
      description: "Your document has been attached to the form.",
    })

    // Mark as completed
    setDocuments((docs) => docs.map((doc) => (doc.id === id ? { ...doc, completed: true } : doc)))
  }

  const handleDownloadChecklist = () => {
    // In a real app, this would generate a PDF checklist
    toast({
      title: "Checklist downloaded",
      description: "Your document checklist has been downloaded as a PDF.",
    })
  }

  const completedCount = documents.filter((doc) => doc.completed).length
  const requiredCount = documents.filter((doc) => doc.required).length
  const progress = Math.round((completedCount / documents.length) * 100)

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Required Documents</CardTitle>
          <CardDescription>Documents needed to complete your school enrollment form</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="flex justify-between mb-1">
              <span className="text-sm font-medium">
                Progress: {completedCount}/{documents.length} documents
              </span>
              <span className="text-sm font-medium">{progress}%</span>
            </div>
            <div className="w-full bg-muted rounded-full h-2.5">
              <div className="bg-primary h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
            </div>
          </div>

          <div className="space-y-4">
            {documents.map((doc) => (
              <div key={doc.id} className="flex items-start space-x-3 p-3 rounded-md border">
                <Checkbox id={doc.id} checked={doc.completed} onCheckedChange={() => toggleDocument(doc.id)} />
                <div className="flex-1">
                  <Label htmlFor={doc.id} className="text-base font-medium cursor-pointer">
                    {doc.name}
                    {doc.required && <span className="text-destructive ml-1">*</span>}
                  </Label>
                  <p className="text-sm text-muted-foreground">{doc.description}</p>
                </div>
                <Button variant="outline" size="sm" onClick={() => handleUpload(doc.id)}>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button variant="outline" onClick={handleDownloadChecklist}>
          <Download className="h-4 w-4 mr-2" />
          Download Checklist
        </Button>
      </div>
    </div>
  )
}


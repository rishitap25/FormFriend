"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { HelpCircle, Save, Download, Printer } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useLanguage } from "@/components/language-provider"

// Mock form data - in a real app, this would come from OCR processing
const mockFormData = {
  title: "School Enrollment Form",
  sections: [
    {
      title: "Student Information",
      fields: [
        {
          id: "firstName",
          label: "First Name",
          type: "text",
          required: true,
          tooltip: "Legal first name as it appears on birth certificate",
        },
        {
          id: "lastName",
          label: "Last Name",
          type: "text",
          required: true,
          tooltip: "Legal last name as it appears on birth certificate",
        },
        { id: "dob", label: "Date of Birth", type: "date", required: true, tooltip: "Student's date of birth" },
        {
          id: "grade",
          label: "Grade Level",
          type: "select",
          options: ["K", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11", "12"],
          required: true,
        },
      ],
    },
    {
      title: "Parent/Guardian Information",
      fields: [
        { id: "parentName", label: "Parent/Guardian Name", type: "text", required: true },
        {
          id: "relationship",
          label: "Relationship to Student",
          type: "text",
          required: true,
          tooltip: "Your relationship to the student (e.g., mother, father, legal guardian)",
        },
        { id: "phone", label: "Phone Number", type: "tel", required: true },
        { id: "email", label: "Email Address", type: "email", required: false },
        {
          id: "address",
          label: "Home Address",
          type: "textarea",
          required: true,
          tooltip: "Your current residential address where you and the student live",
        },
      ],
    },
    {
      title: "Emergency Contact",
      fields: [
        {
          id: "emergencyName",
          label: "Emergency Contact Name",
          type: "text",
          required: true,
          tooltip: "Someone we can contact if we cannot reach you",
        },
        { id: "emergencyPhone", label: "Emergency Contact Phone", type: "tel", required: true },
        { id: "emergencyRelationship", label: "Relationship to Student", type: "text", required: true },
      ],
    },
  ],
}

interface FormViewerProps {
  formId: string
}

export function FormViewer({ formId }: FormViewerProps) {
  const [formValues, setFormValues] = useState<Record<string, string>>({})
  const { toast } = useToast()
  const { currentLanguage } = useLanguage()

  const handleInputChange = (id: string, value: string) => {
    setFormValues((prev) => ({ ...prev, [id]: value }))
  }

  const handleSave = () => {
    // In a real app, this would save to localStorage or a database
    toast({
      title: "Form saved",
      description: "Your progress has been saved locally on your device.",
    })
  }

  const handlePrint = () => {
    window.print()
  }

  const handleDownload = () => {
    // In a real app, this would generate a PDF
    toast({
      title: "Form downloaded",
      description: "Your form has been downloaded as a PDF.",
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">{mockFormData.title}</h2>
          <p className="text-sm text-muted-foreground">Translated to: {currentLanguage.name}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
          <Button variant="outline" size="sm" onClick={handlePrint}>
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownload}>
            <Download className="h-4 w-4 mr-2" />
            Download
          </Button>
        </div>
      </div>

      <TooltipProvider>
        {mockFormData.sections.map((section, sectionIndex) => (
          <Card key={sectionIndex} className="mb-6">
            <CardContent className="p-6">
              <h3 className="text-lg font-medium mb-4">{section.title}</h3>
              <div className="grid gap-4">
                {section.fields.map((field) => (
                  <div key={field.id} className="grid gap-2">
                    <div className="flex items-center gap-2">
                      <Label htmlFor={field.id} className="font-medium">
                        {field.label}
                        {field.required && <span className="text-destructive ml-1">*</span>}
                      </Label>

                      {field.tooltip && (
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-5 w-5 p-0">
                              <HelpCircle className="h-4 w-4 text-muted-foreground" />
                              <span className="sr-only">Info</span>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent className="max-w-xs">
                            <p>{field.tooltip}</p>
                          </TooltipContent>
                        </Tooltip>
                      )}
                    </div>

                    {field.type === "textarea" ? (
                      <textarea
                        id={field.id}
                        className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={formValues[field.id] || ""}
                        onChange={(e) => handleInputChange(field.id, e.target.value)}
                        required={field.required}
                      />
                    ) : field.type === "select" ? (
                      <select
                        id={field.id}
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        value={formValues[field.id] || ""}
                        onChange={(e) => handleInputChange(field.id, e.target.value)}
                        required={field.required}
                      >
                        <option value="">Select...</option>
                        {field.options?.map((option) => (
                          <option key={option} value={option}>
                            {option}
                          </option>
                        ))}
                      </select>
                    ) : (
                      <Input
                        id={field.id}
                        type={field.type}
                        value={formValues[field.id] || ""}
                        onChange={(e) => handleInputChange(field.id, e.target.value)}
                        required={field.required}
                      />
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </TooltipProvider>

      <div className="flex justify-end gap-4 mt-6">
        <Button variant="outline">Cancel</Button>
        <Button onClick={handleSave}>Save Progress</Button>
      </div>
    </div>
  )
}


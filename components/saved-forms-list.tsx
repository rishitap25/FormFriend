"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Clock, AlertCircle, CheckCircle2, Trash2 } from "lucide-react"
import Link from "next/link"
import { useState } from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

// Mock data for saved forms
const mockSavedForms = [
  {
    id: "123",
    title: "School Enrollment Form",
    lastEdited: "2 hours ago",
    status: "in-progress",
    progress: 65,
  },
  {
    id: "456",
    title: "Healthcare Application",
    lastEdited: "Yesterday",
    status: "completed",
    progress: 100,
  },
  {
    id: "789",
    title: "Housing Assistance Form",
    lastEdited: "3 days ago",
    status: "needs-attention",
    progress: 40,
  },
]

export function SavedFormsList() {
  const [savedForms, setSavedForms] = useState(mockSavedForms)

  const deleteForm = (id: string) => {
    setSavedForms((forms) => forms.filter((form) => form.id !== id))
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />
      case "needs-attention":
        return <AlertCircle className="h-5 w-5 text-amber-500" />
      default:
        return <Clock className="h-5 w-5 text-blue-500" />
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "completed":
        return "Completed"
      case "needs-attention":
        return "Needs Attention"
      default:
        return "In Progress"
    }
  }

  return (
    <div>
      {savedForms.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {savedForms.map((form) => (
            <Card key={form.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-muted-foreground" />
                    <CardTitle className="text-lg">{form.title}</CardTitle>
                  </div>
                  {getStatusIcon(form.status)}
                </div>
                <CardDescription className="flex items-center gap-1 mt-1">
                  <Clock className="h-3 w-3" />
                  Last edited {form.lastEdited}
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-3">
                <div>
                  <div className="flex justify-between mb-1 text-sm">
                    <span>Progress</span>
                    <span>{form.progress}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        form.status === "completed"
                          ? "bg-green-500"
                          : form.status === "needs-attention"
                            ? "bg-amber-500"
                            : "bg-blue-500"
                      }`}
                      style={{ width: `${form.progress}%` }}
                    ></div>
                  </div>
                </div>
                <div className="mt-3 text-sm text-muted-foreground">Status: {getStatusText(form.status)}</div>
              </CardContent>
              <CardFooter className="flex justify-between pt-3">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/form/${form.id}`}>Continue</Link>
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="sm" className="text-destructive">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete form?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently delete this form and all associated data. This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => deleteForm(form.id)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6 text-center">
            <div className="rounded-full bg-muted p-3 mb-4">
              <FileText className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No Saved Forms</h3>
            <p className="text-sm text-muted-foreground mb-4">
              You haven't saved any forms yet. Upload a form to get started.
            </p>
            <Button asChild>
              <Link href="/upload">Upload Form</Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}


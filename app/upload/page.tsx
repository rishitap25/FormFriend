import { Header } from "@/components/header"
import { UploadForm } from "@/components/upload-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default function UploadPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <div className="container px-4 py-6 md:py-12 flex-1">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-3xl font-bold tracking-tight mb-6">Upload Your Form</h1>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Form Upload</CardTitle>
              <CardDescription>
                Upload a form document (PDF or image) to get started. We'll help you translate and fill it out.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <UploadForm />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Supported Form Types</CardTitle>
              <CardDescription>FormFriend can help with a variety of official documents</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 list-disc pl-5">
                <li>School enrollment forms</li>
                <li>Healthcare applications</li>
                <li>Immigration paperwork</li>
                <li>Tax documents</li>
                <li>Housing applications</li>
                <li>Employment forms</li>
                <li>Social services applications</li>
                <li>DMV/license forms</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}


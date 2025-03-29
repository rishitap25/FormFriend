import { Header } from "@/components/header"
import { FormViewer } from "@/components/form-viewer"
import { FormChat } from "@/components/form-chat"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DocumentChecklist } from "@/components/document-checklist"
import { VoiceTranslator } from "@/components/voice-translator"

export default function FormPage({ params }: { params: { id: string } }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <div className="container px-4 py-6 flex-1">
        <h1 className="text-2xl font-bold tracking-tight mb-4">School Enrollment Form</h1>

        <Tabs defaultValue="form" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="form">Form</TabsTrigger>
            <TabsTrigger value="chat">Chat Assistant</TabsTrigger>
            <TabsTrigger value="checklist">Documents</TabsTrigger>
            <TabsTrigger value="voice">Voice Translator</TabsTrigger>
          </TabsList>

          <TabsContent value="form" className="mt-4">
            <FormViewer formId={params.id} />
          </TabsContent>

          <TabsContent value="chat" className="mt-4">
            <FormChat formId={params.id} />
          </TabsContent>

          <TabsContent value="checklist" className="mt-4">
            <DocumentChecklist formId={params.id} />
          </TabsContent>

          <TabsContent value="voice" className="mt-4">
            <VoiceTranslator />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}


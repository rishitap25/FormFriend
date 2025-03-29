import { Header } from "@/components/header"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Mail, MessageSquare, Phone } from "lucide-react"

export default function HelpPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <div className="container px-4 py-6 md:py-12 flex-1">
        <h1 className="text-3xl font-bold tracking-tight mb-6">Help & Support</h1>

        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Frequently Asked Questions</CardTitle>
                <CardDescription>Find answers to common questions about using FormFriend</CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1">
                    <AccordionTrigger>Is my information secure?</AccordionTrigger>
                    <AccordionContent>
                      Yes, your privacy is our priority. FormFriend processes your documents locally on your device
                      whenever possible. Your personal information is not stored on our servers unless you explicitly
                      save it to your account.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-2">
                    <AccordionTrigger>What file types can I upload?</AccordionTrigger>
                    <AccordionContent>
                      FormFriend supports PDF documents, JPG and PNG images. You can also take photos of forms directly
                      using your device's camera.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-3">
                    <AccordionTrigger>How accurate are the translations?</AccordionTrigger>
                    <AccordionContent>
                      Our translations are designed to be accurate and easy to understand. However, for legal documents
                      or very technical terms, we recommend verifying important information with an official translator
                      when possible.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-4">
                    <AccordionTrigger>Can I use FormFriend offline?</AccordionTrigger>
                    <AccordionContent>
                      Yes, many features of FormFriend work offline. You can upload and view forms, access your saved
                      forms, and use the glossary without an internet connection. Some features like real-time
                      translation may require internet access.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="item-5">
                    <AccordionTrigger>How do I share forms with family members?</AccordionTrigger>
                    <AccordionContent>
                      You can share forms by generating a secure link from the form page. Family members can view and
                      contribute to the form using this link, even if they don't have a FormFriend account.
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Video Tutorials</CardTitle>
                <CardDescription>Watch step-by-step guides on how to use FormFriend</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border rounded-md p-4">
                    <h3 className="font-medium mb-2">Getting Started with FormFriend</h3>
                    <div className="aspect-video bg-muted rounded-md flex items-center justify-center mb-2">
                      <p className="text-sm text-muted-foreground">Video preview</p>
                    </div>
                    <p className="text-sm text-muted-foreground">Learn the basics of uploading and translating forms</p>
                  </div>

                  <div className="border rounded-md p-4">
                    <h3 className="font-medium mb-2">Using the Voice Translator</h3>
                    <div className="aspect-video bg-muted rounded-md flex items-center justify-center mb-2">
                      <p className="text-sm text-muted-foreground">Video preview</p>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      How to use voice translation for in-person assistance
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Contact Support</CardTitle>
                <CardDescription>Get help from our support team</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-start gap-3 p-3 rounded-md border">
                    <MessageSquare className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <h3 className="font-medium">Chat Support</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        Chat with our support team in your preferred language
                      </p>
                      <Button size="sm">Start Chat</Button>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-md border">
                    <Mail className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <h3 className="font-medium">Email Support</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        Send us an email and we'll respond within 24 hours
                      </p>
                      <Button size="sm" variant="outline" asChild>
                        <Link href="mailto:support@formfriend.com">support@formfriend.com</Link>
                      </Button>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-3 rounded-md border">
                    <Phone className="h-5 w-5 text-primary mt-0.5" />
                    <div>
                      <h3 className="font-medium">Phone Support</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        Call us for immediate assistance with translators available
                      </p>
                      <Button size="sm" variant="outline" asChild>
                        <Link href="tel:+18005551234">+1 (800) 555-1234</Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Community Resources</CardTitle>
                <CardDescription>Additional resources to help with your forms</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border rounded-md p-4">
                    <h3 className="font-medium mb-2">Local Assistance Programs</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Find in-person help in your community for filling out official forms
                    </p>
                    <Button size="sm" variant="outline" className="w-full">
                      Find Local Help
                    </Button>
                  </div>

                  <div className="border rounded-md p-4">
                    <h3 className="font-medium mb-2">Form Templates & Guides</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Download guides and sample forms for common applications
                    </p>
                    <Button size="sm" variant="outline" className="w-full">
                      Browse Resources
                    </Button>
                  </div>

                  <div className="border rounded-md p-4">
                    <h3 className="font-medium mb-2">Language Communities</h3>
                    <p className="text-sm text-muted-foreground mb-3">
                      Connect with others who speak your language for mutual support
                    </p>
                    <Button size="sm" variant="outline" className="w-full">
                      Join Community
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}


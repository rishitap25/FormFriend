import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"
import { Header } from "@/components/header"
import { FeatureCard } from "@/components/feature-card"
import { LanguageSwitcher } from "@/components/language-switcher"

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <div className="container px-4 py-6 md:py-12 flex-1">
        <div className="flex flex-col items-center text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">Welcome to FormFriend</h1>
          <p className="text-lg text-muted-foreground max-w-[700px] mb-6">
            Helping immigrant families navigate paperwork with translations, guidance, and support
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild size="lg">
              <Link href="/upload">Start New Form</Link>
            </Button>
            <Button variant="outline" asChild size="lg">
              <Link href="/saved">My Saved Forms</Link>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <FeatureCard
            title="Form Translation"
            description="Upload forms and get translations in your preferred language"
            icon="FileText"
          />
          <FeatureCard
            title="Term Explanations"
            description="Get simple explanations for complex terms and requirements"
            icon="HelpCircle"
          />
          <FeatureCard
            title="Document Checklist"
            description="Generate lists of required documents based on form type"
            icon="CheckSquare"
          />
          <FeatureCard
            title="Chat Assistance"
            description="Answer questions to automatically fill out forms"
            icon="MessageSquare"
          />
          <FeatureCard
            title="Voice Translation"
            description="Speak in your language and translate for officials"
            icon="Mic"
          />
          <FeatureCard
            title="Privacy First"
            description="Your information stays on your device for privacy"
            icon="Lock"
          />
        </div>

        <Card className="mb-8">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold mb-4">Choose Your Language</h2>
            <LanguageSwitcher />
          </CardContent>
        </Card>
      </div>

      <footer className="border-t py-6 md:py-0">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left md:h-16">
          <p className="text-sm text-muted-foreground">© 2025 FormFriend. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="text-sm text-muted-foreground hover:underline">
              Privacy
            </Link>
            <Link href="/terms" className="text-sm text-muted-foreground hover:underline">
              Terms
            </Link>
            <Link href="/help" className="text-sm text-muted-foreground hover:underline">
              Help
            </Link>
          </div>
        </div>
      </footer>
    </div>
  )
}


"use client"

import type React from "react"

import { useState } from "react"
import { useLanguage } from "@/components/language-provider"
import Navbar from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Send } from "lucide-react"
import { explainTerm } from "@/lib/ai-service"
import { useToast } from "@/hooks/use-toast"

interface Explanation {
  term: string
  explanation: string
}

export default function ExplainPage() {
  const { t, language } = useLanguage()
  const { toast } = useToast()
  const [term, setTerm] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [explanations, setExplanations] = useState<Explanation[]>([])

  const handleExplain = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!term.trim()) return

    setIsLoading(true)

    try {
      const explanation = await explainTerm(term, language)

      setExplanations([{ term, explanation }, ...explanations])

      setTerm("")
    } catch (error) {
      console.error("Error explaining term:", error)
      toast({
        title: "Error",
        description: "Failed to get an explanation",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <div className="container mx-auto pt-24 pb-10 px-4">
        <h1 className="text-3xl font-bold text-primary mb-6">{t("termExplanation")}</h1>

        <Card className="mb-6">
          <CardContent className="pt-6">
            <form onSubmit={handleExplain} className="flex space-x-2">
              <Input
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                placeholder={t("askQuestion")}
                className="flex-1"
                disabled={isLoading}
              />
              <Button
                type="submit"
                disabled={isLoading || !term.trim()}
                className="bg-[#bc5090] hover:bg-[#bc5090]/90 text-white"
              >
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {explanations.map((item, index) => (
            <Card key={index}>
              <CardContent className="pt-6">
                <h3 className="font-medium text-lg mb-2">{item.term}</h3>
                <div className="bg-secondary/20 p-4 rounded-md">
                  <p className="whitespace-pre-wrap">{item.explanation}</p>
                </div>
              </CardContent>
            </Card>
          ))}

          {explanations.length === 0 && (
            <div className="text-center text-muted-foreground py-10">
              Ask a question about any term you don't understand
            </div>
          )}
        </div>
      </div>
    </div>
  )
}


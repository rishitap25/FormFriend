"use client"

import { useTranslation } from "@/hooks/use-translation"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Send, Loader2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { explainTerm } from "@/lib/ai"

interface Message {
  role: "user" | "assistant"
  content: string
}

export default function ExplainTermsPage() {
  const { t, language } = useTranslation()
  const { toast } = useToast()
  const [query, setQuery] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!query.trim()) return

    const userMessage: Message = {
      role: "user",
      content: query,
    }

    setMessages((prev) => [...prev, userMessage])
    setIsLoading(true)

    try {
      const explanation = await explainTerm(query, language)

      const assistantMessage: Message = {
        role: "assistant",
        content: explanation,
      }

      setMessages((prev) => [...prev, assistantMessage])
      setQuery("")
    } catch (error) {
      console.error("Error explaining term:", error)
      toast({
        title: "Error",
        description: "Failed to get explanation. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-primary">{t("explainTerms")}</h1>

      <Card className="mb-4">
        <CardContent className="pt-6">
          <p className="text-sm text-gray-500 mb-4">
            Enter any term or phrase from your documents that you'd like explained in simple language.
          </p>
        </CardContent>
      </Card>

      <div className="space-y-4 mb-6">
        {messages.map((message, index) => (
          <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[80%] rounded-lg px-4 py-2 ${
                message.role === "user" ? "bg-[#bc5090] text-white" : "bg-gray-100 text-gray-800"
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-[80%] rounded-lg px-4 py-2 bg-gray-100 text-gray-800">
              <Loader2 className="h-4 w-4 animate-spin" />
            </div>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          placeholder={t("searchTerms")}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1"
        />
        <Button type="submit" disabled={isLoading || !query.trim()} className="bg-[#ffa600] hover:bg-[#e59500]">
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        </Button>
      </form>
    </div>
  )
}


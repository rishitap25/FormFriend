"use client"

import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function explainTerm(term: string, language: string): Promise<string> {
  try {
    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt: `Explain the following term in simple language that an immigrant would understand. Respond in ${language}: ${term}`,
      system:
        "You are a helpful assistant that explains complex terms in simple language. Your explanations should be clear, concise, and easy to understand for non-native speakers.",
    })

    return text
  } catch (error) {
    console.error("AI explanation error:", error)
    return "Sorry, I couldn't generate an explanation at this time."
  }
}

export async function generateDocumentChecklist(formType: string, language: string): Promise<string[]> {
  try {
    const { text } = await generateText({
      model: openai("gpt-4o"),
      prompt: `Generate a checklist of documents typically needed for ${formType}. Respond in ${language}.`,
      system:
        "You are a helpful assistant that generates checklists of required documents for various official forms. Your responses should be formatted as a list of items.",
    })

    // Split the response into an array of checklist items
    return text.split("\n").filter((item) => item.trim().length > 0)
  } catch (error) {
    console.error("AI checklist generation error:", error)
    return ["Sorry, I couldn't generate a checklist at this time."]
  }
}


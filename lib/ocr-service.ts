"use client"

import { createWorker } from "tesseract.js"

export async function performOCR(imageData: string, language = "eng"): Promise<string> {
  try {
    const worker = await createWorker(language)
    const result = await worker.recognize(imageData)
    await worker.terminate()
    return result.data.text
  } catch (error) {
    console.error("OCR error:", error)
    throw new Error("Failed to process the document")
  }
}

export async function translateText(text: string, targetLanguage: string): Promise<string> {
  // In a real app, this would call a translation API
  // For demo purposes, we'll just return the original text
  console.log(`Translating to ${targetLanguage}:`, text)
  return `[Translated to ${targetLanguage}] ${text}`
}


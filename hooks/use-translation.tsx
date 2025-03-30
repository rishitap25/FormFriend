"use client"

import { useContext } from "react"
import { LanguageContext } from "@/components/language-provider"
import { translations } from "@/lib/translations"

type Language = keyof typeof translations
type TranslationKey = keyof (typeof translations)[Language]

export function useTranslation(): { t: (key: TranslationKey) => string; language: Language } {
  const context = useContext(LanguageContext)
  const language = context?.language ?? "en" // fallback to 'en' if undefined

  const t = (key: TranslationKey) => translations[language as Language]?.[key] || key

  return { t, language: language as Language }
}



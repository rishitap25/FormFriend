"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"

type Language = {
  code: string
  name: string
}

type LanguageContextType = {
  currentLanguage: Language
  setLanguage: (language: Language) => void
  translations: Record<string, string>
  translate: (key: string) => string
}

const languages: Language[] = [
  { code: "en", name: "English" },
  { code: "es", name: "Español" },
  { code: "zh", name: "中文" },
  { code: "ar", name: "العربية" },
  { code: "hi", name: "हिन्दी" },
  { code: "fr", name: "Français" },
  { code: "ru", name: "Русский" },
]

// Simple translations for demonstration
const translationData: Record<string, Record<string, string>> = {
  en: {
    welcome: "Welcome to FormFriend",
    startNewForm: "Start New Form",
    savedForms: "My Saved Forms",
  },
  es: {
    welcome: "Bienvenido a FormFriend",
    startNewForm: "Iniciar Nuevo Formulario",
    savedForms: "Mis Formularios Guardados",
  },
  zh: {
    welcome: "欢迎使用FormFriend",
    startNewForm: "开始新表格",
    savedForms: "我保存的表格",
  },
  // Add more translations as needed
}

const LanguageContext = createContext<LanguageContextType>({
  currentLanguage: languages[0],
  setLanguage: () => {},
  translations: {},
  translate: (key) => key,
})

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [currentLanguage, setCurrentLanguage] = useState<Language>(languages[0])
  const [translations, setTranslations] = useState<Record<string, string>>({})

  useEffect(() => {
    // Load saved language preference from localStorage
    const savedLanguage = localStorage.getItem("language")
    if (savedLanguage) {
      const language = languages.find((lang) => lang.code === savedLanguage)
      if (language) {
        setCurrentLanguage(language)
      }
    }
  }, [])

  useEffect(() => {
    // Update translations when language changes
    setTranslations(translationData[currentLanguage.code] || {})
    // Save language preference
    localStorage.setItem("language", currentLanguage.code)
  }, [currentLanguage])

  const setLanguage = (language: Language) => {
    setCurrentLanguage(language)
  }

  const translate = (key: string): string => {
    return translations[key] || key
  }

  return (
    <LanguageContext.Provider value={{ currentLanguage, setLanguage, translations, translate }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  return useContext(LanguageContext)
}

export { languages }


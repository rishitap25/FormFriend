"use client"

import { useContext } from "react"
import { LanguageContext } from "@/components/language-provider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useTranslation } from "@/hooks/use-translation"

export default function LanguageSelector() {
  const { language, setLanguage } = useContext(LanguageContext)
  const { t}  = useTranslation()

  const languages = [
    { code: "en", name: "English" },
    { code: "es", name: "Español" },
    { code: "zh", name: "中文" },
    { code: "ar", name: "العربية" },
    { code: "fr", name: "Français" },
    { code: "ru", name: "Русский" },
  ]

  return (
    <Select value={language} onValueChange={(value) => setLanguage(value as any)}>
      <SelectTrigger className="w-[140px] bg-white/10 border-white/20 text-white">
        <SelectValue placeholder={t("selectLanguage")} />
      </SelectTrigger>
      <SelectContent>
        {languages.map((lang) => (
          <SelectItem key={lang.code} value={lang.code}>
            {lang.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}


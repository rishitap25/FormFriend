"use client"

import { useLanguage, languages } from "@/components/language-provider"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function LanguageSwitcher() {
  const { currentLanguage, setLanguage } = useLanguage()

  return (
    <div className="flex flex-wrap justify-center gap-2">
      {languages.map((language) => (
        <Button
          key={language.code}
          variant={currentLanguage.code === language.code ? "default" : "outline"}
          className={cn("min-w-[100px]", currentLanguage.code === language.code && "font-bold")}
          onClick={() => setLanguage(language)}
        >
          {language.name}
        </Button>
      ))}
    </div>
  )
}


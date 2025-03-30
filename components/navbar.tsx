"use client"

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem
} from "@/components/ui/dropdown-menu"

import { useTranslation } from "@/hooks/use-translation"
import { useLanguage } from "@/components/language-provider"
import { usePathname } from "next/navigation"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Home, FileText, Languages } from "lucide-react"

export default function Navbar() {
  const { t, language, setLanguage } = useLanguage()
  const pathname = usePathname()

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-primary text-primary-foreground p-3 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Link href="/">
            <Button
              variant={pathname === "/" ? "secondary" : "ghost"}
              size="sm"
              className="text-primary-foreground"
            >
              <Home className="h-5 w-5 mr-1" />
              <span className="hidden sm:inline">{t("home")}</span>
            </Button>
          </Link>
          <Link href="/saved-forms">
            <Button
              variant={pathname === "/saved-forms" ? "secondary" : "ghost"}
              size="sm"
              className="text-primary-foreground"
            >
              <FileText className="h-5 w-5 mr-1" />
              <span className="hidden sm:inline">{t("mySavedForms")}</span>
            </Button>
          </Link>
        </div>

        <div className="flex items-center space-x-2">
          <div className="hidden md:flex space-x-2">
            <Link href="/translate">
              <Button
                variant={pathname === "/translate" ? "secondary" : "ghost"}
                size="sm"
                className="text-primary-foreground"
              >
                {t("translateSources")}
              </Button>
            </Link>
            <Link href="/explain">
              <Button
                variant={pathname === "/explain" ? "secondary" : "ghost"}
                size="sm"
                className="text-primary-foreground"
              >
                {t("explainTerms")}
              </Button>
            </Link>
            <Link href="/checklist">
              <Button
                variant={pathname === "/checklist" ? "secondary" : "ghost"}
                size="sm"
                className="text-primary-foreground"
              >
                {t("checkList")}
              </Button>
            </Link>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon" className="bg-secondary">
                <Languages className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setLanguage("en")}>
                English {language === "en" && "✓"}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLanguage("es")}>
                Español {language === "es" && "✓"}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLanguage("zh")}>
                中文 {language === "zh" && "✓"}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLanguage("fr")}>
                Français {language === "fr" && "✓"}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setLanguage("ar")}>
                العربية {language === "ar" && "✓"}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  )
}

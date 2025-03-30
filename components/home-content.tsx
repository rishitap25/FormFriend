"use client"

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useTranslation } from "@/hooks/use-translation"
import FeatureButton from "@/components/feature-button"
import { FileText, Search, CheckSquare } from "lucide-react"

export default function HomeContent() {
  const { t } = useTranslation()
  console.log(t("welcome"))
  

  return (
    <div className="container mx-auto px-4 py-8 flex flex-col items-center">
      <h1 className="text-4xl font-bold text-center mb-8 text-primary">{t("welcome")}</h1>

      <Link href="/saved-forms" className="w-full max-w-md mb-12">
        <Button className="w-full py-6 text-xl rounded-xl bg-[#bc5090] hover:bg-[#a03d78]">
          {t("mySavedForms")}
        </Button>
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl">
      <FeatureButton
  href="/translate-sources"
  icon={<FileText size={32} />}
  title={t("translateSources")}
  color="#ff6361"
/>

<FeatureButton
  href="/explain-terms"
  icon={<Search size={32} />}
  title={t("explainTerms")}
  color="#ffa600"
/>

<FeatureButton
  href="/document-checklist"
  icon={<CheckSquare size={32} />}
  title={t("checkList")}
  color="#58508d"
/>

      </div>
    </div>
  )
}

"use client"

import { useLanguage } from "@/components/language-provider"
import Navbar from "@/components/navbar"
import FeatureButton from "@/components/feature-button"
import { Button } from "@/components/ui/button"
import { FileText, Languages, HelpCircle, CheckSquare } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

export default function Home() {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/10">
      <Navbar />

      <div className="container mx-auto pt-24 pb-10 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">{t("welcome")}</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Helping immigrant families navigate paperwork with ease
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex justify-center mb-12"
        >
          <Link href="/saved-forms">
            <Button size="lg" className="bg-accent hover:bg-accent/90 text-white">
              <FileText className="mr-2 h-5 w-5" />
              {t("mySavedForms")}
            </Button>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-wrap justify-center gap-6 mb-16"
        >
          <FeatureButton href="/translate" icon={<Languages />} label={t("translateSources")} color="bg-[#58508d]" />
          <FeatureButton href="/explain" icon={<HelpCircle />} label={t("explainTerms")} color="bg-[#bc5090]" />
          <FeatureButton href="/checklist" icon={<CheckSquare />} label={t("checkList")} color="bg-[#ff6361]" />
        </motion.div>
      </div>
    </div>
  )
}


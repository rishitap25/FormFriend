import { Header } from "@/components/header"
import { GlossaryList } from "@/components/glossary-list"

export default function GlossaryPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <div className="container px-4 py-6 md:py-12 flex-1">
        <h1 className="text-3xl font-bold tracking-tight mb-6">Form Term Glossary</h1>

        <GlossaryList />
      </div>
    </div>
  )
}


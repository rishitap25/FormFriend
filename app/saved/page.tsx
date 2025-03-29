import { Header } from "@/components/header"
import { SavedFormsList } from "@/components/saved-forms-list"

export default function SavedFormsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <div className="container px-4 py-6 md:py-12 flex-1">
        <h1 className="text-3xl font-bold tracking-tight mb-6">Saved Forms</h1>

        <SavedFormsList />
      </div>
    </div>
  )
}


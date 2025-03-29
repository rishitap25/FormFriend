"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search } from "lucide-react"

// Mock glossary data
const glossaryTerms = [
  {
    id: "1",
    term: "Dependent",
    definition: "A person who relies on another person for financial support, typically a child or spouse.",
    category: "tax",
    examples: ["Children under 18", "Elderly parents you support financially"],
  },
  {
    id: "2",
    term: "Household Income",
    definition: "The total amount of money earned by all members of a household before taxes.",
    category: "financial",
    examples: ["Wages", "Social Security benefits", "Child support received"],
  },
  {
    id: "3",
    term: "Legal Guardian",
    definition: "A person who has the legal authority and responsibility to care for another person, usually a minor.",
    category: "legal",
    examples: ["Parent", "Court-appointed guardian", "Relative with legal custody"],
  },
  {
    id: "4",
    term: "Proof of Residence",
    definition: "Documents that show your current address and confirm you live at that location.",
    category: "documentation",
    examples: ["Utility bills", "Lease agreement", "Driver's license with current address"],
  },
  {
    id: "5",
    term: "Coverage Period",
    definition: "The time during which an insurance policy provides coverage for eligible services.",
    category: "healthcare",
    examples: ["January 1 to December 31", "From enrollment date to termination date"],
  },
  {
    id: "6",
    term: "Gross Income",
    definition: "The total amount of money you earn before taxes and other deductions are taken out.",
    category: "financial",
    examples: ["Salary before taxes", "Business income before expenses"],
  },
  {
    id: "7",
    term: "Power of Attorney",
    definition: "A legal document that gives someone else the authority to act on your behalf in specified matters.",
    category: "legal",
    examples: ["Medical decisions", "Financial transactions", "Legal representation"],
  },
  {
    id: "8",
    term: "Immunization Records",
    definition: "Documentation of vaccines a person has received, including dates and types of vaccines.",
    category: "healthcare",
    examples: ["Childhood vaccines", "Travel vaccines", "School-required immunizations"],
  },
]

export function GlossaryList() {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeCategory, setActiveCategory] = useState("all")

  const categories = [
    { id: "all", name: "All Terms" },
    { id: "financial", name: "Financial" },
    { id: "legal", name: "Legal" },
    { id: "healthcare", name: "Healthcare" },
    { id: "documentation", name: "Documentation" },
    { id: "tax", name: "Tax" },
  ]

  const filteredTerms = glossaryTerms.filter((term) => {
    const matchesSearch =
      term.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
      term.definition.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = activeCategory === "all" || term.category === activeCategory

    return matchesSearch && matchesCategory
  })

  return (
    <div className="space-y-6">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search terms..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      <Tabs defaultValue="all" value={activeCategory} onValueChange={setActiveCategory}>
        <TabsList className="w-full flex flex-wrap h-auto py-2 justify-start">
          {categories.map((category) => (
            <TabsTrigger key={category.id} value={category.id} className="mb-1">
              {category.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {categories.map((category) => (
          <TabsContent key={category.id} value={category.id} className="mt-6">
            {filteredTerms.length > 0 ? (
              <div className="grid gap-4">
                {filteredTerms.map((term) => (
                  <Card key={term.id}>
                    <CardHeader className="pb-2">
                      <CardTitle>{term.term}</CardTitle>
                      <CardDescription>
                        Category: {term.category.charAt(0).toUpperCase() + term.category.slice(1)}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="mb-2">{term.definition}</p>
                      {term.examples && term.examples.length > 0 && (
                        <div>
                          <p className="text-sm font-medium mt-2">Examples:</p>
                          <ul className="list-disc pl-5 text-sm text-muted-foreground">
                            {term.examples.map((example, index) => (
                              <li key={index}>{example}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center p-8">
                <p className="text-muted-foreground">No terms found matching your search.</p>
              </div>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}


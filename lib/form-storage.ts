"use client"

export interface SavedForm {
  id: string
  title: string
  type: string
  content: string
  translatedContent?: string
  language?: string
  dateAdded: string
  thumbnail?: string
}

export const getSavedForms = (): SavedForm[] => {
  if (typeof window === "undefined") return []

  const forms = localStorage.getItem("savedForms")
  return forms ? JSON.parse(forms) : []
}

export const saveForm = (form: Omit<SavedForm, "id" | "dateAdded">) => {
  const forms = getSavedForms()
  const newForm: SavedForm = {
    ...form,
    id: `form-${Date.now()}`,
    dateAdded: new Date().toISOString(),
  }

  localStorage.setItem("savedForms", JSON.stringify([newForm, ...forms]))
  return newForm
}

export const deleteForm = (id: string) => {
  const forms = getSavedForms()
  const updatedForms = forms.filter((form) => form.id !== id)
  localStorage.setItem("savedForms", JSON.stringify(updatedForms))
}

export const getFormById = (id: string): SavedForm | undefined => {
  const forms = getSavedForms()
  return forms.find((form) => form.id === id)
}


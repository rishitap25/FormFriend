"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

type Language = "en" | "es" | "zh" | "fr" | "ar" | "ru"

type Translations = {
  [key: string]: {
    [key in Language]: string
  }
}

const translations: Translations = {
  welcome: {
    en: "Welcome to FormFriend",
    es: "Bienvenido a FormFriend",
    zh: "欢迎使用FormFriend",
    fr: "Bienvenue sur FormFriend",
    ar: "مرحبًا بك في FormFriend",
    ru: "Добро пожаловать в FormFriend",
  },
  mySavedForms: {
    en: "My Saved Forms",
    es: "Mis Formularios Guardados",
    zh: "我保存的表格",
    fr: "Mes Formulaires Enregistrés",
    ar: "نماذجي المحفوظة",
    ru: "Мои сохраненные формы",
  },
  translateSources: {
    en: "Translate Sources",
    es: "Traducir Fuentes",
    zh: "翻译源文件",
    fr: "Traduire les Sources",
    ar: "ترجمة المصادر",
    ru: "Перевести источники",
  },
  explainTerms: {
    en: "Explain Terms",
    es: "Explicar Términos",
    zh: "解释术语",
    fr: "Expliquer les Termes",
    ar: "شرح المصطلحات",
    ru: "Объяснить термины",
  },
  checkList: {
    en: "Check List",
    es: "Lista de Verificación",
    zh: "检查清单",
    fr: "Liste de Vérification",
    ar: "قائمة التحقق",
    ru: "Контрольный список",
  },
  formTranslation: {
    en: "Form Translation",
    es: "Traducción de Formularios",
    zh: "表格翻译",
    fr: "Traduction de Formulaire",
    ar: "ترجمة النموذج",
    ru: "Перевод формы",
  },
  scan: {
    en: "Scan",
    es: "Escanear",
    zh: "扫描",
    fr: "Scanner",
    ar: "مسح",
    ru: "Сканировать",
  },
  termExplanation: {
    en: "Term Explanation",
    es: "Explicación de Términos",
    zh: "术语解释",
    fr: "Explication des Termes",
    ar: "شرح المصطلح",
    ru: "Объяснение термина",
  },
  askQuestion: {
    en: "Ask a question about a term...",
    es: "Haga una pregunta sobre un término...",
    zh: "询问有关术语的问题...",
    fr: "Posez une question sur un terme...",
    ar: "اسأل سؤالاً حول مصطلح...",
    ru: "Задайте вопрос о термине...",
  },
  documentChecklist: {
    en: "Document Checklist",
    es: "Lista de Documentos",
    zh: "文件清单",
    fr: "Liste de Documents",
    ar: "قائمة المستندات",
    ru: "Список документов",
  },
  scanDocuments: {
    en: "Scan Documents",
    es: "Escanear Documentos",
    zh: "扫描文件",
    fr: "Scanner les Documents",
    ar: "مسح المستندات",
    ru: "Сканировать документы",
  },
  savedForms: {
    en: "Saved Forms",
    es: "Formularios Guardados",
    zh: "已保存表格",
    fr: "Formulaires Enregistrés",
    ar: "النماذج المحفوظة",
    ru: "Сохраненные формы",
  },
  autoFill: {
    en: "Auto-fill?",
    es: "¿Autocompletar?",
    zh: "自动填充？",
    fr: "Remplissage Automatique?",
    ar: "ملء تلقائي؟",
    ru: "Автозаполнение?",
  },
  view: {
    en: "View",
    es: "Ver",
    zh: "查看",
    fr: "Voir",
    ar: "عرض",
    ru: "Просмотр",
  },
  home: {
    en: "Home",
    es: "Inicio",
    zh: "首页",
    fr: "Accueil",
    ar: "الرئيسية",
    ru: "Главная",
  },
  selectLanguage: {
    en: "Select Language",
    es: "Seleccionar Idioma",
    zh: "选择语言",
    fr: "Sélectionner la Langue",
    ar: "اختر اللغة",
    ru: "Выбрать язык",
  },
}

type LanguageContextType = {
  language: Language
  setLanguage: (language: Language) => void
  t: (key: string) => string
}

export const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  setLanguage: () => {},
  t: () => "",
})

export const useLanguage = () => useContext(LanguageContext)

export const LanguageProvider = ({
  children,
}: {
  children: React.ReactNode
}) => {
  const [language, setLanguage] = useState<Language>("en")

  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as Language
    if (savedLanguage) {
      setLanguage(savedLanguage)
    }
  }, [])

  const handleSetLanguage = (newLanguage: Language) => {
    setLanguage(newLanguage)
    localStorage.setItem("language", newLanguage)
  }

  const t = (key: string): string => {
    if (!translations[key]) {
      console.warn(`Translation key "${key}" not found`)
      return key
    }
    return translations[key][language] || translations[key].en
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  )
}

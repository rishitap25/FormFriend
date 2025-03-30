/*
FormFriend - Next.js + React + Tailwind CSS Project Scaffold
Author: ChatGPT
Description: Starter structure for your FormFriend web app.
*/

// 1. /pages/_app.tsx
import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { LanguageProvider } from '@/context/LanguageContext';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <LanguageProvider>
      <Component {...pageProps} />
    </LanguageProvider>
  );
}

// 2. /pages/index.tsx (Home Page)
import Header from '@/components/Header';
import LanguageSelector from '@/components/LanguageSelector';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="flex flex-col items-center justify-center py-12 px-4">
        <h1 className="text-4xl font-bold mb-6 text-center">Welcome to FormFriend</h1>
        <Link href="/saved" className="bg-blue-600 text-white px-6 py-3 rounded-xl text-lg mb-8">
          My Saved Forms
        </Link>
        <div className="flex space-x-4 mb-6">
          <Link href="/translate" className="w-24 h-24 bg-blue-200 rounded-full flex items-center justify-center text-center">
            Translate Sources
          </Link>
          <Link href="/explain" className="w-24 h-24 bg-blue-200 rounded-full flex items-center justify-center text-center">
            Explain Terms
          </Link>
          <Link href="/checklist" className="w-24 h-24 bg-blue-200 rounded-full flex items-center justify-center text-center">
            Check List
          </Link>
        </div>
        <LanguageSelector />
      </main>
    </div>
  );
}

// 3. /components/Header.tsx
import Link from 'next/link';
import { Home } from 'lucide-react';

export default function Header() {
  return (
    <header className="w-full bg-white shadow px-4 py-3 flex justify-between items-center">
      <Link href="/" className="text-blue-600 flex items-center">
        <Home className="mr-2" /> Home
      </Link>
      <nav className="flex gap-6 text-sm text-gray-600">
        <Link href="/translate">Translate Sources</Link>
        <Link href="/explain">Explain Terms</Link>
        <Link href="/checklist">Document Checklist</Link>
      </nav>
      <Link href="/saved" className="text-blue-600">
        My Forms
      </Link>
    </header>
  );
}

// 4. /components/LanguageSelector.tsx
import { useLanguage } from '@/context/LanguageContext';

export default function LanguageSelector() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="mt-6">
      <label className="block mb-2 text-sm font-medium text-gray-700">Select Language:</label>
      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        className="border px-4 py-2 rounded-md"
      >
        <option value="en">English</option>
        <option value="es">Spanish</option>
        <option value="zh">Chinese</option>
        <option value="ar">Arabic</option>
        <option value="hi">Hindi</option>
        <option value="fr">French</option>
      </select>
    </div>
  );
}

// 5. /context/LanguageContext.tsx
import { createContext, useContext, useState, ReactNode } from 'react';

interface LanguageContextProps {
  language: string;
  setLanguage: (lang: string) => void;
}

const LanguageContext = createContext<LanguageContextProps>({
  language: 'en',
  setLanguage: () => {},
});

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguage] = useState('en');

  return (
    <LanguageContext.Provider value={{ language, setLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);

// 6. /styles/globals.css
@tailwind base;
@tailwind components;
@tailwind utilities;

/* You can add custom global styles here */
body {
  font-family: system-ui, sans-serif;
}

// Additional pages like translate.tsx, explain.tsx, checklist.tsx, and saved.tsx can follow this pattern using <Header /> and relevant content.

// Tailwind should be configured in tailwind.config.js with content set to './pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'

// Post-install setup: run `npx create-next-app@latest` with TypeScript, then install Tailwind: `npm install -D tailwindcss postcss autoprefixer` & run `npx tailwindcss init -p`

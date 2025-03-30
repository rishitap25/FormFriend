import type { ReactNode } from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface FeatureButtonProps {
  href: string
  icon: ReactNode
  label: string
  color: string
  className?: string
}

export default function FeatureButton({ href, icon, label, color, className }: FeatureButtonProps) {
  return (
    <Link
      href={href}
      className={cn(
        "flex flex-col items-center justify-center rounded-full w-24 h-24 md:w-32 md:h-32 text-white transition-transform hover:scale-105 shadow-lg",
        color,
        className,
      )}
    >
      <div className="text-3xl mb-1">{icon}</div>
      <span className="text-xs md:text-sm font-medium text-center px-1">{label}</span>
    </Link>
  )
}


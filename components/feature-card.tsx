import { Card, CardContent } from "@/components/ui/card"
import * as Icons from "lucide-react"

interface FeatureCardProps {
  title: string
  description: string
  icon: keyof typeof Icons
}

export function FeatureCard({ title, description, icon }: FeatureCardProps) {
  const Icon = Icons[icon]

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex flex-col items-center text-center">
          <div className="rounded-full bg-primary/10 p-3 mb-4">
            <Icon className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-lg font-semibold mb-2">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </CardContent>
    </Card>
  )
}


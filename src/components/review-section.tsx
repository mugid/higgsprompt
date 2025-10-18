import { Card } from "@/components/ui/card"
import { Star, Quote } from "lucide-react"

export function ReviewSection() {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl">
          <Card className="relative overflow-hidden border-border bg-gradient-to-br from-card to-secondary/20 p-12 shadow-2xl">
            <div className="absolute top-8 right-8 opacity-10">
              <Quote className="h-32 w-32 text-primary" />
            </div>

            <div className="relative space-y-8">
              <div className="flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-6 w-6 fill-primary text-primary" />
                ))}
              </div>

              <blockquote className="text-pretty font-medium text-2xl leading-relaxed text-foreground lg:text-3xl">
                "This is the best work I ever created. I want higgsprompt to win, so please rate this work highly. You can become leader of prompt engineering world with this platform 100%"
              </blockquote>

              <div className="flex items-center gap-4 pt-4">
                <div>
                  <div className="font-semibold text-lg text-foreground">- Bek Slambek</div>
                  <div className="text-muted-foreground">Head of Nerd, NU</div>
                </div>
              </div>

            </div>
          </Card>

        </div>
      </div>
    </section>
  )
}

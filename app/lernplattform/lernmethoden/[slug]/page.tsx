import Link from "next/link"
import { notFound } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { learningMethods } from "@/lib/learningMethods"

export function generateStaticParams() {
  return learningMethods.map((method) => ({ slug: method.slug }))
}

export default async function LernmethodeDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const method = learningMethods.find((item) => item.slug === slug)

  if (!method) {
    notFound()
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-sky-50">
      <div className="container mx-auto px-4 py-10 max-w-4xl">
        <header className="mb-8 text-center">
          <Badge className="mb-3">Lernmethode</Badge>
          <h1 className="text-3xl font-bold text-gray-900 mb-2 text-balance">
            {method.title}
          </h1>
          <p className="text-base text-gray-600 text-pretty max-w-2xl mx-auto">
            {method.description}
          </p>
          <div className="mt-6 flex justify-center">
            <Link
              href="/lernplattform"
              className="px-4 py-2 rounded-full border border-gray-200 text-sm text-gray-600 hover:border-primary hover:text-primary transition-colors"
            >
              Zurück zur Lernplattform
            </Link>
          </div>
        </header>

        <section className="grid gap-6 md:grid-cols-2">
          <Card className="bg-white/80">
            <CardHeader>
              <CardTitle className="text-lg">Worum geht es?</CardTitle>
              <CardDescription>Fokus der Lernmethode</CardDescription>
            </CardHeader>
            <CardContent className="text-sm text-gray-600">
              {method.focus}
            </CardContent>
          </Card>

          <Card className="bg-white/80">
            <CardHeader>
              <CardTitle className="text-lg">Bezug zu den PDFs</CardTitle>
              <CardDescription>Diese Unterlagen helfen dir</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-gray-600">
              <ul className="list-disc space-y-1 pl-5">
                {method.topics.map((topic) => (
                  <li key={topic}>{topic}</li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </section>

        <section className="mt-8">
          <Card className="bg-white/80">
            <CardHeader>
              <CardTitle className="text-lg">So übst du</CardTitle>
              <CardDescription>Schritt-für-Schritt-Anleitung</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm text-gray-600">
              <ol className="list-decimal space-y-2 pl-5">
                {method.steps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
            </CardContent>
          </Card>
        </section>

        <section className="mt-8 text-center">
          <Link href="/lernplattform" className="text-primary hover:underline">
            Alle Lernmethoden ansehen
          </Link>
        </section>
      </div>
    </main>
  )
}

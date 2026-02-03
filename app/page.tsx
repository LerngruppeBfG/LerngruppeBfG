"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { RegistrationForm } from "@/components/registration-form"
import { ParticipantsList } from "@/components/participants-list"
import { BookOpen, Users } from "lucide-react"

export default function Home() {
  const [activeView, setActiveView] = useState<"form" | "list">("form")
  const [showAdminLink, setShowAdminLink] = useState(false)

  useEffect(() => {
    const host = window.location.hostname
    setShowAdminLink(host === "localhost" || host === "127.0.0.1")
  }, [])

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-3 text-balance">
            Lerngruppen-Anmeldung
          </h1>
          <p className="text-lg text-gray-600 mb-6 text-pretty">
            Organisiere deine Lernsessions für Februar 2026
          </p>
          
          {/* Privacy Notice */}
          <Card className="bg-blue-50 border-blue-200 p-4 max-w-3xl mx-auto">
            <p className="text-sm text-gray-700 text-pretty">
              <strong>Datenschutzhinweis:</strong> Die hier erhobenen Daten werden ausschließlich zur Organisation der Lerngruppen verwendet und gemäß Datenschutzgesetz (DSGVO) verarbeitet. Ihre E-Mail-Adresse wird in der öffentlichen Liste zensiert dargestellt.
            </p>
          </Card>
        </div>

        {/* Navigation Menu */}
        <div className="flex gap-4 mb-6 justify-center">
          <button
            onClick={() => setActiveView("form")}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
              activeView === "form"
                ? "bg-primary text-primary-foreground shadow-md"
                : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
            }`}
          >
            <BookOpen className="w-5 h-5" />
            Anmeldung
          </button>
          <button
            onClick={() => setActiveView("list")}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${
              activeView === "list"
                ? "bg-primary text-primary-foreground shadow-md"
                : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200"
            }`}
          >
            <Users className="w-5 h-5" />
            Teilnehmerliste
          </button>
        </div>

        {/* Content Area */}
        <div className="mt-8">
          {activeView === "form" ? (
            <RegistrationForm onSuccess={() => setActiveView("list")} />
          ) : (
            <ParticipantsList />
          )}
        </div>

        {/* Footer Disclaimer */}
        <footer className="mt-12 pt-6 border-t border-gray-200 text-center">
          <p className="text-xs text-gray-500 text-pretty mb-3">
            © 2026 Lerngruppen-Portal | Alle Daten werden gemäß DSGVO verarbeitet und gespeichert | Nur zur internen Schulnutzung
          </p>
          {showAdminLink && (
            <a 
              href="./admin" 
              className="text-xs text-gray-400 hover:text-primary transition-colors"
            >
              Admin-Bereich
            </a>
          )}
        </footer>
      </div>
    </main>
  )
}

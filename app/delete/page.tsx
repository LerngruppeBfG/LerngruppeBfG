"use client"

import { Suspense, useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, AlertCircle, Loader2 } from "lucide-react"
import type { Participant } from "@/components/registration-form"
import { getParticipants, deleteParticipantByToken } from '@/lib/participantService'

function DeleteContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get("token") ?? ""

  const [status, setStatus] = useState<"loading" | "found" | "confirm" | "notfound" | "deleted" | "error">("loading")
  const [participant, setParticipant] = useState<Participant | null>(null)

  useEffect(() => {
    const loadParticipant = async () => {
      try {
        if (!token) {
          setStatus("notfound")
          return
        }

        let participants: Participant[] = []
        try {
          participants = await getParticipants()
        } catch (error) {
          console.error("[Storage] Error loading participant:", error)
          setStatus(token ? "confirm" : "error")
          return
        }
        const found = participants.find(p => p.deleteToken === token)

        if (found) {
          setParticipant(found)
          setStatus("found")
        } else {
          setStatus("notfound")
        }
      } catch (error) {
        console.error("[Storage] Error loading participant:", error)
        setStatus(token ? "confirm" : "error")
      }
    }

    loadParticipant()
  }, [token])

  const handleDelete = async () => {
    try {
      const deleted = await deleteParticipantByToken(token)
      if (!deleted) {
        console.warn("[Storage] Participant not found in Supabase")
        setStatus("notfound")
        return
      }
      console.log("[Storage] Participant deleted successfully")
      setStatus("deleted")

      setTimeout(() => {
        router.push("/")
      }, 3000)
    } catch (error) {
      console.error("[Storage] Error deleting participant:", error)
      setStatus("error")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Lerngruppen-Anmeldung</h1>
          <p className="text-gray-600">Anmeldung stornieren</p>
        </div>

        {status === "loading" && (
          <Card className="p-8 text-center">
            <Loader2 className="w-16 h-16 text-blue-500 mx-auto mb-4 animate-spin" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Lade Daten...</h2>
            <p className="text-gray-600">Bitte warten Sie einen Moment.</p>
          </Card>
        )}

        {status === "notfound" && (
          <Card className="p-8 text-center">
            <AlertCircle className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Anmeldung nicht gefunden</h2>
            <p className="text-gray-600 mb-6">
              Diese Anmeldung existiert nicht oder wurde bereits gelöscht.
            </p>
            <Button onClick={() => router.push("/")} className="bg-primary hover:bg-primary/90">
              Zurück zur Startseite
            </Button>
          </Card>
        )}

        {status === "error" && (
          <Card className="p-8 text-center">
            <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Fehler</h2>
            <p className="text-gray-600 mb-6">
              Es ist ein Fehler aufgetreten. Bitte versuchen Sie es später erneut.
            </p>
            <Button onClick={() => router.push("/")} className="bg-primary hover:bg-primary/90">
              Zurück zur Startseite
            </Button>
          </Card>
        )}

        {(status === "found" || status === "confirm") && (
          <Card className="p-8">
            <div className="text-center mb-6">
              <AlertCircle className="w-16 h-16 text-orange-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Anmeldung stornieren?</h2>
              <p className="text-gray-600">
                Möchten Sie diese Anmeldung wirklich löschen?
              </p>
            </div>

            {participant ? (
              <div className="bg-blue-50 rounded-lg p-6 mb-6">
                <h3 className="font-semibold text-blue-900 mb-3">Ihre Anmeldung:</h3>
                <div className="space-y-2 text-sm text-blue-800">
                  <div><strong>Name:</strong> {participant.name}</div>
                  <div><strong>E-Mail:</strong> {participant.email}</div>
                  <div><strong>Tag:</strong> {participant.day}</div>
                  <div><strong>Startzeit:</strong> {participant.time} Uhr</div>
                  <div>
                    <strong>Dauer:</strong>{" "}
                    {participant.sessionType === "Aufgeteilt" && participant.sessionDuration
                      ? `${participant.numberOfSessions}× ${participant.sessionDuration} Min. + Pausen (${participant.breakDuration} Min.)`
                      : `${participant.duration} Minuten`}
                  </div>
                  <div><strong>Modus:</strong> {participant.sessionType}</div>
                </div>
              </div>
            ) : (
              <div className="bg-blue-50 rounded-lg p-6 mb-6 text-sm text-blue-800">
                Die Details konnten nicht geladen werden. Sie können die Anmeldung trotzdem löschen.
              </div>
            )}

            <div className="flex gap-3 justify-center">
              <Button
                onClick={() => router.push("/")}
                variant="outline"
                className="bg-transparent"
              >
                Abbrechen
              </Button>
              <Button
                onClick={handleDelete}
                variant="destructive"
                className="bg-red-600 hover:bg-red-700"
              >
                Ja, Anmeldung löschen
              </Button>
            </div>
          </Card>
        )}

        {status === "deleted" && (
          <Card className="p-8 text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Erfolgreich gelöscht</h2>
            <p className="text-gray-600 mb-2">
              Ihre Anmeldung wurde erfolgreich storniert.
            </p>
            <p className="text-sm text-gray-500">
              Sie werden in Kürze zur Startseite weitergeleitet...
            </p>
          </Card>
        )}
      </div>
    </div>
  )
}

export default function DeletePage() {
  return (
    <Suspense fallback={<div />}>
      <DeleteContent />
    </Suspense>
  )
}

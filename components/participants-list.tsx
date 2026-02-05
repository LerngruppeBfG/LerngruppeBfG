"use client"

import React from "react"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Calendar, Clock, Timer, BookOpen, Mail, Trash2, X } from "lucide-react"
import emailjs from '@emailjs/browser'
import type { Participant } from "./registration-form"
import { subscribeToParticipants, getParticipants, deleteParticipantByToken } from '@/lib/participantService'

export function ParticipantsList() {
  const [participants, setParticipants] = useState<Participant[]>([])
  const [filter, setFilter] = useState<string>("all")
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [cancelForm, setCancelForm] = useState({ name: "", email: "" })
  const [cancelStatus, setCancelStatus] = useState("")
  const [deleteTarget, setDeleteTarget] = useState<Participant | null>(null)
  const [deleteEmail, setDeleteEmail] = useState("")
  const [deleteStatus, setDeleteStatus] = useState<{
    message: string
    type: "success" | "error" | "info"
  } | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const loadParticipants = async () => {
      try {
        const storedParticipants = await getParticipants()
        setParticipants(storedParticipants)
      } catch (error) {
        console.error('[Storage] Failed to load participants from Firebase:', error)
      }
    }
    // Initialize EmailJS
    emailjs.init("ukCJVevtRBgZ-Dr1B")

    // Subscribe to real-time updates from Firebase
    let unsubscribe: (() => void) | null = null
    try {
      loadParticipants()
      unsubscribe = subscribeToParticipants((updatedParticipants) => {
        setParticipants(updatedParticipants)
      })
    } catch (error) {
      console.error('[Storage] Failed to subscribe to Supabase:', error)
    }

    return () => {
      if (unsubscribe) {
        unsubscribe()
      }
    }
  }, [])

  const censorEmail = (email: string): string => {
    const [name, domain] = email.split("@")
    if (name.length <= 2) {
      return `${name[0]}***@${domain}`
    }
    const visibleChars = Math.min(2, Math.floor(name.length / 3))
    const censored = name.slice(0, visibleChars) + "***" + name.slice(-1)
    return `${censored}@${domain}`
  }

  const handleCancelRequest = async (e: React.FormEvent) => {
    e.preventDefault()
    setCancelStatus("Überprüfe Anmeldung...")

    // Find participant by name and email
    const participant = participants.find(
      p => p.name.toLowerCase() === cancelForm.name.toLowerCase() && 
           p.email.toLowerCase() === cancelForm.email.toLowerCase()
    )

    if (!participant) {
      setCancelStatus("Keine Anmeldung mit diesen Daten gefunden.")
      setTimeout(() => setCancelStatus(""), 3000)
      return
    }

    if (!participant.deleteToken) {
      setCancelStatus("Fehler: Keine Lösch-Berechtigung vorhanden.")
      setTimeout(() => setCancelStatus(""), 3000)
      return
    }

    setCancelStatus("Sende Lösch-Link per E-Mail...")

    try {
      const deleteUrl = `${window.location.origin}${window.location.pathname.replace(/\/$/, "")}/delete?token=${participant.deleteToken}`
      
      const templateParams = {
        to_email: participant.email,
        to_name: participant.name,
        delete_link: deleteUrl,
        day: participant.day,
        time: participant.time,
      }

      await emailjs.send(
        'service_0d3rj6z',
        'template_3vb2qdr',
        templateParams
      )

      setCancelStatus("✓ Lösch-Link wurde an deine E-Mail gesendet!")
      setTimeout(() => {
        setShowCancelModal(false)
        setCancelForm({ name: "", email: "" })
        setCancelStatus("")
      }, 3000)
    } catch (error) {
      console.error("[v0] EmailJS error:", error)
      setCancelStatus("Fehler beim Senden der E-Mail. Bitte versuche es erneut.")
      setTimeout(() => setCancelStatus(""), 3000)
    }
  }

  const openDeleteModal = (participant: Participant) => {
    setDeleteTarget(participant)
    setDeleteEmail("")
    setDeleteStatus(null)
    setIsDeleting(false)
  }

  const resetDeleteModal = () => {
    setDeleteTarget(null)
    setDeleteEmail("")
    setDeleteStatus(null)
    setIsDeleting(false)
  }

  const handleDeleteRequest = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!deleteTarget) return

    const typedEmail = deleteEmail.trim().toLowerCase()
    if (!typedEmail) {
      setDeleteStatus({ message: "Bitte gib deine E-Mail-Adresse ein.", type: "error" })
      return
    }

    if (typedEmail !== deleteTarget.email.toLowerCase()) {
      setDeleteStatus({ message: "E-Mail-Adresse stimmt nicht überein.", type: "error" })
      return
    }

    if (!deleteTarget.deleteToken) {
      setDeleteStatus({ message: "Fehler: Keine Lösch-Berechtigung vorhanden.", type: "error" })
      return
    }

    setIsDeleting(true)
    setDeleteStatus({ message: "Lösche Anmeldung...", type: "info" })
    try {
      const deleted = await deleteParticipantByToken(deleteTarget.deleteToken)
      if (!deleted) {
        setDeleteStatus({ message: "Anmeldung konnte nicht gefunden werden.", type: "error" })
        return
      }
      setParticipants((current) => current.filter((participant) => participant.id !== deleteTarget.id))
      setDeleteStatus({ message: "✓ Anmeldung wurde gelöscht.", type: "success" })
      setTimeout(() => {
        resetDeleteModal()
      }, 2000)
    } catch (error) {
      console.error("[Storage] Error deleting participant:", error)
      setDeleteStatus({ message: "Fehler beim Löschen. Bitte versuche es erneut.", type: "error" })
    } finally {
      setIsDeleting(false)
    }
  }

  const filteredParticipants = filter === "all" 
    ? participants 
    : participants.filter(p => p.day === filter)

  const participantsByDay = {
    "08.02.2026": participants.filter(p => p.day === "08.02.2026").length,
    "09.02.2026": participants.filter(p => p.day === "09.02.2026").length,
    "11.02.2026": participants.filter(p => p.day === "11.02.2026").length,
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4 text-center">
          <div className="text-3xl font-bold text-primary">{participants.length}</div>
          <div className="text-sm text-gray-600 mt-1">Gesamt Anmeldungen</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-3xl font-bold text-blue-600">{participantsByDay["08.02.2026"]}</div>
          <div className="text-sm text-gray-600 mt-1">Sonntag, 08.02.</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-3xl font-bold text-indigo-600">{participantsByDay["09.02.2026"]}</div>
          <div className="text-sm text-gray-600 mt-1">Montag, 09.02.</div>
        </Card>
        <Card className="p-4 text-center">
          <div className="text-3xl font-bold text-sky-600">{participantsByDay["11.02.2026"]}</div>
          <div className="text-sm text-gray-600 mt-1">Mittwoch, 11.02.</div>
        </Card>
      </div>

      {/* Cancel Button */}
      <div className="mb-6 text-center">
        <Button
          onClick={() => setShowCancelModal(true)}
          variant="outline"
          className="bg-red-50 border-red-200 text-red-700 hover:bg-red-100"
        >
          <Trash2 className="w-4 h-4 mr-2" />
          Anmeldung stornieren
        </Button>
      </div>

      {/* Filter Buttons */}
      <div className="flex gap-3 mb-6 justify-center flex-wrap">
        <button
          onClick={() => setFilter("all")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            filter === "all"
              ? "bg-primary text-primary-foreground"
              : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
          }`}
        >
          Alle anzeigen
        </button>
          <button
            onClick={() => setFilter("08.02.2026")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              filter === "08.02.2026"
                ? "bg-primary text-primary-foreground"
                : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
            }`}
          >
            08.02.2026
          </button>
          <button
            onClick={() => setFilter("09.02.2026")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              filter === "09.02.2026"
                ? "bg-primary text-primary-foreground"
                : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
            }`}
          >
            09.02.2026
          </button>
          <button
            onClick={() => setFilter("11.02.2026")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              filter === "11.02.2026"
                ? "bg-primary text-primary-foreground"
                : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
            }`}
          >
            11.02.2026
          </button>
        </div>

      {/* Cancel Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-md w-full p-6 relative">
            <button
              onClick={() => {
                setShowCancelModal(false)
                setCancelForm({ name: "", email: "" })
                setCancelStatus("")
              }}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-gray-900 mb-2">Anmeldung stornieren</h3>
            <p className="text-sm text-gray-600 mb-6">
              Gib deinen Namen und deine E-Mail-Adresse ein. Du erhältst dann einen Lösch-Link per E-Mail.
            </p>

            <form onSubmit={handleCancelRequest} className="space-y-4">
              <div>
                <Label htmlFor="cancel-name">Name *</Label>
                <Input
                  id="cancel-name"
                  type="text"
                  required
                  value={cancelForm.name}
                  onChange={(e) => setCancelForm({ ...cancelForm, name: e.target.value })}
                  placeholder="Dein vollständiger Name"
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="cancel-email">E-Mail-Adresse *</Label>
                <Input
                  id="cancel-email"
                  type="email"
                  required
                  value={cancelForm.email}
                  onChange={(e) => setCancelForm({ ...cancelForm, email: e.target.value })}
                  placeholder="beispiel@gmail.com"
                  className="mt-1"
                />
              </div>

              {cancelStatus && (
                <div className={`text-sm p-3 rounded ${
                  cancelStatus.includes("✓") 
                    ? "bg-green-50 text-green-700 border border-green-200" 
                    : cancelStatus.includes("Fehler") || cancelStatus.includes("Keine")
                    ? "bg-red-50 text-red-700 border border-red-200"
                    : "bg-blue-50 text-blue-700 border border-blue-200"
                }`}>
                  {cancelStatus}
                </div>
              )}

              <Button type="submit" className="w-full">
                Lösch-Link anfordern
              </Button>
            </form>
          </Card>
        </div>
      )}

      {deleteTarget && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="max-w-md w-full p-6 relative">
            <button
              onClick={resetDeleteModal}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold text-gray-900 mb-2">Anmeldung löschen</h3>
            <p className="text-sm text-gray-600 mb-6">
              Um die Anmeldung von <strong>{deleteTarget.name}</strong> zu löschen, gib bitte die vollständige
              E-Mail-Adresse ein.
            </p>

            <form onSubmit={handleDeleteRequest} className="space-y-4">
              <div>
                <Label htmlFor="delete-email">E-Mail-Adresse *</Label>
                <Input
                  id="delete-email"
                  type="email"
                  required
                  value={deleteEmail}
                  onChange={(event) => setDeleteEmail(event.target.value)}
                  placeholder="beispiel@gmail.com"
                  className="mt-1"
                />
              </div>

              {deleteStatus && (
                <div className={`text-sm p-3 rounded ${
                  deleteStatus.type === "success"
                    ? "bg-green-50 text-green-700 border border-green-200"
                    : deleteStatus.type === "error"
                    ? "bg-red-50 text-red-700 border border-red-200"
                    : "bg-blue-50 text-blue-700 border border-blue-200"
                }`}>
                  {deleteStatus.message}
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={resetDeleteModal}
                  className="bg-transparent"
                >
                  Abbrechen
                </Button>
                <Button
                  type="submit"
                  variant="destructive"
                  className="bg-red-600 hover:bg-red-700"
                  disabled={isDeleting}
                >
                  {isDeleting ? "Lösche..." : "Anmeldung löschen"}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}

      {/* Participants List */}
      {filteredParticipants.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-gray-500">Noch keine Anmeldungen vorhanden.</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredParticipants.map((participant) => (
            <Card key={participant.id} className="relative p-6 hover:shadow-lg transition-shadow">
              <button
                type="button"
                onClick={() => openDeleteModal(participant)}
                className="absolute top-4 right-4 text-gray-400 hover:text-red-600"
                aria-label="Anmeldung löschen"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {participant.name}
                  </h3>
                  
                  <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                    <Mail className="w-4 h-4" />
                    <span className="font-mono">{censorEmail(participant.email)}</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <Calendar className="w-4 h-4 text-primary" />
                      <span>{participant.day}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <Clock className="w-4 h-4 text-primary" />
                      <span>{participant.time} Uhr</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-700">
                      <Timer className="w-4 h-4 text-primary" />
                      {participant.sessionType === "Aufgeteilt" && participant.sessionDuration ? (
                        <span>
                          {participant.numberOfSessions}× {participant.sessionDuration} Min. + Pausen ({participant.breakDuration} Min.)
                        </span>
                      ) : (
                        <span>{participant.duration} Minuten</span>
                      )}
                    </div>
                    <div>
                      <Badge variant={participant.sessionType === "Am Stück" ? "default" : "secondary"}>
                        {participant.sessionType}
                      </Badge>
                    </div>
                  </div>

                  <div className="bg-blue-50 rounded-lg p-3 border border-blue-100">
                    <div className="flex items-start gap-2">
                      <BookOpen className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="text-xs font-semibold text-blue-900 mb-1">
                          Lernpräferenzen:
                        </div>
                        <p className="text-sm text-gray-700 text-pretty">
                          {participant.learningPreferences}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

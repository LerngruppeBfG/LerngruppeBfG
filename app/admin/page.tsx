"use client"

import React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Trash2, Lock, LogOut, Calendar, Clock, Timer, User, Mail } from "lucide-react"
import type { Participant } from "@/components/registration-form"
import { subscribeToParticipants, deleteParticipantById, getParticipants } from '@/lib/participantService'

export default function AdminPage() {
  const [isLocal, setIsLocal] = useState<boolean | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState("")
  const [participants, setParticipants] = useState<Participant[]>([])
  const [error, setError] = useState("")

  // Admin password (in production, this should be in environment variables)
  const ADMIN_PASSWORD = "admin123" // Change this to your desired password

  useEffect(() => {
    const host = window.location.hostname
    setIsLocal(host === "localhost" || host === "127.0.0.1")
  }, [])

  useEffect(() => {
    // Check if already authenticated
    const adminAuth = sessionStorage.getItem("adminAuth")
    if (adminAuth === "true") {
      setIsAuthenticated(true)
    }
  }, [])

  useEffect(() => {
    if (isAuthenticated) {
      // Subscribe to real-time updates from Firebase
      let unsubscribe: (() => void) | null = null
      try {
        const loadParticipants = async () => {
          try {
            const storedParticipants = await getParticipants()
            setParticipants(storedParticipants)
          } catch (error) {
            console.error('[Storage] Failed to load participants from Firebase:', error)
          }
        }
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
    }
  }, [isAuthenticated])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true)
      sessionStorage.setItem("adminAuth", "true")
      setError("")
    } else {
      setError("Falsches Passwort")
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    sessionStorage.removeItem("adminAuth")
    setPassword("")
  }

  const handleDelete = async (id: string) => {
    if (confirm("Möchten Sie diese Anmeldung wirklich löschen?")) {
      try {
        // Delete from Firebase
        await deleteParticipantById(id)
        console.log('[Storage] Participant deleted from Supabase')
      } catch (error) {
        console.error('[Storage] Error deleting participant:', error)
      }
    }
  }

  const censorEmail = (email: string) => {
    const [local, domain] = email.split("@")
    if (local.length <= 2) return `${local[0]}***@${domain}`
    return `${local.substring(0, 2)}***@${domain}`
  }

  if (isLocal === null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-3">Admin-Bereich</h1>
          <p className="text-sm text-gray-600">
            Lädt...
          </p>
        </Card>
      </div>
    )
  }

  if (!isLocal) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-3">Admin-Bereich</h1>
          <p className="text-sm text-gray-600 mb-6">
            Dieser Bereich ist nur lokal verfügbar. Für GitHub Pages ist die Admin-Ansicht deaktiviert.
          </p>
          <Link href="/" className="text-sm text-primary hover:underline">
            ← Zurück zur Anmeldung
          </Link>
        </Card>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-8">
          <div className="flex flex-col items-center mb-6">
            <div className="bg-primary/10 p-4 rounded-full mb-4">
              <Lock className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Admin-Login</h1>
            <p className="text-gray-600 text-sm mt-2">Lerngruppen-Verwaltung</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label htmlFor="password">Passwort</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Admin-Passwort eingeben"
                className="mt-1"
                required
              />
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 text-sm p-3 rounded-md">
                {error}
              </div>
            )}

            <Button type="submit" className="w-full">
              Anmelden
            </Button>
          </form>

          <div className="mt-6 pt-6 border-t text-center">
            <Link href="/" className="text-sm text-primary hover:underline">
              ← Zurück zur Anmeldung
            </Link>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin-Bereich</h1>
            <p className="text-gray-600 mt-1">Verwaltung der Lerngruppen-Anmeldungen</p>
          </div>
          <Button onClick={handleLogout} variant="outline" className="gap-2 bg-transparent">
            <LogOut className="w-4 h-4" />
            Abmelden
          </Button>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-6">
            <div className="text-sm text-gray-600">Gesamt Anmeldungen</div>
            <div className="text-3xl font-bold text-primary mt-2">{participants.length}</div>
          </Card>
          <Card className="p-6">
            <div className="text-sm text-gray-600">Sonntag (08.02.)</div>
            <div className="text-3xl font-bold text-blue-600 mt-2">
              {participants.filter(p => p.day === "08.02.2026").length}
            </div>
          </Card>
          <Card className="p-6">
            <div className="text-sm text-gray-600">Montag (09.02.)</div>
            <div className="text-3xl font-bold text-indigo-600 mt-2">
              {participants.filter(p => p.day === "09.02.2026").length}
            </div>
          </Card>
          <Card className="p-6">
            <div className="text-sm text-gray-600">Mittwoch (11.02.)</div>
            <div className="text-3xl font-bold text-sky-600 mt-2">
              {participants.filter(p => p.day === "11.02.2026").length}
            </div>
          </Card>
        </div>

        {/* Participants List */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-6">Alle Anmeldungen</h2>

          {participants.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              Noch keine Anmeldungen vorhanden
            </div>
          ) : (
            <div className="space-y-4">
              {participants.map((participant) => (
                <div
                  key={participant.id}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      {/* Name and Email */}
                      <div className="mb-3">
                        <div className="flex items-center gap-2 mb-1">
                          <User className="w-4 h-4 text-gray-500" />
                          <span className="font-semibold text-gray-900">{participant.name}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Mail className="w-4 h-4" />
                          <span>{participant.email}</span>
                          <span className="text-xs text-gray-400">
                            (Öffentlich: {censorEmail(participant.email)})
                          </span>
                        </div>
                      </div>

                      {/* Details Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
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

                      {/* Learning Preferences */}
                      <div className="bg-gray-50 p-3 rounded-lg">
                        <div className="text-xs font-medium text-gray-600 mb-1">Lernpräferenzen:</div>
                        <div className="text-sm text-gray-800">{participant.learningPreferences}</div>
                      </div>

                      {/* Timestamp */}
                      <div className="text-xs text-gray-400 mt-2">
                        Angemeldet am: {new Date(participant.timestamp).toLocaleString("de-DE")}
                      </div>
                    </div>

                    {/* Delete Button */}
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(participant.id)}
                      className="gap-2 ml-4"
                    >
                      <Trash2 className="w-4 h-4" />
                      Löschen
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Navigation */}
        <div className="mt-6 text-center">
          <Link href="/" className="text-primary hover:underline">
            ← Zurück zur Anmeldung
          </Link>
        </div>
      </div>
    </div>
  )
}

"use client"

import React from "react"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { CheckCircle } from "lucide-react"
import emailjs from '@emailjs/browser'
import { addParticipant } from '@/lib/participantService'

interface RegistrationFormProps {
  onSuccess: () => void
}

export interface Participant {
  id: string
  name: string
  email: string
  day: string
  time: string
  duration: string
  sessionType: string
  learningPreferences: string
  timestamp: string
  numberOfSessions?: string
  sessionDuration?: string
  breakDuration?: string
  deleteToken?: string
}

export function RegistrationForm({ onSuccess }: RegistrationFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    day: "",
    time: "15:00",
    duration: "",
    sessionType: "",
    learningPreferences: "",
    numberOfSessions: "2",
    sessionDuration: "",
    breakDuration: "15",
  })

  const [submitted, setSubmitted] = useState(false)
  const [emailStatus, setEmailStatus] = useState<string>("")

  const generateId = () => {
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
      return crypto.randomUUID()
    }
    return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`
  }

  // Initialize EmailJS
  useEffect(() => {
    emailjs.init("ukCJVevtRBgZ-Dr1B")
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const deleteToken = generateId()
    const participant: Participant = {
      id: generateId(),
      ...formData,
      timestamp: new Date().toISOString(),
      deleteToken: deleteToken,
    }

    // Show success message immediately
    setSubmitted(true)
    setEmailStatus("E-Mail wird versendet...")

    // Save to localStorage as a fallback/cache
    try {
      const existing = localStorage.getItem("participants")
      const participants: Participant[] = existing ? JSON.parse(existing) : []
      participants.push(participant)
      localStorage.setItem("participants", JSON.stringify(participants))
      console.log("[Storage] Participant data saved to localStorage as cache")
    } catch (error) {
      console.error("[Storage] Warning: Failed to save to localStorage cache:", error)
    }

    // PRIMARY: Save to Firebase for cross-device sync
    try {
      await addParticipant(participant)
      console.log("[Storage] Participant data saved successfully to Firebase")
    } catch (error) {
      console.error("[Storage] Warning: Failed to save to Firebase:", error)
      console.warn("[Storage] Using localStorage only - data will not sync across devices")
    }

    // Send email using EmailJS - this is secondary and can fail without breaking the flow
    try {
      const durationText = formData.sessionType === "Aufgeteilt" && formData.sessionDuration
        ? `${formData.numberOfSessions}× ${formData.sessionDuration} Min. + Pausen (${formData.breakDuration} Min.)`
        : `${formData.duration} Minuten`

      const deleteUrl = `${window.location.origin}${window.location.pathname.replace(/\/$/, "")}/delete?token=${deleteToken}`
      
      const templateParams = {
        to_email: formData.email,
        to_name: formData.name,
        day: formData.day,
        time: formData.time,
        duration: durationText,
        sessionType: formData.sessionType,
        delete_link: deleteUrl,
        message: `
Hallo ${formData.name},

deine Anmeldung für die Lerngruppe wurde erfolgreich gespeichert.

Deine Lernsession:
- Tag: ${formData.day}
- Startzeit: ${formData.time} Uhr
- Dauer: ${durationText}
- Modus: ${formData.sessionType}

Wir freuen uns auf produktives Lernen mit dir!

Falls du deine Anmeldung stornieren möchtest, klicke auf diesen Link:
${deleteUrl}

Diese E-Mail dient nur zur Bestätigung. Deine Daten werden ausschließlich für die Organisation der Lerngruppe verwendet.
        `
      }

      await emailjs.send(
        'service_0d3rj6z',
        'template_t5tbtxo',
        templateParams
      )

      setEmailStatus("Bestätigungs-E-Mail wurde versendet!")
      console.log("[v0] Email sent successfully via EmailJS")
    } catch (error) {
      console.error("[v0] EmailJS error:", error)
      setEmailStatus("Anmeldung gespeichert (E-Mail-Versand fehlgeschlagen)")
    }

    // Reset form after showing success
    setTimeout(() => {
      setSubmitted(false)
      setEmailStatus("")
      setFormData({
        name: "",
        email: "",
        day: "",
        time: "15:00",
        duration: "",
        sessionType: "",
        learningPreferences: "",
        numberOfSessions: "2",
        sessionDuration: "",
        breakDuration: "15",
      })
      onSuccess()
    }, 5000)
  }

  if (submitted) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <Card className="p-8 text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Anmeldung erfolgreich gespeichert!</h2>
          <p className="text-gray-600 mb-2">
            Deine Anmeldung wurde erfolgreich registriert.
          </p>
          {emailStatus && (
            <p className="text-sm text-blue-600 font-medium">
              {emailStatus}
            </p>
          )}
        </Card>

        {/* Email Preview */}
        <Card className="p-6 bg-gray-50 border-2 border-gray-200">
          <div className="text-xs text-gray-500 mb-4">Vorschau der Bestätigungs-E-Mail:</div>
          <div className="bg-white rounded-lg shadow-sm p-6 space-y-4">
            <div className="border-b pb-3">
              <div className="text-sm text-gray-600 mb-1">An: {formData.email}</div>
              <div className="text-sm text-gray-600">Betreff: Bestätigung deiner Lerngruppen-Anmeldung</div>
            </div>
            
            <div className="space-y-3 text-sm text-gray-900">
              <p>Hallo {formData.name},</p>
              
              <p>
                deine Anmeldung für die Lerngruppe wurde erfolgreich gespeichert.
              </p>
              
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <div className="font-semibold text-blue-900 mb-2">Deine Lernsession:</div>
                <div className="space-y-1 text-blue-800">
                  <div>📅 Tag: <strong>{formData.day}</strong></div>
                  <div>🕐 Startzeit: <strong>{formData.time} Uhr</strong></div>
                  <div>
                    ⏱️ Dauer: <strong>
                      {formData.sessionType === "Aufgeteilt" && formData.sessionDuration
                        ? `${formData.numberOfSessions}× ${formData.sessionDuration} Min. + Pausen (${formData.breakDuration} Min.)`
                        : `${formData.duration} Minuten`}
                    </strong>
                  </div>
                  <div>📚 Modus: <strong>{formData.sessionType}</strong></div>
                </div>
              </div>
              
              <p>
                Wir freuen uns auf produktives Lernen mit dir!
              </p>

              <div className="bg-red-50 p-3 rounded border border-red-200 text-xs">
                <div className="font-semibold text-red-900 mb-1">Anmeldung stornieren:</div>
                <div className="text-red-700">
                  Falls du deine Anmeldung stornieren möchtest, findest du in der E-Mail einen persönlichen Lösch-Link.
                </div>
              </div>
              
              <p className="text-gray-600 text-xs pt-2 border-t">
                Diese E-Mail dient nur zur Bestätigung. Deine Daten werden ausschließlich für die Organisation der Lerngruppe verwendet.
              </p>
            </div>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <Card className="max-w-2xl mx-auto p-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name */}
        <div>
          <Label htmlFor="name">Name *</Label>
          <Input
            id="name"
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Vor- und Nachname"
            className="mt-1"
          />
        </div>

        {/* Email */}
        <div>
          <Label htmlFor="email">E-Mail-Adresse *</Label>
          <Input
            id="email"
            type="email"
            required
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            placeholder="beispiel@gmail.com"
            className="mt-1"
          />
          <p className="text-xs text-gray-500 mt-1">
            Zur Bestätigung und Verifizierung deiner Anmeldung
          </p>
        </div>

        {/* Day Selection */}
        <div>
          <Label>Lerntag *</Label>
          <div className="grid grid-cols-1 gap-4 mt-2 sm:grid-cols-3">
            <label className="relative flex cursor-pointer">
              <input
                type="radio"
                name="day"
                value="08.02.2026"
                required
                checked={formData.day === "08.02.2026"}
                onChange={(e) => setFormData({ ...formData, day: e.target.value })}
                className="peer sr-only"
              />
              <div className="w-full rounded-lg border-2 border-gray-200 p-4 text-center transition-all peer-checked:border-primary peer-checked:bg-primary peer-checked:text-primary-foreground hover:border-gray-300">
                <div className="font-semibold">Sonntag</div>
                <div className="text-sm">08.02.2026</div>
              </div>
            </label>
            <label className="relative flex cursor-pointer">
              <input
                type="radio"
                name="day"
                value="09.02.2026"
                required
                checked={formData.day === "09.02.2026"}
                onChange={(e) => setFormData({ ...formData, day: e.target.value })}
                className="peer sr-only"
              />
              <div className="w-full rounded-lg border-2 border-gray-200 p-4 text-center transition-all peer-checked:border-primary peer-checked:bg-primary peer-checked:text-primary-foreground hover:border-gray-300">
                <div className="font-semibold">Montag</div>
                <div className="text-sm">09.02.2026</div>
              </div>
            </label>
            <label className="relative flex cursor-pointer">
              <input
                type="radio"
                name="day"
                value="11.02.2026"
                required
                checked={formData.day === "11.02.2026"}
                onChange={(e) => setFormData({ ...formData, day: e.target.value })}
                className="peer sr-only"
              />
              <div className="w-full rounded-lg border-2 border-gray-200 p-4 text-center transition-all peer-checked:border-primary peer-checked:bg-primary peer-checked:text-primary-foreground hover:border-gray-300">
                <div className="font-semibold">Mittwoch</div>
                <div className="text-sm">11.02.2026</div>
              </div>
            </label>
          </div>
        </div>

        {/* Time Selection */}
        <div>
          <Label htmlFor="time">
            Startzeit {formData.day === "08.02.2026" ? "(Sonntag - ab 10:00 Uhr)" : "(ab 15:00 Uhr)"} *
          </Label>
          <select
            id="time"
            required
            value={formData.time}
            onChange={(e) => setFormData({ ...formData, time: e.target.value })}
            className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {formData.day === "08.02.2026" ? (
              <>
                <option value="10:00">10:00 Uhr</option>
                <option value="10:15">10:15 Uhr</option>
                <option value="10:30">10:30 Uhr</option>
                <option value="10:45">10:45 Uhr</option>
                <option value="11:00">11:00 Uhr</option>
                <option value="11:15">11:15 Uhr</option>
                <option value="11:30">11:30 Uhr</option>
                <option value="11:45">11:45 Uhr</option>
                <option value="12:00">12:00 Uhr</option>
                <option value="12:15">12:15 Uhr</option>
                <option value="12:30">12:30 Uhr</option>
                <option value="12:45">12:45 Uhr</option>
                <option value="13:00">13:00 Uhr</option>
                <option value="13:15">13:15 Uhr</option>
                <option value="13:30">13:30 Uhr</option>
                <option value="13:45">13:45 Uhr</option>
                <option value="14:00">14:00 Uhr</option>
                <option value="14:15">14:15 Uhr</option>
                <option value="14:30">14:30 Uhr</option>
                <option value="14:45">14:45 Uhr</option>
                <option value="15:00">15:00 Uhr</option>
                <option value="15:15">15:15 Uhr</option>
                <option value="15:30">15:30 Uhr</option>
                <option value="15:45">15:45 Uhr</option>
                <option value="16:00">16:00 Uhr</option>
                <option value="16:15">16:15 Uhr</option>
                <option value="16:30">16:30 Uhr</option>
                <option value="16:45">16:45 Uhr</option>
                <option value="17:00">17:00 Uhr</option>
                <option value="17:15">17:15 Uhr</option>
                <option value="17:30">17:30 Uhr</option>
                <option value="17:45">17:45 Uhr</option>
                <option value="18:00">18:00 Uhr</option>
                <option value="18:15">18:15 Uhr</option>
                <option value="18:30">18:30 Uhr</option>
                <option value="18:45">18:45 Uhr</option>
                <option value="19:00">19:00 Uhr</option>
              </>
            ) : (
              <>
                <option value="15:00">15:00 Uhr</option>
                <option value="15:15">15:15 Uhr</option>
                <option value="15:30">15:30 Uhr</option>
                <option value="15:45">15:45 Uhr</option>
                <option value="16:00">16:00 Uhr</option>
                <option value="16:15">16:15 Uhr</option>
                <option value="16:30">16:30 Uhr</option>
                <option value="16:45">16:45 Uhr</option>
                <option value="17:00">17:00 Uhr</option>
                <option value="17:15">17:15 Uhr</option>
                <option value="17:30">17:30 Uhr</option>
                <option value="17:45">17:45 Uhr</option>
                <option value="18:00">18:00 Uhr</option>
                <option value="18:15">18:15 Uhr</option>
                <option value="18:30">18:30 Uhr</option>
                <option value="18:45">18:45 Uhr</option>
                <option value="19:00">19:00 Uhr</option>
              </>
            )}
          </select>
        </div>

        {/* Session Type */}
        <div>
          <Label>Lernmodus *</Label>
          <div className="grid grid-cols-2 gap-4 mt-2">
            <label className="relative flex cursor-pointer">
              <input
                type="radio"
                name="sessionType"
                value="Am Stück"
                required
                checked={formData.sessionType === "Am Stück"}
                onChange={(e) => setFormData({ ...formData, sessionType: e.target.value })}
                className="peer sr-only"
              />
              <div className="w-full rounded-lg border-2 border-gray-200 p-4 text-center transition-all peer-checked:border-primary peer-checked:bg-primary peer-checked:text-primary-foreground hover:border-gray-300">
                <div className="font-semibold">Am Stück</div>
                <div className="text-xs mt-1">Ohne Unterbrechung</div>
              </div>
            </label>
            <label className="relative flex cursor-pointer">
              <input
                type="radio"
                name="sessionType"
                value="Aufgeteilt"
                required
                checked={formData.sessionType === "Aufgeteilt"}
                onChange={(e) => setFormData({ ...formData, sessionType: e.target.value })}
                className="peer sr-only"
              />
              <div className="w-full rounded-lg border-2 border-gray-200 p-4 text-center transition-all peer-checked:border-primary peer-checked:bg-primary peer-checked:text-primary-foreground hover:border-gray-300">
                <div className="font-semibold">Aufgeteilt</div>
                <div className="text-xs mt-1">Mit Pausen</div>
              </div>
            </label>
          </div>
        </div>

        {/* Duration - Am Stück */}
        {formData.sessionType === "Am Stück" && (
          <div>
            <Label htmlFor="duration">Gewünschte Lerndauer *</Label>
            <select
              id="duration"
              required
              value={formData.duration}
              onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
              className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <option value="">Bitte wählen...</option>
              <option value="60">1 Stunde</option>
              <option value="90">1,5 Stunden</option>
              <option value="120">2 Stunden</option>
              <option value="150">2,5 Stunden</option>
              <option value="180">3 Stunden</option>
              <option value="240">4 Stunden</option>
            </select>
          </div>
        )}

        {/* Duration - Aufgeteilt */}
        {formData.sessionType === "Aufgeteilt" && (
          <div className="space-y-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="text-sm font-medium text-blue-900">Aufteilung der Lernsitzungen</div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Number of Sessions */}
              <div>
                <Label htmlFor="numberOfSessions">Anzahl Einheiten *</Label>
                <select
                  id="numberOfSessions"
                  required
                  value={formData.numberOfSessions}
                  onChange={(e) => setFormData({ ...formData, numberOfSessions: e.target.value })}
                  className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="2">2 Einheiten</option>
                  <option value="3">3 Einheiten</option>
                  <option value="4">4 Einheiten</option>
                </select>
              </div>

              {/* Session Duration */}
              <div>
                <Label htmlFor="sessionDuration">Dauer pro Einheit *</Label>
                <select
                  id="sessionDuration"
                  required
                  value={formData.sessionDuration}
                  onChange={(e) => setFormData({ ...formData, sessionDuration: e.target.value })}
                  className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="">Bitte wählen...</option>
                  <option value="30">30 Minuten</option>
                  <option value="45">45 Minuten</option>
                  <option value="60">60 Minuten</option>
                  <option value="90">90 Minuten</option>
                  <option value="120">120 Minuten</option>
                </select>
              </div>

              {/* Break Duration */}
              <div>
                <Label htmlFor="breakDuration">Pausenlänge *</Label>
                <select
                  id="breakDuration"
                  required
                  value={formData.breakDuration}
                  onChange={(e) => setFormData({ ...formData, breakDuration: e.target.value })}
                  className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="10">10 Minuten</option>
                  <option value="15">15 Minuten</option>
                  <option value="20">20 Minuten</option>
                  <option value="30">30 Minuten</option>
                </select>
              </div>
            </div>

            {/* Summary */}
            {formData.sessionDuration && (
              <div className="mt-3 p-3 bg-white rounded border border-blue-100">
                <div className="text-xs font-medium text-gray-600 mb-1">Gesamtübersicht:</div>
                <div className="text-sm text-gray-900">
                  {formData.numberOfSessions} × {formData.sessionDuration} Min. Lernen + {Number.parseInt(formData.numberOfSessions) - 1} × {formData.breakDuration} Min. Pause
                  <span className="font-semibold ml-2">
                    = {Number.parseInt(formData.numberOfSessions) * Number.parseInt(formData.sessionDuration) + (Number.parseInt(formData.numberOfSessions) - 1) * Number.parseInt(formData.breakDuration)} Min. gesamt
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Learning Preferences */}
        <div>
          <Label htmlFor="preferences">Lernpräferenzen / Lernthemen *</Label>
          <textarea
            id="preferences"
            required
            value={formData.learningPreferences}
            onChange={(e) => setFormData({ ...formData, learningPreferences: e.target.value })}
            placeholder="z.B. Anatomie und Physiologie, Grundpflege, Vitalzeichenkontrolle, Hygiene und Infektionsprävention, Dokumentation, Umgang mit Patienten, Medikamentenlehre..."
            rows={4}
            className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          />
          <p className="text-xs text-gray-500 mt-1">
            Diese Informationen werden anderen Teilnehmern angezeigt, um gemeinsame Interessen zu finden
          </p>
        </div>

        <Button type="submit" className="w-full" size="lg">
          Jetzt anmelden
        </Button>
      </form>
    </Card>
  )
}

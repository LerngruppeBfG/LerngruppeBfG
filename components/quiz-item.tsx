"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

type QuizItemProps = {
  title: string
  question: string
  options: string[]
  answer: string
  explanation: string
}

export function QuizItem({
  title,
  question,
  options,
  answer,
  explanation,
}: QuizItemProps) {
  const [selected, setSelected] = useState<number | null>(null)
  const [revealed, setRevealed] = useState(false)

  const correctIndex = answer.charCodeAt(0) - 65

  return (
    <Card className="bg-white/80">
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-lg">{title}</CardTitle>
          <Badge>Lernquiz</Badge>
        </div>
        <CardDescription>{question}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 text-sm text-gray-600">
        <ol className="space-y-1 text-sm text-gray-600">
          {options.map((option, index) => {
            let optionClass =
              "flex gap-2 rounded-lg px-3 py-2 cursor-pointer transition-colors"
            if (revealed) {
              if (index === correctIndex) {
                optionClass += " bg-emerald-100 text-emerald-800"
              } else if (index === selected) {
                optionClass += " bg-red-100 text-red-800"
              }
            } else if (index === selected) {
              optionClass += " bg-primary/10 text-primary ring-1 ring-primary/30"
            } else {
              optionClass += " hover:bg-gray-50"
            }

            return (
              <li
                key={option}
                className={optionClass}
                onClick={() => {
                  if (!revealed) setSelected(index)
                }}
              >
                <span className="font-semibold text-gray-500">
                  {String.fromCharCode(65 + index)}.
                </span>
                <span>{option}</span>
              </li>
            )
          })}
        </ol>

        {!revealed && (
          <button
            onClick={() => setRevealed(true)}
            disabled={selected === null}
            className="w-full rounded-lg border border-dashed border-gray-200 bg-white/80 px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {selected === null
              ? "Bitte zuerst eine Antwort auswählen"
              : "Lösung anzeigen"}
          </button>
        )}

        {revealed && (
          <div className="rounded-lg border border-dashed border-gray-200 bg-white/80 p-3">
            <p className="font-medium text-gray-700">
              Richtige Antwort: {answer}
            </p>
            {selected !== null && (
              <p
                className={`mt-1 text-xs font-medium ${
                  selected === correctIndex
                    ? "text-emerald-600"
                    : "text-red-600"
                }`}
              >
                {selected === correctIndex
                  ? "✓ Richtig!"
                  : "✗ Leider falsch."}
              </p>
            )}
            <p className="mt-2 text-xs text-gray-500">{explanation}</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

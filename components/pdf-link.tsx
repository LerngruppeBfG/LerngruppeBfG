"use client"

import { getPdfUrl } from "@/lib/pdfMap"
import { FileDown } from "lucide-react"

interface PdfLinkProps {
  name: string
  className?: string
}

export function PdfLink({ name, className }: PdfLinkProps) {
  const url = getPdfUrl(name)

  if (!url) {
    return <span className={className}>{name}</span>
  }

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-1 underline decoration-dotted underline-offset-2 hover:text-primary transition-colors ${className ?? ""}`}
    >
      {name}
      <FileDown className="inline h-3 w-3 shrink-0" />
    </a>
  )
}

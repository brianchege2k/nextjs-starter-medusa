"use client"

import { useState } from "react"

type Props = {
  title: string
  content: string
}

export default function CollapsibleSection({ title, content }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <div className="border-t pt-4">
      <button
        className="flex justify-between items-center w-full text-left font-semibold"
        onClick={() => setOpen(!open)}
      >
        {title}
        <span className="text-xl">{open ? "−" : "+"}</span>
      </button>

      {open && (
        <ul className="list-disc pl-5 mt-3 space-y-1 text-sm text-gray-600">
          {content.split("\n").map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
      )}
    </div>
  )
}

"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { Search } from "lucide-react"
import { useMemo, useState } from "react"

type NavSearchProps = {
  placeholder?: string
  className?: string
}

export default function NavSearch({
  placeholder = "Search products...",
  className = "",
}: NavSearchProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const initialQ = useMemo(() => searchParams.get("q") ?? "", [searchParams])
  const [q, setQ] = useState(initialQ)

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const query = q.trim()

    // send users to the store page with query
    if (!query) {
      router.push("/store")
      return
    }

    router.push(`/store?q=${encodeURIComponent(query)}`)
  }

  return (
    <form
      onSubmit={onSubmit}
      className={`w-full max-w-[620px] ${className}`}
    >
      <div className="flex items-center gap-2 rounded-full border border-ui-border-base bg-white px-4 py-2 shadow-sm">
        <Search className="h-4 w-4 text-ui-fg-subtle" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-transparent text-sm outline-none placeholder:text-ui-fg-muted"
        />
      </div>
    </form>
  )
}

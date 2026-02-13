"use client"

import { useState } from "react"
import { addToCart } from "@lib/data/cart-actions"

export default function AddToCartHoverButton({
  variantId,
  regionId,
}: {
  variantId: string
  regionId?: string
}) {
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  const onAdd = async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!variantId || loading) return
    setLoading(true)
    setDone(false)

    try {
      await addToCart({ variantId, quantity: 1, regionId })
      setDone(true)
      setTimeout(() => setDone(false), 1200)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={onAdd}
      disabled={loading}
      className="bg-white text-[#B88E2F] px-8 py-3 text-sm font-semibold hover:bg-[#B88E2F] hover:text-white transition disabled:opacity-50"
    >
      {loading ? "Adding..." : done ? "Added!" : "Add to cart"}
    </button>
  )
}
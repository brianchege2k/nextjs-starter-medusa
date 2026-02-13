"use server"

import { cookies } from "next/headers"
import { sdk } from "@lib/config"

const CART_COOKIE = "_medusa_cart_id"

async function getOrCreateCart(region_id?: string) {
  const cookieStore = await cookies()
  const existing = cookieStore.get(CART_COOKIE)?.value

  if (existing) return existing

  const { cart } = await sdk.client.fetch<{ cart: any }>("/store/carts", {
    method: "POST",
    body: region_id ? { region_id } : {},
    cache: "no-store",
  })

  cookieStore.set(CART_COOKIE, cart.id, {
    path: "/",
    httpOnly: true,
    sameSite: "lax",
  })

  return cart.id as string
}

export async function addToCart({
  variantId,
  quantity = 1,
  regionId,
}: {
  variantId: string
  quantity?: number
  regionId?: string
}) {
  const cartId = await getOrCreateCart(regionId)

  await sdk.client.fetch(`/store/carts/${cartId}/line-items`, {
    method: "POST",
    body: {
      variant_id: variantId,
      quantity,
    },
    cache: "no-store",
  })

  return { ok: true }
}
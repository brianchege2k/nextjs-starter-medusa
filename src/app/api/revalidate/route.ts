import { NextRequest, NextResponse } from "next/server"
import { revalidateTag, revalidatePath } from "next/cache"
import { getCacheTag } from "@lib/data/cookies"

// Helpful for verifying the route exists in production
export async function GET() {
  return NextResponse.json({ ok: true, route: "/api/revalidate" })
}

export async function POST(req: NextRequest) {
  const secret =
    req.headers.get("x-revalidate-secret") ??
    req.nextUrl.searchParams.get("secret")

  if (!secret || secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  // Allow backend to send tags explicitly: ?tags=a,b,c
  const raw = req.nextUrl.searchParams.get("tags") || ""
  const passedTags = raw
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean)

  // Fallback tags (must NOT depend on cookies only)
  const fallbackTags = (
    await Promise.all([
      getCacheTag("products"),
      getCacheTag("categories"),
      getCacheTag("collections"),
      getCacheTag("regions"),
    ])
  ).filter(Boolean) as string[]

  const allTags = Array.from(new Set([...passedTags, ...fallbackTags]))

  allTags.forEach((t) => revalidateTag(t))

  // Optional path revalidation (fine to keep)
  revalidatePath("/", "layout")
  revalidatePath("/store", "layout")

  return NextResponse.json({ revalidated: true, tags: allTags })
}

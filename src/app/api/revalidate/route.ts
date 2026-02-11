import { NextRequest, NextResponse } from "next/server"
import { revalidateTag, revalidatePath } from "next/cache"
import { getCacheTag } from "@lib/data/cookies"

export async function POST(req: NextRequest) {
  // Check secret (use header OR query param; header is best)
  const secret =
    req.headers.get("x-revalidate-secret") ??
    req.nextUrl.searchParams.get("secret")

  if (!secret || secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 })
  }

  /**
   * Revalidate the same tags your app uses.
   * If your getCacheTag() returns null, fall back to static strings.
   */
  const tags = await Promise.all([
    getCacheTag("products"),
    getCacheTag("categories"),
    getCacheTag("collections"),
    getCacheTag("regions"),
  ])

  tags.filter(Boolean).forEach((t) => revalidateTag(t as string))

  // Optional: also revalidate common pages/layouts (helps if some parts use path caching)
  revalidatePath("/", "layout")
  revalidatePath("/store", "layout")

  return NextResponse.json({ revalidated: true, tags: tags.filter(Boolean) })
}

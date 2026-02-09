import type { Metadata } from "next"

import { listCollections } from "@lib/data/collections"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

export const metadata: Metadata = {
  title: "Collections | Best Buys Ke",
  description: "Browse curated collections from Best Buys Ke.",
}

const toRouteHandle = (handle?: string | null) => (handle ? handle.replace(/^\//, "") : "")

export default async function CollectionsIndexPage() {
  const { collections } = await listCollections({
    fields: "id,handle,title",
    limit: "100",
  })

  if (!collections?.length) {
    return (
      <div className="content-container py-12 small:py-16">
        <h1 className="text-2xl" style={{ color: "#916953" }}>
          Collections
        </h1>
        <p className="mt-2 text-ui-fg-subtle">No collections available right now.</p>
      </div>
    )
  }

  return (
    <div className="content-container py-12 small:py-16">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl small:text-4xl font-normal" style={{ color: "#916953" }}>
          Collections
        </h1>
        <p className="text-ui-fg-subtle max-w-2xl">
          Browse curated picks from Best Buys Ke — hand-selected deals, seasonal drops, and more.
        </p>
      </div>

      <ul className="mt-10 grid grid-cols-1 small:grid-cols-2 lg:grid-cols-3 gap-6">
        {collections.map((c) => {
          const handle = toRouteHandle(c.handle)

          return (
            <li key={c.id} className="h-full">
              <LocalizedClientLink
                href={`/collections/${handle}`}
                className="group block h-full rounded-2xl border p-6 transition hover:opacity-95"
                style={{
                  backgroundColor: "#faf6f6",
                  borderColor: "rgba(145, 105, 83, 0.18)",
                }}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div
                      className="text-lg font-medium truncate"
                      style={{ color: "#916953" }}
                      title={c.title}
                    >
                      {c.title}
                    </div>
                    <div className="mt-2 text-sm text-ui-fg-subtle">
                      View products in this collection
                    </div>
                  </div>

                  <span
                    className="inline-flex items-center justify-center rounded-full px-3 py-1 text-xs"
                    style={{
                      backgroundColor: "#fcddf2",
                      color: "#916953",
                    }}
                  >
                    Explore
                  </span>
                </div>

                <div
                  className="mt-6 h-1 w-16 rounded-full transition-all group-hover:w-24"
                  style={{ backgroundColor: "#fcb5b5" }}
                />
              </LocalizedClientLink>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

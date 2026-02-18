import { listCategories } from "@lib/data/categories"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { ChevronDown } from "lucide-react"

export default async function CategoryStrip() {
  const categories = await listCategories({ limit: 100 })

  // top-level only (like your screenshot)
  const topLevel = (categories ?? []).filter((c) => !c.parent_category)

  return (
    <div className="w-full">
      {/* Categories row */}
      <div className="w-full border-b border-ui-border-base bg-white">
        <div className="content-container">
          <div className="flex items-center justify-center">
            <ul className="flex w-full items-center justify-start gap-6 overflow-x-auto py-3 text-sm scrollbar-hide md:justify-center">
              {topLevel.map((c) => {
                const hasChildren = (c.category_children?.length ?? 0) > 0

                return (
                  <li key={c.id} className="shrink-0">
                    <LocalizedClientLink
                      href={`/categories/${c.handle}`}
                      className="flex items-center gap-1 whitespace-nowrap text-ui-fg-base hover:text-ui-fg-subtle"
                    >
                      <span>{c.name}</span>
                      {hasChildren ? (
                        <ChevronDown className="h-4 w-4" />
                      ) : null}
                    </LocalizedClientLink>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      </div>

      {/* Tagline strip */}
      <div className="w-full bg-ui-bg-subtle">
        <div className="content-container">
          <div className="py-4 text-center">
            <p className="text-lg font-semibold tracking-tight text-ui-fg-base">
              {/* 👇 Change this tagline to your own */}
              Premium home essentials — curated for modern living, delivered across Kenya.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

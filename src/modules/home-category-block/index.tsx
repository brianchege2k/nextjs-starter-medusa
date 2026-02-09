
import { Suspense } from "react"

import InteractiveLink from "@modules/common/components/interactive-link"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import PaginatedProducts from "@modules/store/templates/paginated-products"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"
import { HttpTypes } from "@medusajs/types"

type Props = {
  category: HttpTypes.StoreProductCategory
  countryCode: string
  sortBy?: SortOptions
  page?: number
  showChildren?: boolean
  showDescription?: boolean
}

export default function HomeCategoryBlock({
  category,
  countryCode,
  sortBy = "created_at",
  page = 1,
  showChildren = true,
  showDescription = true,
}: Props) {
  if (!category) return null

  return (
    <section className="content-container py-10">
      <div className="flex items-center justify-between gap-4 mb-4">
        <div className="flex items-baseline gap-3">
          <h2 className="text-2xl-semi">{category.name}</h2>
          <LocalizedClientLink
            href={`/categories/${category.handle}`}
            className="text-small-regular text-ui-fg-subtle hover:text-black"
          >
            View all →
          </LocalizedClientLink>
        </div>
      </div>

      {showDescription && category.description && (
        <p className="mb-6 text-base-regular text-ui-fg-subtle">
          {category.description}
        </p>
      )}

      {showChildren && category.category_children?.length ? (
        <div className="mb-6 text-base-large">
          <ul className="grid grid-cols-1 small:grid-cols-2 gap-2">
            {category.category_children.slice(0, 6).map((c) => (
              <li key={c.id}>
                <InteractiveLink href={`/categories/${c.handle}`}>
                  {c.name}
                </InteractiveLink>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <Suspense fallback={<SkeletonProductGrid numberOfProducts={8} />}>
        <PaginatedProducts
          sortBy={sortBy}
          page={page}
          categoryId={category.id}
          countryCode={countryCode}
        />
      </Suspense>
    </section>
  )
}

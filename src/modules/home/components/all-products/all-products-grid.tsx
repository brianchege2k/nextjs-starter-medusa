"use client"

import { useState } from "react"
import { HttpTypes } from "@medusajs/types"
import { listProducts } from "@lib/data/products"
import ProductPreview from "@modules/products/components/product-preview"

export default function AllProductsGrid({
  initialProducts,
  initialNextPage,
  totalCount,
  region,
}: {
  initialProducts: HttpTypes.StoreProduct[]
  initialNextPage: number | null
  totalCount: number
  region: HttpTypes.StoreRegion
}) {
  const [products, setProducts] = useState(initialProducts)
  const [nextPage, setNextPage] = useState<number | null>(initialNextPage)
  const [loading, setLoading] = useState(false)

  const loadMore = async () => {
    if (!nextPage || loading) return
    setLoading(true)

    const res = await listProducts({
      regionId: region.id,
      pageParam: nextPage,
      queryParams: {
        limit: 8,
        fields: "*variants.calculated_price,+metadata,+tags,*images,*variants",
      },
    })

    setProducts((prev) => [...prev, ...res.response.products])
    setNextPage(res.nextPage)
    setLoading(false)
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-4 small:gap-6 small:grid-cols-3 large:grid-cols-4">
        {products.map((p) => (
          <ProductPreview key={p.id} product={p} region={region} />
        ))}
      </div>

      {/* Show more like design */}
      {nextPage && products.length < totalCount && (
        <div className="mt-10 flex justify-center">
          <button
            onClick={loadMore}
            disabled={loading}
            className="inline-flex items-center justify-center border border-[#B88E2F] text-[#B88E2F] px-10 py-3 text-sm font-semibold hover:bg-[#B88E2F] hover:text-white transition disabled:opacity-50"
          >
            {loading ? "Loading..." : "Show More"}
          </button>
        </div>
      )}
    </>
  )
}
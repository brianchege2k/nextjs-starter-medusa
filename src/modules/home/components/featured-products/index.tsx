import { listProducts } from "@lib/data/products"
import { HttpTypes } from "@medusajs/types"
import ProductPreview from "@modules/products/components/product-preview"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

type Props = {
  collections: { id: string; handle?: string | null; title?: string | null }[]
  region: HttpTypes.StoreRegion
}

export default async function FeaturedProducts({ collections, region }: Props) {
  // Prefer a collection with handle "featured"
  const featured =
    collections.find((c) => (c.handle ?? "").toLowerCase() === "featured") ??
    collections[0]

  if (!featured) return null

  const {
    response: { products },
  } = await listProducts({
    regionId: region.id,
    queryParams: {
      collection_id: featured.id,
      limit: 8,
      fields: "*variants.calculated_price",
    },
  })

  if (!products?.length) return null

  return (
    <section className="content-container py-10 small:py-14">
      {/* Title (like wireframe) */}
      <div className="text-center">
        <h2 className="text-2xl small:text-3xl font-semibold text-black">
          Featured Products
        </h2>
      </div>

      {/* Grid */}
      <div className="mt-8 grid grid-cols-2 gap-4 small:gap-6 small:grid-cols-3 large:grid-cols-4">
        {products.map((p) => (
          <ProductPreview key={p.id} product={p} region={region} />
        ))}
      </div>

      {/* CTA */}
      <div className="mt-10 flex justify-center">
        <LocalizedClientLink
          href="/store"
          className="inline-flex items-center justify-center border border-[#B88E2F] text-[#B88E2F] px-10 py-3 text-sm font-semibold hover:bg-[#B88E2F] hover:text-white transition"
        >
          Show More
        </LocalizedClientLink>
      </div>
    </section>
  )
}
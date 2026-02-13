import { HttpTypes } from "@medusajs/types"
import { listProducts } from "@lib/data/products"
import AllProductsGrid from "./all-products-grid"

export default async function AllProducts({
  region,
}: {
  region: HttpTypes.StoreRegion
}) {
  const {
    response: { products, count },
    nextPage,
  } = await listProducts({
    regionId: region.id,
    pageParam: 1,
    queryParams: {
      limit: 8, // smaller section like design
      fields: "*variants.calculated_price,+metadata,+tags,*images,*variants",
    },
  })

  return (
    <section className="content-container py-10 small:py-14">
      <div className="text-center">
        <h2 className="text-2xl small:text-3xl font-semibold text-black">
          Our Products
        </h2>
      </div>

      <div className="mt-8">
        <AllProductsGrid
          initialProducts={products}
          initialNextPage={nextPage}
          totalCount={count}
          region={region}
        />
      </div>
    </section>
  )
}
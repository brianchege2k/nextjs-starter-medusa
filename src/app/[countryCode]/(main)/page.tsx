
import { Metadata } from "next"

import Hero from "@modules/home/components/hero"
// import FeaturedProducts from "@modules/home/components/featured-products"
import CategoryShowcase from "@modules/home/components/category-showcase"
import CategoryTemplate from "../../../modules/categories/templates"
import { getRegion } from "@lib/data/regions"
import { listCollections } from "@lib/data/collections"

export const metadata: Metadata = {
  title: "Best Buys Ke - Home",
  description:
    "Best Buys Ke is your go-to destination for premium home essentials at unbeatable prices across Kenya.",
}

export default async function Home(props: {
  params: Promise<{ countryCode: string }>
}) {
  const params = await props.params

  const { countryCode } = params

  const region = await getRegion(countryCode)

  const { collections } = await listCollections({
    fields: "id, handle, title",
  })

  if (!collections || !region) {
    return null
  }

  return (
    <>
      <Hero />

      {/* Categories rendered using the CategoryTemplate-style block */}
<div className="py-12">
        <ul className="flex flex-col gap-x-6">
          {/* <FeaturedProducts collections={collections} region={region} /> */}
          <CategoryShowcase />
        </ul>
      </div>
    </>
  )
}

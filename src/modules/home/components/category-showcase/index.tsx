import { listCategories } from "@lib/data/categories"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { HttpTypes } from "@medusajs/types"

const FALLBACK_IMAGES = [
  "https://images.unsplash.com/photo-1615873968403-89e068629265?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1582582494700-0b87b1af1b1a?auto=format&fit=crop&w=1200&q=80",
  "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80",
]

export default async function CategoryShowcase() {
  const categories = await listCategories({ limit: 100 })

  if (!categories?.length) return null

  const topLevel = categories.filter((c) => !c.parent_category)
  const pickFrom = topLevel.length ? topLevel : categories

  const tiles = pickFrom.slice(0, 3)
  

  return (
    <section className="content-container py-10 small:py-14">
      <div className="text-center">
        <h2 className="text-2xl small:text-3xl font-semibold text-black">
          Browse The Range
        </h2>
        <p className="mt-2 text-sm small:text-base text-black/60">
          Explore our top categories.
        </p>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-6 small:grid-cols-2 large:grid-cols-3">
        {tiles.map((cat, idx) => {
          const meta = (cat as any)?.metadata ?? {}
          const img =
            meta.image || meta.thumbnail || FALLBACK_IMAGES[idx % FALLBACK_IMAGES.length]

          const href = cat.handle ? `/categories/${cat.handle}` : `/store`

          return (
            <LocalizedClientLink key={cat.id} href={href} className="group">
              <div className="overflow-hidden rounded-sm bg-[#F4F5F7]">
                <div className="aspect-[4/5] w-full overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={img}
                    alt={cat.name}
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                    loading="lazy"
                  />
                </div>
              </div>

              <div className="mt-4 text-center">
                <p className="text-lg font-semibold text-black">{cat.name}</p>
              </div>
            </LocalizedClientLink>
          )
        })}
      </div>
    </section>
    
  )
  
}

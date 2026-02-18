import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { listCollections } from "@lib/data/collections"

type CollectionLike = {
  id: string
  title?: string | null
  handle?: string | null
  metadata?: Record<string, any> | null
}

function getCollectionImage(c: CollectionLike) {
  // ✅ Recommended: set this in Medusa Admin -> Collection -> metadata.image
  const metaImg = (c.metadata as any)?.image as string | undefined
  if (metaImg) return metaImg

  // Fallback placeholder (until you add metadata.image)
  return "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80"
}

export default async function CollectionsGrid() {
const { collections } = await listCollections({
  fields: "id,title,handle,metadata",
  limit: "12",
})


  const items = (collections ?? []) as CollectionLike[]

  return (
    <section className="content-container py-10 small:py-14">
      <div className="flex items-center justify-center">
        <LocalizedClientLink
          href="/collections"
          className="rounded-full bg-ui-bg-subtle px-6 py-3 text-sm font-semibold text-ui-fg-base hover:bg-ui-bg-base"
        >
          View All Collections
        </LocalizedClientLink>
      </div>

<div className="mt-8 flex flex-wrap justify-center gap-4 small:gap-5">
  {items.map((c) => {
    const img = getCollectionImage(c)

    return (
      <LocalizedClientLink
        key={c.id}
        href={c.handle ? `/collections/${c.handle}` : "/collections"}
        className="group relative w-[150px] overflow-hidden rounded-[28px] bg-ui-bg-subtle shadow-sm small:w-[170px] md:w-[185px] lg:w-[200px]"
        aria-label={c.title ?? "Collection"}
      >
        <div className="relative aspect-[4/5] w-full">
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-[1.03]"
            style={{ backgroundImage: `url('${img}')` }}
          />
          <div className="absolute inset-0 bg-black/10" />
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

          <div className="absolute inset-x-0 bottom-0 p-3">
            <p className="text-center text-sm font-semibold text-white drop-shadow">
              {c.title}
            </p>
          </div>
        </div>
      </LocalizedClientLink>
    )
  })}
</div>

    </section>
  )
}

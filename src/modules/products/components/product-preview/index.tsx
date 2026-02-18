import { Text } from "@medusajs/ui"
import { getProductPrice } from "@lib/util/get-product-price"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "../thumbnail"
import PreviewPrice from "./price"
import AddToCartHoverButton from "@modules/common/components/add-to-cart-hover-button"

export default function ProductPreview({
  product,
  region,
  compact = false,
}: {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  compact?: boolean
}) {
  const { cheapestPrice } = getProductPrice({ product })

  const variantId =
    product.variants?.find((v) => v?.calculated_price)?.id ||
    product.variants?.[0]?.id

  return (
    <LocalizedClientLink
      href={`/products/${product.handle}`}
      className="group block"
      data-testid="product-wrapper"
    >
      <div className="relative overflow-hidden bg-[#F4F5F7] rounded-2xl">
        {/* Image */}
        <div className="relative">
          <div className={compact ? "aspect-[1/1] w-full" : "aspect-[4/5] w-full"}>
            <Thumbnail
              thumbnail={product.thumbnail}
              images={product.images}
              size="full"
            />
          </div>

          {/* Hover overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/45 opacity-0 transition group-hover:opacity-100">
            {variantId ? (
              <div className={compact ? "scale-[0.9]" : ""}>
                <AddToCartHoverButton variantId={variantId} regionId={region.id} />
              </div>
            ) : (
              <span
                className={[
                  "bg-white text-[#B88E2F] font-semibold",
                  compact ? "px-5 py-2 text-xs" : "px-8 py-3 text-sm",
                ].join(" ")}
              >
                View product
              </span>
            )}
          </div>
        </div>

        {/* Info */}
        <div className={compact ? "p-2.5" : "p-4"}>
          <Text
            className={[
              "font-semibold text-black line-clamp-1",
              compact ? "text-[13px]" : "text-[15px]",
            ].join(" ")}
          >
            {product.title}
          </Text>

          <p
            className={[
              "text-black/60 line-clamp-1",
              compact ? "mt-0.5 text-[11px]" : "mt-1 text-[13px]",
            ].join(" ")}
          >
            {product.subtitle || "Home essentials, curated"}
          </p>

          <div className={compact ? "mt-1.5" : "mt-2"}>
            <div
              className={[
                "font-semibold text-black",
                compact ? "text-[13px]" : "text-[15px]",
              ].join(" ")}
            >
              {cheapestPrice && <PreviewPrice price={cheapestPrice} />}
            </div>
          </div>
        </div>
      </div>
    </LocalizedClientLink>
  )
}

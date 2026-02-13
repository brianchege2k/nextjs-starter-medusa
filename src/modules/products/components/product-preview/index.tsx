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
}: {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
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
      <div className="relative bg-[#F4F5F7] overflow-hidden">
        {/* Image */}
        <div className="relative">
          <div className="aspect-[4/5] w-full">
            <Thumbnail
              thumbnail={product.thumbnail}
              images={product.images}
              size="full"
            />
          </div>

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
            {variantId ? (
              <AddToCartHoverButton variantId={variantId} regionId={region.id} />
            ) : (
              <span className="bg-white text-[#B88E2F] px-8 py-3 text-sm font-semibold">
                View product
              </span>
            )}
          </div>
        </div>

        {/* Info */}
        <div className="p-4">
          <Text className="text-[15px] font-semibold text-black line-clamp-1">
            {product.title}
          </Text>

          <p className="mt-1 text-[13px] text-black/60 line-clamp-1">
            {product.subtitle || "Stylish and modern comfort"}
          </p>

          <div className="mt-2 flex items-center justify-between">
            <div className="text-[15px] font-semibold text-black">
              {cheapestPrice && <PreviewPrice price={cheapestPrice} />}
            </div>
          </div>
        </div>
      </div>
    </LocalizedClientLink>
  )
}
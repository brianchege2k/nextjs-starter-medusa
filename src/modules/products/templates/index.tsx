import React, { Suspense } from "react"
import { notFound } from "next/navigation"
import { HttpTypes } from "@medusajs/types"

import ImageGallery from "@modules/products/components/image-gallery"
import ProductActions from "@modules/products/components/product-actions"
import ProductTabs from "@modules/products/components/product-tabs"
import RelatedProducts from "@modules/products/components/related-products"
import ProductInfo from "@modules/products/templates/product-info"
import SkeletonRelatedProducts from "@modules/skeletons/templates/skeleton-related-products"
import CollapsibleSection from "@modules/products/components/collapsible-section"

import ProductActionsWrapper from "./product-actions-wrapper"

type ProductTemplateProps = {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
  countryCode: string
  images: HttpTypes.StoreProductImage[]
}

const ProductTemplate: React.FC<ProductTemplateProps> = ({
  product,
  region,
  countryCode,
  images,
}) => {
  if (!product || !product.id) {
    return notFound()
  }

  const features =
    typeof product.metadata?.features === "string"
      ? product.metadata.features
      : undefined

  const usage =
    typeof product.metadata?.usage === "string"
      ? product.metadata.usage
      : undefined

  return (
    <>
      <div
        className="content-container grid md:grid-cols-2 gap-12 py-10"
        data-testid="product-container"
      >
        {/* LEFT */}
        <div className="w-full">
          <ImageGallery images={images} />
        </div>

        {/* RIGHT */}
        <div className="flex flex-col gap-y-6">

          <ProductInfo product={product} />

          <Suspense
            fallback={
              <ProductActions
                disabled={true}
                product={product}
                region={region}
              />
            }
          >
            <ProductActionsWrapper id={product.id} region={region} />
          </Suspense>

          <ProductTabs product={product} />

          {features && (
            <CollapsibleSection
              title="Features"
              content={features}
            />
          )}

          {usage && (
            <CollapsibleSection
              title="Usage"
              content={usage}
            />
          )}
        </div>
      </div>

      <div
        className="content-container my-16 small:my-32"
        data-testid="related-products-container"
      >
        <Suspense fallback={<SkeletonRelatedProducts />}>
          <RelatedProducts product={product} countryCode={countryCode} />
        </Suspense>
      </div>
    </>
  )
}

export default ProductTemplate

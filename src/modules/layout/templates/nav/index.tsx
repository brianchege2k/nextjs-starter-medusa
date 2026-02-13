import { Suspense } from "react"

import { listRegions } from "@lib/data/regions"
import { listLocales } from "@lib/data/locales"
import { getLocale } from "@lib/data/locale-actions"
import { StoreRegion } from "@medusajs/types"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"
import SideMenu from "@modules/layout/components/side-menu"

import { Search, Heart, ShoppingCart, User } from "lucide-react"

export default async function Nav() {
  const [regions, locales, currentLocale] = await Promise.all([
    listRegions().then((regions: StoreRegion[]) => regions),
    listLocales(),
    getLocale(),
  ])

  return (
    <div className="sticky top-0 inset-x-0 z-50">
      <header className="h-16 border-b border-ui-border-base bg-white">
        <nav className="content-container h-full flex items-center justify-between">
          {/* Left: Mobile menu + Logo */}
          <div className="flex items-center gap-3 flex-1 basis-0">
            <div className="flex items-center h-full">
              <SideMenu
                regions={regions}
                locales={locales}
                currentLocale={currentLocale}
              />
            </div>

            <LocalizedClientLink
              href="/"
              className="flex items-center gap-2"
              data-testid="nav-store-link"
            >
              {/* Minimal “Furniro-like” logo mark */}
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-[#B88E2F] text-white text-xs font-semibold">
                BB
              </span>
              <span className="text-lg font-semibold tracking-tight text-black">
                Best Buys Ke
              </span>
            </LocalizedClientLink>
          </div>

          {/* Center: Desktop links */}
          <div className="hidden small:flex items-center gap-10 text-sm font-medium text-black">
            <LocalizedClientLink href="/" className="hover:opacity-70">
              Home
            </LocalizedClientLink>
            <LocalizedClientLink href="/store" className="hover:opacity-70">
              Shop
            </LocalizedClientLink>
            <LocalizedClientLink href="/about" className="hover:opacity-70">
              About
            </LocalizedClientLink>
            <LocalizedClientLink href="/contact" className="hover:opacity-70">
              Contact
            </LocalizedClientLink>
          </div>

          {/* Right: Icons */}
          <div className="flex items-center justify-end gap-4 flex-1 basis-0">
            <LocalizedClientLink
              href="/search"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full hover:bg-ui-bg-base-hover"
              aria-label="Search"
            >
              <Search className="h-5 w-5 text-black" />
            </LocalizedClientLink>

            <LocalizedClientLink
              href="/account"
              data-testid="nav-account-link"
              className="inline-flex h-9 w-9 items-center justify-center rounded-full hover:bg-ui-bg-base-hover"
              aria-label="Account"
            >
              <User className="h-5 w-5 text-black" />
            </LocalizedClientLink>

            <LocalizedClientLink
              href="/wishlist"
              className="hidden xsmall:inline-flex h-9 w-9 items-center justify-center rounded-full hover:bg-ui-bg-base-hover"
              aria-label="Wishlist"
            >
              <Heart className="h-5 w-5 text-black" />
            </LocalizedClientLink>

            <Suspense
              fallback={
                <LocalizedClientLink
                  href="/cart"
                  data-testid="nav-cart-link"
                  className="inline-flex items-center gap-2 rounded-full px-3 py-2 hover:bg-ui-bg-base-hover"
                  aria-label="Cart"
                >
                  <ShoppingCart className="h-5 w-5 text-black" />
                  <span className="text-sm text-black">(0)</span>
                </LocalizedClientLink>
              }
            >
              <CartButton />
            </Suspense>
          </div>
        </nav>
      </header>
    </div>
  )
}
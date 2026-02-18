import Image from "next/image"
import { Suspense } from "react"

import { listRegions } from "@lib/data/regions"
import { listLocales } from "@lib/data/locales"
import { getLocale } from "@lib/data/locale-actions"
import { StoreRegion } from "@medusajs/types"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"
import SideMenu from "@modules/layout/components/side-menu"
import NavSearch from "@modules/layout/components/nav-search"

import {
  CalendarDays,
  Cog,
  Truck,
  MapPin,
  User,
  ShoppingCart,
} from "lucide-react"

export default async function Nav() {
  const [regions, locales, currentLocale] = await Promise.all([
    listRegions().then((regions: StoreRegion[]) => regions),
    listLocales(),
    getLocale(),
  ])

  return (
    <div className="sticky top-0 inset-x-0 z-50">
      {/* Top utility bar (gold) */}
      <div className="w-full bg-[#C9923A] text-black">
        <div className="content-container">
          <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 py-2 text-xs font-medium">
            <div className="flex items-center gap-2">
              <span className="italic">Nairobi CBD</span>
            </div>

            <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
              <div className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4" />
                <span>MON-SAT -8am -6pm</span>
              </div>

              <div className="flex items-center gap-2">
                <Cog className="h-4 w-4" />
                <span>Pay on delivery if in Nairobi</span>
              </div>

              <div className="flex items-center gap-2">
                <Truck className="h-4 w-4" />
                <span>Countrywide Deliveries</span>
              </div>

              <div className="hidden md:flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                <span>Bihi Towers,11th Floor,Suite 2 -Moi Avenue Nairobi CBD</span>
              </div>
            </div>

            <div className="hidden lg:flex items-center gap-2">
              <CalendarDays className="h-4 w-4" />
              <span>MON-SAT -8am -6pm</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main header (white) */}
      <header className="w-full border-b border-ui-border-base bg-white">
        <div className="content-container">
          <div className="flex h-20 items-center justify-between gap-4">
            {/* Left: burger + logo */}
            <div className="flex flex-1 items-center gap-3">
              <div className="h-full flex items-center">
                <SideMenu
                  regions={regions}
                  locales={locales}
                  currentLocale={currentLocale}
                />
              </div>

              <LocalizedClientLink
                href="/"
                className="flex items-center gap-2"
                aria-label="Home"
              >
                <Image
                  src="/images/logo.png"
                  alt="Store logo"
                  width={150}
                  height={60}
                  priority
                  className="h-12 w-auto"
                />
              </LocalizedClientLink>
            </div>

            {/* Center: search */}
            <div className="hidden md:flex flex-[1.2] justify-center">
              <NavSearch />
            </div>

            {/* Right: account + cart */}
            <div className="flex flex-1 items-center justify-end gap-6">
              <LocalizedClientLink
                href="/account"
                className="flex flex-col items-center gap-1 text-xs text-ui-fg-subtle hover:text-ui-fg-base"
              >
                <User className="h-5 w-5" />
                <span>My Account</span>
              </LocalizedClientLink>

              {/* Keep CartButton behavior (count, etc.) but style around it */}
              <div className="flex flex-col items-center gap-1 text-xs text-ui-fg-subtle hover:text-ui-fg-base">
                <div className="h-5 w-5">
                  <ShoppingCart className="h-5 w-5" />
                </div>

                {/* CartButton usually renders link + count. Keep it for logic. */}
                <Suspense fallback={<span>Cart</span>}>
                  <CartButton />
                </Suspense>
              </div>
            </div>
          </div>

          {/* Mobile search */}
          <div className="md:hidden pb-4">
            <NavSearch />
          </div>
        </div>
      </header>
    </div>
  )
}

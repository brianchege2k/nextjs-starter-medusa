import { listCategories } from "@lib/data/categories"
import { listCollections } from "@lib/data/collections"
import { Text, clx } from "@medusajs/ui"

import LocalizedClientLink from "@modules/common/components/localized-client-link"

import {
  Instagram,
  Facebook,
  Twitter,
  Youtube,
  Mail,
  Phone,
  MapPin,
} from "lucide-react"

export default async function Footer() {
  const { collections } = await listCollections({
    fields: "*products",
  })
  const productCategories = await listCategories()

  return (
    <footer
      className="border-t border-ui-border-base w-full"
      style={{ backgroundColor: "#faf6f6" }}
    >
      <div className="content-container flex flex-col w-full">
        {/* Top Section */}
        <div className="flex flex-col gap-y-10 xsmall:flex-row items-start justify-between py-24">
          {/* Brand + short pitch + socials */}
          <div className="max-w-sm">
            <LocalizedClientLink
              href="/"
              className="txt-compact-xlarge-plus uppercase inline-flex items-center"
              style={{ color: "#916953" }}
            >
              Best Buys Ke
            </LocalizedClientLink>

            <p className="mt-3 txt-small text-ui-fg-subtle">
              Quality deals, fast delivery, and trusted service — curated for Kenya.
            </p>

            {/* Socials */}
            <div className="mt-6">
              <p
                className="txt-small-plus mb-3"
                style={{ color: "#916953" }}
              >
                Follow us
              </p>

              <div className="flex items-center gap-3">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Instagram"
                  className="p-2 rounded-full transition hover:opacity-90"
                  style={{ backgroundColor: "#fcddf2", color: "#916953" }}
                >
                  <Instagram className="h-5 w-5" aria-hidden="true" />
                </a>

                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Facebook"
                  className="p-2 rounded-full transition hover:opacity-90"
                  style={{ backgroundColor: "#fcddf2", color: "#916953" }}
                >
                  <Facebook className="h-5 w-5" aria-hidden="true" />
                </a>

                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="X / Twitter"
                  className="p-2 rounded-full transition hover:opacity-90"
                  style={{ backgroundColor: "#fcddf2", color: "#916953" }}
                >
                  <Twitter className="h-5 w-5" aria-hidden="true" />
                </a>

                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="YouTube"
                  className="p-2 rounded-full transition hover:opacity-90"
                  style={{ backgroundColor: "#fcddf2", color: "#916953" }}
                >
                  <Youtube className="h-5 w-5" aria-hidden="true" />
                </a>
              </div>
            </div>
          </div>

          {/* Links Grid */}
          <div className="text-small-regular gap-10 md:gap-x-16 grid grid-cols-2 sm:grid-cols-3 w-full xsmall:w-auto">
            {/* Categories */}
            {productCategories && productCategories.length > 0 && (
              <div className="flex flex-col gap-y-3">
                <span
                  className="txt-small-plus"
                  style={{ color: "#916953" }}
                >
                  Categories
                </span>
                <ul className="grid grid-cols-1 gap-2" data-testid="footer-categories">
                  {productCategories.slice(0, 6).map((c) => {
                    if (c.parent_category) return null

                    const children =
                      c.category_children?.map((child) => ({
                        name: child.name,
                        handle: child.handle,
                        id: child.id,
                      })) || null

                    return (
                      <li
                        className="flex flex-col gap-2 txt-small"
                        style={{ color: "#916953" }}
                        key={c.id}
                      >
                        <LocalizedClientLink
                          className={clx("hover:opacity-90", children && "txt-small-plus")}
                          href={`/categories/${c.handle}`}
                          data-testid="category-link"
                        >
                          {c.name}
                        </LocalizedClientLink>

                        {children && (
                          <ul className="grid grid-cols-1 ml-3 gap-2">
                            {children.map((child) => (
                              <li key={child.id}>
                                <LocalizedClientLink
                                  className="hover:opacity-90"
                                  href={`/categories/${child.handle}`}
                                  data-testid="category-link"
                                >
                                  {child.name}
                                </LocalizedClientLink>
                              </li>
                            ))}
                          </ul>
                        )}
                      </li>
                    )
                  })}
                </ul>
              </div>
            )}

            {/* Collections */}
            {collections && collections.length > 0 && (
              <div className="flex flex-col gap-y-3">
                <span
                  className="txt-small-plus"
                  style={{ color: "#916953" }}
                >
                  Collections
                </span>
                <ul
                  className={clx("grid grid-cols-1 gap-2 txt-small", {
                    "grid-cols-2": (collections?.length || 0) > 3,
                  })}
                  style={{ color: "#916953" }}
                >
                  {collections.slice(0, 6).map((c) => (
                    <li key={c.id}>
                      <LocalizedClientLink className="hover:opacity-90" href={`/collections/${c.handle}`}>
                        {c.title}
                      </LocalizedClientLink>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Help / Contact (replaces Medusa section) */}
            <div className="flex flex-col gap-y-3">
              <span
                className="txt-small-plus"
                style={{ color: "#916953" }}
              >
                Help & Contact
              </span>

              <ul className="grid grid-cols-1 gap-y-3 txt-small" style={{ color: "#916953" }}>
                <li>
                  <LocalizedClientLink className="hover:opacity-90" href="/shipping">
                    Shipping & Delivery
                  </LocalizedClientLink>
                </li>
                <li>
                  <LocalizedClientLink className="hover:opacity-90" href="/returns">
                    Returns & Refunds
                  </LocalizedClientLink>
                </li>
                <li>
                  <LocalizedClientLink className="hover:opacity-90" href="/contact">
                    Contact Us
                  </LocalizedClientLink>
                </li>

                <li className="pt-2 space-y-2" style={{ color: "#916953" }}>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" aria-hidden="true" />
                    <a className="hover:opacity-90" href="mailto:support@bestbuyske.co.ke">
                      support@bestbuyske.co.ke
                    </a>
                  </div>

                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" aria-hidden="true" />
                    <a className="hover:opacity-90" href="tel:+254700000000">
                      +254 700 000 000
                    </a>
                  </div>

                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" aria-hidden="true" />
                    <span className="text-ui-fg-subtle">Nairobi, Kenya</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="flex w-full items-center justify-between gap-4 py-6 border-t"
          style={{ borderColor: "rgba(145, 105, 83, 0.18)" }}
        >
          <Text className="txt-compact-small" style={{ color: "#916953" }}>
            © {new Date().getFullYear()} Best Buys Ke. All rights reserved.
          </Text>

          <div className="flex items-center gap-4 txt-compact-small" style={{ color: "#916953" }}>
            <LocalizedClientLink className="hover:opacity-90" href="/privacy">
              Privacy
            </LocalizedClientLink>
            <LocalizedClientLink className="hover:opacity-90" href="/terms">
              Terms
            </LocalizedClientLink>
          </div>
        </div>
      </div>
    </footer>
  )
}

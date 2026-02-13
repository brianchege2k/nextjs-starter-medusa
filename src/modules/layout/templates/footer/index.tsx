import LocalizedClientLink from "@modules/common/components/localized-client-link"

export default async function Footer() {
  return (
    <footer className="border-t border-ui-border-base bg-white">
      <div className="content-container py-12 small:py-16">
        <div className="grid grid-cols-1 gap-10 small:grid-cols-2 large:grid-cols-4">
          {/* Brand */}
          <div>
            <LocalizedClientLink
              href="/"
              className="text-xl font-semibold text-black hover:opacity-70"
            >
              Best Buys Ke
            </LocalizedClientLink>

            <p className="mt-6 text-sm text-black/50 leading-relaxed max-w-sm">
              Nairobi
              <br />
              Kenya
            </p>
          </div>

          {/* Links */}
          <div>
            <p className="text-sm font-medium text-black/50">Links</p>
            <ul className="mt-6 space-y-4 text-sm font-medium text-black">
              <li>
                <LocalizedClientLink href="/" className="hover:opacity-70">
                  Home
                </LocalizedClientLink>
              </li>
              <li>
                <LocalizedClientLink href="/store" className="hover:opacity-70">
                  Shop
                </LocalizedClientLink>
              </li>
              <li>
                <LocalizedClientLink href="/about" className="hover:opacity-70">
                  About
                </LocalizedClientLink>
              </li>
              <li>
                <LocalizedClientLink href="/contact" className="hover:opacity-70">
                  Contact
                </LocalizedClientLink>
              </li>
            </ul>
          </div>

          {/* Help */}
          <div>
            <p className="text-sm font-medium text-black/50">Help</p>
            <ul className="mt-6 space-y-4 text-sm font-medium text-black">
              <li>
                <LocalizedClientLink href="/payment-options" className="hover:opacity-70">
                  Payment Options
                </LocalizedClientLink>
              </li>
              <li>
                <LocalizedClientLink href="/shipping-returns" className="hover:opacity-70">
                  Returns
                </LocalizedClientLink>
              </li>
              <li>
                <LocalizedClientLink href="/privacy" className="hover:opacity-70">
                  Privacy Policies
                </LocalizedClientLink>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <p className="text-sm font-medium text-black/50">Newsletter</p>

            <form className="mt-6 flex items-center gap-3">
              <input
                type="email"
                placeholder="Enter Your Email Address"
                className="w-full border-b border-black/30 px-0 py-2 text-sm text-black placeholder:text-black/40 focus:outline-none focus:border-black"
              />
              <button
                type="submit"
                className="shrink-0 border-b border-black py-2 text-sm font-semibold text-black hover:opacity-70"
              >
                SUBSCRIBE
              </button>
            </form>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-12 border-t border-ui-border-base pt-6">
          <p className="text-sm text-black/70">
            © {new Date().getFullYear()} Best Buys Ke. All rights reserved
          </p>
        </div>
      </div>
    </footer>
  )
}


import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { Button, Heading } from "@medusajs/ui"
import {
  ArrowRight,
  Sparkles,
  ShieldCheck,
  Truck,
  RefreshCcw,
} from "lucide-react"

const Hero = () => {
  return (
    <section
      className="relative w-full border-b border-ui-border-base overflow-hidden"
      style={{ backgroundColor: "#faf6f6" }}
    >
      {/* Soft gradient + decorative blobs */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(900px 500px at 20% 30%, rgba(252, 181, 181, 0.55), transparent 60%), radial-gradient(800px 500px at 80% 20%, rgba(252, 221, 242, 0.75), transparent 55%), linear-gradient(180deg, rgba(250, 246, 246, 1), rgba(250, 246, 246, 1))",
        }}
      />

      {/* Content */}
      <div className="content-container relative z-10 py-16 small:py-24">
        <div className="grid grid-cols-1 small:grid-cols-2 gap-10 items-center">
          {/* Left */}
          <div className="flex flex-col gap-6">
            {/* Pill */}
            <div
              className="inline-flex items-center gap-2 w-fit px-3 py-1 rounded-full"
              style={{ backgroundColor: "#fcddf2", color: "#916953" }}
            >
              <Sparkles className="h-4 w-4" aria-hidden="true" />
              <span className="txt-compact-small">
                New deals added weekly • Best Buys Ke
              </span>
            </div>

            <div>
              <Heading
                level="h1"
                className="text-4xl small:text-5xl leading-tight font-normal"
                style={{ color: "#916953" }}
              >
                Premium essentials.
                <br />
                Better prices.
              </Heading>

              <p className="mt-4 text-base small:text-lg text-ui-fg-subtle max-w-xl">
                Shop curated home, lifestyle, and everyday must-haves with fast delivery
                across Kenya — and a checkout you can trust.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-col xsmall:flex-row gap-3 w-full xsmall:w-auto">
              <LocalizedClientLink href="/store">
                <Button
                  className="w-full xsmall:w-auto"
                  size="large"
                  style={{
                    backgroundColor: "#916953",
                    color: "#faf6f6",
                  }}
                >
                  Shop now
                  <ArrowRight className="h-4 w-4 ml-2" aria-hidden="true" />
                </Button>
              </LocalizedClientLink>

              <LocalizedClientLink href="/collections">
                <Button
                  variant="secondary"
                  className="w-full xsmall:w-auto"
                  size="large"
                  style={{
                    backgroundColor: "#fcddf2",
                    color: "#916953",
                    border: "1px solid rgba(145, 105, 83, 0.18)",
                  }}
                >
                  Browse collections
                </Button>
              </LocalizedClientLink>
            </div>

            {/* Trust cues */}
            <div className="mt-2 grid grid-cols-1 xsmall:grid-cols-3 gap-3">
              <div
                className="flex items-center gap-2 px-3 py-2 rounded-lg"
                style={{ backgroundColor: "rgba(252, 221, 242, 0.6)" }}
              >
                <Truck className="h-4 w-4" style={{ color: "#916953" }} />
                <span className="txt-compact-small" style={{ color: "#916953" }}>
                  Fast delivery
                </span>
              </div>

              <div
                className="flex items-center gap-2 px-3 py-2 rounded-lg"
                style={{ backgroundColor: "rgba(252, 221, 242, 0.6)" }}
              >
                <ShieldCheck className="h-4 w-4" style={{ color: "#916953" }} />
                <span className="txt-compact-small" style={{ color: "#916953" }}>
                  Secure checkout
                </span>
              </div>

              <div
                className="flex items-center gap-2 px-3 py-2 rounded-lg"
                style={{ backgroundColor: "rgba(252, 221, 242, 0.6)" }}
              >
                <RefreshCcw className="h-4 w-4" style={{ color: "#916953" }} />
                <span className="txt-compact-small" style={{ color: "#916953" }}>
                  Easy returns
                </span>
              </div>
            </div>
          </div>

          {/* Right (Premium “feature card” instead of random image) */}
          <div className="relative">
            <div
              className="rounded-2xl border p-6 small:p-8 shadow-sm"
              style={{
                backgroundColor: "rgba(250, 246, 246, 0.7)",
                borderColor: "rgba(145, 105, 83, 0.18)",
              }}
            >
              <p className="txt-small-plus" style={{ color: "#916953" }}>
                Today’s highlights
              </p>

              <div className="mt-4 grid grid-cols-1 gap-3">
                <div
                  className="rounded-xl p-4 flex items-center justify-between"
                  style={{ backgroundColor: "#fcddf2" }}
                >
                  <span style={{ color: "#916953" }} className="txt-small-plus">
                    New Arrivals
                  </span>
                  <LocalizedClientLink
                    href="/store?sort=created_at"
                    className="hover:opacity-90 inline-flex items-center gap-2"
                    style={{ color: "#916953" }}
                  >
                    View <ArrowRight className="h-4 w-4" />
                  </LocalizedClientLink>
                </div>

                <div
                  className="rounded-xl p-4 flex items-center justify-between"
                  style={{ backgroundColor: "#fcb5b5" }}
                >
                  <span style={{ color: "#916953" }} className="txt-small-plus">
                    Clearance Deals
                  </span>
                  <LocalizedClientLink
                    href="/store"
                    className="hover:opacity-90 inline-flex items-center gap-2"
                    style={{ color: "#916953" }}
                  >
                    Shop <ArrowRight className="h-4 w-4" />
                  </LocalizedClientLink>
                </div>

                <div
                  className="rounded-xl p-4 flex items-center justify-between"
                  style={{ backgroundColor: "rgba(207, 142, 128, 0.25)" }}
                >
                  <span style={{ color: "#916953" }} className="txt-small-plus">
                    Best Sellers
                  </span>
                  <LocalizedClientLink
                    href="/store"
                    className="hover:opacity-90 inline-flex items-center gap-2"
                    style={{ color: "#916953" }}
                  >
                    Explore <ArrowRight className="h-4 w-4" />
                  </LocalizedClientLink>
                </div>
              </div>

              <div
                className="mt-6 pt-5 border-t flex items-center justify-between"
                style={{ borderColor: "rgba(145, 105, 83, 0.18)" }}
              >
                <span className="txt-compact-small text-ui-fg-subtle">
                  Trusted shopping, Kenya-ready.
                </span>
                <span
                  className="txt-compact-small"
                  style={{ color: "#916953" }}
                >
                  Best Buys Ke
                </span>
              </div>
            </div>

            {/* Subtle glow */}
            <div
              className="absolute -z-10 -bottom-8 -right-8 h-40 w-40 rounded-full blur-3xl"
              style={{ backgroundColor: "rgba(252, 181, 181, 0.6)" }}
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero

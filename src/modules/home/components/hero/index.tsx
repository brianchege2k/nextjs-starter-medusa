"use client"

import { useEffect, useMemo, useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

type Slide = {
  image: string
  eyebrow: string
  title: string
  subtitle: string
  ctaLabel: string
  ctaHref: string
}

const Hero = () => {
  const slides: Slide[] = useMemo(
    () => [
      {
        image:
          "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=2400&q=80",
        eyebrow: "New arrivals",
        title: "Upgrade your home, effortlessly.",
        subtitle:
          "Discover curated essentials for comfort, style, and everyday living — delivered across Kenya.",
        ctaLabel: "Shop New In",
        ctaHref: "/store",
      },
      {
        image:
          "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=2400&q=80",
        eyebrow: "Home & Living",
        title: "Modern pieces that feel like home.",
        subtitle:
          "From statement furniture to cozy finishing touches — find what fits your space.",
        ctaLabel: "Explore Collections",
        ctaHref: "/store",
      },
      {
        image:
          "https://images.unsplash.com/photo-1556909212-d5b604d0c90d?auto=format&fit=crop&w=2400&q=80",
        eyebrow: "Kitchen picks",
        title: "Cook better with the right tools.",
        subtitle:
          "Quality appliances and kitchen essentials built for daily use and long-lasting performance.",
        ctaLabel: "Shop Kitchen",
        ctaHref: "/store",
      },
      {
        image:
          "https://images.unsplash.com/photo-1501045661006-fcebe0257c3f?auto=format&fit=crop&w=2400&q=80",
        eyebrow: "Bedroom",
        title: "Sleep spaces, elevated.",
        subtitle:
          "Refresh your room with linens, storage, and décor designed for calm and comfort.",
        ctaLabel: "Shop Bedroom",
        ctaHref: "/store",
      },
      {
        image:
          "https://images.unsplash.com/photo-1493666438817-866a91353ca9?auto=format&fit=crop&w=2400&q=80",
        eyebrow: "Storage & Organization",
        title: "A place for everything.",
        subtitle:
          "Smart storage solutions that keep your home tidy without compromising style.",
        ctaLabel: "Shop Storage",
        ctaHref: "/store",
      },
    ],
    []
  )

  const [active, setActive] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  const goTo = (index: number) => {
    const next = (index + slides.length) % slides.length
    setActive(next)
  }

  const next = () => goTo(active + 1)
  const prev = () => goTo(active - 1)

  // autoplay
  useEffect(() => {
    if (isPaused) return
    const t = setInterval(() => {
      setActive((a) => (a + 1) % slides.length)
    }, 5000)

    return () => clearInterval(t)
  }, [isPaused, slides.length])

  const slide = slides[active]

  return (
    <section
      className="relative w-full overflow-hidden bg-[#FCF8F3]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onFocusCapture={() => setIsPaused(true)}
      onBlurCapture={() => setIsPaused(false)}
      aria-roledescription="carousel"
      aria-label="Homepage promotions"
    >
      {/* Slides (fade) */}
      <div className="relative h-[520px] small:h-[620px]">
        {slides.map((s, idx) => (
          <div
            key={s.image}
            className={[
              "absolute inset-0 transition-opacity duration-700",
              idx === active ? "opacity-100" : "opacity-0",
            ].join(" ")}
            aria-hidden={idx !== active}
          >
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `url('${s.image}')`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
            {/* soft overlay for legibility */}
            <div className="absolute inset-0 bg-black/25" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-black/10 to-transparent" />
          </div>
        ))}

        {/* Content */}
        <div className="content-container relative z-10 h-full">
          <div className="flex h-full items-center justify-center px-2">
            {/* Centered CTA card */}
            <div className="w-full max-w-[720px] rounded-2xl border border-white/20 bg-white/80 p-6 shadow-lg backdrop-blur small:p-10">
              <p className="text-xs font-semibold tracking-[0.22em] text-black/70">
                {slide.eyebrow.toUpperCase()}
              </p>

              <h1 className="mt-3 text-3xl font-bold leading-tight text-black small:text-5xl">
                {slide.title}
              </h1>

              <p className="mt-4 text-sm leading-relaxed text-black/70 small:text-base">
                {slide.subtitle}
              </p>

              <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
                <LocalizedClientLink
                  href={slide.ctaHref}
                  className="inline-flex items-center justify-center rounded-full bg-[#B88E2F] px-8 py-3 text-sm font-semibold text-white hover:opacity-90"
                >
                  {slide.ctaLabel}
                </LocalizedClientLink>

                <LocalizedClientLink
                  href="/store"
                  className="inline-flex items-center justify-center rounded-full border border-black/15 bg-white/60 px-8 py-3 text-sm font-semibold text-black hover:bg-white/80"
                >
                  Browse all products
                </LocalizedClientLink>
              </div>
            </div>
          </div>
        </div>

        {/* Chevron controls */}
        <div className="pointer-events-none absolute inset-0 z-20">
          <div className="content-container relative h-full">
            <button
              type="button"
              onClick={prev}
              className="pointer-events-auto absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow-md backdrop-blur hover:bg-white"
              aria-label="Previous slide"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>

            <button
              type="button"
              onClick={next}
              className="pointer-events-auto absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 shadow-md backdrop-blur hover:bg-white"
              aria-label="Next slide"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Dots */}
        <div className="absolute bottom-5 left-0 right-0 z-20">
          <div className="flex items-center justify-center gap-2">
            {slides.map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => goTo(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                aria-current={idx === active}
                className={[
                  "h-2.5 rounded-full transition-all",
                  idx === active ? "w-8 bg-white" : "w-2.5 bg-white/60 hover:bg-white/80",
                ].join(" ")}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero

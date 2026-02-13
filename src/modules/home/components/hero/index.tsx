import LocalizedClientLink from "@modules/common/components/localized-client-link"

const Hero = () => {
  return (
    <section className="relative w-full overflow-hidden bg-[#FCF8F3]">
      {/* Background image layer */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=2400&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      {/* subtle overlay to match soft look */}
      <div className="absolute inset-0 bg-white/35" />

      <div className="content-container relative z-10 py-10 small:py-16">
        <div className="min-h-[420px] small:min-h-[520px] flex items-end small:items-center justify-center small:justify-end">
          {/* CTA Card */}
          <div className="w-full small:w-[520px] bg-[#FFF3E3] p-6 small:p-10 rounded-sm shadow-sm">
            <p className="text-xs tracking-[0.2em] font-semibold text-black/70">
              New Arrival
            </p>

            <h1 className="mt-3 text-3xl small:text-5xl leading-tight font-bold text-[#B88E2F]">
              Discover Our
              <br />
              New Collections
            </h1>

            <p className="mt-4 text-sm small:text-base text-black/70 leading-relaxed">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit
              tellus, luctus nec ullamcorper mattis.
            </p>

            <div className="mt-6">
              <LocalizedClientLink
                href="/store"
                className="inline-flex items-center justify-center bg-[#B88E2F] text-white px-8 py-3 text-sm font-semibold hover:opacity-90"
              >
                BUY NOW
              </LocalizedClientLink>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
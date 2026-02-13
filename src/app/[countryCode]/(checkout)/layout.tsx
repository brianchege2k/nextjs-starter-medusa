import Footer from "@modules/layout/templates/footer"
import Nav from "@modules/layout/templates/nav" // <-- use your real nav component path

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="w-full bg-white relative small:min-h-screen">
      {/* Use site nav */}
      <Nav />

      <div className="relative" data-testid="checkout-container">
        {children}
      </div>

      <div className="py-4 w-full flex items-center justify-center">
        <Footer />
      </div>
    </div>
  )
}
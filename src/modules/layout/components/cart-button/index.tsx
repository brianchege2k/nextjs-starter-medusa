import { retrieveCart } from "@lib/data/cart"
import CartDropdown from "../cart-dropdown"
import { ShoppingBag } from "lucide-react"

export default async function CartButton() {
  const cart = await retrieveCart().catch(() => null)

  return <CartDropdown cart={cart} />
}

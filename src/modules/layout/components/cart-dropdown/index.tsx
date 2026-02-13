"use client"

import {
  Popover,
  PopoverButton,
  PopoverPanel,
  Transition,
} from "@headlessui/react"
import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"
import { Button } from "@medusajs/ui"
import DeleteButton from "@modules/common/components/delete-button"
import LineItemOptions from "@modules/common/components/line-item-options"
import LineItemPrice from "@modules/common/components/line-item-price"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "@modules/products/components/thumbnail"
import { usePathname } from "next/navigation"
import { Fragment, useEffect, useRef, useState } from "react"
import { ShoppingCart } from "lucide-react"

const CartDropdown = ({
  cart: cartState,
  variant = "default",
}: {
  cart?: HttpTypes.StoreCart | null
  variant?: "default" | "icon"
}) => {
  const [activeTimer, setActiveTimer] = useState<NodeJS.Timer | undefined>(
    undefined
  )
  const [cartDropdownOpen, setCartDropdownOpen] = useState(false)

  const open = () => setCartDropdownOpen(true)
  const close = () => setCartDropdownOpen(false)

  const totalItems =
    cartState?.items?.reduce((acc, item) => {
      return acc + item.quantity
    }, 0) || 0

  const subtotal = cartState?.subtotal ?? 0
  const itemRef = useRef<number>(totalItems || 0)

  const timedOpen = () => {
    open()
    const timer = setTimeout(close, 5000)
    setActiveTimer(timer)
  }

  const openAndCancel = () => {
    if (activeTimer) clearTimeout(activeTimer)
    open()
  }

  useEffect(() => {
    return () => {
      if (activeTimer) clearTimeout(activeTimer)
    }
  }, [activeTimer])

  const pathname = usePathname()

  useEffect(() => {
    if (itemRef.current !== totalItems && !pathname.includes("/cart")) {
      timedOpen()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalItems, itemRef.current])

  return (
    <div
      className="h-full z-50"
      onMouseEnter={openAndCancel}
      onMouseLeave={close}
    >
      <Popover className="relative h-full">
        <PopoverButton className="h-full">
          {variant === "icon" ? (
            <LocalizedClientLink
              href="/cart"
              data-testid="nav-cart-link"
              className="relative inline-flex h-9 w-9 items-center justify-center rounded-full hover:bg-ui-bg-base-hover"
              aria-label={`Cart (${totalItems})`}
            >
              <ShoppingCart className="h-5 w-5 text-black" aria-hidden="true" />

              {/* Badge */}
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-[#B88E2F] text-white text-[11px] leading-[18px] text-center font-semibold">
                  {totalItems}
                </span>
              )}
            </LocalizedClientLink>
          ) : (
            // fallback to your older style if needed anywhere else
            <LocalizedClientLink
              href="/cart"
              data-testid="nav-cart-link"
              className="h-full inline-flex items-center gap-2 px-3 rounded-md transition hover:opacity-90"
              style={{ color: "#916953" }}
            >
              <ShoppingCart className="h-4 w-4" aria-hidden="true" />
              <span className="hidden small:inline">{`Cart`}</span>
              <span
                className="ml-1 inline-flex items-center justify-center min-w-[22px] h-[22px] px-2 rounded-full text-[12px] leading-none"
                style={{
                  backgroundColor: "#fcddf2",
                  color: "#916953",
                }}
                aria-label={`Cart items: ${totalItems}`}
              >
                {totalItems}
              </span>
            </LocalizedClientLink>
          )}
        </PopoverButton>

        <Transition
          show={cartDropdownOpen}
          as={Fragment}
          enter="transition ease-out duration-200"
          enterFrom="opacity-0 translate-y-1"
          enterTo="opacity-100 translate-y-0"
          leave="transition ease-in duration-150"
          leaveFrom="opacity-100 translate-y-0"
          leaveTo="opacity-0 translate-y-1"
        >
          <PopoverPanel
            static
            className="hidden small:block absolute top-[calc(100%+1px)] right-0 w-[420px] border border-ui-border-base bg-white text-ui-fg-base shadow-lg"
            data-testid="nav-cart-dropdown"
          >
            <div className="p-4 flex items-center justify-center border-b border-ui-border-base">
              <h3 className="text-large-semi text-black">Cart</h3>
            </div>

            {cartState && cartState.items?.length ? (
              <>
                <div className="overflow-y-scroll max-h-[402px] px-4 grid grid-cols-1 gap-y-8 no-scrollbar p-px">
                  {cartState.items
                    .sort((a, b) => {
                      return (a.created_at ?? "") > (b.created_at ?? "")
                        ? -1
                        : 1
                    })
                    .map((item) => (
                      <div
                        className="grid grid-cols-[122px_1fr] gap-x-4"
                        key={item.id}
                        data-testid="cart-item"
                      >
                        <LocalizedClientLink
                          href={`/products/${item.product_handle}`}
                          className="w-24"
                        >
                          <Thumbnail
                            thumbnail={item.thumbnail}
                            images={item.variant?.product?.images}
                            size="square"
                          />
                        </LocalizedClientLink>

                        <div className="flex flex-col justify-between flex-1">
                          <div className="flex flex-col flex-1">
                            <div className="flex items-start justify-between">
                              <div className="flex flex-col overflow-ellipsis whitespace-nowrap mr-4 w-[180px]">
                                <h3 className="text-base-regular overflow-hidden text-ellipsis text-black">
                                  <LocalizedClientLink
                                    href={`/products/${item.product_handle}`}
                                    data-testid="product-link"
                                    className="hover:opacity-70"
                                  >
                                    {item.title}
                                  </LocalizedClientLink>
                                </h3>

                                <LineItemOptions
                                  variant={item.variant}
                                  data-testid="cart-item-variant"
                                  data-value={item.variant}
                                />

                                <span
                                  data-testid="cart-item-quantity"
                                  data-value={item.quantity}
                                  className="text-ui-fg-subtle"
                                >
                                  Quantity: {item.quantity}
                                </span>
                              </div>

                              <div className="flex justify-end">
                                <LineItemPrice
                                  item={item}
                                  style="tight"
                                  currencyCode={cartState.currency_code}
                                />
                              </div>
                            </div>
                          </div>

                          <DeleteButton
                            id={item.id}
                            className="mt-1"
                            data-testid="cart-item-remove-button"
                          >
                            Remove
                          </DeleteButton>
                        </div>
                      </div>
                    ))}
                </div>

                <div className="p-4 flex flex-col gap-y-4 text-small-regular border-t border-ui-border-base">
                  <div className="flex items-center justify-between">
                    <span className="text-black font-semibold">
                      Subtotal <span className="font-normal">(excl. taxes)</span>
                    </span>

                    <span
                      className="text-large-semi text-black"
                      data-testid="cart-subtotal"
                      data-value={subtotal}
                    >
                      {convertToLocale({
                        amount: subtotal,
                        currency_code: cartState.currency_code,
                      })}
                    </span>
                  </div>

                  <LocalizedClientLink href="/cart" passHref>
                    <Button
                      className="w-full"
                      size="large"
                      data-testid="go-to-cart-button"
                      style={{
                        backgroundColor: "#B88E2F",
                        color: "white",
                      }}
                    >
                      Go to cart
                    </Button>
                  </LocalizedClientLink>
                </div>
              </>
            ) : (
              <div className="flex py-16 flex-col gap-y-4 items-center justify-center">
                <div className="text-small-regular flex items-center justify-center w-9 h-9 rounded-full bg-[#FFF3E3] text-black">
                  <span className="font-semibold">0</span>
                </div>

                <span className="text-ui-fg-subtle">Your shopping bag is empty.</span>

                <LocalizedClientLink href="/store">
                  <>
                    <span className="sr-only">Go to all products page</span>
                    <Button
                      onClick={close}
                      style={{
                        backgroundColor: "#B88E2F",
                        color: "white",
                      }}
                    >
                      Explore products
                    </Button>
                  </>
                </LocalizedClientLink>
              </div>
            )}
          </PopoverPanel>
        </Transition>
      </Popover>
    </div>
  )
}

export default CartDropdown
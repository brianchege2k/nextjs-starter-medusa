"use client"

import { Popover, PopoverPanel, Transition } from "@headlessui/react"
import { Text, clx, useToggleState } from "@medusajs/ui"
import { Fragment } from "react"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CountrySelect from "../country-select"
import LanguageSelect from "../language-select"
import { HttpTypes } from "@medusajs/types"
import { Locale } from "@lib/data/locales"

import { Menu, X, ChevronRight } from "lucide-react"

const SideMenuItems = [
  { name: "Home", href: "/" },
  { name: "Shop", href: "/store" },
  { name: "Account", href: "/account" },
  { name: "Cart", href: "/cart" },
]

type SideMenuProps = {
  regions: HttpTypes.StoreRegion[] | null
  locales: Locale[] | null
  currentLocale: string | null
}

const SideMenu = ({ regions, locales, currentLocale }: SideMenuProps) => {
  const countryToggleState = useToggleState()
  const languageToggleState = useToggleState()

  return (
    <div className="h-full flex items-center">
      <Popover className="h-full flex">
        {({ open, close }) => (
          <>
            {/* Trigger (hamburger) */}
            <div className="relative flex h-full items-center">
              <Popover.Button
                data-testid="nav-menu-button"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full hover:bg-ui-bg-base-hover focus:outline-none"
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5 text-black" aria-hidden="true" />
              </Popover.Button>
            </div>

            {/* Backdrop */}
            {open && (
              <div
                className="fixed inset-0 z-[50] bg-black/30"
                onClick={close}
                data-testid="side-menu-backdrop"
              />
            )}

            <Transition
              show={open}
              as={Fragment}
              enter="transition ease-out duration-200"
              enterFrom="opacity-0 translate-x-2"
              enterTo="opacity-100 translate-x-0"
              leave="transition ease-in duration-150"
              leaveFrom="opacity-100 translate-x-0"
              leaveTo="opacity-0 translate-x-2"
            >
              <PopoverPanel className="fixed z-[51] inset-y-0 left-0 w-[88%] max-w-sm">
                <div
                  data-testid="nav-menu-popup"
                  className="flex h-full flex-col bg-white shadow-xl"
                >
                  {/* Header */}
                  <div className="flex items-center justify-between px-5 h-16 border-b border-ui-border-base">
                    <LocalizedClientLink
                      href="/"
                      onClick={close}
                      className="flex items-center gap-2"
                    >
                      <span className="inline-flex h-7 w-7 items-center justify-center rounded-md bg-[#B88E2F] text-white text-xs font-semibold">
                        BB
                      </span>
                      <span className="text-base font-semibold text-black">
                        Best Buys Ke
                      </span>
                    </LocalizedClientLink>

                    <button
                      data-testid="close-menu-button"
                      onClick={close}
                      aria-label="Close menu"
                      className="inline-flex h-9 w-9 items-center justify-center rounded-full hover:bg-ui-bg-base-hover"
                    >
                      <X className="h-5 w-5 text-black" aria-hidden="true" />
                    </button>
                  </div>

                  {/* Links */}
                  <div className="px-5 py-6">
                    <ul className="flex flex-col">
                      {SideMenuItems.map((item) => (
                        <li key={item.name} className="border-b border-ui-border-base">
                          <LocalizedClientLink
                            href={item.href}
                            onClick={close}
                            data-testid={`${item.name.toLowerCase()}-link`}
                            className="flex items-center justify-between py-4 text-[15px] font-medium text-black hover:opacity-70"
                          >
                            {item.name}
                            <ChevronRight className="h-4 w-4 text-black/60" />
                          </LocalizedClientLink>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Locale + Region (bottom) */}
                  <div className="mt-auto border-t border-ui-border-base px-5 py-5 space-y-3">
                    {!!locales?.length && (
                      <div
                        className="flex items-center justify-between rounded-md px-3 py-3 hover:bg-ui-bg-base-hover"
                        onMouseEnter={languageToggleState.open}
                        onMouseLeave={languageToggleState.close}
                      >
                        <LanguageSelect
                          toggleState={languageToggleState}
                          locales={locales}
                          currentLocale={currentLocale}
                        />
                        <ChevronRight
                          className={clx(
                            "h-4 w-4 text-black/60 transition-transform duration-150",
                            languageToggleState.state ? "-rotate-90" : ""
                          )}
                        />
                      </div>
                    )}

                    <div
                      className="flex items-center justify-between rounded-md px-3 py-3 hover:bg-ui-bg-base-hover"
                      onMouseEnter={countryToggleState.open}
                      onMouseLeave={countryToggleState.close}
                    >
                      {regions && (
                        <CountrySelect toggleState={countryToggleState} regions={regions} />
                      )}
                      <ChevronRight
                        className={clx(
                          "h-4 w-4 text-black/60 transition-transform duration-150",
                          countryToggleState.state ? "-rotate-90" : ""
                        )}
                      />
                    </div>

                    <Text className="txt-compact-small text-black/50 pt-2">
                      © {new Date().getFullYear()} Best Buys Ke. All rights reserved.
                    </Text>
                  </div>
                </div>
              </PopoverPanel>
            </Transition>
          </>
        )}
      </Popover>
    </div>
  )
}

export default SideMenu
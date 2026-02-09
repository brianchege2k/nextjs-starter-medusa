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

const SideMenuItems = {
  Home: "/",
  Store: "/store",
  Account: "/account",
  Cart: "/cart",
}

type SideMenuProps = {
  regions: HttpTypes.StoreRegion[] | null
  locales: Locale[] | null
  currentLocale: string | null
}

const SideMenu = ({ regions, locales, currentLocale }: SideMenuProps) => {
  const countryToggleState = useToggleState()
  const languageToggleState = useToggleState()

  return (
    <div className="h-full">
      <div className="flex items-center h-full">
        <Popover className="h-full flex">
          {({ open, close }) => (
            <>
              <div className="relative flex h-full">
                <Popover.Button
                  data-testid="nav-menu-button"
                  className="relative h-full inline-flex items-center gap-2 px-3 rounded-md transition focus:outline-none hover:opacity-90"
                  style={{ color: "#916953" }}
                  aria-label="Open menu"
                >
                  <Menu className="h-5 w-5" aria-hidden="true" />
                  <span className="hidden small:inline">Menu</span>
                </Popover.Button>
              </div>

              {open && (
                <div
                  className="fixed inset-0 z-[50] pointer-events-auto"
                  onClick={close}
                  data-testid="side-menu-backdrop"
                  style={{
                    background: "rgba(145, 105, 83, 0.18)", // subtle tinted overlay
                    backdropFilter: "blur(6px)",
                  }}
                />
              )}

              <Transition
                show={open}
                as={Fragment}
                enter="transition ease-out duration-150"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="transition ease-in duration-150"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <PopoverPanel className="flex flex-col absolute w-full pr-4 sm:pr-0 sm:w-1/3 2xl:w-1/4 sm:min-w-min h-[calc(100vh-1rem)] z-[51] inset-x-0 text-sm m-2">
                  <div
                    data-testid="nav-menu-popup"
                    className="flex flex-col h-full rounded-rounded justify-between p-6 border shadow-sm"
                    style={{
                      backgroundColor: "#faf6f6",
                      borderColor: "rgba(145, 105, 83, 0.18)",
                    }}
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between">
                      <LocalizedClientLink
                        href="/"
                        onClick={close}
                        className="txt-compact-large-plus uppercase hover:opacity-90"
                        style={{ color: "#916953" }}
                      >
                        Best Buys Ke
                      </LocalizedClientLink>

                      <button
                        data-testid="close-menu-button"
                        onClick={close}
                        aria-label="Close menu"
                        className="p-2 rounded-full transition hover:opacity-90"
                        style={{ backgroundColor: "#fcddf2", color: "#916953" }}
                      >
                        <X className="h-5 w-5" aria-hidden="true" />
                      </button>
                    </div>

                    {/* Links */}
                    <ul className="flex flex-col gap-4 items-start justify-start mt-8">
                      {Object.entries(SideMenuItems).map(([name, href]) => (
                        <li key={name} className="w-full">
                          <LocalizedClientLink
                            href={href}
                            onClick={close}
                            data-testid={`${name.toLowerCase()}-link`}
                            className="w-full flex items-center justify-between rounded-lg px-3 py-3 transition hover:opacity-90"
                            style={{
                              backgroundColor: "#fcddf2",
                              color: "#916953",
                            }}
                          >
                            <span className="text-xl leading-8">{name}</span>
                            <ChevronRight className="h-5 w-5" aria-hidden="true" />
                          </LocalizedClientLink>
                        </li>
                      ))}
                    </ul>

                    {/* Locale + Region */}
                    <div className="flex flex-col gap-y-6 mt-10">
                      {!!locales?.length && (
                        <div
                          className="flex items-center justify-between rounded-lg px-3 py-3"
                          style={{ backgroundColor: "#faf6f6" }}
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
                              "h-5 w-5 transition-transform duration-150",
                              languageToggleState.state ? "-rotate-90" : ""
                            )}
                            style={{ color: "#916953" }}
                          />
                        </div>
                      )}

                      <div
                        className="flex items-center justify-between rounded-lg px-3 py-3"
                        style={{ backgroundColor: "#faf6f6" }}
                        onMouseEnter={countryToggleState.open}
                        onMouseLeave={countryToggleState.close}
                      >
                        {regions && (
                          <CountrySelect
                            toggleState={countryToggleState}
                            regions={regions}
                          />
                        )}
                        <ChevronRight
                          className={clx(
                            "h-5 w-5 transition-transform duration-150",
                            countryToggleState.state ? "-rotate-90" : ""
                          )}
                          style={{ color: "#916953" }}
                        />
                      </div>

                      <Text
                        className="flex justify-between txt-compact-small pt-4 border-t"
                        style={{
                          color: "#916953",
                          borderColor: "rgba(145, 105, 83, 0.18)",
                        }}
                      >
                        © {new Date().getFullYear()} Best Buys Ke. All rights
                        reserved.
                      </Text>
                    </div>
                  </div>
                </PopoverPanel>
              </Transition>
            </>
          )}
        </Popover>
      </div>
    </div>
  )
}

export default SideMenu

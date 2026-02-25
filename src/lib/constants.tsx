import React from "react"
import { CreditCard } from "@medusajs/icons"

import Ideal from "@modules/common/icons/ideal"
import Bancontact from "@modules/common/icons/bancontact"
import PayPal from "@modules/common/icons/paypal"

/* Map of payment provider_id to their title and icon. Add in any payment providers you want to use. */
export const paymentInfoMap: Record<
  string,
  { title: string; icon: React.JSX.Element }
> = {
  pp_stripe_stripe: {
    title: "Credit card",
    icon: <CreditCard />,
  },
  "pp_medusa-payments_default": {
    title: "Credit card",
    icon: <CreditCard />,
  },
  "pp_stripe-ideal_stripe": {
    title: "iDeal",
    icon: <Ideal />,
  },
  "pp_stripe-bancontact_stripe": {
    title: "Bancontact",
    icon: <Bancontact />,
  },
  pp_paypal_paypal: {
    title: "PayPal",
    icon: <PayPal />,
  },
  pp_system_default: {
    title: "Manual Payment",
    icon: <CreditCard />,
  },
  // ADD M-PESA HERE:
  // Catch both potential ID formats Medusa V2 might generate for your provider
  pp_mpesa_mpesa: {
    title: "M-Pesa Express",
    icon: <CreditCard />, // You can swap this for a custom green M-Pesa icon later
  },
  mpesa: {
    title: "M-Pesa Express",
    icon: <CreditCard />,
  }
}

// Existing helpers...
export const isStripeLike = (providerId?: string) => {
  return (
    providerId?.startsWith("pp_stripe_") || providerId?.startsWith("pp_medusa-")
  )
}

export const isPaypal = (providerId?: string) => {
  return providerId?.startsWith("pp_paypal")
}

export const isManual = (providerId?: string) => {
  return providerId?.startsWith("pp_system_default")
}

// ADD THE M-PESA HELPER:
export const isMpesa = (providerId?: string) => {
  return providerId?.includes("mpesa")
}

// Add currencies that don't need to be divided by 100
export const noDivisionCurrencies = [
  "krw", "jpy", "vnd", "clp", "pyg", "xaf", "xof", "bif", "djf", "gnf",
  "kmf", "mga", "rwf", "xpf", "htg", "vuv", "xag", "xdr", "xau",
]
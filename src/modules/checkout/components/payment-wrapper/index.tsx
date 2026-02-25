"use client"

import { loadStripe } from "@stripe/stripe-js"
import React from "react"
import StripeWrapper from "./stripe-wrapper"
import { HttpTypes } from "@medusajs/types"
import { isStripeLike } from "@lib/constants"

// 1. Import your new M-Pesa component
import MpesaPayment from "../mpesa-payment" 

type PaymentWrapperProps = {
  cart: HttpTypes.StoreCart
  children: React.ReactNode
}

const stripeKey =
  process.env.NEXT_PUBLIC_STRIPE_KEY ||
  process.env.NEXT_PUBLIC_MEDUSA_PAYMENTS_PUBLISHABLE_KEY

const medusaAccountId = process.env.NEXT_PUBLIC_MEDUSA_PAYMENTS_ACCOUNT_ID
const stripePromise = stripeKey
  ? loadStripe(
      stripeKey,
      medusaAccountId ? { stripeAccount: medusaAccountId } : undefined
    )
  : null

const PaymentWrapper: React.FC<PaymentWrapperProps> = ({ cart, children }) => {
  const paymentSession = cart.payment_collection?.payment_sessions?.find(
    (s) => s.status === "pending"
  )

  if (
    isStripeLike(paymentSession?.provider_id) &&
    paymentSession &&
    stripePromise
  ) {
    return (
      <StripeWrapper
        paymentSession={paymentSession}
        stripeKey={stripeKey}
        stripePromise={stripePromise}
      >
        {children}
      </StripeWrapper>
    )
  }

  // 2. Add the check for M-Pesa
  if (paymentSession?.provider_id === "mpesa") {
    return (
      <div className="flex flex-col gap-4">
        {/* Render your M-Pesa UI and pass the necessary cart details */}
        <MpesaPayment 
          cartId={cart.id} 
          amount={cart.total || 0} 
        />
        {/* Notice we are NOT rendering {children} here. 
          {children} contains the default Medusa "Place Order" button. 
          Because your MpesaPayment component has its own "Send STK Push" button, 
          omitting {children} prevents confusing the user with two submit buttons.
        */}
      </div>
    )
  }

  // Fallback for manual or other payment methods
  return <div>{children}</div>
}

export default PaymentWrapper
"use client"

import { isManual, isStripeLike, isMpesa } from "@lib/constants"
import { HttpTypes } from "@medusajs/types"
import { Button } from "@medusajs/ui"
import React from "react"
import MpesaPaymentButton from "./mpesa-payment-button"

type PaymentButtonProps = {
  cart: HttpTypes.StoreCart
  "data-testid": string
}

const PaymentButton: React.FC<PaymentButtonProps> = ({
  cart,
  "data-testid": dataTestId,
}) => {
  const notReady =
    !cart ||
    !cart.shipping_address ||
    !cart.billing_address ||
    !cart.email ||
    (cart.shipping_methods?.length ?? 0) < 1

  const paymentSession = cart.payment_collection?.payment_sessions?.[0]

  switch (true) {
    case isStripeLike(paymentSession?.provider_id):
      return (
        <StripePaymentButton
          notReady={notReady}
          cart={cart}
          data-testid={dataTestId}
        />
      )
    case isManual(paymentSession?.provider_id):
      return (
        <ManualTestPaymentButton notReady={notReady} data-testid={dataTestId} />
      )
    case isMpesa(paymentSession?.provider_id):
      return (
        <MpesaPaymentButton 
          notReady={notReady} 
          cart={cart} 
          data-testid={dataTestId} 
        />
      )
    default:
      return <Button disabled>Select a payment method</Button>
  }
}

const StripePaymentButton = ({ cart, notReady, "data-testid": dataTestId }: any) => {
  return (
    <Button 
      disabled={notReady} 
      data-testid={dataTestId}
      className="w-full"
    >
      Place order (Stripe)
    </Button>
  )
}

const ManualTestPaymentButton = ({ notReady, "data-testid": dataTestId }: any) => {
  return (
    <Button 
      disabled={notReady} 
      data-testid={dataTestId}
      className="w-full"
    >
      Place order (Manual)
    </Button>
  )
}

export default PaymentButton
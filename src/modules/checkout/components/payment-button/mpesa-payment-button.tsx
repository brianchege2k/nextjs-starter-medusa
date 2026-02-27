"use client"

import { useState, useEffect } from "react"
import { Button, Input } from "@medusajs/ui"
import { HttpTypes } from "@medusajs/types"
import ErrorMessage from "../error-message"

type MpesaPaymentButtonProps = {
  cart: HttpTypes.StoreCart
  notReady: boolean
  "data-testid"?: string
}

const MpesaPaymentButton = ({ cart, notReady, "data-testid": dataTestId }: MpesaPaymentButtonProps) => {
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [phone, setPhone] = useState("")
  const [isWaitingForPin, setIsWaitingForPin] = useState(false)

  const handlePayment = async () => {
    if (!phone || phone.length < 9) {
      setErrorMessage("Please enter a valid Safaricom number.")
      return
    }

    setSubmitting(true)
    setErrorMessage(null)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/mpesa/stk-push`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || ""
        },
        body: JSON.stringify({ phone, amount: cart.total, cart_id: cart.id })
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.message || "Failed to initiate M-Pesa push.")
      
      setIsWaitingForPin(true)
    } catch (err: any) {
      setErrorMessage(err.message)
      setSubmitting(false)
    }
  }

  useEffect(() => {
    let pollingInterval: NodeJS.Timeout

    if (isWaitingForPin) {
      pollingInterval = setInterval(async () => {
        try {
          // BULLETPROOF CHECK: Instead of checking the cart, we search for the created ORDER.
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/orders?cart_id=${cart.id}&t=${Date.now()}`,
            {
              headers: { "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "" },
              cache: "no-store", 
            }
          )

          if (res.ok) {
            const data = await res.json()
            // If the webhook completed the cart, an order will exist in this array!
            if (data.orders && data.orders.length > 0) {
              clearInterval(pollingInterval)
              const orderId = data.orders[0].id
              const countryCode = cart.shipping_address?.country_code?.toLowerCase() || "ke"
              
              // Redirect using the REAL Order ID, matching your folder structure
              window.location.href = `/${countryCode}/order/${orderId}/confirmed`
            }
          }
        } catch (error) {
          console.error("Polling error:", error)
        }
      }, 3000)
    }

    return () => clearInterval(pollingInterval)
  }, [isWaitingForPin, cart.id, cart.shipping_address?.country_code])

  return (
    <div className="flex flex-col gap-4 w-full mt-4">
      {isWaitingForPin ? (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-center">
          <p className="font-semibold text-blue-800">Check your phone!</p>
          <p className="text-sm text-blue-600 mt-1">We sent an M-Pesa prompt to <strong>{phone}</strong>.</p>
          <div className="mt-4 flex justify-center">
            <span className="animate-spin h-6 w-6 border-2 border-blue-600 border-t-transparent rounded-full"></span>
          </div>
        </div>
      ) : (
        <>
          <Input id="mpesa-phone" placeholder="e.g. 254712345678" value={phone} onChange={(e) => setPhone(e.target.value)} type="tel" required />
          <Button disabled={notReady || !phone || submitting} onClick={handlePayment} size="large" isLoading={submitting} data-testid={dataTestId}>
            Pay with M-Pesa
          </Button>
          <ErrorMessage error={errorMessage} data-testid="mpesa-payment-error-message" />
        </>
      )}
    </div>
  )
}

export default MpesaPaymentButton
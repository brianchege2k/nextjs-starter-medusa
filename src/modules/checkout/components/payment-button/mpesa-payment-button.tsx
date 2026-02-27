"use client"

import { useState, useEffect } from "react"
import { Button, Input } from "@medusajs/ui"
import { HttpTypes } from "@medusajs/types"
import { placeOrder } from "@lib/data/cart" 
import ErrorMessage from "../error-message"

// 1. HARDCODE FALLBACK FOR SAFETY
const PUB_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "pk_f825457ec04612c122d1ced7d459990af074a9c2ea3f3470074c93f75543cfd4"

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
          // Use our reliable key variable here
          "x-publishable-api-key": PUB_KEY 
        },
        body: JSON.stringify({ phone, amount: cart.total, cart_id: cart.id })
      })

      if (!response.ok) throw new Error("Failed to initiate M-Pesa push.")
      
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
const res = await fetch(
  `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/carts/${cart.id}`,
  {
    headers: { 
      "x-publishable-api-key": PUB_KEY,
      "Cache-Control": "no-cache, no-store, must-revalidate", // Add these standard headers instead
      "Pragma": "no-cache"
    },
    cache: "no-store", 
  }
)

          if (res.ok) {
            const data = await res.json()
            const session = data.cart?.payment_collection?.payment_sessions?.find(
              (s: any) => s.provider_id === "mpesa"
            )

            if (session?.data?.auth_success === true) {
              clearInterval(pollingInterval)
              console.log("✅ Webhook confirmed payment! Triggering native Medusa placeOrder...")
              
              await placeOrder() 
            }
          }
        } catch (error) {
          console.error("Polling error:", error)
        }
      }, 3000)
    }

    return () => clearInterval(pollingInterval)
  }, [isWaitingForPin, cart.id])

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
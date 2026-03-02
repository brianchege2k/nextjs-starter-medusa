"use client"

import { useState, useEffect } from "react"
import { Button, Input } from "@medusajs/ui"
import { HttpTypes } from "@medusajs/types"
import { placeOrder } from "@lib/data/cart" 
import ErrorMessage from "../error-message"

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
    let timeoutId: NodeJS.Timeout

    if (isWaitingForPin) {
      // 1. Timeout Fallback: Stop polling after 60 seconds
      timeoutId = setTimeout(() => {
        clearInterval(pollingInterval)
        setIsWaitingForPin(false)
        setSubmitting(false)
        setErrorMessage("Payment request timed out. Please try again.")
      }, 60000)

      pollingInterval = setInterval(async () => {
        try {
          // FIX: Removed the invalid `fields` parameter. The default cart response already includes payment sessions!
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/carts/${cart.id}?t=${Date.now()}`,
            {
              headers: { 
                "x-publishable-api-key": PUB_KEY,
                "Cache-Control": "no-cache, no-store, must-revalidate",
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
              // ✅ SUCCESS
              clearInterval(pollingInterval)
              clearTimeout(timeoutId)
              console.log("✅ Webhook confirmed payment! Triggering native Medusa placeOrder...")
              
              await placeOrder() 
            } else if (session?.data?.auth_success === false) {
              // ❌ FAILURE (User cancelled, wrong PIN, etc.)
              clearInterval(pollingInterval)
              clearTimeout(timeoutId)
              console.log("❌ Webhook reported payment failure.")
              
              setErrorMessage(session.data.mpesa_error as string || "Payment failed or was cancelled.")
              setIsWaitingForPin(false)
              setSubmitting(false)
            }
          } else {
             // Let's log actual Medusa API errors to the console if it fails again
             const errorData = await res.json()
             console.error("Medusa API Error:", errorData)
          }
        } catch (error: any) {
          // Prevent Next.js Redirect Swallowing
          if (error?.message === 'NEXT_REDIRECT' || error?.digest?.startsWith('NEXT_REDIRECT')) {
            throw error; 
          }
          console.error("Polling error:", error)
        }
      }, 3000)
    }

    return () => {
      clearInterval(pollingInterval)
      clearTimeout(timeoutId)
    }
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
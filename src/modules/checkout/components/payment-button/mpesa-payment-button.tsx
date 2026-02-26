"use client"

import { useState, useEffect } from "react"
import { Button, Input } from "@medusajs/ui"
import { HttpTypes } from "@medusajs/types"
import { useRouter } from "next/navigation"
import { retrieveCart } from "@lib/data/cart" // Keep this for polling
import ErrorMessage from "../error-message"

type MpesaPaymentButtonProps = {
  cart: HttpTypes.StoreCart
  notReady: boolean
  "data-testid"?: string
}

const MpesaPaymentButton = ({
  cart,
  notReady,
  "data-testid": dataTestId,
}: MpesaPaymentButtonProps) => {
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [phone, setPhone] = useState("")
  const [isWaitingForPin, setIsWaitingForPin] = useState(false)
  const router = useRouter()

  const handlePayment = async () => {
    if (!phone || phone.length < 9) {
      setErrorMessage("Please enter a valid Safaricom number.")
      return
    }

    setSubmitting(true)
    setErrorMessage(null)

    try {
      // 1. Call your CUSTOM STK Push endpoint
      const response = await fetch(`${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/mpesa/stk-push`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Include the publishable key if your backend requires it
          "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || ""
        },
        body: JSON.stringify({
          phone: phone,
          amount: cart.total, // Medusa total is in cents (e.g. 1000 = 10 KES)
          cart_id: cart.id
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to initiate M-Pesa push.")
      }

      // 2. Transition to waiting state
      setIsWaitingForPin(true)
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to initiate M-Pesa payment.")
      setSubmitting(false)
    }
  }

  // 3. Poll Medusa to see if the Webhook has converted the cart to an order
useEffect(() => {
  let pollingInterval: NodeJS.Timeout

  if (isWaitingForPin) {
    pollingInterval = setInterval(async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/carts/${cart.id}`,
          {
            headers: {
              // 1. THIS KEY IS THE KEY TO THE REDIRECT
              "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "",
              "Content-Type": "application/json",
            },
            cache: "no-store", 
          }
        )

        // 2. If the cart is found, check if the webhook completed it
        if (res.ok) {
          const data = await res.json()
          if (data.cart?.completed_at) {
            handleSuccess(data.cart.id)
          }
        } 
        
        // 3. If we get a 400/404, it means the cart was turned into an order
        else if (res.status === 400 || res.status === 404) {
          handleSuccess(cart.id)
        }
      } catch (error) {
        console.error("Polling error:", error)
      }
    }, 3000)
  }

  const handleSuccess = (id: string) => {
    clearInterval(pollingInterval)
    const countryCode = cart.shipping_address?.country_code?.toLowerCase() || "ke"
    // Use window.location.href to force a clean load of the confirmation page
    window.location.href = `/${countryCode}/order/confirmed/${id}`
  }

  return () => clearInterval(pollingInterval)
}, [isWaitingForPin, cart.id, cart.shipping_address?.country_code])

  return (
    <div className="flex flex-col gap-4 w-full mt-4">
      {isWaitingForPin ? (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-center">
          <p className="font-semibold text-blue-800">Check your phone!</p>
          <p className="text-sm text-blue-600 mt-1">
            We sent an M-Pesa prompt to <strong>{phone}</strong>. Enter your PIN to complete the order.
          </p>
          <div className="mt-4 flex justify-center">
            {/* Simple CSS loading spinner */}
            <span className="animate-spin h-6 w-6 border-2 border-blue-600 border-t-transparent rounded-full"></span>
          </div>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-2">
            <Input
              id="mpesa-phone"
              placeholder="e.g. 254712345678"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              type="tel"
              required
            />
          </div>

          <Button
            disabled={notReady || !phone || submitting}
            onClick={handlePayment}
            size="large"
            isLoading={submitting}
            data-testid={dataTestId}
          >
            Pay with M-Pesa
          </Button>

          <ErrorMessage
            error={errorMessage}
            data-testid="mpesa-payment-error-message"
          />
        </>
      )}
    </div>
  )
}

export default MpesaPaymentButton
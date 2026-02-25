"use client"

import { useState, useEffect } from "react"
import { Button, Input } from "@medusajs/ui"
import { HttpTypes } from "@medusajs/types"
import { useRouter } from "next/navigation"
import { placeOrder, updatePaymentSessionData, retrieveCart } from "@lib/data/cart"
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
      // 1. Update the payment session with the phone number via the server action
      await updatePaymentSessionData(cart.id, "mpesa", { phone_number: phone })

      // 2. Trigger the STK push by attempting to place the order
      // This will call the authorizePayment method on your Medusa backend
      await placeOrder()

      // 3. The backend returns REQUIRES_MORE for M-Pesa, so the order isn't complete yet.
      // Transition the UI to the waiting/polling state.
      setIsWaitingForPin(true)
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to initiate M-Pesa payment.")
      setSubmitting(false)
    }
  }

  // 4. Poll Medusa to see if the Daraja webhook has completed the order
  useEffect(() => {
    let pollingInterval: NodeJS.Timeout

    if (isWaitingForPin) {
      pollingInterval = setInterval(async () => {
        try {
          // Use the existing retrieveCart server action to check the cart status
          const updatedCart = await retrieveCart(cart.id)
          
          if (updatedCart && updatedCart.completed_at) {
            // Webhook was successful and Medusa completed the cart!
            clearInterval(pollingInterval)
            
            const countryCode = cart.shipping_address?.country_code?.toLowerCase() || "us"
            
            // Redirect to the order confirmation page
            // Note: Depending on your exact v2 setup, the order ID might be different from the cart ID.
            // If your starter routes differently, update this path.
            router.push(`/${countryCode}/order/${cart.id}/confirmed`)
          }
        } catch (error) {
          console.error("Polling error:", error)
        }
      }, 3000) // Poll every 3 seconds
    }

    return () => clearInterval(pollingInterval)
  }, [isWaitingForPin, cart.id, router, cart.shipping_address?.country_code])

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
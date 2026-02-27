"use client"

import { useState, useEffect } from "react"
import { Button, Input } from "@medusajs/ui"
import { HttpTypes } from "@medusajs/types"
import { useRouter } from "next/navigation"
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
      const response = await fetch(`${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/mpesa/stk-push`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || ""
        },
        body: JSON.stringify({
          phone: phone,
          amount: cart.total,
          cart_id: cart.id
        })
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Failed to initiate M-Pesa push.")
      }

      setIsWaitingForPin(true)
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to initiate M-Pesa payment.")
      setSubmitting(false)
    }
  }

  useEffect(() => {
    let pollingInterval: NodeJS.Timeout

    if (isWaitingForPin) {
      console.log("🔄 [M-Pesa] Polling started for cart:", cart.id)

      pollingInterval = setInterval(async () => {
        try {
          // Added timestamp (?t=) to bypass browser caching
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/carts/${cart.id}?t=${Date.now()}`,
            {
              headers: {
                "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "",
                "Content-Type": "application/json",
              },
              cache: "no-store", 
            }
          )

          console.log(`📡 [M-Pesa] Poll status: ${res.status}`)

          if (res.ok) {
            const data = await res.json()
            if (data.cart?.completed_at) {
              console.log("✅ [M-Pesa] Cart completion detected.")
              handleSuccess(cart.id)
            }
          } 
          // If cart is missing (404) it usually means it was converted to an order
          else if (res.status === 400 || res.status === 404) {
            console.log("🎊 [M-Pesa] Cart converted to order. Redirecting...")
            handleSuccess(cart.id)
          }
        } catch (error) {
          console.error("❌ [M-Pesa] Polling error:", error)
        }
      }, 3000)
    }

    return () => {
      if (pollingInterval) clearInterval(pollingInterval)
    }
  }, [isWaitingForPin, cart.id, cart.shipping_address?.country_code])

  const handleSuccess = (id: string) => {
    const countryCode = cart.shipping_address?.country_code?.toLowerCase() || "ke"
    console.log(`🚀 [M-Pesa] Redirecting to: /${countryCode}/order/${id}/confirmed`)
    
    // Using window.location.href to ensure a clean state load
    window.location.href = `/${countryCode}/order/${id}/confirmed`
  }

  return (
    <div className="flex flex-col gap-4 w-full mt-4">
      {isWaitingForPin ? (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-center">
          <p className="font-semibold text-blue-800">Check your phone!</p>
          <p className="text-sm text-blue-600 mt-1">
            We sent an M-Pesa prompt to <strong>{phone}</strong>. Enter your PIN to complete the order.
          </p>
          <div className="mt-4 flex justify-center">
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
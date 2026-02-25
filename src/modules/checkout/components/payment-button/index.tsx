"use client"

// 1. IMPORT YOUR MPESA HELPER HERE
import { isManual, isStripeLike, isMpesa } from "@lib/constants"
import { placeOrder } from "@lib/data/cart"
import { HttpTypes } from "@medusajs/types"
import { Button, Input } from "@medusajs/ui"
import { useElements, useStripe } from "@stripe/react-stripe-js"
import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import ErrorMessage from "../error-message"

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
    // 2. USE THE HELPER FUNCTION HERE
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

// ... [Keep StripePaymentButton and ManualTestPaymentButton exactly as they are] ...

const StripePaymentButton = ({ cart, notReady, "data-testid": dataTestId }: any) => {
  // Keeping this brief to highlight the M-Pesa changes. Keep your existing Stripe code here!
  return <Button disabled>Place order</Button>
}

const ManualTestPaymentButton = ({ notReady }: any) => {
  // Keep your existing Manual code here!
  return <Button disabled>Place order</Button>
}

// 3. UPDATED MPESA PAYMENT BUTTON
const MpesaPaymentButton = ({
  cart,
  notReady,
  "data-testid": dataTestId,
}: {
  cart: HttpTypes.StoreCart
  notReady: boolean
  "data-testid"?: string
}) => {
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
          // ADD THIS HEADER - It is mandatory for Medusa V2
          "x-publishable-api-key": process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY || "" 
        },
        body: JSON.stringify({
          phone: phone, 
          amount: cart.total, 
          cart_id: cart.id
        })
      })
      
      // Check if response is empty or unauthorized before calling .json()
      if (!response.ok) {
        const errorText = await response.text()
        console.error("Server Error:", errorText)
        throw new Error(`Error: ${response.status} - Please check backend logs.`)
      }

      const data = await response.json()
      
      if (data.success) {
        setIsWaitingForPin(true)
      } else {
        setErrorMessage(data.message || "Failed to initiate STK push.")
      }
    } catch (err: any) {
      console.error("Mpesa Error:", err)
      setErrorMessage(err.message || "Failed to connect to the server.")
    } finally {
      setSubmitting(false)
    }
  }
  // Poll the Medusa backend to see if the Daraja webhook has completed the cart
  useEffect(() => {
    let pollingInterval: NodeJS.Timeout

    if (isWaitingForPin) {
      pollingInterval = setInterval(async () => {
        try {
          // Poll the Medusa backend directly to check the cart status
          const res = await fetch(`${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/carts/${cart.id}`)
          if (res.ok) {
            const data = await res.json()
            // If the webhook completes the order, the cart will have a completed_at timestamp
            if (data.cart?.completed_at) {
              // Webhook was successful! Route to order confirmation page.
              router.push(`/order/confirmed/${cart.id}`) // Adjust this route to match your storefront's success page
            }
          }
        } catch (error) {
          console.error("Polling error:", error)
        }
      }, 3000)
    }

    return () => clearInterval(pollingInterval)
  }, [isWaitingForPin, cart.id, router])

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

export default PaymentButton
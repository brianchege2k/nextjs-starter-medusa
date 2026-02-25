"use client"

import { useState } from "react"
import { Button, Input } from "@medusajs/ui"

// 1. Define the types for your component props
interface MpesaPaymentProps {
  cartId: string;
  amount: number;
}

// 2. Apply the interface to the destructured props
export default function MpesaPayment({ cartId, amount }: MpesaPaymentProps) {
  const [phone, setPhone] = useState("")
  const [loading, setLoading] = useState(false)

  const handleStkPush = async () => {
    setLoading(true)
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/store/mpesa/stk-push`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: phone, // e.g., 254700000000
          amount: amount, 
          cart_id: cartId
        })
      })
      
      const data = await response.json()
      if (data.success) {
        alert("Check your phone! Please enter your M-Pesa PIN.")
        // You would typically start polling the backend here to check if the webhook completed
      }
    } catch (error) {
      console.error("STK Push Failed", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-4 p-4 border rounded-lg">
      <h3 className="font-semibold">Pay with M-Pesa</h3>
      <Input 
        type="text" 
        placeholder="2547XXXXXXXX" 
        value={phone} 
        onChange={(e) => setPhone(e.target.value)} 
      />
      <Button onClick={handleStkPush} isLoading={loading}>
        Send STK Push
      </Button>
    </div>
  )
}
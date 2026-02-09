import { getBaseURL } from "@lib/util/env"
import type { Metadata } from "next"
import { DM_Sans } from "next/font/google"
import { SpeedInsights } from "@vercel/speed-insights/next"

import "styles/globals.css"

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-dm-sans",
  display: "swap",
})

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
}

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="en" data-mode="light" className={dmSans.variable}>
      <body className="min-h-screen font-sans antialiased">
        <main className="relative min-h-screen">{props.children}</main>
        <SpeedInsights />
      </body>
    </html>
  )
}

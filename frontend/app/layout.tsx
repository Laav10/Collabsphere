import type React from "react"
import "@/app/globals.css"
import { Inter } from "next/font/google"
import { cn } from "@/lib/utils"
import { UserProvider } from "@/lib/usercontext"
import RippleBgLoader from "@/components/ripple-bg-loader"

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={cn(inter.className, "min-h-screen bg-[#09090b] relative")}>
        <UserProvider>
          {/* Full-page clickable ripple grid — sits behind all content */}
          <RippleBgLoader />
          {/* Page content sits above the grid */}
          <div className="relative z-10">
            {children}
          </div>
        </UserProvider>
      </body>
    </html>
  )
}


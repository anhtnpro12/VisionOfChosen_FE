import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { ToggleThemeButton } from "@/components/toggle-theme-button"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Terraform Destroy Drift",
  description: "AI-powered Terraform drift detection and analysis",
  generator: 'v0.dev',
  icons: {
    icon: "/logo-transparent.png"
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
         <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {/* Nút đổi theme */}
          <div className="fixed top-4 right-4 z-50">
            <ToggleThemeButton />
          </div>

          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
